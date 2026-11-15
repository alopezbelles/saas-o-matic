import { CONSUMPTION_LIMITS } from '../persistence-contracts.js';
import { BillingError } from './errors.js';

export function assertConsumption(
  value: unknown,
  field: keyof typeof CONSUMPTION_LIMITS,
): asserts value is number {
  if (
    typeof value !== 'number' ||
    !Number.isSafeInteger(value) ||
    value < 0 ||
    value > CONSUMPTION_LIMITS[field]
  ) {
    throw new BillingError('BILLING_INPUT_INVALID', field);
  }
}
