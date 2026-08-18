import assert from 'node:assert/strict';
import test from 'node:test';
import { verifyProgressClaim } from './index.ts';

test('blocked prerequisites produce blocked even without contradictory evidence', () => {
  const result = verifyProgressClaim({ claim: { id: 'c1', statement: 'Ready for beta', reportedState: 'reported' }, evidence: [], blockers: ['Authenticated QA not completed'], acceptedRisk: false });
  assert.equal(result.state, 'blocked');
  assert.deepEqual(result.reasons, ['Authenticated QA not completed']);
});

test('owner accepted risk remains explicit rather than silently verified', () => {
  const result = verifyProgressClaim({ claim: { id: 'c1', statement: 'Ship without Sentry', reportedState: 'reported' }, evidence: [], blockers: [], acceptedRisk: true });
  assert.equal(result.state, 'accepted_risk');
});
