import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

test('los controles devuelven error ante tipos, lint y tests incorrectos', () => {
  const directory = mkdtempSync(path.resolve('apps/api/src/gate-check-'));
  const childEnvironment = { ...process.env };
  // The negative fixture must start a fresh runner, outside this test's context.
  delete childEnvironment.NODE_TEST_CONTEXT;
  const run = (args) =>
    spawnSync(process.execPath, args, {
      encoding: 'utf8',
      timeout: 30000,
      env: childEnvironment,
    });
  const checkFailure = (result, expectedOutput) => {
    assert.ifError(result.error);
    assert.notEqual(result.status, null);
    assert.notEqual(result.status, 0);
    assert.match(result.stdout + result.stderr, expectedOutput);
  };
  try {
    writeFileSync(
      path.join(directory, 'invalid.ts'),
      'export const value: number = "invalid";\n',
    );
    checkFailure(
      run([
        'node_modules/typescript/bin/tsc',
        '--project',
        'apps/api/tsconfig.json',
        '--noEmit',
      ]),
      /TS2322/,
    );
    const lintFile = path.join(directory, 'invalid.mjs');
    writeFileSync(lintFile, 'unknownGateValue();\n');
    checkFailure(
      run(['node_modules/eslint/bin/eslint.js', lintFile]),
      /no-undef/,
    );
    const testFile = path.join(directory, 'failing.test.mjs');
    writeFileSync(
      testFile,
      "import test from 'node:test';\ntest('intentional failure', () => { throw new Error('gate sentinel'); });\n",
    );
    checkFailure(run(['--test', testFile]), /gate sentinel/);
  } finally {
    // Only the unique directory created by this test is removed.
    assert.equal(path.dirname(directory), path.resolve('apps/api/src'));
    assert.ok(path.basename(directory).startsWith('gate-check-'));
    rmSync(directory, { recursive: true, force: true });
  }
});
