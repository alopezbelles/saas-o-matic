import type { CurrencyCode, ForeignCurrencyCode } from './catalog.js';

/** Decimal text; runtime validation is required before conversion. */
export type DecimalExchangeRate = string;

export type ConvertCurrencyInput =
  | {
      readonly amountEurCents: number;
      readonly targetCurrency: 'EUR';
    }
  | {
      readonly amountEurCents: number;
      readonly targetCurrency: ForeignCurrencyCode;
      readonly rate: DecimalExchangeRate;
    };

export interface ConvertedMoney {
  readonly amountMinor: number;
  readonly currency: CurrencyCode;
  readonly exponent: 2;
}
