import { expect, it, vi } from 'vitest';
import {
  parseBillingConfiguration,
  isBillingConfigurationCompatible,
  getBillingConfiguration,
} from './billing-configuration';
import { configurationFixture } from '../../simulations/test-fixtures';
import { jsonResponse } from '../test-fixtures';

it('WEB-CONFIG-008 validates the complete API DTO and checks the compiled engine independently of server tax version', async () => {
  const source = configurationFixture();
  const parsed = parseBillingConfiguration(source);
  expect(parsed).toEqual(source);
  expect(isBillingConfigurationCompatible(parsed)).toBe(true);
  expect(
    isBillingConfigurationCompatible(
      parseBillingConfiguration({
        ...source,
        taxPolicyVersion: 'server-new-tax-policy',
        ratesByCountry: { ES: 1800 },
      }),
    ),
  ).toBe(true);
  const fetcher = vi.fn(async () => jsonResponse(source));
  vi.stubGlobal('fetch', fetcher);
  expect(await getBillingConfiguration()).toEqual(source);
  expect((fetcher.mock.calls[0] as unknown as [string])[0]).toBe(
    '/api/billing-config',
  );
  parsed.ratesByCountry.ES = 0;
  expect(source.ratesByCountry.ES).toBe(2100);
});

it.each([
  null,
  {},
  { ...configurationFixture(), currency: 'USD' },
  { ...configurationFixture(), pricingVersion: '' },
  { ...configurationFixture(), taxPolicyVersion: ' ' },
  { ...configurationFixture(), ratesByCountry: { ES: -1 } },
  { ...configurationFixture(), tiers: [] },
  { ...configurationFixture(), tiers: [null] },
  {
    ...configurationFixture(),
    tiers: [{ tierFrom: 0, tierTo: null, unitPriceCents: 10 }],
  },
  {
    ...configurationFixture(),
    tiers: [{ tierFrom: 1, tierTo: null, unitPriceCents: 0.5 }],
  },
  {
    ...configurationFixture(),
    tiers: [
      { tierFrom: 1, tierTo: null, unitPriceCents: 10 },
      { tierFrom: 2, tierTo: null, unitPriceCents: 10 },
    ],
  },
  { ...configurationFixture(), consumptionLimits: {} },
  {
    ...configurationFixture(),
    consumptionLimits: { users: '1000', storageGb: 10000, apiCalls: 10000000 },
  },
])('WEB-CONFIG-008 rejects malformed full configuration (%#)', (value) => {
  expect(() => parseBillingConfiguration(value)).toThrow();
});

it('WEB-CONFIG-008 distinguishes a structurally valid newer configuration from malformed data', () => {
  for (const value of [
    { ...configurationFixture(), pricingVersion: 'future-price' },
    {
      ...configurationFixture(),
      tiers: [{ tierFrom: 1, tierTo: null, unitPriceCents: 2000 }],
    },
    {
      ...configurationFixture(),
      consumptionLimits: { users: 500, storageGb: 10000, apiCalls: 10000000 },
    },
  ])
    expect(
      isBillingConfigurationCompatible(parseBillingConfiguration(value)),
    ).toBe(false);
});
