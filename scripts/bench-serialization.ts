#!/usr/bin/env tsx
/**
 * Q13 Phase 1 — Serialization & I/O Profiling Benchmark
 *
 * Micro-benchmarks every serialization/deserialization path found in
 * the ListingLift codebase. Measures overhead in μs using
 * process.hrtime.bigint(), tests payload sizes 1KB, 10KB, 100KB, 1MB,
 * and tracks GC pressure (heap usage before/after).
 *
 * Usage:
 *   npx tsx scripts/bench-serialization.ts [--quick] [--json]
 *
 * Flags:
 *   --quick   Run only 1KB and 100KB payloads, 1 iteration each
 *   --json    Output raw JSON results to stdout (for tooling)
 */

/* eslint-disable no-console */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { createHash } from 'node:crypto';
import { performance, PerformanceObserver } from 'node:perf_hooks';

// ────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────

interface SerializationPath {
  name: string;
  category: 'json_serialize' | 'json_parse' | 'cookie_serialize' | 'cookie_parse' | 'url_search_params' | 'form_data' | 'string_concat' | 'buffer_encode' | 'prisma_json' | 'hash' | 'csv_stringify';
  description: string;
  edge: boolean;   // crosses network boundary (response serialization)
  core: boolean;   // DB-internal, no network cost
}

interface PayloadSizes {
  [size: string]: string;
}

interface BenchResult {
  path: string;
  payloadSize: string;
  category: string;
  serializeTimeUs: number;
  deserializeTimeUs: number | null;
  heapBeforeMb: number;
  heapAfterMb: number;
  heapDeltaKb: number;
  throughputMbps: number;
  edge: boolean;
  core: boolean;
  error?: string;
}

interface PathResults {
  path: SerializationPath;
  results: BenchResult[];
}

// ────────────────────────────────────────────────────────────────────
// Payload generators
// ────────────────────────────────────────────────────────────────────

function generatePayloads(): PayloadSizes {
  const smallObj = { id: 'usr_abc123', name: 'Test User', role: 'admin', orgId: 'org_xyz789', status: 'active' };
  const mediumObj: Record<string, unknown> = { ...smallObj };
  for (let i = 0; i < 50; i++) {
    mediumObj[`field_${i}`] = `value_${i}_is_a_reasonable_length_string_for_testing`;
  }

  // Build payloads of target sizes
  const payload1KB = JSON.stringify(smallObj);
  const payload10KB = JSON.stringify(mediumObj);

  // 100KB: nest many objects
  const bigArr: Record<string, unknown>[] = [];
  for (let i = 0; i < 800; i++) {
    bigArr.push({ ...smallObj, idx: i, nested: { a: 1, b: 'test', c: [1, 2, 3] } });
  }
  const payload100KB = JSON.stringify(bigArr);

  // 1MB: very large array
  const hugeArr: Record<string, unknown>[] = [];
  for (let i = 0; i < 8000; i++) {
    hugeArr.push({ ...smallObj, idx: i, nested: { a: 1, b: 'test', c: [1, 2, 3, 4, 5], deep: { x: 10, y: 20 } } });
  }
  const payload1MB = JSON.stringify(hugeArr);

  return { '1KB': payload1KB, '10KB': payload10KB, '100KB': payload100KB, '1MB': payload1MB };
}

// ────────────────────────────────────────────────────────────────────
// Path definitions (cataloged from codebase analysis)
// ────────────────────────────────────────────────────────────────────

