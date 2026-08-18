import assert from 'node:assert/strict';
import test from 'node:test';
import { selectNextQuestion } from './index.ts';

test('adaptive intake selects the highest-priority unanswered eligible question', () => {
  const next = selectNextQuestion([
    { id: 'buyer', priority: 100, question: 'Who pays for this?' },
    { id: 'native', priority: 70, question: 'Is native mobile required?', requiresAnswer: { questionId: 'platform', equals: 'mobile' } },
    { id: 'platform', priority: 90, question: 'Which platform?' }
  ], { platform: 'web' });
  assert.equal(next?.id, 'buyer');
});
