import { CONSUMPTION_LIMITS, PLAN_CODES } from '@saas-o-matic/shared';
export function textValue(
  value: unknown,
  maximum: number,
): asserts value is string {
  if (
    typeof value !== 'string' ||
    !value.length ||
    value.length > maximum ||
    value.trim() !== value
  )
    throw new Error('DB_VALUE_INVALID');
}
export function integerValue(
  value: unknown,
  maximum = Number.MAX_SAFE_INTEGER,
): asserts value is number {
  if (
    typeof value !== 'number' ||
    !Number.isSafeInteger(value) ||
    value < 0 ||
    value > maximum
  )
    throw new Error('DB_INTEGER_INVALID');
}
export function uuid(value: unknown): asserts value is string {
  if (
    typeof value !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    )
  )
    throw new Error('DB_UUID_INVALID');
}
export function dateValue(value: unknown): asserts value is string {
  if (
    typeof value !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) ||
    !Number.isFinite(Date.parse(value)) ||
    new Date(value).toISOString() !== value
  )
    throw new Error('DB_DATE_INVALID');
}
export function country(value: unknown): asserts value is string {
  if (typeof value !== 'string' || !/^[A-Z]{2}$/.test(value))
    throw new Error('DB_COUNTRY_INVALID');
}
export function plan(value: unknown) {
  if (!PLAN_CODES.some((code) => code === value))
    throw new Error('DB_PLAN_INVALID');
}
export type Breakdown = {
  tierFrom: number;
  tierTo: number | null;
  quantity: number;
  unitPriceCents: number;
  subtotalCents: number;
};
export function validateBreakdown(
  value: unknown,
  users: number,
  baseCents: number,
): asserts value is Breakdown[] {
  if (!Array.isArray(value)) throw new Error('DB_BREAKDOWN_INVALID');
  let quantity = 0n;
  let subtotal = 0n;
  for (const item of value) {
    if (
      !item ||
      typeof item !== 'object' ||
      Object.keys(item).sort().join(',') !==
        'quantity,subtotalCents,tierFrom,tierTo,unitPriceCents'
    )
      throw new Error('DB_BREAKDOWN_INVALID');
    integerValue(item.tierFrom);
    if (item.tierFrom < 1) throw new Error('DB_BREAKDOWN_INVALID');
    if (item.tierTo !== null) {
      integerValue(item.tierTo);
      if (item.tierTo < item.tierFrom) throw new Error('DB_BREAKDOWN_INVALID');
    }
    integerValue(item.quantity, CONSUMPTION_LIMITS.users);
    integerValue(item.unitPriceCents);
    integerValue(item.subtotalCents);
    if (
      !item.quantity ||
      BigInt(item.quantity) * BigInt(item.unitPriceCents) !==
        BigInt(item.subtotalCents)
    )
      throw new Error('DB_BREAKDOWN_INVALID');
    quantity += BigInt(item.quantity);
    subtotal += BigInt(item.subtotalCents);
  }
  if (quantity !== BigInt(users) || subtotal !== BigInt(baseCents))
    throw new Error('DB_BREAKDOWN_INVALID');
}
