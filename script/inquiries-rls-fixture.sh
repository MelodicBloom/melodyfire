#!/usr/bin/env bash
# Local Postgres fixture for public.inquiries RLS.
# Creates and drops an ephemeral database. Does not contact a hosted database.
set -euo pipefail
ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
DB="melodyfire_rls_fixture_$$"
PASS=0
FAIL=0
PSQL=()
unset PGHOSTADDR PGSERVICE PGSERVICEFILE
LOCAL_SOCKET=/var/run/postgresql

if sudo -u postgres psql -h "$LOCAL_SOCKET" -d postgres -c 'select 1' >/dev/null 2>&1; then
  PSQL=(sudo -u postgres psql -h "$LOCAL_SOCKET" -q -d "$DB" -v ON_ERROR_STOP=1 -At)
  ADMIN=(sudo -u postgres psql -h "$LOCAL_SOCKET" -d postgres -v ON_ERROR_STOP=1)
else
  PSQL=(psql -h "$LOCAL_SOCKET" -q -d "$DB" -v ON_ERROR_STOP=1 -At)
  ADMIN=(psql -h "$LOCAL_SOCKET" -d postgres -v ON_ERROR_STOP=1)
fi

cleanup() {
  "${ADMIN[@]}" -c "DROP DATABASE IF EXISTS \"$DB\";" >/dev/null 2>&1 || true
}
trap cleanup EXIT

"${ADMIN[@]}" -c "DROP DATABASE IF EXISTS \"$DB\";" >/dev/null
"${ADMIN[@]}" -c "CREATE DATABASE \"$DB\";" >/dev/null

"${PSQL[@]}" << 'SQL' >/dev/null
DO $$ BEGIN
  CREATE ROLE anon NOLOGIN;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE ROLE authenticated NOLOGIN;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
CREATE SCHEMA auth;
CREATE TABLE auth.users (id uuid PRIMARY KEY, email text);
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
CREATE TABLE public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  subject text,
  inquiry_type text,
  message text,
  budget_range text,
  timeline text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT inquiries_status_check CHECK (status IN ('new', 'read', 'replied', 'archived')),
  CONSTRAINT inquiries_inquiry_type_check CHECK (
    inquiry_type IS NULL OR inquiry_type IN (
      'collaboration', 'commission', 'consulting', 'children_art', 'workshop', 'co_founder', 'general'
    )
  )
);
CREATE FUNCTION public._try(cmd text) RETURNS text LANGUAGE plpgsql AS $fn$
BEGIN
  EXECUTE cmd;
  RETURN 'OK';
EXCEPTION WHEN OTHERS THEN
  RETURN SQLSTATE || ' ' || SQLERRM;
END $fn$;
GRANT EXECUTE ON FUNCTION public._try(text) TO anon, authenticated;
SQL

"${PSQL[@]}" -f "$ROOT/supabase/migrations/20261027000000_inquiries_rls_lockdown.sql" >/dev/null

check() {
  local name="$1" expected="$2" actual="$3"
  if [[ "$actual" == "$expected" ]]; then
    PASS=$((PASS + 1))
    printf 'PASS %s => %s\n' "$name" "$actual"
  else
    FAIL=$((FAIL + 1))
    printf 'FAIL %s expected [%s] got [%s]\n' "$name" "$expected" "$actual"
  fi
}

run_anon() {
  "${PSQL[@]}" << SQL
SET ROLE anon;
SELECT public._try(\$c\$$1\$c\$);
RESET ROLE;
SQL
}

echo '--- before status fix ---'
check 'pre omit status denied' '42501 new row violates row-level security policy for table "inquiries"' \
  "$(run_anon "INSERT INTO public.inquiries (name, email, message, inquiry_type) VALUES ('Ada', 'ada@example.com', 'hello', 'general')")"
check 'pre unread fails check' '23514 new row for relation "inquiries" violates check constraint "inquiries_status_check"' \
  "$(run_anon "INSERT INTO public.inquiries (name, email, message, inquiry_type, status) VALUES ('Ada', 'ada@example.com', 'hello', 'general', 'unread')")"

"${PSQL[@]}" -f "$ROOT/supabase/migrations/20261109010000_inquiries_insert_status_fix.sql" >/dev/null

echo '--- after status fix: positive ---'
check 'anon omit status' 'OK' \
  "$(run_anon "INSERT INTO public.inquiries (name, email, message, inquiry_type) VALUES ('Ada', 'ada@example.com', 'valid omit status', 'general')")"
check 'anon explicit new' 'OK' \
  "$(run_anon "INSERT INTO public.inquiries (name, email, message, inquiry_type, status) VALUES ('Bea', 'bea@example.com', 'valid explicit', 'commission', 'new')")"
check 'anon children_art' 'OK' \
  "$(run_anon "INSERT INTO public.inquiries (name, email, message, inquiry_type) VALUES ('Cia', 'cia@example.com', 'children', 'children_art')")"
check 'anon collaboration' 'OK' \
  "$(run_anon "INSERT INTO public.inquiries (name, email, message, inquiry_type) VALUES ('Regenerative waitlist', 'dee@example.com', 'session', 'collaboration')")"

