import type { BillingQuote, SimulationDto } from '@saas-o-matic/shared';

/** Project the persisted result; never run the current engine on a saved record. */
export function savedQuote(result: SimulationDto): BillingQuote {
  return {
    currency: 'EUR',
    baseCents: result.baseCents,
    taxCents: result.taxCents,
    totalCents: result.totalCents,
    rateBps: result.taxRateBps,
    pricingVersion: result.pricingVersion,
    taxPolicyVersion: result.taxPolicyVersion,
    breakdown: result.breakdown.map((tier) => ({ ...tier })),
  };
}

export function quoteChanged(preview: BillingQuote, result: SimulationDto) {
  return (
    preview.pricingVersion !== result.pricingVersion ||
    preview.taxPolicyVersion !== result.taxPolicyVersion ||
    preview.baseCents !== result.baseCents ||
    preview.taxCents !== result.taxCents ||
    preview.totalCents !== result.totalCents ||
    preview.rateBps !== result.taxRateBps ||
    preview.breakdown.length !== result.breakdown.length ||
    preview.breakdown.some((tier, index) => {
      const saved = result.breakdown[index];
      return (
        !saved ||
        (Object.keys(tier) as (keyof typeof tier)[]).some(
          (key) => tier[key] !== saved[key],
        )
      );
    })
  );
}
