import assert from 'node:assert/strict';
import test from 'node:test';
import { estimateDeliveryRange } from './index.ts';

test('returns transparent optimistic, likely, and contingency ranges', () => {
  assert.deepEqual(estimateDeliveryRange({ baselineWeeks: 4, riskPoints: 2, unknownPoints: 1 }), {
    optimisticWeeks: 4,
    likelyWeeks: 6,
    contingencyWeeks: 9,
    confidence: 'moderate'
  });
});
