import assert from 'node:assert/strict';
import test from 'node:test';
import { once } from 'node:events';
import { createApp } from '../dist/app.js';
import { taxPolicy } from '../dist/config/tax-policy.js';
import {
  calculateQuote,
  CONSUMPTION_LIMITS,
  getPricingConfiguration,
} from '@saas-o-matic/shared';

async function serve(app, run) {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    await run('http://127.0.0.1:' + server.address().port);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
      server.closeAllConnections();
    });
  }
}

test('IT-CONFIG-005: current configuration is complete, no-store and independent from DB', async () => {
  let calls = 0;
  await serve(
    createApp({
      connection: () => {
        calls++;
        throw new Error('DB not available');
      },
      logger: () => {},
    }),
    async (base) => {
      const response = await fetch(base + '/billing-config');
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('Cache-Control'), 'no-store');
      assert.ok(response.headers.get('X-Request-Id'));
      const config = await response.json();
      assert.deepEqual(config, {
        currency: 'EUR',
        pricingVersion: 'users-tiered-v1',
        taxPolicyVersion: 'demo-standard-v1',
        tiers: [
          { tierFrom: 1, tierTo: 10, unitPriceCents: 1000 },
          { tierFrom: 11, tierTo: 50, unitPriceCents: 800 },
          { tierFrom: 51, tierTo: null, unitPriceCents: 500 },
        ],
        ratesByCountry: { ES: 2100, FR: 2000, DE: 1900, GB: 2000 },
        consumptionLimits: CONSUMPTION_LIMITS,
      });
      for (const countryCode of Object.keys(config.ratesByCountry)) {
        for (const users of [0, 10, 11, 15, 50, 51, 1000]) {
          const quote = calculateQuote(
            { users, storageGb: 0, apiCalls: 0, countryCode },
            taxPolicy,
          );
          assert.equal(quote.pricingVersion, config.pricingVersion);
          assert.equal(quote.taxPolicyVersion, config.taxPolicyVersion);
          assert.equal(quote.rateBps, config.ratesByCountry[countryCode]);
          for (const line of quote.breakdown) {
            const tier = config.tiers.find(
              (item) => item.tierFrom === line.tierFrom,
            );
            assert.equal(line.unitPriceCents, tier.unitPriceCents);
            assert.equal(line.tierTo, tier.tierTo);
          }
        }
      }
      config.ratesByCountry.ES = 0;
      config.tiers[0].unitPriceCents = 1;
      config.consumptionLimits.users = 1;
      const again = await (await fetch(base + '/billing-config')).json();
      assert.equal(again.ratesByCountry.ES, 2100);
      assert.equal(again.tiers[0].unitPriceCents, 1000);
      assert.equal(again.consumptionLimits.users, 1000);
      assert.equal(calls, 0);
    },
  );
});

test('IT-CONFIG-005: shared pricing reader returns isolated copies of the actual rules', () => {
  const original = getPricingConfiguration();
  const changed = getPricingConfiguration();
  changed.pricingVersion = 'changed';
  changed.tiers[0].unitPriceCents = 1;
  changed.tiers.pop();
  assert.deepEqual(getPricingConfiguration(), original);
  assert.equal(
    calculateQuote(
      { users: 15, storageGb: 0, apiCalls: 0, countryCode: 'ES' },
      taxPolicy,
    ).baseCents,
    14000,
  );
});

test('IT-CONFIG-005: injected server policy is projected and invalid configuration returns safe 500', async () => {
  await serve(
    createApp({
      billingPolicy: { version: 'synthetic-v2', ratesByCountry: { ES: 1000 } },
      logger: () => {},
    }),
    async (base) => {
      const config = await (await fetch(base + '/billing-config')).json();
      assert.equal(config.taxPolicyVersion, 'synthetic-v2');
      assert.deepEqual(config.ratesByCountry, { ES: 1000 });
    },
  );
  await serve(
    createApp({
      billingPolicy: { version: '', ratesByCountry: {} },
      logger: () => {},
    }),
    async (base) => {
      const response = await fetch(base + '/billing-config');
      assert.equal(response.status, 500);
      const result = await response.json();
      assert.equal(result.error.code, 'INTERNAL_ERROR');
      assert.doesNotMatch(JSON.stringify(result), /BILLING_POLICY|stack/);
    },
  );
});
