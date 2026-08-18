import { readdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const roots = ['schemas', 'templates', '.'];
const ignored = new Set(['node_modules', '.git', '.next', '.turbo']);
const files = [];

async function walk(root) {
  for (const entry of await readdir(root, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const path = join(root, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (extname(entry.name) === '.json') files.push(path);
  }
}

for (const root of roots) {
  try { await walk(root); } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

const uniqueFiles = [...new Set(files)];
for (const file of uniqueFiles) JSON.parse(await readFile(file, 'utf8'));
console.log(`Validated ${uniqueFiles.length} JSON files.`);
