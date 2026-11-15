import assert from 'node:assert/strict';
import test from 'node:test';
import { once } from 'node:events';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { createApp } from '../dist/app.js';
import { fixture, customer, testArea } from './db-fixtures.mjs';
import { insertCustomer, listSimulations } from '../dist/db/persistence.js';
import { toSimulationDto } from '../dist/features/simulations/repository.js';
import { databaseProvider } from '../dist/db/provider.js';
import { migrateDatabase } from '../dist/db/migrate.js';

async function serve(app, run) {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    await run('http://127.0.0.1:' + server.address().port);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
      server.closeAllConnections();
    });
  }
}
async function api(t, run, options = {}) {
  const f = fixture(t);
  const logs = [];
  try {
    await serve(
      createApp({
        connection: () => f.db,
        logger: (entry) => logs.push(entry),
        ...options,
      }),
      (base) => run({ f, base, logs }),
    );
  } finally {
    f.close();
  }
}
const body = (customerId, patch = {}) => ({
  customerId,
  users: 15,
  storageGb: 12,
  apiCalls: 345,
  ...patch,
});
const post = (base, value, options = {}) =>
  fetch(base + '/simulations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(value),
    ...options,
  });
async function errorResponse(response, status, code) {
  assert.equal(response.status, status);
  const result = await response.json();
  assert.equal(result.error.code, code);
  assert.equal(result.error.requestId, response.headers.get('X-Request-Id'));
  assert.match(result.error.requestId, /^[0-9a-f-]{36}$/);
  assert.equal(typeof result.error.message, 'string');
  assert.equal(Object.hasOwn(result.error, 'stack'), false);
  return result;
}

test('IT-SIM-01: POST returns committed DTO for ES 15/51 and deliberate repeat saves', async (t) => {
  await api(t, async ({ f, base }) => {
    const client = insertCustomer(f.db, customer());
    const ids = new Set();
    for (const [users, baseCents, taxCents, totalCents] of [
      [15, 14000, 2940, 16940],
      [51, 42500, 8925, 51425],
      [15, 14000, 2940, 16940],
    ]) {
      const response = await post(base, body(client.id, { users }));
      assert.equal(response.status, 201);
      assert.equal(response.headers.get('location'), null);
      assert.equal(response.headers.get('x-powered-by'), null);
      const dto = await response.json();
      assert.deepEqual(
        [dto.baseCents, dto.taxCents, dto.totalCents],
        [baseCents, taxCents, totalCents],
      );
      assert.equal(dto.storageGb, 12);
      assert.equal(dto.apiCalls, 345);
      assert.equal(dto.taxRateBps, 2100);
      assert.equal(dto.customerSnapshot.countryCode, 'ES');
      assert.equal(dto.pricingVersion, 'users-tiered-v1');
      assert.equal(dto.taxPolicyVersion, 'demo-standard-v1');
      const saved = listSimulations(f.db, client.id).find(
        (row) => row.id === dto.id,
      );
      assert.deepEqual(toSimulationDto(saved), dto);
      assert.equal(f.db.inTransaction, false);
      ids.add(dto.id);
    }
    assert.equal(ids.size, 3);
    assert.equal((await fetch(base + '/billing-config')).status, 404);
    assert.equal(
      (await fetch(base + '/customers/' + client.id + '/simulations')).status,
      404,
    );
  });
});

test('IT-INVALID-005: invalid body/protocol/UUID reject before connection is requested', async () => {
  let calls = 0;
  const app = createApp({
    connection: () => {
      calls++;
      throw new Error('must-not-open');
    },
    logger: () => {},
  });
  await serve(app, async (base) => {
    const valid = body(randomUUID());
    for (const value of [
      null,
      [],
      'invalid',
      {},
      { ...valid, users: '15' },
      { ...valid, storageGb: -1 },
      { ...valid, apiCalls: 10000001 },
    ]) {
      await errorResponse(await post(base, value), 422, 'VALIDATION_ERROR');
    }
    for (const key of [
      'baseCents',
      'taxCents',
      'totalCents',
      'rateBps',
      'taxRateBps',
      'countryCode',
      'planCode',
      'id',
      'createdAt',
      'currency',
      'pricingVersion',
      'taxPolicyVersion',
      'customerSnapshot',
      'breakdown',
    ]) {
      await errorResponse(
        await post(base, { ...valid, [key]: 'untrusted' }),
        422,
        'VALIDATION_ERROR',
      );
    }
    await errorResponse(
      await post(base, { ...valid, customerId: 'bad' }),
      400,
      'INVALID_CUSTOMER_ID',
    );
    await errorResponse(
      await post(base, valid, { body: '{' }),
      400,
      'INVALID_JSON',
    );
    await errorResponse(
      await post(base, valid, {
        body: JSON.stringify({ extra: 'x'.repeat(33000) }),
      }),
      413,
      'PAYLOAD_TOO_LARGE',
    );
    await errorResponse(
      await post(base, valid, { headers: { 'Content-Type': 'text/plain' } }),
      415,
      'UNSUPPORTED_MEDIA_TYPE',
    );
    await errorResponse(
      await post(base, valid, {
        headers: { 'Content-Type': 'application/json; charset=unsupported' },
      }),
      415,
      'UNSUPPORTED_MEDIA_TYPE',
    );
    assert.equal(calls, 0);
    assert.equal((await fetch(base + '/health')).status, 200);
    assert.equal(calls, 0);
  });
});

