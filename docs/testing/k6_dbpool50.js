// Q10 Phase 4 — DB Pool = 50 test
// Measures /api/listings throughput with DB_POOL_MAX=50
// Usage: k6 run docs/testing/k6_dbpool50.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const failRate = new Rate('failures');

export const options = {
  stages: [
    { target: 50,  duration: '10s' },
    { target: 50,  duration: '20s' },
    { target: 200, duration: '10s' },
    { target: 200, duration: '20s' },
    { target: 400, duration: '10s' },
    { target: 400, duration: '20s' },
    { target: 600, duration: '10s' },
    { target: 600, duration: '20s' },
    { target: 0,   duration: '10s' },
  ],
};

export default function () {
  const ip = `10.${Math.floor(__VU/256)}.${__VU%256}.1`;
  const res = http.get('http://localhost:3000/api/listings', {
    headers: { 'x-forwarded-for': ip, 'User-Agent': 'k6-q10-p4-pool50' },
  });
  failRate.add(res.status >= 500);
  check(res, { 'ok': (r) => r.status < 500 });
  sleep(0.02);
}

export function handleSummary(data) {
  const m = data.metrics;
  const dur = m.http_req_duration?.values || {};
  return {
    'stdout': JSON.stringify({
      phase: 'Q10_P4_DBPOOL50',
      summary: {
        total_requests: m.http_reqs?.values?.count || 0,
        avg_tps: Math.round((m.http_reqs?.values?.rate || 0) * 100) / 100,
        p50_ms: Math.round((dur.p50 || 0) * 1000),
        p95_ms: Math.round((dur.p95 || 0) * 1000),
        max_ms: Math.round((dur.max || 0) * 1000),
        max_vus: m.vus_max?.values?.value || 0,
      },
      note: 'Server started with DB_POOL_MAX=50. All VUs use unique x-forwarded-for to bypass rate limiter.',
    }, null, 2),
  };
}
