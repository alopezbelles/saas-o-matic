import assert from 'node:assert/strict';
import test from 'node:test';
import {
  parseExchangeRates,
  ExchangeError,
} from '../.cache/currency-tests/exchange-contract.js';
import {
  nowMs,
  providerSuccess,
  normalizedRates,
  invalidProviderCases,
} from './currency-fixtures.mjs';

function rejects(payload, code = 'EXCHANGE_PAYLOAD_INVALID', clock = nowMs) {
  assert.throws(
    () => parseExchangeRates(payload, clock),
    (error) => error instanceof ExchangeError && error.code === code,
  );
}

test('006-T03: normalizes valid response and keeps only supported rates and trusted attribution', () => {
  const payload = {
    ...providerSuccess(),
    documentation: 'ignored',
    source: 'untrusted',
  };
  assert.deepEqual(parseExchangeRates(payload, nowMs), normalizedRates());
  assert.deepEqual(
    Object.keys(parseExchangeRates(payload, nowMs).rates).sort(),
    ['GBP', 'USD'],
  );
});

test('006-T03: all invalid provider fixtures fail with stable error codes', () => {
  for (const { name, payload } of invalidProviderCases()) {
    rejects(
      payload,
      name === 'expired' ? 'EXCHANGE_RATE_EXPIRED' : 'EXCHANGE_PAYLOAD_INVALID',
    );
  }
});

test('006-T03: requires own fields, objects and explicit successful EUR base', () => {
  for (const payload of [
    undefined,
    'json',
    1,
    [],
    {},
    Object.create(providerSuccess()),
    { ...providerSuccess(), result: undefined },
    { ...providerSuccess(), result: 'error' },
    { ...providerSuccess(), base_code: 'eur' },
    { ...providerSuccess(), rates: [] },
    { ...providerSuccess(), rates: Object.create(providerSuccess().rates) },
  ])
    rejects(payload);
  for (const key of [
    'result',
    'base_code',
    'rates',
    'time_last_update_unix',
    'time_next_update_unix',
  ]) {
    const payload = providerSuccess();
    delete payload[key];
    rejects(payload);
  }
});

test('006-T03: both foreign rates must be finite positive JSON numbers, identity exactly numeric one', () => {
  for (const key of ['USD', 'GBP']) {
    for (const value of [
      undefined,
      null,
      '1.1',
      0,
      -0,
      -1,
      NaN,
      Infinity,
      -Infinity,
      {},
      true,
    ]) {
      const payload = providerSuccess();
      payload.rates[key] = value;
      rejects(payload);
    }
  }
  for (const value of ['1', 0, 1.01, undefined]) {
    const payload = providerSuccess();
    payload.rates.EUR = value;
    rejects(payload);
  }
});

test('006-T03: scientific numeric rates normalize without monetary arithmetic', () => {
  const payload = providerSuccess();
  payload.rates.USD = 5e-324;
  payload.rates.GBP = 1e308;
  assert.deepEqual(parseExchangeRates(payload, nowMs).rates, {
    USD: '5e-324',
    GBP: '1e+308',
  });
});

test('006-T03: timestamps must be safe Unix seconds representable as ISO dates', () => {
  for (const key of ['time_last_update_unix', 'time_next_update_unix']) {
    for (const value of [
      undefined,
      null,
      '1768435200',
      -1,
      0.5,
      NaN,
      Infinity,
      Number.MAX_SAFE_INTEGER,
      8_640_000_000_001,
    ]) {
      rejects({ ...providerSuccess(), [key]: value });
    }
  }
  for (const clock of [NaN, Infinity, -1, 0.5, '123', 8_640_000_000_000_001]) {
    rejects(providerSuccess(), 'EXCHANGE_PAYLOAD_INVALID', clock);
  }
  assert.throws(
    () => parseExchangeRates(providerSuccess(), undefined),
    (error) =>
      error instanceof ExchangeError &&
      error.code === 'EXCHANGE_PAYLOAD_INVALID',
  );
});

test('006-T03: expiration boundary is strict and update cannot be in the future', () => {
  const payload = providerSuccess();
  const expiry = payload.time_next_update_unix * 1000;
  assert.deepEqual(parseExchangeRates(payload, expiry - 1), normalizedRates());
  rejects(payload, 'EXCHANGE_RATE_EXPIRED', expiry);
  rejects(payload, 'EXCHANGE_RATE_EXPIRED', expiry + 1);
  assert.deepEqual(
    parseExchangeRates(payload, payload.time_last_update_unix * 1000),
    normalizedRates(),
  );
  rejects(
    payload,
    'EXCHANGE_PAYLOAD_INVALID',
    payload.time_last_update_unix * 1000 - 1,
  );
});

test('006-T03: normalized output is isolated and deeply frozen without mutating provider', () => {
  const payload = providerSuccess();
  const before = structuredClone(payload);
  const normalized = parseExchangeRates(payload, nowMs);
  assert.deepEqual(payload, before);
  payload.rates.USD = 99;
  assert.equal(normalized.rates.USD, '1.1');
  for (const object of [normalized, normalized.rates, normalized.source])
    assert.ok(Object.isFrozen(object));
  assert.throws(() => {
    normalized.rates.USD = '99';
  }, TypeError);
  assert.deepEqual(JSON.parse(JSON.stringify(normalized)), normalizedRates());
});
