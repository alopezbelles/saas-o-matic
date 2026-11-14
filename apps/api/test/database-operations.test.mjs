import assert from 'node:assert/strict';
import test from 'node:test';
import path from 'node:path';
import {
  readFileSync,
  writeFileSync,
  symlinkSync,
  linkSync,
  unlinkSync,
  existsSync,
} from 'node:fs';
import { randomUUID } from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import Database from 'better-sqlite3';
import { fixture, customer, simulation, testArea } from './db-fixtures.mjs';
import {
  insertCustomer,
  insertSimulation,
  listSimulations,
} from '../dist/db/persistence.js';
import { seedDemo, demoCustomers } from '../dist/db/seed.js';
import {
  migrateDatabase,
  applyMigrations,
  loadMigrations,
} from '../dist/db/migrate.js';
import { openDatabase, withNewDatabase } from '../dist/db/connection.js';
import {
  resolveDatabasePath,
  defaultDatabasePath,
  projectRoot,
} from '../dist/db/paths.js';
import { backupDatabase } from '../dist/db/backup.js';

test('IT-SEED-01: seed idempotente conserva filas ajenas, cero simulaciones y conflictos revierten todo', (t) => {
  const f = fixture(t, 'demo');
  try {
    const foreign = insertCustomer(f.db, customer());
    seedDemo(f.db);
    const before = f.db.prepare('SELECT * FROM customers ORDER BY id').all();
    seedDemo(f.db);
    assert.deepEqual(
      f.db.prepare('SELECT * FROM customers ORDER BY id').all(),
      before,
    );
    assert.equal(before.length, 3);
    assert.equal(f.db.prepare('SELECT count(*) n FROM simulations').get().n, 0);
    assert.equal(
      before.some((row) => row.id === foreign.id),
      true,
    );
    f.db
      .prepare('UPDATE customers SET company_name=? WHERE id=?')
      .run('Conflicting fixture', demoCustomers[0].id);
    assert.throws(() => seedDemo(f.db), /DB_SEED_CONFLICT/);
  } finally {
    f.close();
  }

  const conflict = fixture(t, 'demo');
  try {
    // The second fixture conflicts: the first must roll back as well.
    insertCustomer(
      conflict.db,
      customer({ taxIdOriginal: demoCustomers[1].taxIdOriginal }),
    );
    assert.throws(() => seedDemo(conflict.db), /UNIQUE/);
    assert.equal(
      conflict.db.prepare('SELECT count(*) n FROM customers').get().n,
      1,
    );
    assert.equal(
      conflict.db
        .prepare('SELECT * FROM customers WHERE id=?')
        .get(demoCustomers[0].id),
      undefined,
    );
  } finally {
    conflict.close();
  }
});

test('IT-SEED-01: rechaza bases no demo y demo:init sobre archivo existente', (t) => {
  const f = fixture(t);
  try {
    assert.throws(() => seedDemo(f.db), /DB_OWNER_MISMATCH/);
    f.close();
    const before = readFileSync(f.options.path);
    assert.throws(() => migrateDatabase(f.options, true), /DB_ALREADY_EXISTS/);
    assert.deepEqual(readFileSync(f.options.path), before);
  } finally {
    f.close();
  }
});

