import { test, expect } from './fixtures.mjs';

const customerId = '00000000-0000-4000-8000-000000000020';
const route = '/customers/' + customerId + '/simulations/new';
async function prepare(page) {
  await page.goto(route);
  const users = page.getByRole('textbox', {
    name: 'Usuarios activos',
    exact: true,
  });
  await expect(users).toBeEnabled();
  await users.fill('15');
  await page.getByLabel(/Almacenamiento contratado/).fill('500');
  await page.getByLabel(/Llamadas API estimadas/).fill('1000000');
  return users;
}
async function history(page) {
  const response = await page.request.get(
    '/api/customers/' + customerId + '/simulations?limit=20&offset=0',
  );
  expect(response.ok()).toBe(true);
  return response.json();
}

test('008-T03: saves one exact payload in isolated SQLite and explicitly resets only after confirmation', async ({
  page,
}, info) => {
  const users = await prepare(page);
  const requests = [];
  page.on('request', (request) => {
    if (request.method() === 'POST') requests.push(request.postDataJSON());
  });
  await page.getByRole('button', { name: 'Guardar simulación' }).click();
  await expect(
    page.getByRole('heading', { name: 'Resultado guardado' }),
  ).toBeVisible();
  await expect(
    page
      .getByText('Simulación guardada correctamente.')
      .locator('..')
      .locator('..'),
  ).toBeFocused();
  expect(requests).toEqual([
    { customerId, users: 15, storageGb: 500, apiCalls: 1000000 },
  ]);
  expect(new URL(page.url()).pathname).toBe(route);
  await expect(users).toBeDisabled();
  const saved = await history(page);
  expect(saved.total).toBe(1);
  expect(saved.items[0]).toMatchObject({
    customerId,
    users: 15,
    baseCents: 14000,
    taxCents: 2940,
    totalCents: 16940,
    currency: 'EUR',
  });
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(
      await page.evaluate(
        () => globalThis.document.documentElement.scrollWidth,
      ),
    ).toBeLessThanOrEqual(width);
    await page.screenshot({
      path: info.outputPath('saved-' + width + '.png'),
      fullPage: true,
    });
  }
  await page.getByRole('button', { name: 'Preparar otra simulación' }).click();
  await expect(users).toBeEnabled();
  await expect(users).toHaveValue('0');
  expect(requests).toHaveLength(1);
});

test('008-T03: changed server policy wins over preview and conversion uses the saved total', async ({
  page,
  environment,
}) => {
  const now = Math.floor(Date.now() / 1000);
  await page.route('https://open.er-api.com/**', (route) =>
    route.fulfill({
      json: {
        result: 'success',
        base_code: 'EUR',
        rates: { EUR: 1, USD: 1.2, GBP: 0.8 },
        time_last_update_unix: now - 10,
        time_next_update_unix: now + 3600,
      },
    }),
  );
  await prepare(page);
  await page.getByRole('combobox').selectOption('USD');
  await expect(page.getByLabel('Total mensual', { exact: true })).toContainText(
    '203,28',
  );
  environment.setTaxPolicy('test-policy-v2', {
    ES: 2000,
    FR: 2000,
    DE: 1900,
    GB: 2000,
  });
  await page.getByRole('button', { name: 'Guardar simulación' }).click();
  await expect(page.getByText(/El servidor ha actualizado/)).toContainText(
    '168,00',
  );
  await expect(page.getByLabel('Total mensual', { exact: true })).toContainText(
    '201,60',
  );
  expect((await history(page)).items[0]).toMatchObject({
    taxPolicyVersion: 'test-policy-v2',
    totalCents: 16800,
  });
});

test('008-T03: database failure retains consumption and FX failure still allows saving EUR', async ({
  page,
  environment,
}) => {
  await page.route('https://open.er-api.com/**', (route) => route.abort());
  const users = await prepare(page);
  await page.getByRole('combobox').selectOption('USD');
  await expect(
    page.getByRole('button', { name: 'Reintentar conversión' }),
  ).toBeVisible();
  environment.setUnavailable(true);
  await page.getByRole('button', { name: 'Guardar simulación' }).click();
  await expect(
    page.getByRole('alert').filter({ hasText: 'Tus consumos se conservan' }),
  ).toContainText('Tus consumos se conservan');
  await expect(users).toHaveValue('15');
  environment.setUnavailable(false);
  expect((await history(page)).total).toBe(0);
  await page.getByRole('button', { name: 'Guardar simulación' }).click();
  await expect(
    page.getByRole('heading', { name: 'Resultado guardado' }),
  ).toBeVisible();
  await expect(page.getByLabel('Total mensual', { exact: true })).toContainText(
    '169,40',
  );
  expect((await history(page)).items[0].totalCents).toBe(16940);
});

test('008-T03: unreadable 201 after a real commit remains uncertain without creating duplicates', async ({
  page,
}) => {
  let posts = 0;
  await page.route('**/api/simulations', async (route) => {
    posts++;
    const response = await route.fetch();
    expect(response.status()).toBe(201);
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: '{',
    });
  });
  const users = await prepare(page);
  await page.getByRole('button', { name: 'Guardar simulación' }).click();
  await expect(page.getByRole('alert')).toContainText('No podemos confirmar');
  await expect(users).toHaveValue('15');
  await expect(
    page.getByRole('link', { name: /Comprobar historial/ }),
  ).toHaveAttribute('target', '_blank');
  expect((await history(page)).total).toBe(1);
  expect(posts).toBe(1);
  await expect(
    page.getByRole('heading', { name: 'Resultado guardado' }),
  ).toHaveCount(0);
});
