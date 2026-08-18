import { NextResponse } from 'next/server';
import { buildVercelInstallUrl } from '@provibe/provider-vercel';
import { createServerSupabaseClient, getAuthenticatedUserId } from '../../../../../lib/supabase/server';
import { signServerIntegrationState } from '../../../../../lib/integrations/state';
import { requireVercelIntegrationConfig } from '../../../../../lib/vercel/integration';

export async function GET(request: Request) {
  const userId = await getAuthenticatedUserId();
  if (!userId) return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  const projectId = new URL(request.url).searchParams.get('projectId');
  if (!projectId) return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
  const supabase = await createServerSupabaseClient();
  const { data: project } = await supabase.from('projects').select('id,workspace_id').eq('id', projectId).maybeSingle();
  if (!project) return NextResponse.json({ error: 'Project not found or not authorized.' }, { status: 404 });
  const { data: member } = await supabase.from('workspace_members').select('role').eq('workspace_id', project.workspace_id).eq('user_id', userId).maybeSingle();
  if (!member || !['owner','admin'].includes(member.role)) return NextResponse.json({ error: 'Workspace admin permission is required.' }, { status: 403 });
  const config = requireVercelIntegrationConfig();
  const state = signServerIntegrationState({ userId, workspaceId: String(project.workspace_id), projectId, expiresAt: Math.floor(Date.now()/1000)+600 }, config.stateSecret);
  return NextResponse.redirect(buildVercelInstallUrl({ slug: config.slug, state }));
}
