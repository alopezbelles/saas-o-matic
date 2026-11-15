import assert from 'node:assert/strict';
import test from 'node:test';
import { once } from 'node:events';
import { randomUUID } from 'node:crypto';
import { createApp } from '../dist/app.js';
import { HttpError } from '../dist/http/errors.js';
import { fixture, customer, simulation } from './db-fixtures.mjs';
import {
  insertCustomer,
  insertSimulation,
  listSimulations,
} from '../dist/db/persistence.js';
import { simulationService } from '../dist/features/simulations/service.js';

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
  try {
    await serve(
      createApp({ connection: () => f.db, logger: () => {}, ...options }),
      (base) => run({ f, base }),
    );
  } finally {
    f.close();
  }
}
const history = (base, id, query = '') =>
  fetch(base + '/customers/' + id + '/simulations' + query);

test('IT-HIST-01: SQL pagination, timestamp ties, total and customer isolation', async (t) => {
  await api(t, async ({ f, base }) => {
    const client = insertCustomer(f.db, customer());
    const other = insertCustomer(
      f.db,
      customer({ taxIdOriginal: 'other-fixture' }),
    );
    const ids = [1, 2, 3, 4].map(
      (n) => '00000000-0000-4000-8000-' + String(n).padStart(12, '0'),
    );
    for (const [index, id] of ids.entries()) {
      insertSimulation(
        f.db,
        simulation(client.id, {
          id,
          createdAt:
            index === 3
              ? '2025-01-01T00:00:00.000Z'
              : '2026-01-01T00:00:00.000Z',
        }),
      );
    }
    insertSimulation(f.db, simulation(other.id));
    const firstResponse = await history(base, client.id, '?limit=2&offset=0');
    assert.equal(firstResponse.status, 200);
    const first = await firstResponse.json();
    assert.deepEqual([first.total, first.limit, first.offset], [4, 2, 0]);
    assert.deepEqual(
      first.items.map((item) => item.id),
      [ids[2], ids[1]],
    );
    assert.ok(first.items.every((item) => item.customerId === client.id));
    assert.ok(
      first.items.every(
        (item) =>
          Array.isArray(item.breakdown) &&
          !Object.hasOwn(item, 'breakdownJson'),
      ),
    );
    const next = await (
      await history(base, client.id, '?limit=2&offset=2')
    ).json();
    assert.deepEqual(
      next.items.map((item) => item.id),
      [ids[0], ids[3]],
    );
    assert.deepEqual(
      await (await history(base, client.id, '?offset=100000')).json(),
      { items: [], total: 4, limit: 20, offset: 100000 },
    );
    const defaults = await (await history(base, client.id)).json();
    assert.deepEqual(
      [defaults.total, defaults.limit, defaults.offset, defaults.items.length],
      [4, 20, 0, 4],
    );
    assert.equal(
      (await (await fetch(base + '/customers/' + client.id)).json()).id,
      client.id,
    );
    assert.equal(
      (await (await fetch(base + '/customers?limit=1')).json()).limit,
      1,
    );
  });
});

test('IT-HIST-01: existing empty customer differs from absent or invalid customer', async (t) => {
  await api(t, async ({ f, base }) => {
    const client = insertCustomer(f.db, customer());
    assert.deepEqual(await (await history(base, client.id)).json(), {
      items: [],
      total: 0,
      limit: 20,
      offset: 0,
    });
    const absent = await history(base, randomUUID());
    assert.equal(absent.status, 404);
    assert.equal((await absent.json()).error.code, 'CUSTOMER_NOT_FOUND');
    const invalid = await history(base, 'bad');
    assert.equal(invalid.status, 400);
    assert.equal((await invalid.json()).error.code, 'INVALID_CUSTOMER_ID');
  });
});

test('IT-HIST-01: invalid query is rejected before DB access', async () => {
  let calls = 0;
  await serve(
    createApp({
      connection: () => {
        calls++;
        throw new HttpError(503, 'DATABASE_UNAVAILABLE');
      },
      logger: () => {},
    }),
    async (base) => {
      for (const query of [
        '?q=',
        '?extra=x',
        '?limit=0',
        '?limit=101',
        '?offset=-1',
        '?offset=100001',
        '?limit=1&limit=2',
        '?limit=1.5',
      ]) {
        const response = await history(base, randomUUID(), query);
        assert.equal(response.status, 400);
        assert.equal((await response.json()).error.code, 'INVALID_QUERY');
      }
      assert.equal((await history(base, 'bad')).status, 400);
      assert.equal(calls, 0);
      const missing = await history(base, randomUUID());
      assert.equal(missing.status, 503);
      assert.equal((await missing.json()).error.code, 'DATABASE_UNAVAILABLE');
    },
  );
});

test('IT-SNAPSHOT-005: history reads saved snapshots despite changed customer and invalid current policy', async (t) => {
  await api(
    t,
    async ({ f, base }) => {
      const client = insertCustomer(f.db, customer());
      const old = simulationService(() => f.db).create({
        customerId: client.id,
        users: 15,
        storageGb: 12,
        apiCalls: 345,
      });
      f.db
        .prepare(
          'UPDATE customers SET company_name=?, tax_id_original=?, tax_id_normalized=?, country_code=?, plan_code=? WHERE id=?',
        )
        .run('Changed', 'NEW-TAX', 'NEW-TAX', 'FR', 'DEMO_PRO', client.id);
      const next = simulationService(() => f.db, {
        version: 'synthetic-v2',
        ratesByCountry: { FR: 1000 },
      }).create({
        customerId: client.id,
        users: 15,
        storageGb: 12,
        apiCalls: 345,
      });
      const response = await history(base, client.id);
      const result = await response.json();
      assert.equal(response.status, 200);
      assert.deepEqual(
        result.items.find((item) => item.id === old.id),
        old,
      );
      assert.deepEqual(
        result.items.find((item) => item.id === next.id),
        next,
      );
      assert.equal(old.customerSnapshot.countryCode, 'ES');
      assert.equal(next.customerSnapshot.countryCode, 'FR');
      assert.equal(next.taxCents, 1400);
    },
    { billingPolicy: { version: '', ratesByCountry: {} } },
  );
});

test('IT-HIST-01: read transaction reports busy safely and recovers', async (t) => {
  await api(t, async ({ f, base }) => {
    const client = insertCustomer(f.db, customer());
    const other = f.connect();
    other.exec('BEGIN EXCLUSIVE');
    try {
      const response = await history(base, client.id);
      assert.equal(response.status, 503);
      const result = await response.json();
      assert.equal(result.error.code, 'DATABASE_BUSY');
      assert.equal(
        result.error.requestId,
        response.headers.get('X-Request-Id'),
      );
      assert.doesNotMatch(JSON.stringify(result), /SQLITE|SELECT|stack/);
    } finally {
      other.exec('ROLLBACK');
    }
    assert.equal((await history(base, client.id)).status, 200);
    assert.equal(listSimulations(f.db, client.id).length, 0);
  });
});