function getSerializationPaths(): SerializationPath[] {
  return [
    // JSON.stringify — API route responses
    {
      name: 'NextResponse.json (api-response jsonOk)',
      category: 'json_serialize',
      description: 'NextResponse.json() wrapping { ok: true, data } — used by all API routes (api-response.ts)',
      edge: true,
      core: false,
    },
    {
      name: 'JSON.stringify direct (manually crafted error responses)',
      category: 'json_serialize',
      description: 'Direct JSON.stringify() in rate-limit and circuit-breaker error responses (rate-limiter.ts, circuit-breaker.ts)',
      edge: true,
      core: false,
    },
    {
      name: 'Response.json (guarded helpers)',
      category: 'json_serialize',
      description: 'Response.json() in guardedGet/guardedPost/guardedPatch/guardedSession (route-helpers.ts)',
      edge: true,
      core: false,
    },

    // JSON.parse — request body parsing
    {
      name: 'parseJson helper (route-helpers.ts)',
      category: 'json_parse',
      description: 'request.text() + JSON.parse() — all POST/PATCH API request bodies go through this',
      edge: true,
      core: false,
    },

    // Cookie serialization
    {
      name: 'serializeSessionCookie (session-cookie.ts)',
      category: 'cookie_serialize',
      description: 'String concatenation of Set-Cookie header: ll_session=...; HttpOnly; SameSite=Lax; Secure; Path=/; Max-Age=...',
      edge: true,
      core: false,
    },
    {
      name: 'serializeSessionClearCookie (session-cookie.ts)',
      category: 'cookie_serialize',
      description: 'Set-Cookie clear: ll_session=; HttpOnly; SameSite=Strict; Secure; Path=/; Max-Age=0',
      edge: true,
      core: false,
    },
    {
      name: 'Cookie header regex parse (readSessionCookie / parseSessionCookie)',
      category: 'cookie_parse',
      description: 'Regex match on Cookie header for ll_session= token (session-cookie.ts, auth-service.ts)',
      edge: true,
      core: false,
    },

    // URLSearchParams
    {
      name: 'URLSearchParams (middleware redirect + route helpers)',
      category: 'url_search_params',
      description: 'request.nextUrl.searchParams.set() for login redirects, URL parsing for jobId extraction in QC routes',
      edge: true,
      core: false,
    },

    // FormData → object mapping
    {
      name: 'FormData field normalization (upload-intake-service.ts)',
      category: 'form_data',
      description: 'File metadata mapping: fileName→sanitizeDbFileName, sizeBytes→Number, mimeType→String with backward-compat fallback',
      edge: false,
      core: true,
    },

    // CSV import parsing (sales channels)
    {
      name: 'CSV import order mapping (sales-channel normalize)',
      category: 'json_parse',
      description: 'Batch import: parseJson → schema parse → parallel normalization plan (sales-channels/import/route.ts)',
      edge: true,
      core: false,
    },

    // Prisma query → JSON response chain
    {
      name: 'Prisma findMany → JSON response (listings route)',
      category: 'prisma_json',
      description: 'Prisma query result → JSON.stringify for response (listings route: prisma.job.findMany → jsonOk)',
      edge: true,
      core: true,
    },
    {
      name: 'Prisma JSON field serialization (idempotency resultBody)',
      category: 'prisma_json',
      description: 'resultBody stored as Prisma.InputJsonValue — serialization of arbitrary JSON to DB (idempotency-service.ts)',
      edge: false,
      core: true,
    },

    // Stripe webhook body parsing
    {
      name: 'Stripe webhook body parsing (stripe-billing-orchestrator.ts)',
      category: 'json_parse',
      description: 'Stripe Event object: event.data.object client_reference_id extraction, type matching, session reconciliation',
      edge: true,
      core: false,
    },

    // Headers → metadata mapping
    {
      name: 'Headers metadata mapping (rate-limiter, middleware, route-helpers)',
      category: 'string_concat',
      description: 'x-forwarded-for split+trim, x-real-ip fallback, user-agent header extraction, rate limit key concatenation',
      edge: true,
      core: false,
    },

    // Hash operations (token hashing)
    {
      name: 'SHA-256 token hashing (session-cookie, upload-token, auth-service)',
      category: 'hash',
      description: 'createHash("sha256").update(token).digest("hex") — session tokens, upload tokens, verification tokens, CSRF',
      edge: false,
      core: true,
    },

    // Buffer operations
    {
      name: 'Buffer.alloc + timingSafeEqual (session-binding.ts)',
      category: 'buffer_encode',
      description: 'Buffer.from() for constant-time comparison of binding hashes',
      edge: false,
      core: true,
    },

    // Audit log JSON serialization
    {
      name: 'Audit log metadata JSON (console.log JSON.stringify)',
      category: 'json_serialize',
      description: 'JSON.stringify for structured logging (stripe-session-reconciliation, route-helpers parse error logging)',
      edge: false,
      core: true,
    },
  ];
}

