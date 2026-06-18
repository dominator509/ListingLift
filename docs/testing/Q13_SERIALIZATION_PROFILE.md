# Q13 Phase 1 — Serialization & I/O Profile

## Overview

Comprehensive catalog and micro-benchmark of every serialization/deserialization
path in the ListingLift codebase. Node v24.16.0. All measurements use
`process.hrtime.bigint()` with 100 iterations per test.

Benchmark script: `scripts/bench-serialization.ts`
Raw results: `docs/testing/Q13_SERIALIZATION_BENCH_RESULTS.json`

---

## 1. Serialization Path Catalog

### Edge paths (cross network boundary — response/request wire)

| # | Path | File(s) | Category | Description |
|---|------|---------|----------|-------------|
| 1 | NextResponse.json (jsonOk) | `api-response.ts` | `json_serialize` | `NextResponse.json({ ok: true, data })` — every API route response |
| 2 | JSON.stringify direct | `rate-limiter.ts`, `circuit-breaker.ts` | `json_serialize` | Manual JSON.stringify for rate-limit and circuit-breaker error responses |
| 3 | Response.json (guarded helpers) | `route-helpers.ts` | `json_serialize` | `Response.json()` in guardedGet/guardedPost/guardedPatch/guardedSession |
| 4 | parseJson helper | `route-helpers.ts` | `json_parse` | `request.text() + JSON.parse()` — all POST/PATCH request bodies |
| 5 | serializeSessionCookie | `session-cookie.ts` | `cookie_serialize` | String concatenation of `ll_session=...; HttpOnly; SameSite=Lax; Secure; Path=/; Max-Age=...` |
| 6 | serializeSessionClearCookie | `session-cookie.ts` | `cookie_serialize` | Set-Cookie clear: `ll_session=; HttpOnly; SameSite=Strict; Secure; Path=/; Max-Age=0` |
| 7 | Cookie header regex parse | `session-cookie.ts`, `auth-service.ts` | `cookie_parse` | Regex match `/ll_session=([^;]*)/` on Cookie header |
| 8 | URLSearchParams | `middleware.ts`, `route-helpers.ts` | `url_search_params` | `request.nextUrl.searchParams.set()` for login redirects, jobId extraction |
| 9 | CSV import order mapping | `sales-channels/import/route.ts` | `json_parse` | Batch import: parseJson → schema parse → parallel normalization plan |
| 10 | Prisma findMany → JSON response | `listings/route.ts` | `prisma_json` | Prisma query → JSON.stringify for response (edge + core) |
| 11 | Stripe webhook body parsing | `stripe-billing-orchestrator.ts` | `json_parse` | Stripe Event: event.data.object extraction, type matching, session reconciliation |
| 12 | Headers metadata mapping | `rate-limiter.ts`, `middleware.ts`, `route-helpers.ts` | `string_concat` | x-forwarded-for split+trim, x-real-ip fallback, rate-limit key concat |

### Core paths (DB-internal, no network cost)

| # | Path | File(s) | Category | Description |
|---|------|---------|----------|-------------|
| 13 | FormData field normalization | `upload-intake-service.ts` | `form_data` | File metadata: fileName→sanitizeDbFileName, sizeBytes→Number, mimeType→String |
| 14 | Prisma JSON field serialization | `idempotency-service.ts` | `prisma_json` | resultBody stored as Prisma.InputJsonValue — JSON → DB |
| 15 | SHA-256 token hashing | `session-cookie.ts`, `upload-token-service.ts`, `auth-service.ts`, `csrf-protection-service.ts` | `hash` | `createHash("sha256").update(token).digest("hex")` |
| 16 | Buffer.alloc + timingSafeEqual | `session-binding.ts` | `buffer_encode` | `Buffer.from()` for constant-time comparison of binding hashes |
| 17 | Audit log metadata JSON | `route-helpers.ts`, `stripe-session-reconciliation.ts` | `json_serialize` | JSON.stringify for structured logging |

---

## 2. Micro-Benchmark Results

### 2.1 JSON Response Serialization (Edge)

| Path | 1KB | 10KB | 100KB | 1MB |
|------|-----|------|-------|-----|
| NextResponse.json (jsonOk) | 0.9 μs | 9.3 μs | 548.2 μs | 8,899.5 μs |
| JSON.stringify direct | 1.2 μs | 9.1 μs | 874.0 μs | 9,044.9 μs |
| Response.json (guarded helpers) | 0.6 μs | 6.2 μs | 530.1 μs | 8,738.9 μs |

JSON serialize is consistently ~0.5-1 μs/KB for small payloads. At 1MB, serialize
time scales roughly linearly — NextResponse.json is the fastest at 8.9ms.
Throughput ranges 1,171-1,245 Mbps @ 1MB.

### 2.2 JSON Parse (Edge)

| Path | 1KB | 10KB | 100KB | 1MB |
|------|-----|------|-------|-----|
| parseJson helper | 0.7 μs | 6.4 μs | 919.0 μs | 12,273.8 μs |
| CSV import order mapping | 0.6 μs | 6.4 μs | 909.0 μs | 12,454.1 μs |
| Stripe webhook body parsing | 0.8 μs | 5.8 μs | 973.9 μs | 12,377.0 μs |

