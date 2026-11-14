import assert from 'node:assert/strict';
import test from 'node:test';
import { randomUUID, createHash } from 'node:crypto';
import { CONSUMPTION_LIMITS, PLAN_CODES } from '@saas-o-matic/shared';
import {
  applyMigrations,
  loadMigrations,
  migrateDatabase,
} from '../dist/db/migrate.js';
import {
  getCustomer,
  insertCustomer,
  insertSimulation,
  listSimulations,
} from '../dist/db/persistence.js';
import {
  fixture,
  customer,
  simulation,
  insertRaw,
  rawCustomer,
  rawSimulation,
} from './db-fixtures.mjs';

function setup(t) {
  const f = fixture(t);
  // Register disposal with the test body using try/finally (before area cleanup).
  return f;
}

test('IT-DB-01: esquema STRICT, FK por conexión, reconexión y migración idempotente', (t) => {
  const f = setup(t);
  try {
    const db = f.db;
    assert.equal(db.pragma('foreign_keys', { simple: true }), 1);
    for (const name of [
      'customers',
      'simulations',
      'app_metadata',
      '__app_migrations',
    ])
      assert.equal(
        db
          .prepare('SELECT strict FROM pragma_table_list WHERE name=?')
          .get(name).strict,
        1,
      );
    assert.equal(
      db
        .prepare("SELECT count(*) n FROM sqlite_master WHERE type='trigger'")
        .get().n,
      2,
    );
    const saved = insertCustomer(db, customer());
    insertSimulation(db, simulation(saved.id));
    const before = db.prepare('SELECT * FROM __app_migrations').all();
    f.close();
    migrateDatabase(f.options);
    const reopened = f.connect();
    assert.equal(reopened.pragma('foreign_keys', { simple: true }), 1);
    assert.deepEqual(getCustomer(reopened, saved.id), saved);
    assert.equal(listSimulations(reopened, saved.id).length, 1);
    assert.deepEqual(
      reopened.prepare('SELECT * FROM __app_migrations').all(),
      before,
    );
  } finally {
    f.close();
  }
});

test('IT-MIG-01: deriva detectada y rollback de DDL, datos e historial', (t) => {
  const f = setup(t);
  try {
    const original = loadMigrations();
    const sql =
      "CREATE TABLE interrupted(value TEXT) STRICT; INSERT INTO interrupted VALUES ('fixture'); SELECT * FROM missing_table;";
    const invalid = {
      id: '0001_failure',
      sql,
      hash: createHash('sha256').update(sql).digest('hex'),
    };
    const before = f.db.prepare('SELECT * FROM __app_migrations').all();
    assert.throws(() => applyMigrations(f.db, 'test', [...original, invalid]));
    assert.equal(
      f.db
        .prepare("SELECT name FROM sqlite_master WHERE name='interrupted'")
        .get(),
      undefined,
    );
    assert.deepEqual(
      f.db.prepare('SELECT * FROM __app_migrations').all(),
      before,
    );
    assert.throws(
      () =>
        applyMigrations(f.db, 'test', [{ ...original[0], hash: 'changed' }]),
      /DB_MIGRATION_DRIFT/,
    );
    const goodSql =
      "CREATE TABLE recovered(value TEXT) STRICT; INSERT INTO recovered VALUES ('fixture');";
    applyMigrations(f.db, 'test', [
      ...original,
      {
        id: '0001_recovered',
        sql: goodSql,
        hash: createHash('sha256').update(goodSql).digest('hex'),
      },
    ]);
    assert.equal(
      f.db.prepare('SELECT value FROM recovered').get().value,
      'fixture',
    );
  } finally {
    f.close();
  }
});

test('IT-CONSTRAINT-01: UNIQUE por país, no por nombre/email, normalización sin perder ceros', (t) => {
  const f = setup(t);
  try {
    const first = insertCustomer(f.db, customer());
    assert.equal(first.taxIdNormalized, '000TEST');
    assert.equal(first.taxIdOriginal, '000test');
    assert.throws(() => insertCustomer(f.db, customer()), /UNIQUE/);
    insertCustomer(f.db, customer({ countryCode: 'FR' }));
    for (const planCode of PLAN_CODES)
      insertCustomer(f.db, customer({ taxIdOriginal: randomUUID(), planCode }));
    assert.equal(f.db.prepare('SELECT count(*) n FROM customers').get().n, 4);
    assert.throws(() => insertCustomer(f.db, customer({ id: 'bad' })), /UUID/);
    assert.throws(
      () =>
        insertCustomer(
          f.db,
          customer({ createdAt: '2026-02-30T00:00:00.000Z' }),
        ),
      /DATE/,
    );
  } finally {
    f.close();
  }
});

test('IT-CONSTRAINT-01: SQL directo rechaza FK, null, texto vacío, planes y fechas mal formadas', (t) => {
  const f = setup(t);
  try {
    const row = rawCustomer();
    insertRaw(f.db, 'customers', row);
    for (const patch of [
      { company_name: '' },
      { company_name: null },
      { company_name: ' spaced ' },
      { company_name: 'x'.repeat(201) },
      { plan_code: 'UNKNOWN' },
      { country_code: 'esp' },
      { created_at: 'yesterday' },
    ])
      assert.throws(() =>
        insertRaw(f.db, 'customers', {
          ...row,
          id: randomUUID(),
          tax_id_normalized: randomUUID(),
          ...patch,
        }),
      );
    assert.throws(
      () => insertRaw(f.db, 'simulations', rawSimulation(randomUUID())),
      /FOREIGN KEY/,
    );
    for (const planCode of PLAN_CODES)
      insertRaw(
        f.db,
        'simulations',
        rawSimulation(row.id, { plan_code_snapshot: planCode }),
      );
  } finally {
    f.close();
  }
});

