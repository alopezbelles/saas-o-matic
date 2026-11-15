import { Router } from 'express';
import {
  CONSUMPTION_LIMITS,
  getPricingConfiguration,
  validateTaxPolicy,
  type BillingConfigDto,
  type TaxPolicy,
} from '@saas-o-matic/shared';
import { taxPolicy } from '../../config/tax-policy.js';

export function billingRoutes(policy: TaxPolicy = taxPolicy) {
  const router = Router();
  router.get('/', (_request, response) => {
    validateTaxPolicy(policy);
    const config: BillingConfigDto = {
      currency: 'EUR',
      ...getPricingConfiguration(),
      taxPolicyVersion: policy.version,
      ratesByCountry: { ...policy.ratesByCountry },
      consumptionLimits: { ...CONSUMPTION_LIMITS },
    };
    response.setHeader('Cache-Control', 'no-store');
    response.json(config);
  });
  return router;
}
