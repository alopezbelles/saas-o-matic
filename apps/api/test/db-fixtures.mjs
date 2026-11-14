import { rmSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { createTestContext, projectRoot, within } from '../dist/db/paths.js';
import { migrateDatabase } from '../dist/db/migrate.js';
import { openDatabase } from '../dist/db/connection.js';

export const customer = (overrides = {}) => ({
  id: randomUUID(),
  companyName: 'Empresa de prueba',
  taxIdOriginal: '000test',
  contactName: 'Contacto de prueba',
  contactEmail: 'test@example.invalid',
  countryCode: 'ES',
  planCode: 'DEMO_BASIC',
  createdAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});
export const simulation = (customerId, overrides = {}) => ({
  customerId,
  currency: 'EUR',
  users: 1,
  storageGb: 0,
  apiCalls: 0,
  baseCents: 123,
  taxCents: 7,
  totalCents: 130,
  taxRateBps: 557,
  pricingVersion: 'technical-fixture',
  taxPolicyVersion: 'not-a-real-tax-policy',
  breakdown: [
    {
      tierFrom: 1,
      tierTo: null,
      quantity: 1,
      unitPriceCents: 123,
      subtotalCents: 123,
    },
  ],
  createdAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});
export function testArea(t) {
  const context = createTestContext();
  t.after(() => {
    if (
      !within(path.join(projectRoot, '.cache/002-tests'), context.directory) ||
      !path.basename(context.directory).startsWith('case-')
    )
      throw new Error('Unsafe test cleanup');
    rmSync(context.directory, { recursive: true, force: true });
  });
  return context;
}
export function fixture(t, kind = 'test') {
  const context = testArea(t);
  const options = {
    path: path.join(context.directory, 'database.sqlite'),
    kind,
    context,
  };
  migrateDatabase(options);
  const connections = [];
  const connect = () => {
    const db = openDatabase(options);
    connections.push(db);
    return db;
  };
  const db = connect();
  // The fixture's testArea hook needs no open handles at cleanup on Windows.
  const originalClose = () => {
    for (const item of connections) if (item.open) item.close();
  };
  return { context, options, db, connect, close: originalClose };
}
export function insertRaw(db, table, row) {
  const keys = Object.keys(row);
  db.prepare(
    'INSERT INTO ' +
      table +
      ' (' +
      keys.map((key) => '"' + key + '"').join(',') +
      ') VALUES (' +
      keys.map(() => '?').join(',') +
      ')',
  ).run(...Object.values(row));
}
export function rawCustomer(input = customer()) {
  return {
    id: input.id,
    company_name: input.companyName,
    tax_id_original: input.taxIdOriginal,
    tax_id_normalized: input.taxIdOriginal.toUpperCase(),
    contact_name: input.contactName,
    contact_email: input.contactEmail,
    country_code: input.countryCode,
    plan_code: input.planCode,
    created_at: input.createdAt,
  };
}
export function rawSimulation(customerId, overrides = {}) {
  return {
    id: randomUUID(),
    customer_id: customerId,
    users: 1,
    storage_gb: 0,
    api_calls: 0,
    currency: 'EUR',
    base_cents: 123,
    tax_cents: 7,
    total_cents: 130,
    customer_name_snapshot: 'Empresa de prueba',
    tax_id_snapshot: '000TEST',
    country_code_snapshot: 'ES',
    plan_code_snapshot: 'DEMO_BASIC',
    pricing_version: 'technical-fixture',
    tax_policy_version: 'not-a-real-tax-policy',
    tax_rate_bps: 557,
    breakdown_json: JSON.stringify(simulation(customerId).breakdown),
    created_at: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}
