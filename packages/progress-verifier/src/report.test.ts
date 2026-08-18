import test from 'node:test';
import assert from 'node:assert/strict';
import { extractReportedClaims } from './index.ts';

test('extractReportedClaims converts material status lines into atomic reported claims', () => {
  const claims = extractReportedClaims(`
# Agent report
- All tests pass.
- Vercel preview deployed successfully.
Notes: styling still needs work.
- Database migration applied.
`);

  assert.deepEqual(claims.map((claim) => claim.statement), [
    'All tests pass.',
    'Vercel preview deployed successfully.',
    'Database migration applied.'
  ]);
  assert.ok(claims.every((claim) => claim.reportedState === 'reported'));
  assert.equal(new Set(claims.map((claim) => claim.id)).size, 3);
});

test('extractReportedClaims ignores headings, notes and empty bullets', () => {
  const claims = extractReportedClaims('# Summary\n\n- \nNotes: nothing material\nPlain prose without status syntax');
  assert.deepEqual(claims, []);
});
