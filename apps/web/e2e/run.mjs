import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const environment = { ...process.env };
// Playwright sets FORCE_COLOR for workers; remove the contradictory inherited flag.
delete environment.NO_COLOR;
const args = process.argv.slice(2);
const command =
  args[0] === 'install'
    ? ['install', 'chromium']
    : ['test', '--config=playwright.config.mjs', ...args];
const child = spawn(
  process.execPath,
  [require.resolve('@playwright/test/cli'), ...command],
  {
    cwd: fileURLToPath(new URL('../', import.meta.url)),
    env: {
      ...environment,
      PLAYWRIGHT_BROWSERS_PATH: fileURLToPath(
        new URL('../../../.cache/playwright', import.meta.url),
      ),
    },
    stdio: 'inherit',
  },
);
child.on('error', (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
child.on('exit', (code) => {
  process.exitCode = code ?? 1;
});
