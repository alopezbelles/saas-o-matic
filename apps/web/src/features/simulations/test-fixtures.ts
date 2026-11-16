import {
  CONSUMPTION_LIMITS,
  getPricingConfiguration,
  type BillingConfigDto,
} from '@saas-o-matic/shared';

export function configurationFixture(): BillingConfigDto {
  return {
    currency: 'EUR',
    ...getPricingConfiguration(),
    taxPolicyVersion: 'demo-standard-v1',
    ratesByCountry: { ES: 2100, FR: 2000, DE: 1900, GB: 2000 },
    consumptionLimits: { ...CONSUMPTION_LIMITS },
  };
}
