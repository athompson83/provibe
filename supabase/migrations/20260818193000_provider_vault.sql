begin;

create or replace function public.attach_provider_credential(target_connection_id uuid, plaintext_secret text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  existing_reference text;
  secret_id uuid;
begin
  if plaintext_secret is null or length(plaintext_secret) < 8 then
    raise exception 'provider credential is invalid' using errcode = '22023';
  end if;

  select credential_reference into existing_reference
  from public.provider_connections
  where id = target_connection_id;
  if not found then raise exception 'provider connection not found' using errcode = 'P0002'; end if;

  if existing_reference is not null and existing_reference ~* '^[0-9a-f-]{36}$' then
    secret_id := existing_reference::uuid;
    perform vault.update_secret(secret_id, plaintext_secret, 'provibe-provider-' || target_connection_id::text, 'Encrypted provider OAuth credential');
  else
    secret_id := vault.create_secret(plaintext_secret, 'provibe-provider-' || target_connection_id::text, 'Encrypted provider OAuth credential');
  end if;

  update public.provider_connections set credential_reference = secret_id::text where id = target_connection_id;
  return secret_id::text;
end;
$$;

create or replace function public.get_provider_credential(target_connection_id uuid)
returns text
language sql
security definer
set search_path = ''
as $$
  select v.decrypted_secret
  from public.provider_connections c
  join vault.decrypted_secrets v on v.id::text = c.credential_reference
  where c.id = target_connection_id
$$;

revoke all on function public.attach_provider_credential(uuid,text) from public, authenticated;
revoke all on function public.get_provider_credential(uuid) from public, authenticated;
grant execute on function public.attach_provider_credential(uuid,text) to service_role;
grant execute on function public.get_provider_credential(uuid) to service_role;

commit;
