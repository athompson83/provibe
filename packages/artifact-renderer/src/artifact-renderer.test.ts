import assert from 'node:assert/strict';
import test from 'node:test';
import { renderArtifact } from './index.ts';

test('rendered markdown declares canonical revision and generation timestamp', () => {
  const output = renderArtifact({ title: 'MVP Scope', revision: 12, generatedAt: '2026-08-18T12:00:00Z', body: 'Keep the first release narrow.' });
  assert.match(output, /canonical_revision: 12/);
  assert.match(output, /generated_at: 2026-08-18T12:00:00Z/);
  assert.match(output, /# MVP Scope/);
});
