'use server';

import { redirect } from 'next/navigation';
import { createWorkspaceProject } from '../../../lib/projects';

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 64);
}

export async function createProjectAction(formData: FormData) {
  const projectName = String(formData.get('projectName') ?? '').trim();
  const workspaceName = String(formData.get('workspaceName') ?? '').trim();
  if (projectName.length < 2 || workspaceName.length < 2) redirect('/projects/new?error=Project%20and%20workspace%20names%20are%20required.');

  const projectSlug = slugify(projectName);
  const workspaceSlug = slugify(workspaceName);
  if (projectSlug.length < 3 || workspaceSlug.length < 3) redirect('/projects/new?error=Use%20names%20with%20at%20least%203%20letters%20or%20numbers.');

  let projectId: string;
  try {
    const created = await createWorkspaceProject({ projectName, projectSlug, workspaceName, workspaceSlug });
    projectId = created.projectId;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create project.';
    redirect(`/projects/new?error=${encodeURIComponent(message)}`);
  }
  redirect(`/projects/${projectId}`);
}