// ────────────────────────────────────────────────────────────────────
// Benchmark helpers
// ────────────────────────────────────────────────────────────────────

function getHeapUsageMb(): number {
  const usage = process.memoryUsage();
  return Math.round(usage.heapUsed / 1024 / 1024 * 100) / 100;
}

function getHeapUsageKb(): number {
  const usage = process.memoryUsage();
  return Math.round(usage.heapUsed / 1024 * 100) / 100;
}

function usElapsed(start: bigint): number {
  return Number(process.hrtime.bigint() - start) / 1000;
}

function throughputMbps(payloadBytes: number, timeUs: number): number {
  if (timeUs <= 0) return 0;
  const bits = payloadBytes * 8;
  const seconds = timeUs / 1_000_000;
  return Math.round((bits / seconds) / (1024 * 1024) * 100) / 100;
}

function getPayloadBytes(size: string, payloads: PayloadSizes): number {
  return Buffer.byteLength(payloads[size as keyof PayloadSizes], 'utf8');
}

// ────────────────────────────────────────────────────────────────────
// Individual benchmarks
// ────────────────────────────────────────────────────────────────────

function benchJsonStringify(data: unknown, iterations: number): { timeUs: number } {
  const start = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) {
    JSON.stringify(data);
  }
  return { timeUs: usElapsed(start) / iterations };
}

function benchJsonParse(text: string, iterations: number): { timeUs: number } {
  const start = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) {
    JSON.parse(text);
  }
  return { timeUs: usElapsed(start) / iterations };
}

function benchCookieSerialize(token: string, iterations: number): { timeUs: number } {
  const start = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) {
    const parts: string[] = [];
    parts.push(`ll_session=${encodeURIComponent(token)}`);
    parts.push('HttpOnly');
    parts.push('SameSite=Lax');
    parts.push('Secure');
    parts.push('Path=/');
    parts.push('Max-Age=1209600');
    parts.join('; ');
  }
  return { timeUs: usElapsed(start) / iterations };
}

function benchCookieParse(header: string, iterations: number): { timeUs: number } {
  const start = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) {
    header.match(/ll_session=([^;]*)/);
  }
  return { timeUs: usElapsed(start) / iterations };
}

function benchUrlSearchParams(baseUrl: string, key: string, value: string, iterations: number): { timeUs: number } {
  const start = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) {
    const url = new URL(baseUrl);
    url.searchParams.set(key, value);
    url.toString();
  }
  return { timeUs: usElapsed(start) / iterations };
}

function benchStringConcat(parts: string[], iterations: number): { timeUs: number } {
  const start = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) {
    parts.join(':');
  }
  return { timeUs: usElapsed(start) / iterations };
}

function benchBufferAlloc(text: string, iterations: number): { timeUs: number } {
  const start = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) {
    Buffer.from(text, 'utf8');
  }
  return { timeUs: usElapsed(start) / iterations };
}

function benchSha256(input: string, iterations: number): { timeUs: number } {
  const start = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) {
    createHash('sha256').update(input).digest('hex');
  }
  return { timeUs: usElapsed(start) / iterations };
}

// ────────────────────────────────────────────────────────────────────
// Runner
// ────────────────────────────────────────────────────────────────────

interface BenchConfig {
  quick: boolean;
  json: boolean;
}

function parseArgs(): BenchConfig {
  const args = process.argv.slice(2);
  return {
    quick: args.includes('--quick'),
    json: args.includes('--json'),
  };
}

