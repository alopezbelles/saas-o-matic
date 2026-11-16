import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation, useNavigate } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { AppRoutes } from '../../../app/AppRoutes';
import {
  customerFixture,
  historyFixture,
  jsonResponse,
} from '../test-fixtures';

const id = customerFixture().id;
const route = '/customers/' + id;
function Probe() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <output aria-label="URL actual">
        {location.pathname + location.search}
      </output>
      <button onClick={() => navigate('/customers/' + customerFixture(2).id)}>
        Otro cliente
      </button>
      <button
        onClick={() =>
          navigate(route + '?historyOffset=20', { state: location.state })
        }
      >
        Historial 20
      </button>
      <button
        onClick={() =>
          navigate(route + '?historyOffset=40', { state: location.state })
        }
      >
        Historial 40
      </button>
      <button onClick={() => navigate(-1)}>Atrás de prueba</button>
    </>
  );
}
function mount(
  handler: (url: string, options?: RequestInit) => Promise<Response>,
  path = route,
) {
  const entry = new URL(path, 'http://test');
  const fetcher = vi.fn(handler);
  vi.stubGlobal('fetch', fetcher);
  return {
    ...render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: entry.pathname,
            search: entry.search,
            state: { returnTo: '/customers?q=Empresa&offset=20' },
          },
        ]}
      >
        <AppRoutes />
        <Probe />
      </MemoryRouter>,
    ),
    fetcher,
  };
}
const response = async (url: string) =>
  jsonResponse(
    url.includes('simulations') ? historyFixture() : customerFixture(),
  );

