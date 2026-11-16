import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { AppRoutes } from './AppRoutes';

function renderRoute(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe('WEB-SHELL-01', () => {
  it.each([
    ['/', 'Clientes'],
    ['/customers', 'Clientes'],
    ['/customers/', 'Clientes'],
    ['/customers/new', 'Nuevo cliente'],
    ['/customers/new/', 'Nuevo cliente'],
    ['/customers/550e8400-e29b-41d4-a716-446655440000', 'Ficha del cliente'],
    ['/missing', 'Página no encontrada'],
  ])('renders direct route %s with a focused heading', (path, title) => {
    renderRoute(path);
    expect(
      screen.getByRole('heading', { level: 1, name: title }),
    ).toHaveFocus();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: 'Navegación principal' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: 'Ruta de navegación' }),
    ).toHaveTextContent(title);
    expect(
      screen.getByRole('link', { name: 'Saltar al contenido' }),
    ).toHaveAttribute('href', '#main-content');
  });

  it('navigates from clients to creation and back with updated breadcrumbs and focus', async () => {
    const user = userEvent.setup();
    renderRoute('/customers');
    await user.click(screen.getByRole('link', { name: 'Nuevo cliente' }));
    expect(
      screen.getByRole('heading', { name: 'Nuevo cliente' }),
    ).toHaveFocus();
    expect(
      screen.getByRole('navigation', { name: 'Ruta de navegación' }),
    ).toHaveTextContent('Nuevo cliente');
    await user.click(screen.getByRole('link', { name: 'Volver a clientes' }));
    expect(screen.getByRole('heading', { name: 'Clientes' })).toHaveFocus();
  });

  it('provides a working return from unknown routes', async () => {
    const user = userEvent.setup();
    renderRoute('/missing');
    await user.click(screen.getByRole('link', { name: 'Volver a clientes' }));
    expect(
      screen.getByRole('heading', { name: 'Clientes' }),
    ).toBeInTheDocument();
  });

  it('supports keyboard access to the creation link', async () => {
    const user = userEvent.setup();
    renderRoute('/customers');
    const create = screen.getByRole('link', { name: 'Nuevo cliente' });
    create.focus();
    await user.keyboard('{Enter}');
    expect(
      screen.getByRole('heading', { name: 'Nuevo cliente' }),
    ).toHaveFocus();
  });
});
