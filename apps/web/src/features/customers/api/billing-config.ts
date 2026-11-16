import { validateTaxPolicy } from '@saas-o-matic/shared';
import { countryLabel } from '../customer-labels';
import { ApiRequestError, getJson, isRecord } from './http';

export interface CustomerCountry {
  code: string;
  label: string;
}

/** Validate only the configuration projection consumed by the form. */
export function parseCustomerCountries(value: unknown): CustomerCountry[] {
  if (!isRecord(value) || value.currency !== 'EUR')
    throw new ApiRequestError('protocol');
  const policy: unknown = {
    version: value.taxPolicyVersion,
    ratesByCountry: value.ratesByCountry,
  };
  try {
    validateTaxPolicy(policy);
  } catch {
    throw new ApiRequestError('protocol');
  }
  const countries = Object.keys(policy.ratesByCountry).map((code) => ({
    code,
    label: countryLabel(code),
  }));
  if (!countries.length) throw new ApiRequestError('protocol');
  return countries.sort((a, b) => a.label.localeCompare(b.label, 'es'));
}

export async function getCustomerCountries(signal?: AbortSignal) {
  return parseCustomerCountries(await getJson('/billing-config', signal));
}
