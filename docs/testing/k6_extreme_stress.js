// Q10 Phase 3 — Extreme Stress / Spike Testing
// Destructive. Push until it breaks. Document the exact break.
//
// Usage:
//   1. Spike:  k6 run --vus 500 --duration 30s docs/testing/k6_extreme_stress.js
//   2. Exhaustion: k6 run docs/testing/k6_extreme_stress.js -e SCENARIO=exhaustion
//   3. Per-endpoint: k6 run docs/testing/k6_extreme_stress.js -e SCENARIO=sales-import
//
// Requires: next dev server running on http://localhost:3000

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// ── Custom metrics ───────────────────────────────────────────────────
const failRate       = new Rate('failures');
const successRate    = new Rate('successes');
const rateLimited    = new Rate('rate_limited');
const authBlocked    = new Rate('auth_blocked');
const serverError    = new Rate('server_errors');
const latency        = new Trend('latency_ms');
const totalReqs      = new Counter('total_requests');

// ── Configuration ────────────────────────────────────────────────────
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const SCENARIO = __ENV.SCENARIO || 'spike';

// ── Demo auth headers (to exercise the full auth chain) ──────────────
const DEMO_HEADERS = {
  'x-demo-user-id': 'demo-u1',
  'x-demo-organization-id': 'demo-o1',
  'x-demo-role': 'admin',
};

// ── Route library ────────────────────────────────────────────────────
const ROUTES = {
  // Public, zero-auth routes
  health:        { method: 'GET',  path: '/api/health' },
  listings:      { method: 'GET',  path: '/api/listings' },
  listingsRate:  { method: 'GET',  path: '/api/listings', headers: { 'x-forwarded-for': `${__VU}.0.0.1` } },

  // Auth-protected routes (exercise middleware + auth chain)
  csrfToken:     { method: 'GET',  path: '/api/csrf/token', headers: DEMO_HEADERS },
  uploadsGet:    { method: 'GET',  path: '/api/uploads', headers: DEMO_HEADERS },
  uploadsPost:   { method: 'POST', path: '/api/uploads', headers: { ...DEMO_HEADERS, 'Content-Type': 'application/json' }, body: JSON.stringify({ filename: 'stress-test.jpg', size: 102400 }) },
  v1Jobs:        { method: 'GET',  path: '/api/v1/jobs', headers: DEMO_HEADERS },
  v1JobCreate:   { method: 'POST', path: '/api/v1/jobs', headers: { ...DEMO_HEADERS, 'Content-Type': 'application/json' }, body: JSON.stringify({ sourceChannel: 'api', clientEmail: 'stress@test.com', packageKey: 'quick-cleanup' }) },

  // Known B-02 high-risk route: unbounded import array
  salesImport:   { method: 'POST', path: '/api/sales-channels/import', headers: { ...DEMO_HEADERS, 'Content-Type': 'application/json' }, body: JSON.stringify({ salesChannel: 'api', orders: Array.from({length: 20}, (_,i) => ({ externalId: `ord-${i}`, clientEmail: `test${i}@test.com` })) }) },

  // Auth session resolution pressure routes
  authLogin:     { method: 'POST', path: '/api/auth/login', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: `stress${__VU}@test.com`, password: 'testpass123' }) },
  authMe:        { method: 'GET',  path: '/api/auth/me', headers: DEMO_HEADERS },
  authSession:   { method: 'GET',  path: '/api/auth/session', headers: DEMO_HEADERS },
};

// Weight distribution for mixed traffic
// Health + listings get heavy weight; auth gets moderate; heavy routes get light
const TRAFFIC_WEIGHTS = [
  { route: ROUTES.health,       weight: 15 },
  { route: ROUTES.listings,     weight: 10 },
  { route: ROUTES.csrfToken,    weight: 8 },
  { route: ROUTES.uploadsGet,   weight: 8 },
  { route: ROUTES.uploadsPost,  weight: 5 },
  { route: ROUTES.v1Jobs,       weight: 8 },
  { route: ROUTES.v1JobCreate,  weight: 5 },
  { route: ROUTES.salesImport,  weight: 3 },
  { route: ROUTES.authLogin,    weight: 3 },
  { route: ROUTES.authMe,       weight: 8 },
  { route: ROUTES.authSession,  weight: 8 },
];

