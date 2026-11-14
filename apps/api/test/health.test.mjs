import assert from 'node:assert/strict';
import { once } from 'node:events';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import { createApp } from '../dist/app.js';

test('health responde JSON y las rutas desconocidas devuelven 404', async () => {
  const server = createApp().listen(0, '127.0.0.1');
  try {
    await once(server, 'listening');
    const baseUrl = `http://127.0.0.1:${server.address().port}`;
    const response = await fetch(`${baseUrl}/health`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /application\/json/);
    assert.deepEqual(await response.json(), { status: 'ok' });
    assert.equal((await fetch(`${baseUrl}/missing`)).status, 404);
    assert.equal(
      (await fetch(`${baseUrl}/health`, { method: 'POST' })).status,
      404,
    );
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
      server.closeAllConnections();
    });
  }
});

test('el servidor rechaza PORT inválido y un puerto ocupado con salida no cero', async () => {
  const run = (port) =>
    spawnSync(process.execPath, ['dist/index.js'], {
      env: { ...process.env, PORT: String(port) },
      encoding: 'utf8',
      timeout: 10000,
    });
  for (const port of ['invalid', 0, 65536, 1.5]) {
    const result = run(port);
    assert.ifError(result.error);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /PORT debe ser un entero/);
  }
  const server = createApp().listen(0, '127.0.0.1');
  try {
    await once(server, 'listening');
    const result = run(server.address().port);
    assert.ifError(result.error);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /EADDRINUSE/);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});
