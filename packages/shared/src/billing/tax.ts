import { BillingError } from './errors.js';
import { assertMoneyCents, roundHalfUp, toSafeCents } from './money.js';
import type { TaxPolicy } from './types.js';

function isRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const prototype: unknown = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function assertRate(value: unknown, field: string): asserts value is number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) {
    throw new BillingError('BILLING_POLICY_INVALID', field);
  }
}

export function validateTaxPolicy(
  policy: unknown,
): asserts policy is TaxPolicy {
  if (!isRecord(policy)) throw new BillingError('BILLING_POLICY_INVALID');
  if (
    !Object.hasOwn(policy, 'version') ||
    typeof policy.version !== 'string' ||
    policy.version.length === 0 ||
    policy.version.length > 64 ||
    policy.version.trim() !== policy.version
  ) {
    throw new BillingError('BILLING_POLICY_INVALID', 'version');
  }
  if (
    !Object.hasOwn(policy, 'ratesByCountry') ||
    !isRecord(policy.ratesByCountry)
  ) {
    throw new BillingError('BILLING_POLICY_INVALID', 'ratesByCountry');
  }
  for (const [country, rate] of Object.entries(policy.ratesByCountry)) {
    if (!/^[A-Z]{2}$/.test(country)) {
      throw new BillingError('BILLING_POLICY_INVALID', 'ratesByCountry');
    }
    assertRate(rate, `ratesByCountry.${country}`);
  }
}

export function resolveTaxRate(countryCode: string, policy: TaxPolicy): number {
  if (typeof countryCode !== 'string' || !/^[A-Z]{2}$/.test(countryCode)) {
    throw new BillingError('BILLING_INPUT_INVALID', 'countryCode');
  }
  validateTaxPolicy(policy);
  const rate = policy.ratesByCountry[countryCode];
  if (
    !Object.hasOwn(policy.ratesByCountry, countryCode) ||
    rate === undefined
  ) {
    throw new BillingError('TAX_COUNTRY_UNSUPPORTED', 'countryCode');
  }
  return rate;
}

export function calculateTax(baseCents: number, rateBps: number): number {
  assertMoneyCents(baseCents, 'baseCents');
  assertRate(rateBps, 'rateBps');
  return toSafeCents(roundHalfUp(BigInt(baseCents) * BigInt(rateBps), 10000n));
}
