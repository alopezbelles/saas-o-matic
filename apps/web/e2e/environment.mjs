import { once } from 'node:events';
import { rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer, loadConfigFromFile } from 'vite';
import { createApp } from '../../api/dist/app.js';
import { taxPolicy } from '../../api/dist/config/tax-policy.js';
import { HttpError } from '../../api/dist/http/errors.js';
import { createTestContext, within } from '../../api/dist/db/paths.js';
import { migrateDatabase } from '../../api/dist/db/migrate.js';
import { openDatabase } from '../../api/dist/db/connection.js';
import {
  insertCustomer,
  insertSimulation,
} from '../../api/dist/db/persistence.js';

const workspace = fileURLToPath(new URL('../../../', import.meta.url));
export const fixtureCustomerId = '00000000-0000-4000-8000-000000000021';

function seed(db) {
  for (let index = 1; index <= 21; index++) {
    const number = 10000000 + index;
    insertCustomer(db, {
      id: '00000000-0000-4000-8000-' + String(index).padStart(12, '0'),
      companyName: 'Empresa ' + String(index).padStart(2, '0'),
      taxIdOriginal: number + 'TRWAGMYFPDXBNJZSQVHLCKE'[number % 23],
      contactEmail: 'fixture@example.invalid',
      countryCode: index === 21 ? 'PT' : 'ES',
      planCode: 'DEMO_BASIC',
      createdAt: '2026-01-' + String(index).padStart(2, '0') + 'T00:00:00.000Z',
    });
  }
  for (let index = 1; index <= 21; index++)
    insertSimulation(db, {
      id: '10000000-0000-4000-8000-' + String(index).padStart(12, '0'),
      customerId: fixtureCustomerId,
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
      createdAt: '2026-01-' + String(index).padStart(2, '0') + 'T12:00:00.000Z',
    });
}

export async function createEnvironment() {
  const context = createTestContext();
  const billingPolicy = {
    version: taxPolicy.version,
    ratesByCountry: { ...taxPolicy.ratesByCountry },
  };
  let db,
    api,
    vite,
    unavailable = false;
  const close = async () => {
    await vite?.close();
    if (api)
      await new Promise((resolve) => {
        api.close(resolve);
        api.closeAllConnections();
      });
    if (db?.open) db.close();
    if (
      !within(path.join(workspace, '.cache/002-tests'), context.directory) ||
      !path.basename(context.directory).startsWith('case-')
    )
      throw new Error('Unsafe temporary cleanup');
    rmSync(context.directory, { recursive: true, force: true });
  };
  try {
    const options = {
      path: path.join(context.directory, 'customers-e2e.sqlite'),
      kind: 'test',
      context,
    };
    migrateDatabase(options);
    db = openDatabase(options);
    seed(db);
    api = createApp({
      billingPolicy,
      connection: () => {
        if (unavailable) throw new HttpError(503, 'DATABASE_UNAVAILABLE');
        return db;
      },
      logger: () => {},
    }).listen(0, '127.0.0.1');
    await once(api, 'listening');
    const configFile = path.join(workspace, 'apps/web/vite.config.ts');
    const loaded = await loadConfigFromFile(
      { command: 'serve', mode: 'development' },
      configFile,
    );
    const proxy = loaded.config.server.proxy['/api'];
    if (
      proxy.target !== 'http://127.0.0.1:3000' ||
      proxy.rewrite('/api/customers') !== '/customers'
    )
      throw new Error('Unexpected development proxy');
    vite = await createServer({
      configFile,
      root: path.join(workspace, 'apps/web'),
      server: {
        host: '127.0.0.1',
        port: 0,
        strictPort: false,
        proxy: {
          '/api': {
            ...proxy,
            target: 'http://127.0.0.1:' + api.address().port,
          },
        },
      },
    });
    await vite.listen();
    return {
      baseURL: 'http://127.0.0.1:' + vite.httpServer.address().port,
      setUnavailable(value) {
        unavailable = value;
      },
      setTaxPolicy(version, ratesByCountry) {
        billingPolicy.version = version;
        billingPolicy.ratesByCountry = { ...ratesByCountry };
      },
      close,
    };
  } catch (error) {
    await close();
    throw error;
  }
}
