import {
  test,
  expect,
  fillCustomer,
  fillSimulation,
  exchangeRatesFixture,
} from './fixtures.mjs';

test('E2E-SIMULATIONS-008: corporate registration through saved history with FX recovery and authoritative policy', async ({
  page,
  environment,
}) => {
  let fxCalls = 0;
  let simulationPosts = 0;
  await page.route('https://open.er-api.com/**', async (route) => {
    fxCalls++;
    if (fxCalls === 1) await route.abort();
    else await route.fulfill({ json: exchangeRatesFixture() });
  });
  page.on('request', (request) => {
    if (
      request.method() === 'POST' &&
      request.url().endsWith('/api/simulations')
    )
      simulationPosts++;
  });
  await page.goto('/customers');
  await page.getByRole('link', { name: 'Nuevo cliente', exact: true }).click();
  await fillCustomer(page, 'Cliente flujo 008');
  await page
    .getByRole('button', { name: 'Crear cliente', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Cliente flujo 008', exact: true }),
  ).toBeVisible();
  const customerPath = new URL(page.url()).pathname;
  await expect(
    page.getByText('Este cliente todavía no tiene simulaciones guardadas.'),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Nueva simulación' }).click();
  await fillSimulation(page);
  await expect(page.getByLabel('Total mensual', { exact: true })).toContainText(
    '169,40',
  );
  await page.getByRole('combobox').selectOption('USD');
  await expect(
    page.getByRole('button', { name: 'Reintentar conversión' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Guardar simulación' }),
  ).toBeEnabled();
  environment.setTaxPolicy('test-flow-v2', {
    ES: 2000,
    FR: 2000,
    DE: 1900,
    GB: 2000,
  });
  await page.getByRole('button', { name: 'Guardar simulación' }).click();
  await expect(
    page.getByRole('heading', { name: 'Resultado guardado' }),
  ).toBeVisible();
  await expect(page.getByText(/El servidor ha actualizado/)).toContainText(
    '168,00',
  );
  await expect(page.getByLabel('Total mensual', { exact: true })).toContainText(
    '168,00',
  );
  await page.getByRole('button', { name: 'Reintentar conversión' }).click();
  await expect(page.getByLabel('Total mensual', { exact: true })).toContainText(
    '201,60',
  );
  await page.getByRole('combobox').selectOption('GBP');
  await expect(page.getByLabel('Total mensual', { exact: true })).toContainText(
    '134,40',
  );
  expect(fxCalls).toBe(2);
  expect(simulationPosts).toBe(1);
  await page.getByRole('link', { name: 'Volver al cliente' }).click();
  await expect(page).toHaveURL(new RegExp(customerPath + '$'));
  const row = page.getByRole('table').getByRole('row').nth(1);
  await expect(row).toContainText('168,00');
  await expect(row).toContainText('EUR');
  await page.reload();
  await expect(page.getByRole('table').getByRole('row').nth(1)).toContainText(
    '168,00',
  );
  const response = await page.request.get(
    '/api' + customerPath + '/simulations?limit=20&offset=0',
  );
  expect(response.ok()).toBe(true);
  const history = await response.json();
  expect(history.total).toBe(1);
  expect(history.items[0]).toMatchObject({
    users: 15,
    storageGb: 500,
    apiCalls: 1000000,
    currency: 'EUR',
    baseCents: 14000,
    taxCents: 2800,
    totalCents: 16800,
    taxPolicyVersion: 'test-flow-v2',
    customerSnapshot: { companyName: 'Cliente flujo 008' },
  });
  expect(history.items[0]).not.toHaveProperty('exchangeRate');
});
