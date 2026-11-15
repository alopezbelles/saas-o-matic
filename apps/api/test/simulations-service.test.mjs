import assert from 'node:assert/strict';
import test from 'node:test';
import { randomUUID } from 'node:crypto';
import { calculateQuote, CONSUMPTION_LIMITS } from '@saas-o-matic/shared';
import { taxPolicy } from '../dist/config/tax-policy.js';
import { simulationService } from '../dist/features/simulations/service.js';
import {
  createCalculatedSimulation,
  toSimulationDto,
} from '../dist/features/simulations/repository.js';
import { insertCustomer, listSimulations } from '../dist/db/persistence.js';
import { fixture, customer } from './db-fixtures.mjs';

function withDatabase(t, run) {
  const f = fixture(t);
  try {
    run(f);
  } finally {
    f.close();
  }
}
const consumption = (customerId, overrides = {}) => ({
  customerId,
  users: 15,
  storageGb: 12,
  apiCalls: 345,
  ...overrides,
});

test('IT-SIM-01: service calculates ES 15/51, maps snapshots and survives reopening', (t) => {
  withDatabase(t, (f) => {
    const client = insertCustomer(f.db, customer());
    const service = simulationService(() => f.db);
    for (const [users, base, tax, total] of [
      [15, 14000, 2940, 16940],
      [51, 42500, 8925, 51425],
    ]) {
      const result = service.create(consumption(client.id, { users }));
      assert.deepEqual(
        [result.baseCents, result.taxCents, result.totalCents],
        [base, tax, total],
      );
      assert.equal(result.users, users);
      assert.equal(result.storageGb, 12);
      assert.equal(result.apiCalls, 345);
      assert.equal(result.currency, 'EUR');
      assert.equal(result.taxRateBps, 2100);
      assert.equal(result.pricingVersion, 'users-tiered-v1');
      assert.equal(result.taxPolicyVersion, 'demo-standard-v1');
      assert.deepEqual(result.customerSnapshot, {
        companyName: client.companyName,
        taxIdNormalized: client.taxIdNormalized,
        countryCode: 'ES',
        planCode: 'DEMO_BASIC',
      });
      assert.ok(Array.isArray(result.breakdown));
      assert.equal(Object.hasOwn(result, 'breakdownJson'), false);
      assert.equal(Object.hasOwn(result, 'rateBps'), false);
      assert.equal(
        Object.hasOwn(result.customerSnapshot, 'contactEmail'),
        false,
      );
      assert.deepEqual(JSON.parse(JSON.stringify(result)), result);
      assert.equal(f.db.inTransaction, false);
    }
    const before = listSimulations(f.db, client.id).map(toSimulationDto);
    f.close();
    assert.deepEqual(
      listSimulations(f.connect(), client.id).map(toSimulationDto),
      before,
    );
  });
});

test('IT-SIM-01: zero, maximum and all configured countries use authoritative calculation', (t) => {
  withDatabase(t, (f) => {
    const service = simulationService(() => f.db);
    for (const [countryCode, expectedTax] of [
      ['ES', 2940],
      ['FR', 2800],
      ['DE', 2660],
      ['GB', 2800],
    ]) {
      const client = insertCustomer(
        f.db,
        customer({ countryCode, taxIdOriginal: countryCode + '-fixture' }),
      );
      assert.equal(
        service.create(consumption(client.id)).taxCents,
        expectedTax,
      );
      const zero = service.create(consumption(client.id, { users: 0 }));
      assert.deepEqual(
        [zero.baseCents, zero.taxCents, zero.totalCents],
        [0, 0, 0],
      );
      assert.deepEqual(zero.breakdown, []);
      const maximum = service.create(
        consumption(client.id, CONSUMPTION_LIMITS),
      );
      assert.equal(maximum.baseCents, 517000);
      assert.equal(maximum.storageGb, 10000);
      assert.equal(maximum.apiCalls, 10000000);
    }
  });
});