test('IT-SAFETY-01: rutas inseguras, hardlinks, alias y centinelas no se abren', (t) => {
  const context = testArea(t);
  const sentinel = path.join(context.directory, 'foreign.sqlite');
  const bytes = Buffer.from('do not change: private sentinel');
  writeFileSync(sentinel, bytes);
  for (const input of [
    '',
    'file:unsafe.sqlite',
    '../outside.sqlite',
    'apps/web/public/leak.sqlite',
    'apps/api/src/leak.sqlite',
    defaultDatabasePath,
    'apps/api/data/demo.sqlite',
  ])
    assert.throws(() => resolveDatabasePath(input, context), /DB_/);
  assert.throws(() => openDatabase({ path: sentinel, kind: 'test', context }));
  assert.deepEqual(readFileSync(sentinel), bytes);
  // Junctions are available to ordinary Windows users; avoid requiring symlink privilege.
  const alias = path.join(context.directory, 'alias');
  symlinkSync(
    path.join(projectRoot, 'apps/api'),
    alias,
    process.platform === 'win32' ? 'junction' : 'dir',
  );
  assert.throws(
    () => resolveDatabasePath(path.join(alias, 'data/dev.sqlite'), context),
    /DB_/,
  );
  unlinkSync(alias);
  const hardlink = path.join(context.directory, 'hardlink.sqlite');
  linkSync(sentinel, hardlink);
  assert.throws(() => resolveDatabasePath(hardlink, context), /DB_PATH_UNSAFE/);
  unlinkSync(hardlink);
  assert.deepEqual(readFileSync(sentinel), bytes);
  assert.throws(
    () => resolveDatabasePath(sentinel),
    /DB_TEST_CONTEXT_REQUIRED/,
  );
});

test('IT-MIG-01: base ajena y primera migración fallida no dejan cambios', (t) => {
  const context = testArea(t);
  const file = path.join(context.directory, 'unknown.sqlite');
  const db = new Database(file);
  db.exec(
    "CREATE TABLE sentinel(value TEXT) STRICT; INSERT INTO sentinel VALUES ('preserved')",
  );
  db.close();
  const before = readFileSync(file);
  assert.throws(
    () => migrateDatabase({ path: file, kind: 'test', context }),
    /DB_OWNER_MISMATCH/,
  );
  assert.deepEqual(readFileSync(file), before);
  const options = {
    path: path.join(context.directory, 'failed-new.sqlite'),
    kind: 'test',
    context,
  };
  assert.throws(() =>
    withNewDatabase(options, (connection) =>
      applyMigrations(
        connection,
        'test',
        [
          ...loadMigrations(),
          {
            id: '0001_bad',
            hash: 'fixture',
            sql: 'CREATE TABLE partial(value TEXT) STRICT; SELECT * FROM nonexistent;',
          },
        ],
        true,
      ),
    ),
  );
  assert.equal(existsSync(options.path), false);
  migrateDatabase(options);
  const recovered = openDatabase(options);
  try {
    assert.equal(
      recovered
        .prepare("SELECT name FROM sqlite_master WHERE name='partial'")
        .get(),
      undefined,
    );
  } finally {
    recovered.close();
  }
});

test('IT-RECOVERY-01: SQLITE_BUSY finito sin escrituras parciales y posterior recuperación', (t) => {
  const f = fixture(t);
  let competitor;
  try {
    const saved = insertCustomer(f.db, customer());
    competitor = f.connect();
    f.db.exec('BEGIN IMMEDIATE');
    const start = Date.now();
    assert.throws(
      () => insertSimulation(competitor, simulation(saved.id)),
      (error) => error.code === 'SQLITE_BUSY',
    );
    assert.ok(Date.now() - start >= 800);
    assert.ok(Date.now() - start < 5000);
    f.db.exec('ROLLBACK');
    assert.equal(listSimulations(competitor, saved.id).length, 0);
    insertSimulation(competitor, simulation(saved.id));
    assert.equal(listSimulations(competitor, saved.id).length, 1);
  } finally {
    if (f.db.inTransaction) f.db.exec('ROLLBACK');
    f.close();
  }
});

