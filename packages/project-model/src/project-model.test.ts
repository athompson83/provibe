import assert from 'node:assert/strict';
import test from 'node:test';
import { applyProjectDecision, createProjectModel } from './index.ts';

test('applying a decision increments the canonical revision and invalidates dependent artifacts', () => {
  const model = createProjectModel({ id: 'p1', name: 'Demo', revision: 3 });
  model.artifacts = [
    { id: 'prd', kind: 'prd', renderedFromRevision: 3, dependencies: ['scope'], stale: false },
    { id: 'design', kind: 'design-system', renderedFromRevision: 3, dependencies: ['design'], stale: false }
  ];
  const next = applyProjectDecision(model, { id: 'd1', area: 'scope', summary: 'Remove native mobile from MVP', decidedAt: '2026-08-18T12:00:00Z' });
  assert.equal(next.revision, 4);
  assert.equal(next.decisions.length, 1);
  assert.equal(next.artifacts.find((artifact) => artifact.id === 'prd')?.stale, true);
  assert.equal(next.artifacts.find((artifact) => artifact.id === 'design')?.stale, false);
});
