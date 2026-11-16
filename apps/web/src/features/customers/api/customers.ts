import {
  PLAN_CODES,
  parseCustomerId,
  parseCustomerQuery,
  parseCreateCustomer,
  type CreateCustomer,
  type CustomerDto,
  type CustomerPage,
  type CustomerQuery,
} from '@saas-o-matic/shared';
import { ApiRequestError, getJson, postJson, isRecord } from './http';
import { parsePage } from './page';

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
  return parsePage(value, query, parseCustomerDto);
}

export async function getCustomer(
  id: string,
  signal?: AbortSignal,
): Promise<CustomerDto> {
  const validatedId = parseCustomerId(id);
  const customer = parseCustomerDto(
    await getJson('/customers/' + validatedId, signal),
  );
  if (customer.id !== validatedId) return invalidResponse();
  return customer;
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

export async function createCustomer(
  input: CreateCustomer,
  signal?: AbortSignal,
): Promise<CustomerDto> {
  const body = parseCreateCustomer(input);
  const payload = await postJson('/customers', body, signal);
  try {
    return parseCustomerDto(payload);
  } catch {
    throw new ApiRequestError('protocol', 201);
  }
}
