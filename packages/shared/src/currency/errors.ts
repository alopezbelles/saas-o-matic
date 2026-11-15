export const CURRENCY_ERROR_CODES = Object.freeze([
  'CURRENCY_AMOUNT_INVALID',
  'CURRENCY_UNSUPPORTED',
  'CURRENCY_RATE_INVALID',
  'CURRENCY_MONEY_OVERFLOW',
] as const);

export type CurrencyErrorCode = (typeof CURRENCY_ERROR_CODES)[number];

export class CurrencyError extends Error {
  readonly code: CurrencyErrorCode;

  constructor(code: CurrencyErrorCode) {
    super(code);
    this.name = 'CurrencyError';
    this.code = code;
  }
}
