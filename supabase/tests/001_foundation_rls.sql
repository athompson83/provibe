do $$
declare
  missing_rls text[];
  expected_tables constant text[] := array[
    'workspaces','workspace_members','projects','project_revisions','project_decisions','project_artifacts',
    'provider_connections','provider_capabilities','evidence_records','progress_reports','progress_claims',
    'claim_verifications','readiness_controls'
  ];
begin
  select array_agg(name order by name)
  into missing_rls
  from unnest(expected_tables) as name
  where not exists (
    select 1 from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname = name and c.relrowsecurity
  );

  if coalesce(cardinality(missing_rls), 0) > 0 then
    raise exception 'RLS missing for tables: %', missing_rls;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'provider_connections'
      and column_name ~* '(access_token|refresh_token|service_role|secret_value)'
  ) then
    raise exception 'provider_connections contains a forbidden plaintext credential column';
  end if;
end $$;
