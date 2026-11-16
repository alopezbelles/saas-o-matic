import { describe, expect, it, vi } from 'vitest';
import { getCustomer } from './customers';
import {
  listSimulations,
  parseSimulationDto,
  parseSimulationPage,
} from './simulations';
import {
  customerFixture,
  historyFixture,
  jsonResponse,
  simulationFixture,
} from '../test-fixtures';

const id = customerFixture().id;
const query = { limit: 20, offset: 0 };

describe('WEB-DETAIL-API-01', () => {
  it('validates IDs before fetching and rejects a different customer returned by the API', async () => {
    const fetcher = vi.fn(async () => jsonResponse(customerFixture(2)));
    vi.stubGlobal('fetch', fetcher);
    await expect(getCustomer('invalid')).rejects.toThrow();
    await expect(listSimulations('invalid', query)).rejects.toThrow();
    expect(fetcher).not.toHaveBeenCalled();
    await expect(getCustomer(id)).rejects.toMatchObject({ kind: 'protocol' });
  });

  it('requests the correct detail and history endpoints with validated pagination', async () => {
    const fetcher = vi.fn(async (url: string) =>
      jsonResponse(
        url.includes('simulations') ? historyFixture() : customerFixture(),
      ),
    );
    vi.stubGlobal('fetch', fetcher);
    await expect(getCustomer(id)).resolves.toEqual(customerFixture());
    await expect(listSimulations(id, query)).resolves.toEqual(historyFixture());
    expect(fetcher.mock.calls.map(([url]) => url)).toEqual([
      '/api/customers/' + id,
      '/api/customers/' + id + '/simulations?limit=20&offset=0',
    ]);
    await expect(
      listSimulations(id, { ...query, offset: -1 }),
    ).rejects.toThrow();
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('retains historical prices, tax, snapshots and API order without applying the current configuration', () => {
    const original = historyFixture(2);
    const parsed = parseSimulationPage(original, id, query);
    expect(parsed).toEqual(original);
    expect(parsed.items[0]?.customerSnapshot.companyName).toBe(
      'Nombre histórico',
    );
    expect(parsed.items[0]?.totalCents).toBe(2591);
    expect(parseSimulationPage(historyFixture(0), id, query).items).toEqual([]);
  });

  it.each([
    null,
    {},
    { ...simulationFixture(), id: 'bad' },
    { ...simulationFixture(), customerId: customerFixture(2).id },
    { ...simulationFixture(), currency: 'USD' },
    { ...simulationFixture(), users: -1 },
    { ...simulationFixture(), storageGb: 0.5 },
    { ...simulationFixture(), apiCalls: '10' },
    { ...simulationFixture(), totalCents: 2592 },
    { ...simulationFixture(), taxCents: Number.MAX_SAFE_INTEGER + 1 },
    { ...simulationFixture(), taxRateBps: -1 },
    { ...simulationFixture(), pricingVersion: '' },
    { ...simulationFixture(), taxPolicyVersion: null },
    { ...simulationFixture(), createdAt: '2026-02-30T12:00:00.000Z' },
    { ...simulationFixture(), customerSnapshot: {} },
    {
      ...simulationFixture(),
      customerSnapshot: {
        ...simulationFixture().customerSnapshot,
        planCode: 'unknown',
      },
    },
    { ...simulationFixture(), breakdown: [] },
    {
      ...simulationFixture(),
      breakdown: [{ ...simulationFixture().breakdown[0], quantity: 1 }],
    },
    {
      ...simulationFixture(),
      breakdown: [{ ...simulationFixture().breakdown[0], unitPriceCents: -1 }],
    },
  ])('rejects malformed history rows (%#)', (value) => {
    expect(() => parseSimulationDto(value, id)).toThrow();
  });

  it('rejects duplicate IDs, inconsistent totals/page size and mixed customer rows', () => {
    for (const value of [
      null,
      { ...historyFixture(), total: -1 },
      { ...historyFixture(), offset: 20 },
      { ...historyFixture(), items: [] },
      {
        ...historyFixture(2),
        items: [simulationFixture(), simulationFixture()],
      },
      {
        ...historyFixture(),
        items: [simulationFixture(1, customerFixture(2).id)],
      },
    ]) {
      expect(() => parseSimulationPage(value, id, query)).toThrow();
    }
  });
});
