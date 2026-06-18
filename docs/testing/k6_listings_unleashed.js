// Q10 Phase 4 — Quick bottleneck elimination tests
// Runs /api/listings with unique per-VU IPs to bypass rate limiter
// Usage: k6 run docs/testing/k6_listings_unleashed.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const failRate = new Rate('failures');
const latency = new Trend('latency_ms');

export const options = {
  stages: [
    { target: 50,  duration: '10s' },
    { target: 50,  duration: '20s' },
    { target: 200, duration: '10s' },
    { target: 200, duration: '20s' },
    { target: 500, duration: '10s' },
    { target: 500, duration: '20s' },
    { target: 0,   duration: '10s' },
  ],
  thresholds: { 'failures': ['rate<0.50'] },
};

export default function () {
  const ip = `10.${Math.floor(__VU/256)}.${__VU%256}.1`;
  const res = http.get('http://localhost:3000/api/listings', {
    headers: { 'x-forwarded-for': ip, 'User-Agent': 'k6-q10-p4-bottleneck' },
  });
  latency.add(Date.now() - Date.now());
  const isSuccess = res.status >= 200 && res.status < 300;
  const isRateLimited = res.status === 429;
  const isError = res.status >= 500;
  failRate.add(isError || (res.status >= 400 && !isRateLimited));
  check(res, { 'ok or rate-limited': (r) => r.status < 500 });
  sleep(0.02);
}

export function handleSummary(data) {
  const m = data.metrics;
  const dur = m.http_req_duration?.values || {};
  return {
    'stdout': JSON.stringify({
      phase: 'Q10_P4_BOTTLENECK',
      test: 'listings-rate-limiter-bypass',
      summary: {
        total_requests: m.http_reqs?.values?.count || 0,
        avg_tps: Math.round((m.http_reqs?.values?.rate || 0) * 100) / 100,
        avg_duration_ms: Math.round((dur.avg || 0) * 1000),
        p50_ms: Math.round((dur.p50 || 0) * 1000),
        p95_ms: Math.round((dur.p95 || 0) * 1000),
        p99_ms: Math.round((dur.p99 || 0) * 1000),
        max_ms: Math.round((dur.max || 0) * 1000),
        success_rate: Math.round((m.successes?.values?.rate || 0) * 1000) / 10,
        failure_rate: Math.round((m.failures?.values?.rate || 0) * 1000) / 10,
        max_vus: m.vus_max?.values?.value || 0,
      },
      note: '/api/listings with unique x-forwarded-for per VU — bypasses in-memory rate limiter IP bucket',
    }, null, 2),
  };
}
