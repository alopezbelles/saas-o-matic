import { test, expect, fillSimulation } from './fixtures.mjs';

async function auditAssociations(page) {
  const issues = await page.evaluate(() => {
    const document = globalThis.document;
    const failures = [];
    const seen = new Set();
    for (const element of document.querySelectorAll('[id]')) {
      if (seen.has(element.id)) failures.push('Duplicate ID ' + element.id);
      seen.add(element.id);
    }
    for (const attribute of ['aria-labelledby', 'aria-describedby']) {
      for (const element of document.querySelectorAll('[' + attribute + ']')) {
        for (const id of element
          .getAttribute(attribute)
          .split(/\s+/)
          .filter(Boolean)) {
          if (!document.getElementById(id))
            failures.push(attribute + ' missing ' + id);
        }
      }
    }
    for (const element of document.querySelectorAll(
      'input:not([type="hidden"]), select, textarea',
    )) {
      if (
        !element.labels?.length &&
        !element.getAttribute('aria-label') &&
        !element.getAttribute('aria-labelledby')
      )
        failures.push('Unlabelled control ' + element.tagName);
      if (
        element.getAttribute('aria-invalid') === 'true' &&
        !element.getAttribute('aria-describedby')
      )
        failures.push('Invalid control without description ' + element.id);
    }
    return {
      failures,
      viewport: globalThis.innerWidth,
      content: document.documentElement.scrollWidth,
    };
  });
  expect(issues.failures).toEqual([]);
  expect(issues.content).toBeLessThanOrEqual(issues.viewport);
  await expect(page.getByRole('main')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
}

for (const width of [320, 390, 768, 1440]) {
  test(
    'QA-A11Y-009: labelled loading/error/empty states and long content at ' +
      width +
      'px',
    async ({ page }, info) => {
      await page.setViewportSize({ width, height: 1000 });
      const companyName = 'Empresa ' + 'W'.repeat(192);
      const response = await page.request.post('/api/customers', {
        data: {
          companyName,
          taxId: '12345678Z',
          contactEmail:
            'contacto'.repeat(8) +
            '@' +
            'dominio'.repeat(7) +
            '.example.invalid',
          countryCode: 'ES',
          planCode: 'DEMO_BASIC',
        },
      });
      expect(response.status()).toBe(201);
      const customer = await response.json();
      let release;
      const gate = new Promise((resolve) => {
        release = resolve;
      });
      let failRequests = true;
      await page.route('**/api/customers?*', async (route) => {
        if (failRequests) {
          await gate;
          if (route.request().failure()) return;
          await route.fulfill({
            status: 503,
            json: {
              error: {
                code: 'DATABASE_UNAVAILABLE',
                message: 'Servicio temporalmente no disponible.',
                requestId: 'a11y-fixture',
              },
            },
          });
        } else await route.continue();
      });
      try {
        await page.goto('/customers');
        await expect(
          page.getByText('Cargando clientes…', { exact: true }),
        ).toBeVisible();
        await auditAssociations(page);
        await page.screenshot({
          path: info.outputPath('loading.png'),
          fullPage: true,
        });
      } finally {
        release();
      }
      await expect(page.getByRole('alert')).toBeVisible();
      await auditAssociations(page);
      await page.screenshot({
        path: info.outputPath('list-error.png'),
        fullPage: true,
      });
      failRequests = false;
      await page
        .getByRole('button', { name: 'Reintentar', exact: true })
        .focus();
      await page.keyboard.press('Enter');
      await expect(page.getByRole('table')).toContainText(companyName);
      await expect(
        page.getByRole('heading', { name: 'Clientes', exact: true }),
      ).toBeFocused();
      await auditAssociations(page);
      await page.screenshot({
        path: info.outputPath('long-list.png'),
        fullPage: true,
      });

      await page.goto('/customers?q=no-match-009');
      await expect(
        page.getByText('No hay clientes que coincidan con la búsqueda.', {
          exact: true,
        }),
      ).toBeVisible();
      await auditAssociations(page);
      await page.screenshot({
        path: info.outputPath('empty.png'),
        fullPage: true,
      });

      await page.goto('/customers/new');
      await expect(
        page.getByRole('option', { name: 'España', exact: true }),
      ).toBeAttached();
      await page
        .getByRole('button', { name: 'Crear cliente', exact: true })
        .click();
      await expect(page.getByRole('alert')).toBeFocused();
      await auditAssociations(page);
      await info.attach('form-errors-accessible-structure', {
        body: await page.getByRole('alert').ariaSnapshot(),
        contentType: 'text/plain',
      });
      await page.screenshot({
        path: info.outputPath('form-errors.png'),
        fullPage: true,
      });
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await expect(page.getByLabel(/Nombre de empresa/)).toBeFocused();

      await page.goto('/customers/' + customer.id);
      await expect(
        page.getByText(
          'Este cliente todavía no tiene simulaciones guardadas.',
          { exact: true },
        ),
      ).toBeVisible();
      await auditAssociations(page);
      await page.screenshot({
        path: info.outputPath('long-detail-empty-history.png'),
        fullPage: true,
      });
      await page.goto(
        '/customers/00000000-0000-4000-8000-000000000020/simulations/new',
      );
      await fillSimulation(page);
      await page.route('https://open.er-api.com/**', (route) => route.abort());
      await page.getByRole('combobox').selectOption('USD');
      await expect(
        page.getByRole('button', { name: 'Reintentar conversión' }),
      ).toBeVisible();
      await auditAssociations(page);
      await page.screenshot({
        path: info.outputPath('fx-fallback.png'),
        fullPage: true,
      });
      await page.getByRole('button', { name: 'Guardar simulación' }).click();
      await expect(
        page.getByText('Simulación guardada correctamente.').locator('../..'),
      ).toBeFocused();
      await auditAssociations(page);
      await page.screenshot({
        path: info.outputPath('confirmation-fx-fallback.png'),
        fullPage: true,
      });
      await page.getByRole('link', { name: 'Volver al cliente' }).click();
      const history = page.getByRole('region', {
        name: 'Historial de simulaciones',
      });
      await expect(history.getByRole('table')).toBeVisible();
      await expect(history.getByRole('row').nth(1)).toContainText('169,40');
      await auditAssociations(page);
      await info.attach('history-accessible-structure', {
        body: await history.ariaSnapshot(),
        contentType: 'text/plain',
      });
      await page.screenshot({
        path: info.outputPath('history.png'),
        fullPage: true,
      });

      await page.goto('/customers/' + customer.id + '/simulations/new');
      await fillSimulation(page);
      const overflow = await page.evaluate(() => ({
        viewport: globalThis.innerWidth,
        content: globalThis.document.documentElement.scrollWidth,
      }));
      await info.attach('009-QA-01-long-company-overflow', {
        body: JSON.stringify(overflow, null, 2),
        contentType: 'application/json',
      });
      await page.screenshot({
        path: info.outputPath('known-overflow.png'),
        fullPage: true,
      });
      // Keep the defect executable until T04 fixes it and removes this expectation.
      // Earlier assertions must succeed before this expected failure is declared.
      test.fail(
        true,
        '009-QA-01: unbroken company name overflows simulator, pending T04',
      );
      expect(overflow.content).toBeLessThanOrEqual(overflow.viewport);
    },
  );
}
