import assert from 'node:assert/strict';
import test from 'node:test';
import { createExchangeClient } from '../.cache/currency-tests/exchange-client.js';
import { ExchangeError } from '../.cache/currency-tests/exchange-contract.js';
import {
  nowMs,
  providerSuccess,
  normalizedRates,
} from './currency-fixtures.mjs';

const response = (payload = providerSuccess()) =>
  new Response(JSON.stringify(payload));
const errorCode = (code) => (error) =>
  error instanceof ExchangeError && error.code === code;
const deferred = () => {
  let resolve;
  const promise = new Promise((done) => {
    resolve = done;
  });
  return { promise, resolve };
};

test('006-T04: EUR needs no provider, even while a foreign request is pending', async () => {
  let calls = 0;
  const pending = deferred();
  const client = createExchangeClient({
    now: () => nowMs,
    fetch: () => {
      calls++;
      return pending.promise;
    },
  });
  assert.equal(await client.getRates('EUR'), null);
  assert.equal(calls, 0);
  const foreign = client.getRates('USD');
  assert.equal(await client.getRates('EUR'), null);
  assert.equal(calls, 1);
  pending.resolve(response());
  await foreign;
});

test('006-T04: concurrent currencies and subsequent reads share a single immutable result', async () => {
  let calls = 0;
  const pending = deferred();
  const client = createExchangeClient({
    now: () => nowMs,
    fetch: async (url, options) => {
      calls++;
      assert.equal(url, 'https://open.er-api.com/v6/latest/EUR');
      assert.equal(options.method, 'GET');
      assert.equal(options.credentials, 'omit');
      assert.equal(options.cache, 'no-store');
      assert.equal(options.referrerPolicy, 'no-referrer');
      assert.equal(options.body, undefined);
      return pending.promise;
    },
  });
  const usd = client.getRates('USD');
  const gbp = client.getRates('GBP');
  assert.equal(calls, 1);
  pending.resolve(response());
  const [first, second] = await Promise.all([usd, gbp]);
  assert.deepEqual(first, normalizedRates());
  assert.equal(first, second);
  assert.throws(() => {
    first.rates.USD = '999';
  }, TypeError);
  for (let index = 0; index < 10; index++)
    assert.equal(await client.getRates('USD'), first);
  assert.equal(calls, 1);
});

test('006-T04: exact expiry discards old cache and refreshes once for concurrent calls', async () => {
  let current = nowMs;
  let calls = 0;
  const client = createExchangeClient({
    now: () => current,
    fetch: async () => {
      calls++;
      const payload = providerSuccess();
      if (calls > 1) {
        payload.time_last_update_unix = payload.time_next_update_unix;
        payload.time_next_update_unix += 86400;
        payload.rates.USD = 1.2;
      }
      return response(payload);
    },
  });
  await client.getRates('USD');
  current = Date.parse(normalizedRates().expiresAt) - 1;
  assert.equal((await client.getRates('GBP')).rates.USD, '1.1');
  current++;
  const [a, b] = await Promise.all([
    client.getRates('USD'),
    client.getRates('GBP'),
  ]);
  assert.equal(a.rates.USD, '1.2');
  assert.equal(a, b);
  assert.equal(calls, 2);
});

test('006-T04: network, HTTP, JSON and logical failures are recoverable without automatic retries', async () => {
  for (const [fail, code] of [
    [
      () => {
        throw new TypeError('private network details');
      },
      'EXCHANGE_NETWORK_ERROR',
    ],
    [() => new Response('busy', { status: 429 }), 'EXCHANGE_HTTP_ERROR'],
    [() => new Response('unavailable', { status: 503 }), 'EXCHANGE_HTTP_ERROR'],
    [() => new Response('{'), 'EXCHANGE_PAYLOAD_INVALID'],
    [() => response({ result: 'error' }), 'EXCHANGE_PAYLOAD_INVALID'],
  ]) {
    let calls = 0;
    const client = createExchangeClient({
      now: () => nowMs,
      fetch: async () => {
        calls++;
        return calls === 1 ? fail() : response();
      },
    });
    await assert.rejects(client.getRates('USD'), errorCode(code));
    assert.equal(calls, 1);
    assert.equal(await client.getRates('EUR'), null);
    assert.deepEqual(await client.getRates('GBP'), normalizedRates());
    assert.equal(calls, 2);
  }
});

test('006-T04: failed refresh cannot return stale data', async () => {
  let current = nowMs;
  let calls = 0;
  const client = createExchangeClient({
    now: () => current,
    fetch: async () => {
      calls++;
      return calls === 1 ? response() : new Response('', { status: 429 });
    },
  });
  await client.getRates('USD');
  current = Date.parse(normalizedRates().expiresAt);
  await assert.rejects(
    client.getRates('GBP'),
    errorCode('EXCHANGE_HTTP_ERROR'),
  );
  await assert.rejects(
    client.getRates('USD'),
    errorCode('EXCHANGE_HTTP_ERROR'),
  );
  assert.equal(calls, 3);
});

test('006-T04: expiry during body download is checked at completion', async () => {
  let current = nowMs;
  const body = deferred();
  const client = createExchangeClient({
    now: () => current,
    fetch: async () => ({ ok: true, json: () => body.promise }),
  });
  const result = client.getRates('USD');
  current = Date.parse(normalizedRates().expiresAt);
  body.resolve(providerSuccess());
  await assert.rejects(result, errorCode('EXCHANGE_RATE_EXPIRED'));
});

test('006-T04: timeout aborts even an uncooperative fetch and late data cannot overwrite recovery', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let calls = 0;
  let signal;
  const late = deferred();
  const client = createExchangeClient({
    now: () => nowMs,
    fetch: async (_, options) => {
      calls++;
      signal = options.signal;
      return calls === 1 ? late.promise : response();
    },
  });
  const first = client.getRates('USD');
  const second = client.getRates('GBP');
  const checks = Promise.all([
    assert.rejects(first, errorCode('EXCHANGE_TIMEOUT')),
    assert.rejects(second, errorCode('EXCHANGE_TIMEOUT')),
  ]);
  t.mock.timers.tick(4999);
  assert.equal(signal.aborted, false);
  t.mock.timers.tick(1);
  assert.equal(signal.aborted, true);
  await checks;
  assert.deepEqual(await client.getRates('USD'), normalizedRates());
  const payload = providerSuccess();
  payload.rates.USD = 99;
  late.resolve(response(payload));
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal((await client.getRates('USD')).rates.USD, '1.1');
  assert.equal(calls, 2);
});

test('006-T04: timeout also covers a stalled JSON body', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const body = deferred();
  const client = createExchangeClient({
    now: () => nowMs,
    fetch: async () => ({ ok: true, json: () => body.promise }),
  });
  const pending = client.getRates('USD');
  const check = assert.rejects(pending, errorCode('EXCHANGE_TIMEOUT'));
  await Promise.resolve();
  t.mock.timers.tick(5000);
  await check;
  body.resolve(providerSuccess());
});

test('006-T04: clients have isolated caches and invalid currencies never trigger fetch', async () => {
  let calls = 0;
  const options = {
    now: () => nowMs,
    fetch: async () => {
      calls++;
      return response();
    },
  };
  const a = createExchangeClient(options);
  const b = createExchangeClient(options);
  await assert.rejects(a.getRates('JPY'), TypeError);
  assert.equal(calls, 0);
  await a.getRates('USD');
  await b.getRates('GBP');
  assert.equal(calls, 2);
});
