'use server';
import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '../../../../../lib/supabase/server';

export async function selectVercelProject(projectId: string, resourceId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: target, error } = await supabase.from('provider_resources').select('id').eq('id',resourceId).eq('project_id',projectId).eq('provider','vercel').eq('resource_type','project').single();
  if (error || !target) throw new Error('Vercel project resource is unavailable.');
  const { error: clearError } = await supabase.from('provider_resources').update({ selected:false }).eq('project_id',projectId).eq('provider','vercel').eq('resource_type','project');
  if (clearError) throw new Error(clearError.message);
  const { error: selectError } = await supabase.from('provider_resources').update({ selected:true }).eq('id',resourceId);
  if (selectError) throw new Error(selectError.message);
  revalidatePath(`/projects/${projectId}/integrations/vercel`);
}
