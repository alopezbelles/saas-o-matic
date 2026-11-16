import { test as base, expect } from '@playwright/test';
import { createEnvironment } from './environment.mjs';

export const test = base.extend({
  environment: async ({ browserName }, use) => {
    expect(browserName).toBe('chromium');
    const environment = await createEnvironment();
    try {
      await use(environment);
    } finally {
      await environment.close();
    }
  },
  baseURL: async ({ environment }, use) => {
    await use(environment.baseURL);
  },
  page: async ({ page }, use) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await use(page);
    expect(errors).toEqual([]);
  },
});
export { expect };

export async function fillCustomer(page, companyName = 'Empresa E2E') {
  await expect(page.getByRole('option', { name: 'España' })).toBeAttached();
  await page.getByLabel(/Nombre de empresa/).fill(companyName);
  await page.getByLabel(/Identificador fiscal/).fill('12345678Z');
  await page.getByLabel(/Email de contacto/).fill('e2e@example.invalid');
  await page.getByLabel(/País/).selectOption('ES');
  await page.getByLabel(/Plan elegido/).selectOption('DEMO_BASIC');
}
