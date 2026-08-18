do $$
begin
  if not exists (
    select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname = 'provider_resources' and c.relrowsecurity
  ) then raise exception 'provider_resources must exist with RLS enabled'; end if;

  if not exists (
    select 1 from pg_indexes where schemaname='public' and indexname='provider_connections_project_provider_external_idx'
  ) then raise exception 'project-scoped provider connection uniqueness is missing'; end if;
end $$;
