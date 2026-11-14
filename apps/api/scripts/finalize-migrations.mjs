import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

// drizzle-kit 0.31 does not express SQLite STRICT or append-only triggers.
// Finalize only newly generated SQL. Previously finalized files remain byte-identical.
for (const name of readdirSync('drizzle').filter((file) =>
  file.endsWith('.sql'),
)) {
  const file = path.join('drizzle', name);
  let sql = readFileSync(file, 'utf8');
  if (sql.startsWith('-- finalized-sqlite-v1')) continue;
  sql = sql.replace(/(CREATE TABLE[\s\S]*?\n)\);/g, '$1) STRICT;');
  if (/CREATE TABLE `simulations`/.test(sql)) {
    sql +=
      "\nCREATE TRIGGER simulations_no_update BEFORE UPDATE ON simulations BEGIN SELECT RAISE(ABORT, 'SIMULATION_IMMUTABLE'); END;\n";
    sql +=
      "CREATE TRIGGER simulations_no_delete BEFORE DELETE ON simulations BEGIN SELECT RAISE(ABORT, 'SIMULATION_IMMUTABLE'); END;\n";
  }
  writeFileSync(file, '-- finalized-sqlite-v1\n' + sql);
}
