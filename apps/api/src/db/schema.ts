import { sql, desc, type SQL } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import { PLAN_CODES, CONSUMPTION_LIMITS } from '@saas-o-matic/shared';

const quotedPlans = sql.raw(
  PLAN_CODES.map((code) => "'" + code + "'").join(','),
);
const safe = (column: SQL) => sql`${column} BETWEEN 0 AND 9007199254740991`;
const trimmed = (column: SQL, maximum: number) =>
  sql`length(${column}) BETWEEN 1 AND ${sql.raw(String(maximum))} AND ${column} = trim(${column})`;
const country = (column: SQL) => sql`${column} GLOB '[A-Z][A-Z]'`;
const date = (column: SQL) =>
  sql`length(${column}) = 24 AND ${column} GLOB '????-??-??T??:??:??.???Z'`;
const uuid = () => text().notNull();
export const customers = sqliteTable(
  'customers',
  {
    id: uuid().primaryKey(),
    companyName: text('company_name').notNull(),
    taxIdOriginal: text('tax_id_original').notNull(),
    taxIdNormalized: text('tax_id_normalized').notNull(),
    contactName: text('contact_name'),
    contactEmail: text('contact_email').notNull(),
    countryCode: text('country_code').notNull(),
    planCode: text('plan_code').notNull(),
    createdAt: text('created_at').notNull(),
  },
  (t) => [
    uniqueIndex('customers_country_tax_unique').on(
      t.countryCode,
      t.taxIdNormalized,
    ),
    check('customer_name_valid', trimmed(sql`${t.companyName}`, 200)),
    check('customer_tax_original_valid', trimmed(sql`${t.taxIdOriginal}`, 64)),
    check(
      'customer_tax_normalized_valid',
      trimmed(sql`${t.taxIdNormalized}`, 64),
    ),
    check('customer_contact_valid', trimmed(sql`${t.contactName}`, 200)),
    check('customer_email_valid', trimmed(sql`${t.contactEmail}`, 254)),
    check('customer_country_valid', country(sql`${t.countryCode}`)),
    check('customer_plan_valid', sql`${t.planCode} IN (${quotedPlans})`),
    check('customer_date_valid', date(sql`${t.createdAt}`)),
  ],
);

export const simulations = sqliteTable(
  'simulations',
  {
    id: uuid().primaryKey(),
    customerId: text('customer_id')
      .notNull()
      .references(() => customers.id, {
        onDelete: 'restrict',
        onUpdate: 'restrict',
      }),
    users: integer().notNull(),
    storageGb: integer('storage_gb').notNull(),
    apiCalls: integer('api_calls').notNull(),
    currency: text().notNull(),
    baseCents: integer('base_cents').notNull(),
    taxCents: integer('tax_cents').notNull(),
    totalCents: integer('total_cents').notNull(),
    customerNameSnapshot: text('customer_name_snapshot').notNull(),
    taxIdSnapshot: text('tax_id_snapshot').notNull(),
    countryCodeSnapshot: text('country_code_snapshot').notNull(),
    planCodeSnapshot: text('plan_code_snapshot').notNull(),
    pricingVersion: text('pricing_version').notNull(),
    taxPolicyVersion: text('tax_policy_version').notNull(),
    taxRateBps: integer('tax_rate_bps').notNull(),
    breakdownJson: text('breakdown_json').notNull(),
    createdAt: text('created_at').notNull(),
  },
  (t) => [
    index('simulations_history').on(
      t.customerId,
      desc(t.createdAt),
      desc(t.id),
    ),
    check(
      'users_range',
      sql`${t.users} BETWEEN 0 AND ${sql.raw(String(CONSUMPTION_LIMITS.users))}`,
    ),
    check(
      'storage_range',
      sql`${t.storageGb} BETWEEN 0 AND ${sql.raw(String(CONSUMPTION_LIMITS.storageGb))}`,
    ),
    check(
      'api_calls_range',
      sql`${t.apiCalls} BETWEEN 0 AND ${sql.raw(String(CONSUMPTION_LIMITS.apiCalls))}`,
    ),
    check('currency_eur', sql`${t.currency} = 'EUR'`),
    check('base_safe', safe(sql`${t.baseCents}`)),
    check('tax_safe', safe(sql`${t.taxCents}`)),
    check('total_safe', safe(sql`${t.totalCents}`)),
    check(
      'total_matches',
      sql`${t.totalCents} = ${t.baseCents} + ${t.taxCents}`,
    ),
    check('snapshot_name_valid', trimmed(sql`${t.customerNameSnapshot}`, 200)),
    check('snapshot_tax_valid', trimmed(sql`${t.taxIdSnapshot}`, 64)),
    check('snapshot_country_valid', country(sql`${t.countryCodeSnapshot}`)),
    check(
      'snapshot_plan_valid',
      sql`${t.planCodeSnapshot} IN (${quotedPlans})`,
    ),
    check('pricing_version_valid', trimmed(sql`${t.pricingVersion}`, 64)),
    check('tax_version_valid', trimmed(sql`${t.taxPolicyVersion}`, 64)),
    check('tax_rate_range', sql`${t.taxRateBps} BETWEEN 0 AND 10000`),
    check(
      'breakdown_array',
      sql`CASE WHEN json_valid(${t.breakdownJson}) THEN json_type(${t.breakdownJson}) = 'array' ELSE 0 END`,
    ),
    check('simulation_date_valid', date(sql`${t.createdAt}`)),
  ],
);

export const appMetadata = sqliteTable('app_metadata', {
  key: text().notNull().primaryKey(),
  value: text().notNull(),
});
