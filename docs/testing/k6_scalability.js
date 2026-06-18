// Q10 Phase 4 — Scalability & Throughput
// Measures the scaling curve between stability (~200 VUs / ~312 TPS) and destruction (~875 VUs).
// Also runs bottleneck elimination tests and horizontal scaling tests.
//
// Usage:
//   1. Baseline scaling curve:  k6 run docs/testing/k6_scalability.js
//   2. Rate limiter bypassed:   k6 run docs/testing/k6_scalability.js -e SCENARIO=no-rate-limit
//   3. DB pool increased:       k6 run docs/testing/k6_scalability.js -e SCENARIO=pool-50
//   4. Both bypassed:           k6 run docs/testing/k6_scalability.js -e SCENARIO=unleashed
//   5. Horizontal scaling:      k6 run docs/testing/k6_scalability.js -e SCENARIO=horizontal -e LB_URL=http://localhost:3100,http://localhost:3101
//   6. Resource sat tracking:   k6 run docs/testing/k6_scalability.js -e SCENARIO=resource-trace
//
// Requires: next start (production build) running on http://localhost:3000

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// ── Custom metrics ───────────────────────────────────────────────────
const failRate      = new Rate('failures');
const successRate   = new Rate('successes');
const latency       = new Trend('latency_ms');
const tpsCounter    = new Counter('tps_counter');
const p50Trend      = new Trend('p50_ms');
const p95Trend      = new Trend('p95_ms');
const p99Trend      = new Trend('p99_ms');

// ── Configuration ────────────────────────────────────────────────────
const SCENARIO     = __ENV.SCENARIO || 'scaling-curve';
const BASE_URL     = __ENV.BASE_URL || 'http://localhost:3000';

// If LB_URL is set (comma-separated), we round-robin across instances
const LB_URLS = (__ENV.LB_URL || '').split(',').filter(Boolean).length > 0
  ? (__ENV.LB_URL || '').split(',').filter(Boolean)
  : null;

// Determine which endpoints to hit based on scenario
// /api/health is pure JSON, no rate limiting, no auth — clean throughput
const ENDPOINTS = {
  health: { method: 'GET', path: '/api/health' },
};

// ── SCALING CURVE — 10 evenly-spaced concurrency points ──────────────
// From saturation floor (~100) to crash ceiling (~875)
// Hold each level for 60s to get stable TPS measurement
const SCALING_POINTS = [100, 200, 300, 400, 500, 600, 700, 800, 850, 875];

function buildScalingCurveStages() {
  const stages = [];
  // Warm-up: gently climb to first point
  stages.push({ target: SCALING_POINTS[0], duration: '10s' });
  stages.push({ target: SCALING_POINTS[0], duration: '30s' });

  for (let i = 1; i < SCALING_POINTS.length; i++) {
    const target = SCALING_POINTS[i];
    stages.push({ target: target, duration: '5s' });  // Ramp up
    stages.push({ target: target, duration: '30s' });  // Hold for stable TPS
  }

  // Cool-down
  stages.push({ target: 0, duration: '15s' });
  return stages;
}

function buildResourceTraceStages() {
  // Focused on slower ramps with resource measurement gaps
  const stages = [];
  const resPoints = [50, 100, 200, 300, 400, 500, 600, 700, 800, 850];
  for (const vus of resPoints) {
    stages.push({ target: vus, duration: '10s' });
    stages.push({ target: vus, duration: '60s' });  // Longer hold for resource tracking
  }
  stages.push({ target: 0, duration: '15s' });
  return stages;
}

function buildBottleneckBreakStages() {
  // Push higher to find the unconstrained ceiling
  const points = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
  const stages = [];
  stages.push({ target: points[0], duration: '10s' });
  stages.push({ target: points[0], duration: '30s' });
  for (let i = 1; i < points.length; i++) {
    stages.push({ target: points[i], duration: '5s' });
    stages.push({ target: points[i], duration: '30s' });
  }
  stages.push({ target: 0, duration: '15s' });
  return stages;
}

// ── Options per scenario ─────────────────────────────────────────────
export const options = (() => {
  switch (SCENARIO) {
    case 'scaling-curve':
      return {
        stages: buildScalingCurveStages(),
        thresholds: {
          'failures': ['rate<0.30'],
          'http_req_duration': ['p(95)<30000'],
        },
        noConnectionReuse: false,
      };

    case 'no-rate-limit':
      // Rate limiter already bypassed by using /api/health endpoint
      // This test measures the same curve as baseline for comparison
      return {
        stages: buildScalingCurveStages(),
        thresholds: {
          'failures': ['rate<0.30'],
          'http_req_duration': ['p(95)<30000'],
        },
        noConnectionReuse: false,
      };

    case 'pool-50':
      // With DB_POOL_MAX=50 — run server with this env var
      return {
        stages: buildScalingCurveStages(),
        thresholds: {
          'failures': ['rate<0.30'],
          'http_req_duration': ['p(95)<30000'],
        },
        noConnectionReuse: false,
      };

    case 'unleashed':
      // Both rate limiter bypassed + pool=50
      return {
        stages: buildBottleneckBreakStages(),
        thresholds: {
          'failures': ['rate<0.50'],
          'http_req_duration': ['p(95)<30000'],
        },
        noConnectionReuse: false,
      };

    case 'horizontal':
      // 2 server instances behind LB
      return {
        stages: buildScalingCurveStages(),
        thresholds: {
          'failures': ['rate<0.30'],
          'http_req_duration': ['p(95)<30000'],
        },
        noConnectionReuse: false,
      };

    case 'resource-trace':
      return {
        stages: buildResourceTraceStages(),
        thresholds: {
          'failures': ['rate<0.30'],
          'http_req_duration': ['p(95)<30000'],
        },
        noConnectionReuse: false,
      };

    default:
      return {
        stages: buildScalingCurveStages(),
        thresholds: {
          'failures': ['rate<0.30'],
        },
        noConnectionReuse: false,
      };
  }
})();