test('IT-CONSTRAINT-01: CHECK y STRICT coinciden con los límites compartidos', (t) => {
  const f = setup(t);
  try {
    const c = insertCustomer(f.db, customer());
    const columns = {
      users: 'users',
      storageGb: 'storage_gb',
      apiCalls: 'api_calls',
    };
    for (const [property, maximum] of Object.entries(CONSUMPTION_LIMITS)) {
      const column = columns[property];
      for (const value of [-1, maximum + 1, 0.5, 'invalid'])
        assert.throws(() =>
          insertRaw(
            f.db,
            'simulations',
            rawSimulation(c.id, { [column]: value }),
          ),
        );
      for (const value of [0, maximum])
        insertRaw(
          f.db,
          'simulations',
          rawSimulation(c.id, { [column]: value }),
        );
    }
    for (const column of ['base_cents', 'tax_cents', 'total_cents'])
      for (const value of [-1, 0.5, 9007199254740992])
        assert.throws(() =>
          insertRaw(
            f.db,
            'simulations',
            rawSimulation(c.id, { [column]: value }),
          ),
        );
    for (const patch of [
      { total_cents: 999 },
      { currency: 'USD' },
      { breakdown_json: '{}' },
      { breakdown_json: 'not JSON' },
      { tax_rate_bps: 10001 },
      { tax_rate_bps: -1 },
    ])
      assert.throws(() =>
        insertRaw(f.db, 'simulations', rawSimulation(c.id, patch)),
      );
    insertRaw(
      f.db,
      'simulations',
      rawSimulation(c.id, {
        base_cents: Number.MAX_SAFE_INTEGER,
        tax_cents: 0,
        total_cents: Number.MAX_SAFE_INTEGER,
      }),
    );
  } finally {
    f.close();
  }
});

test('IT-SNAPSHOT-01: round-trip exacto, snapshots autoritativos e histórico inmutable', (t) => {
  const f = setup(t);
  try {
    const c = insertCustomer(f.db, customer());
    const payload = simulation(c.id, { customerNameSnapshot: 'forged' });
    const saved = insertSimulation(f.db, payload);
    assert.equal(saved.customerNameSnapshot, c.companyName);
    assert.equal(saved.taxIdSnapshot, c.taxIdNormalized);
    assert.deepEqual(JSON.parse(saved.breakdownJson), payload.breakdown);
    assert.equal(saved.totalCents, 130);
    f.db
      .prepare(
        "UPDATE customers SET company_name='Changed', country_code='FR', plan_code='DEMO_PRO' WHERE id=?",
      )
      .run(c.id);
    assert.deepEqual(listSimulations(f.db, c.id), [saved]);
    for (const sql of [
      'UPDATE simulations SET total_cents=total_cents',
      'DELETE FROM simulations',
    ])
      assert.throws(() => f.db.exec(sql), /SIMULATION_IMMUTABLE/);
    assert.throws(
      () => f.db.prepare('DELETE FROM customers WHERE id=?').run(c.id),
      /FOREIGN KEY/,
    );
    assert.throws(
      () =>
        f.db
          .prepare('UPDATE customers SET id=? WHERE id=?')
          .run(randomUUID(), c.id),
      /FOREIGN KEY/,
    );
    insertSimulation(
      f.db,
      simulation(c.id, {
        users: 0,
        baseCents: 0,
        taxCents: 0,
        totalCents: 0,
        taxRateBps: 0,
        breakdown: [],
      }),
    );
    insertSimulation(
      f.db,
      simulation(c.id, {
        baseCents: Number.MAX_SAFE_INTEGER,
        taxCents: 0,
        totalCents: Number.MAX_SAFE_INTEGER,
        breakdown: [
          {
            tierFrom: 1,
            tierTo: null,
            quantity: 1,
            unitPriceCents: Number.MAX_SAFE_INTEGER,
            subtotalCents: Number.MAX_SAFE_INTEGER,
          },
        ],
      }),
    );
  } finally {
    f.close();
  }
});

test('IT-SNAPSHOT-01: estructura, sumas, productos y overflow rechazados en persistencia', (t) => {
  const f = setup(t);
  try {
    const c = insertCustomer(f.db, customer());
    const line = simulation(c.id).breakdown[0];
    for (const breakdown of [
      null,
      {},
      [{}],
      [{ ...line, extra: 1 }],
      [{ ...line, quantity: 0 }],
      [{ ...line, quantity: 2 }],
      [{ ...line, tierFrom: 0 }],
      [{ ...line, tierFrom: 2, tierTo: 1 }],
      [{ ...line, unitPriceCents: Number.MAX_SAFE_INTEGER + 1 }],
      [{ ...line, subtotalCents: 124 }],
    ])
      assert.throws(() =>
        insertSimulation(f.db, simulation(c.id, { breakdown })),
      );
    assert.throws(
      () => insertSimulation(f.db, simulation(c.id, { users: 0 })),
      /BREAKDOWN/,
    );
    assert.throws(
      () => insertSimulation(f.db, simulation(c.id, { totalCents: 131 })),
      /TOTAL/,
    );
    assert.throws(
      () => insertSimulation(f.db, simulation(randomUUID())),
      /CUSTOMER_MISSING/,
    );
    assert.equal(listSimulations(f.db, c.id).length, 0);
  } finally {
    f.close();
  }
});
