import {
  closeSync,
  existsSync,
  openSync,
  mkdirSync,
  unlinkSync,
} from 'node:fs';
import path from 'node:path';
import { resolveDatabasePath, type TestContext } from './paths.js';
import type { Connection } from './connection.js';

export async function backupDatabase(
  db: Connection,
  output: string,
  context?: TestContext,
) {
  const target = resolveDatabasePath(output, context);
  if (target === resolveDatabasePath(db.name, context) || existsSync(target))
    throw new Error('DB_BACKUP_TARGET_EXISTS');
  mkdirSync(path.dirname(target), { recursive: true });
  closeSync(openSync(target, 'wx'));
  try {
    await db.backup(target);
  } catch (error) {
    unlinkSync(target);
    throw error;
  }
  return target;
}
