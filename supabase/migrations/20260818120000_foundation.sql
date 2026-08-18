begin;

create extension if not exists pgcrypto;

create type public.workspace_role as enum ('owner', 'admin', 'member', 'viewer');
create type public.evidence_state as enum ('reported', 'observed', 'verified', 'contradicted', 'unknown', 'blocked', 'accepted_risk');
create type public.provider_state as enum ('connected', 'degraded', 'disconnected', 'unsupported');

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$'),
  name text not null check (char_length(name) between 1 and 120),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.workspace_role not null default 'member',
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  slug text not null check (slug ~ '^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$'),
  name text not null check (char_length(name) between 1 and 160),
  stage text not null default 'planning',
  current_revision integer not null default 1 check (current_revision > 0),
  created_at timestamptz not null default now(),
  unique (workspace_id, slug)
);

create table public.project_revisions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  revision integer not null check (revision > 0),
  model jsonb not null,
  reason text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (project_id, revision)
);

create table public.project_decisions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  revision integer not null check (revision > 0),
  area text not null,
  summary text not null,
  decision_state text not null default 'active',
  decided_by uuid references auth.users(id) on delete set null,
  decided_at timestamptz not null default now()
);

create table public.project_artifacts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  kind text not null,
  path text not null,
  rendered_from_revision integer not null check (rendered_from_revision > 0),
  dependency_areas text[] not null default '{}',
  stale boolean not null default false,
  generated_at timestamptz not null default now(),
  unique (project_id, path)
);

create table public.provider_connections (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  provider text not null check (provider in ('github', 'vercel', 'supabase')),
  external_account_id text not null,
  credential_reference text,
  state public.provider_state not null default 'disconnected',
  created_at timestamptz not null default now(),
  unique (workspace_id, provider, external_account_id)
);

comment on column public.provider_connections.credential_reference is
  'Opaque server-side vault reference only. Never store OAuth access tokens or secrets directly in this table.';

create table public.provider_capabilities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  provider text not null,
  capability text not null,
  state public.provider_state not null,
  last_success_at timestamptz,
  last_attempt_at timestamptz,
  error_class text,
  retry_after timestamptz,
  unique (project_id, provider, capability)
);

