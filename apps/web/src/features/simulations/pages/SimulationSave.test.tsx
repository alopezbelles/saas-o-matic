import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { expect, it, vi } from 'vitest';
import { AppRoutes } from '../../../app/AppRoutes';
import {
  customerFixture,
  jsonResponse,
  simulationFixture,
} from '../../customers/test-fixtures';
import { configurationFixture } from '../test-fixtures';
import { createSimulation } from '../api/create-simulation';

const customerId = customerFixture().id;
const input = { customerId, users: 15, storageGb: 500, apiCalls: 1000000 };
function result() {
  return {
    ...simulationFixture(),
    ...input,
    baseCents: 14000,
    taxCents: 2940,
    totalCents: 16940,
    taxRateBps: 2100,
    pricingVersion: 'users-tiered-v1',
    taxPolicyVersion: 'demo-standard-v1',
    breakdown: [
      {
        tierFrom: 1,
        tierTo: 10,
        quantity: 10,
        unitPriceCents: 1000,
        subtotalCents: 10000,
      },
      {
        tierFrom: 11,
        tierTo: 50,
        quantity: 5,
        unitPriceCents: 800,
        subtotalCents: 4000,
      },
    ],
  };
}
const users = () => screen.getByRole('textbox', { name: 'Usuarios activos' });
async function mount(post: (options?: RequestInit) => Promise<Response>) {
  const fetcher = vi.fn(async (url: string, options?: RequestInit) => {
    if (options?.method === 'POST') return post(options);
    return jsonResponse(
      url.includes('billing-config')
        ? configurationFixture()
        : customerFixture(),
    );
  });
  vi.stubGlobal('fetch', fetcher);
  const view = render(
    <MemoryRouter
      initialEntries={['/customers/' + customerId + '/simulations/new']}
    >
      <AppRoutes />
    </MemoryRouter>,
  );
  await vi.waitFor(() => expect(users()).toBeEnabled());
  fireEvent.change(users(), { target: { value: '15' } });
  fireEvent.change(screen.getByLabelText(/Almacenamiento contratado/), {
    target: { value: '500' },
  });
  fireEvent.change(screen.getByLabelText(/Llamadas API estimadas/), {
    target: { value: '1000000' },
  });
  return {
    ...view,
    fetcher,
    posts: () =>
      fetcher.mock.calls.filter(([, options]) => options?.method === 'POST'),
  };
}
const submit = () =>
  fireEvent.submit(screen.getByRole('form', { name: 'Simulación de consumo' }));

it('WEB-SAVE-008 freezes one exact request and locks confirmed consumption until explicitly preparing another', async () => {
  let release!: (value: Response) => void;
  const pending = new Promise<Response>((resolve) => {
    release = resolve;
  });
  const view = await mount(() => pending);
  submit();
  submit();
  expect(view.posts()).toHaveLength(1);
  expect(JSON.parse(view.posts()[0]![1]!.body as string)).toEqual(input);
  expect(users()).toBeDisabled();
  expect(screen.getByRole('combobox')).toBeDisabled();
  await act(async () => {
    release(jsonResponse(result(), 201));
  });
  await screen.findByRole('heading', { name: 'Resultado guardado' });
  expect(
    screen
      .getByText('Simulación guardada correctamente.')
      .closest('[role="status"]'),
  ).toHaveFocus();
  expect(users()).toBeDisabled();
  submit();
  expect(view.posts()).toHaveLength(1);
  fireEvent.click(
    screen.getByRole('button', { name: 'Preparar otra simulación' }),
  );
  await vi.waitFor(() => expect(users()).toBeEnabled());
  expect(users()).toHaveValue('0');
  expect(screen.getByRole('combobox')).toHaveValue('EUR');
  expect(view.posts()).toHaveLength(1);
});

