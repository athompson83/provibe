begin;

-- SQL-created tables do not always inherit Data API grants. Grant only the
-- authenticated operations the product actually needs; RLS remains the row boundary.
grant usage on schema public to authenticated;

grant select, insert, update on public.workspaces to authenticated;
grant select, insert, update, delete on public.workspace_members to authenticated;
grant select, insert, update, delete on public.projects to authenticated;
grant select, insert on public.project_revisions to authenticated;
grant select, insert, update on public.project_decisions to authenticated;
grant select on public.project_artifacts to authenticated;
grant select, insert, update, delete on public.provider_connections to authenticated;
grant select on public.provider_capabilities to authenticated;
grant select on public.evidence_records to authenticated;
grant select, insert on public.progress_reports to authenticated;
grant select on public.progress_claims to authenticated;
grant select on public.claim_verifications to authenticated;
grant select on public.readiness_controls to authenticated;

create or replace function public.create_workspace_with_project(
  workspace_name text,
  workspace_slug text,
  project_name text,
  project_slug text,
  initial_model jsonb
)
returns table(workspace_id uuid, project_id uuid, revision integer)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  created_workspace_id uuid;
  created_project_id uuid;
begin
  if actor_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  if initial_model is null or jsonb_typeof(initial_model) <> 'object' then
    raise exception 'initial_model must be a JSON object' using errcode = '22023';
  end if;

  insert into public.workspaces (name, slug, created_by)
  values (workspace_name, workspace_slug, actor_id)
  returning id into created_workspace_id;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (created_workspace_id, actor_id, 'owner');

  insert into public.projects (workspace_id, name, slug, current_revision)
  values (created_workspace_id, project_name, project_slug, 1)
  returning id into created_project_id;

  insert into public.project_revisions (
    workspace_id, project_id, revision, model, reason, created_by
  ) values (
    created_workspace_id, created_project_id, 1, initial_model, 'Initial project model', actor_id
  );

  return query select created_workspace_id, created_project_id, 1;
end;
$$;

create or replace function public.append_project_revision(
  target_project_id uuid,
  next_model jsonb,
  revision_reason text
)
returns table(project_id uuid, revision integer)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  target_workspace_id uuid;
  next_revision integer;
begin
  if actor_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  if next_model is null or jsonb_typeof(next_model) <> 'object' then
    raise exception 'next_model must be a JSON object' using errcode = '22023';
  end if;

  if nullif(btrim(revision_reason), '') is null then
    raise exception 'revision_reason is required' using errcode = '22023';
  end if;

  update public.projects p
  set current_revision = p.current_revision + 1
  where p.id = target_project_id
  returning p.workspace_id, p.current_revision
  into target_workspace_id, next_revision;

  if not found then
    raise exception 'project not found or not authorized' using errcode = '42501';
  end if;

  insert into public.project_revisions (
    workspace_id, project_id, revision, model, reason, created_by
  ) values (
    target_workspace_id, target_project_id, next_revision, next_model, revision_reason, actor_id
  );

  return query select target_project_id, next_revision;
end;
$$;

revoke all on function public.create_workspace_with_project(text,text,text,text,jsonb) from public;
revoke all on function public.append_project_revision(uuid,jsonb,text) from public;
grant execute on function public.create_workspace_with_project(text,text,text,text,jsonb) to authenticated;
grant execute on function public.append_project_revision(uuid,jsonb,text) to authenticated;

commit;
