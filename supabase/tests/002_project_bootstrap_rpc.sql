do $$
declare
  target_proc regprocedure := to_regprocedure('public.create_workspace_with_project(text,text,text,text,jsonb)');
  is_definer boolean;
begin
  if target_proc is null then
    raise exception 'create_workspace_with_project RPC is missing';
  end if;

  select p.prosecdef into is_definer
  from pg_proc p
  where p.oid = target_proc;

  if is_definer then
    raise exception 'create_workspace_with_project must remain SECURITY INVOKER so RLS stays authoritative';
  end if;

  if has_function_privilege('public', target_proc, 'EXECUTE') then
    raise exception 'PUBLIC must not retain EXECUTE on create_workspace_with_project';
  end if;

  if not has_function_privilege('authenticated', target_proc, 'EXECUTE') then
    raise exception 'authenticated role must be able to execute create_workspace_with_project';
  end if;
end $$;
