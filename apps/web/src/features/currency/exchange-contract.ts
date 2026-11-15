/**
 * Normalized contract only. Provider JSON must enter as unknown and be validated
 * before constructing this value (006-T03). No HTTP or parsing in 006-T01.
 */
export interface ExchangeRates {
  readonly baseCurrency: 'EUR';
  readonly rates: {
    readonly USD: string;
    readonly GBP: string;
  };
  /** UTC ISO-8601 instants, normalized from provider Unix seconds. */
  readonly updatedAt: string;
  readonly expiresAt: string;
  readonly source: {
    readonly name: 'ExchangeRate-API';
    readonly url: 'https://www.exchangerate-api.com';
    readonly attribution: 'Rates By Exchange Rate API';
  };
}

export const EXCHANGE_ERROR_CODES = Object.freeze([
  'EXCHANGE_NETWORK_ERROR',
  'EXCHANGE_TIMEOUT',
  'EXCHANGE_HTTP_ERROR',
  'EXCHANGE_PAYLOAD_INVALID',
  'EXCHANGE_RATE_EXPIRED',
] as const);

export type ExchangeErrorCode = (typeof EXCHANGE_ERROR_CODES)[number];

export class ExchangeError extends Error {
  readonly code: ExchangeErrorCode;

  constructor(code: ExchangeErrorCode) {
    super(code);
    this.name = 'ExchangeError';
    this.code = code;
  }
}
