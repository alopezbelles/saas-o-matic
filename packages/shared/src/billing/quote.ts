import { BillingError } from './errors.js';
import { toSafeCents } from './money.js';
import { calculateTax, resolveTaxRate } from './tax.js';
import { calculateTieredBase } from './tiers.js';
import type { BillingInput, BillingQuote, TaxPolicy } from './types.js';
import { assertConsumption } from './validation.js';

export function calculateQuote(
  input: BillingInput,
  policy: TaxPolicy,
): BillingQuote {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    throw new BillingError('BILLING_INPUT_INVALID');
  }
  for (const field of ['users', 'storageGb', 'apiCalls'] as const) {
    assertConsumption(input[field], field);
  }
  // resolveTaxRate validates country format before policy and country support.
  const rateBps = resolveTaxRate(input.countryCode, policy);
  const base = calculateTieredBase(input.users);
  const taxCents = calculateTax(base.baseCents, rateBps);
  const totalCents = toSafeCents(BigInt(base.baseCents) + BigInt(taxCents));
  return {
    ...base,
    taxCents,
    totalCents,
    currency: 'EUR',
    rateBps,
    taxPolicyVersion: policy.version,
  };
}
