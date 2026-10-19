-- Niyaz Opticals orders security
-- Paste this in Supabase Dashboard > SQL Editor > New query > Run.
--
-- This locks browser/client access to orders.
-- Your Node server can still read/write using SUPABASE_SERVICE_ROLE_KEY.

create table if not exists public.orders (
  id text primary key,
  customer_name text not null,
  email text,
  phone text not null,
  address text not null,
  items jsonb not null default '[]'::jsonb,
  total numeric not null,
  status text not null default 'Awaiting Prescription',
  payment_id text,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'orders_status_check'
      and conrelid = 'public.orders'::regclass
  ) then
    alter table public.orders
      add constraint orders_status_check
      check (status in (
        'Awaiting Prescription',
        'Prescription Confirmed',
        'Lens Manufacturing',
        'Quality Check',
        'Shipped',
        'Delivered'
      ));
  end if;
end $$;

alter table public.orders enable row level security;

do $$
declare
  policy_record record;
begin
  for policy_record in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'orders'
  loop
    execute format('drop policy if exists %I on public.orders', policy_record.policyname);
  end loop;
end $$;

revoke all on table public.orders from anon;
revoke all on table public.orders from authenticated;

grant usage on schema public to service_role;
grant select, insert, update, delete on table public.orders to service_role;
