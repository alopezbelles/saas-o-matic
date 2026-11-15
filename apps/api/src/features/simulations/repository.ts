import type {
  BillingQuote,
  CreateSimulation,
  SimulationDto,
  SimulationPage,
  SimulationQuery,
} from '@saas-o-matic/shared';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { count, desc, eq } from 'drizzle-orm';
import { CONSUMPTION_LIMITS } from '@saas-o-matic/shared';
import type { Connection } from '../../db/connection.js';
import { getCustomer, insertSimulation } from '../../db/persistence.js';
import { simulations } from '../../db/schema.js';
import {
  country,
  dateValue,
  integerValue,
  plan,
  textValue,
  uuid,
  validateBreakdown,
} from '../../db/validation.js';
import { databaseError, HttpError } from '../../http/errors.js';

type Row = typeof simulations.$inferSelect;

export function historyPage(
  db: Connection,
  customerId: string,
  query: SimulationQuery,
): SimulationPage {
  try {
    return db.transaction(() => {
      if (!getCustomer(db, customerId))
        throw new HttpError(404, 'CUSTOMER_NOT_FOUND');
      const orm = drizzle(db);
      const filter = eq(simulations.customerId, customerId);
      const total = orm
        .select({ total: count() })
        .from(simulations)
        .where(filter)
        .get()!.total;
      const rows = orm
        .select()
        .from(simulations)
        .where(filter)
        .orderBy(desc(simulations.createdAt), desc(simulations.id))
        .limit(query.limit)
        .offset(query.offset)
        .all();
      return {
        items: rows.map(toSimulationDto),
        total,
        limit: query.limit,
        offset: query.offset,
      };
    })();
  } catch (error) {
    return databaseError(error);
  }
}

export function toSimulationDto(row: Row): SimulationDto {
  uuid(row.id);
  uuid(row.customerId);
  dateValue(row.createdAt);
  integerValue(row.users, CONSUMPTION_LIMITS.users);
  integerValue(row.storageGb, CONSUMPTION_LIMITS.storageGb);
  integerValue(row.apiCalls, CONSUMPTION_LIMITS.apiCalls);
  integerValue(row.baseCents);
  integerValue(row.taxCents);
  integerValue(row.totalCents);
  integerValue(row.taxRateBps, 10000);
  textValue(row.pricingVersion, 64);
  textValue(row.taxPolicyVersion, 64);
  textValue(row.customerNameSnapshot, 200);
  textValue(row.taxIdSnapshot, 64);
  country(row.countryCodeSnapshot);
  plan(row.planCodeSnapshot);
  if (
    row.currency !== 'EUR' ||
    BigInt(row.baseCents) + BigInt(row.taxCents) !== BigInt(row.totalCents)
  ) {
    throw new Error('DB_TOTAL_INVALID');
  }
  const breakdown: unknown = JSON.parse(row.breakdownJson);
  validateBreakdown(breakdown, row.users, row.baseCents);
  return {
    id: row.id,
    customerId: row.customerId,
    users: row.users,
    storageGb: row.storageGb,
    apiCalls: row.apiCalls,
    currency: 'EUR',
    baseCents: row.baseCents,
    taxCents: row.taxCents,
    totalCents: row.totalCents,
    taxRateBps: row.taxRateBps,
    pricingVersion: row.pricingVersion,
    taxPolicyVersion: row.taxPolicyVersion,
    breakdown,
    createdAt: row.createdAt,
    customerSnapshot: {
      companyName: row.customerNameSnapshot,
      taxIdNormalized: row.taxIdSnapshot,
      countryCode: row.countryCodeSnapshot,
      planCode:
        row.planCodeSnapshot as SimulationDto['customerSnapshot']['planCode'],
    },
  };
}

export function createCalculatedSimulation(
  db: Connection,
  input: CreateSimulation,
  calculate: (countryCode: string) => BillingQuote,
): SimulationDto {
  try {
    return db
      .transaction(() => {
        const customer = getCustomer(db, input.customerId);
        if (!customer) throw new HttpError(404, 'CUSTOMER_NOT_FOUND');
        const quote = calculate(customer.countryCode);
        const row = insertSimulation(db, {
          customerId: customer.id,
          users: input.users,
          storageGb: input.storageGb,
          apiCalls: input.apiCalls,
          currency: quote.currency,
          baseCents: quote.baseCents,
          taxCents: quote.taxCents,
          totalCents: quote.totalCents,
          taxRateBps: quote.rateBps,
          pricingVersion: quote.pricingVersion,
          taxPolicyVersion: quote.taxPolicyVersion,
          breakdown: quote.breakdown,
        });
        return toSimulationDto(row);
      })
      .immediate();
  } catch (error) {
    return databaseError(error);
  }
}
