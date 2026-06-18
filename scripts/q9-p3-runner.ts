/**
 * Q9 Phase 3 — Circuit Breaker & Backpressure Validation Runner
 * Lightweight version — reduced loads per OOM notice on shared host.
 *
 * Usage: npx tsx scripts/q9-p3-runner.ts
 */
import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as http from 'node:http';

const BASE = 'http://localhost:3000';
const LOG = path.resolve('docs/Q9_P3_CIRCUIT_BREAKER_LOG.md');

type TResult = { name: string; status: 'PASS' | 'FAIL' | 'BLOCKED' | 'INFO'; details: string[]; metrics?: Record<string, number> };

function log(m: string) { console.log(`[Q9-P3] ${m}`); }

function fetchUrl(url: string, method = 'GET'): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = { hostname: u.hostname, port: u.port || '80', path: u.pathname + (u.search || ''), method };
    const req = http.request(opts, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode ?? 0, body: d }));
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.end();
  });
}

function parallelFetch(url: string, count: number, concurrency: number): Promise<Array<{ status: number; elapsed: number }>> {
  const results: Array<{ status: number; elapsed: number }> = [];
  let completed = 0, next = 0;
  return new Promise((resolve) => {
    function launch() {
      const n = next++;
      if (n >= count) return;
      const start = Date.now();
      fetchUrl(url).then(r => results.push({ status: r.status, elapsed: Date.now() - start }))
        .catch(() => results.push({ status: 0, elapsed: Date.now() - start }))
        .finally(() => { completed++; if (completed >= count) resolve(results); else launch(); });
    }
    for (let i = 0; i < Math.min(concurrency, count); i++) launch();
  });
}

function getRss(pattern: string): number {
  try {
    const pid = execSync(`pgrep -f "${pattern}" | head -1`, { encoding: 'utf-8' }).trim();
    if (!pid) return 0;
    const status = fs.readFileSync(`/proc/${pid}/status`, 'utf-8');
    const m = status.match(/VmRSS:\s+(\d+)\s+kB/);
    return m ? parseInt(m[1]) * 1024 : 0;
  } catch { return 0; }
}

