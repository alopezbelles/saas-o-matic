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
