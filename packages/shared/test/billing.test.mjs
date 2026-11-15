import assert from 'node:assert/strict';
import test from 'node:test';
import {
  BillingError,
  CONSUMPTION_LIMITS,
  calculateTieredBase,
} from '../dist/index.js';
import {
  fiftyOneUserBreakdown,
  invalidConsumptionValues,
  pricingVersion,
  tierCases,
} from './billing-fixtures.mjs';

test('UT-BILL-01: tiered base matches independent boundary oracles', () => {
  for (const { users, baseCents, quantities } of tierCases) {
    const result = calculateTieredBase(users);
    assert.equal(result.baseCents, baseCents, `users=${users}`);
    assert.equal(result.pricingVersion, pricingVersion);
    assert.deepEqual(
      result.breakdown.map((line) => line.quantity),
      quantities,
    );
  }
  assert.deepEqual(calculateTieredBase(51).breakdown, fiftyOneUserBreakdown);
  assert.deepEqual(calculateTieredBase(0), {
    baseCents: 0,
    pricingVersion,
    breakdown: [],
  });
});

test('UT-BILL-01: every allowed count has a consistent, serializable breakdown', () => {
  for (let users = 0; users <= CONSUMPTION_LIMITS.users; users++) {
    const result = calculateTieredBase(users);
    let quantity = 0;
    let subtotal = 0;
    for (const [index, line] of result.breakdown.entries()) {
      const expectedTier = fiftyOneUserBreakdown[index];
      assert.deepEqual(
        Object.keys(line).sort(),
        Object.keys(expectedTier).sort(),
      );
      assert.equal(line.tierFrom, expectedTier.tierFrom);
      assert.equal(line.tierTo, expectedTier.tierTo);
      assert.equal(line.unitPriceCents, expectedTier.unitPriceCents);
      assert.ok(Number.isSafeInteger(line.quantity) && line.quantity > 0);
      assert.ok(
        Number.isSafeInteger(line.subtotalCents) && line.subtotalCents > 0,
      );
      assert.equal(
        BigInt(line.quantity) * BigInt(line.unitPriceCents),
        BigInt(line.subtotalCents),
      );
      quantity += line.quantity;
      subtotal += line.subtotalCents;
    }
    assert.equal(quantity, users);
    assert.equal(subtotal, result.baseCents);
    assert.ok(Number.isSafeInteger(result.baseCents));
    assert.deepEqual(JSON.parse(JSON.stringify(result)), result);
  }
});

test('UT-PROP-01: each added user costs only the applicable marginal price', () => {
  let previous = calculateTieredBase(0).baseCents;
  for (let users = 1; users <= CONSUMPTION_LIMITS.users; users++) {
    const current = calculateTieredBase(users).baseCents;
    const marginal = users <= 10 ? 1000 : users <= 50 ? 800 : 500;
    assert.equal(current - previous, marginal, `users=${users}`);
    assert.ok(current > previous);
    previous = current;
  }
});

test('UT-INPUT-004: invalid users fail without coercion with a stable field and code', () => {
  for (const value of [
    ...invalidConsumptionValues,
    CONSUMPTION_LIMITS.users + 1,
    1n,
    Symbol('users'),
    Object(15),
  ]) {
    assert.throws(
      () => calculateTieredBase(value),
      (error) => {
        assert.ok(error instanceof Error);
        assert.ok(error instanceof BillingError);
        assert.equal(error.name, 'BillingError');
        assert.equal(error.code, 'BILLING_INPUT_INVALID');
        assert.equal(error.field, 'users');
        assert.equal(error.message, 'BILLING_INPUT_INVALID');
        return true;
      },
    );
  }
});

test('UT-PROP-01: results are deterministic and mutations do not leak between calls', () => {
  const expected = calculateTieredBase(51);
  const mutable = calculateTieredBase(51);
  assert.deepEqual(mutable, expected);
  assert.notEqual(mutable.breakdown, expected.breakdown);
  assert.notEqual(mutable.breakdown[0], expected.breakdown[0]);
  mutable.baseCents = 1;
  mutable.pricingVersion = 'changed';
  mutable.breakdown[0].unitPriceCents = 1;
  mutable.breakdown.pop();
  assert.deepEqual(calculateTieredBase(51), expected);
  assert.deepEqual(calculateTieredBase(0).breakdown, []);
});
