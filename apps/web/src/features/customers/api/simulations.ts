import {
  PLAN_CODES,
  parseCustomerId,
  parseSimulationQuery,
  type SimulationDto,
  type SimulationQuery,
  type TierBreakdown,
} from '@saas-o-matic/shared';
import { ApiRequestError, getJson, isRecord } from './http';
import { parsePage } from './page';

function invalid(): never {
  throw new ApiRequestError('protocol');
}
function integer(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}
function text(value: unknown, maximum: number): value is string {
  return (
    typeof value === 'string' && value.length > 0 && value.length <= maximum
  );
}
function uuid(value: unknown) {
  try {
    return parseCustomerId(value);
  } catch {
    return invalid();
  }
}

/** Validate stored structure and arithmetic consistency, without today's pricing/tax policy. */
export function parseSimulationDto(
  value: unknown,
  customerId: string,
): SimulationDto {
  if (!isRecord(value)) return invalid();
  const id = uuid(value.id);
  if (
    uuid(value.customerId) !== customerId ||
    value.currency !== 'EUR' ||
    !integer(value.users) ||
    !integer(value.storageGb) ||
    !integer(value.apiCalls) ||
    !integer(value.baseCents) ||
    !integer(value.taxCents) ||
    !integer(value.totalCents) ||
    !integer(value.taxRateBps) ||
    value.taxRateBps > 10000 ||
    !text(value.pricingVersion, 64) ||
    !text(value.taxPolicyVersion, 64) ||
    typeof value.createdAt !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value.createdAt) ||
    !Number.isFinite(Date.parse(value.createdAt)) ||
    new Date(value.createdAt).toISOString() !== value.createdAt ||
    BigInt(value.baseCents) + BigInt(value.taxCents) !==
      BigInt(value.totalCents)
  )
    return invalid();
  const snapshot = value.customerSnapshot;
  if (
    !isRecord(snapshot) ||
    !text(snapshot.companyName, 200) ||
    !text(snapshot.taxIdNormalized, 64) ||
    typeof snapshot.countryCode !== 'string' ||
    !/^[A-Z]{2}$/.test(snapshot.countryCode) ||
    !PLAN_CODES.some((plan) => plan === snapshot.planCode)
  )
    return invalid();
  if (!Array.isArray(value.breakdown)) return invalid();
  const breakdown: TierBreakdown[] = value.breakdown.map((item: unknown) => {
    if (
      !isRecord(item) ||
      !integer(item.tierFrom) ||
      item.tierFrom < 1 ||
      !(
        item.tierTo === null ||
        (integer(item.tierTo) && item.tierTo >= item.tierFrom)
      ) ||
      !integer(item.quantity) ||
      item.quantity === 0 ||
      !integer(item.unitPriceCents) ||
      !integer(item.subtotalCents) ||
      BigInt(item.quantity) * BigInt(item.unitPriceCents) !==
        BigInt(item.subtotalCents)
    )
      return invalid();
    return {
      tierFrom: item.tierFrom,
      tierTo: item.tierTo,
      quantity: item.quantity,
      unitPriceCents: item.unitPriceCents,
      subtotalCents: item.subtotalCents,
    };
  });
  if (
    breakdown.reduce((sum, item) => sum + BigInt(item.quantity), 0n) !==
      BigInt(value.users) ||
    breakdown.reduce((sum, item) => sum + BigInt(item.subtotalCents), 0n) !==
      BigInt(value.baseCents)
  )
    return invalid();
  return {
    id,
    customerId,
    users: value.users,
    storageGb: value.storageGb,
    apiCalls: value.apiCalls,
    currency: 'EUR',
    baseCents: value.baseCents,
    taxCents: value.taxCents,
    totalCents: value.totalCents,
    taxRateBps: value.taxRateBps,
    pricingVersion: value.pricingVersion,
    taxPolicyVersion: value.taxPolicyVersion,
    breakdown,
    createdAt: value.createdAt,
    customerSnapshot: {
      companyName: snapshot.companyName,
      taxIdNormalized: snapshot.taxIdNormalized,
      countryCode: snapshot.countryCode,
      planCode:
        snapshot.planCode as SimulationDto['customerSnapshot']['planCode'],
    },
  };
}

export function parseSimulationPage(
  value: unknown,
  customerId: string,
  query: SimulationQuery,
) {
  return parsePage(value, query, (item) =>
    parseSimulationDto(item, customerId),
  );
}

export async function listSimulations(
  customerId: string,
  query: SimulationQuery,
  signal?: AbortSignal,
) {
  const id = parseCustomerId(customerId);
  const params = new URLSearchParams({
    limit: String(query.limit),
    offset: String(query.offset),
  });
  const validated = parseSimulationQuery(params.entries());
  return parseSimulationPage(
    await getJson(
      '/customers/' + id + '/simulations?' + params.toString(),
      signal,
    ),
    id,
    validated,
  );
}