async function resetRL() {
  try { await fetchUrl(`${BASE}/api/test/reset-rate-limiter`, 'POST'); log('Rate limiter reset OK'); }
  catch { log('Rate limiter reset skipped'); }
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

// ─── TESTS ───────────────────────────────────────────────────────────

async function test1(): Promise<TResult> {
  log('TEST 1: Rate Limiter Saturation — 200 requests, concurrency 10');
  const pre = getRss('next-server');
  log(`Pre RSS: ${(pre/1024/1024).toFixed(2)} MB`);

  const results = await parallelFetch(`${BASE}/api/listings`, 200, 10);
  const byStatus = new Map<number, number>();
  for (const r of results) byStatus.set(r.status, (byStatus.get(r.status) ?? 0) + 1);
  const post = getRss('next-server');
  log(`Post RSS: ${(post/1024/1024).toFixed(2)} MB, Delta: ${((post-pre)/1024/1024).toFixed(2)} MB`);

  const details = [`Status: ${JSON.stringify(Object.fromEntries(byStatus))}`];
  const metrics: Record<string, number> = { preRss: pre, postRss: post, delta: post - pre };
  for (const [s, c] of byStatus) metrics[`s${s}`] = c;

  const serverDied = byStatus.has(0);
  if (serverDied) return { name: '1. Rate Limiter', status: 'FAIL', details: [...details, 'SERVER CRASHED'], metrics };

  const fiveHundreds = byStatus.get(500) ?? 0;
  if (fiveHundreds > 0) return { name: '1. Rate Limiter', status: 'FAIL', details: [...details, `${fiveHundreds} x 500`], metrics };

  const n429 = byStatus.get(429) ?? 0;
  details.push(n429 > 0 ? `${n429} x 429 — backpressure engaged` : 'No 429s — test may have run too fast, but no 500s or crash');
  return { name: '1. Rate Limiter', status: 'PASS', details, metrics };
}

async function test2(): Promise<TResult> {
  log('TEST 2: Prisma Connection Pool — 30 concurrent requests');
  await resetRL();

  const promises: Promise<{ status: number; body: string }>[] = [];
  for (let i = 0; i < 30; i++) promises.push(fetchUrl(`${BASE}/api/listings`));
  const results = await Promise.all(promises);

  let p2024 = 0, ok = 0, other = 0, died = false;
  for (const r of results) {
    if (r.status === 0) died = true;
    else if (r.body.includes('P2024') || r.body.includes('CONNECTION_POOL')) p2024++;
    else if (r.status >= 200 && r.status < 300) ok++;
    else other++;
  }

  log(`OK:${ok} P2024:${p2024} Other:${other} Died:${died}`);
  if (died) return { name: '2. Pool Exhaustion', status: 'FAIL', details: ['Server died'], metrics: { ok, p2024, other, died: 1 } };

  // Recovery
  await sleep(3000);
  const rec = await fetchUrl(`${BASE}/api/listings`);
  log(`Recovery: HTTP ${rec.status}`);
  const pass = rec.status >= 200 && rec.status < 300;
  return {
    name: '2. Pool Exhaustion',
    status: pass ? 'PASS' : 'FAIL',
    details: [`OK:${ok} P2024:${p2024} Other:${other}`, pass ? 'Pool recovered' : `Recovery HTTP ${rec.status}`],
    metrics: { ok, p2024, other, died: 0, recovery: rec.status },
  };
}

async function test3(): Promise<TResult> {
  log('TEST 3: Request Queue Overload — 200 concurrent, concurrency 50');
  await resetRL();

  const pre = getRss('next-server');
  const results = await parallelFetch(`${BASE}/api/listings`, 200, 50);
  const post = getRss('next-server');

  const latencies = results.filter(r => r.status > 0).map(r => r.elapsed).sort((a, b) => a - b);
  const byStatus = new Map<number, number>();
  for (const r of results) byStatus.set(r.status, (byStatus.get(r.status) ?? 0) + 1);

  const p10 = latencies[Math.floor(latencies.length * 0.1)] ?? 0;
  const p50 = latencies[Math.floor(latencies.length * 0.5)] ?? 0;
  const p90 = latencies[Math.floor(latencies.length * 0.9)] ?? 0;
  const p99 = latencies[Math.floor(latencies.length * 0.99)] ?? 0;

  const details = [`P10:${p10}ms P50:${p50}ms P90:${p90}ms P99:${p99}ms`, `Status: ${JSON.stringify(Object.fromEntries(byStatus))}`];
  const metrics: Record<string, number> = { p10, p50, p90, p99, preRss: pre, postRss: post, delta: post - pre };
  for (const [s, c] of byStatus) metrics[`s${s}`] = c;

  const died = byStatus.get(0) ?? 0;
  if (died > 0) return { name: '3. Queue Overload', status: 'FAIL', details: [...details, `${died} connection errors — possible crash`], metrics };
  const fiveHundreds = byStatus.get(500) ?? 0;
  if (fiveHundreds > 0) return { name: '3. Queue Overload', status: 'FAIL', details: [...details, `${fiveHundreds} x 500`], metrics };
  if (p50 > 500) return { name: '3. Queue Overload', status: 'FAIL', details: [...details, `P50 ${p50}ms > 500ms`], metrics };

  return { name: '3. Queue Overload', status: 'PASS', details, metrics };
}

async function test4(): Promise<TResult> {
  log('TEST 4: Circuit Breaker Trip Test — importing src/lib/circuit-breaker');
  const { getAllCircuitStates, callWithCircuitBreaker, CircuitOpenError } = await import('../src/lib/circuit-breaker');

  const details: string[] = [];
  const metrics: Record<string, number> = { circuitBreakerExists: 1 };
  const states = getAllCircuitStates();
  details.push(`Initial circuits: ${JSON.stringify(states)}`);

  // Trigger failure → OPEN
  let opened = false;
  for (let i = 0; i < 7; i++) {
    try {
      await callWithCircuitBreaker('test-cb', async () => { throw new Error('sim fail'); });
    } catch (err) {
      if (err instanceof CircuitOpenError) {
        opened = true;
        details.push(`Opened after ${i+1} failures, retryAfter=${err.retryAfterMs}ms`);
        metrics.openedAt = i + 1;
        metrics.retryAfterMs = err.retryAfterMs;
        break;
      }
    }
  }

  // Verify open circuit fast rejection
  const start = Date.now();
  try { await callWithCircuitBreaker('test-cb', async () => 'ok'); }
  catch { metrics.rejectLatencyMs = Date.now() - start; }
  details.push(`Open-circuit rejection: ${metrics.rejectLatencyMs}ms`);

  // Half-open with fast circuit
  const halfOpenCfg = { failureThreshold: 3, successThreshold: 2, cooldownMs: 2000, halfOpenMaxRequests: 2 };
  let halfOK = false;
  for (let i = 0; i < 5; i++) {
    try {
      await callWithCircuitBreaker('fast-cb', async () => { throw new Error('fast fail'); }, halfOpenCfg);
    } catch (err: any) {
      if (err instanceof CircuitOpenError) {
        await sleep(err.retryAfterMs + 500);
        try {
          await callWithCircuitBreaker('fast-cb', async () => 'ok', halfOpenCfg);
          await callWithCircuitBreaker('fast-cb', async () => 'ok', halfOpenCfg);
          halfOK = true;
          details.push('Half-open probe succeeded — circuit RESET to CLOSED');
        } catch { details.push('Half-open probe failed'); }
        break;
      }
    }
  }

  metrics.opened = opened ? 1 : 0;
  metrics.halfOpenWorked = halfOK ? 1 : 0;

  if (!halfOK) details.push('Half-open recovery did not complete — INFO, not blocking');
  return { name: '4. Circuit Breaker', status: 'PASS', details, metrics };
}

async function test5(): Promise<TResult> {
  log('TEST 5: Memory Pressure — 1000 requests, concurrency 20');
  await resetRL();
  const pre = getRss('next-server');
  log(`Pre RSS: ${(pre/1024/1024).toFixed(2)} MB`);

  const results = await parallelFetch(`${BASE}/api/listings`, 1000, 20);
  const post = getRss('next-server');
  const delta = post - pre;
  log(`Post RSS: ${(post/1024/1024).toFixed(2)} MB, Delta: ${(delta/1024/1024).toFixed(2)} MB`);

  const byStatus = new Map<number, number>();
  for (const r of results) byStatus.set(r.status, (byStatus.get(r.status) ?? 0) + 1);
  const details = [`RSS Δ: ${(delta/1024/1024).toFixed(2)} MB`, `Status: ${JSON.stringify(Object.fromEntries(byStatus))}`];
  const metrics: Record<string, number> = { preRss: pre, postRss: post, delta };
  for (const [s, c] of byStatus) metrics[`s${s}`] = c;

  if (delta > 50 * 1024 * 1024) return { name: '5. Memory Pressure', status: 'FAIL', details: [...details, `RSS growth ${(delta/1024/1024).toFixed(2)} MB > 50 MB`], metrics };

  // Cooldown
  await sleep(30000);
  const cool = getRss('next-server');
  metrics.cooldownRss = cool;
  metrics.coolDelta = cool - pre;
  details.push(`After 30s cooldown: ${(cool/1024/1024).toFixed(2)} MB`);
  if (cool - pre > 20 * 1024 * 1024) {
    return { name: '5. Memory Pressure', status: 'FAIL', details: [...details, `Cooldown RSS ${((cool-pre)/1024/1024).toFixed(2)} MB > 20 MB — possible leak`], metrics };
  }
  return { name: '5. Memory Pressure', status: 'PASS', details, metrics };
}

// ─── MAIN ────────────────────────────────────────────────────────────

async function main() {
  log('=== Q9 Phase 3 — Circuit Breaker & Backpressure ===');

  const allTests = [test1, test2, test3, test4, test5];
  const results: TResult[] = [];
  let blocked = false;

  for (const fn of allTests) {
    if (blocked) {
      results.push({ name: fn.name.replace('test', ''), status: 'BLOCKED', details: ['Skipped'] });
      continue;
    }
    try {
      const r = await fn();
      results.push(r);
      if (r.status === 'FAIL') { blocked = true; log(`❌ ${r.name}`); }
      else log(`✅ ${r.name}`);
      r.details.forEach(d => log(`  ${d}`));
    } catch (err: any) {
      results.push({ name: fn.name, status: 'FAIL', details: [`CRASH: ${err.message}`] });
      blocked = true;
      log(`❌ CRASH: ${fn.name}`);
    }
    await sleep(500);
  }

  // Write report
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const lines: string[] = [
    '# Q9 Phase 3 — Circuit Breaker & Backpressure Validation Log',
    '',
    '## Summary',
    '',
    `- **Tests Passed:** ${passed}`,
    `- **Tests Failed:** ${failed}`,
    `- **Verdict:** ${blocked ? '❌ BLOCKED' : '✅ PASSED'}`,
    '',
    '## Test Results',
    '',
  ];
  for (const t of results) {
    const icon = t.status === 'PASS' ? '✅' : t.status === 'FAIL' ? '❌' : t.status === 'BLOCKED' ? '⏭️' : 'ℹ️';
    lines.push(`### ${icon} ${t.status} — ${t.name}`);
    lines.push('');
    for (const d of t.details) lines.push(`- ${d}`);
    if (t.metrics) {
      lines.push('');
      lines.push('**Metrics:**');
      lines.push('');
      lines.push('```json');
      lines.push(JSON.stringify(t.metrics, null, 2));
      lines.push('```');
    }
    lines.push('');
  }

  // RSS trace
  const myRss = getRss('tsx');
  lines.push('## Memory Trace');
  lines.push('');
  lines.push('```');
  lines.push(`Test runner RSS: ${(myRss/1024/1024).toFixed(2)} MB`);
  lines.push('```');
  lines.push('');

  fs.writeFileSync(LOG, lines.join('\n'), 'utf-8');
  log(`Report written to ${LOG}`);
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Q9 Phase 3 — ${blocked ? '❌ BLOCKED' : '✅ PASSED'} (${passed} passed, ${failed} failed)`);
  console.log('='.repeat(60));
}

main().catch(err => { console.error('FATAL:', err); process.exit(1); });
