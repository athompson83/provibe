export interface DeploymentSummary { id: string; url: string; state: 'queued' | 'building' | 'ready' | 'error' | 'canceled'; commitSha?: string; createdAt: string; }
export interface DeploymentLog { timestamp: string; level: 'info' | 'warning' | 'error'; message: string; }
export interface DeploymentProvider {
  listDeployments(projectId: string): Promise<DeploymentSummary[]>;
  getLogs(deploymentId: string): Promise<DeploymentLog[]>;
  listEnvironmentKeyNames(projectId: string): Promise<string[]>;
}
