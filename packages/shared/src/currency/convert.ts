import {
  assertMoneyCents,
  roundHalfUp,
  toSafeCents,
} from '../billing/money.js';
import { BillingError } from '../billing/errors.js';
import { CURRENCY_EXPONENTS, type CurrencyCode } from './catalog.js';
import { CurrencyError } from './errors.js';
import type { ConvertCurrencyInput, ConvertedMoney } from './types.js';

const MAX_RATE_LENGTH = 64;
const MAX_RATE_EXPONENT = 324;

function parseRate(value: unknown): { numerator: bigint; denominator: bigint } {
  if (typeof value !== 'string' || value.length > MAX_RATE_LENGTH) {
    throw new CurrencyError('CURRENCY_RATE_INVALID');
  }
  const match = /^(\d+)(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/.exec(value);
  if (
    !match ||
    match[0] !== value ||
    !Number.isFinite(Number(value)) ||
    Number(value) <= 0
  ) {
    throw new CurrencyError('CURRENCY_RATE_INVALID');
  }
  const fraction = match[2] ?? '';
  const exponent = Number(match[3] ?? '0');
  if (
    !Number.isSafeInteger(exponent) ||
    Math.abs(exponent) > MAX_RATE_EXPONENT
  ) {
    throw new CurrencyError('CURRENCY_RATE_INVALID');
  }
  const digits = BigInt(match[1]! + fraction);
  const scale = fraction.length - exponent;
  return scale >= 0
    ? { numerator: digits, denominator: 10n ** BigInt(scale) }
    : { numerator: digits * 10n ** BigInt(-scale), denominator: 1n };
}

/** Convert only the final EUR total. No date, network or persistence effects. */
export function convertCurrency(input: ConvertCurrencyInput): ConvertedMoney {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    throw new CurrencyError('CURRENCY_AMOUNT_INVALID');
  }
  try {
    assertMoneyCents(input.amountEurCents);
  } catch {
    throw new CurrencyError('CURRENCY_AMOUNT_INVALID');
  }
  const currency = input.targetCurrency;
  if (
    typeof currency !== 'string' ||
    !Object.hasOwn(CURRENCY_EXPONENTS, currency)
  ) {
    throw new CurrencyError('CURRENCY_UNSUPPORTED');
  }
  const exponent = CURRENCY_EXPONENTS[currency as CurrencyCode];
  if (currency === 'EUR') {
    return { amountMinor: input.amountEurCents, currency, exponent };
  }
  const { numerator, denominator } = parseRate(
    'rate' in input ? input.rate : undefined,
  );
  const rounded = roundHalfUp(
    BigInt(input.amountEurCents) * numerator * 10n ** BigInt(exponent),
    denominator * 100n,
  );
  try {
    return { amountMinor: toSafeCents(rounded), currency, exponent };
  } catch (error) {
    if (
      error instanceof BillingError &&
      error.code === 'BILLING_MONEY_OVERFLOW'
    ) {
      throw new CurrencyError('CURRENCY_MONEY_OVERFLOW');
    }
    throw error;
  }
}
