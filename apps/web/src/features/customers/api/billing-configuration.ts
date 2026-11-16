import {
  CONSUMPTION_LIMITS,
  getPricingConfiguration,
  validateTaxPolicy,
  type BillingConfigDto,
} from '@saas-o-matic/shared';
import { ApiRequestError, getJson, isRecord } from './http';

function invalid(): never {
  throw new ApiRequestError('protocol');
}
function integer(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}
function version(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.length <= 64 &&
    value.trim() === value
  );
}

/** Full DTO validation is separate from compatibility with the locally compiled engine. */
export function parseBillingConfiguration(value: unknown): BillingConfigDto {
  if (
    !isRecord(value) ||
    value.currency !== 'EUR' ||
    !version(value.pricingVersion) ||
    !Array.isArray(value.tiers) ||
    value.tiers.length === 0 ||
    !isRecord(value.consumptionLimits)
  )
    return invalid();
  const policy: unknown = {
    version: value.taxPolicyVersion,
    ratesByCountry: value.ratesByCountry,
  };
  try {
    validateTaxPolicy(policy);
  } catch {
    return invalid();
  }
  const tiers: BillingConfigDto['tiers'] = value.tiers.map((tier: unknown) => {
    if (
      !isRecord(tier) ||
      !integer(tier.tierFrom) ||
      tier.tierFrom < 1 ||
      !(
        tier.tierTo === null ||
        (integer(tier.tierTo) && tier.tierTo >= tier.tierFrom)
      ) ||
      !integer(tier.unitPriceCents)
    )
      return invalid();
    return {
      tierFrom: tier.tierFrom,
      tierTo: tier.tierTo,
      unitPriceCents: tier.unitPriceCents,
    };
  });
  let expectedFrom = 1;
  for (const [index, tier] of tiers.entries()) {
    if (
      tier.tierFrom !== expectedFrom ||
      (tier.tierTo === null && index !== tiers.length - 1)
    )
      return invalid();
    expectedFrom = (tier.tierTo ?? 0) + 1;
  }
  if (tiers[tiers.length - 1]?.tierTo !== null) return invalid();
  const limits = value.consumptionLimits;
  if (
    !integer(limits.users) ||
    !integer(limits.storageGb) ||
    !integer(limits.apiCalls)
  )
    return invalid();
  return {
    currency: 'EUR',
    pricingVersion: value.pricingVersion,
    taxPolicyVersion: policy.version,
    ratesByCountry: { ...policy.ratesByCountry },
    tiers,
    consumptionLimits: {
      users: limits.users,
      storageGb: limits.storageGb,
      apiCalls: limits.apiCalls,
    },
  };
}

export function isBillingConfigurationCompatible(
  config: BillingConfigDto,
): boolean {
  const local = getPricingConfiguration();
  return (
    config.pricingVersion === local.pricingVersion &&
    config.tiers.length === local.tiers.length &&
    config.tiers.every((tier, index) => {
      const expected = local.tiers[index];
      return (
        expected &&
        tier.tierFrom === expected.tierFrom &&
        tier.tierTo === expected.tierTo &&
        tier.unitPriceCents === expected.unitPriceCents
      );
    }) &&
    (
      Object.keys(CONSUMPTION_LIMITS) as (keyof typeof CONSUMPTION_LIMITS)[]
    ).every((key) => config.consumptionLimits[key] === CONSUMPTION_LIMITS[key])
  );
}

export async function getBillingConfiguration(signal?: AbortSignal) {
  return parseBillingConfiguration(await getJson('/billing-config', signal));
}
