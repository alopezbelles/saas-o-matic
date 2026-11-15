import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

function markdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory()
      ? markdownFiles(file)
      : file.endsWith('.md')
        ? [file]
        : [];
  });
}

test('los documentos y el índice enlazan archivos locales existentes', () => {
  const files = [
    'README.md',
    'AGENTS.md',
    'MEMORY.md',
    ...markdownFiles('docs'),
    ...markdownFiles('specs'),
    ...markdownFiles('ai-workspace'),
  ];
  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    for (const [, target] of content.matchAll(/\]\(([^)]+)\)/g)) {
      if (/^(?:https?:|mailto:|#)/.test(target)) continue;
      const destination = decodeURIComponent(target.split('#')[0]);
      assert.ok(
        existsSync(path.resolve(path.dirname(file), destination)),
        `${file}: enlace inexistente ${target}`,
      );
    }
  }
});

test('el contexto identifica la spec activa y los comandos documentados existen', () => {
  const memory = readFileSync('MEMORY.md', 'utf8');
  const activeSpec = memory.match(
    /^- Spec activa: \[006-currency\]\((specs\/006-currency\/spec\.md)\)/m,
  );
  assert.ok(activeSpec, 'MEMORY debe identificar 006 como spec activa');
  assert.ok(existsSync(activeSpec[1]), 'la spec activa debe existir');
  assert.match(readFileSync('AGENTS.md', 'utf8'), /MEMORY\.md/);
  assert.match(
    readFileSync('ai-workspace/README.md', 'utf8'),
    /validation\.md/,
  );
  const { scripts, packageManager } = JSON.parse(
    readFileSync('package.json', 'utf8'),
  );
  assert.equal(packageManager, 'pnpm@10.33.4');
  const commands = [
    'dev',
    'dev:web',
    'dev:api',
    'start:api',
    'lint',
    'typecheck',
    'format:check',
    'build',
    'test',
    'test:integration',
    'test:unit',
    'test:web',
    'test:gates',
    'test:docs',
    'db:generate',
    'db:migrate',
    'db:demo:init',
    'db:seed',
    'db:backup',
  ];
  for (const command of commands) assert.ok(scripts[command], command);
});
