import assert from 'node:assert/strict';
import test from 'node:test';
import { once } from 'node:events';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { createApp } from '../dist/app.js';
import { fixture, testArea, customer, simulation } from './db-fixtures.mjs';
import { databaseProvider } from '../dist/db/provider.js';
import {
  migrateDatabase,
  loadMigrations,
  applyMigrations,
} from '../dist/db/migrate.js';
import { withNewDatabase, openDatabase } from '../dist/db/connection.js';
import {
  insertCustomer,
  insertSimulation,
  listSimulations,
} from '../dist/db/persistence.js';
import { seedDemo } from '../dist/db/seed.js';
import { databaseError } from '../dist/http/errors.js';

const body = (patch = {}) => ({
  companyName: 'Empresa Prueba',
  taxId: '12345678Z',
  contactEmail: 'a@example.invalid',
  countryCode: 'ES',
  planCode: 'DEMO_BASIC',
  ...patch,
});
async function serve(app, action) {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    return await action('http://127.0.0.1:' + server.address().port);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
      server.closeAllConnections();
    });
  }
}
async function api(t, action) {
  const f = fixture(t);
  const logs = [];
  try {
    await serve(
      createApp({
        connection: () => f.db,
        logger: (entry) => logs.push(entry),
      }),
      (base) => action({ base, f, logs }),
    );
  } finally {
    f.close();
  }
}
const post = (base, value, extra = {}) =>
  fetch(base + '/customers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(value),
    ...extra,
  });

test('IT-CUS-01: cinco campos, DTO, Location, normalización y detalle', async (t) => {
  await api(t, async ({ base, f }) => {
    const response = await post(
      base,
      body({
        companyName: ' Cafe\u0301 ',
        taxId: ' 00000008p ',
        countryCode: ' es ',
      }),
    );
    assert.equal(response.status, 201);
    const dto = await response.json();
    assert.equal(response.headers.get('location'), '/customers/' + dto.id);
    assert.deepEqual(
      Object.keys(dto).sort(),
      [
        'id',
        'companyName',
        'taxId',
        'taxIdNormalized',
        'contactEmail',
        'countryCode',
        'planCode',
        'createdAt',
      ].sort(),
    );
    assert.equal(dto.companyName, 'Café');
    assert.equal(dto.taxId, '00000008p');
    assert.equal(dto.taxIdNormalized, '00000008P');
    assert.equal(
      f.db.prepare('SELECT contact_name FROM customers WHERE id=?').get(dto.id)
        .contact_name,
      null,
    );
    assert.deepEqual(
      await (await fetch(base + '/customers/' + dto.id)).json(),
      dto,
    );
    assert.equal(
      (await fetch(base + '/customers/' + randomUUID())).status,
      404,
    );
    assert.equal((await fetch(base + '/customers/bad')).status, 400);
    assert.equal(
      (
        await post(
          base,
          body({ taxId: 'X1234567L', contactEmail: dto.contactEmail }),
        )
      ).status,
      201,
    );
  });
});

test('IT-INVALID-01/HTTP-01: errores antes de abrir DB, protocolo y requestId', async () => {
  let opens = 0;
  const logs = [];
  await serve(
    createApp({
      connection: () => {
        opens++;
        throw Error('must not open');
      },
      logger: (entry) => logs.push(entry),
    }),
    async (base) => {
      for (const [value, code] of [
        [body({ taxId: '12345678A' }), 'TAX_ID_INVALID'],
        [body({ taxId: '１２３４５６７８Z' }), 'TAX_ID_INVALID'],
        [body({ contactEmail: 'bad' }), 'VALIDATION_ERROR'],
        [body({ planCode: 'bad' }), 'VALIDATION_ERROR'],
        [body({ contactName: 'extra' }), 'VALIDATION_ERROR'],
        [null, 'VALIDATION_ERROR'],
      ]) {
        const response = await post(base, value, {
          headers: {
            'Content-Type': 'application/json',
            'X-Request-Id': 'external',
          },
        });
        assert.equal(response.status, 422);
        const error = (await response.json()).error;
        assert.equal(error.code, code);
        assert.ok(error.fields);
        assert.equal(response.headers.get('x-request-id'), error.requestId);
        assert.notEqual(error.requestId, 'external');
        assert.doesNotMatch(JSON.stringify(error), /12345678A|１２３４/);
      }
      for (const [payload, type, status, code] of [
        ['{', 'application/json', 400, 'INVALID_JSON'],
        ['x', 'text/plain', 415, 'UNSUPPORTED_MEDIA_TYPE'],
        [
          '"' + 'x'.repeat(33000) + '"',
          'application/json',
          413,
          'PAYLOAD_TOO_LARGE',
        ],
      ]) {
        const response = await fetch(base + '/customers', {
          method: 'POST',
          headers: { 'Content-Type': type },
          body: payload,
        });
        assert.equal(response.status, status);
        assert.equal((await response.json()).error.code, code);
      }
      assert.equal(opens, 0);
    },
  );
  assert.doesNotMatch(
    JSON.stringify(logs),
    /taxId|contactEmail|example.invalid|12345678/,
  );
});

