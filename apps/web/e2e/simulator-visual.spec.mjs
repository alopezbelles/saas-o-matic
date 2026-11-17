import { test, expect, fillSimulation } from './fixtures.mjs';
import { contrast, colors } from './contrast.mjs';

const route = '/customers/00000000-0000-4000-8000-000000000020/simulations/new';
async function noOverflow(page) {
  expect(
    await page.evaluate(() => globalThis.document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(await page.evaluate(() => globalThis.innerWidth));
}

for (const width of [320, 390, 768, 1440]) {
  test(
    'VISUAL-008: preview, invalid input, saved discrepancy and history at ' +
      width +
      'px',
    async ({ page, environment }, info) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(route);
      await fillSimulation(page);
      await expect(
        page.getByLabel('Total mensual', { exact: true }),
      ).toContainText('169,40');
      await noOverflow(page);
      await page.screenshot({
        path: info.outputPath('preview.png'),
        fullPage: true,
      });
      const users = page.getByRole('textbox', {
        name: 'Usuarios activos',
        exact: true,
      });
      await users.fill('');
      await expect(users).toHaveAttribute('aria-invalid', 'true');
      await expect(
        page.getByRole('button', { name: 'Guardar simulación' }),
      ).toBeDisabled();
      await noOverflow(page);
      await page.screenshot({
        path: info.outputPath('invalid.png'),
        fullPage: true,
      });
      await users.fill('15');
      environment.setTaxPolicy('test-visual-v2', {
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
      await noOverflow(page);
      await page.screenshot({
        path: info.outputPath('saved.png'),
        fullPage: true,
      });
      await page.getByRole('link', { name: 'Volver al cliente' }).click();
      await expect(page.getByRole('table')).toBeVisible();
      await expect(page.getByText(/El servidor ha actualizado/)).toBeVisible();
      await noOverflow(page);
      await page.screenshot({
        path: info.outputPath('history.png'),
        fullPage: true,
      });
    },
  );
}

test('VISUAL-008: doubled layout and equivalent reflow retain valid controls and save', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto(route);
  await fillSimulation(page);
  await page.evaluate(() => {
    globalThis.document.documentElement.style.zoom = '2';
  });
  await noOverflow(page);
  await page.screenshot({
    path: info.outputPath('zoom-200.png'),
    fullPage: true,
  });
  await page.getByRole('button', { name: 'Guardar simulación' }).click();
  await expect(
    page.getByRole('heading', { name: 'Resultado guardado' }),
  ).toBeVisible();
  await noOverflow(page);
  await page.evaluate(() => {
    globalThis.document.documentElement.style.zoom = '';
  });
  await page.setViewportSize({ width: 640, height: 500 });
  await noOverflow(page);
  await page.getByRole('button', { name: 'Preparar otra simulación' }).click();
  await expect(
    page.getByRole('textbox', { name: 'Usuarios activos', exact: true }),
  ).toHaveValue('0');
  await page.screenshot({
    path: info.outputPath('reflow-640.png'),
    fullPage: true,
  });
});

test('VISUAL-008: keyboard controls, associated errors, save feedback and refresh focus', async ({
  page,
}) => {
  await page.goto(route);
  await fillSimulation(page);
  const slider = page.getByRole('slider');
  await slider.focus();
  await page.keyboard.press('ArrowRight');
  await expect(
    page.getByRole('textbox', { name: 'Usuarios activos', exact: true }),
  ).toHaveValue('16');
  await page.keyboard.press('Tab');
  const users = page.getByRole('textbox', {
    name: 'Usuarios activos',
    exact: true,
  });
  await expect(users).toBeFocused();
  await users.fill('-1');
  const described = await users.getAttribute('aria-describedby');
  expect(described).toContain('-error');
  await expect(
    page.locator('[id="' + described.split(' ').at(-1) + '"]'),
  ).toContainText('Introduce un entero');
  await expect(
    page.getByRole('button', { name: 'Guardar simulación' }),
  ).toBeDisabled();
  await users.fill('15');
  await page.keyboard.press('Tab');
  await expect(page.getByLabel(/Almacenamiento contratado/)).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByLabel(/Llamadas API estimadas/)).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('combobox')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Volver al cliente' }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  const submit = page.getByRole('button', { name: 'Guardar simulación' });
  await expect(submit).toBeFocused();
  expect(
    await submit.evaluate(
      (element) => globalThis.getComputedStyle(element).outlineStyle,
    ),
  ).toBe('solid');
  await page.keyboard.press('Enter');
  await expect(
    page.getByText('Simulación guardada correctamente.').locator('../..'),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('combobox')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Volver al cliente' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('table')).toBeVisible();
  await page.getByRole('button', { name: 'Actualizar historial' }).focus();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', {
      name: 'Historial de simulaciones',
      exact: true,
    }),
  ).toBeFocused();
});

test('VISUAL-008: measured text, error, control, total and keyboard focus contrast', async ({
  page,
}, info) => {
  await page.goto(route);
  await fillSimulation(page);
  const measurements = [];
  for (const [name, locator, boundary] of [
    [
      'users',
      page.getByRole('textbox', { name: 'Usuarios activos', exact: true }),
      true,
    ],
    ['currency', page.getByRole('combobox'), true],
    ['hint', page.getByText('De 0 a 1000 usuarios, sin decimales.'), false],
    ['total', page.getByLabel('Total mensual', { exact: true }), false],
    ['save', page.getByRole('button', { name: 'Guardar simulación' }), false],
  ]) {
    const rendered = await colors(locator);
    const text = contrast(rendered.color, rendered.background);
    measurements.push({ name, kind: 'text', ratio: text });
    expect(text, name).toBeGreaterThanOrEqual(4.5);
    if (boundary) {
      const ratio = contrast(rendered.border, rendered.background);
      measurements.push({ name, kind: 'boundary', ratio });
      expect(ratio, name).toBeGreaterThanOrEqual(3);
    }
  }
  const users = page.getByRole('textbox', {
    name: 'Usuarios activos',
    exact: true,
  });
  await users.fill('');
  const error = page.getByText('Introduce un entero entre 0 y 1000.');
  const renderedError = await colors(error);
  const errorRatio = contrast(renderedError.color, renderedError.background);
  measurements.push({ name: 'error', kind: 'text', ratio: errorRatio });
  expect(errorRatio).toBeGreaterThanOrEqual(4.5);
  const border = await colors(users);
  expect(contrast(border.border, border.background)).toBeGreaterThanOrEqual(3);
  await users.fill('15');
  await page.getByRole('link', { name: 'Volver al cliente' }).focus();
  await page.keyboard.press('Tab');
  const submit = page.getByRole('button', { name: 'Guardar simulación' });
  await expect(submit).toBeFocused();
  const renderedFocus = await colors(submit);
  const focusRatio = contrast(renderedFocus.outline, 'rgb(255, 255, 255)');
  measurements.push({ name: 'focus', kind: 'outline', ratio: focusRatio });
  expect(focusRatio).toBeGreaterThanOrEqual(3);
  await info.attach('contrast-measurements-008', {
    body: JSON.stringify(measurements, null, 2),
    contentType: 'application/json',
  });
});
