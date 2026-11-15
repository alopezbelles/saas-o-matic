import { drizzle } from 'drizzle-orm/better-sqlite3';
import { sql, desc, count } from 'drizzle-orm';
import type {
  CreateCustomer,
  CustomerDto,
  CustomerQuery,
} from '@saas-o-matic/shared';
import { customers } from '../../db/schema.js';
import type { Connection } from '../../db/connection.js';
import { insertCustomer, getCustomer } from '../../db/persistence.js';
import { databaseError } from '../../http/errors.js';

type Row = typeof customers.$inferSelect;
function dto(row: Row): CustomerDto {
  return {
    id: row.id,
    companyName: row.companyName,
    taxId: row.taxIdOriginal,
    taxIdNormalized: row.taxIdNormalized,
    contactEmail: row.contactEmail,
    countryCode: row.countryCode,
    planCode: row.planCode as CustomerDto['planCode'],
    createdAt: row.createdAt,
  };
}
export function createCustomer(
  db: Connection,
  input: CreateCustomer,
): CustomerDto {
  try {
    return dto(
      insertCustomer(db, {
        companyName: input.companyName,
        taxIdOriginal: input.taxId,
        contactEmail: input.contactEmail,
        countryCode: input.countryCode,
        planCode: input.planCode,
      }),
    );
  } catch (error) {
    return databaseError(error);
  }
}
export function findCustomer(db: Connection, id: string) {
  try {
    const row = getCustomer(db, id);
    return row ? dto(row) : undefined;
  } catch (error) {
    return databaseError(error);
  }
}
const escapeLike = (value: string) =>
  value.replace(/[!%_]/g, (character) => '!' + character);
export function searchCustomers(db: Connection, query: CustomerQuery) {
  try {
    return db.transaction(() => {
      const orm = drizzle(db);
      const filter = query.q
        ? sql`(${customers.companyName} LIKE ${'%' + escapeLike(query.q) + '%'} ESCAPE '!' OR ${customers.taxIdNormalized} LIKE ${'%' + escapeLike(query.q.toUpperCase()) + '%'} ESCAPE '!')`
        : undefined;
      const total = orm
        .select({ total: count() })
        .from(customers)
        .where(filter)
        .get()!.total;
      const rows = orm
        .select()
        .from(customers)
        .where(filter)
        .orderBy(desc(customers.createdAt), desc(customers.id))
        .limit(query.limit)
        .offset(query.offset)
        .all();
      return {
        items: rows.map(dto),
        total,
        limit: query.limit,
        offset: query.offset,
      };
    })();
  } catch (error) {
    return databaseError(error);
  }
}
