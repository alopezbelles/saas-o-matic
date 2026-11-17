import { expect, it } from 'vitest';
import type { SimulationDto } from '@saas-o-matic/shared';
import { simulationFixture } from '../customers/test-fixtures';
import { quoteChanged, savedQuote } from './saved-result';

it('projects a historical result without applying current pricing or taxes and copies its breakdown', () => {
  const saved = simulationFixture() as SimulationDto;
  const quote = savedQuote(saved);
  expect(quote).toMatchObject({
    baseCents: 2468,
    taxCents: 123,
    totalCents: 2591,
    rateBps: 500,
    pricingVersion: 'historical-price-v0',
  });
  expect(quote.breakdown).not.toBe(saved.breakdown);
  expect(quote.breakdown[0]).not.toBe(saved.breakdown[0]);
  expect(quoteChanged(quote, saved)).toBe(false);
});

it('detects version-only discrepancies even when both totals remain zero', () => {
  const saved = {
    ...simulationFixture(),
    users: 0,
    baseCents: 0,
    taxCents: 0,
    totalCents: 0,
    breakdown: [],
  } as SimulationDto;
  const quote = savedQuote(saved);
  expect(quoteChanged(quote, { ...saved, pricingVersion: 'new-price' })).toBe(
    true,
  );
  expect(quoteChanged(quote, { ...saved, taxPolicyVersion: 'new-tax' })).toBe(
    true,
  );
});

it('detects changes to tax rates or tier details even if final totals match', () => {
  const saved = simulationFixture() as SimulationDto;
  const quote = savedQuote(saved);
  expect(quoteChanged(quote, { ...saved, taxRateBps: 501 })).toBe(true);
  expect(
    quoteChanged(quote, {
      ...saved,
      breakdown: saved.breakdown.map((tier) => ({ ...tier, tierTo: null })),
    }),
  ).toBe(true);
});
