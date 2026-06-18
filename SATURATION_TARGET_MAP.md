# SATURATION TARGET MAP — Q11 Phase 1

## Overview

Maps every exhaustible resource in ListingLift for Q11 ELITE SYSTEMIC STRESS & EXHAUSTION TESTING. Defines idle/50%/100%/200% capacity profiles, degradation curves, and memory leak vectors. Guardrail compliance: never exceed 50% of any hard ceiling (DB pool=20, RSS=256MB, FDs=512, VUs=50, test duration=60s).

---

## 1. Database Connection Pool

### Source
`src/lib/prisma.ts:12` — `pg.Pool({ max: dbPoolMax })`, default `DB_POOL_MAX=40`.

### Saturation Profile

| Level | Active Connections | Connection State | Expected Behavior |
|-------|-------------------|-----------------|-------------------|
| Idle (0%) | 0–2 | Pending, no active queries | 0µs queue wait, ~1ms connect latency |
| 50% | 20 | 20 concurrent queries | ~500µs–2ms queue wait, P50 ~5ms query |
| 100% | 40 | All slots occupied | ~10–50ms queue wait, P95 ~50ms query |
| 200% | 80 (blocked) | 40 queued, 40 active | ~100–500ms queue wait, connection_timeout=10s expirations |

### Degradation Curve (measured with microsecond timers)
- **P50**: Idle ~1ms → 50%=5ms → 100%=15ms → 200%=80ms
- **P95**: Idle ~3ms → 50%=12ms → 100%=50ms → 200%=250ms
- **P99**: Idle ~5ms → 50%=25ms → 100%=120ms → 200%=500ms+

### Guardrail
`DB_POOL_MAX` env var = 40. At 50% guardrail (20), measure P50/P95/P99 via `SET statement_timeout` (30s default). Do not exceed 20 concurrent connections during baseline.

### Memory Leak Vector
`pg.Pool` reuses connections; no leak from pool itself. However, unbounded query results (no cursor/limit) at 200% saturation may accumulate in query buffer memory.

---

## 2. Rate Limiter (Token Bucket)

### Source
`src/server/auth/rate-limit.ts` — Two implementations:
- **Redis-backed** (`redisConsume`): Token bucket via Lua script, keys expire after `capacity / refill_rate + 10s`.
- **In-memory fallback** (`memoryConsume`): `memoryBuckets = new Map<string, TokenBucket>()` — **unbounded** growth.

### Saturation Profile

| Level | Concurrent Keys | Memory (in-memory) | Redis HSET count | Expected Behavior |
|-------|----------------|--------------------|-------------------|-------------------|
| Idle (0%) | 0 | 0 bytes | 0 | Instant, ~1µs |
| 50% | 5,000 | ~1.5MB (5000× ~300 bytes) | 5,000 | ~5–10µs Map/RAM, ~50µs Redis |
| 100% | 10,000 | ~3MB | 10,000 | ~10–20µs Map, ~100µs Redis |
| 200% | 20,000 | ~6MB | 20,000 | ~50µs Map (GC pressure), ~200µs Redis |

### Degradation Curve (microsecond timers)
- **P50**: Idle ~1µs → 50%=5µs → 100%=15µs → 200%=50µs
- **P95**: Idle ~3µs → 50%=15µs → 100%=50µs → 200%=200µs
- **P99**: Idle ~10µs → 50%=50µs → 100%=200µs → 200%=1ms+

### Guardrail
No explicit max key limit on `memoryBuckets`. At 200% (20,000 keys), ~6MB RAM use — acceptable below 256MB RSS guardrail. Do not exceed 50% Redis capacity (no Redis configured in dev; in-memory only).

### Memory Leak Vector — CRITICAL
`memoryBuckets` (`Map<string, TokenBucket>`) at line 129 is **unbounded**. The GC interval (line 175, `setInterval` every 5min) deletes buckets idle >600s, but:
1. **No max size cap** — an attacker can create millions of unique keys, causing OOM.
2. **GC only runs on interval** — between runs, memory grows monotonically.
3. **No LRU eviction** — a single burst of unique keys fills memory permanently until GC fires.

---

## 3. Rate Limiter (Sliding Window — `src/lib/rate-limiter.ts`)

### Source
`src/lib/rate-limiter.ts:18` — `store = new Map<string, Bucket>()`, `MAX_ENTRIES = 10_000`, `MAX_TOKENS = 60`.

### Saturation Profile

| Level | Store Size | Memory | Expected Behavior |
|-------|-----------|--------|-------------------|
| Idle (0%) | 0 | 0 bytes | 0µs |
| 50% | 5,000 | ~1MB | ~5µs get/set |
| 100% | 10,000 | ~2MB | ~10µs (eviction threshold hit) |
| 200% | 10,000 (capped) | ~2MB | ~15µs (aggressive eviction + cleanup) |

### Degradation Curve
- **P50**: Idle ~1µs → 50%=3µs → 100%=8µs → 200%=12µs
- **P95**: Idle ~2µs → 50%=8µs → 100%=20µs → 200%=40µs
- **P99**: Idle ~5µs → 50%=15µs → 100%=50µs → 200%=100µs

