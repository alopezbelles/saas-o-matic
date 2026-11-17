import assert from 'node:assert/strict';
import test from 'node:test';
import path from 'node:path';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { testArea } from './db-fixtures.mjs';
import { setupDemo } from '../dist/db/demo-setup.js';
import { openDatabase } from '../dist/db/connection.js';
import { simulationService } from '../dist/features/simulations/service.js';
import { validSpanishTaxId } from '../dist/features/customers/domain/tax-id.js';
import { projectRoot } from '../dist/db/paths.js';

test('IT-DEMO-010: demo completa persiste clientes válidos y snapshots calculados, sin sobrescribir', (t) => {
  const context = testArea(t);
  const options = {
    path: path.join(context.directory, 'demo.sqlite'),
    kind: 'demo',
    context,
  };
  const created = setupDemo(options);
  const before = readFileSync(options.path);
  assert.throws(() => setupDemo(options), /DB_ALREADY_EXISTS/);
  assert.deepEqual(readFileSync(options.path), before);
  const db = openDatabase(options);
  try {
    assert.equal(db.prepare('SELECT count(*) n FROM customers').get().n, 3);
    assert.equal(db.prepare('SELECT count(*) n FROM simulations').get().n, 3);
    assert.equal(db.pragma('integrity_check', { simple: true }), 'ok');
    assert.deepEqual(
      created.map(({ simulation }) => simulation.totalCents),
      [16940, 50820, 56870],
    );
    for (const { customer, simulation } of created) {
      assert.equal(validSpanishTaxId(customer.taxId), true);
      assert.match(customer.contactEmail, /@example\.invalid$/);
      assert.equal(simulation.currency, 'EUR');
      assert.equal(simulation.pricingVersion, 'users-tiered-v1');
      assert.equal(simulation.taxPolicyVersion, 'demo-standard-v1');
      assert.equal(
        simulation.customerSnapshot.companyName,
        customer.companyName,
      );
      assert.deepEqual(
        simulationService(() => db).history(customer.id, {
          limit: 20,
          offset: 0,
        }).items,
        [simulation],
      );
    }
  } finally {
    db.close();
  }
});

test('IT-DEMO-010: CLI exige destino explícito demo, conserva archivo ajeno y crea demo nueva', (t) => {
  const context = testArea(t);
  const target = path.join(context.directory, 'cli.sqlite');
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  delete env.DATABASE_PATH;
  delete env.DATABASE_KIND;
  const run = (overrides = {}, args = []) =>
    spawnSync(
      process.execPath,
      [
        path.join(projectRoot, 'apps/api/dist/db/cli.js'),
        'demo:setup',
        ...args,
      ],
      {
        cwd: context.directory,
        env: { ...env, ...overrides },
        encoding: 'utf8',
        timeout: 15000,
      },
    );
  assert.match(run().stderr, /DB_DEMO_REQUIRED/);
  assert.match(run({ DATABASE_KIND: 'demo' }).stderr, /DB_DEMO_REQUIRED/);
  const vars = { DATABASE_KIND: 'demo', DATABASE_PATH: target };
  assert.match(run(vars, ['unexpected']).stderr, /DB_ARGUMENT_INVALID/);
  assert.equal(existsSync(target), false);
  writeFileSync(target, 'foreign file');
  assert.match(run(vars).stderr, /DB_ALREADY_EXISTS/);
  assert.equal(readFileSync(target, 'utf8'), 'foreign file');
  const result = run({
    ...vars,
    DATABASE_PATH: path.join(context.directory, 'new.sqlite'),
  });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  const db = openDatabase({
    path: path.join(context.directory, 'new.sqlite'),
    kind: 'demo',
    context,
  });
  try {
    assert.equal(db.prepare('SELECT count(*) n FROM simulations').get().n, 3);
  } finally {
    db.close();
  }
});

test('IT-DEMO-010: rechaza tipo y rutas fuera del contexto sin crear archivos', (t) => {
  const context = testArea(t);
  const target = path.join(context.directory, 'invalid.sqlite');
  assert.throws(
    () => setupDemo({ path: target, kind: 'development', context }),
    /DB_DEMO_REQUIRED/,
  );
  assert.throws(
    () => setupDemo({ path: 'apps/web/demo.sqlite', kind: 'demo', context }),
    /DB_PATH_UNSAFE/,
  );
  assert.equal(existsSync(target), false);
});
