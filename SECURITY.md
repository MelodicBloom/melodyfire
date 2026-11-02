# Security notes

## Lead inquiries (`public.inquiries`) — contains names + emails (PII)

**Boundary is Postgres RLS**, not the UI. The browser ships the public anon key, so anything anon can SELECT is public.

Policy (see `supabase/migrations/20261027000000_inquiries_rls_lockdown.sql`):

| Role | INSERT | SELECT | UPDATE | DELETE |
|---|---|---|---|---|
| anon | ✅ (status must be null/`unread`, size limits) | ❌ | ❌ | ❌ |
| authenticated, not in `studio_admins` | ✅ (same) | ❌ | ❌ | ❌ |
| authenticated + in `studio_admins` | ✅ | ✅ | ✅ | ❌ |
| service_role / dashboard | bypasses RLS | | | |

`/studio` is fail-closed: it renders a sign-in / locked state and issues **no** data queries until a Supabase Auth session exists and `is_studio_admin()` returns true.

### Apply
1. Supabase → SQL editor (project `ikfejoqvwmmqsuszpdhj`) → paste the migration → Run.
2. Auth → Users → create Jennipher's user (email + password). Disable public sign-ups if not needed.
3. `insert into public.studio_admins(user_id) select id from auth.users where email = '<her email>';`

### Verify (no secrets needed)
```
npm run test:rls        # exit 0 = anon cannot read inquiries; 1 = LEAK
```
Manual equivalent:
```
curl -s -H "apikey: $ANON" -H "Authorization: Bearer $ANON" -H "Prefer: count=exact" -I \
  "https://ikfejoqvwmmqsuszpdhj.supabase.co/rest/v1/inquiries?select=id" | grep -i content-range
# expect 401/403, or content-range */0
```

### Never
- Never put `SUPABASE_SERVICE_ROLE_KEY` in client code or any `VITE_*` env var.

### Known residual risk
Other Studio tables (projects, artworks, blog_posts, products) are also written from the client with the anon key; their RLS must likewise restrict writes to `is_studio_admin()`. Not changed in this PR.
