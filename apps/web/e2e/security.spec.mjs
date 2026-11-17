import { test, expect, fillCustomer } from './fixtures.mjs';

test('QA-SECURITY-009: persisted markup stays literal in the UI and search treats SQL/wildcards as data', async ({
  page,
}) => {
  const company =
    '<img src=x onerror="globalThis.__qaXss=true"> QA\' OR 1=1 -- %_!';
  await page.goto('/customers/new');
  await fillCustomer(page, company);
  await page
    .getByRole('button', { name: 'Crear cliente', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: company, exact: true }),
  ).toBeVisible();
  const detail = new URL(page.url()).pathname;
  await page.reload();
  await expect(
    page.getByRole('heading', { name: company, exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => globalThis.__qaXss)).toBeUndefined();
  await expect(page.locator('img[src="x"]')).toHaveCount(0);
  for (const query of ["' OR 1=1 --", '%_!', company]) {
    await page.goto('/customers?q=' + encodeURIComponent(query));
    await expect(page.getByText('1 resultado', { exact: true })).toBeVisible();
    await expect(page.getByRole('table')).toContainText(company);
    expect(await page.evaluate(() => globalThis.__qaXss)).toBeUndefined();
    await expect(page.locator('img[src="x"]')).toHaveCount(0);
  }
  const response = await page.request.get('/api' + detail);
  expect(response.ok()).toBe(true);
  expect((await response.json()).companyName).toBe(company);
});
