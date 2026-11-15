import {
  openDatabase,
  type Connection,
  type DatabaseOptions,
} from './connection.js';
import { defaultDatabasePath } from './paths.js';
import { HttpError } from '../http/errors.js';
import { assertCurrentSchema } from './migrate.js';
export function databaseProvider(options: DatabaseOptions) {
  let db: Connection | undefined;
  return {
    get() {
      if (db?.open) return db;
      try {
        db = openDatabase(options);
        assertCurrentSchema(db);
        return db;
      } catch (error) {
        if (db?.open) db.close();
        db = undefined;
        if (
          error &&
          typeof error === 'object' &&
          'code' in error &&
          error.code === 'SQLITE_BUSY'
        )
          throw new HttpError(503, 'DATABASE_BUSY');
        throw new HttpError(503, 'DATABASE_UNAVAILABLE');
      }
    },
    close() {
      if (db?.open) db.close();
      db = undefined;
    },
  };
}
export function runtimeDatabaseOptions(): DatabaseOptions {
  const kind = process.env.DATABASE_KIND ?? 'development';
  if (kind !== 'development' && kind !== 'demo')
    throw new Error('DATABASE_KIND debe ser development o demo');
  return { path: process.env.DATABASE_PATH ?? defaultDatabasePath, kind };
}
