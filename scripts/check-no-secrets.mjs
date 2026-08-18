import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const ignored = new Set(['.git', 'node_modules', '.next', '.turbo']);
const suspicious = [
  /sb_secret_[A-Za-z0-9_-]{12,}/,
  /sk-proj-[A-Za-z0-9_-]{12,}/,
  /gh[pousr]_[A-Za-z0-9]{20,}/,
  /SUPABASE_SERVICE_ROLE_KEY\s*=\s*[^\s#]+/
];
const hits = [];

async function walk(root) {
  for (const entry of await readdir(root, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const path = join(root, entry.name);
    if (entry.isDirectory()) await walk(path);
    else {
      const data = await readFile(path).catch(() => null);
      if (!data || data.includes(0)) continue;
      const text = data.toString('utf8');
      if (suspicious.some((pattern) => pattern.test(text))) hits.push(path);
    }
  }
}

await walk('.');
if (hits.length > 0) {
  console.error(`Potential committed secret material detected in: ${hits.join(', ')}`);
  process.exit(1);
}
console.log('No obvious committed secret values detected.');
