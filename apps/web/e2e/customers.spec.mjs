import { test, expect, fillCustomer } from './fixtures.mjs';
import { fixtureCustomerId } from './environment.mjs';

test('E2E-CUSTOMERS-007: fiscal error, correction, persisted creation, detail and duplicate', async ({
  page,
}) => {
  await page.goto('/customers/new');
  await fillCustomer(page);
  await page.getByLabel(/Identificador fiscal/).fill('12345678A');
  await page
    .getByRole('button', { name: 'Crear cliente', exact: true })
    .click();
  await expect(page.getByRole('alert')).toBeFocused();
  await expect(page.getByLabel(/Identificador fiscal/)).toHaveAttribute(
    'aria-invalid',
    'true',
  );
  await expect(page.getByLabel(/Nombre de empresa/)).toHaveValue('Empresa E2E');
  await page.getByLabel(/Identificador fiscal/).fill('12345678Z');
  const posted = page.waitForResponse(
    (response) => response.request().method() === 'POST',
  );
  await page
    .getByRole('button', { name: 'Crear cliente', exact: true })
    .click();
  const response = await posted;
  expect(response.status()).toBe(201);
  const created = await response.json();
  await expect(page).toHaveURL(new RegExp('/customers/' + created.id + '$'));
  await expect(
    page.getByRole('heading', { name: 'Empresa E2E', exact: true }),
  ).toBeFocused();
  await expect(
    page.getByText('Cliente creado correctamente.', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Este cliente todavía no tiene simulaciones guardadas.'),
  ).toBeVisible();
  const persisted = await page.request.get('/api/customers/' + created.id);
  expect((await persisted.json()).companyName).toBe('Empresa E2E');
  await page.reload();
  await expect(page.getByRole('region', { name: 'Contacto' })).toContainText(
    'e2e@example.invalid',
  );
  await page.goto('/customers/new');
  await fillCustomer(page, 'Empresa Duplicada');
  await page
    .getByRole('button', { name: 'Crear cliente', exact: true })
    .click();
  await expect(page.getByRole('alert')).toContainText('Ya existe un cliente');
  await expect(page.getByLabel(/Nombre de empresa/)).toHaveValue(
    'Empresa Duplicada',
  );
  const list = await page.request.get('/api/customers?q=12345678Z');
  expect((await list.json()).total).toBe(1);
});

test('E2E-CUSTOMERS-007: list search, pages, contextual return and back/forward', async ({
  page,
}) => {
  await page.goto('/customers');
  await expect(
    page.getByText('Mostrando 1–20 de 21', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
  await expect(page.getByText('Empresa 01', { exact: true })).toBeVisible();
  await expect(page).toHaveURL(/offset=20/);
  await page
    .getByRole('link', { name: 'Ver cliente Empresa 01', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Empresa 01', exact: true }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Volver a clientes' }).click();
  await expect(page).toHaveURL(/offset=20/);
  await page.getByRole('button', { name: 'Anterior', exact: true }).click();
  await expect(
    page.getByText('Mostrando 1–20 de 21', { exact: true }),
  ).toBeVisible();
  await page.goBack();
  await expect(
    page.getByText('Mostrando 21–21 de 21', { exact: true }),
  ).toBeVisible();
  await page.goForward();
  await page.getByRole('searchbox').fill('Empresa 21');
  await expect(page.getByText('1 resultado', { exact: true })).toBeVisible();
  await expect(page).not.toHaveURL(/offset=/);
  await page.reload();
  await expect(page.getByRole('searchbox')).toHaveValue('Empresa 21');
  await page.getByRole('link', { name: 'Nuevo cliente', exact: true }).click();
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
  await expect(page.getByRole('searchbox')).toHaveValue('Empresa 21');
});

test('E2E-CUSTOMERS-007: stored history, independent failure, pagination and direct reload', async ({
  page,
  environment,
}) => {
  await page.goto('/customers?q=Empresa+21');
  await page
    .getByRole('link', { name: 'Ver cliente Empresa 21', exact: true })
    .click();
  await expect(
    page.getByText('Mostrando 1–20 de 21', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('region', { name: 'Datos corporativos' }),
  ).toContainText('Portugal');
  await expect(page.getByRole('table')).toContainText('25,91');
  const saved = await page.request.get(
    '/api/customers/' + fixtureCustomerId + '/simulations',
  );
  const snapshot = (await saved.json()).items[0];
  expect(snapshot.pricingVersion).toBe('historical-price-v0');
  expect(snapshot.totalCents).toBe(2591);
  environment.setUnavailable(true);
  await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Reintentar historial' }),
  ).toBeVisible();
  await expect(page.getByRole('region', { name: 'Contacto' })).toBeVisible();
  environment.setUnavailable(false);
  await page.getByRole('button', { name: 'Reintentar historial' }).click();
  await expect(
    page.getByText('Mostrando 21–21 de 21', { exact: true }),
  ).toBeVisible();
  await expect(page).toHaveURL(/historyOffset=20/);
  await page.reload();
  await expect(page.getByRole('table')).toContainText('1 ene 2026');
  await page.getByRole('link', { name: 'Volver a clientes' }).click();
  await expect(page.getByRole('searchbox')).toHaveValue('Empresa 21');
});

test('E2E-CUSTOMERS-007: empty search, invalid IDs/query and missing client are recoverable', async ({
  page,
}) => {
  await page.goto('/customers?q=ausente');
  await expect(
    page.getByText('No hay clientes que coincidan con la búsqueda.'),
  ).toBeVisible();
  await page.goto('/customers/invalid');
  await expect(page.getByRole('alert')).toContainText(
    'El identificador del cliente no es válido.',
  );
  await page.goto('/customers/00000000-0000-4000-8000-000000000099');
  await expect(page.getByRole('alert')).toContainText(
    'No se ha encontrado el cliente.',
  );
  await page.goto('/customers/' + fixtureCustomerId + '?historyOffset=-1');
  await expect(
    page.getByRole('region', { name: 'Datos corporativos' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Restablecer historial' }).click();
  await expect(
    page.getByText('Mostrando 1–20 de 21', { exact: true }),
  ).toBeVisible();
  await page.goto('/missing');
  await page.getByRole('link', { name: 'Volver a clientes' }).click();
  await expect(
    page.getByRole('heading', { name: 'Clientes', exact: true }),
  ).toBeFocused();
});
