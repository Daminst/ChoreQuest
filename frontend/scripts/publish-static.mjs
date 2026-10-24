import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export async function publishStatic({ sourceDir, targetDir }) {
  await rm(targetDir, { recursive: true, force: true });
  await mkdir(targetDir, { recursive: true });
  await cp(sourceDir, targetDir, { recursive: true, force: true });
}

const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === resolve(scriptPath)) {
  const frontendDir = resolve(dirname(scriptPath), '..');
  await publishStatic({
    sourceDir: resolve(frontendDir, 'dist'),
    targetDir: resolve(frontendDir, '..', 'static'),
  });
}
