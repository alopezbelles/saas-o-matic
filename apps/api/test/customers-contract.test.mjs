import assert from 'node:assert/strict';
import test from 'node:test';
import {
  parseCreateCustomer,
  parseCustomerQuery,
  parseCustomerId,
} from '@saas-o-matic/shared';
const input = {
  companyName: 'Empresa',
  taxId: '12345678Z',
  contactEmail: 'test+tag@example.invalid',
  countryCode: 'ES',
  planCode: 'DEMO_BASIC',
};
test('UT-CONTRACT-01: cinco campos, normalización y longitudes', () => {
  assert.deepEqual(
    parseCreateCustomer({
      ...input,
      companyName: '  Cafe\u0301  ',
      countryCode: ' es ',
      taxId: ' 00000008p ',
    }),
    { ...input, companyName: 'Café', countryCode: 'ES', taxId: '00000008p' },
  );
  for (const key of Object.keys(input)) {
    const copy = { ...input };
    delete copy[key];
    assert.throws(() => parseCreateCustomer(copy));
  }
  for (const value of [
    null,
    [],
    0,
    'x',
    {},
    { ...input, contactName: 'extra' },
    { ...input, id: 'extra' },
    { ...input, companyName: 1 },
    { ...input, companyName: '' },
    { ...input, companyName: 'x'.repeat(201) },
    { ...input, taxId: 'x'.repeat(65) },
    { ...input, planCode: 'UNKNOWN' },
    { ...input, countryCode: 'ESP' },
    { ...input, companyName: 'x\u0000' },
  ])
    assert.throws(() => parseCreateCustomer(value));
  assert.equal(
    parseCreateCustomer({ ...input, companyName: 'x'.repeat(200) }).companyName
      .length,
    200,
  );
  for (const email of [
    'a..b@example.invalid',
    '.a@example.invalid',
    'a.@example.invalid',
    'a@example',
    'a@-example.invalid',
    'a b@example.invalid',
    'á@example.invalid',
    'a@a..com',
    'a'.repeat(65) + '@example.invalid',
  ])
    assert.throws(
      () => parseCreateCustomer({ ...input, contactEmail: email }),
      email,
    );
});
test('UT-CONTRACT-01: parámetros, UUID y query repetida/estructurada', () => {
  assert.throws(() =>
    parseCreateCustomer({ ...input, contactEmail: 'a@127.0.0.1' }),
  );
  assert.throws(() =>
    parseCreateCustomer({ ...input, countryCode: 'FR', taxId: 'ß'.repeat(64) }),
  );
  const parse = (q) => parseCustomerQuery(new URLSearchParams(q));
  assert.deepEqual(parse(''), { q: '', limit: 20, offset: 0 });
  assert.deepEqual(parse('q=+name+&limit=100&offset=100000'), {
    q: 'name',
    limit: 100,
    offset: 100000,
  });
  for (const q of [
    'limit=0',
    'limit=101',
    'offset=-1',
    'offset=100001',
    'limit=1.1',
    'limit=1e1',
    'limit=%2B1',
    'limit=+1',
    'limit=1&limit=2',
    'q[a]=x',
    'extra=x',
    'q=%00',
    'q=' + 'a'.repeat(201),
  ])
    assert.throws(() => parse(q), q);
  assert.equal(
    parseCustomerId('00000000-0000-4000-8000-00000000000A'),
    '00000000-0000-4000-8000-00000000000a',
  );
  assert.throws(() => parseCustomerId('not-an-id'));
});
