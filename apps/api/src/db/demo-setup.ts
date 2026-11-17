import {
  parseCreateCustomer,
  parseCreateSimulation,
} from '@saas-o-matic/shared';
import { customerService } from '../features/customers/service.js';
import { simulationService } from '../features/simulations/service.js';
import { withNewDatabase, type DatabaseOptions } from './connection.js';
import { applyMigrations } from './migrate.js';
import { defaultDatabasePath, resolveDatabasePath } from './paths.js';

// Synthetic identities: valid format/control does not establish census identity.
const fixtures = [
  {
    companyName: 'DEMO Lumen Digital',
    taxId: '12345678Z',
    planCode: 'DEMO_BASIC',
    users: 15,
    storageGb: 100,
    apiCalls: 10000,
  },
  {
    companyName: 'DEMO Atlas Studio',
    taxId: '00000000T',
    planCode: 'DEMO_PRO',
    users: 50,
    storageGb: 250,
    apiCalls: 50000,
  },
  {
    companyName: 'DEMO Vega Telecom',
    taxId: 'X0000000T',
    planCode: 'DEMO_BASIC',
    users: 60,
    storageGb: 500,
    apiCalls: 100000,
  },
] as const;

export function setupDemo(options: DatabaseOptions) {
  const target = resolveDatabasePath(options.path, options.context);
  if (options.kind !== 'demo' || target === defaultDatabasePath)
    throw new Error('DB_DEMO_REQUIRED');
  return withNewDatabase(options, (db) => {
    applyMigrations(db, 'demo', undefined, true);
    return db
      .transaction(() => {
        const customers = customerService(() => db);
        const simulations = simulationService(() => db);
        return fixtures.map((fixture, index) => {
          const customer = customers.create(
            parseCreateCustomer({
              companyName: fixture.companyName,
              taxId: fixture.taxId,
              contactEmail: `demo${index + 1}@example.invalid`,
              countryCode: 'ES',
              planCode: fixture.planCode,
            }),
          );
          const simulation = simulations.create(
            parseCreateSimulation({
              customerId: customer.id,
              users: fixture.users,
              storageGb: fixture.storageGb,
              apiCalls: fixture.apiCalls,
            }),
          );
          return { customer, simulation };
        });
      })
      .immediate();
  });
}