describe('WEB-DETAIL-01 and WEB-STATE-01', () => {
  it('renders corporate/contact cards and stored EUR history, including a country outside the creation selector', async () => {
    mount(async (url) =>
      jsonResponse(
        url.includes('simulations')
          ? historyFixture()
          : { ...customerFixture(), countryCode: 'PT' },
      ),
    );
    expect(screen.getByText('Cargando cliente…')).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Empresa 1' }),
    ).toHaveFocus();
    expect(
      screen.getByRole('region', { name: 'Datos corporativos' }),
    ).toHaveTextContent('Portugal');
    expect(screen.getByRole('region', { name: 'Contacto' })).toHaveTextContent(
      'contacto@example.invalid',
    );
    const history = await screen.findByRole('table', {
      name: /Simulaciones guardadas/,
    });
    expect(history).toHaveTextContent('25,91');
    expect(history).toHaveTextContent('50 GB');
    expect(history).toHaveTextContent('10.000');
    expect(history).toHaveTextContent('EUR');
    expect(
      screen.queryByRole('link', { name: /Nueva simulación|Ver detalle/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Volver a clientes' }),
    ).toHaveAttribute('href', '/customers?q=Empresa&offset=20');
  });

  it('rejects an invalid route ID without fetching either resource', () => {
    const { fetcher } = mount(response, '/customers/invalid');
    expect(screen.getByRole('alert')).toHaveTextContent(
      'El identificador del cliente no es válido.',
    );
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('distinguishes missing clients from temporary failures and retries only the client', async () => {
    const { fetcher } = mount(async () => jsonResponse({}, 404));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se ha encontrado el cliente.',
    );
    expect(
      screen.queryByRole('button', { name: 'Reintentar cliente' }),
    ).not.toBeInTheDocument();
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('recovers a temporary client failure before requesting history', async () => {
    const { fetcher } = mount(async () => jsonResponse({}, 503));
    await screen.findByRole('button', { name: 'Reintentar cliente' });
    expect(fetcher).toHaveBeenCalledTimes(1);
    fetcher.mockImplementation(response);
    await userEvent.click(
      screen.getByRole('button', { name: 'Reintentar cliente' }),
    );
    await screen.findByRole('table');
    expect(
      screen.getByRole('heading', { name: 'Empresa 1' }),
    ).toBeInTheDocument();
  });

  it('retains the client while history loads/fails and retries only history', async () => {
    let resolve!: (response: Response) => void;
    const { fetcher } = mount(async (url) =>
      url.includes('simulations')
        ? new Promise((done) => {
            resolve = done;
          })
        : jsonResponse(customerFixture()),
    );
    await screen.findByText('Cargando historial…');
    expect(screen.getByRole('region', { name: 'Contacto' })).toHaveTextContent(
      'contacto@example.invalid',
    );
    await act(async () => resolve(jsonResponse({}, 503)));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Los datos del cliente siguen disponibles.',
    );
    fetcher.mockImplementation(response);
    await userEvent.click(
      screen.getByRole('button', { name: 'Reintentar historial' }),
    );
    await screen.findByRole('table');
    expect(
      fetcher.mock.calls.filter(([url]) => !url.includes('simulations')),
    ).toHaveLength(1);
  });

  it.each([
    ['', 'Este cliente todavía no tiene simulaciones guardadas.'],
    ['?historyOffset=20', 'No hay simulaciones en esta página.'],
    [
      '?historyOffset=-1',
      'La dirección contiene parámetros de historial no válidos.',
    ],
  ])(
    'keeps the card available with empty/out-of-range/invalid history %s',
    async (search, message) => {
      const { fetcher } = mount(
        async (url) =>
          jsonResponse(
            url.includes('simulations')
              ? historyFixture(0, 0, search.includes('20') ? 20 : 0)
              : customerFixture(),
          ),
        route + search,
      );
      expect(await screen.findByText(message)).toBeInTheDocument();
      expect(
        screen.getByRole('region', { name: 'Datos corporativos' }),
      ).toBeInTheDocument();
      if (search.includes('-1')) expect(fetcher).toHaveBeenCalledTimes(1);
      if (search) {
        await userEvent.click(
          screen.getByRole('button', {
            name: search.includes('-1')
              ? 'Restablecer historial'
              : 'Volver a la primera página',
          }),
        );
        expect(screen.getByLabelText('URL actual')).toHaveTextContent(route);
        expect(screen.getByLabelText('URL actual')).not.toHaveTextContent(
          'historyOffset',
        );
      }
    },
  );

  it('paginates in the URL, preserves list return context and restores history with back navigation', async () => {
    const { fetcher } = mount(async (url) => {
      const offset = Number(
        new URL(url, 'http://local').searchParams.get('offset'),
      );
      return jsonResponse(
        url.includes('simulations')
          ? historyFixture(offset ? 1 : 20, 21, offset)
          : customerFixture(),
      );
    });
    await screen.findByRole('table');
    const pagination = screen.getByRole('navigation', {
      name: 'Paginación del historial',
    });
    await userEvent.click(
      within(pagination).getByRole('button', { name: 'Siguiente' }),
    );
    await screen.findByText('Mostrando 21–21 de 21');
    expect(screen.getByLabelText('URL actual')).toHaveTextContent(
      '?historyOffset=20',
    );
    expect(
      screen.getByRole('link', { name: 'Volver a clientes' }),
    ).toHaveAttribute('href', '/customers?q=Empresa&offset=20');
    expect(
      within(
        screen.getByRole('navigation', { name: 'Paginación del historial' }),
      ).getByRole('button', { name: 'Siguiente' }),
    ).toBeDisabled();
    await userEvent.click(
      screen.getByRole('button', { name: 'Atrás de prueba' }),
    );
    await screen.findByText('Mostrando 1–20 de 21');
    expect(
      fetcher.mock.calls.filter(([url]) => !url.includes('simulations')),
    ).toHaveLength(1);
  });

  it('ignores an old history page after a newer page arrives and aborts its request', async () => {
    let resolve!: (response: Response) => void;
    let signal: AbortSignal | null | undefined;
    mount(async (url, options) => {
      if (!url.includes('simulations')) return jsonResponse(customerFixture());
      const offset = Number(
        new URL(url, 'http://local').searchParams.get('offset'),
      );
      if (offset === 20) {
        signal = options?.signal;
        return new Promise((done) => {
          resolve = done;
        });
      }
      return jsonResponse(historyFixture(offset ? 1 : 20, 41, offset));
    });
    await screen.findByRole('table');
    await userEvent.click(screen.getByRole('button', { name: 'Historial 20' }));
    await screen.findByText('Cargando historial…');
    await userEvent.click(screen.getByRole('button', { name: 'Historial 40' }));
    await screen.findByText('Mostrando 41–41 de 41');
    expect(signal?.aborted).toBe(true);
    await act(async () => resolve(jsonResponse(historyFixture(20, 41, 20))));
    expect(screen.getByText('Mostrando 41–41 de 41')).toBeInTheDocument();
  });

  it('ignores a late customer response after navigating to a different customer', async () => {
    let resolve!: (response: Response) => void;
    mount(async (url) => {
      if (url === '/api' + route)
        return new Promise((done) => {
          resolve = done;
        });
      return jsonResponse(
        url.includes('simulations')
          ? historyFixture(0, 0, 0, customerFixture(2).id)
          : customerFixture(2),
      );
    });
    await userEvent.click(screen.getByRole('button', { name: 'Otro cliente' }));
    await screen.findByRole('heading', { name: 'Empresa 2' });
    await act(async () => resolve(jsonResponse(customerFixture())));
    expect(
      screen.queryByRole('heading', { name: 'Empresa 1' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Empresa 2' }),
    ).toBeInTheDocument();
  });

  it('aborts history on unmount without rendering a late error', async () => {
    let signal: AbortSignal | null | undefined;
    const { unmount } = mount(async (url, options) => {
      if (!url.includes('simulations')) return jsonResponse(customerFixture());
      signal = options?.signal;
      return new Promise(() => {});
    });
    await screen.findByText('Cargando historial…');
    unmount();
    await waitFor(() => expect(signal?.aborted).toBe(true));
  });
});
