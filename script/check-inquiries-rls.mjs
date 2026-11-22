#!/usr/bin/env node
// Asserts the public anon key cannot read/update public.inquiries.
// Usage: node script/check-inquiries-rls.mjs   (uses the public anon key from client/src/lib/supabase.ts)
// Exit 0 = locked down, 1 = LEAK, 2 = could not verify (network error or unexpected response).
// Fail-closed: SELECT ok = 42501 denial or a validated empty result; UPDATE ok = 42501 ONLY.
// PGRST301-303 and HTTP denials without a permission code are UNVERIFIED (exit 2).
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('../client/src/lib/supabase.ts', import.meta.url), 'utf8');
const url = process.env.SUPABASE_URL || src.match(/SUPABASE_URL = '([^']+)'/)?.[1];
const key = process.env.SUPABASE_ANON_KEY || src.match(/SUPABASE_ANON_KEY = '([^']+)'/)?.[1];
if (!url || !key) { console.error('Missing SUPABASE_URL / SUPABASE_ANON_KEY'); process.exit(2); }
const h = { apikey: key, Authorization: `Bearer ${key}`, Prefer: 'count=exact' };
const DENIED = new Set([401, 403]);
let leak = false;
let unverified = false;

async function jsonBody(response) {
  try { return await response.clone().json(); } catch { return null; }
}

function permissionDeniedBody(body) {
  return body?.code === '42501' || body?.error?.code === '42501';
}

function authFailureBody(body) {
  const code = body?.code || body?.error?.code;
  return typeof code === 'string' && /^PGRST30[123]$/.test(code);
}

function deniedVerdict(status, body) {
  if (!DENIED.has(status)) return null;
  if (permissionDeniedBody(body)) return 'ok (permission denied)';
  if (authFailureBody(body)) return 'UNVERIFIED (PostgREST authentication failure)';
  return 'UNVERIFIED (HTTP denial without permission-denied evidence)';
}
try {
  // SELECT: locked down = 401/403, or 200 with a JSON array of 0 rows and total 0.
  const r = await fetch(`${url}/rest/v1/inquiries?select=id&limit=1`, { headers: h });
  const range = r.headers.get('content-range') || '';
  let verdict;
  const selectBody = await jsonBody(r);
  const denied = deniedVerdict(r.status, selectBody);
  if (denied) {
    verdict = denied;
    if (denied.startsWith('UNVERIFIED')) unverified = true;
  }
  else if (r.status === 200) {
    const body = await r.json().catch(() => null);
    const totalStr = range.split('/')[1];
    const total = /^[0-9]+$/.test(totalStr ?? '') ? Number(totalStr) : NaN;
    if (!Array.isArray(body) || Number.isNaN(total)) { verdict = 'UNVERIFIED (unexpected body/content-range)'; unverified = true; }
    else if (body.length > 0 || total > 0) { verdict = 'LEAK'; leak = true; }
    else verdict = 'ok (0 rows visible)';
  } else { verdict = `UNVERIFIED (unexpected HTTP ${r.status})`; unverified = true; }
  console.log(`anon SELECT: HTTP ${r.status}, content-range=${range || '-'} -> ${verdict}${selectBody?.code ? `, code=${selectBody.code}` : ''}`);

  // UPDATE: ONLY an explicit 401/403 counts as locked down.
  // The filter targets the zero UUID so the probe never writes a real row. Because of that, a 2xx with
  // 0 rows affected is AMBIGUOUS: PostgREST returns the same response whether RLS filtered the row
  // out (denied) or the UPDATE was permitted but simply matched nothing. Such results are UNVERIFIED
  // (exit 2), never green. 2xx with rows affected is a LEAK (exit 1).
  const u = await fetch(`${url}/rest/v1/inquiries?id=eq.00000000-0000-0000-0000-000000000000`, {
    method: 'PATCH', headers: { ...h, 'Content-Type': 'application/json', Prefer: 'return=minimal,count=exact' }, body: '{"status":"read"}',
  });
  const uRange = u.headers.get('content-range') || '';
  const uTotal = uRange.split('/')[1];
  const uCount = /^[0-9]+$/.test(uTotal ?? '') ? Number(uTotal) : NaN;
  let uVerdict;
  const updateBody = await jsonBody(u);
  const deniedUpdate = deniedVerdict(u.status, updateBody);
  if (deniedUpdate) {
    uVerdict = deniedUpdate;
    if (deniedUpdate.startsWith('UNVERIFIED')) unverified = true;
  }
  else if (u.status >= 200 && u.status < 300 && uCount > 0) { uVerdict = 'LEAK (rows affected)'; leak = true; }
  else if (u.status >= 200 && u.status < 300) { uVerdict = 'UNVERIFIED (2xx with 0/unknown rows: cannot distinguish RLS denial from empty match)'; unverified = true; }
  else { uVerdict = `UNVERIFIED (unexpected HTTP ${u.status})`; unverified = true; }
  console.log(`anon UPDATE probe: HTTP ${u.status}, content-range=${uRange || '-'} -> ${uVerdict}${updateBody?.code ? `, code=${updateBody.code}` : ''}`);
} catch (e) {
  console.error('Could not reach Supabase:', e.message);
  process.exit(2);
}
process.exit(leak ? 1 : unverified ? 2 : 0);
