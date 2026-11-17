import { expect, it } from 'vitest';
import { simulationComparison, simulationReturn } from './simulation-location';

const id = '00000000-0000-4000-8000-000000000001';
const comparison = {
  customerId: id,
  previousTotalCents: 16940,
  savedTotalCents: 16800,
};

it('WEB-HISTORY-008 preserves valid history and list context when returning from a simulation', () => {
  expect(
    simulationReturn(id, {
      customerSearch: '?historyOffset=20',
      returnTo: '/customers?q=Norte&offset=20',
    }),
  ).toEqual({
    to: '/customers/' + id + '?historyOffset=20',
    state: { returnTo: '/customers?q=Norte&offset=20' },
  });
  expect(
    simulationReturn(id, {
      customerSearch: '?historyOffset=-1',
      returnTo: 'https://invalid.example',
    }),
  ).toEqual({
    to: '/customers/' + id,
    state: { returnTo: '/customers' },
  });
});

it('WEB-HISTORY-008 accepts safe comparison feedback including zero and equal totals', () => {
  expect(
    simulationComparison({ simulationComparison: comparison }, id),
  ).toEqual({ previousTotalCents: 16940, savedTotalCents: 16800 });
  expect(
    simulationComparison(
      {
        simulationComparison: {
          ...comparison,
          previousTotalCents: 0,
          savedTotalCents: 0,
        },
      },
      id,
    ),
  ).toEqual({ previousTotalCents: 0, savedTotalCents: 0 });
});

it.each([
  undefined,
  null,
  [],
  {},
  { simulationComparison: null },
  { simulationComparison: { ...comparison, customerId: 'another' } },
  { simulationComparison: { ...comparison, previousTotalCents: -1 } },
  { simulationComparison: { ...comparison, savedTotalCents: '16800' } },
  { simulationComparison: { ...comparison, savedTotalCents: 1.5 } },
  {
    simulationComparison: {
      ...comparison,
      previousTotalCents: Number.MAX_SAFE_INTEGER + 1,
    },
  },
])(
  'WEB-HISTORY-008 ignores malformed or unrelated navigation feedback %#',
  (state) => {
    expect(simulationComparison(state, id)).toBeNull();
  },
);
