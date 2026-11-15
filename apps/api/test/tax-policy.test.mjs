import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateTax,
  calculateTieredBase,
  resolveTaxRate,
} from '@saas-o-matic/shared';
import { taxPolicy } from '../dist/config/tax-policy.js';

test('UT-TAX-01: server policy has the agreed version, countries and rates', () => {
  assert.deepEqual(taxPolicy, {
    version: 'demo-standard-v1',
    ratesByCountry: { ES: 2100, FR: 2000, DE: 1900, GB: 2000 },
  });
  const base = calculateTieredBase(15).baseCents;
  for (const [country, expectedTax] of [
    ['ES', 2940],
    ['FR', 2800],
    ['DE', 2660],
    ['GB', 2800],
  ]) {
    assert.equal(
      calculateTax(base, resolveTaxRate(country, taxPolicy)),
      expectedTax,
    );
  }
  assert.equal(
    calculateTax(
      calculateTieredBase(51).baseCents,
      resolveTaxRate('ES', taxPolicy),
    ),
    8925,
  );
  assert.throws(() => resolveTaxRate('IT', taxPolicy), {
    code: 'TAX_COUNTRY_UNSUPPORTED',
  });
});

test('UT-TAX-01: published policy and rates cannot be mutated', () => {
  assert.ok(Object.isFrozen(taxPolicy));
  assert.ok(Object.isFrozen(taxPolicy.ratesByCountry));
  assert.throws(() => {
    taxPolicy.version = 'changed';
  }, TypeError);
  assert.throws(() => {
    taxPolicy.ratesByCountry.ES = 0;
  }, TypeError);
  assert.equal(resolveTaxRate('ES', taxPolicy), 2100);
});
