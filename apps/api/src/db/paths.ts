import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  realpathSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const projectRoot = path.resolve(
  fileURLToPath(new URL('../../../../', import.meta.url)),
);
export const defaultDatabasePath = path.join(
  projectRoot,
  'apps/api/data/dev.sqlite',
);
export type TestContext = Readonly<{ directory: string }>;
const contexts = new WeakSet<TestContext>();

export function within(parent: string, target: string) {
  const relative = path.relative(parent, target);
  return (
    relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative)
  );
}

function canonical(target: string): string {
  let entry;
  try {
    entry = lstatSync(target);
  } catch (error) {
    if (!(
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'ENOENT'
    ))
      throw error;
  }
  // A dangling link must fail realpath, rather than being treated as a new file.
  if (entry) return realpathSync(target);
  const parent = path.dirname(target);
  if (parent === target) throw new Error('DB_PATH_INVALID');
  return path.join(canonical(parent), path.basename(target));
}

export function resolveDatabasePath(input: string, context?: TestContext) {
  if (!input.trim() || (input.includes(':') && !/^[A-Za-z]:[\\/]/.test(input)))
    throw new Error('DB_PATH_INVALID');
  const target = path.resolve(projectRoot, input);
  const resolved = canonical(target);
  // Narrow storage roots keep databases away from code, web assets and configuration.
  const allowed = ['apps/api/data', '.cache'].some((root) =>
    within(canonical(path.join(projectRoot, root)), resolved),
  );
  if (!allowed || !within(realpathSync(projectRoot), resolved))
    throw new Error('DB_PATH_UNSAFE');
  if (
    existsSync(resolved) &&
    (!lstatSync(resolved).isFile() || lstatSync(resolved).nlink > 1)
  )
    throw new Error('DB_PATH_UNSAFE');
  if (context) {
    if (!contexts.has(context) || !within(context.directory, resolved))
      throw new Error('DB_TEST_PATH_UNSAFE');
  } else if (process.env.NODE_TEST_CONTEXT) {
    throw new Error('DB_TEST_CONTEXT_REQUIRED');
  }
  return resolved;
}

export function createTestContext(): TestContext {
  const root = path.join(projectRoot, '.cache/002-tests');
  // Validate parent before creating anything; a replaced cache must not escape the project.
  const target = canonical(root);
  if (
    !within(realpathSync(projectRoot), target) ||
    !within(canonical(path.join(projectRoot, '.cache')), target)
  )
    throw new Error('DB_TEST_PATH_UNSAFE');
  mkdirSync(target, { recursive: true });
  const context = Object.freeze({
    directory: mkdtempSync(path.join(target, 'case-')),
  });
  contexts.add(context);
  return context;
}
