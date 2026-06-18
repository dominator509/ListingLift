import http from 'k6/http';
import { sleep, check } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const tpsRate = new Rate('tps_rate');
const latencyHomepage = new Trend('latency_homepage');
const latencyListings = new Trend('latency_listings');
const latencyPricing = new Trend('latency_pricing');
const latencyPackages = new Trend('latency_packages');

// Configuration
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const STAGES = [
  { duration: '30s', target: 10 },   // Warmup
  { duration: '60s', target: 10 },   // Tier 1: 10 concurrent
  { duration: '20s', target: 50 },   // Ramp to 50
  { duration: '60s', target: 50 },   // Tier 2: 50 concurrent
  { duration: '20s', target: 100 },  // Ramp to 100
  { duration: '60s', target: 100 },  // Tier 3: 100 concurrent
  { duration: '20s', target: 200 },  // Ramp to 200
  { duration: '60s', target: 200 },  // Tier 4: 200 concurrent
  { duration: '20s', target: 300 },  // Ramp to 300
  { duration: '60s', target: 300 },  // Tier 5: 300 concurrent
  { duration: '30s', target: 0 },    // Cooldown
];

export const options = {
  stages: STAGES,
  thresholds: {
    http_req_failed: ['rate<0.05'], // Less than 5% errors
  },
  noConnectionReuse: false,
  userAgent: 'ListingLift-LoadTest/1.0',
};

// Route group distribution
const ENDPOINTS = [
  { method: 'GET', path: '/api/listings', weight: 4, name: 'listings' },  // Primary baseline
  { method: 'GET', path: '/', weight: 3, name: 'homepage' },              // SSR
  { method: 'GET', path: '/pricing', weight: 2, name: 'pricing' },        // SSR
  { method: 'GET', path: '/packages', weight: 1, name: 'packages' },      // SSR
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
    timeout: '30s',
  };

  const res = http.request(ep.method, url, null, params);

  // Record per-endpoint latency
  const dur = res.timings.duration;
  switch (ep.name) {
    case 'homepage': latencyHomepage.add(dur); break;
    case 'listings': latencyListings.add(dur); break;
    case 'pricing': latencyPricing.add(dur); break;
    case 'packages': latencyPackages.add(dur); break;
  }

  // Check status
  const statusOk = check(res, {
    [`${ep.name} status 2xx`]: (r) => r.status >= 200 && r.status < 300,
    [`${ep.name} status not 5xx`]: (r) => r.status < 500,
  });

  if (statusOk) {
    tpsRate.add(1);
  }

  // Think time — simulate real user pacing
  sleep(Math.random() * 0.5 + 0.1);
}

export function handleSummary(data) {
  const metrics = {
    timestamp: new Date().toISOString(),
    summary: {
      total_requests: data.metrics.http_reqs?.values?.count || 0,
      iteration_duration_p50: data.metrics.iteration_duration?.values?.p(50) || 0,
      iteration_duration_p95: data.metrics.iteration_duration?.values?.p(95) || 0,
      iteration_duration_p99: data.metrics.iteration_duration?.values?.p(99) || 0,
      http_req_duration_p50: data.metrics.http_req_duration?.values?.p(50) || 0,
      http_req_duration_p95: data.metrics.http_req_duration?.values?.p(95) || 0,
      http_req_duration_p99: data.metrics.http_req_duration?.values?.p(99) || 0,
      http_req_failed_rate: data.metrics.http_req_failed?.values?.rate || 0,
      vus_max: data.metrics.vus_max?.values?.value || 0,
    },
    endpoints: {
      homepage: {
        p50: (data.metrics.latency_homepage?.values?.p(50) || 0) / 1000,
        p95: (data.metrics.latency_homepage?.values?.p(95) || 0) / 1000,
        p99: (data.metrics.latency_homepage?.values?.p(99) || 0) / 1000,
        avg: (data.metrics.latency_homepage?.values?.avg || 0) / 1000,
        min: (data.metrics.latency_homepage?.values?.min || 0) / 1000,
        max: (data.metrics.latency_homepage?.values?.max || 0) / 1000,
      },
      listings: {
        p50: (data.metrics.latency_listings?.values?.p(50) || 0) / 1000,
        p95: (data.metrics.latency_listings?.values?.p(95) || 0) / 1000,
        p99: (data.metrics.latency_listings?.values?.p(99) || 0) / 1000,
        avg: (data.metrics.latency_listings?.values?.avg || 0) / 1000,
        min: (data.metrics.latency_listings?.values?.min || 0) / 1000,
        max: (data.metrics.latency_listings?.values?.max || 0) / 1000,
      },
      pricing: {
        p50: (data.metrics.latency_pricing?.values?.p(50) || 0) / 1000,
        p95: (data.metrics.latency_pricing?.values?.p(95) || 0) / 1000,
        p99: (data.metrics.latency_pricing?.values?.p(99) || 0) / 1000,
        avg: (data.metrics.latency_pricing?.values?.avg || 0) / 1000,
        min: (data.metrics.latency_pricing?.values?.min || 0) / 1000,
        max: (data.metrics.latency_pricing?.values?.max || 0) / 1000,
      },
      packages: {
        p50: (data.metrics.latency_packages?.values?.p(50) || 0) / 1000,
        p95: (data.metrics.latency_packages?.values?.p(95) || 0) / 1000,
        p99: (data.metrics.latency_packages?.values?.p(99) || 0) / 1000,
        avg: (data.metrics.latency_packages?.values?.avg || 0) / 1000,
        min: (data.metrics.latency_packages?.values?.min || 0) / 1000,
        max: (data.metrics.latency_packages?.values?.max || 0) / 1000,
      },
    },
    bottleneck_analysis: {
      saturation_signature: '',
      first_bottleneck: '',
      threshold_crossed_at: 0,
    },
  };

  // Analyze bottleneck signatures
  const reqDur = data.metrics.http_req_duration;
  if (reqDur) {
    const p50 = reqDur.values?.p(50) || 0;
    const p95 = reqDur.values?.p(95) || 0;
    const p99 = reqDur.values?.p(99) || 0;

    if (p99 > 5000) {
      metrics.bottleneck_analysis.saturation_signature = 'CRITICAL — P99 exceeds 5s threshold';
      metrics.bottleneck_analysis.first_bottleneck = 'B-01: DB Connection Pool Exhaustion (likely)';
    } else if (p95 > 2000) {
      metrics.bottleneck_analysis.saturation_signature = 'HIGH — P95 exceeds 2s, connection queuing likely';
      metrics.bottleneck_analysis.first_bottleneck = 'B-01/B-05: Pool saturation or idle connection re-acquisition';
    } else if (p95 > 1000) {
      metrics.bottleneck_analysis.saturation_signature = 'MODERATE — P95 above 1s, rate limiter pressure or memory pressure';
      metrics.bottleneck_analysis.first_bottleneck = 'B-04: In-memory rate limiter eviction or B-03: no caching';
    } else {
      metrics.bottleneck_analysis.saturation_signature = 'HEALTHY — Sub-second P95, no bottleneck triggered';
    }

    // Cross-reference with expected baseline
    if (p50 > 200) {
      metrics.bottleneck_analysis.threshold_crossed_at = Math.round(p50);
    }
  }

  return {
    'stdout': JSON.stringify(metrics, null, 2),
  };
}