test('IT-BACKUP-01: copia consistente, reapertura, destino existente/origen rechazados', async (t) => {
  const f = fixture(t);
  try {
    const c = insertCustomer(f.db, customer());
    const saved = insertSimulation(f.db, simulation(c.id));
    const before = readFileSync(f.options.path);
    const backup = path.join(f.context.directory, 'restored copy.sqlite');
    await backupDatabase(f.db, backup, f.context);
    assert.deepEqual(readFileSync(f.options.path), before);
    const reopened = openDatabase({
      path: backup,
      kind: 'test',
      context: f.context,
    });
    try {
      assert.equal(reopened.pragma('integrity_check', { simple: true }), 'ok');
      assert.deepEqual(reopened.pragma('foreign_key_check'), []);
      assert.deepEqual(listSimulations(reopened, c.id), [saved]);
    } finally {
      reopened.close();
    }
    const backupBytes = readFileSync(backup);
    await assert.rejects(
      backupDatabase(f.db, backup, f.context),
      /DB_BACKUP_TARGET_EXISTS/,
    );
    await assert.rejects(
      backupDatabase(f.db, f.options.path, f.context),
      /DB_BACKUP_TARGET_EXISTS/,
    );
    assert.deepEqual(readFileSync(backup), backupBytes);
  } finally {
    f.close();
  }
});

test('IT-CONSTRAINT-01: dos conexiones concurrentes solo aceptan una clave fiscal', async (t) => {
  const f = fixture(t);
  try {
    const worker = `
      import Database from 'better-sqlite3';
      const db = new Database(process.argv[1], {timeout:1000});
      try {
        db.prepare("INSERT INTO customers VALUES (?, 'Race', 'RACE', 'RACE', 'Contact', 'same@example.invalid', 'ES', 'DEMO_BASIC', '2026-01-01T00:00:00.000Z')").run(process.argv[2]);
      } catch (error) { process.exitCode = error.code === 'SQLITE_CONSTRAINT_UNIQUE' ? 2 : 3; }
      finally { db.close(); }
    `;
    const run = () =>
      new Promise((resolve, reject) => {
        const child = spawn(
          process.execPath,
          ['--input-type=module', '-e', worker, f.options.path, randomUUID()],
          { stdio: 'pipe' },
        );
        child.on('error', reject);
        child.on('exit', resolve);
      });
    assert.deepEqual((await Promise.all([run(), run()])).sort(), [0, 2]);
    assert.equal(f.db.prepare('SELECT count(*) n FROM customers').get().n, 1);
  } finally {
    f.close();
  }
});

test('IT-SAFETY-01: CLI raíz reenvía argumentos, seed exige autorización demo y errores no filtran PII', (t) => {
  const context = testArea(t);
  const env = {
    ...process.env,
    DATABASE_PATH: path.join(context.directory, 'cli demo.sqlite'),
    DATABASE_KIND: 'demo',
  };
  delete env.NODE_TEST_CONTEXT;
  const cli = path.join(projectRoot, 'apps/api/dist/db/cli.js');
  const run = (args, overrides = {}) =>
    spawnSync(process.execPath, [cli, ...args], {
      env: { ...env, ...overrides },
      encoding: 'utf8',
      timeout: 15000,
    });
  const good = (result) => {
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
  };
  for (const args of [['demo:init'], ['seed'], ['seed']]) good(run(args));
  const before = readFileSync(env.DATABASE_PATH);
  for (const result of [
    run(['demo:init']),
    run(['seed'], { DATABASE_KIND: 'development' }),
    run(['seed'], { DATABASE_PATH: '' }),
    run(['invalid']),
    run(['backup']),
  ]) {
    assert.equal(result.status, 1);
    assert.match(result.stderr, /DB_/);
    assert.doesNotMatch(result.stderr, /example.invalid|DEMO-001|Empresa/);
  }
  assert.deepEqual(readFileSync(env.DATABASE_PATH), before);
  const destination = path.join(context.directory, 'cli backup.sqlite');
  const pnpm = process.env.npm_execpath;
  assert.ok(pnpm, 'Ejecutar mediante pnpm test:integration');
  good(
    spawnSync(process.execPath, [pnpm, 'db:backup', '--out', destination], {
      cwd: projectRoot,
      env,
      encoding: 'utf8',
      timeout: 30000,
    }),
  );
  assert.ok(existsSync(destination));
  // Explicit migration of our temporary, recognized demo is non-destructive.
  good(run(['migrate']));
});
