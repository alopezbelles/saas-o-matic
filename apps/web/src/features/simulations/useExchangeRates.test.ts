import { act, renderHook } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { useExchangeRates } from './useExchangeRates';
import type { CurrencyCode } from '@saas-o-matic/shared';
import type { ExchangeRates } from '../currency/exchange-contract';
import type { ExchangeClient } from '../currency/exchange-client';

function rates(lifetime = 1000): ExchangeRates {
  return {
    baseCurrency: 'EUR',
    rates: { USD: '1.2', GBP: '0.8' },
    updatedAt: new Date(Date.now() - 1000).toISOString(),
    expiresAt: new Date(Date.now() + lifetime).toISOString(),
    source: {
      name: 'ExchangeRate-API',
      url: 'https://www.exchangerate-api.com',
      attribution: 'Rates By Exchange Rate API',
    },
  };
}

it('WEB-FX-008 performs no request for EUR/disabled previews and ignores a late foreign result', async () => {
  let resolve!: (value: ExchangeRates) => void;
  const client: ExchangeClient = {
    getRates: vi.fn(
      () =>
        new Promise<ExchangeRates>((done) => {
          resolve = done;
        }),
    ),
  };
  const view = renderHook(
    ({ currency, enabled }: { currency: CurrencyCode; enabled: boolean }) =>
      useExchangeRates(currency, enabled, client),
    { initialProps: { currency: 'EUR' as CurrencyCode, enabled: true } },
  );
  expect(client.getRates).not.toHaveBeenCalled();
  view.rerender({ currency: 'USD', enabled: false });
  expect(client.getRates).not.toHaveBeenCalled();
  view.rerender({ currency: 'USD', enabled: true });
  view.rerender({ currency: 'EUR', enabled: true });
  await act(async () => resolve(rates()));
  expect(view.result.current.state.status).not.toBe('success');
  expect(client.getRates).toHaveBeenCalledTimes(1);
});

it('WEB-FX-008 expires displayed rates, requires an explicit retry and clears timers/listeners on unmount', async () => {
  vi.useFakeTimers();
  const getRates = vi.fn(async () => rates());
  const client = { getRates };
  const stable = renderHook(() => useExchangeRates('USD', true, client));
  await act(async () => {});
  expect(stable.result.current.state.status).toBe('success');
  await act(async () => vi.advanceTimersByTimeAsync(1000));
  expect(stable.result.current.state).toMatchObject({
    status: 'error',
    message: expect.stringContaining('caducado'),
  });
  expect(getRates).toHaveBeenCalledTimes(1);
  await act(async () => stable.result.current.retry());
  expect(stable.result.current.state.status).toBe('success');
  expect(getRates).toHaveBeenCalledTimes(2);
  stable.unmount();
  expect(vi.getTimerCount()).toBe(0);
  act(() => window.dispatchEvent(new Event('focus')));
  expect(getRates).toHaveBeenCalledTimes(2);
});

it('WEB-FX-008 rechecks expiry when the tab regains focus without automatically requesting new rates', async () => {
  vi.useFakeTimers();
  const getRates = vi.fn(async () => rates(10000));
  const client = { getRates };
  const view = renderHook(() => useExchangeRates('GBP', true, client));
  await act(async () => {});
  vi.setSystemTime(Date.now() + 20000);
  act(() => window.dispatchEvent(new Event('focus')));
  expect(view.result.current.state.status).toBe('error');
  expect(getRates).toHaveBeenCalledTimes(1);
});

it('never redisplays an old conversion when returning from EUR after expiry', async () => {
  vi.useFakeTimers();
  let resolve!: (value: ExchangeRates) => void;
  const getRates = vi
    .fn<ExchangeClient['getRates']>()
    .mockResolvedValueOnce(rates())
    .mockImplementation(
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
  const client = { getRates };
  const view = renderHook(
    ({ currency }: { currency: CurrencyCode }) =>
      useExchangeRates(currency, true, client),
    { initialProps: { currency: 'USD' as CurrencyCode } },
  );
  await act(async () => {});
  expect(view.result.current.state.status).toBe('success');
  view.rerender({ currency: 'EUR' });
  await act(async () => vi.advanceTimersByTimeAsync(2000));
  expect(getRates).toHaveBeenCalledTimes(1);
  view.rerender({ currency: 'USD' });
  expect(view.result.current.state.status).toBe('loading');
  await act(async () => resolve(rates()));
  expect(view.result.current.state.status).toBe('success');
});
