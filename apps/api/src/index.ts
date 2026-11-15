import { createApp } from './app.js';
import { databaseProvider, runtimeDatabaseOptions } from './db/provider.js';

const port = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error('PORT debe ser un entero entre 1 y 65535');
const provider = databaseProvider(runtimeDatabaseOptions());
const server = createApp({ connection: () => provider.get() }).listen(
  port,
  '127.0.0.1',
  () => {
    console.log(`API disponible en http://127.0.0.1:${port}`);
  },
);
let stopping = false;
function stop() {
  if (stopping) return;
  stopping = true;
  server.close(() => provider.close());
  server.closeIdleConnections();
}
process.once('SIGINT', stop);
process.once('SIGTERM', stop);
server.on('error', (error) => {
  const code = 'code' in error ? String(error.code) : 'SERVER_ERROR';
  console.error(code);
  provider.close();
  process.exitCode = 1;
});
