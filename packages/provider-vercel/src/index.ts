export interface DeploymentSummary { id: string; url: string; state: 'queued' | 'building' | 'ready' | 'error' | 'canceled'; commitSha?: string; createdAt: string; }
export interface DeploymentLog { timestamp: string; level: 'info' | 'warning' | 'error'; message: string; }
export interface DeploymentProvider {
  listDeployments(projectId: string): Promise<DeploymentSummary[]>;
  getLogs(deploymentId: string): Promise<DeploymentLog[]>;
  listEnvironmentKeyNames(projectId: string): Promise<string[]>;
}

export interface DeploymentReconciliationInput {
  expectedSha: string;
  deployment: DeploymentSummary | null;
}

export interface DeploymentReconciliationResult {
  state: 'verified' | 'contradicted' | 'observed' | 'unknown';
  reason: string;
}

export function reconcileDeploymentState(input: DeploymentReconciliationInput): DeploymentReconciliationResult {
  const deployment = input.deployment;
  if (!deployment) return { state: 'unknown', reason: 'No deployment evidence is currently available.' };
  if (!deployment.commitSha) return { state: 'observed', reason: 'Deployment exists but its commit SHA is unavailable.' };
  if (deployment.state === 'ready' && deployment.commitSha !== input.expectedSha) {
    return { state: 'contradicted', reason: 'Ready deployment points at a different commit SHA.' };
  }
  if (deployment.commitSha === input.expectedSha && deployment.state === 'ready') {
    return { state: 'verified', reason: 'Ready deployment matches the expected commit SHA.' };
  }
  if (deployment.commitSha === input.expectedSha) {
    return { state: 'observed', reason: 'Matching deployment exists but is not ready.' };
  }
  return { state: 'unknown', reason: 'Available deployment evidence does not prove the expected commit is live.' };
}
