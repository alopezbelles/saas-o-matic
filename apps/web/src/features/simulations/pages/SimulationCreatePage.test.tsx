import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation, useNavigate } from 'react-router';
import { expect, it, vi } from 'vitest';
import { AppRoutes } from '../../../app/AppRoutes';
import {
  customerFixture,
  historyFixture,
  jsonResponse,
} from '../../customers/test-fixtures';
import { configurationFixture } from '../test-fixtures';

const id = customerFixture().id;
const path = '/customers/' + id + '/simulations/new';
function Probe() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <output aria-label="URL actual">
        {location.pathname + location.search}
      </output>
      <button
        onClick={() =>
          navigate('/customers/' + customerFixture(2).id + '/simulations/new')
        }
      >
        Otro cliente
      </button>
    </>
  );
}
const handler = async (url: string) =>
  jsonResponse(
    url.includes('billing-config')
      ? configurationFixture()
      : url.includes('/simulations?')
        ? historyFixture()
        : customerFixture(),
  );
function mount(
  fetch: (url: string, options?: RequestInit) => Promise<Response> = handler,
  route = path,
) {
  const fetcher = vi.fn(fetch);
  vi.stubGlobal('fetch', fetcher);
  const result = render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: route,
          state: {
            returnTo: '/customers?q=Norte&offset=20',
            customerSearch: '?historyOffset=20',
          },
        },
      ]}
    >
      <AppRoutes />
      <Probe />
    </MemoryRouter>,
  );
  return { ...result, fetcher };
}
const users = () => screen.getByRole('textbox', { name: 'Usuarios activos' });

it('WEB-SIM-01 initializes the fields at zero/EUR, synchronizes slider and number and never requests FX or POST', async () => {
  const { fetcher } = mount();
  expect(
    screen.getByRole('heading', { name: 'Simular suscripción' }),
  ).toHaveFocus();
  expect(users()).toBeDisabled();
  await screen.findByText(/Empresa 1 ·/);
  await vi.waitFor(() => expect(users()).toBeEnabled());
  expect(users()).toHaveValue('0');
  expect(screen.getByLabelText(/Almacenamiento contratado/)).toHaveValue('0');
  expect(screen.getByLabelText(/Llamadas API estimadas/)).toHaveValue('0');
  expect(screen.getByText('Moneda de cálculo: EUR')).toBeInTheDocument();
  const slider = screen.getByRole('slider', {
    name: 'Usuarios activos (deslizador)',
  });
  expect(slider).toHaveAttribute('max', '1000');
  for (const number of [0, 10, 11, 15, 50, 51, 1000]) {
    fireEvent.change(slider, { target: { value: String(number) } });
    expect(users()).toHaveValue(String(number));
  }
  fireEvent.change(users(), { target: { value: '51' } });
  expect(slider).toHaveValue('51');
  for (const invalid of ['', '1.5', '-1', '1001', '1e2']) {
    fireEvent.change(users(), { target: { value: invalid } });
    expect(users()).toHaveValue(invalid);
    expect(users()).toHaveAttribute('aria-invalid', 'true');
    expect(slider).toHaveValue('51');
  }
  fireEvent.change(slider, { target: { value: '15' } });
  expect(users()).toHaveValue('15');
  expect(users()).toHaveAttribute('aria-invalid', 'false');
  expect(fetcher).toHaveBeenCalledTimes(2);
  expect(
    fetcher.mock.calls.every(
      ([url, options]) => url.startsWith('/api/') && options?.method === 'GET',
    ),
  ).toBe(true);
  expect(
    screen.queryByRole('button', { name: /Guardar/ }),
  ).not.toBeInTheDocument();
});

it('WEB-SIM-02 validates storage/API boundaries and preserves their separate draft values', async () => {
  mount();
  await vi.waitFor(() => expect(users()).toBeEnabled());
  const storage = screen.getByLabelText(/Almacenamiento contratado/);
  const calls = screen.getByLabelText(/Llamadas API estimadas/);
  fireEvent.change(storage, { target: { value: '10000' } });
  fireEvent.change(calls, { target: { value: '10000000' } });
  expect(storage).toHaveAttribute('aria-invalid', 'false');
  expect(calls).toHaveAttribute('aria-invalid', 'false');
  fireEvent.change(storage, { target: { value: '10001' } });
  fireEvent.change(calls, { target: { value: '10000001' } });
  expect(storage).toHaveAttribute('aria-invalid', 'true');
  expect(calls).toHaveAttribute('aria-invalid', 'true');
  expect(users()).toHaveValue('0');
});

it('rejects invalid route IDs without fetching and displays 404 without retrying a missing client', async () => {
  const first = mount(handler, '/customers/invalid/simulations/new');
  expect(screen.getByRole('alert')).toHaveTextContent(
    'El identificador del cliente no es válido.',
  );
  expect(first.fetcher).not.toHaveBeenCalled();
  first.unmount();
  mount(async (url) =>
    url.includes('billing-config')
      ? jsonResponse(configurationFixture())
      : jsonResponse({}, 404),
  );
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'No se ha encontrado el cliente.',
  );
  expect(
    screen.queryByRole('button', { name: 'Reintentar cliente' }),
  ).not.toBeInTheDocument();
  expect(users()).toBeDisabled();
});

