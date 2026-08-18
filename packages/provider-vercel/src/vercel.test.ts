import test from 'node:test';
import assert from 'node:assert/strict';
import { reconcileDeploymentState } from './index.ts';

test('reconcileDeploymentState verifies production when deployment SHA matches expected SHA and is ready', () => {
  const result = reconcileDeploymentState({
    expectedSha: 'abc123',
    deployment: { id: 'dpl_1', url: 'example.vercel.app', state: 'ready', commitSha: 'abc123', createdAt: '2026-08-18T17:00:00Z' }
  });
  assert.deepEqual(result, { state: 'verified', reason: 'Ready deployment matches the expected commit SHA.' });
});

test('reconcileDeploymentState contradicts a claim when ready production points at a different SHA', () => {
  const result = reconcileDeploymentState({
    expectedSha: 'abc123',
    deployment: { id: 'dpl_2', url: 'example.vercel.app', state: 'ready', commitSha: 'old999', createdAt: '2026-08-18T17:00:00Z' }
  });
  assert.deepEqual(result, { state: 'contradicted', reason: 'Ready deployment points at a different commit SHA.' });
});

test('reconcileDeploymentState keeps building deployment as observed rather than verified', () => {
  const result = reconcileDeploymentState({
    expectedSha: 'abc123',
    deployment: { id: 'dpl_3', url: 'example.vercel.app', state: 'building', commitSha: 'abc123', createdAt: '2026-08-18T17:00:00Z' }
  });
  assert.deepEqual(result, { state: 'observed', reason: 'Matching deployment exists but is not ready.' });
});
