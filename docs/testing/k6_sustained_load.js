// Q10 Phase 2 — Sustained Concurrency / Expected Load
// Honest measurement: what actually works, what blocks, and WHERE it breaks.
//
// Usage: k6 run docs/testing/k6_sustained_load.js
// Requires: next dev server running on http://localhost:3100

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// ── Custom metrics ───────────────────────────────────────────────────
const failRate       = new Rate('failures');
const successRate    = new Rate('successes');
const rateLimited    = new Rate('rate_limited');
const authBlocked    = new Rate('auth_blocked');
const latency        = new Trend('latency_ms');

// ── Configuration ────────────────────────────────────────────────────
const BASE_URL = 'http://localhost:3100';

// ── Test scenarios ───────────────────────────────────────────────────
// Each VU cycles through these routes round-robin.
// We accurately classify each response to avoid false failure counts.

const SCENARIOS = [
  // S1: Public, no-auth routes (these actually work)
  { name: 'health',  method: 'GET', path: '/api/health' },

  // S2: Rate-limited public route (shows B-04 in action)
  { name: 'listings', method: 'GET', path: '/api/listings' },

  // S3-S9: Auth-protected routes — exercise the full middleware+route chain
  // These return 401 (auth required) but that's valid: the request lifecycle
  // (middleware, routing, auth resolution) is fully exercised.
  { name: 'csrf-token',   method: 'GET',  path: '/api/csrf/token',
    headers: { 'x-demo-user-id': 'demo-u1', 'x-demo-organization-id': 'demo-o1', 'x-demo-role': 'admin' } },
  { name: 'uploads-get',  method: 'GET',  path: '/api/uploads',
    headers: { 'x-demo-user-id': 'demo-u1', 'x-demo-organization-id': 'demo-o1', 'x-demo-role': 'admin' } },
  { name: 'uploads-post', method: 'POST', path: '/api/uploads',
    headers: { 'x-demo-user-id': 'demo-u1', 'x-demo-organization-id': 'demo-o1', 'x-demo-role': 'admin',
               'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: 'loadtest.jpg', size: 102400 }) },
  { name: 'v1-jobs-list', method: 'GET',  path: '/api/v1/jobs',
    headers: { 'x-demo-user-id': 'demo-u1', 'x-demo-organization-id': 'demo-o1', 'x-demo-role': 'admin' } },
  { name: 'v1-job-create', method: 'POST', path: '/api/v1/jobs',
    headers: { 'x-demo-user-id': 'demo-u1', 'x-demo-organization-id': 'demo-o1', 'x-demo-role': 'admin',
               'Content-Type': 'application/json' },
    body: JSON.stringify({ sourceChannel: 'api', clientEmail: 'loadtest@example.com', packageKey: 'quick-cleanup' }) },
  { name: 'sales-import', method: 'POST', path: '/api/sales-channels/import',
    headers: { 'x-demo-user-id': 'demo-u1', 'x-demo-organization-id': 'demo-o1', 'x-demo-role': 'admin',
               'Content-Type': 'application/json' },
    body: JSON.stringify({ salesChannel: 'api', orders: [{ externalId: 'ord-001', clientEmail: 't@t.com' }] }) },
  { name: 'health-json',  method: 'GET',  path: '/api/health' },
];

// ── Stages: graduated ramp 10→50→100→200, hold each 60s ─────────────
export const options = {
  stages: [
    { target: 10,  duration: '30s' },   // Warm-up
    { target: 10,  duration: '60s' },   // Hold 10 cc
    { target: 50,  duration: '30s' },   // Ramp 10→50
    { target: 50,  duration: '60s' },   // Hold 50 cc
    { target: 100, duration: '30s' },   // Ramp 50→100
    { target: 100, duration: '60s' },   // Hold 100 cc
    { target: 200, duration: '30s' },   // Ramp 100→200
    { target: 200, duration: '60s' },   // Hold 200 cc — find breaking point
    { target: 0,   duration: '30s' },   // Cool-down
  ],
  thresholds: {
    'failures':    ['rate<0.25'],  // Allow 401/429 as baseline noise
    'http_req_duration': ['p(95)<15000'],
  },
  noConnectionReuse: false,
};

// ── Round-robin picker ───────────────────────────────────────────────
let idx = 0;
function pick() {
  const s = SCENARIOS[idx % SCENARIOS.length];
  idx++;
  return s;
}

// ── Main iteration ───────────────────────────────────────────────────
export default function () {
  const s = pick();
  const headers = { 'User-Agent': 'k6-q10-p2', ...(s.headers || {}) };
  const start = Date.now();

  const res = http.request(s.method, `${BASE_URL}${s.path}`, s.body || null, { headers });

  const duration = Date.now() - start;
  latency.add(duration);

  const status = res.status;
  const isSuccess = status >= 200 && status < 300;
  const isRateLimited = status === 429;
  const isAuthBlocked = status === 401 || status === 403;
  const isError = status >= 500;

  successRate.add(isSuccess);
  rateLimited.add(isRateLimited);
  authBlocked.add(isAuthBlocked);
  failRate.add(isError || (status >= 400 && !isRateLimited && !isAuthBlocked));

  check(res, {
    [`${s.name} handled`]: (r) => r.status < 500,
  });

  // Minimal inter-request gap
  sleep(0.05);
}

// ── JSON summary ──────────────────────────────────────────────────────
export function handleSummary(data) {
  const m = data.metrics;
  const dur = m.http_req_duration?.values || {};
  return {
    'stdout': JSON.stringify({
      phase: 'Q10_P2_SUSTAINED',
      start: new Date(data.state?.testRunStart || Date.now()).toISOString(),
      summary: {
        total_requests:  m.http_reqs?.values?.count || 0,
        avg_tps:         Math.round((m.http_reqs?.values?.rate || 0) * 100) / 100,
        avg_duration_ms: Math.round((dur.avg || 0) * 1000),
        p50_ms:          Math.round((dur.p50 || 0) * 1000),
        p95_ms:          Math.round((dur.p95 || 0) * 1000),
        p99_ms:          Math.round((dur.p99 || 0) * 1000),
        max_ms:          Math.round((dur.max || 0) * 1000),
        success_rate:    Math.round((m.successes?.values?.rate || 0) * 1000) / 10,
        rate_limited:    Math.round((m.rate_limited?.values?.rate || 0) * 1000) / 10,
        auth_blocked:    Math.round((m.auth_blocked?.values?.rate || 0) * 1000) / 10,
        failure_rate:    Math.round((m.failures?.values?.rate || 0) * 1000) / 10,
        max_vus:         m.vus_max?.values?.value || 0,
      },
      targets: ['10-cc', '50-cc', '100-cc', '200-cc'],
      routes: SCENARIOS.map(s => s.name),
      note: 'Auth-protected routes return 401 (expected — no bearer token in load test). Rate-limited routes return 429 (expected — 60 req/min/IP cap). Only health endpoint returns 200.',
    }, null, 2),
  };
}
