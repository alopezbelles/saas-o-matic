export function customerFixture(index = 1) {
  return {
    id: '00000000-0000-4000-8000-' + String(index).padStart(12, '0'),
    companyName: 'Empresa ' + index,
    taxId: 'FISCAL-' + index,
    taxIdNormalized: 'FISCAL-' + index,
    contactEmail: 'contacto@example.invalid',
    countryCode: 'ES',
    planCode: 'DEMO_BASIC',
    createdAt: '2026-01-01T00:00:00.000Z',
  };
}

export function pageFixture(count = 1, total = count, offset = 0) {
  return {
    items: Array.from({ length: count }, (_, index) =>
      customerFixture(offset + index + 1),
    ),
    total,
    limit: 20,
    offset,
  };
}

export function jsonResponse(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function billingConfigFixture() {
  return {
    currency: 'EUR',
    pricingVersion: 'users-tiered-v1',
    taxPolicyVersion: 'demo-standard-v1',
    ratesByCountry: { ES: 2100, FR: 2000, DE: 1900, GB: 2000 },
    tiers: [],
    consumptionLimits: { users: 1000, storageGb: 10000, apiCalls: 10000000 },
  };
}

export function customerInputFixture() {
  return {
    companyName: 'Empresa Nueva',
    taxId: '12345678Z',
    contactEmail: 'nueva@example.invalid',
    countryCode: 'ES',
    planCode: 'DEMO_BASIC' as const,
  };
}

export function simulationFixture(
  index = 1,
  customerId = customerFixture().id,
) {
  return {
    id: '10000000-0000-4000-8000-' + String(index).padStart(12, '0'),
    customerId,
    users: 2,
    storageGb: 50,
    apiCalls: 10000,
    currency: 'EUR',
    baseCents: 2468,
    taxCents: 123,
    totalCents: 2591,
    taxRateBps: 500,
    pricingVersion: 'historical-price-v0',
    taxPolicyVersion: 'historical-tax-v0',
    breakdown: [
      {
        tierFrom: 1,
        tierTo: 2,
        quantity: 2,
        unitPriceCents: 1234,
        subtotalCents: 2468,
      },
    ],
    createdAt: '2026-01-01T12:00:00.000Z',
    customerSnapshot: {
      companyName: 'Nombre histórico',
      taxIdNormalized: 'HISTORICAL',
      countryCode: 'PT',
      planCode: 'DEMO_PRO',
    },
  };
}

export function historyFixture(
  count = 1,
  total = count,
  offset = 0,
  customerId = customerFixture().id,
) {
  return {
    items: Array.from({ length: count }, (_, index) =>
      simulationFixture(offset + index + 1, customerId),
    ),
    total,
    limit: 20,
    offset,
  };
}
