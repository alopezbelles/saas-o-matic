import { test, expect } from './fixtures.mjs';
import { fixtureCustomerId } from './environment.mjs';

const id = '00000000-0000-4000-8000-000000000020';

test('008-T01: real configuration, inputs, responsive layout and contextual return without saving', async ({
  page,
}, info) => {
  const requests = [];
  page.on('request', (request) =>
    requests.push({ url: request.url(), method: request.method() }),
  );
  await page.goto('/customers/' + id + '?historyOffset=20');
  await page
    .getByRole('link', { name: 'Nueva simulación', exact: true })
    .click();
  const users = page.getByRole('textbox', {
    name: 'Usuarios activos',
    exact: true,
  });
  await expect(users).toBeEnabled();
  await expect(users).toHaveValue('0');
  await expect(
    page.getByRole('heading', { name: 'Simular suscripción' }),
  ).toBeFocused();
  const slider = page.getByRole('slider');
  await slider.focus();
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowRight');
  await expect(users).toHaveValue('1');
  await users.fill('1000');
  await expect(slider).toHaveValue('1000');
  await users.fill('1.5');
  await expect(users).toHaveAttribute('aria-invalid', 'true');
  await expect(users).toHaveValue('1.5');
  await users.fill('15');
  await page.getByLabel(/Almacenamiento contratado/).fill('50');
  await page.getByLabel(/Llamadas API estimadas/).fill('10000');
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    const dimensions = await page.evaluate(() => ({
      width: globalThis.innerWidth,
      content: globalThis.document.documentElement.scrollWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.width);
    await page.screenshot({
      path: info.outputPath('setup-' + width + '.png'),
      fullPage: true,
    });
  }
  await page.getByRole('link', { name: 'Volver al cliente' }).click();
  await expect(page).toHaveURL(
    new RegExp('/customers/' + id + '\\?historyOffset=20$'),
  );
  expect(requests.filter((request) => request.method === 'POST')).toHaveLength(
    0,
  );
  expect(
    requests.filter((request) => request.url.includes('open.er-api.com')),
  ).toHaveLength(0);
});

test('008-T01: a country outside the configured policy keeps its detail accessible but cannot simulate', async ({
  page,
}) => {
  await page.goto('/customers/' + fixtureCustomerId + '/simulations/new');
  await expect(page.getByRole('alert')).toContainText(
    'no tiene una tarifa configurada',
  );
  await expect(
    page.getByRole('textbox', { name: 'Usuarios activos', exact: true }),
  ).toBeDisabled();
  await page.getByRole('link', { name: 'Volver al cliente' }).click();
  await expect(
    page.getByRole('region', { name: 'Datos corporativos' }),
  ).toContainText('Portugal');
});