test('IT-DUP-01: carrera 201/409 y unicidad por país', async (t) => {
  await api(t, async ({ base, f }) => {
    const responses = await Promise.all([
      post(base, body()),
      post(base, body({ taxId: ' 12345678z ' })),
    ]);
    assert.deepEqual(responses.map((r) => r.status).sort(), [201, 409]);
    assert.equal(f.db.prepare('SELECT count(*) n FROM customers').get().n, 1);
    assert.equal(
      (await responses.find((r) => r.status === 409).json()).error.code,
      'CUSTOMER_TAX_ID_CONFLICT',
    );
    for (const countryCode of ['FR', 'GB'])
      assert.equal(
        (await post(base, body({ countryCode, taxId: 'FOREIGN-001' }))).status,
        201,
      );
  });
  assert.throws(
    () =>
      databaseError({
        code: 'SQLITE_CONSTRAINT_UNIQUE',
        message: 'UNIQUE constraint failed: customers.id',
      }),
    (error) => error.status !== 409,
  );
});

test('IT-CUS-03: búsqueda literal, orden, páginas, filtros y parámetros', async (t) => {
  await api(t, async ({ base, f }) => {
    const records = [
      customer({ companyName: 'Alpha 100%_!', taxIdOriginal: 'SEARCH1' }),
      customer({ companyName: 'alpha Other', taxIdOriginal: 'SEARCH2' }),
      customer({ companyName: 'École', taxIdOriginal: 'SEARCH3' }),
    ];
    records.forEach((row) => insertCustomer(f.db, row));
    const list = async (query) => {
      const r = await fetch(base + '/customers' + query);
      assert.equal(r.status, 200);
      return r.json();
    };
    const ordered = [...records].sort((a, b) => b.id.localeCompare(a.id));
    const first = await list('?limit=1');
    assert.equal(first.total, 3);
    assert.equal(first.items[0].id, ordered[0].id);
    assert.equal((await list('?limit=1&offset=1')).items[0].id, ordered[1].id);
    const beyond = await list('?offset=100');
    assert.equal(beyond.total, 3);
    assert.deepEqual(beyond.items, []);
    assert.equal((await list('?q=ALPHA')).total, 2);
    assert.equal((await list('?q=search2')).total, 1);
    for (const q of ['%', '_', '!'])
      assert.equal((await list('?q=' + encodeURIComponent(q))).total, 1);
    for (const q of ["' OR 1=1--", 'test@example.invalid', 'ecole'])
      assert.equal((await list('?q=' + encodeURIComponent(q))).total, 0);
    for (const q of [
      'limit=0',
      'limit=2&limit=3',
      'offset=-1',
      'q[x]=a',
      'email=x',
    ])
      assert.equal((await fetch(base + '/customers?' + q)).status, 400);
  });
});

