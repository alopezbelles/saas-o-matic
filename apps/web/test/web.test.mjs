import assert from 'node:assert/strict';
import test from 'node:test';
import { preview } from 'vite';

test('la web compilada sirve HTML y su módulo JavaScript', async () => {
  const server = await preview({
    preview: { host: '127.0.0.1', port: 0, open: false },
  });
  try {
    const baseUrl = `http://127.0.0.1:${server.httpServer.address().port}`;
    const response = await fetch(baseUrl);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /lang="es"/);
    assert.match(html, /<div id="root"><\/div>/);
    const modulePath = html.match(/src="([^"]+\.js)"/)?.[1];
    assert.ok(modulePath, 'El HTML debe cargar el bundle generado');
    const bundle = await fetch(new URL(modulePath, baseUrl));
    assert.equal(bundle.status, 200);
    assert.match(bundle.headers.get('content-type'), /javascript/);
    assert.match(await bundle.text(), /saas-o-matic/);
  } finally {
    await new Promise((resolve, reject) => {
      server.httpServer.close((error) => (error ? reject(error) : resolve()));
      server.httpServer.closeAllConnections();
    });
  }
});