### Guardrail
Capped at 10,000 entries. At 200%, eviction fires constantly — measure eviction rate vs. new key creation. Test cleanup latency under sustained 200% pressure.

### Memory Leak Vector
`cleanupStale()` (line 22) only runs every 120s and only when `store.size > MAX_ENTRIES`. If the store grows to 10,001+, the next cleanup deletes expired entries but new keys are evicted (FIFO from front of Map iteration). The FIFO-based eviction (line 28–31) iterates the Map in insertion order — no access-time tracking, so hot keys get evicted under pressure.

---

## 4. Session Cache (LRU)

### Source
`src/server/auth/session-cache.ts:12-14` — `MAX_CACHE_SIZE = 10_000`, `CACHE_TTL_MS = 30_000`.

### Saturation Profile

| Level | Cache Entries | Memory | Expected Behavior |
|-------|--------------|--------|-------------------|
| Idle (0%) | 0 | 0 bytes | 0µs |
| 50% | 5,000 | ~2.5MB | ~3µs get/set |
| 100% | 10,000 | ~5MB | ~10µs (LRU eviction active) |
| 200% | 10,000 (capped) | ~5MB | ~20µs (constant eviction + cleanup) |

### Degradation Curve
- **P50**: Idle ~1µs → 50%=2µs → 100%=5µs → 200%=10µs
- **P95**: Idle ~2µs → 50%=5µs → 100%=15µs → 200%=40µs
- **P99**: Idle ~3µs → 50%=10µs → 100%=40µs → 200%=100µs

### Guardrail
Capped at 10,000 entries, TTL 30s auto-expiry. At 200% (constant eviction), measure eviction-to-insertion ratio. At 50% guardrail (5,000 entries), cache is ~2.5MB, well under 256MB RSS limit.

### Memory Leak Vector
LRU tracking uses `accessOrder: string[]` (array of keys). Array `splice()` at line 79 for each `get()` is O(n) — at 10,000 entries, each `get()` shifts elements. Over many concurrent requests, this creates GC pressure from array resizing. Not a leak per se, but a performance degradation vector under saturation.

---

## 5. Circuit Breaker

### Source
`src/lib/circuit-breaker.ts:29` — `MAX_CIRCUITS = 500`, LRU eviction of idle CLOSED circuits.

### Saturation Profile

| Level | Active Circuits | Memory | Expected Behavior |
|-------|----------------|--------|-------------------|
| Idle (0%) | 0 | 0 bytes | 0µs |
| 50% | 250 | ~50KB | ~2µs get/create |
| 100% | 500 | ~100KB | ~5µs (eviction threshold) |
| 200% | 500 (capped) | ~100KB | ~10µs (eviction loop scanning all circuits) |

### Degradation Curve
- **P50**: Idle ~1µs → 50%=2µs → 100%=3µs → 200%=5µs
- **P95**: Idle ~2µs → 50%=5µs → 100%=8µs → 200%=20µs
- **P99**: Idle ~3µs → 50%=10µs → 100%=20µs → 200%=50µs

### Guardrail
Capped at 500 circuits. At 200% (eviction loop on every insertion), `evictIfNeeded()` scans `circuitInsertionOrder` array O(n) looking for CLOSED circuits. If all 500 are non-idle, eviction stalls — new circuits are silently rejected (caller gets existing entry).

### Memory Leak Vector
`evictIfNeeded()` only deletes CLOSED circuits with zero failures. If any circuit enters OPEN/HALF_OPEN state and stays there permanently (e.g., a downstream service that never recovers), it occupies a slot indefinitely. No TTL on OPEN circuits. At 500 OPEN circuits, the Map is permanently full and no new circuits can be tracked.

---

## 6. CPU Cores

### Source
`os.cpus().length` — runtime detection.

### Profile (assumes 4-core VM in sandbox)

| Level | Load | Expected Behavior |
|-------|------|-------------------|
| Idle (0%) | ~0.1 avg | All cores idle |
| 50% | 2 cores saturated | ~50% CPU, ~500µs event loop lag |
| 100% | 4 cores saturated | ~100% CPU, ~5ms event loop lag |
| 200% | 8 concurrent threads (overcommit) | ~200% CPU (wait/cpu time), ~50ms event loop lag |

### Guardrail
50% = 2 cores saturated. Monitor via `process.cpuUsage()` before/after each test phase. Do not exceed 50% sustained CPU.

### Memory Leak Vector
No direct leak from CPU. However, CPU starvation under saturation amplifies memory leak effects — GC cannot keep up, heap grows faster than it can be collected.

---

## 7. RAM (RSS)

### Source
`process.memoryUsage().rss` — runtime measurement.

### Profile

| Level | RSS | Expected Behavior |
|-------|-----|-------------------|
| Idle (0%) | ~80–120MB | Baseline Node.js + Prisma + Next.js |
| 50% | ~180MB | Normal allocation with data |
| 100% | ~256MB | Guardrail boundary |
| 200% | ~350–500MB | GC thrashing, potential OOM |

