import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyClaimAgainstEvidence, classifyClaimKind, relevantEvidenceForClaim } from './index.ts';

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

test('semantic CI claims match GitHub workflow evidence without exact subject equality', () => {
  const claim = { id: 'c2', statement: 'All tests pass.', reportedState: 'reported' as const };
  const evidence = [{ id: 'e2', kind: 'github.workflow_run', subject: 'ci:abc123', polarity: 'supports' as const, observedAt: '2026-08-18T13:00:00Z' }];
  assert.equal(classifyClaimKind(claim), 'ci');
  assert.deepEqual(relevantEvidenceForClaim(claim, evidence).map((item) => item.id), ['e2']);
  assert.equal(classifyClaimAgainstEvidence(claim, evidence), 'verified');
});

test('newer contradictory CI evidence defeats stale successful workflow evidence', () => {
  const claim = { id: 'c3', statement: 'The test suite is green.', reportedState: 'reported' as const };
  const evidence = [
    { id: 'old', kind: 'github.workflow_run', subject: 'ci:old111', polarity: 'supports' as const, observedAt: '2026-08-18T12:00:00Z' },
    { id: 'new', kind: 'github.workflow_run', subject: 'ci:new222', polarity: 'contradicts' as const, observedAt: '2026-08-18T14:00:00Z' }
  ];
  assert.equal(classifyClaimAgainstEvidence(claim, evidence), 'contradicted');
});

test('deployment claims use Vercel deployment evidence but not unrelated CI evidence', () => {
  const claim = { id: 'c4', statement: 'The production deployment succeeded.', reportedState: 'reported' as const };
  const evidence = [
    { id: 'ci', kind: 'github.workflow_run', subject: 'ci:abc123', polarity: 'contradicts' as const, observedAt: '2026-08-18T15:00:00Z' },
    { id: 'deploy', kind: 'vercel.deployment', subject: 'deployment:abc123', polarity: 'supports' as const, observedAt: '2026-08-18T14:00:00Z' }
  ];
  assert.equal(classifyClaimKind(claim), 'deployment');
  assert.deepEqual(relevantEvidenceForClaim(claim, evidence).map((item) => item.id), ['deploy']);
  assert.equal(classifyClaimAgainstEvidence(claim, evidence), 'verified');
});
