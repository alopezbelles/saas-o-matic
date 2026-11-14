import { isDeepStrictEqual } from 'node:util';
import { assertOwnership, type Connection } from './connection.js';
import { getCustomer, insertCustomer } from './persistence.js';

export const demoCustomers = [
  {
    id: '00000000-0000-4000-8000-000000000001',
    companyName: 'DEMO Empresa Básica',
    taxIdOriginal: 'DEMO-001',
    contactName: 'DEMO Contacto Uno',
    contactEmail: 'uno@example.invalid',
    countryCode: 'ES',
    planCode: 'DEMO_BASIC',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    companyName: 'DEMO Empresa Pro',
    taxIdOriginal: 'DEMO-002',
    contactName: 'DEMO Contacto Dos',
    contactEmail: 'dos@example.invalid',
    countryCode: 'ES',
    planCode: 'DEMO_PRO',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
] as const;

export function seedDemo(db: Connection) {
  assertOwnership(db, 'demo');
  db.transaction(() => {
    for (const fixture of demoCustomers) {
      const existing = getCustomer(db, fixture.id);
      const expected = {
        ...fixture,
        taxIdNormalized: fixture.taxIdOriginal.toUpperCase(),
      };
      if (existing) {
        if (!isDeepStrictEqual(existing, expected))
          throw new Error('DB_SEED_CONFLICT');
      } else {
        insertCustomer(db, fixture);
      }
    }
  }).immediate();
}
