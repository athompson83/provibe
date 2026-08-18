begin;

alter table public.provider_connections drop constraint if exists provider_connections_workspace_id_provider_external_account_id_key;
create unique index if not exists provider_connections_project_provider_external_idx
  on public.provider_connections(workspace_id, project_id, provider, external_account_id)
  nulls not distinct;

create table public.provider_resources (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  connection_id uuid not null references public.provider_connections(id) on delete cascade,
  provider text not null check (provider in ('github', 'vercel', 'supabase')),
  resource_type text not null,
  external_id text not null,
  display_name text not null,
  metadata jsonb not null default '{}'::jsonb,
  selected boolean not null default false,
  observed_at timestamptz not null default now(),
  unique (project_id, provider, resource_type, external_id)
);

create index provider_resources_project_idx on public.provider_resources(project_id, provider, resource_type, selected);
alter table public.provider_resources enable row level security;
grant select, insert, update, delete on public.provider_resources to authenticated;

create policy provider_resources_select_member on public.provider_resources for select to authenticated
  using (public.is_workspace_member(workspace_id));
create policy provider_resources_manage_admin on public.provider_resources for all to authenticated
  using (public.is_workspace_admin(workspace_id)) with check (public.is_workspace_admin(workspace_id));

commit;