echo '--- after status fix: negative ---'
check 'preset read denied' '42501 new row violates row-level security policy for table "inquiries"' \
  "$(run_anon "INSERT INTO public.inquiries (name, email, message, inquiry_type, status) VALUES ('Ada', 'ada@example.com', 'nope', 'general', 'read')")"
check 'gallery_art rejected' '23514 new row for relation "inquiries" violates check constraint "inquiries_inquiry_type_check"' \
  "$(run_anon "INSERT INTO public.inquiries (name, email, message, inquiry_type) VALUES ('Ada', 'ada@example.com', 'nope', 'gallery_art')")"
check 'regenerative_join rejected' '23514 new row for relation "inquiries" violates check constraint "inquiries_inquiry_type_check"' \
  "$(run_anon "INSERT INTO public.inquiries (name, email, message, inquiry_type) VALUES ('Ada', 'ada@example.com', 'nope', 'regenerative_join')")"
check 'oversized name denied' '42501 new row violates row-level security policy for table "inquiries"' \
  "$(run_anon "INSERT INTO public.inquiries (name, email, message, inquiry_type) VALUES (repeat('n', 201), 'ada@example.com', 'nope', 'general')")"
check 'short email denied' '42501 new row violates row-level security policy for table "inquiries"' \
  "$(run_anon "INSERT INTO public.inquiries (name, email, message, inquiry_type) VALUES ('Ada', 'a@', 'nope', 'general')")"
check 'returning denied' '42501 permission denied for table inquiries' \
  "$(run_anon "INSERT INTO public.inquiries (name, email, message, inquiry_type) VALUES ('Leak', 'leak@example.com', 'should not land', 'general') RETURNING id, email, message")"
check 'anon select denied' '42501 permission denied for table inquiries' \
  "$(run_anon "SELECT email FROM public.inquiries")"
check 'anon update denied' '42501 permission denied for table inquiries' \
  "$(run_anon "UPDATE public.inquiries SET status = 'read'")"
check 'anon delete denied' '42501 permission denied for table inquiries' \
  "$(run_anon "DELETE FROM public.inquiries")"

LEAK=$("${PSQL[@]}" -c "SELECT count(*) FROM public.inquiries WHERE email = 'leak@example.com';")
check 'returning did not insert' '0' "$LEAK"
ROWS=$("${PSQL[@]}" -c "SELECT count(*) FROM public.inquiries;")
check 'four valid anon rows stored' '4' "$ROWS"

"${PSQL[@]}" << 'SQL' >/dev/null
INSERT INTO auth.users (id, email) VALUES ('11111111-1111-1111-1111-111111111111', 'admin@example.com');
INSERT INTO public.studio_admins (user_id) VALUES ('11111111-1111-1111-1111-111111111111');
SQL

echo '--- authorized roles ---'
ADMIN_COUNT=$("${PSQL[@]}" << 'SQL'
SELECT set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', false);
SET ROLE authenticated;
SELECT count(*) FROM public.inquiries;
RESET ROLE;
SQL
)
# set_config prints the uuid before the count. Keep the last line.
ADMIN_COUNT=$(printf '%s\n' "$ADMIN_COUNT" | tail -n 1)
check 'studio admin can read rows' '4' "$ADMIN_COUNT"

ADMIN_UPDATE=$("${PSQL[@]}" << 'SQL'
SELECT set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', false);
SET ROLE authenticated;
SELECT public._try($c$UPDATE public.inquiries SET status = 'read' WHERE message = 'valid omit status'$c$);
SELECT status FROM public.inquiries WHERE message = 'valid omit status';
RESET ROLE;
SQL
)
check 'studio admin can update' 'OK' "$(printf '%s\n' "$ADMIN_UPDATE" | tail -n 2 | head -n 1)"
check 'studio admin update persists' 'read' "$(printf '%s\n' "$ADMIN_UPDATE" | tail -n 1)"

NONADMIN=$("${PSQL[@]}" << 'SQL'
SELECT set_config('request.jwt.claim.sub', '22222222-2222-2222-2222-222222222222', false);
SET ROLE authenticated;
SELECT count(*) FROM public.inquiries;
RESET ROLE;
SQL
)
check 'non-admin sees no rows' '0' "$(printf '%s\n' "$NONADMIN" | tail -n 1)"

NONADMIN_INSERT=$("${PSQL[@]}" << 'SQL'
SELECT set_config('request.jwt.claim.sub', '22222222-2222-2222-2222-222222222222', false);
SET ROLE authenticated;
SELECT public._try($c$INSERT INTO public.inquiries (name, email, message, inquiry_type) VALUES ('User', 'user@example.com', 'member insert', 'workshop')$c$);
RESET ROLE;
SQL
)
check 'non-admin valid insert' 'OK' "$(printf '%s\n' "$NONADMIN_INSERT" | tail -n 1)"

echo "RESULT: ${PASS} passed, ${FAIL} failed, $((PASS + FAIL)) total"
[[ "$FAIL" -eq 0 ]]
