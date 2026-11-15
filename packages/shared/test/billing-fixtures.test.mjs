import assert from 'node:assert/strict';
import test from 'node:test';
import { CONSUMPTION_LIMITS } from '../dist/index.js';
import {
  consumptionCases,
  demoPolicyFixture,
  errorCases,
  fiftyOneUserBreakdown,
  invalidConsumptionValues,
  invalidCountryValues,
  invalidPolicyCases,
  overflowCase,
  pricingVersion,
  quoteCases,
  roundingCases,
  tierCases,
  unsupportedCountry,
} from './billing-fixtures.mjs';

// UT-FIX-004 checks test-data integrity, not production billing correctness.
test('tier fixtures cover agreed boundaries with coherent quantities', () => {
  assert.equal(pricingVersion, 'users-tiered-v1');
  assert.deepEqual(
    tierCases.map(({ users }) => users),
    [0, 10, 11, 15, 50, 51, 1000],
  );
  for (const { users, baseCents, quantities } of tierCases) {
    assert.ok(Number.isSafeInteger(baseCents) && baseCents >= 0);
    assert.equal(
      quantities.reduce((sum, quantity) => sum + quantity, 0),
      users,
    );
    assert.ok(
      quantities.every(
        (quantity) => Number.isSafeInteger(quantity) && quantity > 0,
      ),
    );
  }
  assert.deepEqual(tierCases[0].quantities, []);
  assert.equal(
    fiftyOneUserBreakdown.reduce((sum, line) => sum + line.quantity, 0),
    51,
  );
  assert.equal(
    fiftyOneUserBreakdown.reduce((sum, line) => sum + line.subtotalCents, 0),
    42500,
  );
  for (const line of fiftyOneUserBreakdown) {
    assert.deepEqual(Object.keys(line).sort(), [
      'quantity',
      'subtotalCents',
      'tierFrom',
      'tierTo',
      'unitPriceCents',
    ]);
    assert.equal(
      BigInt(line.quantity) * BigInt(line.unitPriceCents),
      BigInt(line.subtotalCents),
    );
  }
});

test('demo quote fixtures cover four countries and preserve totals', () => {
  assert.equal(demoPolicyFixture.version, 'demo-standard-v1');
  assert.deepEqual(
    [...new Set(quoteCases.map(({ countryCode }) => countryCode))].sort(),
    ['DE', 'ES', 'FR', 'GB'],
  );
  for (const {
    countryCode,
    users,
    baseCents,
    taxCents,
    totalCents,
  } of quoteCases) {
    assert.ok(Object.hasOwn(demoPolicyFixture.ratesByCountry, countryCode));
    assert.equal(
      tierCases.find((item) => item.users === users)?.baseCents,
      baseCents,
    );
    assert.equal(baseCents + taxCents, totalCents);
    assert.ok([baseCents, taxCents, totalCents].every(Number.isSafeInteger));
  }
  assert.equal(
    Object.hasOwn(demoPolicyFixture.ratesByCountry, unsupportedCountry),
    false,
  );
  assert.match(unsupportedCountry, /^[A-Z]{2}$/);
});

test('synthetic rounding fixtures straddle half a cent without defining product rates', () => {
  assert.deepEqual(
    roundingCases.slice(0, 3).map(({ taxCents }) => taxCents),
    [0, 1, 1],
  );
  const [below, half, above] = roundingCases;
  assert.ok(below.baseCents * below.rateBps < 5000);
  assert.equal(half.baseCents * half.rateBps, 5000);
  assert.ok(above.baseCents * above.rateBps > 5000);
  assert.equal(roundingCases[3].rateBps, 0);
  assert.equal(roundingCases[3].taxCents, 0);
  assert.ok(
    BigInt(overflowCase.baseCents) * BigInt(overflowCase.rateBps) >
      BigInt(Number.MAX_SAFE_INTEGER) * 10000n,
  );
});

test('consumption fixtures match existing shared limits and cover invalid inputs', () => {
  assert.deepEqual(
    Object.fromEntries(
      consumptionCases.map(({ field, maximum }) => [field, maximum]),
    ),
    CONSUMPTION_LIMITS,
  );
  for (const { minimum, maximum, overMaximum } of consumptionCases) {
    assert.equal(minimum, 0);
    assert.equal(overMaximum, maximum + 1);
    assert.ok(Number.isSafeInteger(maximum));
  }
  assert.ok(invalidConsumptionValues.some(Number.isNaN));
  assert.ok(invalidConsumptionValues.includes(Infinity));
  assert.ok(invalidConsumptionValues.includes(-1));
  assert.ok(invalidConsumptionValues.includes(0.5));
  assert.ok(invalidConsumptionValues.includes('15'));
  assert.ok(
    invalidCountryValues.every(
      (value) => typeof value !== 'string' || !/^[A-Z]{2}$/.test(value),
    ),
  );
});

test('error and policy fixtures have unique cases and the agreed error vocabulary', () => {
  assert.equal(
    new Set(invalidPolicyCases.map(({ label }) => label)).size,
    invalidPolicyCases.length,
  );
  assert.deepEqual(errorCases.map(({ code }) => code).sort(), [
    'BILLING_INPUT_INVALID',
    'BILLING_MONEY_INVALID',
    'BILLING_MONEY_OVERFLOW',
    'BILLING_POLICY_INVALID',
    'TAX_COUNTRY_UNSUPPORTED',
  ]);
  assert.equal(overflowCase.code, 'BILLING_MONEY_OVERFLOW');
});
