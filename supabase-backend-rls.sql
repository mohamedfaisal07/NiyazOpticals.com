-- Niyaz Opticals Supabase backend + Row Level Security
-- Paste this in Supabase Dashboard > SQL Editor > New query > Run.
--
-- Creates:
--   public.admins
--   public.contact_messages
--   public.appointments
--
-- Keeps your existing public.orders table structure unchanged.
-- Public visitors can INSERT contact messages and appointments.
-- Only active authenticated admins can read/update/delete these tables.

create extension if not exists pgcrypto;

create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  phone text,
  role text not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  subject text not null,
  message text not null,
  status text not null default 'New',
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  appointment_type text not null,
  interest text not null,
  message text,
  status text not null default 'Pending',
  created_at timestamptz not null default now()
);

alter table public.admins
  alter column role set default 'admin',
  alter column is_active set default true,
  alter column created_at set default now();

alter table public.contact_messages
  alter column status set default 'New',
  alter column created_at set default now();

alter table public.appointments
  alter column status set default 'Pending',
  alter column created_at set default now();

alter table public.admins
  drop constraint if exists admins_role_check,
  add constraint admins_role_check
  check (role in ('admin', 'manager', 'staff'));

alter table public.contact_messages
  drop constraint if exists contact_messages_status_check,
  add constraint contact_messages_status_check
  check (status in ('New', 'Read', 'Replied', 'Closed'));

alter table public.appointments
  drop constraint if exists appointments_type_check,
  add constraint appointments_type_check
  check (appointment_type in ('Store Visit', 'Home Eye Test'));

alter table public.appointments
  drop constraint if exists appointments_status_check,
  add constraint appointments_status_check
  check (status in ('Pending', 'Confirmed', 'Completed', 'Cancelled'));

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

create index if not exists contact_messages_status_idx
  on public.contact_messages (status);

create index if not exists appointments_created_at_idx
  on public.appointments (created_at desc);

create index if not exists appointments_status_idx
  on public.appointments (status);

alter table public.admins enable row level security;
alter table public.contact_messages enable row level security;
alter table public.appointments enable row level security;

create or replace function public.is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admins
    where id = auth.uid()
      and is_active = true
  );
$$;

do $$
declare
  policy_record record;
begin
  for policy_record in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('admins', 'contact_messages', 'appointments')
  loop
    execute format(
      'drop policy if exists %I on %I.%I',
      policy_record.policyname,
      policy_record.schemaname,
      policy_record.tablename
    );
  end loop;
end $$;

create policy "Active admins can read admins"
on public.admins
for select
to authenticated
using (public.is_active_admin());

create policy "Active admins can update admins"
on public.admins
for update
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

create policy "Public can create contact messages"
on public.contact_messages
for insert
to anon, authenticated
with check (true);

create policy "Active admins can read contact messages"
on public.contact_messages
for select
to authenticated
using (public.is_active_admin());

create policy "Active admins can update contact messages"
on public.contact_messages
for update
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

create policy "Active admins can delete contact messages"
on public.contact_messages
for delete
to authenticated
using (public.is_active_admin());

create policy "Public can create appointments"
on public.appointments
for insert
to anon, authenticated
with check (true);

create policy "Active admins can read appointments"
on public.appointments
for select
to authenticated
using (public.is_active_admin());

create policy "Active admins can update appointments"
on public.appointments
for update
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

create policy "Active admins can delete appointments"
on public.appointments
for delete
to authenticated
using (public.is_active_admin());

revoke all on table public.admins from anon;
revoke all on table public.contact_messages from anon;
revoke all on table public.appointments from anon;

grant usage on schema public to anon, authenticated;
grant insert on table public.contact_messages to anon, authenticated;
grant insert on table public.appointments to anon, authenticated;

grant select, update, delete on table public.admins to authenticated;
grant select, update, delete on table public.contact_messages to authenticated;
grant select, update, delete on table public.appointments to authenticated;

grant usage on schema public to service_role;
grant all on table public.admins to service_role;
grant all on table public.contact_messages to service_role;
grant all on table public.appointments to service_role;
