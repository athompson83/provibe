'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '../../../../../lib/supabase/server';

export async function selectGitHubRepository(projectId: string, resourceId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: target, error: targetError } = await supabase.from('provider_resources').select('workspace_id').eq('id', resourceId).eq('project_id', projectId).eq('provider', 'github').eq('resource_type', 'repository').single();
  if (targetError || !target) throw new Error('Repository resource is unavailable.');
  const { error: clearError } = await supabase.from('provider_resources').update({ selected: false }).eq('project_id', projectId).eq('provider', 'github').eq('resource_type', 'repository');
  if (clearError) throw new Error(clearError.message);
  const { error: selectError } = await supabase.from('provider_resources').update({ selected: true }).eq('id', resourceId).eq('project_id', projectId);
  if (selectError) throw new Error(selectError.message);
  revalidatePath(`/projects/${projectId}/integrations/github`);
}
