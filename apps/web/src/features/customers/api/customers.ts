import {
  PLAN_CODES,
  parseCustomerId,
  parseCustomerQuery,
  type CustomerDto,
  type CustomerPage,
  type CustomerQuery,
} from '@saas-o-matic/shared';
import { ApiRequestError, getJson, isRecord } from './http';

function invalidResponse(): never {
  throw new ApiRequestError('protocol');
}

function text(value: unknown, maximum: number): value is string {
  return (
    typeof value === 'string' && value.length > 0 && value.length <= maximum
  );
}

/** Validate response structure without imposing new-input rules on legacy rows. */
export function parseCustomerDto(value: unknown): CustomerDto {
  if (!isRecord(value)) return invalidResponse();
  let id: string;
  try {
    id = parseCustomerId(value.id);
  } catch {
    return invalidResponse();
  }
  if (
    !text(value.companyName, 200) ||
    !text(value.taxId, 64) ||
    !text(value.taxIdNormalized, 64) ||
    !text(value.contactEmail, 254) ||
    typeof value.countryCode !== 'string' ||
    !/^[A-Z]{2}$/.test(value.countryCode) ||
    !PLAN_CODES.some((plan) => plan === value.planCode) ||
    typeof value.createdAt !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}T.*Z$/.test(value.createdAt) ||
    !Number.isFinite(Date.parse(value.createdAt))
  )
    return invalidResponse();
  return {
    id,
    companyName: value.companyName,
    taxId: value.taxId,
    taxIdNormalized: value.taxIdNormalized,
    contactEmail: value.contactEmail,
    countryCode: value.countryCode,
    planCode: value.planCode as CustomerDto['planCode'],
    createdAt: value.createdAt,
  };
}

export function parseCustomerPage(
  value: unknown,
  query: CustomerQuery,
): CustomerPage {
  if (
    !isRecord(value) ||
    !Array.isArray(value.items) ||
    typeof value.total !== 'number' ||
    !Number.isSafeInteger(value.total) ||
    value.total < 0 ||
    value.limit !== query.limit ||
    value.offset !== query.offset ||
    value.items.length !==
      Math.min(query.limit, Math.max(value.total - query.offset, 0))
  )
    return invalidResponse();
  const items = value.items.map(parseCustomerDto);
  if (new Set(items.map((item) => item.id)).size !== items.length)
    return invalidResponse();
  return {
    items,
    total: value.total,
    limit: query.limit,
    offset: query.offset,
  };
}

export async function listCustomers(
  query: CustomerQuery,
  signal?: AbortSignal,
): Promise<CustomerPage> {
  const params = new URLSearchParams({
    q: query.q,
    limit: String(query.limit),
    offset: String(query.offset),
  });
  const validated = parseCustomerQuery(params.entries());
  return parseCustomerPage(
    await getJson('/customers?' + params.toString(), signal),
    validated,
  );
}
