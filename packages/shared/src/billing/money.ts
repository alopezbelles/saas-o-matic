import { BillingError } from './errors.js';

export function assertMoneyCents(
  value: unknown,
  field = 'amountCents',
): asserts value is number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) {
    throw new BillingError('BILLING_MONEY_INVALID', field);
  }
}

export function toSafeCents(value: bigint): number {
  if (typeof value !== 'bigint' || value < 0n) {
    throw new BillingError('BILLING_MONEY_INVALID');
  }
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new BillingError('BILLING_MONEY_OVERFLOW');
  }
  return Number(value);
}

export function roundHalfUp(numerator: bigint, denominator: bigint): bigint {
  if (
    typeof numerator !== 'bigint' ||
    typeof denominator !== 'bigint' ||
    numerator < 0n ||
    denominator <= 0n
  ) {
    throw new BillingError('BILLING_MONEY_INVALID');
  }
  return (2n * numerator + denominator) / (2n * denominator);
}
