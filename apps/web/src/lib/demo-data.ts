export const project = { id: 'demo', name: 'Customer Portal', stage: 'Building', health: 78, verdict: 'Not ready for beta', summary: 'A Next.js customer portal with Supabase authentication and Vercel deployments. Core account flows are working, but authenticated QA and deployment/database reconciliation still need evidence.', repository: 'acme/customer-portal', branch: 'main', productionSha: 'a83f9c1', repositorySha: 'a83f9c1', lastVerified: '12 minutes ago' };
export const attention = [
  { title: 'Authenticated QA is missing', detail: 'No observed browser or E2E evidence covers the signed-in billing flow.', state: 'blocked' as const },
  { title: 'Database advisor warning', detail: 'One public table has an RLS policy that should be reviewed before beta.', state: 'observed' as const },
  { title: 'Production matches GitHub', detail: 'Vercel production was built from the current main commit.', state: 'verified' as const }
];
export const providers = [
  { name: 'GitHub', detail: 'Repository, pull requests, checks', state: 'Connected', freshness: '2 min ago' },
  { name: 'Vercel', detail: 'Deployments, build state, logs', state: 'Connected', freshness: '4 min ago' },
  { name: 'Supabase', detail: 'Schema, RLS, advisors', state: 'Connected', freshness: '9 min ago' }
];
export const recentActivity = [
  { when: '12 min', title: 'Production deployment ready', source: 'Vercel', state: 'verified' as const },
  { when: '19 min', title: 'CI passed on main', source: 'GitHub', state: 'verified' as const },
  { when: '34 min', title: 'Agent reported billing flow complete', source: 'Agent report', state: 'reported' as const },
  { when: '41 min', title: 'Migration 20260818_add_billing.sql observed', source: 'Supabase', state: 'observed' as const }
];
export const folders = [
  { path: 'src/app', purpose: 'Application routes and screens', risk: 'Medium', touches: 'Auth, billing, dashboard' },
  { path: 'src/components', purpose: 'Reusable interface components', risk: 'Low', touches: 'Most screens' },
  { path: 'src/lib', purpose: 'Server helpers and integrations', risk: 'High', touches: 'Supabase, email, permissions' },
  { path: 'supabase', purpose: 'Database migrations and policies', risk: 'High', touches: 'Production data model' }
];
export const codeLines = ["export async function createWorkspace(input: WorkspaceInput) {","  const user = await requireUser();","  const slug = normalizeSlug(input.name);","  const workspace = await db.workspace.create({ userId: user.id, slug });","  await audit('workspace.created', { workspaceId: workspace.id });","  return workspace;","}"];
export const lineExplanations = [
  'Defines an asynchronous server function that creates a workspace from validated input.',
  'Stops the function unless there is a signed-in user and returns that user when authentication succeeds.',
  'Turns the workspace name into a URL-safe identifier such as “north-star-labs”.',
  'Creates the database record and ties the new workspace to the authenticated user.',
  'Writes an audit event so the creation can be traced later.',
  'Returns the newly created workspace to the caller.',
  'Ends the function.'
];
export const tables = [
  { name: 'workspaces', purpose: 'Top-level tenant records', rows: '18', rls: 'Enabled', risk: 'Low' },
  { name: 'workspace_members', purpose: 'User membership and roles', rows: '53', rls: 'Enabled', risk: 'Medium' },
  { name: 'projects', purpose: 'Connected software projects', rows: '24', rls: 'Enabled', risk: 'Low' },
  { name: 'provider_connections', purpose: 'Encrypted provider connection metadata', rows: '39', rls: 'Enabled', risk: 'High' }
];
export const deployments = [
  { environment: 'Production', sha: 'a83f9c1', status: 'Ready', age: '12 min', source: 'main' },
  { environment: 'Preview', sha: '0c91fe2', status: 'Ready', age: '31 min', source: 'feature/billing-copy' },
  { environment: 'Preview', sha: 'f281aa4', status: 'Error', age: '1 hr', source: 'feature/old-billing' }
];
export const changes = [
  { title: 'Billing settings flow changed', summary: 'Three route files and one database migration changed. Production now includes the new billing settings UI.', impact: 'Customer billing settings', state: 'verified' as const },
  { title: 'Agent claims beta readiness', summary: 'The claim conflicts with the current launch gate because authenticated QA is still missing.', impact: 'Release readiness', state: 'contradicted' as const }
];
