// Independent expected values from spec 004. No production billing algorithm.
// These fixtures are test data, never the application's pricing configuration.
export const pricingVersion = 'users-tiered-v1';

export const tierCases = [
  { users: 0, baseCents: 0, quantities: [] },
  { users: 10, baseCents: 10000, quantities: [10] },
  { users: 11, baseCents: 10800, quantities: [10, 1] },
  { users: 15, baseCents: 14000, quantities: [10, 5] },
  { users: 50, baseCents: 42000, quantities: [10, 40] },
  { users: 51, baseCents: 42500, quantities: [10, 40, 1] },
  { users: 1000, baseCents: 517000, quantities: [10, 40, 950] },
];

// A fully written oracle catches a wrong tier boundary or line representation.
export const fiftyOneUserBreakdown = [
  {
    tierFrom: 1,
    tierTo: 10,
    quantity: 10,
    unitPriceCents: 1000,
    subtotalCents: 10000,
  },
  {
    tierFrom: 11,
    tierTo: 50,
    quantity: 40,
    unitPriceCents: 800,
    subtotalCents: 32000,
  },
  {
    tierFrom: 51,
    tierTo: null,
    quantity: 1,
    unitPriceCents: 500,
    subtotalCents: 500,
  },
];

export const demoPolicyFixture = {
  version: 'demo-standard-v1',
  ratesByCountry: { ES: 2100, FR: 2000, DE: 1900, GB: 2000 },
};

export const quoteCases = [
  {
    countryCode: 'ES',
    users: 15,
    baseCents: 14000,
    taxCents: 2940,
    totalCents: 16940,
  },
  {
    countryCode: 'FR',
    users: 15,
    baseCents: 14000,
    taxCents: 2800,
    totalCents: 16800,
  },
  {
    countryCode: 'DE',
    users: 15,
    baseCents: 14000,
    taxCents: 2660,
    totalCents: 16660,
  },
  {
    countryCode: 'GB',
    users: 15,
    baseCents: 14000,
    taxCents: 2800,
    totalCents: 16800,
  },
  {
    countryCode: 'ES',
    users: 51,
    baseCents: 42500,
    taxCents: 8925,
    totalCents: 51425,
  },
  { countryCode: 'ES', users: 0, baseCents: 0, taxCents: 0, totalCents: 0 },
];

// Synthetic helper inputs only; these are not product tax policies.
export const roundingCases = [
  { baseCents: 1, rateBps: 4999, taxCents: 0 },
  { baseCents: 1, rateBps: 5000, taxCents: 1 },
  { baseCents: 1, rateBps: 5001, taxCents: 1 },
  { baseCents: 14000, rateBps: 0, taxCents: 0 },
];

export const consumptionCases = [
  { field: 'users', minimum: 0, maximum: 1000, overMaximum: 1001 },
  { field: 'storageGb', minimum: 0, maximum: 10000, overMaximum: 10001 },
  { field: 'apiCalls', minimum: 0, maximum: 10000000, overMaximum: 10000001 },
];

export const invalidConsumptionValues = [
  -1,
  0.5,
  NaN,
  Infinity,
  -Infinity,
  Number.MAX_SAFE_INTEGER + 1,
  '15',
  null,
  undefined,
  true,
  {},
  [],
];

export const invalidCountryValues = ['', 'es', 'ESP', ' ES', 'E1', 34, null];
export const unsupportedCountry = 'IT';

export const invalidPolicyCases = [
  { label: 'missing policy', policy: undefined },
  { label: 'null policy', policy: null },
  { label: 'array policy', policy: [] },
  { label: 'empty version', policy: { version: '', ratesByCountry: {} } },
  {
    label: 'padded version',
    policy: { version: ' demo ', ratesByCountry: {} },
  },
  {
    label: 'long version',
    policy: { version: 'x'.repeat(65), ratesByCountry: {} },
  },
  { label: 'missing rates', policy: { version: 'synthetic-v1' } },
  {
    label: 'null rates',
    policy: { version: 'synthetic-v1', ratesByCountry: null },
  },
  {
    label: 'array rates',
    policy: { version: 'synthetic-v1', ratesByCountry: [] },
  },
  ...[-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1, '2100'].map(
    (rate, index) => ({
      label: `invalid rate ${index}`,
      policy: { version: 'synthetic-v1', ratesByCountry: { ES: rate } },
    }),
  ),
];

export const overflowCase = {
  baseCents: Number.MAX_SAFE_INTEGER,
  rateBps: 10001,
  code: 'BILLING_MONEY_OVERFLOW',
};

export const errorCases = [
  {
    label: 'invalid consumption or country format',
    code: 'BILLING_INPUT_INVALID',
  },
  { label: 'invalid policy', code: 'BILLING_POLICY_INVALID' },
  {
    label: 'country absent from valid policy',
    code: 'TAX_COUNTRY_UNSUPPORTED',
  },
  { label: 'invalid helper amount', code: 'BILLING_MONEY_INVALID' },
  { label: 'unsafe money result', code: 'BILLING_MONEY_OVERFLOW' },
];
