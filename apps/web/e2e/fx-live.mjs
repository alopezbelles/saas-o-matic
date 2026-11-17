// Explicit network check, invoked separately from the deterministic Playwright suite.
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createEnvironment } from './environment.mjs';
import { convertCurrency } from '@saas-o-matic/shared';

const workspace = fileURLToPath(new URL('../../../', import.meta.url));
const output = path.join(workspace, '.cache/009-t02-fx-live');
process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(
  workspace,
  '.cache/playwright',
);
const { chromium, expect } = await import('@playwright/test');
const endpoint = 'https://open.er-api.com/v6/latest/EUR';
const report = {
  startedAt: new Date().toISOString(),
  endpoint,
  status: 'pending',
  requests: [],
  responses: [],
  failures: [],
};
let environment;
let browser;
let page;
let providerPayload;
const observations = [];
mkdirSync(output, { recursive: true });

try {
  environment = await createEnvironment();
  browser = await chromium.launch();
  page = await browser.newPage();
  page.on('request', (request) => {
    if (request.url() !== endpoint) return;
    observations.push(
      (async () => {
        const headers = await request.allHeaders();
        report.requests.push({
          method: request.method(),
          hasBody: request.postData() !== null,
          hasCookie: Boolean(headers.cookie),
          hasAuthorization: Boolean(headers.authorization),
          hasReferrer: Boolean(headers.referer),
        });
      })(),
    );
  });
  page.on('response', (response) => {
    if (response.url() !== endpoint) return;
    observations.push(
      (async () => {
        report.responses.push({
          status: response.status(),
          cors: response.headers()['access-control-allow-origin'] ?? null,
        });
        if (response.ok()) providerPayload = await response.json();
      })(),
    );
  });
  page.on('requestfailed', (request) => {
    if (request.url() === endpoint)
      report.failures.push(
        request.failure()?.errorText ?? 'Unknown network failure',
      );
  });
  await page.goto(
    environment.baseURL +
      '/customers/00000000-0000-4000-8000-000000000020/simulations/new',
  );
  const users = page.getByRole('textbox', {
    name: 'Usuarios activos',
    exact: true,
  });
  await expect(users).toBeEnabled();
  await users.fill('15');
  const total = page.getByLabel('Total mensual', { exact: true });
  await expect(total).toContainText('169,40');
  report.eurTotal = await total.textContent();
  await page.getByRole('combobox').selectOption('USD');
  await expect(
    page.getByRole('link', { name: 'Rates By Exchange Rate API' }),
  ).toBeVisible({ timeout: 15000 });
  await Promise.all(observations);
  if (!providerPayload) throw new Error('Provider payload not observed');
  report.provider = {
    base: providerPayload.base_code,
    updatedAt: providerPayload.time_last_update_utc,
    expiresAt: providerPayload.time_next_update_utc,
    usd: String(providerPayload.rates.USD),
    gbp: String(providerPayload.rates.GBP),
  };
  for (const currency of ['USD', 'GBP']) {
    await page.getByRole('combobox').selectOption(currency);
    const amount = convertCurrency({
      amountEurCents: 16940,
      targetCurrency: currency,
      rate: String(providerPayload.rates[currency]),
    }).amountMinor;
    const expected = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency,
    }).format(amount / 100);
    await expect(total).toHaveText(expected);
    report[currency.toLowerCase() + 'Total'] = await total.textContent();
  }
  expect(report.requests).toHaveLength(1);
  expect(report.requests[0]).toEqual({
    method: 'GET',
    hasBody: false,
    hasCookie: false,
    hasAuthorization: false,
    hasReferrer: false,
  });
  report.status = 'passed';
  await page.screenshot({
    path: path.join(output, 'simulator-gbp.png'),
    fullPage: true,
  });
} catch (error) {
  report.status = 'failed';
  report.error = error instanceof Error ? error.message : String(error);
  if (page) {
    report.displayedTotal = await page
      .getByLabel('Total mensual', { exact: true })
      .textContent()
      .catch(() => null);
    report.alerts = await page
      .getByRole('alert')
      .allTextContents()
      .catch(() => []);
    await page
      .screenshot({ path: path.join(output, 'failure.png'), fullPage: true })
      .catch(() => {});
  }
  process.exitCode = 1;
} finally {
  await Promise.allSettled(observations);
  await browser?.close();
  await environment?.close();
  report.finishedAt = new Date().toISOString();
  writeFileSync(
    path.join(output, 'report.json'),
    JSON.stringify(report, null, 2) + '\n',
  );
  console.log(JSON.stringify(report, null, 2));
}
