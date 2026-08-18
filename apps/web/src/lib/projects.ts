import 'server-only';
import { createServerSupabaseClient, getAuthenticatedUserId } from './supabase/server';

export interface CreateProjectInput {
  workspaceName: string;
  workspaceSlug: string;
  projectName: string;
  projectSlug: string;
}

export interface CreatedProject {
  workspaceId: string;
  projectId: string;
  revision: number;
}

export async function createWorkspaceProject(input: CreateProjectInput): Promise<CreatedProject> {
  const userId = await getAuthenticatedUserId();
  if (!userId) throw new Error('Authentication required.');

  const supabase = await createServerSupabaseClient();
  const initialModel = {
    name: input.projectName,
    decisions: [],
    artifacts: [],
    product: { problem: '', targetUser: '', valueProposition: '', primaryOutcome: '' },
    scope: { mvp: [], exclusions: [], later: [] },
    integrations: [],
    risks: [],
    acceptanceCriteria: []
  };

  const { data, error } = await supabase.rpc('create_workspace_with_project', {
    workspace_name: input.workspaceName,
    workspace_slug: input.workspaceSlug,
    project_name: input.projectName,
    project_slug: input.projectSlug,
    initial_model: initialModel
  });
  if (error) throw new Error(error.message);

  const result = Array.isArray(data) ? data[0] : data;
  if (!result?.workspace_id || !result?.project_id || !result?.revision) throw new Error('Project bootstrap returned an invalid result.');
  return { workspaceId: String(result.workspace_id), projectId: String(result.project_id), revision: Number(result.revision) };
}
