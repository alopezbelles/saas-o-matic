/**
 * Provider JSON enters as unknown. Only validated rates cross this boundary.
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

function invalidPayload(): never {
  throw new ExchangeError('EXCHANGE_PAYLOAD_INVALID');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function ownValue(record: Record<string, unknown>, key: string): unknown {
  return Object.hasOwn(record, key) ? record[key] : undefined;
}

function timestampMs(value: unknown): number {
  if (
    typeof value !== 'number' ||
    !Number.isSafeInteger(value) ||
    value < 0 ||
    !Number.isSafeInteger(value * 1000) ||
    value * 1000 > 8_640_000_000_000_000
  ) {
    return invalidPayload();
  }
  return value * 1000;
}

function decimalRate(value: unknown): string {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return invalidPayload();
  }
  return String(value);
}

/** Pure normalization: caller supplies current time in epoch milliseconds. */
export function parseExchangeRates(
  payload: unknown,
  nowMs: number,
): ExchangeRates {
  if (
    !Number.isSafeInteger(nowMs) ||
    nowMs < 0 ||
    nowMs > 8_640_000_000_000_000 ||
    !isRecord(payload) ||
    ownValue(payload, 'result') !== 'success' ||
    ownValue(payload, 'base_code') !== 'EUR'
  ) {
    return invalidPayload();
  }
  const rates = ownValue(payload, 'rates');
  if (!isRecord(rates) || ownValue(rates, 'EUR') !== 1) {
    return invalidPayload();
  }
  const usd = decimalRate(ownValue(rates, 'USD'));
  const gbp = decimalRate(ownValue(rates, 'GBP'));
  const updatedMs = timestampMs(ownValue(payload, 'time_last_update_unix'));
  const expiresMs = timestampMs(ownValue(payload, 'time_next_update_unix'));
  if (updatedMs > nowMs || expiresMs <= updatedMs) {
    return invalidPayload();
  }
  if (expiresMs <= nowMs) {
    throw new ExchangeError('EXCHANGE_RATE_EXPIRED');
  }
  return Object.freeze({
    baseCurrency: 'EUR',
    rates: Object.freeze({ USD: usd, GBP: gbp }),
    updatedAt: new Date(updatedMs).toISOString(),
    expiresAt: new Date(expiresMs).toISOString(),
    source: Object.freeze({
      name: 'ExchangeRate-API',
      url: 'https://www.exchangerate-api.com',
      attribution: 'Rates By Exchange Rate API',
    }),
  });
}
