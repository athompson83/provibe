do $$
declare
  attach_proc regprocedure := to_regprocedure('public.attach_provider_credential(uuid,text)');
  get_proc regprocedure := to_regprocedure('public.get_provider_credential(uuid)');
begin
  if attach_proc is null or get_proc is null then raise exception 'provider credential Vault RPCs are missing'; end if;
  if not (select prosecdef from pg_proc where oid=attach_proc) then raise exception 'attach_provider_credential must be SECURITY DEFINER'; end if;
  if not (select prosecdef from pg_proc where oid=get_proc) then raise exception 'get_provider_credential must be SECURITY DEFINER'; end if;
  if has_function_privilege('public', attach_proc, 'EXECUTE') or has_function_privilege('authenticated', attach_proc, 'EXECUTE') then raise exception 'normal users must not attach provider secrets'; end if;
  if has_function_privilege('public', get_proc, 'EXECUTE') or has_function_privilege('authenticated', get_proc, 'EXECUTE') then raise exception 'normal users must not retrieve provider secrets'; end if;
  if not has_function_privilege('service_role', attach_proc, 'EXECUTE') or not has_function_privilege('service_role', get_proc, 'EXECUTE') then raise exception 'service role must control provider credential Vault RPCs'; end if;
end $$;
