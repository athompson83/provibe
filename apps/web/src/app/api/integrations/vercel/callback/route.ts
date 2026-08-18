import { NextResponse } from 'next/server';
import { createServerSupabaseClient, getAuthenticatedUserId } from '../../../../../lib/supabase/server';
import { createSupabaseAdminClient } from '../../../../../lib/supabase/admin';
import { verifyServerIntegrationState } from '../../../../../lib/integrations/state';
import { exchangeVercelCode, listVercelProjects, requireVercelIntegrationConfig, safeVercelNextUrl } from '../../../../../lib/vercel/integration';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const configurationId = url.searchParams.get('configurationId');
  const incomingState = url.searchParams.get('state');
  const callbackTeamId = url.searchParams.get('teamId');
  const config = requireVercelIntegrationConfig();
  const state = incomingState ? verifyServerIntegrationState(incomingState, config.stateSecret) : null;
  const userId = await getAuthenticatedUserId();
  if (!code || !configurationId || !state || !userId || state.userId !== userId) return NextResponse.json({ error: 'Untrusted or expired Vercel installation callback.' }, { status: 400 });

  const tokenResult = await exchangeVercelCode(code, config);
  const teamId = tokenResult.teamId ?? callbackTeamId;
  const projects = await listVercelProjects(tokenResult.accessToken, teamId);
  const supabase = await createServerSupabaseClient();
  const { data: connection, error: connectionError } = await supabase.from('provider_connections').upsert({ workspace_id: state.workspaceId, project_id: state.projectId, provider: 'vercel', external_account_id: configurationId, state: 'connected' }, { onConflict: 'workspace_id,project_id,provider,external_account_id' }).select('id').single();
  if (connectionError || !connection) return NextResponse.json({ error: connectionError?.message ?? 'Could not save Vercel connection.' }, { status: 500 });

  const admin = createSupabaseAdminClient();
  const { error: vaultError } = await admin.rpc('attach_provider_credential', { target_connection_id: connection.id, plaintext_secret: tokenResult.accessToken });
  if (vaultError) return NextResponse.json({ error: 'Could not secure Vercel credential.' }, { status: 500 });
  if (projects.length > 0) {
    const rows = projects.map((project) => ({ workspace_id: state.workspaceId, project_id: state.projectId, connection_id: connection.id, provider: 'vercel', resource_type: 'project', external_id: project.id, display_name: project.name, metadata: { framework: project.framework, latestDeploymentUrl: project.latestDeploymentUrl, teamId }, selected: projects.length === 1, observed_at: new Date().toISOString() }));
    const { error } = await supabase.from('provider_resources').upsert(rows, { onConflict: 'project_id,provider,resource_type,external_id' });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const next = safeVercelNextUrl(url.searchParams.get('next'));
  return NextResponse.redirect(next ?? new URL(`/projects/${state.projectId}/integrations/vercel?connected=1`, request.url));
}