function pickWeighted() {
  const total = TRAFFIC_WEIGHTS.reduce((s, e) => s + e.weight, 0);
  let r = Math.random() * total;
  for (const entry of TRAFFIC_WEIGHTS) {
    r -= entry.weight;
    if (r <= 0) return entry.route;
  }
  return TRAFFIC_WEIGHTS[0].route;
}

// ── PER-ENDPOINT SCENARIO SELECTOR ──────────────────────────────────
// Used for targeted endpoint breaking tests
function getEndpointsForScenario(scenario) {
  switch (scenario) {
    case 'sales-import':
      return [ROUTES.salesImport];
    case 'auth':
      return [ROUTES.authLogin, ROUTES.authMe, ROUTES.authSession, ROUTES.csrfToken];
    case 'public':
      return [ROUTES.health, ROUTES.listings];
    case 'api':
      return [ROUTES.v1Jobs, ROUTES.v1JobCreate, ROUTES.uploadsGet, ROUTES.uploadsPost];
    default:
      return null; // mixed traffic
  }
}

// ── SPIKE SCENARIO ────────────────────────────────────────────────────
// RAPID: instant 0→VUs, hit hard, then instant drop
// 3 spike tiers: 500, 1000, 2000
const SPIKE_SCENARIOS = [
  {
    name: 'spike-500',
    vus: 500,
    duration: '30s',
    exec: 'spikeExecutor',
  },
  {
    name: 'spike-1000',
    vus: 1000,
    duration: '30s',
    exec: 'spikeExecutor',
  },
  {
    name: 'spike-2000',
    vus: 2000,
    duration: '30s',
    exec: 'spikeExecutor',
  },
];

// ── EXHAUSTION SCENARIO (stepped ramp until crash) ────────────────────
// Graduated steps: 100→250→500→750→1000→1500→2000, hold each 60s
const EXHAUSTION_STAGES = [
  { target: 100,  duration: '10s' },   // Ramp
  { target: 100,  duration: '60s' },   // Hold
  { target: 250,  duration: '10s' },   // Ramp
  { target: 250,  duration: '60s' },   // Hold
  { target: 500,  duration: '10s' },   // Ramp
  { target: 500,  duration: '60s' },   // Hold
  { target: 750,  duration: '10s' },   // Ramp
  { target: 750,  duration: '60s' },   // Hold
  { target: 1000, duration: '10s' },   // Ramp
  { target: 1000, duration: '60s' },   // Hold
  { target: 1500, duration: '10s' },   // Ramp
  { target: 1500, duration: '60s' },   // Hold
  { target: 2000, duration: '10s' },   // Ramp
  { target: 2000, duration: '60s' },   // Hold — should break by here
  { target: 0,    duration: '30s' },   // Cool-down
];

// ── DEGRADATION CURVE (find P95 > 10s, P99 > 30s) ────────────────────
const DEGRADATION_STAGES = [
  { target: 10,   duration: '30s' },
  { target: 50,   duration: '60s' },
  { target: 100,  duration: '60s' },
  { target: 200,  duration: '60s' },
  { target: 300,  duration: '60s' },
  { target: 500,  duration: '60s' },
  { target: 750,  duration: '60s' },
  { target: 1000, duration: '60s' },
  { target: 1500, duration: '60s' },
  { target: 2000, duration: '60s' },
  { target: 0,    duration: '30s' },
];

