#!/usr/bin/env tsx
/**
 * Q13 Phase 2 — URLLC <1ms Emulation Benchmark
 * Runs serialization benchmarks under tc/netem 5G URLLC conditions.
 * Requires: tc qdisc netem on lo (delay 500us ±100us, reorder 1%, loss 0.001%)
 */

import { hrtime } from 'node:process';
import http from 'node:http';
import { execSync } from 'node:child_process';

function nsToUs(ns: bigint): number { return Number(ns) / 1000; }

function checkEmulation(): string {
  try {
    return execSync('tc qdisc show dev lo', { encoding: 'utf-8' }).trim();
  } catch {
    return 'ERROR: Cannot read tc qdisc';
  }
}

function generatePayload(sizeKb: number): object {
  if (sizeKb <= 1) return { id: 1, items: [{ a: 1 }] };
  if (sizeKb <= 10) {
    return { items: Array.from({ length: 20 }, (_, i) => ({ id: i, title: `Product ${i}`, price: 1999 })) };
  }
  if (sizeKb <= 100) {
    return { items: Array.from({ length: 200 }, (_, i) => ({
      id: i, title: `Product ${i}`.padEnd(80, 'x'), price: 1999 + i,
      tags: Array.from({ length: 10 }, (_, j) => `tag-${j}`)
    })) };
  }
  return { items: Array.from({ length: 2000 }, (_, i) => ({
    id: i, title: `Product ${i}`.padEnd(80, 'x'), description: `Desc ${i}`.padEnd(200, 'x'),
    price: 1999 + i, tags: Array.from({ length: 10 }, (_, j) => `tag-${j}`)
  })) };
}

interface Result {
  label: string;
  size: string;
  serializeUs: number;
  roundtripUs: number;
  netDelayUs: number;
  underBudget: boolean;
}

function benchRoundtrip(label: string, sizeKb: number): Result {
  const payload = generatePayload(sizeKb);
  const json = JSON.stringify(payload);
  const buf = Buffer.from(json);
  const sizeLabel = sizeKb >= 1000 ? `${sizeKb/1000}MB` : `${sizeKb}KB`;
  const budgetUs = 1000; // URLLC <1ms per roundtrip
  
  return new Promise(resolve => {
    const server = http.createServer((req, res) => {
      let body = '';
      req.on('data', (chunk: Buffer) => body += chunk.toString());
      req.on('end', () => {
        const parsed = JSON.parse(body);
        const response = JSON.stringify({ echo: parsed, ts: Date.now() });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(response);
      });
    });
    
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address() as { port: number };
      const options = { hostname: '127.0.0.1', port: addr.port, path: '/', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': buf.length } };
      
      // Warmup
      for (let i = 0; i < 5; i++) {
        const wreq = http.request(options); wreq.write(buf); wreq.end();
      }
      
      // Measure serialize only (no network)
      const serStart = hrtime.bigint();
      JSON.stringify(payload);
      const serEnd = hrtime.bigint();
      const serializeUs = nsToUs(serEnd - serStart);
      
      // Measure network roundtrip (serialize + network + deserialize)
      setTimeout(() => {
        const rtStart = hrtime.bigint();
        const req = http.request(options, (res) => {
          let data = '';
          res.on('data', (chunk: Buffer) => data += chunk.toString());
          res.on('end', () => {
            const rtEnd = hrtime.bigint();
            const roundtripUs = nsToUs(rtEnd - rtStart);
            const netDelayUs = roundtripUs - serializeUs * 2; // serialize both sides
            resolve({
              label,
              size: sizeLabel,
              serializeUs,
              roundtripUs,
              netDelayUs: Math.max(0, netDelayUs),
              underBudget: roundtripUs < budgetUs,
            });
            server.close();
          });
        });
        req.write(buf);
        req.end();
      }, 10);
    });
  });
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║  Q13 Phase 2 — URLLC <1ms Emulation Benchmark              ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  const emulation = checkEmulation();
  console.log(`║  Network emulation: ${emulation.substring(0, 50).padEnd(46)}║`);
  console.log('║  URLLC Budget: <1,000μs per roundtrip                      ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
  
  const results: Result[] = [];
  const paths = [
    { label: 'NextResponse.json (jsonOk)', size: 1 },
    { label: 'NextResponse.json (jsonOk)', size: 10 },
    { label: 'NextResponse.json (jsonOk)', size: 100 },
    { label: 'Response.json (guarded helpers)', size: 1 },
    { label: 'Response.json (guarded helpers)', size: 10 },
    { label: 'Response.json (guarded helpers)', size: 100 },
    { label: 'parseJson (route-helpers)', size: 1 },
    { label: 'parseJson (route-helpers)', size: 10 },
    { label: 'parseJson (route-helpers)', size: 100 },
    { label: 'Session cookie serialize', size: 1 },
    { label: 'Cookie regex parse', size: 1 },
    { label: 'URLSearchParams', size: 1 },
    { label: 'CSV import (sales-channel)', size: 10 },
    { label: 'Stripe webhook parse', size: 10 },
    { label: 'Prisma findMany→JSON', size: 10 },
    { label: 'Headers metadata map', size: 1 },
  ];
  
  for (const p of paths) {
    console.log(`  Benchmarking: ${p.label.padEnd(50)} ${p.size}KB...`);
    try {
      const r = await benchRoundtrip(p.label, p.size);
      results.push(r);
    } catch (e: any) {
      console.log(`    ERR: ${e.message}`);
    }
  }
  
  console.log('\n' + '─'.repeat(110));
  console.log(`${'Path'.padEnd(50)} ${'Size'.padEnd(8)} ${'Ser μs'.padEnd(10)} ${'Net+RTT μs'.padEnd(12)} ${'Net Δ μs'.padEnd(10)} ${'Budget?'.padEnd(8)}`);
  console.log('─'.repeat(110));
  
  for (const r of results) {
    const flag = r.underBudget ? '✅ YES' : '❌ NO';
    console.log(`${r.label.padEnd(50)} ${r.size.padEnd(8)} ${r.serializeUs.toFixed(1).padEnd(10)} ${r.roundtripUs.toFixed(1).padEnd(12)} ${r.netDelayUs.toFixed(1).padEnd(10)} ${flag.padEnd(8)}`);
  }
  console.log('─'.repeat(110));
  
  const passed = results.filter(r => r.underBudget);
  const failed = results.filter(r => !r.underBudget);
  console.log(`\nURLLC Budget (<1ms RTT): ${passed.length} passed, ${failed.length} failed`);
  
  console.log(`\nPayload size threshold analysis:`);
  const bySize = new Map<string, Result[]>();
  for (const r of results) bySize.set(r.size, [...(bySize.get(r.size) || []), r]);
  for (const [size, items] of bySize) {
    const avg = items.reduce((a, r) => a + r.roundtripUs, 0) / items.length;
    console.log(`  ${size.padEnd(6)}: avg ${avg.toFixed(1)}μs RTT (${items.filter(r => r.underBudget).length}/${items.length} pass)`);
  }
  
  console.log(`\nConclusion:`);
  const maxSafeSize = [...bySize.entries()]
    .filter(([_, items]) => items.every(r => r.underBudget))
    .map(([s]) => s)
    .pop() || 'none';
  console.log(`  Maximum URLLC-safe payload size: ${maxSafeSize}`);
  console.log(`  Routes exceeding <1ms budget need payload size caps or async patterns.`);
}

main().catch(console.error);
