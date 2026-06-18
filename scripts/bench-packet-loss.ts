#!/usr/bin/env tsx
/**
 * Packet loss threshold analysis for Q13 Phase 3
 * Tests HTTP roundtrip success rates under increasing packet loss.
 * Uses a keep-alive single server per loss rate.
 */
import { execSync } from 'node:child_process';
import { hrtime } from 'node:process';
import http from 'node:http';

function setNetemLoss(delayUs: number, lossPct: number): void {
  try { execSync('tc qdisc del dev lo root 2>/dev/null'); } catch {}
  execSync(`tc qdisc add dev lo root netem delay ${delayUs}us loss ${lossPct}%`);
}
function clearNetem(): void {
  try { execSync('tc qdisc del dev lo root 2>/dev/null'); } catch {}
}

const PAYLOAD_1KB = JSON.stringify({
  items: Array.from({ length: 10 }, (_, i) => ({ id: i, name: `Product ${i}`, price: 1999 + i, tags: ['tag-a', 'tag-b'] }))
});

async function benchRoundtrips(lossPct: number, iters: number): Promise<{successes: number; failures: number}> {
  setNetemLoss(1000, lossPct);
  const buf = Buffer.from(PAYLOAD_1KB);
  let successes = 0, failures = 0;

  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', (c) => (body += c.toString()));
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    });
  });

  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const addr = server.address() as { port: number };

  for (let i = 0; i < iters; i++) {
    try {
      const ok = await new Promise<boolean>((resolve) => {
        const req = http.request(
          { hostname: '127.0.0.1', port: addr.port, method: 'POST', path: '/',
            headers: { 'Content-Length': buf.length, 'Content-Type': 'application/json' } },
          (res) => {
            let data = '';
            res.on('data', (c) => (data += c.toString()));
            res.on('end', () => resolve(true));
          }
        );
        req.on('error', () => resolve(false));
        req.write(buf);
        req.end();
      });
      if (ok) successes++;
      else failures++;
    } catch { failures++; }
  }

  server.close();
  clearNetem();
  return { successes, failures };
}

async function main() {
  console.log('=== Packet Loss Threshold Analysis ===');
  console.log('1KB HTTP roundtrips under increasing packet loss');
  console.log('');
  const rates = [0, 0.001, 0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10, 20];
  console.log('Loss %\t\tSuccess/100\tFailure/100\tStatus');
  console.log('------------------------------------------------');
  for (const loss of rates) {
    const r = await benchRoundtrips(loss, 100);
    const s = r.failures === 0 ? 'Stable' : r.failures < 20 ? 'Degraded' : 'Failing';
    console.log(`${loss}%\t\t${r.successes}/100\t\t${r.failures}/100\t\t${s}`);
  }
  console.log('');
  console.log('Done.');
}

main().catch(console.error);
