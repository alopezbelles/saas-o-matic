import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CONSUMPTION_LIMITS,
  InputError,
  parseCreateSimulation,
  parseCustomerQuery,
  parseSimulationQuery,
} from '@saas-o-matic/shared';

const input = {
  customerId: '00000000-0000-4000-8000-00000000000a',
  users: 15,
  storageGb: 10,
  apiCalls: 100,
};

function expectError(action, code, field) {
  assert.throws(action, (error) => {
    assert.ok(error instanceof InputError);
    assert.equal(error.code, code);
    if (field !== undefined) assert.ok(Object.hasOwn(error.fields, field));
    return true;
  });
}

test('UT-SIM-CONTRACT-005: exact request, UUID normalization and fresh results', () => {
  const frozen = Object.freeze({
    ...input,
    customerId: input.customerId.toUpperCase(),
  });
  const result = parseCreateSimulation(frozen);
  assert.deepEqual(result, input);
  assert.notEqual(result, frozen);
  result.users = 0;
  assert.equal(frozen.users, 15);
  assert.deepEqual(parseCreateSimulation(frozen), input);
  assert.deepEqual(
    JSON.parse(JSON.stringify(parseCreateSimulation(input))),
    input,
  );
});

test('UT-SIM-CONTRACT-005: non-object bodies and missing fields reject', () => {
  for (const value of [
    null,
    undefined,
    [],
    '15',
    15,
    true,
    1n,
    Symbol('body'),
  ]) {
    expectError(() => parseCreateSimulation(value), 'VALIDATION_ERROR', 'body');
  }
  for (const key of Object.keys(input)) {
    const missing = { ...input };
    delete missing[key];
    expectError(() => parseCreateSimulation(missing), 'VALIDATION_ERROR', key);
  }
  expectError(
    () => parseCreateSimulation(Object.create(input)),
    'VALIDATION_ERROR',
    'customerId',
  );
});

test('UT-SIM-CONTRACT-005: caller cannot supply monetary or customer overrides', () => {
  for (const key of [
    'id',
    'createdAt',
    'baseCents',
    'taxCents',
    'totalCents',
    'rateBps',
    'taxRateBps',
    'currency',
    'countryCode',
    'planCode',
    'pricingVersion',
    'taxPolicyVersion',
    'breakdown',
    'breakdownJson',
    'customerSnapshot',
    'companyName',
    'taxIdNormalized',
    'extra',
  ]) {
    expectError(
      () => parseCreateSimulation({ ...input, [key]: 'untrusted' }),
      'VALIDATION_ERROR',
      'body',
    );
    expectError(
      () => parseCreateSimulation({ ...input, [key]: undefined }),
      'VALIDATION_ERROR',
      'body',
    );
  }
});

test('UT-SIM-CONTRACT-005: every consumption uses existing limits without coercion', () => {
  for (const [field, maximum] of Object.entries(CONSUMPTION_LIMITS)) {
    for (const value of [0, maximum]) {
      assert.equal(
        parseCreateSimulation({ ...input, [field]: value })[field],
        value,
      );
    }
    for (const value of [
      maximum + 1,
      -1,
      0.5,
      NaN,
      Infinity,
      -Infinity,
      Number.MAX_SAFE_INTEGER + 1,
      '0',
      '15',
      null,
      undefined,
      false,
      {},
      [],
      1n,
      Symbol(field),
      Object(1),
    ]) {
      expectError(
        () => parseCreateSimulation({ ...input, [field]: value }),
        'VALIDATION_ERROR',
        field,
      );
    }
  }
  assert.deepEqual(
    parseCreateSimulation({ ...input, users: 0, storageGb: 0, apiCalls: 0 }),
    { ...input, users: 0, storageGb: 0, apiCalls: 0 },
  );
  assert.throws(
    () => parseCreateSimulation({ ...input, users: -1, apiCalls: -1 }),
    (error) => {
      assert.deepEqual(Object.keys(error.fields).sort(), ['apiCalls', 'users']);
      return true;
    },
  );
});

test('UT-SIM-CONTRACT-005: malformed customer UUIDs reuse the existing error code', () => {
  for (const customerId of [
    '',
    'not-an-id',
    ' ' + input.customerId,
    input.customerId + ' ',
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-4000-0000-00000000000a',
    1,
    null,
    undefined,
    {},
    [],
  ]) {
    expectError(
      () => parseCreateSimulation({ ...input, customerId }),
      'INVALID_CUSTOMER_ID',
    );
  }
});

test('UT-SIM-CONTRACT-005: history pagination shares customer defaults and ranges', () => {
  for (const query of [
    '',
    'limit=1&offset=0',
    'limit=100&offset=100000',
    'limit=001&offset=000',
  ]) {
    const entries = new URLSearchParams(query);
    const result = parseSimulationQuery(entries);
    const { limit, offset } = parseCustomerQuery(entries);
    assert.deepEqual(result, { limit, offset });
    assert.deepEqual(Object.keys(result).sort(), ['limit', 'offset']);
  }
  assert.deepEqual(parseSimulationQuery([]), { limit: 20, offset: 0 });
});

test('UT-SIM-CONTRACT-005: history rejects extras, duplicate and noncanonical query values', () => {
  for (const query of [
    'q=',
    'q=company',
    'extra=x',
    'limit[a]=1',
    'limit=1&limit=2',
    'offset=0&offset=1',
    'limit=',
    'offset=',
    'limit=0',
    'limit=101',
    'offset=-1',
    'offset=100001',
    'limit=1.5',
    'limit=1e1',
    'limit=0x10',
    'limit=%2B1',
    'limit=+1',
    'limit=1+',
    'limit=NaN',
    'offset=Infinity',
    'offset=9007199254740992',
    'limit=%00',
  ]) {
    expectError(
      () => parseSimulationQuery(new URLSearchParams(query)),
      'INVALID_QUERY',
    );
  }
  // Customer search still accepts q after extracting the shared pagination helper.
  assert.deepEqual(
    parseCustomerQuery(new URLSearchParams('q=+company+&limit=2')),
    { q: 'company', limit: 2, offset: 0 },
  );
});