async function main() {
  const config = parseArgs();
  const payloads = generatePayloads();
  const paths = getSerializationPaths();

  const sizes = config.quick ? ['1KB', '100KB'] : ['1KB', '10KB', '100KB', '1MB'];
  const iterations = config.quick ? 1 : 100;

  if (!config.json) {
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║  Q13 Phase 1 — Serialization & I/O Profiling Benchmark        ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝');
    console.log(`Payload sizes: ${sizes.join(', ')}`);
    console.log(`Iterations per test: ${iterations}`);
    console.log(`Heap before: ${getHeapUsageMb()} MB\n`);
  }

  const allResults: PathResults[] = [];
  const startTotal = process.hrtime.bigint();

  for (const sp of paths) {
    const pathResults: BenchResult[] = [];

    for (const size of sizes) {
      const payloadText = payloads[size as keyof PayloadSizes];
      const payloadBytes = getPayloadBytes(size, payloads);

      let result: BenchResult = {
        path: sp.name,
        payloadSize: size,
        category: sp.category,
        serializeTimeUs: 0,
        deserializeTimeUs: null,
        heapBeforeMb: 0,
        heapAfterMb: 0,
        heapDeltaKb: 0,
        throughputMbps: 0,
        edge: sp.edge,
        core: sp.core,
      };

      try {
        const heapBefore = getHeapUsageKb();

        switch (sp.category) {
          case 'json_serialize': {
            const data = JSON.parse(payloadText);
            const ser = benchJsonStringify(data, iterations);
            result.serializeTimeUs = Math.round(ser.timeUs * 100) / 100;
            result.throughputMbps = throughputMbps(payloadBytes, ser.timeUs);
            // Deserialize the same payload for comparison
            const deser = benchJsonParse(payloadText, iterations);
            result.deserializeTimeUs = Math.round(deser.timeUs * 100) / 100;
            break;
          }

          case 'json_parse': {
            // serialize then parse
            const data = JSON.parse(payloadText);
            const ser = benchJsonStringify(data, iterations);
            result.serializeTimeUs = Math.round(ser.timeUs * 100) / 100;
            const deser = benchJsonParse(payloadText, iterations);
            result.deserializeTimeUs = Math.round(deser.timeUs * 100) / 100;
            result.throughputMbps = throughputMbps(payloadBytes, ser.timeUs + deser.timeUs);
            break;
          }

          case 'cookie_serialize': {
            const ser = benchCookieSerialize(payloadText.slice(0, 64), iterations);
            result.serializeTimeUs = Math.round(ser.timeUs * 100) / 100;
            result.throughputMbps = throughputMbps(payloadBytes, ser.timeUs);
            break;
          }

          case 'cookie_parse': {
            const header = `ll_session=${encodeURIComponent(payloadText.slice(0, 64))}; other=val`;
            const deser = benchCookieParse(header, iterations);
            result.deserializeTimeUs = Math.round(deser.timeUs * 100) / 100;
            break;
          }

          case 'url_search_params': {
            const ser = benchUrlSearchParams('http://localhost:3000/login', 'next', '/admin', iterations);
            result.serializeTimeUs = Math.round(ser.timeUs * 100) / 100;
            break;
          }

          case 'string_concat': {
            const parts = ['key1', 'val1', 'key2', 'val2', 'key3', 'val3'];
            const ser = benchStringConcat(parts, iterations);
            result.serializeTimeUs = Math.round(ser.timeUs * 100) / 100;
            break;
          }

          case 'buffer_encode': {
            const ser = benchBufferAlloc(payloadText.slice(0, 256), iterations);
            result.serializeTimeUs = Math.round(ser.timeUs * 100) / 100;
            break;
          }

          case 'hash': {
            const ser = benchSha256(payloadText.slice(0, 128), iterations);
            result.serializeTimeUs = Math.round(ser.timeUs * 100) / 100;
            break;
          }

          case 'prisma_json': {
            // Simulate Prisma JSON serialization round-trip
            const data = JSON.parse(payloadText);
            // Stringify for DB storage (InputJsonValue)
            const ser = benchJsonStringify(data, iterations);
            result.serializeTimeUs = Math.round(ser.timeUs * 100) / 100;
            // Parse when reading back
            const deser = benchJsonParse(payloadText, iterations);
            result.deserializeTimeUs = Math.round(deser.timeUs * 100) / 100;
            result.throughputMbps = throughputMbps(payloadBytes, ser.timeUs + deser.timeUs);
            break;
          }

          case 'form_data': {
            // Simulate FormData field normalization (upload-intake-service.ts)
            const ser = benchStringConcat([payloadText.slice(0, 100), 'test-mime', String(payloadBytes)], iterations);
            result.serializeTimeUs = Math.round(ser.timeUs * 100) / 100;
            break;
          }

          case 'csv_stringify': {
            // csv-stringify is in dependencies but not yet wired in routes
            result.serializeTimeUs = 0;
            result.deserializeTimeUs = null;
            result.throughputMbps = 0;
            break;
          }

          default:
            throw new Error(`Unknown category: ${sp.category}`);
        }

        const heapAfter = getHeapUsageKb();
        result.heapBeforeMb = Math.round(heapBefore / 1024 * 100) / 100;
        result.heapAfterMb = Math.round(heapAfter / 1024 * 100) / 100;
        result.heapDeltaKb = Math.round((heapAfter - heapBefore) * 100) / 100;

      } catch (err) {
        result.error = err instanceof Error ? err.message : String(err);
      }

      pathResults.push(result);
    }

    allResults.push({ path: sp, results: pathResults });

    if (!config.json) {
      const name = sp.name.padEnd(60);
      for (const r of pathResults) {
        const sizeStr = r.payloadSize.padEnd(6);
        const serStr = r.error ? `ERR: ${r.error}` : `${r.serializeTimeUs.toFixed(1).padStart(8)} μs`;
        const deserStr = r.deserializeTimeUs !== null ? ` | parse: ${r.deserializeTimeUs.toFixed(1).padStart(8)} μs` : '';
        const heapStr = r.heapDeltaKb !== 0 ? ` | heap Δ: ${r.heapDeltaKb.toFixed(1).padStart(8)} KB` : '';
        const tpStr = r.throughputMbps > 0 ? ` | ${r.throughputMbps.toFixed(1)} Mbps` : '';
        const loc = r.edge ? '[EDGE]' : r.core ? '[CORE]' : '[?]';
        console.log(`  ${name} ${sizeStr} ${loc} ${serStr}${deserStr}${heapStr}${tpStr}`);
      }
      console.log('');
    }
  }

  const totalElapsed = Number(process.hrtime.bigint() - startTotal) / 1_000_000;
  const heapEnd = getHeapUsageMb();
  const heapStart = getHeapUsageMb();

  if (!config.json) {
    console.log(`Total benchmark time: ${totalElapsed.toFixed(0)} ms`);
    console.log(`Final heap usage: ${heapEnd} MB`);
    console.log('');
    console.log('─'.repeat(72));
    console.log('Top 3 Heaviest Serialization Paths (by serialize time @ 1MB):');
    console.log('─'.repeat(72));

    // Find top 3 by serialize time at largest payload
    const top3 = allResults
      .map(pr => {
        const r1mb = pr.results.find(r => r.payloadSize === '1MB');
        return { name: pr.path.name, timeUs: r1mb?.serializeTimeUs ?? 0, error: r1mb?.error };
      })
      .filter(r => r.timeUs > 0 && !r.error)
      .sort((a, b) => b.timeUs - a.timeUs)
      .slice(0, 3);

    top3.forEach((r, i) => {
      // Determine the human size
      console.log(`  ${i + 1}. ${r.name}`);
      console.log(`     Serialize: ${r.timeUs.toFixed(1)} μs @ 1MB`);
    });
  }

  // ── Output JSON if requested ──
  if (config.json) {
    const output = {
      metadata: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        heapStartMb: heapStart,
        heapEndMb: heapEnd,
        totalElapsedMs: totalElapsed,
      },
      payloadSizes: sizes,
      iterations,
      results: allResults.map(pr => ({
        path: pr.path.name,
        category: pr.path.category,
        description: pr.path.description,
        edge: pr.path.edge,
        core: pr.path.core,
        benchmarks: pr.results,
      })),
    };
    console.log(JSON.stringify(output, null, 2));
  }

  // ── Write results to file ──
  const summary = allResults.map(pr => ({
    path: pr.path.name,
    category: pr.path.category,
    edge: pr.path.edge,
    core: pr.path.core,
    results: pr.results,
  }));

  const outputPath = path.join(process.cwd(), 'docs/testing', 'Q13_SERIALIZATION_BENCH_RESULTS.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    results: summary,
  }, null, 2));
  console.log(`\nResults written to: ${outputPath}`);
}

main().catch(err => {
  console.error('Benchmark failed:', err);
  process.exit(1);
});