create table public.evidence_records (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  source_kind text not null check (source_kind in ('deterministic', 'provider', 'reported', 'inferred', 'owner')),
  provider text,
  evidence_kind text not null,
  subject text not null,
  polarity text not null check (polarity in ('supports', 'contradicts', 'neutral')),
  pointer jsonb not null default '{}'::jsonb,
  payload jsonb not null default '{}'::jsonb,
  confidence numeric(4,3) check (confidence is null or (confidence >= 0 and confidence <= 1)),
  observed_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table public.progress_reports (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  agent_tool text not null,
  source_text text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.progress_claims (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  report_id uuid not null references public.progress_reports(id) on delete cascade,
  statement text not null,
  state public.evidence_state not null default 'reported',
  created_at timestamptz not null default now()
);

create table public.claim_verifications (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  claim_id uuid not null references public.progress_claims(id) on delete cascade,
  state public.evidence_state not null,
  reason text not null,
  evidence_ids uuid[] not null default '{}',
  verified_at timestamptz not null default now()
);

create table public.readiness_controls (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  category text not null,
  control_key text not null,
  label text not null,
  required boolean not null default true,
  state public.evidence_state not null default 'unknown',
  evidence_ids uuid[] not null default '{}',
  updated_at timestamptz not null default now(),
  unique (project_id, control_key)
);

create index workspace_members_user_idx on public.workspace_members(user_id, workspace_id);
create index projects_workspace_idx on public.projects(workspace_id);
create index project_revisions_project_idx on public.project_revisions(project_id, revision desc);
create index project_decisions_project_idx on public.project_decisions(project_id, decided_at desc);
create index project_artifacts_project_idx on public.project_artifacts(project_id, stale);
create index provider_connections_workspace_idx on public.provider_connections(workspace_id, provider);
create index provider_capabilities_project_idx on public.provider_capabilities(project_id, provider);
create index evidence_records_project_time_idx on public.evidence_records(project_id, observed_at desc);
create index evidence_records_subject_idx on public.evidence_records(project_id, subject);
create index progress_reports_project_time_idx on public.progress_reports(project_id, created_at desc);
create index progress_claims_report_idx on public.progress_claims(report_id);
create index claim_verifications_claim_idx on public.claim_verifications(claim_id, verified_at desc);
create index readiness_controls_project_idx on public.readiness_controls(project_id, category);

create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = auth.uid()
  );
$$;

create or replace function public.is_workspace_admin(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = auth.uid()
      and wm.role in ('owner', 'admin')
  );
$$;

revoke all on function public.is_workspace_member(uuid) from public;
revoke all on function public.is_workspace_admin(uuid) from public;
grant execute on function public.is_workspace_member(uuid) to authenticated;
grant execute on function public.is_workspace_admin(uuid) to authenticated;

alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.projects enable row level security;
alter table public.project_revisions enable row level security;
alter table public.project_decisions enable row level security;
alter table public.project_artifacts enable row level security;
alter table public.provider_connections enable row level security;
alter table public.provider_capabilities enable row level security;
alter table public.evidence_records enable row level security;
alter table public.progress_reports enable row level security;
alter table public.progress_claims enable row level security;
alter table public.claim_verifications enable row level security;
alter table public.readiness_controls enable row level security;

create policy workspaces_select_member on public.workspaces for select to authenticated
  using (public.is_workspace_member(id));
create policy workspaces_insert_creator on public.workspaces for insert to authenticated
  with check (created_by = auth.uid());
create policy workspaces_update_admin on public.workspaces for update to authenticated
  using (public.is_workspace_admin(id)) with check (public.is_workspace_admin(id));

create policy workspace_members_select_member on public.workspace_members for select to authenticated
  using (public.is_workspace_member(workspace_id));
create policy workspace_members_insert_bootstrap_or_admin on public.workspace_members for insert to authenticated
  with check (
    public.is_workspace_admin(workspace_id)
    or (
      user_id = auth.uid()
      and role = 'owner'
      and exists (select 1 from public.workspaces w where w.id = workspace_id and w.created_by = auth.uid())
    )
  );
create policy workspace_members_update_admin on public.workspace_members for update to authenticated
  using (public.is_workspace_admin(workspace_id)) with check (public.is_workspace_admin(workspace_id));
create policy workspace_members_delete_admin on public.workspace_members for delete to authenticated
  using (public.is_workspace_admin(workspace_id));

create policy projects_select_member on public.projects for select to authenticated
  using (public.is_workspace_member(workspace_id));
create policy projects_insert_member on public.projects for insert to authenticated
  with check (public.is_workspace_member(workspace_id));
create policy projects_update_member on public.projects for update to authenticated
  using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy projects_delete_admin on public.projects for delete to authenticated
  using (public.is_workspace_admin(workspace_id));

create policy project_revisions_member_all on public.project_revisions for all to authenticated
  using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy project_decisions_member_all on public.project_decisions for all to authenticated
  using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy project_artifacts_member_all on public.project_artifacts for all to authenticated
  using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));

create policy provider_connections_select_admin on public.provider_connections for select to authenticated
  using (public.is_workspace_admin(workspace_id));
create policy provider_connections_manage_admin on public.provider_connections for all to authenticated
  using (public.is_workspace_admin(workspace_id)) with check (public.is_workspace_admin(workspace_id));

create policy provider_capabilities_select_member on public.provider_capabilities for select to authenticated
  using (public.is_workspace_member(workspace_id));
create policy evidence_records_select_member on public.evidence_records for select to authenticated
  using (public.is_workspace_member(workspace_id));

create policy progress_reports_select_member on public.progress_reports for select to authenticated
  using (public.is_workspace_member(workspace_id));
create policy progress_reports_insert_member on public.progress_reports for insert to authenticated
  with check (public.is_workspace_member(workspace_id) and (created_by is null or created_by = auth.uid()));

create policy progress_claims_select_member on public.progress_claims for select to authenticated
  using (public.is_workspace_member(workspace_id));
create policy claim_verifications_select_member on public.claim_verifications for select to authenticated
  using (public.is_workspace_member(workspace_id));
create policy readiness_controls_select_member on public.readiness_controls for select to authenticated
  using (public.is_workspace_member(workspace_id));

commit;
