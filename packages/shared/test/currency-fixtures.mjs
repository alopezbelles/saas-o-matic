// Independent expected amounts, not computed using production conversion.
export const conversionCases = [
  {
    amountEurCents: 16940,
    targetCurrency: 'USD',
    rate: '1.1',
    amountMinor: 18634,
  },
  {
    amountEurCents: 16940,
    targetCurrency: 'GBP',
    rate: '0.8',
    amountMinor: 13552,
  },
  { amountEurCents: 1, targetCurrency: 'USD', rate: '0.5', amountMinor: 1 },
  { amountEurCents: 1, targetCurrency: 'GBP', rate: '0.49', amountMinor: 0 },
  { amountEurCents: 0, targetCurrency: 'USD', rate: '1.1', amountMinor: 0 },
  {
    amountEurCents: 100,
    targetCurrency: 'USD',
    rate: '1.1e-2',
    amountMinor: 1,
  },
];

export const invalidAmounts = [
  -1,
  0.5,
  NaN,
  Infinity,
  Number.MAX_SAFE_INTEGER + 1,
  '100',
  null,
];
export const invalidRates = [
  '',
  '0',
  '-1',
  'NaN',
  'Infinity',
  '1.2.3',
  ' 1.1 ',
  1.1,
  null,
];
export const unsupportedCurrencies = ['JPY', 'KWD', 'usd', '', null];
export const overflowCase = {
  amountEurCents: Number.MAX_SAFE_INTEGER,
  targetCurrency: 'USD',
  rate: '2',
};
