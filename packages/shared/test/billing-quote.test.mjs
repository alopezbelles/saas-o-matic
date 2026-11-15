import assert from 'node:assert/strict';
import test from 'node:test';
import {
  BillingError,
  CONSUMPTION_LIMITS,
  calculateQuote,
  calculateTax,
} from '../dist/index.js';
import {
  consumptionCases,
  demoPolicyFixture,
  invalidConsumptionValues,
  invalidCountryValues,
  invalidPolicyCases,
  quoteCases,
} from './billing-fixtures.mjs';

const validInput = {
  users: 15,
  storageGb: 10,
  apiCalls: 100,
  countryCode: 'ES',
};

function expectError(input, policy, code, field) {
  assert.throws(
    () => calculateQuote(input, policy),
    (error) => {
      assert.ok(error instanceof BillingError);
      assert.equal(error.code, code);
      assert.equal(error.message, code);
      if (field !== undefined) assert.equal(error.field, field);
      return true;
    },
  );
}

test('UT-QUOTE-004: complete quote matches independent country and boundary oracles', () => {
  for (const {
    countryCode,
    users,
    baseCents,
    taxCents,
    totalCents,
  } of quoteCases) {
    const result = calculateQuote(
      { ...validInput, countryCode, users },
      demoPolicyFixture,
    );
    assert.equal(result.baseCents, baseCents);
    assert.equal(result.taxCents, taxCents);
    assert.equal(result.totalCents, totalCents);
    assert.equal(result.rateBps, demoPolicyFixture.ratesByCountry[countryCode]);
    assert.equal(result.currency, 'EUR');
    assert.equal(result.pricingVersion, 'users-tiered-v1');
    assert.equal(result.taxPolicyVersion, 'demo-standard-v1');
    assert.deepEqual(Object.keys(result).sort(), [
      'baseCents',
      'breakdown',
      'currency',
      'pricingVersion',
      'rateBps',
      'taxCents',
      'taxPolicyVersion',
      'totalCents',
    ]);
    if (users === 0) assert.deepEqual(result.breakdown, []);
  }
});

test('UT-QUOTE-004: tax rounds on the whole base rather than separately by tier', () => {
  const policy = {
    version: 'synthetic-rounding-v1',
    ratesByCountry: { ES: 7 },
  };
  const result = calculateQuote({ ...validInput, users: 51 }, policy);
  assert.equal(result.baseCents, 42500);
  assert.equal(result.taxCents, 30);
  assert.equal(result.totalCents, 42530);
  assert.equal(result.taxPolicyVersion, 'synthetic-rounding-v1');
  // Rounding each tier separately would incorrectly yield 7 + 22 + 0 = 29.
});

test('UT-INPUT-004: all consumption limits and invalid values are validated', () => {
  for (const { field, minimum, maximum, overMaximum } of consumptionCases) {
    for (const value of [minimum, maximum]) {
      assert.doesNotThrow(() =>
        calculateQuote({ ...validInput, [field]: value }, demoPolicyFixture),
      );
    }
    for (const value of [
      ...invalidConsumptionValues,
      overMaximum,
      1n,
      Symbol(field),
      Object(1),
    ]) {
      expectError(
        { ...validInput, [field]: value },
        demoPolicyFixture,
        'BILLING_INPUT_INVALID',
        field,
      );
    }
    const missing = { ...validInput };
    delete missing[field];
    expectError(missing, demoPolicyFixture, 'BILLING_INPUT_INVALID', field);
  }
  for (const input of [
    undefined,
    null,
    [],
    true,
    '15',
    15,
    1n,
    Symbol('input'),
    {},
  ]) {
    expectError(input, demoPolicyFixture, 'BILLING_INPUT_INVALID');
  }
  for (const countryCode of [...invalidCountryValues, undefined]) {
    expectError(
      { ...validInput, countryCode },
      demoPolicyFixture,
      'BILLING_INPUT_INVALID',
      'countryCode',
    );
  }
});

test('UT-QUOTE-004: secondary consumptions and untrusted extra fields never set prices', () => {
  const expected = calculateQuote(validInput, demoPolicyFixture);
  for (const storageGb of [0, CONSUMPTION_LIMITS.storageGb]) {
    for (const apiCalls of [0, CONSUMPTION_LIMITS.apiCalls]) {
      assert.deepEqual(
        calculateQuote(
          { ...validInput, storageGb, apiCalls },
          demoPolicyFixture,
        ),
        expected,
      );
    }
  }
  const spoofed = {
    ...validInput,
    planCode: 'DEMO_PRO',
    clientId: 'ignored',
    baseCents: 1,
    taxCents: 1,
    totalCents: 2,
    currency: 'USD',
    pricingVersion: 'spoofed',
    taxPolicyVersion: 'spoofed',
    rateBps: 0,
    breakdown: [],
  };
  assert.deepEqual(calculateQuote(spoofed, demoPolicyFixture), expected);
});

