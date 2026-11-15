export const CURRENCY_EXPONENTS = Object.freeze({
  EUR: 2,
  USD: 2,
  GBP: 2,
} as const);

export type CurrencyCode = keyof typeof CURRENCY_EXPONENTS;
export type ForeignCurrencyCode = Exclude<CurrencyCode, 'EUR'>;