test('IT-SIM-01: repeat saves are distinct and runtime overrides cannot set calculated data', (t) => {
  withDatabase(t, (f) => {
    const client = insertCustomer(f.db, customer());
    const service = simulationService(() => f.db);
    const spoofedId = randomUUID();
    const forged = consumption(client.id, {
      id: spoofedId,
      createdAt: '2000-01-01T00:00:00.000Z',
      countryCode: 'FR',
      planCode: 'DEMO_PRO',
      totalCents: 1,
      taxRateBps: 0,
      currency: 'USD',
      taxPolicyVersion: 'forged',
      customerSnapshot: { companyName: 'forged' },
    });
    const first = service.create(forged);
    const second = service.create(consumption(client.id));
    assert.notEqual(first.id, spoofedId);
    assert.notEqual(first.createdAt, forged.createdAt);
    assert.notEqual(first.id, second.id);
    assert.equal(first.totalCents, 16940);
    assert.equal(first.customerSnapshot.countryCode, 'ES');
    assert.equal(first.customerSnapshot.planCode, 'DEMO_BASIC');
    assert.equal(first.taxPolicyVersion, 'demo-standard-v1');
    assert.equal(listSimulations(f.db, client.id).length, 2);
    first.breakdown[0].subtotalCents = 1;
    first.customerSnapshot.companyName = 'mutated';
    const saved = listSimulations(f.db, client.id).find(
      (row) => row.id === first.id,
    );
    assert.equal(
      toSimulationDto(saved).customerSnapshot.companyName,
      client.companyName,
    );
    assert.equal(toSimulationDto(saved).breakdown[0].subtotalCents, 10000);
  });
});

test('IT-SIM-02: missing client, unsupported country and invalid policy leave no new rows', (t) => {
  withDatabase(t, (f) => {
    const client = insertCustomer(f.db, customer());
    const service = simulationService(() => f.db);
    const previous = service.create(consumption(client.id));
    assert.throws(() => service.create(consumption(randomUUID())), {
      status: 404,
      code: 'CUSTOMER_NOT_FOUND',
    });
    const unsupported = insertCustomer(f.db, customer({ countryCode: 'IT' }));
    assert.throws(
      () => service.create(consumption(unsupported.id, { users: 0 })),
      { code: 'TAX_COUNTRY_UNSUPPORTED' },
    );
    assert.throws(
      () =>
        simulationService(() => f.db, {
          version: '',
          ratesByCountry: {},
        }).create(consumption(client.id)),
      { code: 'BILLING_POLICY_INVALID' },
    );
    assert.throws(
      () => service.create(consumption(client.id, { apiCalls: -1 })),
      { code: 'BILLING_INPUT_INVALID' },
    );
    assert.deepEqual(listSimulations(f.db, client.id).map(toSimulationDto), [
      previous,
    ]);
    assert.deepEqual(listSimulations(f.db, unsupported.id), []);
    assert.equal(f.db.inTransaction, false);
  });
});

test('IT-SIM-02: AFTER INSERT failure rolls back and subsequent creation recovers', (t) => {
  withDatabase(t, (f) => {
    const client = insertCustomer(f.db, customer());
    const service = simulationService(() => f.db);
    const previous = service.create(consumption(client.id));
    let inserted = false;
    f.db.function('fail_simulation_fixture', () => {
      inserted = true;
      throw new Error('fixture-after-insert');
    });
    f.db.exec(
      'CREATE TEMP TRIGGER fail_simulation AFTER INSERT ON simulations BEGIN SELECT fail_simulation_fixture(); END',
    );
    assert.throws(
      () => service.create(consumption(client.id)),
      /fixture-after-insert/,
    );
    assert.equal(inserted, true);
    assert.deepEqual(listSimulations(f.db, client.id).map(toSimulationDto), [
      previous,
    ]);
    assert.equal(f.db.inTransaction, false);
    f.db.exec('DROP TRIGGER fail_simulation');
    assert.equal(service.create(consumption(client.id)).totalCents, 16940);
    assert.equal(listSimulations(f.db, client.id).length, 2);
  });
});