test('IT-LIFECYCLE-01/PRIVACY-01: DB ausente/reintento, health, busy y errores sanitizados', async (t) => {
  const logs = [];
  const listeners = process.listenerCount('SIGTERM');
  const app = createApp({ logger: (entry) => logs.push(entry) });
  assert.equal(process.listenerCount('SIGTERM'), listeners);
  await serve(app, async (base) => {
    assert.equal((await fetch(base + '/health')).status, 200);
    assert.equal((await fetch(base + '/customers')).status, 503);
    assert.equal((await post(base, body())).status, 503);
    const missing = await fetch(base + '/missing');
    assert.equal(missing.status, 404);
    assert.equal((await missing.json()).error.code, 'ROUTE_NOT_FOUND');
  });
  const context = testArea(t);
  const options = {
    path: path.join(context.directory, 'late.sqlite'),
    kind: 'test',
    context,
  };
  const provider = databaseProvider(options);
  try {
    await serve(
      createApp({
        connection: () => provider.get(),
        logger: (entry) => logs.push(entry),
      }),
      async (base) => {
        assert.equal((await fetch(base + '/customers')).status, 503);
        assert.equal(existsSync(options.path), false);
        migrateDatabase(options);
        assert.equal((await post(base, body())).status, 201);
        const lock = openDatabase(options);
        try {
          lock.exec('BEGIN IMMEDIATE');
          const response = await post(base, body({ taxId: 'X1234567L' }));
          assert.equal(response.status, 503);
          assert.equal((await response.json()).error.code, 'DATABASE_BUSY');
        } finally {
          if (lock.inTransaction) lock.exec('ROLLBACK');
          lock.close();
        }
      },
    );
    assert.equal(provider.get().open, true);
  } finally {
    provider.close();
  }
  await serve(
    createApp({
      connection: () => {
        throw Error('private taxId a@example.invalid SELECT secret');
      },
      logger: (entry) => logs.push(entry),
    }),
    async (base) => {
      const response = await post(base, body(), {
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      });
      assert.equal(response.status, 500);
      assert.equal((await response.json()).error.code, 'INTERNAL_ERROR');
    },
  );
  assert.doesNotMatch(
    JSON.stringify(logs),
    /SELECT|secret|taxId|example.invalid|12345678|customers/,
  );
});

test('IT-CUS-01: seed anterior sigue legible', async (t) => {
  const f = fixture(t, 'demo');
  try {
    seedDemo(f.db);
    await serve(
      createApp({ connection: () => f.db, logger: () => {} }),
      async (base) => {
        const page = await (await fetch(base + '/customers')).json();
        assert.equal(page.total, 2);
        assert.ok(page.items.every((c) => c.taxId.startsWith('DEMO-')));
      },
    );
  } finally {
    f.close();
  }
});

test('IT-MIG-003: migrar conserva clientes referenciados, contacto e histórico', (t) => {
  const context = testArea(t);
  const options = {
    path: path.join(context.directory, 'upgrade.sqlite'),
    kind: 'test',
    context,
  };
  withNewDatabase(options, (db) =>
    applyMigrations(db, 'test', loadMigrations().slice(0, 1), true),
  );
  let db = openDatabase(options);
  const c = insertCustomer(db, customer({ contactName: 'Existing contact' }));
  const saved = insertSimulation(db, simulation(c.id));
  db.close();
  const oldProvider = databaseProvider(options);
  assert.throws(
    () => oldProvider.get(),
    (error) => error.status === 503,
  );
  oldProvider.close();
  migrateDatabase(options);
  db = openDatabase(options);
  try {
    assert.equal(
      db.prepare('SELECT contact_name FROM customers WHERE id=?').get(c.id)
        .contact_name,
      'Existing contact',
    );
    assert.deepEqual(listSimulations(db, c.id), [saved]);
    assert.deepEqual(db.pragma('foreign_key_check'), []);
    assert.equal(db.pragma('foreign_keys', { simple: true }), 1);
    const withoutContact = customer({ taxIdOriginal: 'DIFFERENT' });
    delete withoutContact.contactName;
    assert.equal(insertCustomer(db, withoutContact).contactName, null);
    assert.throws(
      () => db.prepare('DELETE FROM customers WHERE id=?').run(c.id),
      /FOREIGN KEY/,
    );
    assert.throws(
      () =>
        applyMigrations(db, 'test', [
          ...loadMigrations(),
          {
            id: '0002_invalid_graph',
            hash: 'fixture',
            sql: "PRAGMA defer_foreign_keys=ON; CREATE TABLE broken_graph(ref TEXT REFERENCES customers(id)) STRICT; INSERT INTO broken_graph VALUES ('missing');",
          },
        ]),
      /DB_INTEGRITY_FAILED/,
    );
    assert.equal(
      db
        .prepare("SELECT name FROM sqlite_master WHERE name='broken_graph'")
        .get(),
      undefined,
    );
  } finally {
    db.close();
  }
});
