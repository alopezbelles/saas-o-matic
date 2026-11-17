import { test, expect } from './fixtures.mjs';

const customerId = '00000000-0000-4000-8000-000000000020';
const detail = '/customers/' + customerId;
const input = { customerId, users: 15, storageGb: 500, apiCalls: 1000000 };
const history = (page) =>
  page.getByRole('region', { name: 'Historial de simulaciones' });
async function fill(page) {
  const users = page.getByRole('textbox', {
    name: 'Usuarios activos',
    exact: true,
  });
  await expect(users).toBeEnabled();
  await users.fill('15');
  await page.getByLabel(/Almacenamiento contratado/).fill('500');
  await page.getByLabel(/Llamadas API estimadas/).fill('1000000');
}

test('WEB-HISTORY-008: return refreshes persisted history, keeps paging/list context and survives reload', async ({
  page,
}) => {
  for (let users = 1; users <= 21; users++) {
    const response = await page.request.post('/api/simulations', {
      data: { ...input, users },
    });
    expect(response.status()).toBe(201);
  }
  await page.goto('/customers?q=Empresa+20');
  await page
    .getByRole('link', { name: 'Ver cliente Empresa 20', exact: true })
    .click();
  await history(page)
    .getByRole('button', { name: 'Siguiente', exact: true })
    .click();
  await expect(page).toHaveURL(/historyOffset=20/);
  await expect(history(page).getByRole('row')).toHaveCount(2);
  await page.getByRole('link', { name: 'Nueva simulación' }).click();
  await fill(page);
  await page.getByRole('button', { name: 'Guardar simulación' }).click();
  await expect(
    page.getByRole('heading', { name: 'Resultado guardado' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Volver al cliente' }).click();
  await expect(page).toHaveURL(/historyOffset=20/);
  await expect(history(page)).toContainText('Mostrando 21–22 de 22');
  await history(page)
    .getByRole('button', { name: 'Anterior', exact: true })
    .click();
  const first = history(page).getByRole('row').nth(1);
  await expect(first).toContainText('169,40');
  await expect(first).toContainText('EUR');
  await page.reload();
  await expect(history(page).getByRole('row').nth(1)).toContainText('169,40');
  await page.getByRole('link', { name: 'Volver a clientes' }).click();
  await expect(page.getByRole('searchbox')).toHaveValue('Empresa 20');
});

test('WEB-HISTORY-008: an uncertain real commit can be checked and refreshed in another tab without losing the draft', async ({
  page,
  environment,
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
  await page.goto(detail + '/simulations/new');
  await fill(page);
  await page.getByRole('button', { name: 'Guardar simulación' }).click();
  await expect(page.getByRole('alert')).toContainText('No podemos confirmar');
  const opened = page.waitForEvent('popup');
  await page.getByRole('link', { name: /Comprobar historial/ }).click();
  const popup = await opened;
  try {
    await expect(history(popup)).toContainText('1 simulación');
    await expect(history(popup).getByRole('row').nth(1)).toContainText(
      '169,40',
    );
    environment.setUnavailable(true);
    await history(popup)
      .getByRole('button', { name: 'Actualizar historial' })
      .click();
    await expect(history(popup).getByRole('alert')).toContainText(
      'No se ha podido cargar el historial',
    );
    await expect(
      popup.getByRole('heading', { name: 'Empresa 20', exact: true }),
    ).toBeVisible();
    environment.setUnavailable(false);
    await history(popup)
      .getByRole('button', { name: 'Reintentar historial' })
      .click();
    await expect(history(popup).getByRole('row')).toHaveCount(2);
    const another = await popup.request.post('/api/simulations', {
      data: { ...input, users: 10 },
    });
    expect(another.status()).toBe(201);
    await history(popup)
      .getByRole('button', { name: 'Actualizar historial' })
      .click();
    await expect(history(popup)).toContainText('2 simulaciones');
    await expect(history(popup).getByRole('row').nth(1)).toContainText(
      '121,00',
    );
    await expect(
      page.getByRole('textbox', { name: 'Usuarios activos', exact: true }),
    ).toHaveValue('15');
    await expect(page.getByLabel(/Almacenamiento contratado/)).toHaveValue(
      '500',
    );
    await expect(page.getByLabel(/Llamadas API estimadas/)).toHaveValue(
      '1000000',
    );
    await expect(page.getByRole('alert')).toContainText('No podemos confirmar');
    expect(posts).toBe(1);
  } finally {
    await popup.close();
  }
});

test('WEB-HISTORY-008: discrepancy survives returning, history refresh and reload while saved EUR stays immutable', async ({
  page,
  environment,
}) => {
  await page.goto(detail + '/simulations/new');
  await fill(page);
  environment.setTaxPolicy('test-history-v2', {
    ES: 2000,
    FR: 2000,
    DE: 1900,
    GB: 2000,
  });
  await page.getByRole('button', { name: 'Guardar simulación' }).click();
  await expect(page.getByText(/El servidor ha actualizado/)).toContainText(
    '168,00',
  );
  await page.getByRole('link', { name: 'Volver al cliente' }).click();
  await expect(page.getByText(/El servidor ha actualizado/)).toContainText(
    '169,40',
  );
  await expect(page.getByText(/El servidor ha actualizado/)).toContainText(
    '168,00',
  );
  await expect(history(page).getByRole('row').nth(1)).toContainText('168,00');
  environment.setTaxPolicy('test-history-v3', {
    ES: 2100,
    FR: 2000,
    DE: 1900,
    GB: 2000,
  });
  await history(page)
    .getByRole('button', { name: 'Actualizar historial' })
    .click();
  await expect(history(page).getByRole('row').nth(1)).toContainText('168,00');
  await page.reload();
  await expect(history(page).getByRole('row').nth(1)).toContainText('168,00');
  await expect(page.getByText(/El servidor ha actualizado/)).toContainText(
    '168,00',
  );
  await expect(page.getByRole('combobox')).toHaveCount(0);
});
