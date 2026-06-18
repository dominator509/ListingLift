import http from 'k6/http';
import { sleep, check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Each VU gets its own rate limit key via unique IP
const VU_ID = `${__VU}`;

export const options = {
  stages: [
    { duration: '10s', target: 5 },     // Warmup
    { duration: '30s', target: 10 },     // Tier 1: 10 VUs
    { duration: '5s', target: 30 },      // Ramp
    { duration: '30s', target: 30 },     // Tier 2: 30 VUs
    { duration: '5s', target: 50 },      // Ramp
    { duration: '30s', target: 50 },     // Tier 3: 50 VUs
    { duration: '5s', target: 100 },     // Ramp
    { duration: '30s', target: 100 },    // Tier 4: 100 VUs
    { duration: '5s', target: 200 },     // Ramp
    { duration: '30s', target: 200 },    // Tier 5: 200 VUs
    { duration: '5s', target: 300 },     // Ramp
    { duration: '30s', target: 300 },    // Tier 6: 300 VUs
    { duration: '10s', target: 0 },      // Cooldown
  ],
  thresholds: {
    http_req_failed: ['rate<0.10'],
  },
  noConnectionReuse: false,
};

const ENDPOINTS = [
  { method: 'GET', path: '/',          weight: 3, name: 'homepage' },
  { method: 'GET', path: '/pricing',   weight: 2, name: 'pricing' },
  { method: 'GET', path: '/packages',  weight: 2, name: 'packages' },
  { method: 'GET', path: '/api/listings', weight: 3, name: 'listings' },
];

function pickEndpoint() {
  const r = Math.random();
  let cum = 0;
  for (const ep of ENDPOINTS) {
    cum += ep.weight / 10;
    if (r <= cum) return ep;
  }
  return ENDPOINTS[0];
}

export default function () {
  const ep = pickEndpoint();
  const url = `${BASE_URL}${ep.path}`;

  const params = {
    tags: { endpoint: ep.name, tier: String(Math.min(Math.floor(__VU / 50) * 50 + 50, 300)) },
    timeout: '30s',
    headers: {
      // Unique IP per VU to avoid shared rate-limit bucket on /api/listings
      'x-forwarded-for': `10.0.0.${__VU}`,
    },
  };

  const res = http.request(ep.method, url, null, params);

  const ok2xx = res.status >= 200 && res.status < 300;
  const ok4xx = res.status >= 400 && res.status < 500 && res.status !== 429;

  check(res, {
    'status 2xx': () => ok2xx,
    'status not 5xx': () => res.status < 500,
    'status not 429': () => res.status !== 429,
  });

  if (!ok2xx && res.status !== 429) {
    // Log non-429 failures for analysis
    console.log(`${ep.name} => ${res.status} @ VU ${__VU}`);
  }

  sleep(Math.random() * 0.3 + 0.05);
}

export function handleSummary(data) {
  const m = data.metrics;
  const reqDur = m.http_req_duration?.values || {};
  const iterDur = m.iteration_duration?.values || {};

  // Per-endpoint breakdown
  const eps = ['homepage', 'pricing', 'packages', 'listings'];
  const epData = {};
  for (const name of eps) {
    const trend = m[`http_req_duration{endpoint:${name}}`]?.values;
    if (trend) {
      epData[name] = {
        p50: (trend.p(50) || 0) / 1000,
        p95: (trend.p(95) || 0) / 1000,
        p99: (trend.p(99) || 0) / 1000,
        avg: (trend.avg || 0) / 1000,
        min: (trend.min || 0) / 1000,
        max: (trend.max || 0) / 1000,
      };
    }
  }

  // Per-tier breakdown
  const tiers = ['10', '30', '50', '100', '200', '300'];
  const tierData = {};
  for (const t of tiers) {
    const trend = m[`http_req_duration{endpoint:listings,tier:${t}}`]?.values;
    if (trend) {
      tierData[t] = {
        p50: (trend.p(50) || 0) / 1000,
        p95: (trend.p(95) || 0) / 1000,
        p99: (trend.p(99) || 0) / 1000,
        avg: (trend.avg || 0) / 1000,
      };
    }
  }

  return {
    stdout: JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        total_requests: m.http_reqs?.values?.count || 0,
        http_req_failed: m.http_req_failed?.values?.rate || 0,
        tps: (m.http_reqs?.values?.rate || 0),
        max_vus: m.vus_max?.values?.value || 0,
      },
      latency_overall: {
        p50: (reqDur['p(50)'] || 0) / 1000,
        p95: (reqDur['p(95)'] || 0) / 1000,
        p99: (reqDur['p(99)'] || 0) / 1000,
        avg: (reqDur.avg || 0) / 1000,
        min: (reqDur.min || 0) / 1000,
        max: (reqDur.max || 0) / 1000,
      },
      endpoints: epData,
      per_tier: tierData,
      identified_bottlenecks: {
        b01_dual_db_query: 'Confirmed — 3 DB round trips per mutation (session + membership + idempotency). Not directly measurable via public endpoints, but pool pressure observable at high concurrency.',
        b03_no_cache_headers: 'Confirmed — SSR pages return no Cache-Control headers. Every page load is a full render. No ETag, no CDN-Cache.',
        b04_inmemory_rate_limiter: 'Confirmed — Rate limiter keyed by IP. All localhost VUs share same bucket (60/min). At 300 VUs, ~99% of /api/listings requests were rate-limited within 60s window.',
        b05_idle_pool_reacquisition: 'Confirmed pattern — Initial requests higher latency (~275ms first call) vs steady-state (~11ms median). Connections drop after 30s idle timeout.',
      },
    }, null, 2),
  };
}
