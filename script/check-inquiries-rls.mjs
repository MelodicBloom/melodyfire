#!/usr/bin/env node
// Asserts the public anon key cannot read/update public.inquiries.
// Usage: node script/check-inquiries-rls.mjs   (uses the public anon key from client/src/lib/supabase.ts)
// Exit 0 = locked down, 1 = LEAK, 2 = could not verify (network error or unexpected response).
// Fail-closed: only explicit permission-denied responses or a validated empty result count as "ok".
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('../client/src/lib/supabase.ts', import.meta.url), 'utf8');
const url = process.env.SUPABASE_URL || src.match(/SUPABASE_URL = '([^']+)'/)?.[1];
const key = process.env.SUPABASE_ANON_KEY || src.match(/SUPABASE_ANON_KEY = '([^']+)'/)?.[1];
if (!url || !key) { console.error('Missing SUPABASE_URL / SUPABASE_ANON_KEY'); process.exit(2); }
const h = { apikey: key, Authorization: `Bearer ${key}`, Prefer: 'count=exact' };
const DENIED = new Set([401, 403]);
let leak = false;
let unverified = false;
try {
  // SELECT: locked down = 401/403, or 200 with a JSON array of 0 rows and total 0.
  const r = await fetch(`${url}/rest/v1/inquiries?select=id&limit=1`, { headers: h });
  const range = r.headers.get('content-range') || '';
  let verdict;
  if (DENIED.has(r.status)) verdict = 'ok (denied)';
  else if (r.status === 200) {
    const body = await r.json().catch(() => null);
    const totalStr = range.split('/')[1];
    const total = totalStr === undefined || totalStr === '*' ? NaN : Number(totalStr);
    if (!Array.isArray(body) || Number.isNaN(total)) { verdict = 'UNVERIFIED (unexpected body/content-range)'; unverified = true; }
    else if (body.length > 0 || total > 0) { verdict = 'LEAK'; leak = true; }
    else verdict = 'ok (0 rows visible)';
  } else { verdict = `UNVERIFIED (unexpected HTTP ${r.status})`; unverified = true; }
  console.log(`anon SELECT: HTTP ${r.status}, content-range=${range || '-'} -> ${verdict}`);

  // UPDATE: locked down = 401/403, or 204/200 affecting 0 rows. Filter matches no real row; never writes.
  const u = await fetch(`${url}/rest/v1/inquiries?id=eq.00000000-0000-0000-0000-000000000000`, {
    method: 'PATCH', headers: { ...h, 'Content-Type': 'application/json', Prefer: 'return=minimal,count=exact' }, body: '{"status":"read"}',
  });
  const uRange = u.headers.get('content-range') || '';
  const uCount = Number((uRange.split('/')[1] ?? uRange.split('-')[1]) || 0);
  let uVerdict;
  if (DENIED.has(u.status)) uVerdict = 'ok (denied)';
  else if ((u.status === 204 || u.status === 200) && !(uCount > 0)) uVerdict = 'ok (0 rows affected)';
  else if (u.status === 204 || u.status === 200) { uVerdict = 'LEAK (rows affected)'; leak = true; }
  else { uVerdict = `UNVERIFIED (unexpected HTTP ${u.status})`; unverified = true; }
  console.log(`anon UPDATE probe: HTTP ${u.status}, content-range=${uRange || '-'} -> ${uVerdict}`);
} catch (e) {
  console.error('Could not reach Supabase:', e.message);
  process.exit(2);
}
process.exit(leak ? 1 : unverified ? 2 : 0);
