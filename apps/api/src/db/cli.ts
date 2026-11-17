import { defaultDatabasePath, resolveDatabasePath } from './paths.js';
import { openDatabase, type DatabaseKind } from './connection.js';
import { migrateDatabase } from './migrate.js';
import { seedDemo } from './seed.js';
import { backupDatabase } from './backup.js';
import { setupDemo } from './demo-setup.js';

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (
    !['migrate', 'demo:init', 'demo:setup', 'seed', 'backup'].includes(
      command ?? '',
    )
  )
    throw new Error('DB_COMMAND_INVALID');
  const kind = process.env.DATABASE_KIND ?? 'development';
  if (kind !== 'development' && kind !== 'demo')
    throw new Error('DB_KIND_INVALID');
  const file = process.env.DATABASE_PATH ?? defaultDatabasePath;
  const target = resolveDatabasePath(file);
  if (
    command === 'demo:init' ||
    command === 'demo:setup' ||
    command === 'seed'
  ) {
    if (
      kind !== 'demo' ||
      !process.env.DATABASE_PATH ||
      target === resolveDatabasePath(defaultDatabasePath)
    )
      throw new Error('DB_DEMO_REQUIRED');
  }
  const options = { path: target, kind: kind as DatabaseKind };
  if (command !== 'backup' && args.length)
    throw new Error('DB_ARGUMENT_INVALID');
  if (
    command === 'backup' &&
    (args.length !== 2 || args[0] !== '--out' || !args[1])
  )
    throw new Error('DB_ARGUMENT_INVALID');
  if (command === 'demo:setup') {
    setupDemo(options);
  } else if (command === 'migrate' || command === 'demo:init') {
    migrateDatabase(options, command === 'demo:init');
  } else {
    const db = openDatabase(options);
    try {
      if (command === 'seed') seedDemo(db);
      else await backupDatabase(db, args[1]!);
    } finally {
      db.close();
    }
  }
  console.log('Operación de base de datos completada.');
}

main().catch((error: unknown) => {
  // Never print driver messages: constraint errors may include personal data.
  const code =
    error && typeof error === 'object' && 'code' in error
      ? String(error.code)
      : error instanceof Error
        ? error.message
        : '';
  console.error(
    /^(DB_[A-Z_]+|SQLITE_[A-Z_]+)$/.test(code) ? code : 'DB_OPERATION_FAILED',
  );
  process.exitCode = 1;
});