it('WEB-CONFIG-008 blocks incompatible configuration and retries without losing draft or reloading the client', async () => {
  const { fetcher } = mount(async (url) =>
    jsonResponse(
      url.includes('billing-config')
        ? { ...configurationFixture(), pricingVersion: 'future-price' }
        : customerFixture(),
    ),
  );
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'no es compatible',
  );
  expect(users()).toBeDisabled();
  // Draft stays mounted across configuration retries and failures.
  fetcher.mockImplementation(handler);
  await userEvent.click(
    screen.getByRole('button', { name: 'Reintentar configuración' }),
  );
  await vi.waitFor(() => expect(users()).toBeEnabled());
  fireEvent.change(users(), { target: { value: '15' } });
  expect(users()).toHaveValue('15');
  expect(
    fetcher.mock.calls.filter(([url]) => !url.includes('billing-config')),
  ).toHaveLength(1);
});

it('recovers malformed/unavailable configuration and a temporary client error independently', async () => {
  const { fetcher } = mount(async () => jsonResponse({}, 503));
  await screen.findByRole('button', { name: 'Reintentar cliente' });
  fetcher.mockImplementation(async (url) =>
    jsonResponse(url.includes('billing-config') ? {} : customerFixture()),
  );
  await userEvent.click(
    screen.getByRole('button', { name: 'Reintentar cliente' }),
  );
  await screen.findByRole('button', { name: 'Reintentar configuración' });
  expect(users()).toBeDisabled();
  fetcher.mockImplementation(handler);
  await userEvent.click(
    screen.getByRole('button', { name: 'Reintentar configuración' }),
  );
  await vi.waitFor(() => expect(users()).toBeEnabled());
});

it('blocks countries outside policy but preserves navigation to their existing detail/history', async () => {
  mount(async (url) =>
    jsonResponse(
      url.includes('billing-config')
        ? configurationFixture()
        : { ...customerFixture(), countryCode: 'PT' },
    ),
  );
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'no tiene una tarifa configurada',
  );
  expect(users()).toBeDisabled();
  expect(
    screen.getByRole('link', { name: 'Volver al cliente' }),
  ).toHaveAttribute('href', '/customers/' + id + '?historyOffset=20');
});

it('preserves detail pagination/list search through navigation and breadcrumbs', async () => {
  const { fetcher } = mount();
  await vi.waitFor(() => expect(users()).toBeEnabled());
  const breadcrumbs = screen.getByRole('navigation', {
    name: 'Ruta de navegación',
  });
  expect(breadcrumbs).toHaveTextContent('Nueva simulación');
  expect(
    screen.getByRole('link', { name: 'Ficha del cliente' }),
  ).toHaveAttribute('href', '/customers/' + id + '?historyOffset=20');
  fetcher.mockImplementation(async (url) =>
    jsonResponse(
      url.includes('/simulations?')
        ? historyFixture(0, 0, 20)
        : customerFixture(),
    ),
  );
  await userEvent.click(
    screen.getByRole('link', { name: 'Volver al cliente' }),
  );
  expect(screen.getByLabelText('URL actual')).toHaveTextContent(
    '?historyOffset=20',
  );
  expect(
    screen.getByRole('link', { name: 'Volver a clientes' }),
  ).toHaveAttribute('href', '/customers?q=Norte&offset=20');
});

it('ignores late customer/configuration responses after changing client and aborts on unmount', async () => {
  let resolve!: (value: Response) => void;
  const signals: AbortSignal[] = [];
  let configCalls = 0;
  const { unmount } = mount(async (url, options) => {
    signals.push(options!.signal as AbortSignal);
    if (url.includes('billing-config')) {
      if (++configCalls === 1)
        return new Promise((done) => {
          resolve = done;
        });
      return jsonResponse(configurationFixture());
    }
    return jsonResponse(
      url.includes(customerFixture(2).id)
        ? customerFixture(2)
        : customerFixture(),
    );
  });
  await screen.findByText(/Empresa 1 ·/);
  await userEvent.click(screen.getByRole('button', { name: 'Otro cliente' }));
  await vi.waitFor(() => expect(users()).toBeEnabled());
  await screen.findByText(/Empresa 2 ·/);
  await act(async () =>
    resolve(
      jsonResponse({ ...configurationFixture(), pricingVersion: 'old-late' }),
    ),
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(signals[1]?.aborted).toBe(true);
  unmount();
});

it('starts a new draft at zero when navigating to a different customer', async () => {
  mount(async (url) =>
    jsonResponse(
      url.includes('billing-config')
        ? configurationFixture()
        : url.includes(customerFixture(2).id)
          ? customerFixture(2)
          : customerFixture(),
    ),
  );
  await vi.waitFor(() => expect(users()).toBeEnabled());
  fireEvent.change(users(), { target: { value: '15' } });
  await userEvent.click(screen.getByRole('button', { name: 'Otro cliente' }));
  await screen.findByText(/Empresa 2 ·/);
  expect(users()).toHaveValue('0');
  expect(screen.getByRole('slider')).toHaveValue('0');
});
