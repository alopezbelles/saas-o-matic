import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { CustomerForm } from './CustomerForm';
import {
  billingConfigFixture,
  customerFixture,
  customerInputFixture,
  jsonResponse,
} from '../test-fixtures';

function setup(
  post: () => Promise<Response> = async () =>
    jsonResponse(customerFixture(), 201),
) {
  const fetcher = vi.fn(async (url: string, options?: RequestInit) => {
    void options;
    return url.endsWith('/billing-config')
      ? jsonResponse(billingConfigFixture())
      : post();
  });
  vi.stubGlobal('fetch', fetcher);
  const onCreated = vi.fn();
  const onCancel = vi.fn();
  const view = render(
    <MemoryRouter>
      <CustomerForm onCreated={onCreated} onCancel={onCancel} />
    </MemoryRouter>,
  );
  return { ...view, fetcher, onCreated, onCancel };
}

async function fill() {
  const user = userEvent.setup();
  await screen.findByRole('option', { name: 'España' });
  const input = customerInputFixture();
  await user.type(
    screen.getByLabelText(/Nombre de empresa/),
    input.companyName,
  );
  await user.type(screen.getByLabelText(/Identificador fiscal/), input.taxId);
  await user.type(
    screen.getByLabelText(/Email de contacto/),
    input.contactEmail,
  );
  await user.selectOptions(screen.getByLabelText(/País/), input.countryCode);
  await user.selectOptions(
    screen.getByLabelText(/Plan elegido/),
    input.planCode,
  );
  return user;
}

function assertValuesRetained() {
  expect(screen.getByLabelText(/Nombre de empresa/)).toHaveValue(
    'Empresa Nueva',
  );
  expect(screen.getByLabelText(/Identificador fiscal/)).toHaveValue(
    '12345678Z',
  );
  expect(screen.getByLabelText(/Email de contacto/)).toHaveValue(
    'nueva@example.invalid',
  );
  expect(screen.getByLabelText(/País/)).toHaveValue('ES');
  expect(screen.getByLabelText(/Plan elegido/)).toHaveValue('DEMO_BASIC');
}

describe('WEB-FORM-01', () => {
  it('loads API countries and shared demo plans, blocks invalid input and focuses linked errors', async () => {
    const { fetcher } = setup();
    await screen.findByRole('option', { name: 'España' });
    expect(screen.getAllByRole('combobox')).toHaveLength(2);
    expect(screen.getByRole('option', { name: 'Básico (demo)' })).toHaveValue(
      'DEMO_BASIC',
    );
    expect(
      screen.getByRole('option', { name: 'Profesional (demo)' }),
    ).toHaveValue('DEMO_PRO');
    await userEvent.click(
      screen.getByRole('button', { name: 'Crear cliente' }),
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveFocus();
    const input = screen.getByLabelText(/Nombre de empresa/);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(
      screen.getByRole('link', { name: /Nombre de empresa:/ }),
    ).toHaveAttribute('href', '#' + input.id);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('creates once while pending, disables controls and notifies success with the persisted DTO', async () => {
    let resolve!: (response: Response) => void;
    const { fetcher, onCreated } = setup(
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
    await fill();
    const form = screen.getByRole('form', { name: 'Alta de cliente' });
    fireEvent.submit(form);
    fireEvent.submit(form);
    expect(
      screen.getByRole('button', { name: 'Creando cliente…' }),
    ).toBeDisabled();
    expect(screen.getByLabelText(/Nombre de empresa/)).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled();
    await act(async () => resolve(jsonResponse(customerFixture(), 201)));
    expect(onCreated).toHaveBeenCalledExactlyOnceWith(customerFixture());
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it.each([422, 409, 503])(
    'retains all values and allows explicit correction after HTTP %s',
    async (status) => {
      const { onCreated, fetcher } = setup(async () =>
        jsonResponse(
          {
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Rejected',
              requestId: 'test-request',
              fields: {
                taxId: 'Identificador fiscal no válido.',
                internal: 'hidden',
              },
            },
          },
          status,
        ),
      );
      const user = await fill();
      await user.click(screen.getByRole('button', { name: 'Crear cliente' }));
      const alert = await screen.findByRole('alert');
      expect(alert).toHaveFocus();
      assertValuesRetained();
      expect(onCreated).not.toHaveBeenCalled();
      expect(alert).not.toHaveTextContent('hidden');
      if (status !== 503)
        expect(screen.getByLabelText(/Identificador fiscal/)).toHaveAttribute(
          'aria-invalid',
          'true',
        );
      expect(
        screen.getByRole('button', { name: 'Crear cliente' }),
      ).toBeEnabled();
      expect(fetcher).toHaveBeenCalledTimes(2);
    },
  );

  it.each(['network', 'unreadable', 'timeout'])(
    'reports an uncertain %s result without an automatic retry and offers lookup in another tab',
    async (failure) => {
      const { fetcher, onCreated } = setup(async () => {
        if (failure === 'network') throw new TypeError('offline');
        if (failure === 'timeout') return new Promise(() => {});
        return new Response('{', {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        });
      });
      await fill();
      if (failure === 'timeout') vi.useFakeTimers();
      fireEvent.submit(screen.getByRole('form'));
      if (failure === 'timeout') {
        await act(async () => vi.advanceTimersByTimeAsync(10000));
        vi.useRealTimers();
      }
      expect(await screen.findByRole('alert')).toHaveTextContent(
        'No podemos confirmar',
      );
      const lookup = screen.getByRole('link', { name: /Comprobar clientes/ });
      expect(lookup).toHaveAttribute('href', '/customers?q=12345678Z');
      expect(lookup).toHaveAttribute('target', '_blank');
      assertValuesRetained();
      expect(fetcher).toHaveBeenCalledTimes(2);
      expect(onCreated).not.toHaveBeenCalled();
    },
  );

  it('retries configuration explicitly without clearing the draft and cancels without posting', async () => {
    const onCancel = vi.fn();
    const failer = vi.fn(async (url: string) => {
      void url;
      return jsonResponse({}, 503);
    });
    vi.stubGlobal('fetch', failer);
    render(
      <MemoryRouter>
        <CustomerForm onCreated={vi.fn()} onCancel={onCancel} />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByLabelText(/Nombre de empresa/), {
      target: { value: 'Conservada' },
    });
    await screen.findByRole('button', { name: 'Reintentar países' });
    expect(
      screen.getByRole('button', { name: 'Crear cliente' }),
    ).toBeDisabled();
    failer.mockImplementation(async () => jsonResponse(billingConfigFixture()));
    await userEvent.click(
      screen.getByRole('button', { name: 'Reintentar países' }),
    );
    await screen.findByRole('option', { name: 'España' });
    expect(screen.getByLabelText(/Nombre de empresa/)).toHaveValue(
      'Conservada',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onCancel).toHaveBeenCalledOnce();
    expect(
      failer.mock.calls.every(([url]) =>
        String(url).endsWith('/billing-config'),
      ),
    ).toBe(true);
  });

  it('aborts pending POST on unmount and ignores a late success', async () => {
    let resolve!: (response: Response) => void;
    const { unmount, fetcher, onCreated } = setup(
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
    await fill();
    fireEvent.submit(screen.getByRole('form'));
    const options = (
      fetcher.mock.calls[1] as unknown as [string, RequestInit]
    )[1];
    unmount();
    expect(options.signal?.aborted).toBe(true);
    await act(async () => resolve(jsonResponse(customerFixture(), 201)));
    await waitFor(() => expect(onCreated).not.toHaveBeenCalled());
  });
});
