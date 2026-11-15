import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CURRENCY_EXPONENTS,
  CURRENCY_ERROR_CODES,
  CurrencyError,
} from '../dist/index.js';
import { conversionCases, overflowCase } from './currency-fixtures.mjs';

test('006-T01: currency catalog is closed and immutable', () => {
  assert.deepEqual(CURRENCY_EXPONENTS, { EUR: 2, USD: 2, GBP: 2 });
  assert.ok(Object.isFrozen(CURRENCY_EXPONENTS));
  assert.throws(() => {
    CURRENCY_EXPONENTS.USD = 3;
  }, TypeError);
});

test('006-T01: errors expose stable domain codes', () => {
  for (const code of CURRENCY_ERROR_CODES) {
    const error = new CurrencyError(code);
    assert.ok(error instanceof Error);
    assert.equal(error.name, 'CurrencyError');
    assert.equal(error.code, code);
  }
  assert.ok(Object.isFrozen(CURRENCY_ERROR_CODES));
});

test('006-T01: independent FX fixtures have coherent expected amounts', () => {
  for (const fixture of conversionCases) {
    assert.ok(
      Number.isSafeInteger(fixture.amountMinor) && fixture.amountMinor >= 0,
    );
    assert.ok(Object.hasOwn(CURRENCY_EXPONENTS, fixture.targetCurrency));
  }
  assert.equal(conversionCases[0].amountMinor, 18634);
  assert.equal(conversionCases[1].amountMinor, 13552);
  assert.ok(
    BigInt(overflowCase.amountEurCents) * 2n > BigInt(Number.MAX_SAFE_INTEGER),
  );
});
