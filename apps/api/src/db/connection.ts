import Database from 'better-sqlite3';
import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  unlinkSync,
} from 'node:fs';
import path from 'node:path';
import { resolveDatabasePath, type TestContext } from './paths.js';

export type DatabaseKind = 'development' | 'demo' | 'test';
export type Connection = Database.Database;
export type DatabaseOptions = {
  path: string;
  kind: DatabaseKind;
  context?: TestContext;
};

export function assertOwnership(db: Connection, kind: DatabaseKind) {
  try {
    const values = db.prepare('SELECT key, value FROM app_metadata').all() as {
      key: string;
      value: string;
    }[];
    const metadata = Object.fromEntries(
      values.map(({ key, value }) => [key, value]),
    );
    if (
      metadata.schema_owner !== 'saas-o-matic' ||
      metadata.database_kind !== kind
    )
      throw new Error();
    if (
      !db
        .prepare(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='__app_migrations'",
        )
        .get()
    )
      throw new Error();
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'SQLITE_BUSY'
    )
      throw error;
    throw new Error('DB_OWNER_MISMATCH', { cause: error });
  }
}

function configure(db: Connection) {
  db.pragma('foreign_keys = ON');
  db.pragma('busy_timeout = 1000');
  if (db.pragma('foreign_keys', { simple: true }) !== 1)
    throw new Error('DB_FOREIGN_KEYS_DISABLED');
  if (db.pragma('journal_mode', { simple: true }) !== 'delete')
    throw new Error('DB_JOURNAL_UNSUPPORTED');
  db.prepare("SELECT json_valid('[]')").get();
  db.exec(
    'CREATE TEMP TABLE capability_check (value INTEGER) STRICT; DROP TABLE capability_check;',
  );
}

export function openDatabase(options: DatabaseOptions): Connection {
  const target = resolveDatabasePath(options.path, options.context);
  if (options.kind === 'test' && !options.context)
    throw new Error('DB_TEST_CONTEXT_REQUIRED');
  const inspection = new Database(target, {
    readonly: true,
    fileMustExist: true,
    timeout: 1000,
  });
  try {
    assertOwnership(inspection, options.kind);
  } finally {
    inspection.close();
  }
  const db = new Database(target, { fileMustExist: true, timeout: 1000 });
  try {
    configure(db);
    return db;
  } catch (error) {
    db.close();
    throw error;
  }
}

export function withNewDatabase<T>(
  options: DatabaseOptions,
  initialize: (db: Connection) => T,
): T {
  const target = resolveDatabasePath(options.path, options.context);
  if (existsSync(target)) throw new Error('DB_ALREADY_EXISTS');
  if (options.kind === 'test' && !options.context)
    throw new Error('DB_TEST_CONTEXT_REQUIRED');
  mkdirSync(path.dirname(target), { recursive: true });
  // Exclusive creation prevents accidentally adopting another process's file.
  closeSync(openSync(target, 'wx'));
  let db: Connection | undefined;
  try {
    db = new Database(target, { fileMustExist: true, timeout: 1000 });
    configure(db);
    return initialize(db);
  } catch (error) {
    db?.close();
    db = undefined;
    // This exact file was created exclusively above; never remove an existing user database.
    unlinkSync(target);
    throw error;
  } finally {
    db?.close();
  }
}
