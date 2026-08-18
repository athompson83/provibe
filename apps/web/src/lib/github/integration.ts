import 'server-only';
import { createHash, randomBytes } from 'node:crypto';

const API_VERSION = '2026-03-10';

export interface GitHubIntegrationConfig {
  appSlug: string;
  clientId: string;
  clientSecret: string;
  stateSecret: string;
  callbackUrl: string;
  webhookSecret: string;
}

export interface GitHubInstallationRepository {
  id: number;
  fullName: string;
  private: boolean;
  defaultBranch: string;
  owner: string;
}

export function requireGitHubIntegrationConfig(): GitHubIntegrationConfig {
  const appSlug = process.env.GITHUB_APP_SLUG;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const stateSecret = process.env.GITHUB_STATE_SECRET;
  const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (!appSlug || !clientId || !clientSecret || !stateSecret || !webhookSecret || !siteUrl) throw new Error('GitHub App integration configuration is incomplete.');
  return { appSlug, clientId, clientSecret, stateSecret, webhookSecret, callbackUrl: `${siteUrl}/api/integrations/github/oauth/callback` };
}

export function createPkcePair(): { verifier: string; challenge: string } {
  const verifier = randomBytes(48).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  return { verifier, challenge };
}

export async function exchangeGitHubUserCode(code: string, verifier: string, config: GitHubIntegrationConfig): Promise<string> {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: config.clientId, client_secret: config.clientSecret, code, redirect_uri: config.callbackUrl, code_verifier: verifier }),
    cache: 'no-store'
  });
  if (!response.ok) throw new Error(`GitHub OAuth exchange failed with HTTP ${response.status}.`);
  const payload = await response.json() as { access_token?: string; error?: string };
  if (!payload.access_token) throw new Error(`GitHub OAuth exchange failed: ${payload.error ?? 'missing access token'}.`);
  return payload.access_token;
}

async function githubUserApi<T>(accessToken: string, path: string): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${accessToken}`, 'X-GitHub-Api-Version': API_VERSION },
    cache: 'no-store'
  });
  if (!response.ok) throw new Error(`GitHub API ${path} failed with HTTP ${response.status}.`);
  return response.json() as Promise<T>;
}

export async function verifyUserInstallation(accessToken: string, installationId: string): Promise<boolean> {
  for (let page = 1; page <= 10; page += 1) {
    const data = await githubUserApi<{ total_count: number; installations: Array<{ id: number }> }>(accessToken, `/user/installations?per_page=100&page=${page}`);
    if (data.installations.some((installation) => String(installation.id) === installationId)) return true;
    if (page * 100 >= data.total_count) return false;
  }
  return false;
}

export async function listInstallationRepositories(accessToken: string, installationId: string): Promise<GitHubInstallationRepository[]> {
  const resources: GitHubInstallationRepository[] = [];
  for (let page = 1; page <= 10; page += 1) {
    const data = await githubUserApi<{ total_count: number; repositories: Array<{ id: number; full_name: string; private: boolean; default_branch: string; owner: { login: string } }> }>(accessToken, `/user/installations/${encodeURIComponent(installationId)}/repositories?per_page=100&page=${page}`);
    resources.push(...data.repositories.map((repo) => ({ id: repo.id, fullName: repo.full_name, private: repo.private, defaultBranch: repo.default_branch, owner: repo.owner.login })));
    if (page * 100 >= data.total_count) break;
  }
  return resources;
}
