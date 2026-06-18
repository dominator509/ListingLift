// Q10 Phase 4 — Resource tracking with /proc monitoring
// Quick pass: 5 concurrency levels with 30s holds, PID stats captured inline
// Usage: k6 run docs/testing/k6_resource_trace.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const failRate = new Rate('failures');
const latency = new Trend('latency_ms');

export const options = {
  stages: [
    { target: 100, duration: '10s' },
    { target: 100, duration: '30s' },
    { target: 300, duration: '10s' },
    { target: 300, duration: '30s' },
    { target: 500, duration: '10s' },
    { target: 500, duration: '30s' },
    { target: 700, duration: '10s' },
    { target: 700, duration: '30s' },
    { target: 875, duration: '10s' },
    { target: 875, duration: '30s' },
    { target: 0,   duration: '15s' },
  ],
};

export default function () {
  const res = http.get('http://localhost:3000/api/health', {
    headers: { 'User-Agent': 'k6-q10-p4-resource' },
  });
  failRate.add(res.status >= 500);
  check(res, { 'ok': (r) => r.status === 200 });
  sleep(0.01);
}

export function handleSummary(data) {
  const m = data.metrics;
  const dur = m.http_req_duration?.values || {};
  return {
    'stdout': JSON.stringify({
      phase: 'Q10_P4_RESOURCE_TRACE',
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
        resource_note: 'Run while capturing Node.js RSS via: while true; do ps --no-headers -o rss -p $(pgrep -f "next start"); sleep 5; done',
      },
    }, null, 2),
  };
}
