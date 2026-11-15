import { PLAN_CODES, type PlanCode } from './persistence-contracts.js';
import { InputError } from './input-error.js';
import { parsePagination, queryValues } from './query.js';
export { InputError } from './input-error.js';

export type CreateCustomer = {
  companyName: string;
  taxId: string;
  contactEmail: string;
  countryCode: string;
  planCode: PlanCode;
};
export type CustomerDto = CreateCustomer & {
  id: string;
  taxIdNormalized: string;
  createdAt: string;
};
export type CustomerQuery = { q: string; limit: number; offset: number };
export type CustomerPage = {
  items: CustomerDto[];
  total: number;
  limit: number;
  offset: number;
};
export type ApiError = {
  error: {
    code: string;
    message: string;
    requestId: string;
    fields?: Record<string, string>;
  };
};
const controls = /[\p{Cc}]/u;
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new InputError('VALIDATION_ERROR', {
      body: 'Se requiere un objeto.',
    });
  return value as Record<string, unknown>;
}
function email(value: string) {
  if (value.length > 254 || !/^[\x21-\x7e]+$/.test(value)) return false;
  const parts = value.split('@');
  if (parts.length !== 2) return false;
  const [local = '', domain = ''] = parts;
  if (/^[0-9.]+$/.test(domain)) return false;
  if (
    !local.length ||
    local.length > 64 ||
    !/^[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]+$/.test(local) ||
    local.startsWith('.') ||
    local.endsWith('.') ||
    local.includes('..')
  )
    return false;
  const labels = domain.split('.');
  return (
    labels.length >= 2 &&
    labels.every(
      (label) =>
        label.length <= 63 &&
        /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(label),
    )
  );
}
export function parseCreateCustomer(value: unknown): CreateCustomer {
  const input = object(value);
  const keys = [
    'companyName',
    'taxId',
    'contactEmail',
    'countryCode',
    'planCode',
  ];
  if (Object.keys(input).some((key) => !keys.includes(key)))
    throw new InputError('VALIDATION_ERROR', {
      body: 'Hay campos no admitidos.',
    });
  const fields: Record<string, string> = {};
  const result: Record<string, string> = {};
  const maximum: Record<string, number> = {
    companyName: 200,
    taxId: 64,
    contactEmail: 254,
    countryCode: 2,
    planCode: 64,
  };
  for (const key of keys) {
    const raw = input[key];
    if (typeof raw !== 'string' || controls.test(raw)) {
      fields[key] = 'Se requiere texto sin caracteres de control.';
      continue;
    }
    const text =
      key === 'companyName' ? raw.trim().normalize('NFC') : raw.trim();
    if (!text.length || text.length > maximum[key]!)
      fields[key] = 'Longitud no admitida.';
    result[key] = text;
  }
  const country = result.countryCode?.toUpperCase();
  if ((result.taxId?.toUpperCase().length ?? 0) > 64)
    fields.taxId = 'Longitud normalizada no admitida.';
  if (!country || !/^[A-Z]{2}$/.test(country))
    fields.countryCode = 'Usa un código de país de dos letras.';
  if (!email(result.contactEmail ?? ''))
    fields.contactEmail = 'Introduce un email válido.';
  if (!PLAN_CODES.some((plan) => plan === result.planCode))
    fields.planCode = 'Plan no admitido.';
  if (Object.keys(fields).length)
    throw new InputError('VALIDATION_ERROR', fields);
  return {
    companyName: result.companyName!,
    taxId: result.taxId!,
    contactEmail: result.contactEmail!,
    countryCode: country!,
    planCode: result.planCode as PlanCode,
  };
}
export function parseCustomerQuery(
  entries: Iterable<[string, string]>,
): CustomerQuery {
  const values = queryValues(entries, ['q', 'limit', 'offset']);
  const raw = values.get('q') ?? '';
  const q = raw.trim();
  if (controls.test(raw) || q.length > 200)
    throw new InputError('INVALID_QUERY');
  return {
    q,
    ...parsePagination(values),
  };
}
export function parseCustomerId(value: unknown): string {
  if (
    typeof value !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    )
  )
    throw new InputError('INVALID_CUSTOMER_ID');
  return value.toLowerCase();
}
