import assert from 'node:assert/strict';
import test from 'node:test';
import { fork } from 'node:child_process';
import { createServer } from 'node:net';
import { once } from 'node:events';
import path from 'node:path';
import { testArea } from './db-fixtures.mjs';
import { migrateDatabase } from '../dist/db/migrate.js';

test(
  'IT-LIFECYCLE-01: proceso HTTP cierra conexión al manejar SIGTERM simulado',
  { timeout: 20000 },
  async (t) => {
    const context = testArea(t);
    const file = path.join(context.directory, 'server.sqlite');
    migrateDatabase({ path: file, kind: 'development', context });
    const reservation = createServer().listen(0, '127.0.0.1');
    await once(reservation, 'listening');
    const port = reservation.address().port;
    await new Promise((resolve) => reservation.close(resolve));
    const env = {
      ...process.env,
      PORT: String(port),
      DATABASE_PATH: file,
      DATABASE_KIND: 'development',
    };
    delete env.NODE_TEST_CONTEXT;
    const child = fork('test/server-bootstrap.mjs', {
      env,
      execArgv: [],
      silent: true,
    });
    const exit = once(child, 'exit');
    const messages = [];
    child.on('message', (message) => messages.push(message));
    let output = '';
    let errors = '';
    child.stdout.on('data', (data) => {
      output += data;
    });
    child.stderr.on('data', (data) => {
      errors += data;
    });
    try {
      await new Promise((resolve, reject) => {
        const deadline = setTimeout(
          () => reject(new Error('Server startup timeout: ' + errors)),
          10000,
        );
        const check = () => {
          if (output.includes('API disponible')) {
            clearTimeout(deadline);
            child.stdout.off('data', check);
            resolve();
          }
        };
        child.stdout.on('data', check);
        check();
      });
      assert.equal(
        (await fetch('http://127.0.0.1:' + port + '/customers')).status,
        200,
      );
      child.send('shutdown');
      const [code] = await exit;
      assert.equal(code, 0, errors);
      assert.ok(messages.includes('db-closed'));
    } finally {
      if (child.exitCode === null) {
        child.kill();
        await exit;
      }
    }
  },
);