// ── Round-robin LB picker ─────────────────────────────────────────────
let lbIdx = 0;
function getBaseUrl() {
  if (!LB_URLS) return BASE_URL;
  const url = LB_URLS[lbIdx % LB_URLS.length];
  lbIdx++;
  return url;
}

// ── Per-point TPS tracker ────────────────────────────────────────────
// We group requests by which scaling point they occurred at
let currentPoint = 0;

// ── Main iteration ───────────────────────────────────────────────────
export default function () {
  const baseUrl = getBaseUrl();
  const endpoint = ENDPOINTS.health;
  const headers = {
    'User-Agent': 'k6-q10-p4-scalability',
    'x-forwarded-for': `10.0.${__VU}.1`,
  };

  const start = Date.now();
  const res = http.request(endpoint.method, `${baseUrl}${endpoint.path}`, null, { headers });
  const duration = Date.now() - start;

  latency.add(duration);
  tpsCounter.add(1);

  const status = res.status;
  const isSuccess = status >= 200 && status < 300;
  const isError = status >= 500 || status === 0;

  successRate.add(isSuccess);
  failRate.add(isError || (status >= 400 && status < 500));

  check(res, {
    'health endpoint ok': (r) => r.status === 200 || r.status === 429,
  });

  // Minimal inter-request gap
  sleep(0.01);
}

// ── JSON summary ──────────────────────────────────────────────────────
export function handleSummary(data) {
  const m = data.metrics;
  const dur = m.http_req_duration?.values || {};
  const totalReqs = m.http_reqs?.values?.count || 0;
  const avgTps = Math.round((m.http_reqs?.values?.rate || 0) * 100) / 100;
  const successRate = m.successes?.values?.rate || 0;
  const failureRate = m.failures?.values?.rate || 0;

  // Per-scaling-point TPS by time segments (approximate)
  // We can estimate from stage durations
  const totalDurationSec = (data.state?.testRunDuration || 0) / 1000;

  return {
    'stdout': JSON.stringify({
      phase: 'Q10_P4_SCALABILITY',
      scenario: SCENARIO,
      base_url: BASE_URL,
      lb_urls: LB_URLS,
      scaling_points_tested: SCALING_POINTS,
      summary: {
        total_requests:    totalReqs,
        test_duration_s:   Math.round(totalDurationSec),
        avg_tps:           avgTps,
        avg_duration_ms:   Math.round((dur.avg || 0) * 1000),
        p50_ms:            Math.round((dur.p50 || 0) * 1000),
        p95_ms:            Math.round((dur.p95 || 0) * 1000),
        p99_ms:            Math.round((dur.p99 || 0) * 1000),
        max_ms:            Math.round((dur.max || 0) * 1000),
        min_ms:            Math.round((dur.min || 0) * 1000),
        success_rate:      Math.round(successRate * 1000) / 10,
        failure_rate:      Math.round(failureRate * 1000) / 10,
        max_vus:           m.vus_max?.values?.value || 0,
        http_req_failed:   Math.round((m.http_req_failed?.values?.rate || 0) * 1000) / 10,
      },
      scaling_curve: {
        points: SCALING_POINTS,
        note: 'Each point held for 30s stable measurement. TPS values are aggregate average over entire run. Per-point breakdown requires k6 output per-stage tagging (not implemented in pure JS).',
      },
      scenario_note: SCENARIO === 'scaling-curve' ? 'Baseline — default server (DB pool=20, rate limiter active on /api/listings but /api/health has no rate limit)' :
                      SCENARIO === 'no-rate-limit' ? 'Rate limiter bypassed — /api/health has no rate limit, this is the same as baseline for comparison' :
                      SCENARIO === 'pool-50' ? 'DB_POOL_MAX=50 — server started with increased pool' :
                      SCENARIO === 'unleashed' ? 'Both bypassed — rate limiter off + DB pool=50' :
                      SCENARIO === 'horizontal' ? 'Horizontal scaling — 2 server instances behind round-robin' :
                      SCENARIO === 'resource-trace' ? 'Resource saturation trace — longer holds for /proc monitoring' :
                      'Unknown scenario',
    }, null, 2),
  };
}