test('UT-QUOTE-004: policy validation and country support apply even for zero users', () => {
  for (const { policy } of invalidPolicyCases) {
    expectError(validInput, policy, 'BILLING_POLICY_INVALID');
    expectError({ ...validInput, users: 0 }, policy, 'BILLING_POLICY_INVALID');
  }
  expectError(
    { ...validInput, users: 0, countryCode: 'IT' },
    demoPolicyFixture,
    'TAX_COUNTRY_UNSUPPORTED',
    'countryCode',
  );
  const policy = { version: 'synthetic-zero-v1', ratesByCountry: { ES: 0 } };
  const result = calculateQuote(validInput, policy);
  assert.equal(result.taxCents, 0);
  assert.equal(result.totalCents, 14000);
  assert.equal(result.taxPolicyVersion, policy.version);
  assert.equal(result.rateBps, 0);
});

test('UT-QUOTE-004: input errors precede invalid policy and unsupported country', () => {
  expectError(
    { ...validInput, storageGb: -1, countryCode: 'IT' },
    null,
    'BILLING_INPUT_INVALID',
    'storageGb',
  );
  expectError(
    { ...validInput, apiCalls: -1, countryCode: 'IT' },
    demoPolicyFixture,
    'BILLING_INPUT_INVALID',
    'apiCalls',
  );
  expectError(
    { ...validInput, countryCode: 'es' },
    null,
    'BILLING_INPUT_INVALID',
    'countryCode',
  );
  expectError(
    { ...validInput, countryCode: 'IT' },
    null,
    'BILLING_POLICY_INVALID',
  );
});

test('UT-QUOTE-004: overflow rejects both unsafe tax and unsafe total', () => {
  const input = { ...validInput, users: 1000 };
  expectError(
    input,
    {
      version: 'synthetic-overflow',
      ratesByCountry: { ES: Number.MAX_SAFE_INTEGER },
    },
    'BILLING_MONEY_OVERFLOW',
  );
  // Construct a safe tax near the limit whose sum with base is unsafe.
  const rate = Number(
    ((BigInt(Number.MAX_SAFE_INTEGER) - 100n) * 10000n) / 517000n,
  );
  const safeTax = calculateTax(517000, rate);
  assert.ok(Number.isSafeInteger(safeTax));
  assert.ok(BigInt(safeTax) + 517000n > BigInt(Number.MAX_SAFE_INTEGER));
  expectError(
    input,
    { version: 'synthetic-total-overflow', ratesByCountry: { ES: rate } },
    'BILLING_MONEY_OVERFLOW',
  );
});

test('UT-PROP-01: quote invariants and monotonicity hold for every count and demo country', () => {
  for (const countryCode of Object.keys(demoPolicyFixture.ratesByCountry)) {
    let previous = -1;
    for (let users = 0; users <= CONSUMPTION_LIMITS.users; users++) {
      const result = calculateQuote(
        { ...validInput, users, countryCode },
        demoPolicyFixture,
      );
      assert.equal(result.baseCents + result.taxCents, result.totalCents);
      assert.equal(
        result.breakdown.reduce((sum, line) => sum + line.quantity, 0),
        users,
      );
      assert.equal(
        result.breakdown.reduce((sum, line) => sum + line.subtotalCents, 0),
        result.baseCents,
      );
      assert.ok(
        [result.baseCents, result.taxCents, result.totalCents].every(
          Number.isSafeInteger,
        ),
      );
      assert.ok(result.totalCents > previous);
      assert.deepEqual(JSON.parse(JSON.stringify(result)), result);
      previous = result.totalCents;
    }
  }
});

test('UT-PROP-01: frozen inputs remain intact and outputs are isolated between calls', () => {
  const input = Object.freeze({ ...validInput });
  const policy = Object.freeze({
    version: 'frozen-v1',
    ratesByCountry: Object.freeze({ ES: 2100 }),
  });
  const before = structuredClone({ input, policy });
  const first = calculateQuote(input, policy);
  const second = calculateQuote(input, policy);
  assert.deepEqual(first, second);
  assert.notEqual(first.breakdown, second.breakdown);
  first.breakdown[0].subtotalCents = 0;
  first.breakdown.length = 0;
  first.totalCents = 0;
  first.taxPolicyVersion = 'changed';
  assert.deepEqual(calculateQuote(input, policy), second);
  assert.deepEqual({ input, policy }, before);
});
