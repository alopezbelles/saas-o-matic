import assert from 'node:assert/strict';
import test from 'node:test';
import {
  nowMs,
  providerSuccess,
  normalizedRates,
  invalidProviderCases,
  transportCases,
} from './currency-fixtures.mjs';

test('006-T01: provider fixtures have fixed coherent timestamps and normalization', () => {
  const payload = providerSuccess();
  const normalized = normalizedRates();
  assert.equal(
    payload.time_last_update_unix * 1000,
    Date.parse(normalized.updatedAt),
  );
  assert.equal(
    payload.time_next_update_unix * 1000,
    Date.parse(normalized.expiresAt),
  );
  assert.ok(Date.parse(normalized.updatedAt) <= nowMs);
  assert.ok(nowMs < Date.parse(normalized.expiresAt));
  assert.equal(normalized.rates.USD, String(payload.rates.USD));
  assert.equal(normalized.rates.GBP, String(payload.rates.GBP));
  assert.deepEqual(Object.keys(normalized.rates).sort(), ['GBP', 'USD']);
});

test('006-T01: fixture factories isolate mutation and enumerate failure scenarios', () => {
  const changed = providerSuccess();
  changed.rates.USD = 999;
  assert.equal(providerSuccess().rates.USD, 1.1);
  assert.equal(
    new Set(invalidProviderCases().map(({ name }) => name)).size,
    invalidProviderCases().length,
  );
  assert.equal(transportCases.length, 4);
});
