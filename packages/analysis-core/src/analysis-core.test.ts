import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyPath, extractEnvironmentKeys } from './index.ts';

test('classifies common Next.js application paths deterministically', () => {
  assert.equal(classifyPath('src/app/api/users/route.ts'), 'route');
  assert.equal(classifyPath('src/app/settings/page.tsx'), 'page');
  assert.equal(classifyPath('src/components/button.tsx'), 'component');
  assert.equal(classifyPath('supabase/migrations/001.sql'), 'migration');
});

test('extracts environment variable names without reading secret values', () => {
  const keys = extractEnvironmentKeys('const url = process.env.SUPABASE_URL; const key = process.env["STRIPE_SECRET_KEY"];');
  assert.deepEqual(keys, ['STRIPE_SECRET_KEY', 'SUPABASE_URL']);
});
