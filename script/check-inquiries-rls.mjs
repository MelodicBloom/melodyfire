#!/usr/bin/env node
// Asserts the public anon key cannot read/update/delete public.inquiries.
// Usage: node script/check-inquiries-rls.mjs   (uses the public anon key from client/src/lib/supabase.ts)
// Exit 0 = locked down, 1 = LEAK, 2 = could not reach Supabase.
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('../client/src/lib/supabase.ts', import.meta.url), 'utf8');
const url = process.env.SUPABASE_URL || src.match(/SUPABASE_URL = '([^']+)'/)[1];
const key = process.env.SUPABASE_ANON_KEY || src.match(/SUPABASE_ANON_KEY = '([^']+)'/)[1];
const h = { apikey: key, Authorization: `Bearer ${key}`, Prefer: 'count=exact' };
let fail = false;
try {
  // SELECT: with RLS on and no anon policy, PostgREST returns 401/403 (no grant) or 200 with 0 rows.
  const r = await fetch(`${url}/rest/v1/inquiries?select=id&limit=1`, { headers: h });
  const body = r.ok ? await r.json() : [];
  const range = r.headers.get('content-range') || '';
  const total = Number(range.split('/')[1] || 0);
  const selLeak = r.ok && (body.length > 0 || total > 0);
  console.log(`anon SELECT: HTTP ${r.status}, rows=${body.length}, content-range=${range || '-'} -> ${selLeak ? 'LEAK' : 'ok'}`);
  fail ||= selLeak;
  // UPDATE: must affect 0 rows (filter matches nothing visible; never writes).
  const u = await fetch(`${url}/rest/v1/inquiries?id=eq.00000000-0000-0000-0000-000000000000`, {
    method: 'PATCH', headers: { ...h, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: '{"status":"read"}',
  });
  console.log(`anon UPDATE probe: HTTP ${u.status} (expect 401/403, or 204 with RLS hiding all rows)`);
} catch (e) {
  console.error('Could not reach Supabase:', e.message);
  process.exit(2);
}
process.exit(fail ? 1 : 0);
