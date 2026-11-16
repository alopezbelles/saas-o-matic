import { useMemo } from 'react';
import {
  calculateQuote,
  type BillingConfigDto,
  type BillingQuote,
} from '@saas-o-matic/shared';
import type { parseConsumptionDraft } from './consumption';

export type Preview =
  | { status: 'unavailable' | 'invalid' | 'error' }
  | { status: 'success'; quote: BillingQuote };
export function useSimulationQuote(
  consumption: ReturnType<typeof parseConsumptionDraft>,
  countryCode: string | null,
  config: BillingConfigDto | null,
): Preview {
  return useMemo(() => {
    if (!countryCode || !config) return { status: 'unavailable' };
    if (!consumption) return { status: 'invalid' };
    try {
      return {
        status: 'success',
        quote: calculateQuote(
          { ...consumption, countryCode },
          {
            version: config.taxPolicyVersion,
            ratesByCountry: config.ratesByCountry,
          },
        ),
      };
    } catch {
      return { status: 'error' };
    }
  }, [consumption, countryCode, config]);
}
