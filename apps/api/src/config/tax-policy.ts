import type { TaxPolicy } from '@saas-o-matic/shared';

// Simplified simulation policy, not complete tax treatment of real transactions.
// Published rates and version must evolve together; do not edit this version.
export const taxPolicy = Object.freeze({
  version: 'demo-standard-v1',
  ratesByCountry: Object.freeze({ ES: 2100, FR: 2000, DE: 1900, GB: 2000 }),
}) satisfies TaxPolicy;
