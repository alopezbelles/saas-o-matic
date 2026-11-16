import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { expect, it, vi } from 'vitest';
import { AppRoutes } from '../../../app/AppRoutes';
import {
  createExchangeClient,
  exchangeClient,
} from '../../currency/exchange-client';
import { customerFixture, jsonResponse } from '../../customers/test-fixtures';
import { configurationFixture } from '../test-fixtures';

vi.mock('../../currency/exchange-client', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../currency/exchange-client')>();
  return { ...actual, exchangeClient: { getRates: vi.fn() } };
});

async function mount(
  fx: () => Promise<Response> = async () => jsonResponse(provider()),
  config = configurationFixture(),
  customer = customerFixture(),
) {
  const fetcher = vi.fn(async (url: string) =>
    url.startsWith('https://open.er-api.com')
      ? fx()
      : jsonResponse(url.includes('billing-config') ? config : customer),
  );
  vi.stubGlobal('fetch', fetcher);
  // Isolate cache between cases while exercising the existing real client/parser.
  const client = createExchangeClient();
  vi.mocked(exchangeClient.getRates).mockImplementation((currency) =>
    client.getRates(currency),
  );
  render(
    <MemoryRouter
      initialEntries={[
        '/customers/' + customerFixture().id + '/simulations/new',
      ]}
    >
      <AppRoutes />
    </MemoryRouter>,
  );
  await vi.waitFor(() =>
    expect(
      screen.getByRole('textbox', { name: 'Usuarios activos' }),
    ).toBeEnabled(),
  );
  return fetcher;
}
function provider() {
  const now = Math.floor(Date.now() / 1000);
  return {
    result: 'success',
    base_code: 'EUR',
    rates: { EUR: 1, USD: 1.2, GBP: 0.8 },
    time_last_update_unix: now - 10,
    time_next_update_unix: now + 3600,
  };
}
const setUsers = (value: string) =>
  fireEvent.change(screen.getByRole('textbox', { name: 'Usuarios activos' }), {
    target: { value },
  });

it('WEB-SIM-02 uses the same tariff for the professional demo plan', async () => {
  await mount(undefined, configurationFixture(), {
    ...customerFixture(),
    planCode: 'DEMO_PRO',
  });
  setUsers('15');
  expect(screen.getByLabelText('Total mensual')).toHaveTextContent('169,40');
});

it('blocks an overflowing quote without presenting a stale or approximate total', async () => {
  await mount(undefined, {
    ...configurationFixture(),
    ratesByCountry: { ES: Number.MAX_SAFE_INTEGER },
  });
  setUsers('15');
  expect(screen.queryByLabelText('Total mensual')).not.toBeInTheDocument();
  expect(
    screen.getByRole('region', { name: 'Resumen mensual' }),
  ).toHaveTextContent('No se puede calcular');
});

it.each(['malformed', 'expired', 'overflow'])(
  'WEB-FX-008 falls back to EUR for %s conversion data',
  async (kind) => {
    await mount(async () =>
      jsonResponse({
        ...provider(),
        ...(kind === 'expired'
          ? { time_next_update_unix: Math.floor(Date.now() / 1000) - 1 }
          : {
              rates: { EUR: 1, USD: kind === 'overflow' ? 1e308 : 0, GBP: 0.8 },
            }),
      }),
    );
    setUsers('15');
    await userEvent.selectOptions(screen.getByRole('combobox'), 'USD');
    expect(await screen.findByRole('alert')).toHaveTextContent('EUR');
    expect(screen.getByLabelText('Total mensual')).toHaveTextContent('169,40');
    expect(
      screen.queryByRole('link', { name: 'Rates By Exchange Rate API' }),
    ).not.toBeInTheDocument();
  },
);

