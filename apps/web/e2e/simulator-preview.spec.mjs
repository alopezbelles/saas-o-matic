import { test, expect } from './fixtures.mjs';

const route = '/customers/00000000-0000-4000-8000-000000000020/simulations/new';
const provider = () => {
  const now = Math.floor(Date.now() / 1000);
  return {
    result: 'success',
    base_code: 'EUR',
    rates: { EUR: 1, USD: 1.2, GBP: 0.8 },
    time_last_update_unix: now - 10,
    time_next_update_unix: now + 3600,
  };
};

test('008-T02: real EUR preview matches tier oracles and reference layout at four widths', async ({
  page,
}, info) => {
  await page.goto(route);
  const users = page.getByRole('textbox', {
    name: 'Usuarios activos',
    exact: true,
  });
  await expect(users).toBeEnabled();
  for (const [number, total] of [
    [0, '0,00'],
    [10, '121,00'],
    [11, '130,68'],
    [15, '169,40'],
    [50, '508,20'],
    [51, '514,25'],
  ]) {
    await users.fill(String(number));
    await expect(
      page.getByLabel('Total mensual', { exact: true }),
    ).toContainText(total);
  }
  await users.fill('15');
  await page.getByLabel(/Almacenamiento contratado/).fill('500');
  await page.getByLabel(/Llamadas API estimadas/).fill('1000000');
  const summary = page.getByRole('region', { name: 'Resumen mensual' });
  await expect(summary).toContainText('140,00');
  await expect(summary).toContainText('29,40');
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    const sizes = await page.evaluate(() => ({
      width: globalThis.innerWidth,
      content: globalThis.document.documentElement.scrollWidth,
    }));
    expect(sizes.content).toBeLessThanOrEqual(sizes.width);
    if (width === 1440) {
      const left = await page
        .getByRole('region', { name: 'Consumo estimado' })
        .boundingBox();
      const right = await summary.boundingBox();
      expect(left.y).toBe(right.y);
      expect(right.x).toBeGreaterThan(left.x + left.width);
      const slider = await page.getByRole('slider').boundingBox();
      const input = await users.boundingBox();
      expect(Math.abs(slider.y - input.y)).toBeLessThan(2);
    }
    await page.screenshot({
      path: info.outputPath('preview-' + width + '.png'),
      fullPage: true,
    });
  }
  await users.fill('');
  await expect(page.getByLabel('Total mensual', { exact: true })).toHaveCount(
    0,
  );
  await expect(summary).toContainText('Revisa los consumos');
});

test('008-T02: controlled FX, late response/EUR, cached currency changes and EUR-only breakdown', async ({
  page,
}) => {
  let calls = 0;
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  await page.route('https://open.er-api.com/**', async (request) => {
    calls++;
    await gate;
    await request.fulfill({ json: provider() });
  });
  await page.goto(route);
  const users = page.getByRole('textbox', {
    name: 'Usuarios activos',
    exact: true,
  });
  await expect(users).toBeEnabled();
  await users.fill('15');
  const selector = page.getByRole('combobox', {
    name: 'Divisa de visualización',
  });
  await selector.selectOption('USD');
  await expect(
    page.getByText('Cargando conversión… Se muestra el total en EUR.'),
  ).toBeVisible();
  await selector.selectOption('EUR');
  const response = page.waitForResponse((value) =>
    value.url().startsWith('https://open.er-api.com'),
  );
  release();
  await response;
  await expect(page.getByLabel('Total mensual', { exact: true })).toContainText(
    '169,40',
  );
  await selector.selectOption('USD');
  await expect(page.getByLabel('Total mensual', { exact: true })).toContainText(
    '203,28',
  );
  await selector.selectOption('GBP');
  await expect(page.getByLabel('Total mensual', { exact: true })).toContainText(
    '135,52',
  );
  await users.fill('10');
  await expect(page.getByLabel('Total mensual', { exact: true })).toContainText(
    '96,80',
  );
  await expect(
    page.getByRole('region', { name: 'Resumen mensual' }),
  ).toContainText('21,00');
  await expect(
    page.getByRole('link', { name: 'Rates By Exchange Rate API' }),
  ).toBeVisible();
  expect(calls).toBe(1);
});

test('008-T02: FX failure keeps EUR usable and retry does not create simulations', async ({
  page,
}) => {
  let calls = 0;
  let posts = 0;
  page.on('request', (request) => {
    if (request.method() === 'POST') posts++;
  });
  await page.route('https://open.er-api.com/**', async (request) => {
    if (++calls === 1) await request.abort('failed');
    else await request.fulfill({ json: provider() });
  });
  await page.goto(route);
  const users = page.getByRole('textbox', {
    name: 'Usuarios activos',
    exact: true,
  });
  await expect(users).toBeEnabled();
  await users.fill('15');
  await page.getByRole('combobox').selectOption('USD');
  await expect(page.getByRole('alert')).toContainText('Se muestra en EUR');
  await expect(page.getByLabel('Total mensual', { exact: true })).toContainText(
    '169,40',
  );
  await page.getByRole('button', { name: 'Reintentar conversión' }).click();
  await expect(page.getByLabel('Total mensual', { exact: true })).toContainText(
    '203,28',
  );
  expect(calls).toBe(2);
  expect(posts).toBe(0);
});
