-- Lock down public.inquiries (lead PII). Adapted for LIVE schema 2026-10-29.
-- Live columns: id, name, email, subject, inquiry_type, message, budget_range, timeline, status, created_at
-- PR #10 referenced `description`; prod uses `message`. Idempotent.
-- Project: ikfejoqvwmmqsuszpdhj

-- 1. Allowlist of studio operators (Supabase Auth users). Signing up alone grants nothing.
create table if not exists public.studio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.studio_admins enable row level security;
revoke all on public.studio_admins from anon, authenticated;
grant select on public.studio_admins to authenticated;
drop policy if exists studio_admins_self_read on public.studio_admins;
create policy studio_admins_self_read on public.studio_admins
  for select to authenticated using (user_id = auth.uid());

create or replace function public.is_studio_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.studio_admins where user_id = auth.uid());
$$;
revoke all on function public.is_studio_admin() from public;
grant execute on function public.is_studio_admin() to authenticated;

-- 2. inquiries: RLS on, drop every existing policy (incl. "Public insert inquiries").
alter table public.inquiries enable row level security;
alter table public.inquiries force row level security;
do $$ declare p record; begin
  for p in select policyname from pg_policies where schemaname='public' and tablename='inquiries' loop
    execute format('drop policy %I on public.inquiries', p.policyname);
  end loop;
end $$;

revoke all on public.inquiries from anon, authenticated;
grant insert on public.inquiries to anon, authenticated;
grant select, update on public.inquiries to authenticated;

-- Lead form: anyone may insert; cannot pre-set triage status; size limits on live columns.
create policy inquiries_public_insert on public.inquiries
  for insert to anon, authenticated
  with check (
    (status is null or status = 'unread')
    and char_length(coalesce(name,'')) <= 200
    and char_length(coalesce(email,'')) between 3 and 320
    and char_length(coalesce(message,'')) <= 5000
    and char_length(coalesce(subject,'')) <= 500
  );

-- Read/triage: allowlisted studio admins only.
create policy inquiries_admin_select on public.inquiries
  for select to authenticated using (public.is_studio_admin());
create policy inquiries_admin_update on public.inquiries
  for update to authenticated using (public.is_studio_admin()) with check (public.is_studio_admin());
-- No DELETE policy: deletes only via service role / dashboard.

-- 3. After applying, add Jennipher (create the user first in Auth > Users):
-- insert into public.studio_admins(user_id) select id from auth.users where email = 'JENNIPHER_EMAIL_HERE';