it('WEB-SIM-01/02 displays independent EUR oracles, metadata does not add charges and invalid drafts remove stale totals', async () => {
  const fetcher = await mount();
  for (const [users, total] of [
    [0, '0,00'],
    [10, '121,00'],
    [11, '130,68'],
    [15, '169,40'],
    [50, '508,20'],
    [51, '514,25'],
    [1000, '6255,70'],
  ] as const) {
    setUsers(String(users));
    expect(
      screen.getByLabelText('Total mensual').textContent?.replace(/\./g, ''),
    ).toContain(total);
  }
  setUsers('15');
  const summary = screen.getByRole('region', { name: 'Resumen mensual' });
  expect(summary).toHaveTextContent('100,00');
  expect(summary).toHaveTextContent('40,00');
  expect(summary).toHaveTextContent('140,00');
  expect(summary).toHaveTextContent('29,40');
  fireEvent.change(screen.getByLabelText(/Almacenamiento contratado/), {
    target: { value: '500' },
  });
  fireEvent.change(screen.getByLabelText(/Llamadas API estimadas/), {
    target: { value: '1000000' },
  });
  expect(screen.getByLabelText('Total mensual')).toHaveTextContent('169,40');
  setUsers('');
  expect(screen.queryByLabelText('Total mensual')).not.toBeInTheDocument();
  expect(summary).toHaveTextContent('Revisa los consumos');
  expect(fetcher).toHaveBeenCalledTimes(2);
});

it('WEB-FX-008 converts only the total, preserves EUR breakdown and shares cached rates across amounts/currencies', async () => {
  const fetcher = await mount();
  setUsers('15');
  const user = userEvent.setup();
  const selector = screen.getByRole('combobox', {
    name: 'Divisa de visualización',
  });
  await user.selectOptions(selector, 'USD');
  await vi.waitFor(() =>
    expect(screen.getByLabelText('Total mensual')).toHaveTextContent('203,28'),
  );
  const summary = screen.getByRole('region', { name: 'Resumen mensual' });
  expect(summary).toHaveTextContent('140,00');
  expect(summary).toHaveTextContent('29,40');
  expect(
    within(summary).getByRole('link', { name: 'Rates By Exchange Rate API' }),
  ).toHaveAttribute('href', 'https://www.exchangerate-api.com');
  expect(summary).toHaveTextContent('Conversión orientativa al tipo de');
  setUsers('10');
  expect(screen.getByLabelText('Total mensual')).toHaveTextContent('145,20');
  await user.selectOptions(selector, 'GBP');
  await vi.waitFor(() =>
    expect(screen.getByLabelText('Total mensual')).toHaveTextContent('96,80'),
  );
  expect(
    fetcher.mock.calls.filter(([url]) => url.startsWith('https://')),
  ).toHaveLength(1);
  await user.selectOptions(selector, 'EUR');
  expect(screen.getByLabelText('Total mensual')).toHaveTextContent('121,00');
});

it('WEB-FX-008 falls back to labelled EUR after a provider failure and only retries conversion explicitly', async () => {
  let fail = true;
  const fetcher = await mount(async () => {
    if (fail) throw new TypeError('offline');
    return jsonResponse(provider());
  });
  setUsers('15');
  await userEvent.selectOptions(screen.getByRole('combobox'), 'USD');
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Se muestra en EUR',
  );
  expect(screen.getByLabelText('Total mensual')).toHaveTextContent('169,40');
  setUsers('');
  setUsers('10');
  expect(
    fetcher.mock.calls.filter(([url]) => url.startsWith('https://')),
  ).toHaveLength(1);
  fail = false;
  await userEvent.click(
    screen.getByRole('button', { name: 'Reintentar conversión' }),
  );
  await vi.waitFor(() =>
    expect(screen.getByLabelText('Total mensual')).toHaveTextContent('145,20'),
  );
  expect(
    fetcher.mock.calls.filter(([url]) => url.startsWith('https://')),
  ).toHaveLength(2);
  expect(
    fetcher.mock.calls.every(([url]) => !url.endsWith('/simulations')),
  ).toBe(true);
});
