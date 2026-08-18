import { createHmac, timingSafeEqual } from 'node:crypto';

export interface RepositoryRef { owner: string; name: string; defaultBranch: string; }
export interface TreeEntry { path: string; kind: 'file' | 'directory'; sha: string; }
export interface FileBlob { path: string; sha: string; text: string; }
export interface ChangedFile { path: string; status: 'added' | 'modified' | 'removed' | 'renamed'; }
export interface SourceProvider {
  listRepositories(): Promise<RepositoryRef[]>;
  getTree(repository: RepositoryRef, ref: string): Promise<TreeEntry[]>;
  getFile(repository: RepositoryRef, path: string, ref: string): Promise<FileBlob>;
  getChangedFiles(repository: RepositoryRef, base: string, head: string): Promise<ChangedFile[]>;
}

export interface GitHubInstallationUrlInput { appSlug: string; state: string; }
export interface GitHubUserAuthorizationUrlInput { clientId: string; state: string; redirectUri?: string; codeChallenge?: string; }
export interface IntegrationState {
  userId: string;
  workspaceId: string;
  projectId: string;
  installationId?: string;
  expiresAt: number;
}
export interface NormalizedGitHubEvidence {
  installationId: string;
  kind: string;
  subject: string;
  polarity: 'supports' | 'contradicts' | 'neutral';
  pointer: Record<string, unknown>;
  payload: Record<string, unknown>;
  observedAt: string;
}

interface WorkflowRunPayload {
  action?: string;
  installation?: { id?: number | string };
  repository?: { full_name?: string };
  workflow_run?: {
    id?: number | string;
    name?: string;
    head_sha?: string;
    status?: string;
    conclusion?: string | null;
    html_url?: string;
    updated_at?: string;
  };
}

const SHA256_HEX = /^[0-9a-f]{64}$/i;
function stateMac(payload: string, secret: string): string { return createHmac('sha256', secret).update(payload, 'utf8').digest('hex'); }
function safeEqualHex(supplied: string, expected: string): boolean {
  if (!SHA256_HEX.test(supplied) || !SHA256_HEX.test(expected)) return false;
  return timingSafeEqual(Buffer.from(supplied, 'hex'), Buffer.from(expected, 'hex'));
}

export function signIntegrationState(state: IntegrationState, secret: string): string {
  if (!secret) throw new Error('Integration state secret is required.');
  const payload = Buffer.from(JSON.stringify(state), 'utf8').toString('base64url');
  return `${payload}.${stateMac(payload, secret)}`;
}

export function verifyIntegrationState(token: string, secret: string, nowEpochSeconds = Math.floor(Date.now() / 1000)): IntegrationState | null {
  if (!secret) return null;
  const [payload, suppliedMac, extra] = token.split('.');
  if (!payload || !suppliedMac || extra || !safeEqualHex(suppliedMac, stateMac(payload, secret))) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Partial<IntegrationState>;
    if (typeof parsed.userId !== 'string' || typeof parsed.workspaceId !== 'string' || typeof parsed.projectId !== 'string' || typeof parsed.expiresAt !== 'number') return null;
    if (parsed.expiresAt <= nowEpochSeconds || (parsed.installationId !== undefined && typeof parsed.installationId !== 'string')) return null;
    return { userId: parsed.userId, workspaceId: parsed.workspaceId, projectId: parsed.projectId, ...(parsed.installationId === undefined ? {} : { installationId: parsed.installationId }), expiresAt: parsed.expiresAt };
  } catch { return null; }
}

export function buildInstallationUrl(input: GitHubInstallationUrlInput): string {
  return `https://github.com/apps/${encodeURIComponent(input.appSlug)}/installations/new?state=${encodeURIComponent(input.state)}`;
}

export function buildGitHubUserAuthorizationUrl(input: GitHubUserAuthorizationUrlInput): string {
  const params = new URLSearchParams({ client_id: input.clientId, state: input.state });
  if (input.redirectUri) params.set('redirect_uri', input.redirectUri);
  if (input.codeChallenge) { params.set('code_challenge', input.codeChallenge); params.set('code_challenge_method', 'S256'); }
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export function verifyGitHubWebhookSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature?.startsWith('sha256=') || secret.length === 0) return false;
  return safeEqualHex(signature.slice('sha256='.length), createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex'));
}

export function normalizeGitHubWebhook(eventName: string, rawPayload: unknown): NormalizedGitHubEvidence {
  if (eventName !== 'workflow_run') throw new Error(`Unsupported GitHub webhook event: ${eventName}`);
  const payload = rawPayload as WorkflowRunPayload;
  const run = payload.workflow_run;
  const installationId = payload.installation?.id;
  if (!run?.id || !run.head_sha || !installationId) throw new Error('GitHub workflow_run payload is missing required evidence fields.');
  const conclusion = run.conclusion ?? 'unknown';
  const polarity: NormalizedGitHubEvidence['polarity'] = run.status !== 'completed' ? 'neutral' : conclusion === 'success' ? 'supports' : 'contradicts';
  return {
    installationId: String(installationId), kind: 'github.workflow_run', subject: `ci:${run.head_sha}`, polarity,
    pointer: { repository: payload.repository?.full_name ?? null, workflowRunId: String(run.id), url: run.html_url ?? null },
    payload: { action: payload.action ?? null, workflow: run.name ?? null, status: run.status ?? null, conclusion, commitSha: run.head_sha },
    observedAt: run.updated_at ?? new Date().toISOString()
  };
}
