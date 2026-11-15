import assert from 'node:assert/strict';
import test from 'node:test';
import {
  BillingError,
  assertMoneyCents,
  calculateTax,
  resolveTaxRate,
  roundHalfUp,
  toSafeCents,
  validateTaxPolicy,
} from '../dist/index.js';
import {
  demoPolicyFixture,
  invalidConsumptionValues,
  invalidCountryValues,
  invalidPolicyCases,
  overflowCase,
  quoteCases,
  roundingCases,
} from './billing-fixtures.mjs';

function expectBillingError(action, code, field) {
  assert.throws(action, (error) => {
    assert.ok(error instanceof BillingError);
    assert.equal(error.code, code);
    assert.equal(error.message, code);
    if (field !== undefined) assert.equal(error.field, field);
    return true;
  });
}

test('UT-MONEY-01: tax rounds only once, with half-up around half a cent', () => {
  for (const { baseCents, rateBps, taxCents } of roundingCases) {
    assert.equal(calculateTax(baseCents, rateBps), taxCents);
  }
  assert.equal(calculateTax(3, 5000), 2);
  assert.equal(calculateTax(0, 2100), 0);
  assert.equal(roundHalfUp(1n, 3n), 0n);
  assert.equal(roundHalfUp(2n, 3n), 1n);
  assert.equal(roundHalfUp(1n, 2n), 1n);
});

test('UT-MONEY-01: safe boundary and oversized intermediates retain exact cents', () => {
  const maximum = Number.MAX_SAFE_INTEGER;
  assert.equal(toSafeCents(0n), 0);
  assert.equal(toSafeCents(BigInt(maximum)), maximum);
  assert.equal(calculateTax(maximum, 10000), maximum);
  assert.equal(calculateTax(maximum, 1), 900719925474);
  assert.equal(calculateTax(0, maximum), 0);
  assert.equal(assertMoneyCents(maximum), undefined);
  expectBillingError(
    () => toSafeCents(BigInt(maximum) + 1n),
    'BILLING_MONEY_OVERFLOW',
  );
  expectBillingError(
    () => calculateTax(overflowCase.baseCents, overflowCase.rateBps),
    overflowCase.code,
  );
});

test('UT-MONEY-01: invalid helper inputs reject without coercion', () => {
  for (const value of [
    ...invalidConsumptionValues,
    1n,
    Symbol('amount'),
    Object(1),
  ]) {
    expectBillingError(
      () => calculateTax(value, 2100),
      'BILLING_MONEY_INVALID',
      'baseCents',
    );
    expectBillingError(
      () => assertMoneyCents(value),
      'BILLING_MONEY_INVALID',
      'amountCents',
    );
    expectBillingError(
      () => calculateTax(100, value),
      'BILLING_POLICY_INVALID',
      'rateBps',
    );
  }
  for (const value of [-1n, 1, null, '1']) {
    expectBillingError(() => toSafeCents(value), 'BILLING_MONEY_INVALID');
  }
  for (const [numerator, denominator] of [
    [-1n, 2n],
    [1n, 0n],
    [1n, -2n],
    [1, 2n],
    [1n, 2],
  ]) {
    expectBillingError(
      () => roundHalfUp(numerator, denominator),
      'BILLING_MONEY_INVALID',
    );
  }
});

test('UT-TAX-01: versioned policy selects all four explicit rates without mutation', () => {
  const before = structuredClone(demoPolicyFixture);
  validateTaxPolicy(demoPolicyFixture);
  for (const { countryCode, baseCents, taxCents } of quoteCases) {
    assert.equal(
      calculateTax(baseCents, resolveTaxRate(countryCode, demoPolicyFixture)),
      taxCents,
    );
  }
  assert.deepEqual(demoPolicyFixture, before);
  const zero = Object.freeze({
    version: 'synthetic-zero-v1',
    ratesByCountry: Object.freeze({ ES: 0 }),
  });
  assert.equal(resolveTaxRate('ES', zero), 0);
  expectBillingError(
    () => resolveTaxRate('IT', zero),
    'TAX_COUNTRY_UNSUPPORTED',
    'countryCode',
  );
  expectBillingError(
    () => resolveTaxRate('ES', { version: 'empty-v1', ratesByCountry: {} }),
    'TAX_COUNTRY_UNSUPPORTED',
  );
});

test('UT-TAX-01: invalid policies and countries fail with stable codes', () => {
  for (const { policy } of invalidPolicyCases) {
    expectBillingError(
      () => validateTaxPolicy(policy),
      'BILLING_POLICY_INVALID',
    );
    expectBillingError(
      () => resolveTaxRate('ES', policy),
      'BILLING_POLICY_INVALID',
    );
  }
  for (const country of invalidCountryValues) {
    expectBillingError(
      () => resolveTaxRate(country, demoPolicyFixture),
      'BILLING_INPUT_INVALID',
      'countryCode',
    );
  }
  for (const ratesByCountry of [
    { es: 2100 },
    { ESP: 2100 },
    { ES: undefined },
    Object.create({ ES: 2100 }),
    new Map([['ES', 2100]]),
  ]) {
    expectBillingError(
      () => validateTaxPolicy({ version: 'synthetic-v1', ratesByCountry }),
      'BILLING_POLICY_INVALID',
    );
  }
  expectBillingError(
    () =>
      validateTaxPolicy(
        Object.create({
          version: 'inherited-v1',
          ratesByCountry: { ES: 2100 },
        }),
      ),
    'BILLING_POLICY_INVALID',
  );
});

test('UT-TAX-01: valid version boundary and null-prototype rate maps are supported', () => {
  const policy = {
    version: 'x'.repeat(64),
    ratesByCountry: Object.assign(Object.create(null), { ES: 2100 }),
  };
  assert.equal(resolveTaxRate('ES', policy), 2100);
  expectBillingError(
    () => resolveTaxRate('IT', policy),
    'TAX_COUNTRY_UNSUPPORTED',
  );
  // An invalid unused rate invalidates the whole policy, not just its own country.
  expectBillingError(
    () =>
      resolveTaxRate('ES', {
        version: 'synthetic-v1',
        ratesByCountry: { ES: 2100, FR: -1 },
      }),
    'BILLING_POLICY_INVALID',
    'ratesByCountry.FR',
  );
});
