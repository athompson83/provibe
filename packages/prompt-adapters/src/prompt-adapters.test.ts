import assert from 'node:assert/strict';
import test from 'node:test';
import { createTaskPrompt } from './index.ts';

test('task prompt keeps objective, evidence, boundaries, and verification structured', () => {
  const prompt = createTaskPrompt({ tool: 'codex', objective: 'Verify authenticated billing QA', evidence: ['CI green at a83f9c1'], constraints: ['Do not change production data'], acceptanceCriteria: ['Authenticated billing flow is exercised'], verification: ['Provide browser evidence and exact commit SHA'] });
  assert.equal(prompt.schema_version, '1.0');
  assert.equal(prompt.tool, 'codex');
  assert.deepEqual(prompt.evidence, ['CI green at a83f9c1']);
});