Parse is ~30-45% slower than serialize at 100KB+. JSON.parse of 1MB takes
~12ms regardless of source. This is a consistent CPU bottleneck at scale.

### 2.3 Cookie Serialization (Edge)

| Path | 1KB | 10KB | 100KB | 1MB |
|------|-----|------|-------|-----|
| serializeSessionCookie | 1.8 μs | 0.9 μs | 0.9 μs | 1.1 μs |
| serializeSessionClearCookie | 0.9 μs | 0.9 μs | 0.9 μs | 1.5 μs |
| Cookie header regex parse | 2.6 μs | 0.2 μs | 0.2 μs | 0.2 μs |

Cookie operations are sub-microsecond — negligible overhead. Payload size is
irrelevant since cookies use only a short session token.

### 2.4 URLSearchParams (Edge)

| Payload | Time |
|---------|------|
| 1KB | 11.3 μs |
| 10KB | 9.3 μs |
| 100KB | 7.5 μs |
| 1MB | 4.5 μs |

`new URL()` + `searchParams.set()` + `toString()` is ~5-11 μs regardless of
payload size. Payload-independent because only the URL query string is parsed.

### 2.5 Core Paths

| Path | 1KB | 10KB | 100KB | 1MB |
|------|-----|------|-------|-----|
| FormData field normalization | 0.3 μs | 0.2 μs | 0.2 μs | 0.2 μs |
| Prisma JSON field serialization | 0.5 μs | 6.0 μs | 502.8 μs | 7,607.2 μs |
| SHA-256 token hashing | 5.9 μs | 3.2 μs | 3.7 μs | 2.9 μs |
| Buffer.alloc + timingSafeEqual | 2.4 μs | 1.1 μs | 0.9 μs | 1.6 μs |
| Audit log metadata JSON | 0.6 μs | 5.8 μs | 479.9 μs | 9,456.1 μs |

FormData normalization and header mapping are payload-independent and
effectively free (~0.2-0.5 μs). SHA-256 is stable at ~3-6 μs. Prisma JSON
fields and audit logs scale with payload size identically to JSON.stringify.

---

## 3. I/O Profiling

### Read vs Write Asymmetry

| Category | Read (parse) | Write (serialize) | Ratio |
|----------|-------------|-------------------|-------|
| JSON (1MB) | ~12,000-16,000 μs | ~8,700-10,700 μs | ~1.3:1 |
| Cookies | ~0.2-2.6 μs | ~0.9-1.8 μs | ~1:1 |
| URLSearchParams | N/A | ~4.5-11.3 μs | N/A |

JSON.parse is consistently 30-45% slower than JSON.stringify. This asymmetry
means the server spends more CPU deserializing incoming requests than
serializing outgoing responses.

### Buffer vs Streaming Patterns

**Current state: All paths use buffer-based serialization.** No streaming
serialization is present. `request.text()` buffers the entire body before
JSON.parse. `NextResponse.json()` and `Response.json()` serialize the
entire payload to a buffer before sending.

**Recommendation for large payloads:** Implement streaming JSON parse
for webhook bodies >100KB (Stripe, Gumroad). Use `JSON.parse(text)` →
blocking for the full body read.

### Blocking vs Non-Blocking I/O

All serialization paths are synchronous CPU operations (JSON.stringify,
JSON.parse, string concatenation, regex match, crypto hash). They run on
the main thread with no async offloading.

At 1MB payloads, JSON operations block the event loop for ~8-16ms. In a
5G edge context with microsecond targets, this is significant.

### Memory Allocation Patterns

**Large allocations observed at 1MB:**
- JSON serialization allocates ~1.5-2x the payload size in temporary strings
- `request.text()` allocates a full string copy of the body
- SHA-256 hash digest allocates a 64-byte hex string (negligible)
- URLSearchParams allocates a new URL object each invocation

**GC pressure at 100KB+:** Heap deltas of 18-37 MB per test iteration at 1MB
indicate significant GC churn. The negative heap deltas in some results
suggest V8 GC sweeping between iterations.

---

## 4. Network Simulation Baseline

### Localhost Latency (No Emulation)

| Operation | Time | Notes |
|-----------|------|-------|
| Local loopback RTT | ~0.05-0.2 ms | Kernel-level, no real network |
| JSON serialize @ 1KB | ~0.6-1.2 μs | 0.01% of typical request |
| JSON serialize @ 1MB | ~8,700-10,700 μs | 0.87-1.07% of request (at 100ms RTT) |
| JSON parse @ 1KB | ~0.7-1.1 μs | 0.001% of request |
| JSON parse @ 1MB | ~12,000-16,000 μs | 1.2-1.6% of request |
| Cookie/session overhead | ~0.2-5.9 μs | Negligible |

### Serialization as % of Total Request Time

For a typical API request (session check + DB query + response):

