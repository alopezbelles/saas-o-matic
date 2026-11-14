import express from 'express';

const app = express();
const port = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT debe ser un entero entre 1 y 65535');
}

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});

const server = app.listen(port, '127.0.0.1', () => {
  console.log(`API disponible en http://127.0.0.1:${port}`);
});

server.on('error', (error) => {
  console.error(error);
  process.exitCode = 1;
});
