import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { publishStatic } from './publish-static.mjs';

test('publisher replaces stale static files with the exact dist tree', async () => {
  const root = await mkdtemp(join(tmpdir(), 'chorequest-static-'));
  const sourceDir = join(root, 'dist');
  const targetDir = join(root, 'static');
  await mkdir(join(sourceDir, 'assets'), { recursive: true });
  await mkdir(targetDir, { recursive: true });
  await writeFile(join(sourceDir, 'index.html'), '<script src="/assets/new.js"></script>');
  await writeFile(join(sourceDir, 'assets', 'new.js'), 'new-build');
  await writeFile(join(targetDir, 'stale.js'), 'stale-build');
  await publishStatic({ sourceDir, targetDir });
  assert.equal(await readFile(join(targetDir, 'assets', 'new.js'), 'utf8'), 'new-build');
  await assert.rejects(readFile(join(targetDir, 'stale.js'), 'utf8'));
});
