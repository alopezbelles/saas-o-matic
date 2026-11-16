import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation, useNavigate } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { AppRoutes } from '../../../app/AppRoutes';
import {
  billingConfigFixture,
  jsonResponse,
  pageFixture,
} from '../test-fixtures';

function NavigationProbe() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <output aria-label="URL actual">
        {location.pathname + location.search}
      </output>
      <button onClick={() => navigate(-1)}>Atrás de prueba</button>
      <button onClick={() => navigate(1)}>Adelante de prueba</button>
    </>
  );
}

function renderPage(path = '/customers') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
      <NavigationProbe />
    </MemoryRouter>,
  );
}

describe('WEB-SEARCH-01 and WEB-STATE-01', () => {
  it('renders server data, actual demo labels and the accessible search field', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse(pageFixture())),
    );
    renderPage();
    expect(screen.getByText('Cargando clientes…')).toBeInTheDocument();
    expect(await screen.findByText('Empresa 1')).toBeInTheDocument();
    expect(
      screen.getByRole('searchbox', {
        name: 'Buscar por empresa o identificador fiscal',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('Básico (demo)')).toBeInTheDocument();
    expect(screen.getByText('España')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeDisabled();
    expect(screen.queryByText('Última simulación')).not.toBeInTheDocument();
  });

  it('debounces exactly 250 ms and resets offset when the search changes', async () => {
    const fetcher = vi.fn(async (url: string) => {
      const offset = Number(
        new URL(url, 'http://test').searchParams.get('offset'),
      );
      return jsonResponse(pageFixture(1, offset ? 21 : 1, offset));
    });
    vi.stubGlobal('fetch', fetcher);
    renderPage('/customers?offset=20');
    await screen.findByText('Empresa 21');
    vi.useFakeTimers();
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'Norte' },
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(249);
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(fetcher.mock.calls[1]?.[0]).toContain('q=Norte&limit=20&offset=0');
    expect(screen.getByLabelText('URL actual')).toHaveTextContent(
      '/customers?q=Norte',
    );
  });

  it('paginates and restores query and offset after visiting detail or creation and using back/forward', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.includes('billing-config'))
          return jsonResponse(billingConfigFixture());
        const offset = Number(
          new URL(url, 'http://test').searchParams.get('offset'),
        );
        return jsonResponse(pageFixture(offset ? 1 : 20, 21, offset));
      }),
    );
    renderPage('/customers?q=Empresa');
    await screen.findByText('Empresa 1');
    await user.click(screen.getByRole('button', { name: 'Siguiente' }));
    await screen.findByText('Empresa 21');
    expect(screen.getByLabelText('URL actual')).toHaveTextContent('offset=20');
    await user.click(
      screen.getByRole('link', { name: 'Ver cliente Empresa 21' }),
    );
    await user.click(screen.getByRole('link', { name: 'Volver a clientes' }));
    await screen.findByText('Empresa 21');
    expect(screen.getByRole('searchbox')).toHaveValue('Empresa');
    await user.click(screen.getByRole('link', { name: 'Nuevo cliente' }));
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    await screen.findByText('Empresa 21');
    await user.click(screen.getByRole('button', { name: 'Anterior' }));
    await screen.findByText('Empresa 1');
    await user.click(screen.getByRole('button', { name: 'Atrás de prueba' }));
    await screen.findByText('Empresa 21');
    await user.click(
      screen.getByRole('button', { name: 'Adelante de prueba' }),
    );
    await screen.findByText('Empresa 1');
  });

  it.each([
    ['/customers', 'Todavía no hay clientes registrados.', 0],
    [
      '/customers?q=ausente',
      'No hay clientes que coincidan con la búsqueda.',
      0,
    ],
    ['/customers?offset=20', 'No hay clientes en esta página.', 1],
  ])('distinguishes empty states at %s', async (path, message, total) => {
    const offset = path.includes('offset=20') ? 20 : 0;
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse(pageFixture(0, total, offset))),
    );
    renderPage(path);
    expect(await screen.findByText(message)).toBeInTheDocument();
  });

  it('keeps query on failure and retries only on explicit action', async () => {
    const user = userEvent.setup();
    let calls = 0;
    const fetcher = vi.fn(async () => {
      calls++;
      return calls === 1
        ? jsonResponse(
            {
              error: {
                code: 'DATABASE_UNAVAILABLE',
                message: 'unavailable',
                requestId: 'request',
              },
            },
            503,
          )
        : jsonResponse(pageFixture());
    });
    vi.stubGlobal('fetch', fetcher);
    renderPage('/customers?q=Empresa');
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'El servicio no está disponible',
    );
    expect(screen.getByRole('searchbox')).toHaveValue('Empresa');
    expect(fetcher).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('button', { name: 'Reintentar' }));
    await screen.findByText('Empresa 1');
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('aborts obsolete queries and ignores a late response from an uncooperative fetch', async () => {
    let resolveOld: (value: Response) => void = () => {};
    let oldSignal: AbortSignal | null | undefined;
    const old = new Promise<Response>((resolve) => {
      resolveOld = resolve;
    });
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string, options?: RequestInit) => {
        if (url.includes('q=Norte'))
          return Promise.resolve(jsonResponse(pageFixture()));
        oldSignal = options?.signal;
        return old;
      }),
    );
    renderPage();
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'Norte' },
    });
    await screen.findByText('Empresa 1');
    expect(oldSignal?.aborted).toBe(true);
    await act(async () => {
      resolveOld(jsonResponse(pageFixture(0)));
    });
    expect(screen.getByText('Empresa 1')).toBeInTheDocument();
    expect(
      screen.queryByText('Todavía no hay clientes registrados.'),
    ).not.toBeInTheDocument();
  });

  it('offers recovery for invalid URL parameters without fetching them', async () => {
    const user = userEvent.setup();
    const fetcher = vi.fn(async () => jsonResponse(pageFixture(0)));
    vi.stubGlobal('fetch', fetcher);
    renderPage('/customers?offset=-1');
    expect(screen.getByRole('alert')).toHaveTextContent(
      'parámetros de búsqueda no válidos',
    );
    expect(fetcher).not.toHaveBeenCalled();
    await user.click(
      screen.getByRole('link', { name: 'Restablecer búsqueda' }),
    );
    await screen.findByText('Todavía no hay clientes registrados.');
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('keeps invalid draft local and preserves the search field DOM while typing', async () => {
    const fetcher = vi.fn(async () => jsonResponse(pageFixture()));
    vi.stubGlobal('fetch', fetcher);
    renderPage();
    await screen.findByText('Empresa 1');
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'a'.repeat(201) } });
    expect(screen.getByRole('alert')).toHaveTextContent('hasta 200 caracteres');
    await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(1));
    expect(screen.getByRole('searchbox')).toBe(input);
  });
});