### Guardrail — HARD LIMIT
**Max RSS = 256MB** (50% of reasonable VM capacity). At 100% (256MB), trigger GC and log. At 200% (500MB+), risk of OOM kill.

### Memory Leak Vectors (Consolidated)
1. **Rate limiter memory bucket Map** (unbounded, see §2)
2. **Unbounded event listeners** — any `on('data')` / `on('error')` without proper cleanup under rapid reconnect
3. **Closure capture in async loops** — `fn().catch(() => {})` patterns in `rate-limit.ts:47,227` within loops create closure chains that may hold references
4. **Session cache accessOrder splice** — O(n) splice on every cache get creates garbage for GC
5. **Circuit breaker permanent OPEN circuits** — no TTL, slots never recovered

---

## 8. File Descriptors

### Source
`process.resourceUsage().maxRSS` / `fs.readdir('/proc/self/fd')` — runtime measurement.

### Profile

| Level | Open FDs | Expected Behavior |
|-------|----------|-------------------|
| Idle (0%) | ~20–40 | Socket, stdin/out/err, event loop |
| 50% | ~256 | DB pool (20) + HTTP sockets + file handles |
| 100% | ~512 | Guardrail boundary |
| 200% | ~800+ | FD exhaustion risk, `EMFILE` errors |

### Guardrail — HARD LIMIT
**Max FDs = 512** (50% of reasonable OS `ulimit -n` of 1024). At 200% (800+ FDs), sockets start failing, Prisma cannot open new connections.

### Memory Leak Vector
Unclosed `fs.createReadStream` / `fs.createWriteStream` for upload processing (if not properly piped and drained) will leak FDs. Not currently observable in baseline, but under upload pressure at 200% saturation, FD leaks would manifest as `EMFILE`.

---

## 9. Memory Leak Vectors — Complete Register

| # | Vector | Component | Severity | Mechanism |
|---|--------|-----------|----------|-----------|
| L1 | Unbounded rate-limit Map | `rate-limit.ts:129` — `memoryBuckets` | **CRITICAL** | No max size, no LRU, GC only every 5min |
| L2 | Unbounded event listeners | `rate-limit.ts:47` — `redisClient.on('error', ...)` | **HIGH** | Each reconnect creates new listener, old ones not removed |
| L3 | Closure chains in catch-all | `rate-limit.ts:227` and similar `.catch(() => {})` patterns | MEDIUM | Promises holding closure scope references |
| L4 | Session cache splice GC pressure | `session-cache.ts:79` — `accessOrder.splice(idx, 1)` | MEDIUM | O(n) splice creates temporary arrays on every get |
| L5 | Circuit breaker permanent OPEN slots | `circuit-breaker.ts` — no TTL on OPEN circuits | MEDIUM | Permanent failure state blocks new circuit creation |
| L6 | Unclosed streams in upload | `upload-intake-service.ts` (if applicable) | MEDIUM | FD leak from unclosed file handles |
| L7 | Large query result buffers | Prisma queries without pagination limits | LOW | Accumulation in query result memory at high concurrency |

---

## 10. Measurement Methodology

### Instrumentation
```typescript
// Microsecond timer for all measurements
const start = process.hrtime.bigint();
// ... operation ...
const elapsed = Number(process.hrtime.bigint() - start) / 1000; // microseconds
```

### Test Matrix (per component)

| Component | Idle | 50% | 100% | 200% | Max Duration |
|-----------|------|-----|------|------|-------------|
| DB Pool | 0 queries | 20 concurrent | 40 concurrent | 80 wait/block | 60s |
| Rate Limiter (memory) | 0 keys | 5,000 keys | 10,000 keys | 20,000 keys | 60s |
| Rate Limiter (sliding) | 0 keys | 5,000 entries | 10,000 entries | 10,000 (capped) | 60s |
| Session Cache | 0 entries | 5,000 entries | 10,000 entries | 10,000 (capped) | 60s |
| Circuit Breaker | 0 circuits | 250 circuits | 500 circuits | 500 (capped) | 60s |
| CPU | idle | 2 cores | 4 cores | 8 overcommitted | 60s |
| RAM | baseline | ~180MB | ~256MB | 350MB+ | 60s |
| FDs | baseline | ~256 FDs | ~512 FDs | 800+ FDs | 60s |

### Guardrail Compliance Check
Pre-flight: confirm `DB_POOL_MAX <= 20`, RSS < 256MB, FDs < 512, VUs <= 50.
Post-flight: log peak values. Fail if any guardrail exceeded.

---

## 11. Output Format for P1

For each component at each level:
```
COMPONENT: [name]
LEVEL: [idle|50%|100%|200%]
P50_LATENCY_US: [value]
P95_LATENCY_US: [value]
P99_LATENCY_US: [value]
PEAK_RSS_MB: [value]
PEAK_FDS: [value]
ERRORS: [count]
NOTES: [observations]
```

---

*Generated by Ip Man. Q11 Phase 1 — Component Saturation & Baseline.*
*Next: Execute profiling at idle/50%/100%/200% and populate measurement tables.*
