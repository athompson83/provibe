import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyIntegrationState } from '@provibe/provider-github';
import { createServerSupabaseClient, getAuthenticatedUserId } from '../../../../../../lib/supabase/server';
import { exchangeGitHubUserCode, listInstallationRepositories, requireGitHubIntegrationConfig, verifyUserInstallation } from '../../../../../../lib/github/integration';

const PKCE_COOKIE = '__Host-provibe-github-pkce';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const incomingState = url.searchParams.get('state');
  const config = requireGitHubIntegrationConfig();
  const state = incomingState ? verifyIntegrationState(incomingState, config.stateSecret) : null;
  const userId = await getAuthenticatedUserId();
  const cookieStore = await cookies();
  const verifier = cookieStore.get(PKCE_COOKIE)?.value;
  if (!code || !state?.installationId || !userId || state.userId !== userId || !verifier) return NextResponse.json({ error: 'GitHub authorization callback is invalid or expired.' }, { status: 400 });

  let userAccessToken: string | null = null;
  try {
    userAccessToken = await exchangeGitHubUserCode(code, verifier, config);
    if (!(await verifyUserInstallation(userAccessToken, state.installationId))) return NextResponse.json({ error: 'GitHub installation is not accessible to the authorizing user.' }, { status: 403 });
    const repositories = await listInstallationRepositories(userAccessToken, state.installationId);
    const supabase = await createServerSupabaseClient();
    const { data: connection, error: connectionError } = await supabase.from('provider_connections').upsert({ workspace_id: state.workspaceId, project_id: state.projectId, provider: 'github', external_account_id: state.installationId, state: 'connected' }, { onConflict: 'workspace_id,project_id,provider,external_account_id' }).select('id').single();
    if (connectionError || !connection) throw new Error(connectionError?.message ?? 'Failed to save GitHub connection.');

    if (repositories.length > 0) {
      const rows = repositories.map((repo) => ({ workspace_id: state.workspaceId, project_id: state.projectId, connection_id: connection.id, provider: 'github', resource_type: 'repository', external_id: String(repo.id), display_name: repo.fullName, metadata: { private: repo.private, defaultBranch: repo.defaultBranch, owner: repo.owner }, selected: repositories.length === 1, observed_at: new Date().toISOString() }));
      const { error: resourceError } = await supabase.from('provider_resources').upsert(rows, { onConflict: 'project_id,provider,resource_type,external_id' });
      if (resourceError) throw new Error(resourceError.message);
    }

    const response = NextResponse.redirect(new URL(`/projects/${state.projectId}/integrations/github?connected=1`, request.url));
    response.cookies.delete(PKCE_COOKIE);
    return response;
  } finally {
    userAccessToken = null;
  }
}
