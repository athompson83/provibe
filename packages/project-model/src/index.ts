import type { CanonicalProjectModel, ProjectDecision } from '../../contracts/src/index.ts';

export function createProjectModel(input: Pick<CanonicalProjectModel, 'id' | 'name' | 'revision'>): CanonicalProjectModel {
  return { ...input, decisions: [], artifacts: [] };
}

export function applyProjectDecision(model: CanonicalProjectModel, decision: ProjectDecision): CanonicalProjectModel {
  const revision = model.revision + 1;
  return {
    ...model,
    revision,
    decisions: [...model.decisions, decision],
    artifacts: model.artifacts.map((artifact) => ({ ...artifact, stale: artifact.stale || artifact.dependencies.includes(decision.area) }))
  };
}
