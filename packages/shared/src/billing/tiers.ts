import { CONSUMPTION_LIMITS } from '../persistence-contracts.js';
import { BillingError } from './errors.js';
import { toSafeCents } from './money.js';
import type { TierBreakdown, TieredBase } from './types.js';

// Keep the version and its rules together; published rules must not be changed.
const pricing = {
  version: 'users-tiered-v1',
  tiers: [
    { from: 1, to: 10, unitPriceCents: 1000 },
    { from: 11, to: 50, unitPriceCents: 800 },
    { from: 51, to: null, unitPriceCents: 500 },
  ],
} as const;

export function calculateTieredBase(users: number): TieredBase {
  if (
    typeof users !== 'number' ||
    !Number.isSafeInteger(users) ||
    users < 0 ||
    users > CONSUMPTION_LIMITS.users
  ) {
    throw new BillingError('BILLING_INPUT_INVALID', 'users');
  }

  const breakdown: TierBreakdown[] = [];
  let baseCents = 0n;
  for (const tier of pricing.tiers) {
    if (users < tier.from) break;
    const quantity = Math.min(users, tier.to ?? users) - tier.from + 1;
    const subtotalCents = BigInt(quantity) * BigInt(tier.unitPriceCents);
    baseCents += subtotalCents;
    breakdown.push({
      tierFrom: tier.from,
      tierTo: tier.to,
      quantity,
      unitPriceCents: tier.unitPriceCents,
      subtotalCents: toSafeCents(subtotalCents),
    });
  }
  return {
    baseCents: toSafeCents(baseCents),
    pricingVersion: pricing.version,
    breakdown,
  };
}
