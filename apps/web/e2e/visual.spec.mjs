import { test, expect, fillCustomer } from './fixtures.mjs';
import { fixtureCustomerId } from './environment.mjs';

async function noOverflow(page) {
  const sizes = await page.evaluate(() => ({
    viewport: globalThis.innerWidth,
    content: globalThis.document.documentElement.scrollWidth,
  }));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
}

for (const width of [320, 390, 768, 1440]) {
  test(`VISUAL-007: list/form/detail reflow at ${width}px`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const [name, route] of [
      ['list', '/customers'],
      ['form', '/customers/new'],
      ['detail', '/customers/' + fixtureCustomerId],
    ]) {
      await page.goto(route);
      if (name === 'form') await fillCustomer(page);
      else await expect(page.getByRole('table')).toBeVisible();
      await noOverflow(page);
      await page.screenshot({
        path: info.outputPath(name + '.png'),
        fullPage: name === 'form',
      });
    }
  });
}

test('VISUAL-007: 200 percent layout zoom retains content and working controls', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  for (const route of [
    '/customers',
    '/customers/new',
    '/customers/' + fixtureCustomerId,
  ]) {
    await page.goto(route);
    if (route.endsWith('/new')) await fillCustomer(page);
    else await expect(page.getByRole('table')).toBeVisible();
    // CSS layout zoom exercises doubled content; it is not a native browser-menu zoom claim.
    await page.evaluate(() => {
      globalThis.document.documentElement.style.zoom = '2';
    });
    await noOverflow(page);
    if (route.endsWith('/new')) {
      await expect(
        page.getByRole('button', { name: 'Crear cliente', exact: true }),
      ).toBeEnabled();
      await page.screenshot({
        path: info.outputPath('form-zoom-200.png'),
        fullPage: true,
      });
      await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
      await expect(
        page.getByRole('heading', { name: 'Clientes', exact: true }),
      ).toBeVisible();
    }
  }
  // Reflow equivalent to a 1280-physical-pixel viewport at browser zoom 200%.
  await page.setViewportSize({ width: 640, height: 500 });
  await page.goto('/customers/new');
  await fillCustomer(page);
  await noOverflow(page);
});

test('VISUAL-007: keyboard navigation, skip link, validation summary and history focus', async ({
  page,
}) => {
  await page.goto('/customers');
  await expect(page.getByRole('table')).toBeVisible();
  // The route focuses h1. Move backwards through the header to reach the skip link.
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Shift+Tab');
  const skip = page.getByRole('link', { name: 'Saltar al contenido' });
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  await page.keyboard.press('Tab');
  const create = page.getByRole('link', { name: 'Nuevo cliente', exact: true });
  await expect(create).toBeFocused();
  expect(
    await create.evaluate(
      (element) => globalThis.getComputedStyle(element).outlineStyle,
    ),
  ).toBe('solid');
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', { name: 'Nuevo cliente', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByLabel(/Nombre de empresa/)).toBeFocused();
  await expect(
    page.getByRole('button', { name: 'Crear cliente', exact: true }),
  ).toBeEnabled();
  await page
    .getByRole('button', { name: 'Crear cliente', exact: true })
    .focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('alert')).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.getByLabel(/Nombre de empresa/)).toBeFocused();
  await page.goto('/customers/' + fixtureCustomerId);
  await expect(page.getByRole('table')).toBeVisible();
  await page.getByRole('button', { name: 'Siguiente', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(
    page.getByText('Mostrando 21–21 de 21', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', {
      name: 'Historial de simulaciones',
      exact: true,
    }),
  ).toBeFocused();
  await page.goto('/customers');
  await expect(page.getByRole('table')).toBeVisible();
  await page.getByRole('button', { name: 'Siguiente', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(
    page.getByText('Mostrando 21–21 de 21', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Clientes', exact: true }),
  ).toBeFocused();
});

function luminance(color) {
  const values = color
    .match(/[\d.]+/g)
    .slice(0, 3)
    .map(Number)
    .map((channel) => {
      const value = channel / 255;
      return value <= 0.04045
        ? value / 12.92
        : ((value + 0.055) / 1.055) ** 2.4;
    });
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}
function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
async function colors(locator) {
  return locator.evaluate((element) => {
    const style = globalThis.getComputedStyle(element);
    let current = element;
    let background;
    while (current) {
      const color = globalThis.getComputedStyle(current).backgroundColor;
      if (color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
        background = color;
        break;
      }
      current = current.parentElement;
    }
    return {
      color: style.color,
      border: style.borderTopColor,
      outline: style.outlineColor,
      background: background ?? 'rgb(255, 255, 255)',
    };
  });
}

test('VISUAL-007: rendered text, actions, controls and focus meet measured contrast thresholds', async ({
  page,
}, info) => {
  const measurements = [];
  await page.goto('/customers/new');
  await fillCustomer(page);
  const submit = page.getByRole('button', {
    name: 'Crear cliente',
    exact: true,
  });
  for (const [name, locator] of [
    [
      'description',
      page.getByText('Registra una empresa y sus datos de contacto.'),
    ],
    [
      'hint',
      page.getByText(
        'Planes de demostración. Actualmente ambos aplican la misma tarifa.',
      ),
    ],
    ['input', page.getByLabel(/Nombre de empresa/)],
    ['country', page.getByLabel(/País/)],
    ['primary', submit],
    ['cancel', page.getByRole('button', { name: 'Cancelar' })],
  ]) {
    const rendered = await colors(locator);
    const ratio = contrast(rendered.color, rendered.background);
    measurements.push({ name, kind: 'text', ratio });
    expect(ratio, name + ' text contrast').toBeGreaterThanOrEqual(4.5);
    if (name === 'input' || name === 'country') {
      const boundary = contrast(rendered.border, rendered.background);
      measurements.push({ name, kind: 'boundary', ratio: boundary });
      expect(boundary, name + ' boundary contrast').toBeGreaterThanOrEqual(3);
    }
  }
  await submit.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  expect(
    await submit.evaluate(
      (element) => globalThis.getComputedStyle(element).outlineStyle,
    ),
  ).toBe('solid');
  const focus = await colors(submit);
  expect(contrast(focus.outline, 'rgb(255, 255, 255)')).toBeGreaterThanOrEqual(
    3,
  );
  await page.getByLabel(/Identificador fiscal/).fill('12345678A');
  await submit.click();
  await expect(page.getByRole('alert')).toBeVisible();
  const error = await colors(page.locator('[aria-invalid="true"]'));
  expect(contrast(error.border, error.background)).toBeGreaterThanOrEqual(3);
  const inlineError = await colors(page.locator('p[id$="-error"]'));
  measurements.push({
    name: 'inline error',
    kind: 'text',
    ratio: contrast(inlineError.color, inlineError.background),
  });
  expect(
    contrast(inlineError.color, inlineError.background),
  ).toBeGreaterThanOrEqual(4.5);
  await info.attach('contrast-measurements', {
    body: JSON.stringify(measurements, null, 2),
    contentType: 'application/json',
  });
});
