import assert from 'node:assert/strict';
import test from 'node:test';
import { convertCurrency } from '../../../packages/shared/dist/index.js';
import { createExchangeClient } from '../.cache/currency-tests/exchange-client.js';
import { ExchangeError } from '../.cache/currency-tests/exchange-contract.js';
import {
  nowMs,
  providerSuccess,
  normalizedRates,
} from './currency-fixtures.mjs';

test('006-T05: client and exact conversion compose without refetch on amount changes or mutation of EUR', async () => {
  let requests = 0;
  const client = createExchangeClient({
    now: () => nowMs,
    fetch: async () => {
      requests++;
      return new Response(JSON.stringify(providerSuccess()));
    },
  });
  const snapshot = Object.freeze({ currency: 'EUR', totalCents: 16940 });
  for (const [currency, expected] of [
    ['USD', 18634],
    ['GBP', 13552],
  ]) {
    const rates = await client.getRates(currency);
    assert.deepEqual(
      convertCurrency({
        amountEurCents: snapshot.totalCents,
        targetCurrency: currency,
        rate: rates.rates[currency],
      }),
      {
        amountMinor: expected,
        currency,
        exponent: 2,
      },
    );
    assert.equal(rates.updatedAt, normalizedRates().updatedAt);
    assert.equal(rates.source.attribution, 'Rates By Exchange Rate API');
  }
  const rates = await client.getRates('USD');
  assert.equal(
    convertCurrency({
      amountEurCents: 100,
      targetCurrency: 'USD',
      rate: rates.rates.USD,
    }).amountMinor,
    110,
  );
  assert.equal(requests, 1);
  assert.deepEqual(snapshot, { currency: 'EUR', totalCents: 16940 });
});

test('006-T05: failed FX leaves EUR identity usable and explicit recovery preserves total', async () => {
  let requests = 0;
  const client = createExchangeClient({
    now: () => nowMs,
    fetch: async () => {
      requests++;
      return requests === 1
        ? new Response('busy', { status: 429 })
        : new Response(JSON.stringify(providerSuccess()));
    },
  });
  const totalEurCents = 16940;
  await assert.rejects(
    client.getRates('USD'),
    (error) =>
      error instanceof ExchangeError && error.code === 'EXCHANGE_HTTP_ERROR',
  );
  assert.equal(await client.getRates('EUR'), null);
  assert.equal(
    convertCurrency({ amountEurCents: totalEurCents, targetCurrency: 'EUR' })
      .amountMinor,
    16940,
  );
  const rates = await client.getRates('GBP');
  assert.equal(
    convertCurrency({
      amountEurCents: totalEurCents,
      targetCurrency: 'GBP',
      rate: rates.rates.GBP,
    }).amountMinor,
    13552,
  );
  assert.equal(totalEurCents, 16940);
  assert.equal(requests, 2);
});