test('IT-INVALID-005: missing customer and unsupported country with zero yield safe errors', async (t) => {
  await api(t, async ({ f, base, logs }) => {
    await errorResponse(
      await post(base, body(randomUUID())),
      404,
      'CUSTOMER_NOT_FOUND',
    );
    const client = insertCustomer(
      f.db,
      customer({
        countryCode: 'IT',
        companyName: 'PRIVATE-CUSTOMER',
        taxIdOriginal: 'PRIVATE-TAX-ID',
      }),
    );
    const result = await errorResponse(
      await post(base, body(client.id, { users: 0 })),
      422,
      'TAX_COUNTRY_UNSUPPORTED',
    );
    assert.deepEqual(Object.keys(result.error.fields), ['customerId']);
    assert.equal(listSimulations(f.db, client.id).length, 0);
    assert.doesNotMatch(
      JSON.stringify({ result, logs }),
      /PRIVATE-CUSTOMER|PRIVATE-TAX-ID|SQLITE|SELECT|stack/,
    );
    assert.ok(logs.some((entry) => entry.code === 'TAX_COUNTRY_UNSUPPORTED'));
  });
});

test('IT-LIFECYCLE-005: absent database stays lazy, then initialized DB allows retry', async (t) => {
  const context = testArea(t);
  const options = {
    path: path.join(context.directory, 'missing.sqlite'),
    kind: 'test',
    context,
  };
  const provider = databaseProvider(options);
  try {
    await serve(
      createApp({ connection: provider.get, logger: () => {} }),
      async (base) => {
        assert.equal((await fetch(base + '/health')).status, 200);
        assert.equal(existsSync(options.path), false);
        await errorResponse(
          await post(base, body(randomUUID())),
          503,
          'DATABASE_UNAVAILABLE',
        );
        assert.equal(existsSync(options.path), false);
        migrateDatabase(options);
        const client = insertCustomer(provider.get(), customer());
        assert.equal((await post(base, body(client.id))).status, 201);
      },
    );
  } finally {
    provider.close();
  }
});

test('IT-INVALID-005: locked DB returns 503 without partial insert and recovers', async (t) => {
  await api(t, async ({ f, base }) => {
    const client = insertCustomer(f.db, customer());
    const other = f.connect();
    other.exec('BEGIN IMMEDIATE');
    try {
      await errorResponse(
        await post(base, body(client.id)),
        503,
        'DATABASE_BUSY',
      );
    } finally {
      other.exec('ROLLBACK');
    }
    assert.equal(listSimulations(f.db, client.id).length, 0);
    assert.equal((await post(base, body(client.id))).status, 201);
  });
});

test('IT-SIM-02: insertion failure returns sanitized 500 and leaves prior commit unchanged', async (t) => {
  await api(t, async ({ f, base, logs }) => {
    const client = insertCustomer(f.db, customer());
    const initial = await (await post(base, body(client.id))).json();
    let fired = false;
    f.db.function('http_fail_fixture', () => {
      fired = true;
      throw new Error('PRIVATE-SQL-STACK-CUSTOMER');
    });
    f.db.exec(
      'CREATE TEMP TRIGGER http_fail AFTER INSERT ON simulations BEGIN SELECT http_fail_fixture(); END',
    );
    const result = await errorResponse(
      await post(base, body(client.id)),
      500,
      'INTERNAL_ERROR',
    );
    assert.equal(fired, true);
    assert.deepEqual(listSimulations(f.db, client.id).map(toSimulationDto), [
      initial,
    ]);
    assert.doesNotMatch(
      JSON.stringify({ result, logs }),
      /PRIVATE-SQL|SQLITE|SELECT|stack/,
    );
    f.db.exec('DROP TRIGGER http_fail');
    assert.equal((await post(base, body(client.id))).status, 201);
  });
});

test('IT-INVALID-005: invalid policy and monetary overflow are internal errors, not 422', async (t) => {
  for (const [billingPolicy, code] of [
    [{ version: '', ratesByCountry: {} }, 'BILLING_POLICY_INVALID'],
    [
      {
        version: 'synthetic-overflow',
        ratesByCountry: { ES: Number.MAX_SAFE_INTEGER },
      },
      'BILLING_MONEY_OVERFLOW',
    ],
  ]) {
    await api(
      t,
      async ({ f, base, logs }) => {
        const client = insertCustomer(f.db, customer());
        const result = await errorResponse(
          await post(base, body(client.id, { users: 1000 })),
          500,
          'INTERNAL_ERROR',
        );
        assert.equal(listSimulations(f.db, client.id).length, 0);
        assert.ok(logs.some((entry) => entry.code === code));
        assert.doesNotMatch(
          JSON.stringify(result),
          /BILLING_POLICY|BILLING_MONEY|synthetic|stack/,
        );
        assert.ok(
          logs.every(
            (entry) =>
              Object.keys(entry).sort().join(',') ===
              'code,method,requestId,status',
          ),
        );
      },
      { billingPolicy },
    );
  }
});
