import { expect, it } from 'vitest';
import { parseConsumptionDraft, parseConsumptionField } from './consumption';
import { simulationReturn } from './simulation-location';

it('WEB-SIM-01 parses exact integer drafts within the existing shared boundaries', () => {
  for (const users of [0, 10, 11, 15, 50, 51, 1000])
    expect(parseConsumptionField(String(users), 'users')).toBe(users);
  expect(
    parseConsumptionDraft({
      users: '1000',
      storageGb: '10000',
      apiCalls: '10000000',
    }),
  ).toEqual({ users: 1000, storageGb: 10000, apiCalls: 10000000 });
  expect(
    parseConsumptionDraft({ users: '0', storageGb: '0', apiCalls: '0' }),
  ).toEqual({ users: 0, storageGb: 0, apiCalls: 0 });
  for (const value of [
    '',
    ' ',
    '-1',
    '1.5',
    '1e2',
    '1,5',
    '+1',
    '1001',
    '9007199254740992',
  ])
    expect(parseConsumptionField(value, 'users')).toBeNull();
  expect(
    parseConsumptionDraft({ users: '', storageGb: '0', apiCalls: '0' }),
  ).toBeNull();
  expect(parseConsumptionField('10001', 'storageGb')).toBeNull();
  expect(parseConsumptionField('10000001', 'apiCalls')).toBeNull();
});

it('keeps the validated customer/list context and rejects tampered return state', () => {
  expect(
    simulationReturn('id', {
      returnTo: '/customers?q=Norte&offset=20',
      customerSearch: '?historyOffset=20',
    }),
  ).toEqual({
    to: '/customers/id?historyOffset=20',
    state: { returnTo: '/customers?q=Norte&offset=20' },
  });
  expect(
    simulationReturn('id', {
      returnTo: 'https://evil.invalid',
      customerSearch: '?historyOffset=-1',
    }),
  ).toEqual({ to: '/customers/id', state: { returnTo: '/customers' } });
});
