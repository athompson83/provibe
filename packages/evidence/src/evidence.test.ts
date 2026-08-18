import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyClaimAgainstEvidence } from './index.ts';

test('verified requires supporting observed evidence', () => {
  const result = classifyClaimAgainstEvidence(
    { id: 'c1', statement: 'CI passes', reportedState: 'reported' },
    [{ id: 'e1', kind: 'github_check', subject: 'CI passes', polarity: 'supports', observedAt: '2026-08-18T12:00:00Z' }]
  );
  assert.equal(result, 'verified');
});

test('contradicting observed evidence wins over an agent report', () => {
  const result = classifyClaimAgainstEvidence(
    { id: 'c1', statement: 'CI passes', reportedState: 'reported' },
    [{ id: 'e1', kind: 'github_check', subject: 'CI passes', polarity: 'contradicts', observedAt: '2026-08-18T12:00:00Z' }]
  );
  assert.equal(result, 'contradicted');
});

test('absence of evidence remains unknown', () => {
  assert.equal(classifyClaimAgainstEvidence({ id: 'c1', statement: 'Migration applied', reportedState: 'reported' }, []), 'unknown');
});
