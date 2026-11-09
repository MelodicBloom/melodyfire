-- Studio content tables: anon may read only published rows; every write is studio-admin only.
-- Follow-up to 20261027000000_inquiries_rls_lockdown.sql (reuses public.is_studio_admin()).
-- DRAFT. NOT APPLIED. Column names come from client/src/pages/StudioPage.tsx row types
-- (projects.status, artworks.published, blog_posts.status); verify against the live schema
-- of project ikfejoqvwmmqsuszpdhj before applying. Idempotent.
--
-- Public readers in the app today:
--   projects  -> lib/supabase.ts getProjects() (no status filter in the query)
--   artworks  -> lib/supabase.ts getArtworks() (.eq('published', true))
--   blog_posts, products -> no public reader; Studio only.
-- Open decision for owner: projects with status NULL stay public (treated as legacy-published)
-- so the live portfolio does not go empty; flip to strict 'published' after a data check.

do $$
declare t text; p record;
begin
  foreach t in array array['projects','artworks','blog_posts','products'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('alter table public.%I force row level security', t);
    for p in select policyname from pg_policies where schemaname='public' and tablename=t loop
      execute format('drop policy %I on public.%I', p.policyname, t);
    end loop;
    execute format('revoke all on public.%I from anon, authenticated', t);
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant insert, update, delete on public.%I to authenticated', t);

    -- Admin: full read + write. No anon write policy exists, so anon writes are refused.
    execute format('create policy %I on public.%I for select to authenticated using (public.is_studio_admin())', t||'_admin_select', t);
    execute format('create policy %I on public.%I for insert to authenticated with check (public.is_studio_admin())', t||'_admin_insert', t);
    execute format('create policy %I on public.%I for update to authenticated using (public.is_studio_admin()) with check (public.is_studio_admin())', t||'_admin_update', t);
    execute format('create policy %I on public.%I for delete to authenticated using (public.is_studio_admin())', t||'_admin_delete', t);
  end loop;
end $$;

-- Public read: published rows only.
create policy projects_public_read on public.projects
  for select to anon, authenticated using (coalesce(status, 'published') = 'published');
create policy artworks_public_read on public.artworks
  for select to anon, authenticated using (published is true);
create policy blog_posts_public_read on public.blog_posts
  for select to anon, authenticated using (status = 'published');
-- products: no public read policy (admin-only) until the Shop reads from Supabase.

-- Verification (run as anon key after applying; expected results in the PR body):
--   select on each table returns only published rows (products: 0 rows / empty)
--   insert/update/delete as anon -> 401/42501
--   update as non-admin authenticated user -> 0 rows affected (UNVERIFIED, not a pass)
--   admin session -> CRUD works in /studio
