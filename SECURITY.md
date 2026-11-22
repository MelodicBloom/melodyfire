# Security notes

## Lead inquiries (`public.inquiries`) — contains names + emails (PII)

**Boundary is Postgres RLS**, not the UI. The browser ships the public anon key, so anything anon can SELECT is public.

Policy (lockdown in `supabase/migrations/20261027000000_inquiries_rls_lockdown.sql`, insert check corrected by `supabase/migrations/20261109010000_inquiries_insert_status_fix.sql`):

| Role | INSERT | SELECT | UPDATE | DELETE |
|---|---|---|---|---|
| anon | ✅ (`status` must be `new` after the column default, size limits) | ❌ | ❌ | ❌ |
| authenticated, not in `studio_admins` | ✅ (same) | ❌ | ❌ | ❌ |
| authenticated + in `studio_admins` | ✅ | ✅ | ✅ | ❌ |
| service_role / dashboard | bypasses RLS | | | |

The live `status` default is `new` and the column check allows `new`, `read`, `replied`, `archived`. Postgres applies that default before `WITH CHECK`, so a policy that only allowed null or `unread` rejected every normal insert (`42501`) while `unread` itself failed the check (`23514`). Anon has `INSERT` and not `SELECT`, so `INSERT ... RETURNING` is `42501` and does not return row data. Forms must not chain `.select()`. `gallery_art` and `regenerative_join` are not in the `inquiry_type` check; the forms send `commission` / `collaboration` / `general` / `children_art` instead.

`/studio` is fail-closed: it renders a sign-in / locked state and issues **no** data queries until a Supabase Auth session exists and `is_studio_admin()` returns true.

### Apply
1. Supabase → SQL editor (project `ikfejoqvwmmqsuszpdhj`) → paste both migrations, lockdown first, then `20261109010000_inquiries_insert_status_fix.sql` → Run. The status fix is in git only until that step is done. Do not treat a merged pull request as an applied database change.
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