test('IT-SIM-02: outer rollback removes nested save while previous commits remain', (t) => {
  withDatabase(t, (f) => {
    const client = insertCustomer(f.db, customer());
    const service = simulationService(() => f.db);
    const previous = service.create(consumption(client.id));
    assert.throws(
      () =>
        f.db
          .transaction(() => {
            service.create(consumption(client.id, { users: 51 }));
            assert.equal(listSimulations(f.db, client.id).length, 2);
            throw new Error('fixture-outer-rollback');
          })
          .immediate(),
      /fixture-outer-rollback/,
    );
    assert.deepEqual(listSimulations(f.db, client.id).map(toSimulationDto), [
      previous,
    ]);
  });
});

test('IT-SNAPSHOT-005: immediate transaction prevents customer drift on a second connection', (t) => {
  withDatabase(t, (f) => {
    const client = insertCustomer(f.db, customer());
    const other = f.connect();
    other.pragma('busy_timeout = 1');
    const result = createCalculatedSimulation(
      f.db,
      consumption(client.id),
      (countryCode) => {
        assert.equal(f.db.inTransaction, true);
        assert.throws(
          () =>
            other
              .prepare('UPDATE customers SET country_code=? WHERE id=?')
              .run('FR', client.id),
          { code: 'SQLITE_BUSY' },
        );
        return calculateQuote(
          { users: 15, storageGb: 12, apiCalls: 345, countryCode },
          taxPolicy,
        );
      },
    );
    assert.equal(result.taxRateBps, 2100);
    assert.equal(result.customerSnapshot.countryCode, 'ES');
    other
      .prepare('UPDATE customers SET country_code=? WHERE id=?')
      .run('FR', client.id);
    assert.equal(
      toSimulationDto(listSimulations(f.db, client.id)[0]).customerSnapshot
        .countryCode,
      'ES',
    );
  });
});

test('IT-SNAPSHOT-005: future customer/policy changes affect new saves only', (t) => {
  withDatabase(t, (f) => {
    const client = insertCustomer(f.db, customer());
    const previous = simulationService(() => f.db).create(
      consumption(client.id),
    );
    f.db
      .prepare(
        'UPDATE customers SET company_name=?, tax_id_original=?, tax_id_normalized=?, country_code=?, plan_code=? WHERE id=?',
      )
      .run(
        'Nouvelle entreprise',
        'fixture-new',
        'FIXTURE-NEW',
        'FR',
        'DEMO_PRO',
        client.id,
      );
    const next = simulationService(() => f.db, {
      version: 'synthetic-test-v2',
      ratesByCountry: { FR: 1000 },
    }).create(consumption(client.id));
    assert.equal(next.taxPolicyVersion, 'synthetic-test-v2');
    assert.equal(next.taxCents, 1400);
    assert.equal(next.customerSnapshot.countryCode, 'FR');
    assert.equal(next.customerSnapshot.companyName, 'Nouvelle entreprise');
    assert.equal(next.customerSnapshot.planCode, 'DEMO_PRO');
    assert.equal(next.customerSnapshot.taxIdNormalized, 'FIXTURE-NEW');
    const old = listSimulations(f.db, client.id).find(
      (row) => row.id === previous.id,
    );
    assert.deepEqual(toSimulationDto(old), previous);
  });
});

test('IT-SIM-02: DTO rejects corrupt stored breakdown rather than returning partial data', (t) => {
  withDatabase(t, (f) => {
    const client = insertCustomer(f.db, customer());
    const result = simulationService(() => f.db).create(consumption(client.id));
    const row = listSimulations(f.db, client.id)[0];
    assert.throws(
      () => toSimulationDto({ ...row, breakdownJson: 'invalid' }),
      SyntaxError,
    );
    assert.throws(
      () => toSimulationDto({ ...row, breakdownJson: '[]' }),
      /DB_BREAKDOWN_INVALID/,
    );
    assert.throws(
      () => toSimulationDto({ ...row, totalCents: 1 }),
      /DB_TOTAL_INVALID/,
    );
    assert.deepEqual(toSimulationDto(row), result);
  });
});
