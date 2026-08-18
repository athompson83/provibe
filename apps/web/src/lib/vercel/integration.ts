import 'server-only';

export interface VercelIntegrationConfig {
  slug: string;
  clientId: string;
  clientSecret: string;
  stateSecret: string;
  callbackUrl: string;
}

export interface VercelProjectResource {
  id: string;
  name: string;
  framework: string | null;
  latestDeploymentUrl: string | null;
}

export interface VercelTokenResult {
  accessToken: string;
  teamId: string | null;
}

export function requireVercelIntegrationConfig(): VercelIntegrationConfig {
  const slug = process.env.VERCEL_INTEGRATION_SLUG;
  const clientId = process.env.VERCEL_CLIENT_ID;
  const clientSecret = process.env.VERCEL_CLIENT_SECRET;
  const stateSecret = process.env.VERCEL_STATE_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (!slug || !clientId || !clientSecret || !stateSecret || !siteUrl) throw new Error('Vercel integration configuration is incomplete.');
  return { slug, clientId, clientSecret, stateSecret, callbackUrl: `${siteUrl}/api/integrations/vercel/callback` };
}

export async function exchangeVercelCode(code: string, config: VercelIntegrationConfig): Promise<VercelTokenResult> {
  const body = new URLSearchParams({ client_id: config.clientId, client_secret: config.clientSecret, code, redirect_uri: config.callbackUrl });
  const response = await fetch('https://api.vercel.com/v2/oauth/access_token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body, cache: 'no-store' });
  if (!response.ok) throw new Error(`Vercel OAuth exchange failed with HTTP ${response.status}.`);
  const payload = await response.json() as { access_token?: string; team_id?: string | null; error?: { message?: string } };
  if (!payload.access_token) throw new Error(payload.error?.message ?? 'Vercel OAuth exchange returned no access token.');
  return { accessToken: payload.access_token, teamId: payload.team_id ?? null };
}

export async function listVercelProjects(accessToken: string, teamId: string | null): Promise<VercelProjectResource[]> {
  const projects: VercelProjectResource[] = [];
  let until: string | null = null;
  for (let page = 0; page < 10; page += 1) {
    const params = new URLSearchParams({ limit: '100' });
    if (teamId) params.set('teamId', teamId);
    if (until) params.set('until', until);
    const response = await fetch(`https://api.vercel.com/v9/projects?${params.toString()}`, { headers: { Authorization: `Bearer ${accessToken}` }, cache: 'no-store' });
    if (!response.ok) throw new Error(`Vercel projects request failed with HTTP ${response.status}.`);
    const data = await response.json() as { projects?: Array<{ id: string; name: string; framework?: string | null; latestDeployments?: Array<{ url?: string }> }>; pagination?: { next?: number | null } };
    projects.push(...(data.projects ?? []).map((project) => ({ id: project.id, name: project.name, framework: project.framework ?? null, latestDeploymentUrl: project.latestDeployments?.[0]?.url ?? null })));
    if (!data.pagination?.next) break;
    until = String(data.pagination.next);
  }
  return projects;
}

export function safeVercelNextUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (url.hostname === 'vercel.com' || url.hostname.endsWith('.vercel.com')) ? url.toString() : null;
  } catch { return null; }
}
