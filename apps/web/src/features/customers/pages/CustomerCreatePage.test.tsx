import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router';
import { expect, it, vi } from 'vitest';
import { AppRoutes } from '../../../app/AppRoutes';
import {
  billingConfigFixture,
  customerFixture,
  jsonResponse,
  pageFixture,
} from '../test-fixtures';

function LocationProbe() {
  return (
    <output aria-label="Ubicación actual">
      {useLocation().pathname + useLocation().search}
    </output>
  );
}

function mount() {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, options?: RequestInit) => {
      if (url.includes('billing-config'))
        return jsonResponse(billingConfigFixture());
      if (url.includes('/customers/') && options?.method !== 'POST')
        return jsonResponse(customerFixture());
      return options?.method === 'POST'
        ? jsonResponse(customerFixture(), 201)
        : jsonResponse(pageFixture(0));
    }),
  );
  render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/customers/new',
          state: { returnTo: '/customers?q=Empresa&offset=20' },
        },
      ]}
    >
      <AppRoutes />
      <LocationProbe />
    </MemoryRouter>,
  );
}

it('returns from creation to the original search/page on cancel', async () => {
  mount();
  await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
  expect(screen.getByLabelText('Ubicación actual')).toHaveTextContent(
    '/customers?q=Empresa&offset=20',
  );
});

it('navigates a successful creation to its persisted ID, announces success and retains the return context', async () => {
  mount();
  const user = userEvent.setup();
  await screen.findByRole('option', { name: 'España' });
  await user.type(screen.getByLabelText(/Nombre de empresa/), 'Empresa Nueva');
  await user.type(screen.getByLabelText(/Identificador fiscal/), '12345678Z');
  await user.type(
    screen.getByLabelText(/Email de contacto/),
    'nueva@example.invalid',
  );
  await user.selectOptions(screen.getByLabelText(/País/), 'ES');
  await user.selectOptions(screen.getByLabelText(/Plan elegido/), 'DEMO_BASIC');
  await user.click(screen.getByRole('button', { name: 'Crear cliente' }));
  expect(
    await screen.findByText('Cliente creado correctamente.'),
  ).toBeInTheDocument();
  expect(screen.getByLabelText('Ubicación actual')).toHaveTextContent(
    '/customers/' + customerFixture().id,
  );
  expect(
    await screen.findByRole('heading', { name: 'Empresa 1' }),
  ).toHaveFocus();
  await user.click(screen.getByRole('link', { name: 'Volver a clientes' }));
  expect(screen.getByLabelText('Ubicación actual')).toHaveTextContent(
    '/customers?q=Empresa&offset=20',
  );
});
