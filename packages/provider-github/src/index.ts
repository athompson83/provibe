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

export interface GitHubInstallationUrlInput {
  appSlug: string;
  state: string;
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

export function buildInstallationUrl(input: GitHubInstallationUrlInput): string {
  const slug = encodeURIComponent(input.appSlug);
  const state = encodeURIComponent(input.state);
  return `https://github.com/apps/${slug}/installations/new?state=${state}`;
}

export function verifyGitHubWebhookSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature?.startsWith('sha256=') || secret.length === 0) return false;
  const supplied = signature.slice('sha256='.length);
  const expected = createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');
  const suppliedBuffer = Buffer.from(supplied, 'hex');
  const expectedBuffer = Buffer.from(expected, 'hex');
  return suppliedBuffer.length === expectedBuffer.length && timingSafeEqual(suppliedBuffer, expectedBuffer);
}

export function normalizeGitHubWebhook(eventName: string, rawPayload: unknown): NormalizedGitHubEvidence {
  if (eventName !== 'workflow_run') throw new Error(`Unsupported GitHub webhook event: ${eventName}`);
  const payload = rawPayload as WorkflowRunPayload;
  const run = payload.workflow_run;
  const installationId = payload.installation?.id;
  if (!run?.id || !run.head_sha || !installationId) throw new Error('GitHub workflow_run payload is missing required evidence fields.');

  const conclusion = run.conclusion ?? 'unknown';
  const polarity: NormalizedGitHubEvidence['polarity'] =
    run.status !== 'completed' ? 'neutral' : conclusion === 'success' ? 'supports' : 'contradicts';

  return {
    installationId: String(installationId),
    kind: 'github.workflow_run',
    subject: `ci:${run.head_sha}`,
    polarity,
    pointer: {
      repository: payload.repository?.full_name ?? null,
      workflowRunId: String(run.id),
      url: run.html_url ?? null
    },
    payload: {
      action: payload.action ?? null,
      workflow: run.name ?? null,
      status: run.status ?? null,
      conclusion,
      commitSha: run.head_sha
    },
    observedAt: run.updated_at ?? new Date().toISOString()
  };
}
