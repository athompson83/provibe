create schema if not exists auth;
create table if not exists auth.users (id uuid primary key);
create or replace function auth.uid() returns uuid language sql stable as $$ select null::uuid $$;
do $$ begin create role authenticated nologin; exception when duplicate_object then null; end $$;
do $$ begin create role service_role nologin; exception when duplicate_object then null; end $$;

-- Minimal CI-only stand-in for Supabase Vault so migrations can prove their
-- privilege boundaries on stock PostgreSQL. Hosted Supabase supplies Vault.
create schema if not exists vault;
create table if not exists vault.secrets (
  id uuid primary key default gen_random_uuid(),
  name text unique,
  description text,
  secret text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create or replace view vault.decrypted_secrets as
  select id, name, description, secret as decrypted_secret, created_at, updated_at from vault.secrets;
create or replace function vault.create_secret(new_secret text, new_name text default null, new_description text default null)
returns uuid language plpgsql as $$
declare secret_id uuid;
begin
  insert into vault.secrets(secret,name,description) values(new_secret,new_name,new_description) returning id into secret_id;
  return secret_id;
end $$;
create or replace function vault.update_secret(secret_id uuid, new_secret text default null, new_name text default null, new_description text default null)
returns void language plpgsql as $$
begin
  update vault.secrets set secret=coalesce(new_secret,secret), name=coalesce(new_name,name), description=coalesce(new_description,description), updated_at=now() where id=secret_id;
end $$;
