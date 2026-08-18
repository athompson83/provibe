import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluateReadiness } from './index.ts';

test('a required unverified control blocks launch readiness', () => {
  const result = evaluateReadiness([{ id: 'ci', label: 'CI green', required: true, state: 'verified' }, { id: 'qa', label: 'Authenticated QA', required: true, state: 'unknown' }]);
  assert.equal(result.verdict, 'blocked');
  assert.equal(result.score, 50);
  assert.deepEqual(result.blockingControlIds, ['qa']);
});