// ── Options by scenario ───────────────────────────────────────────────
export const options = (() => {
  switch (SCENARIO) {
    case 'spike':
      return {
        scenarios: {
          'spike-500':  { executor: 'constant-vus', vus: 500,  duration: '30s', gracefulStop: '10s' },
          'spike-1000': { executor: 'constant-vus', vus: 1000, duration: '30s', gracefulStop: '10s', startTime: '40s' },
          'spike-2000': { executor: 'constant-vus', vus: 2000, duration: '30s', gracefulStop: '10s', startTime: '120s' },
        },
        thresholds: {
          'server_errors': ['rate<0.50'],
          'http_req_duration': ['p(95)<30000'],
        },
      };

    case 'exhaustion':
      return {
        stages: EXHAUSTION_STAGES,
        thresholds: {
          'server_errors': ['rate<0.75'],     // We *expect* failure, but document it
          'failures': ['rate<0.90'],
        },
      };

    case 'degradation':
      return {
        stages: DEGRADATION_STAGES,
        thresholds: {
          'server_errors': ['rate<0.50'],
        },
        noConnectionReuse: false,
      };

    case 'sales-import':
      // Per-endpoint: hammer /api/sales-channels/import with increasing payloads
      return {
        stages: [
          { target: 10,   duration: '10s' },
          { target: 10,   duration: '30s' },
          { target: 50,   duration: '10s' },
          { target: 50,   duration: '30s' },
          { target: 100,  duration: '10s' },
          { target: 100,  duration: '30s' },
          { target: 200,  duration: '10s' },
          { target: 200,  duration: '30s' },
          { target: 0,    duration: '10s' },
        ],
        thresholds: {
          'server_errors': ['rate<0.50'],
        },
      };

    case 'auth':
      return {
        stages: [
          { target: 50,   duration: '10s' },
          { target: 50,   duration: '30s' },
          { target: 200,  duration: '10s' },
          { target: 200,  duration: '30s' },
          { target: 500,  duration: '10s' },
          { target: 500,  duration: '30s' },
          { target: 1000, duration: '10s' },
          { target: 1000, duration: '30s' },
          { target: 0,    duration: '10s' },
        ],
        thresholds: {
          'server_errors': ['rate<0.30'],
        },
      };

    default:
      return {
        stages: [
          { target: 100,  duration: '30s' },
          { target: 500,  duration: '30s' },
          { target: 1000, duration: '30s' },
          { target: 0,    duration: '10s' },
        ],
        thresholds: {
          'server_errors': ['rate<0.50'],
        },
      };
  }
})();

// ── SCENARIO EXECUTORS ────────────────────────────────────────────────

// Default: mixed traffic with weighted routing
export default function () {
  const route = SCENARIO === 'sales-import' ? ROUTES.salesImport :
                SCENARIO === 'auth' ? (() => {
                  const authRoutes = [ROUTES.authLogin, ROUTES.authMe, ROUTES.authSession, ROUTES.csrfToken, ROUTES.uploadsGet];
                  return authRoutes[Math.floor(Math.random() * authRoutes.length)];
                })() :
                SCENARIO === 'public' ? (() => {
                  return Math.random() < 0.5 ? ROUTES.health : ROUTES.listings;
                })() :
                pickWeighted();

  const headers = { 'User-Agent': 'k6-q10-p3-extreme', ...(route.headers || {}) };
  const url = `${BASE_URL}${route.path}`;
  const start = Date.now();

  const res = http.request(route.method, url, route.body || null, { headers, timeout: '60s' });

  const duration = Date.now() - start;
  latency.add(duration);
  totalReqs.add(1);

  const status = res.status;
  const isSuccess = status >= 200 && status < 300;
  const isRateLimited = status === 429;
  const isAuthBlocked = status === 401 || status === 403;
  const is5xx = status >= 500;

  successRate.add(isSuccess);
  rateLimited.add(isRateLimited);
  authBlocked.add(isAuthBlocked);
  serverError.add(is5xx);
  failRate.add(is5xx || (status >= 400 && !isRateLimited && !isAuthBlocked));

  check(res, {
    'not 5xx': (r) => r.status < 500,
  });

  // Record when we hit 5xx
  if (is5xx) {
    console.log(`5xx|${route.name || route.path}|${status}|VU=${__VU}|dur=${duration}ms`);
  }

  // Minimal inter-request gap for destructive load
  sleep(0.02);
}

