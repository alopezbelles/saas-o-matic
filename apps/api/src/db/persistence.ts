import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq, desc } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { CONSUMPTION_LIMITS } from '@saas-o-matic/shared';
import { customers, simulations } from './schema.js';
import type { Connection } from './connection.js';
import {
  textValue,
  integerValue,
  uuid,
  dateValue,
  country,
  plan,
  validateBreakdown,
  type Breakdown,
} from './validation.js';

export type CustomerInput = Omit<
  typeof customers.$inferInsert,
  'id' | 'createdAt' | 'taxIdNormalized'
> & { id?: string; createdAt?: string };
export function insertCustomer(db: Connection, input: CustomerInput) {
  const row = {
    ...input,
    id: input.id ?? randomUUID(),
    createdAt: input.createdAt ?? new Date().toISOString(),
    taxIdNormalized: input.taxIdOriginal.trim().toUpperCase(),
    contactName: input.contactName ?? null,
  };
  uuid(row.id);
  dateValue(row.createdAt);
  textValue(row.companyName, 200);
  textValue(row.taxIdOriginal, 64);
  textValue(row.taxIdNormalized, 64);
  if (row.contactName !== null) textValue(row.contactName, 200);
  textValue(row.contactEmail, 254);
  country(row.countryCode);
  plan(row.planCode);
  return drizzle(db).insert(customers).values(row).returning().get();
}
export function getCustomer(db: Connection, id: string) {
  return drizzle(db).select().from(customers).where(eq(customers.id, id)).get();
}

export type SimulationInput = {
  id?: string;
  customerId: string;
  users: number;
  storageGb: number;
  apiCalls: number;
  currency: 'EUR';
  baseCents: number;
  taxCents: number;
  totalCents: number;
  pricingVersion: string;
  taxPolicyVersion: string;
  taxRateBps: number;
  breakdown: Breakdown[];
  createdAt?: string;
};
export function insertSimulation(db: Connection, input: SimulationInput) {
  const id = input.id ?? randomUUID();
  const createdAt = input.createdAt ?? new Date().toISOString();
  uuid(id);
  uuid(input.customerId);
  dateValue(createdAt);
  integerValue(input.users, CONSUMPTION_LIMITS.users);
  integerValue(input.storageGb, CONSUMPTION_LIMITS.storageGb);
  integerValue(input.apiCalls, CONSUMPTION_LIMITS.apiCalls);
  integerValue(input.baseCents);
  integerValue(input.taxCents);
  integerValue(input.totalCents);
  integerValue(input.taxRateBps, 10000);
  textValue(input.pricingVersion, 64);
  textValue(input.taxPolicyVersion, 64);
  if (
    input.currency !== 'EUR' ||
    BigInt(input.totalCents) !==
      BigInt(input.baseCents) + BigInt(input.taxCents)
  )
    throw new Error('DB_TOTAL_INVALID');
  validateBreakdown(input.breakdown, input.users, input.baseCents);
  return db
    .transaction(() => {
      const customer = getCustomer(db, input.customerId);
      if (!customer) throw new Error('DB_CUSTOMER_MISSING');
      // Explicit allowlist: callers cannot override snapshots with extra runtime properties.
      return drizzle(db)
        .insert(simulations)
        .values({
          id,
          createdAt,
          customerId: customer.id,
          users: input.users,
          storageGb: input.storageGb,
          apiCalls: input.apiCalls,
          currency: 'EUR',
          baseCents: input.baseCents,
          taxCents: input.taxCents,
          totalCents: input.totalCents,
          pricingVersion: input.pricingVersion,
          taxPolicyVersion: input.taxPolicyVersion,
          taxRateBps: input.taxRateBps,
          breakdownJson: JSON.stringify(input.breakdown),
          customerNameSnapshot: customer.companyName,
          taxIdSnapshot: customer.taxIdNormalized,
          countryCodeSnapshot: customer.countryCode,
          planCodeSnapshot: customer.planCode,
        })
        .returning()
        .get();
    })
    .immediate();
}
export function listSimulations(db: Connection, customerId: string) {
  return drizzle(db)
    .select()
    .from(simulations)
    .where(eq(simulations.customerId, customerId))
    .orderBy(desc(simulations.createdAt), desc(simulations.id))
    .all();
}
