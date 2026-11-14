import { createApp } from './app.js';

const app = createApp();
const port = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT debe ser un entero entre 1 y 65535');
}

const server = app.listen(port, '127.0.0.1', () => {
  console.log(`API disponible en http://127.0.0.1:${port}`);
});

server.on('error', (error) => {
  console.error(error);
  process.exitCode = 1;
});