it('WEB-POLICY-008 accepts new server versions and displays the saved amounts and snapshot without recalculation', async () => {
  const saved = {
    ...result(),
    taxCents: 2800,
    totalCents: 16800,
    taxRateBps: 2000,
    taxPolicyVersion: 'new-policy',
  };
  await mount(async () => jsonResponse(saved, 201));
  submit();
  await screen.findByRole('heading', { name: 'Resultado guardado' });
  expect(screen.getByText(/El servidor ha actualizado/)).toHaveTextContent(
    '169,40',
  );
  expect(screen.getByText(/El servidor ha actualizado/)).toHaveTextContent(
    '168,00',
  );
  expect(
    screen.getByLabelText('Total mensual', { exact: true }),
  ).toHaveTextContent('168,00');
  expect(screen.getByText(/Guardada para/)).toHaveTextContent(
    'Nombre histórico',
  );
});

it.each([422, 404, 503, 500])(
  'WEB-SAVE-008 preserves fields after HTTP %s and only retries on a deliberate submit',
  async (status) => {
    const view = await mount(async () =>
      jsonResponse(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Error',
            requestId: 'test',
            fields: { users: 'Consumo no admitido.', secret: 'ignore' },
          },
        },
        status,
      ),
    );
    submit();
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveFocus();
    expect(users()).toHaveValue('15');
    expect(screen.getByLabelText(/Almacenamiento contratado/)).toHaveValue(
      '500',
    );
    expect(screen.getByLabelText(/Llamadas API estimadas/)).toHaveValue(
      '1000000',
    );
    expect(view.posts()).toHaveLength(1);
    expect(screen.queryByText(/ignore/)).not.toBeInTheDocument();
    if (status === 422) expect(users()).toHaveAttribute('aria-invalid', 'true');
    submit();
    await vi.waitFor(() => expect(view.posts()).toHaveLength(2));
  },
);

it.each(['network', 'invalid201', 'mismatched201'])(
  'WEB-SAVE-008 treats %s as uncertain and offers checking history without automatic resubmission',
  async (kind) => {
    const view = await mount(async () => {
      if (kind === 'network') throw new TypeError('offline');
      return kind === 'invalid201'
        ? new Response('{', {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          })
        : jsonResponse({ ...result(), users: 16 }, 201);
    });
    submit();
    await screen.findByText(/No podemos confirmar/);
    const link = screen.getByRole('link', { name: /Comprobar historial/ });
    expect(link).toHaveAttribute('href', '/customers/' + customerId);
    expect(link).toHaveAttribute('target', '_blank');
    expect(users()).toHaveValue('15');
    expect(view.posts()).toHaveLength(1);
    expect(
      screen.queryByRole('heading', { name: 'Resultado guardado' }),
    ).not.toBeInTheDocument();
  },
);

it('WEB-SAVE-008 times out without retrying and aborts an abandoned request', async () => {
  let signal: AbortSignal | undefined;
  const view = await mount((options) => {
    signal = options?.signal as AbortSignal;
    return new Promise(() => {});
  });
  vi.useFakeTimers();
  try {
    submit();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10001);
    });
    expect(screen.getByText(/No podemos confirmar/)).toBeVisible();
    expect(signal?.aborted).toBe(true);
    expect(view.posts()).toHaveLength(1);
    submit();
    expect(view.posts()).toHaveLength(2);
    view.unmount();
    expect(signal?.aborted).toBe(true);
  } finally {
    vi.useRealTimers();
  }
});

it('POST adapter validates input before transport and rejects wrong status or customer identity', async () => {
  const fetcher = vi.fn(async () => jsonResponse(result(), 200));
  vi.stubGlobal('fetch', fetcher);
  await expect(createSimulation({ ...input, users: -1 })).rejects.toThrow();
  expect(fetcher).not.toHaveBeenCalled();
  await expect(createSimulation(input)).rejects.toMatchObject({
    kind: 'protocol',
    status: 200,
  });
  fetcher.mockImplementation(async () =>
    jsonResponse({ ...result(), customerId: customerFixture(2).id }, 201),
  );
  await expect(createSimulation(input)).rejects.toMatchObject({
    kind: 'protocol',
    status: 201,
  });
});
