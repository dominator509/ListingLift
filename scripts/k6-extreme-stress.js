import http from 'k6/http';
import { sleep, check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Each VU gets its own IP to avoid shared rate-limiter
export const options = {
  stages: [
    // Spike 1: 0→500 VUs instantly
    { duration: '5s', target: 500 },
    { duration: '30s', target: 500 },
    { duration: '5s', target: 0 },
    // Spike 2: 0→1000 VUs
    { duration: '5s', target: 1000 },
    { duration: '30s', target: 1000 },
    { duration: '5s', target: 0 },
    // Spike 3: 0→2000 VUs
    { duration: '5s', target: 2000 },
    { duration: '30s', target: 2000 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.50'], // Allow 50% failure — we're pushing to break
  },
  noConnectionReuse: false,
};

// Test multiple endpoints to find where each breaks
const ENDPOINTS = [
  { method: 'GET', path: '/', weight: 3, name: 'homepage' },
  { method: 'GET', path: '/api/listings', weight: 3, name: 'listings' },
  { method: 'GET', path: '/pricing', weight: 2, name: 'pricing' },
  { method: 'GET', path: '/packages', weight: 2, name: 'packages' },
];

function pickEndpoint() {
  const total = ENDPOINTS.reduce((s, e) => s + e.weight, 0);
  let r = Math.random() * total;
  for (const ep of ENDPOINTS) {
    r -= ep.weight;
    if (r <= 0) return ep;
  }
  return ENDPOINTS[0];
}

export default function () {
  const ep = pickEndpoint();
  const url = `${BASE_URL}${ep.path}`;

  const params = {
    tags: { endpoint: ep.name },
    timeout: '60s',
    headers: {
      'x-forwarded-for': `10.0.0.${__VU}_spike`,
    },
  };

  const res = http.request(ep.method, url, null, params);
  const ok = res.status >= 200 && res.status < 300;

  check(res, {
    'status 2xx': () => ok,
    'status not 5xx': () => res.status < 500,
  });

  if (!ok && res.status !== 429) {
    console.log(`FAIL[${ep.name}]: ${res.status} @ spike VU ${__VU}`);
  }

  // Minimal think time for max throughput
  sleep(Math.random() * 0.1 + 0.01);
}

export function handleSummary(data) {
  const m = data.metrics;
  const reqDur = m.http_req_duration?.values || {};

  const eps = ['homepage', 'listings', 'pricing', 'packages'];
  const epData = {};
  for (const name of eps) {
    const trend = m[`http_req_duration{endpoint:${name}}`]?.values;
    if (trend) {
      epData[name] = {
        p50: (trend.p(50) || 0) / 1000,
        p95: (trend.p(95) || 0) / 1000,
        p99: (trend.p(99) || 0) / 1000,
        avg: (trend.avg || 0) / 1000,
        fail_rate: m[`http_req_failed{endpoint:${name}}`]?.values?.rate || 0,
      };
    }
  }

  // Detect if server crashed
  const crashed = m.http_reqs?.values?.count < 100;

  return {
    stdout: JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        total_requests: m.http_reqs?.values?.count || 0,
        http_req_failed: m.http_req_failed?.values?.rate || 0,
        tps: (m.http_reqs?.values?.rate || 0),
        max_vus: m.vus_max?.values?.value || 0,
      },
      latency: {
        p50: (reqDur['p(50)'] || 0) / 1000,
        p95: (reqDur['p(95)'] || 0) / 1000,
        p99: (reqDur['p(99)'] || 0) / 1000,
        avg: (reqDur.avg || 0) / 1000,
        min: (reqDur.min || 0) / 1000,
        max: (reqDur.max || 0) / 1000,
      },
      endpoints: epData,
      server_crashed: crashed,
      crash_detected_at_tier: crashed ? 'First spike that failed to serve' : 'No crash detected',
    }, null, 2),
  };
}
