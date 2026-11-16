import { describe, expect, it, vi } from 'vitest';
import { listCustomers, parseCustomerPage } from './customers';
import { getJson } from './http';
import { customerFixture, jsonResponse, pageFixture } from '../test-fixtures';

const query = { q: 'A & B', limit: 20, offset: 0 };

describe('WEB-API-01', () => {
  it('encodes query and validates the real page shape before exposing DTOs', async () => {
    const fetcher = vi.fn(async () => jsonResponse(pageFixture()));
    vi.stubGlobal('fetch', fetcher);
    expect((await listCustomers(query)).items[0]?.companyName).toBe(
      'Empresa 1',
    );
    const [url, options] = fetcher.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe('/api/customers?q=A+%26+B&limit=20&offset=0');
    expect(options.method).toBe('GET');
    expect(options.headers).toEqual({ Accept: 'application/json' });
    expect(options.signal).toBeInstanceOf(AbortSignal);
  });

  it('validates response structure without applying new fiscal/email rules to historical rows', () => {
    const page = pageFixture();
    page.items[0] = { ...customerFixture(), contactEmail: 'legacy-contact' };
    expect(parseCustomerPage(page, query).items[0]?.contactEmail).toBe(
      'legacy-contact',
    );
  });

  it('rejects malformed pages, invalid DTOs, duplicates and mismatched pagination', () => {
    for (const payload of [
      null,
      {},
      { ...pageFixture(), total: '1' },
      { ...pageFixture(), offset: 1 },
      { ...pageFixture(), limit: 100 },
      { ...pageFixture(), items: [] },
      { ...pageFixture(), items: [{ ...customerFixture(), id: 'bad-id' }] },
      {
        ...pageFixture(),
        items: [{ ...customerFixture(), planCode: 'unknown' }],
      },
      {
        ...pageFixture(),
        items: [{ ...customerFixture(), createdAt: 'not-a-date' }],
      },
      { ...pageFixture(2), items: [customerFixture(), customerFixture()] },
    ])
      expect(() => parseCustomerPage(payload, query)).toThrow();
  });

  it('preserves a validated HTTP error envelope without exposing server details as UI text', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        jsonResponse(
          {
            error: {
              code: 'DATABASE_BUSY',
              message: 'server message',
              requestId: 'request-1',
              fields: { q: 'invalid' },
            },
          },
          503,
        ),
      ),
    );
    await expect(listCustomers(query)).rejects.toMatchObject({
      kind: 'http',
      status: 503,
      envelope: { code: 'DATABASE_BUSY', requestId: 'request-1' },
      message: 'El servicio no está disponible. Inténtalo de nuevo.',
    });
  });

  it('distinguishes invalid JSON/content type from transport failure and validates queries before fetching', async () => {
    const fetcher = vi.fn(async () => new Response('<html>'));
    vi.stubGlobal('fetch', fetcher);
    await expect(listCustomers(query)).rejects.toMatchObject({
      kind: 'protocol',
    });
    fetcher.mockImplementation(
      async () =>
        new Response('{', { headers: { 'Content-Type': 'application/json' } }),
    );
    await expect(listCustomers(query)).rejects.toMatchObject({
      kind: 'protocol',
    });
    fetcher.mockImplementation(async () => {
      throw new TypeError('network details');
    });
    await expect(listCustomers(query)).rejects.toMatchObject({
      kind: 'network',
    });
    const calls = fetcher.mock.calls.length;
    await expect(listCustomers({ ...query, offset: -1 })).rejects.toThrow();
    expect(fetcher).toHaveBeenCalledTimes(calls);
  });

  it('aborts an uncooperative request and avoids starting already aborted requests', async () => {
    const fetcher = vi.fn(() => new Promise<Response>(() => {}));
    vi.stubGlobal('fetch', fetcher);
    const controller = new AbortController();
    const pending = listCustomers(query, controller.signal);
    const check = expect(pending).rejects.toMatchObject({ name: 'AbortError' });
    controller.abort();
    await check;
    await expect(listCustomers(query, controller.signal)).rejects.toMatchObject(
      { name: 'AbortError' },
    );
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('times out a stalled body at ten seconds', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        status: 200,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: () => new Promise(() => {}),
      })),
    );
    const pending = getJson('/customers');
    const check = expect(pending).rejects.toMatchObject({ kind: 'timeout' });
    await vi.advanceTimersByTimeAsync(9999);
    await vi.advanceTimersByTimeAsync(1);
    await check;
  });
});
