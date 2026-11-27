#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
// Local HTTP fixture for script/check-inquiries-rls.mjs.
// Never contacts a hosted database. Exit 0 when every case matches.
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

const script = new URL('./check-inquiries-rls.mjs', import.meta.url);

function listen() {
  const server = createServer((req, res) => {
    const hit = server.nextHit?.(req);
    if (!hit) {
      res.writeHead(500, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ message: `unexpected ${req.method} ${req.url}` }));
      return;
    }
    const headers = { 'content-type': 'application/json', ...(hit.headers || {}) };
    res.writeHead(hit.status, headers);
    res.end(hit.body == null ? '' : JSON.stringify(hit.body));
  });
  return new Promise((resolve, reject) => {
    server.listen(0, '127.0.0.1', () => resolve(server));
    server.on('error', reject);
  });
}

function runProbe(baseUrl) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [fileURLToPath(script)], {
      env: {
        ...process.env,
        SUPABASE_URL: baseUrl,
        SUPABASE_ANON_KEY: 'fixture-anon-key',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let out = '';
    child.stdout.on('data', (chunk) => { out += chunk; });
    child.stderr.on('data', (chunk) => { out += chunk; });
    child.on('close', (code) => resolve({ code, out }));
  });
}

const cases = [
  {
    name: '42501 select and update are locked down',
    hits: [
      { method: 'GET', status: 401, body: { code: '42501', message: 'permission denied for table inquiries' } },
      { method: 'PATCH', status: 403, body: { code: '42501', message: 'new row violates row-level security policy' } },
    ],
    expect: 0,
  },
  {
    name: 'PGRST301 authentication failure stays unverified',
    hits: [
      { method: 'GET', status: 401, body: { code: 'PGRST301', message: 'JWT expired' } },
      { method: 'PATCH', status: 401, body: { code: '42501', message: 'permission denied' } },
    ],
    expect: 2,
  },
  {
    name: 'HTTP denial without a permission code stays unverified',
    hits: [
      { method: 'GET', status: 401, body: { message: 'no code' } },
      { method: 'PATCH', status: 401, body: { code: '42501', message: 'permission denied' } },
    ],
    expect: 2,
  },
  {
    name: 'visible rows are a leak',
    hits: [
      { method: 'GET', status: 200, headers: { 'content-range': '0-0/1' }, body: [{ id: 'row' }] },
      { method: 'PATCH', status: 401, body: { code: '42501', message: 'permission denied' } },
    ],
    expect: 1,
  },
  {
    name: 'empty select is locked down',
    hits: [
      { method: 'GET', status: 200, headers: { 'content-range': '*/0' }, body: [] },
      { method: 'PATCH', status: 401, body: { code: '42501', message: 'permission denied' } },
    ],
    expect: 0,
  },
  {
    name: 'update that affects rows is a leak',
    hits: [
      { method: 'GET', status: 401, body: { code: '42501', message: 'permission denied' } },
      { method: 'PATCH', status: 200, headers: { 'content-range': '0-0/1' }, body: {} },
    ],
    expect: 1,
  },
  {
    name: 'zero-row update stays unverified',
    hits: [
      { method: 'GET', status: 401, body: { code: '42501', message: 'permission denied' } },
      { method: 'PATCH', status: 204, headers: { 'content-range': '*/0' }, body: null },
    ],
    expect: 2,
  },
];

const unreachable = await runProbe('http://nx-probe-does-not-exist-ce09.invalid');
const unreachableOk = unreachable.code === 2
  && unreachable.out.includes('UNVERIFIED (hosted test unavailable, not a pass)')
  && /cause_code=(?:ENOTFOUND|EAI_AGAIN|UND_ERR_SOCKET)(?:\s|$)/.test(unreachable.out);
if (unreachableOk) {
  console.log('PASS unreachable host is unverified, not a pass (exit 2 with a transport error)');
} else {
  console.log(`FAIL unreachable host expected exit 2 and a transport error, got exit ${unreachable.code}`);
  console.log(unreachable.out.trim());
  process.exit(1);
}

const server = await listen();
const { port } = server.address();
const baseUrl = `http://127.0.0.1:${port}`;
let passed = 0;
let failed = 0;
try {
  for (const item of cases) {
    let index = 0;
    server.nextHit = (req) => {
      const expected = item.hits[index];
      if (!expected || req.method !== expected.method) return null;
      index += 1;
      return expected;
    };
    const result = await runProbe(baseUrl);
    const ok = result.code === item.expect;
    if (ok) {
      passed += 1;
      console.log(`PASS ${item.name} (exit ${result.code})`);
    } else {
      failed += 1;
      console.log(`FAIL ${item.name} expected exit ${item.expect} got ${result.code}`);
      console.log(result.out.trim());
    }
  }
} finally {
  server.close();
  await once(server, 'close');
}
const totalPassed = passed + 1;
const total = cases.length + 1;
console.log(`RESULT: ${totalPassed} passed, ${failed} failed, ${total} total`);
process.exit(failed === 0 ? 0 : 1);
