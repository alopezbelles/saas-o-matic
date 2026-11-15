import { parseCustomerId } from './customers.js';
import { InputError } from './input-error.js';
import { CONSUMPTION_LIMITS, type PlanCode } from './persistence-contracts.js';
import { parsePagination, queryValues } from './query.js';
import { BillingError } from './billing/errors.js';
import type { TierBreakdown } from './billing/types.js';
import { assertConsumption } from './billing/validation.js';

export type CreateSimulation = {
  customerId: string;
  users: number;
  storageGb: number;
  apiCalls: number;
};

export type CustomerSnapshotDto = {
  companyName: string;
  taxIdNormalized: string;
  countryCode: string;
  planCode: PlanCode;
};

export type SimulationDto = CreateSimulation & {
  id: string;
  currency: 'EUR';
  baseCents: number;
  taxCents: number;
  totalCents: number;
  taxRateBps: number;
  pricingVersion: string;
  taxPolicyVersion: string;
  breakdown: TierBreakdown[];
  createdAt: string;
  customerSnapshot: CustomerSnapshotDto;
};

export type SimulationQuery = { limit: number; offset: number };
export type SimulationPage = SimulationQuery & {
  items: SimulationDto[];
  total: number;
};

export type BillingConfigDto = {
  currency: 'EUR';
  pricingVersion: string;
  taxPolicyVersion: string;
  tiers: Pick<TierBreakdown, 'tierFrom' | 'tierTo' | 'unitPriceCents'>[];
  ratesByCountry: Record<string, number>;
  consumptionLimits: Record<keyof typeof CONSUMPTION_LIMITS, number>;
};

export function parseCreateSimulation(value: unknown): CreateSimulation {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    throw new InputError('VALIDATION_ERROR', {
      body: 'Se requiere un objeto.',
    });
  const input = value as Record<string, unknown>;
  const keys = ['customerId', 'users', 'storageGb', 'apiCalls'];
  if (Object.keys(input).some((key) => !keys.includes(key)))
    throw new InputError('VALIDATION_ERROR', {
      body: 'Hay campos no admitidos.',
    });
  const missing: Record<string, string> = {};
  for (const key of keys) {
    if (!Object.hasOwn(input, key)) missing[key] = 'Campo obligatorio.';
  }
  if (Object.keys(missing).length)
    throw new InputError('VALIDATION_ERROR', missing);

  const result: CreateSimulation = {
    customerId: parseCustomerId(input.customerId),
    users: 0,
    storageGb: 0,
    apiCalls: 0,
  };
  const fields: Record<string, string> = {};
  for (const field of ['users', 'storageGb', 'apiCalls'] as const) {
    const raw = input[field];
    try {
      assertConsumption(raw, field);
      result[field] = raw;
    } catch (error) {
      if (!(error instanceof BillingError)) throw error;
      fields[field] =
        'Se requiere un entero no negativo dentro del límite admitido.';
    }
  }
  if (Object.keys(fields).length)
    throw new InputError('VALIDATION_ERROR', fields);
  return result;
}

export function parseSimulationQuery(
  entries: Iterable<[string, string]>,
): SimulationQuery {
  return parsePagination(queryValues(entries, ['limit', 'offset']));
}
