// Fixed instants: never depend on wall clock or the live provider.
export const nowMs = Date.parse('2026-01-15T12:00:00Z');

export function providerSuccess() {
  return {
    result: 'success',
    base_code: 'EUR',
    time_last_update_unix: 1768435200,
    time_next_update_unix: 1768521600,
    rates: { EUR: 1, USD: 1.1, GBP: 0.8, JPY: 170 },
  };
}

export function normalizedRates() {
  return {
    baseCurrency: 'EUR',
    rates: { USD: '1.1', GBP: '0.8' },
    updatedAt: '2026-01-15T00:00:00.000Z',
    expiresAt: '2026-01-16T00:00:00.000Z',
    source: {
      name: 'ExchangeRate-API',
      url: 'https://www.exchangerate-api.com',
      attribution: 'Rates By Exchange Rate API',
    },
  };
}

// These are test inputs for T03, not payloads already rejected by production.
export function invalidProviderCases() {
  const missingGbp = providerSuccess();
  delete missingGbp.rates.GBP;
  return [
    {
      name: 'logical error',
      payload: { result: 'error', 'error-type': 'invalid-key' },
    },
    { name: 'wrong base', payload: { ...providerSuccess(), base_code: 'USD' } },
    { name: 'missing GBP', payload: missingGbp },
    {
      name: 'zero rate',
      payload: { ...providerSuccess(), rates: { EUR: 1, USD: 0, GBP: 0.8 } },
    },
    {
      name: 'negative rate',
      payload: { ...providerSuccess(), rates: { EUR: 1, USD: -1, GBP: 0.8 } },
    },
    {
      name: 'non-finite rate',
      payload: { ...providerSuccess(), rates: { EUR: 1, USD: NaN, GBP: 0.8 } },
    },
    {
      name: 'wrong identity',
      payload: { ...providerSuccess(), rates: { EUR: 2, USD: 1.1, GBP: 0.8 } },
    },
    {
      name: 'expired',
      payload: { ...providerSuccess(), time_next_update_unix: nowMs / 1000 },
    },
    {
      name: 'future update',
      payload: {
        ...providerSuccess(),
        time_last_update_unix: nowMs / 1000 + 1,
      },
    },
    {
      name: 'inconsistent timestamps',
      payload: { ...providerSuccess(), time_next_update_unix: 1768435200 },
    },
    { name: 'null', payload: null },
  ];
}

export const transportCases = [
  { name: 'rate limited', status: 429, expectedCode: 'EXCHANGE_HTTP_ERROR' },
  { name: 'network failure', expectedCode: 'EXCHANGE_NETWORK_ERROR' },
  { name: 'timeout', expectedCode: 'EXCHANGE_TIMEOUT' },
  { name: 'invalid JSON', expectedCode: 'EXCHANGE_PAYLOAD_INVALID' },
];
