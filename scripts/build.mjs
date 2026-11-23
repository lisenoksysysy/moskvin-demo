import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = join(projectDirectory, 'dist');
const siteFiles = ['index.html', 'style.css', 'menu-data.js', 'site.js', 'media'];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

for (const file of siteFiles) {
  await cp(join(projectDirectory, file), join(outputDirectory, file), { recursive: true });
}

await writeFile(join(outputDirectory, '.nojekyll'), '');
console.log('MOSKWIN Coffee Shop собран в dist/. Пути к ресурсам относительные.');