// ── JSON summary ──────────────────────────────────────────────────────
export function handleSummary(data) {
  const m = data.metrics;
  const dur = m.http_req_duration?.values || {};
  const iterDur = m.iteration_duration?.values || {};

  // Per-endpoint breakdown
  const endpointNames = ['health', 'listings', 'csrfToken', 'uploadsGet', 'uploadsPost', 'v1Jobs', 'v1JobCreate', 'salesImport', 'authLogin', 'authMe', 'authSession'];
  const epData = {};
  for (const name of endpointNames) {
    const t = m[`http_req_duration{name:${name}}`]?.values;
    if (t) {
      epData[name] = {
        p50_ms: Math.round((t.p(50) || 0) * 1000),
        p95_ms: Math.round((t.p(95) || 0) * 1000),
        p99_ms: Math.round((t.p(99) || 0) * 1000),
        avg_ms: Math.round((t.avg || 0) * 1000),
        max_ms: Math.round((t.max || 0) * 1000),
        count:  m[`http_reqs{name:${name}}`]?.values?.count || 0,
      };
    }
  }

  // Crash detection: check if server is still up
  const serverErrors = m.server_errors?.values?.rate || 0;
  const totalFailed = m.http_req_failed?.values?.rate || 0;
  const totalCount = m.http_reqs?.values?.count || 0;
  const isCrashed = serverErrors > 0.9 && totalCount > 100;

  return {
    'stdout': JSON.stringify({
      phase: 'Q10_P3_EXTREME_STRESS',
      scenario: SCENARIO,
      summary: {
        total_requests:      totalCount,
        avg_tps:             Math.round((m.http_reqs?.values?.rate || 0) * 100) / 100,
        avg_duration_ms:     Math.round((dur.avg || 0) * 1000),
        p50_ms:              Math.round((dur.p50 || 0) * 1000),
        p95_ms:              Math.round((dur.p95 || 0) * 1000),
        p99_ms:              Math.round((dur.p99 || 0) * 1000),
        max_ms:              Math.round((dur.max || 0) * 1000),
        success_rate:        Math.round((m.successes?.values?.rate || 0) * 1000) / 10,
        rate_limited:        Math.round((m.rate_limited?.values?.rate || 0) * 1000) / 10,
        auth_blocked:        Math.round((m.auth_blocked?.values?.rate || 0) * 1000) / 10,
        server_error_rate:   Math.round(serverErrors * 1000) / 10,
        failure_rate:        Math.round((m.failures?.values?.rate || 0) * 1000) / 10,
        max_vus:             m.vus_max?.values?.value || 0,
        server_crashed:      isCrashed,
      },
      per_endpoint: epData,
      degradation_curve: {
        p95_cross_10s_at_vus: null,
        p99_cross_30s_at_vus: null,
      },
      crash_event: isCrashed ? {
        detected: true,
        note: 'Server became unresponsive with >90% error rate. Check recovery window next.',
      } : {
        detected: false,
        note: 'Server survived the full test run without catastrophic failure.',
      },
      bottlenecks_hit: {
        b01_triple_db_query: epData.v1JobCreate?.avg_ms > 500 ? 'Suspected — avg latency suggests DB contention' : 'Not confirmed at this load level',
        b02_unbounded_import: epData.salesImport?.avg_ms > 1000 ? 'Confirmed — sales-import shows elevated latency' : 'Not confirmed',
        b04_inmemory_rate_limiter: rateLimited > 5 ? 'Confirmed — rate limiter engaged at scale' : 'Not confirmed',
        b03_no_cache_headers: 'Inherent — no cache headers degrade all routes equally',
      },
      routes_tested: TRAFFIC_WEIGHTS.map(e => `${e.route.method} ${e.route.path}`),
    }, null, 2),
  };
}