| Payload | App logic | DB query | Serialize | Parse | Total | Serialization % |
|---------|-----------|----------|-----------|-------|-------|-----------------|
| 1KB | ~10ms | ~5ms | 0.001ms | 0.001ms | ~15ms | <0.01% |
| 10KB | ~10ms | ~5ms | 0.009ms | 0.009ms | ~15ms | 0.06% |
| 100KB | ~10ms | ~5ms | 0.5ms | 0.9ms | ~16.4ms | 8.5% |
| 1MB | ~10ms | ~5ms | 8.7ms | 12.3ms | ~36ms | 58% |

At 1MB payloads, serialization is the dominant cost — 58% of request time.

---

## 5. Edge vs Core Spatial Map

### 5G Tower Topology

```
  [Client Device]
        |
        | 5G NR (URLLC ~1ms RTT)
        |
  [Tower / Edge Node]
        |    ┌─────────────────────────┐
        |    │ EDGE (Network Boundary) │
        |    │                         │
        |    │ • NextResponse.json     │  ← Response serialization
        |    │ • Response.json         │  ← Guarded helper responses
        |    │ • JSON.stringify direct │  ← Error responses
        |    │ • parseJson             │  ← Request body parsing
        |    │ • serializeSessionCookie│  ← Set-Cookie header
        |    │ • Cookie regex parse    │  ← Cookie header extraction
        |    │ • URLSearchParams       │  ← Redirect query params
        |    │ • Headers metadata      │  ← IP / user-agent mapping
        |    │ • Stripe webhook parse  │  ← Stripe event processing
        |    │ • CSV import parse      │  ← Sales channel normalization
        |    └─────────────────────────┘
        |
        | Fiber / Backhaul (~5-20ms)
        |
  [Core / Central DB]
        |    ┌─────────────────────────┐
        |    │ CORE (DB-Internal)      │
        |    │                         │
        |    │ • Prisma JSON fields    │  ← Idempotency resultBody
        |    │ • Prisma query results  │  ← findMany → JSON (also edge)
        |    │ • FormData normalization│  ← File metadata mapping
        |    │ • SHA-256 hashing       │  ← Token hashing (session, CSRF)
        |    │ • Buffer.alloc          │  ← timingSafeEqual
        |    │ • Audit log JSON        │  ← Log metadata serialization
        |    └─────────────────────────┘
```

### Spatial Summary

| Layer | Paths | Latency Budget | Bottleneck Risk |
|-------|-------|---------------|-----------------|
| **Edge** (network boundary) | 12 paths (JSON serialize/parse, cookies, URL params, headers, webhooks, CSV) | Must complete within URLLC budget (~1ms) | Heavy JSON at 100KB+ exceeds URLLC budget |
| **Core** (DB-internal) | 5 paths (Prisma JSON, FormData, hashing, buffer, audit logs) | No network constraint | Prisma JSON serialization at 1MB takes ~7.6ms which blocks DB write path |

**Key finding:** JSON serialization/deserialization at >100KB payloads on the
edge path exceeds the guaranteed URLLC budget of 1ms. At 1MB, no edge
serialization path can meet URLLC requirements.

---

## 6. Top 3 Heaviest Serialization Paths

| Rank | Path | Serialize @ 1MB | Parse @ 1MB | Impact |
|------|------|-----------------|-------------|--------|
| **1** | Prisma findMany → JSON response (listings) | 10,748.7 μs | 11,953.9 μs | Primary data listing route — affects every "view jobs" page load |
| **2** | Audit log JSON.stringify | 9,456.1 μs | 11,629.6 μs | Runs on every important operation — compounding cost |
| **3** | Stripe webhook body parsing | 9,264.4 μs | 12,377.0 μs | Payment-critical path — delays confirmation to client |

All three exceed 9ms serialize and 11ms parse at 1MB. The Prisma listing route
is particularly impactful because it runs on every page load with potentially
large datasets.

---

## 7. Recommendations for Q13 5G Edge Optimization

1. **Payload pagination/compression for listings** — Cap Prisma findMany
   responses at 50KB compressed. Use cursor-based pagination to avoid 1MB
   serialization on the edge.

2. **Streaming JSON for webhooks** — Replace buffered `request.text()` with
   streaming parse for Stripe/Gumroad webhook bodies. Avoid the full-body
   buffer allocation.

3. **Compress audit log serialization** — Batch-structured JSON logging
   instead of per-event stringify. Accumulate events and flush periodically.

4. **URLLC budget compliance** — All edge JSON paths at ≤100KB payloads
   complete within 1ms. Enforce a 100KB limit on edge-bound serialization
   or fall back to streaming for larger payloads.

5. **Memory reuse** — Cache `JSON.stringify` results for static response
   shapes. Avoid allocating `new URL()` per request in hot middleware paths.

---

## Reference

- Benchmark script: `scripts/bench-serialization.ts`
- Raw results: `docs/testing/Q13_SERIALIZATION_BENCH_RESULTS.json`
- Node version: v24.16.0
- Platform: linux x64
- Total benchmark time: 20,982 ms
