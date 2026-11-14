import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  assertOwnership,
  openDatabase,
  withNewDatabase,
  type Connection,
  type DatabaseOptions,
} from './connection.js';
import { resolveDatabasePath } from './paths.js';

export type Migration = { id: string; hash: string; sql: string };
export function loadMigrations(
  directory = fileURLToPath(new URL('../../drizzle/', import.meta.url)),
): Migration[] {
  const journal = JSON.parse(
    readFileSync(path.join(directory, 'meta/_journal.json'), 'utf8'),
  ) as { entries: { tag: string }[] };
  return journal.entries.map(({ tag }) => {
    if (!/^[a-zA-Z0-9_-]+$/.test(tag)) throw new Error('DB_MIGRATION_INVALID');
    const sql = readFileSync(path.join(directory, tag + '.sql'), 'utf8');
    return {
      id: tag,
      sql,
      hash: createHash('sha256').update(sql).digest('hex'),
    };
  });
}

export function applyMigrations(
  db: Connection,
  kind: DatabaseOptions['kind'],
  migrations = loadMigrations(),
  initial = false,
) {
  if (!initial) assertOwnership(db, kind);
  db.transaction(() => {
    db.exec(
      'CREATE TABLE IF NOT EXISTS __app_migrations (id TEXT PRIMARY KEY NOT NULL, hash TEXT NOT NULL) STRICT',
    );
    const applied = db
      .prepare('SELECT id, hash FROM __app_migrations ORDER BY id')
      .all() as { id: string; hash: string }[];
    if (
      applied.length > migrations.length ||
      applied.some(
        (row, i) =>
          row.id !== migrations[i]?.id || row.hash !== migrations[i]?.hash,
      )
    )
      throw new Error('DB_MIGRATION_DRIFT');
    for (const migration of migrations.slice(applied.length)) {
      // exec supports multi-statement triggers; Drizzle breakpoint comments are SQL comments.
      db.exec(migration.sql);
      db.prepare('INSERT INTO __app_migrations (id, hash) VALUES (?, ?)').run(
        migration.id,
        migration.hash,
      );
    }
    if (initial) {
      db.prepare('INSERT INTO app_metadata (key, value) VALUES (?, ?)').run(
        'schema_owner',
        'saas-o-matic',
      );
      db.prepare('INSERT INTO app_metadata (key, value) VALUES (?, ?)').run(
        'database_kind',
        kind,
      );
    }
    if (
      (db.pragma('foreign_key_check') as unknown[]).length ||
      db.pragma('integrity_check', { simple: true }) !== 'ok'
    )
      throw new Error('DB_INTEGRITY_FAILED');
  }).immediate();
}

export function migrateDatabase(options: DatabaseOptions, newOnly = false) {
  const target = resolveDatabasePath(options.path, options.context);
  if (!existsSync(target))
    return withNewDatabase(options, (db) =>
      applyMigrations(db, options.kind, undefined, true),
    );
  if (newOnly) throw new Error('DB_ALREADY_EXISTS');
  const db = openDatabase(options);
  try {
    applyMigrations(db, options.kind);
  } finally {
    db.close();
  }
}
