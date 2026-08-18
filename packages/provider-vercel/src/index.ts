import { createHmac, timingSafeEqual } from 'node:crypto';

export interface DeploymentSummary { id: string; url: string; state: 'queued' | 'building' | 'ready' | 'error' | 'canceled'; commitSha?: string; createdAt: string; }
export interface DeploymentLog { timestamp: string; level: 'info' | 'warning' | 'error'; message: string; }
export interface DeploymentProvider {
  listDeployments(projectId: string): Promise<DeploymentSummary[]>;
  getLogs(deploymentId: string): Promise<DeploymentLog[]>;
  listEnvironmentKeyNames(projectId: string): Promise<string[]>;
}
export interface DeploymentReconciliationInput { expectedSha: string; deployment: DeploymentSummary | null; }
export interface DeploymentReconciliationResult { state: 'verified' | 'contradicted' | 'observed' | 'unknown'; reason: string; }
export interface NormalizedVercelEvidence {
  projectId: string;
  kind: 'vercel.deployment';
  subject: string;
  polarity: 'supports' | 'contradicts' | 'neutral';
  pointer: Record<string, unknown>;
  payload: Record<string, unknown>;
  observedAt: string;
}

const SHA1_HEX = /^[0-9a-f]{40}$/i;

export function buildVercelInstallUrl(input: { slug: string; state: string }): string {
  const params = new URLSearchParams({ state: input.state });
  return `https://vercel.com/integrations/${encodeURIComponent(input.slug)}/new?${params.toString()}`;
}

export function verifyVercelWebhookSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature || !SHA1_HEX.test(signature) || !secret) return false;
  const expected = createHmac('sha1', secret).update(rawBody, 'utf8').digest('hex');
  return timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'));
}

export function normalizeVercelWebhook(raw: unknown): NormalizedVercelEvidence {
  const event = raw as {
    type?: string;
    createdAt?: number | string;
    payload?: {
      project?: { id?: string; name?: string };
      team?: { id?: string };
      deployment?: { id?: string; url?: string; meta?: Record<string, unknown> };
    };
  };
  if (event.type !== 'deployment.succeeded' && event.type !== 'deployment.error' && event.type !== 'deployment.canceled' && event.type !== 'deployment.created') {
    throw new Error(`Unsupported Vercel webhook event: ${event.type ?? 'unknown'}`);
  }
  const projectId = event.payload?.project?.id;
  const deployment = event.payload?.deployment;
  if (!projectId || !deployment?.id) throw new Error('Vercel deployment payload is missing required evidence fields.');
  const commitSha = typeof deployment.meta?.githubCommitSha === 'string' ? deployment.meta.githubCommitSha : null;
  const subject = commitSha ? `deployment:${commitSha}` : `deployment-id:${deployment.id}`;
  const polarity: NormalizedVercelEvidence['polarity'] = event.type === 'deployment.succeeded' ? 'supports' : event.type === 'deployment.error' || event.type === 'deployment.canceled' ? 'contradicts' : 'neutral';
  const created = typeof event.createdAt === 'number' ? new Date(event.createdAt).toISOString() : typeof event.createdAt === 'string' ? new Date(event.createdAt).toISOString() : new Date().toISOString();
  return {
    projectId,
    kind: 'vercel.deployment',
    subject,
    polarity,
    pointer: { deploymentId: deployment.id, url: deployment.url ?? null, projectId, teamId: event.payload?.team?.id ?? null },
    payload: { eventType: event.type, projectName: event.payload?.project?.name ?? null, commitSha, deploymentUrl: deployment.url ?? null },
    observedAt: created
  };
}

export function reconcileDeploymentState(input: DeploymentReconciliationInput): DeploymentReconciliationResult {
  const deployment = input.deployment;
  if (!deployment) return { state: 'unknown', reason: 'No deployment evidence is currently available.' };
  if (!deployment.commitSha) return { state: 'observed', reason: 'Deployment exists but its commit SHA is unavailable.' };
  if (deployment.state === 'ready' && deployment.commitSha !== input.expectedSha) return { state: 'contradicted', reason: 'Ready deployment points at a different commit SHA.' };
  if (deployment.commitSha === input.expectedSha && deployment.state === 'ready') return { state: 'verified', reason: 'Ready deployment matches the expected commit SHA.' };
  if (deployment.commitSha === input.expectedSha) return { state: 'observed', reason: 'Matching deployment exists but is not ready.' };
  return { state: 'unknown', reason: 'Available deployment evidence does not prove the expected commit is live.' };
}
