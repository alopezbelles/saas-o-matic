import { describe, expect, it, vi } from 'vitest';
import { createCustomer } from './customers';
import { getCustomerCountries, parseCustomerCountries } from './billing-config';
import {
  billingConfigFixture,
  customerFixture,
  customerInputFixture,
  jsonResponse,
} from '../test-fixtures';

describe('WEB-API-02', () => {
  it('sends exactly the normalized five fields and validates the 201 DTO', async () => {
    const fetcher = vi.fn(async () => jsonResponse(customerFixture(), 201));
    vi.stubGlobal('fetch', fetcher);
    await expect(
      createCustomer({
        ...customerInputFixture(),
        companyName: '  Empresa Nueva  ',
      }),
    ).resolves.toMatchObject({ id: customerFixture().id });
    const [url, options] = fetcher.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe('/api/customers');
    expect(options.method).toBe('POST');
    expect(options.headers).toEqual({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    expect(JSON.parse(options.body as string)).toEqual(customerInputFixture());
  });

  it('rejects invalid input before fetching and never retries a rejected POST', async () => {
    const fetcher = vi.fn(async () => jsonResponse({}, 503));
    vi.stubGlobal('fetch', fetcher);
    await expect(
      createCustomer({ ...customerInputFixture(), contactEmail: 'invalid' }),
    ).rejects.toThrow();
    expect(fetcher).not.toHaveBeenCalled();
    await expect(createCustomer(customerInputFixture())).rejects.toMatchObject({
      kind: 'http',
      status: 503,
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it.each([
    [200, customerFixture()],
    [201, {}],
    [201, { ...customerFixture(), id: 'invalid' }],
  ])(
    'rejects unexpected success status or malformed DTO (%s)',
    async (status, payload) => {
      vi.stubGlobal(
        'fetch',
        vi.fn(async () => jsonResponse(payload, status)),
      );
      await expect(
        createCustomer(customerInputFixture()),
      ).rejects.toMatchObject({ kind: 'protocol', status });
    },
  );

  it('derives supported countries from the API policy without a local country catalogue', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse(billingConfigFixture())),
    );
    const countries = await getCustomerCountries();
    expect(countries.map((country) => country.code).sort()).toEqual([
      'DE',
      'ES',
      'FR',
      'GB',
    ]);
    expect(countries.find((country) => country.code === 'ES')?.label).toBe(
      'España',
    );
    expect(
      parseCustomerCountries({
        ...billingConfigFixture(),
        ratesByCountry: { PT: 2300 },
      }),
    ).toEqual([{ code: 'PT', label: 'Portugal' }]);
  });

  it('rejects unavailable or malformed country configuration', () => {
    for (const payload of [
      null,
      {},
      { ...billingConfigFixture(), currency: 'USD' },
      { ...billingConfigFixture(), ratesByCountry: {} },
      { ...billingConfigFixture(), ratesByCountry: { ES: -1 } },
      { ...billingConfigFixture(), taxPolicyVersion: '' },
    ]) {
      expect(() => parseCustomerCountries(payload)).toThrow();
    }
  });
});
