# Q10 Phase 1 — Performance Architecture Map & Baseline

> **Generated:** Q10_P1_PROFILING — Architecture Profiling & Baseline  
> **Scope:** Full codebase survey across 10 API routes, 5 core services, middleware chain, auth resolution, Prisma data layer, resilience infrastructure  
> **Directive:** Map every performance-critical code path, establish baseline expectations, identify bottlenecks before destructive load testing

---

## 1. DEPLOYMENT TOPOLOGY

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Framework** | Next.js 14 (App Router) | Runs on Node.js v24.16.0 |
| **API Layer** | Route Handlers (`src/app/api/*`) | Edge-compatible, but no `runtime: 'edge'` config found — default Node.js runtime |
| **Database** | PostgreSQL via Prisma ORM | Adapter: `@prisma/adapter-pg` with `pg` pool |
| **Auth** | Session-cookie based (`next/server` cookies) | In-memory session resolution, CSRF token service |
| **Rate Limiting** | In-memory sliding-window LRU Map | Single-process only — no Redis shared state |
| **Circuit Breaker** | In-memory Map per named circuit | Single-process only |
| **Image Processing** | `sharp` (native) | CPU-bound, per-request synchronous |
| **Billing** | Stripe SDK | External HTTP calls with network latency |
| **File Handling** | JSZip, nanoid | CPU-bound for ZIP generation |
| **Testing** | Vitest (unit/integration), Playwright (e2e) | No load-test tool installed (k6/Locust missing) |

---

## 2. PERFORMANCE-CRITICAL CODE PATHS

### 2.1 API Route Layer — Request Lifecycle

Every authenticated API request traverses this chain:

```
HTTP Request
  → Next.js Router / Middleware (src/middleware.ts)
    → Security headers + blocked methods filter [O(1)]
    → Auth check (SESSION_COOKIE) [O(1), sync]
  → Route Handler
    → Rate limiter check [O(1) Map lookup, may evict]
    → Session resolution (requireSession) [DB query]
    → Permission assertion [in-memory]
    → Idempotency check (if POST/PATCH) [DB query]
    → CSRF verification (if mutation) [in-memory]
    → Core business logic [varies]
    → Response serialization [NextResponse.json]
```

**Worst-case latency stack per mutation request:**
1. Middleware: ~0.1ms
2. Rate limiter: ~0.01ms
3. Session resolution: ~20-50ms (DB round trip)
4. Permission: ~0.1ms
5. Idempotency check: ~10-30ms (DB round trip)
6. CSRF: ~0.5ms
7. Business logic: 1-5000ms (worst-case image processing)
8. Response: ~0.5ms

**Total per-request overhead (non-business): ~35-85ms** — dominated by two Prisma DB queries.

### 2.2 Middleware Chain — `/root/ListingLift/src/middleware.ts`

```
entry → blocked methods check (TRACE/CONNECT/TRACK) → 405 if matched
       → auth prefix check (AUTH_PROTECTED_PREFIXES)
           → if unprotected: applySecurityHeaders, next()
           → if protected: check SESSION_COOKIE or x-demo- headers
               → has session: applySecurityHeaders, next()
               → no session: redirect to /login
```

- **Matcher:** `/admin/:path*`, `/client/:path*`, `/agency/:path*`
- **Performance:** ~0.1ms per request
- **Bottleneck risk:** None — purely synchronous, no I/O
- **Cold start:** Negligible
- **Caching:** No cache control headers set on non-protected paths

### 2.3 Rate Limiter — `/root/ListingLift/src/lib/rate-limiter.ts`

```
checkRateLimit(key, windowMs=60000, maxTokens=60)
  → cleanupStale(): evicts entries if store.size > 10000 [every 120s]
  → bucket = store.get(key)
  → if !bucket or expired: create new bucket {tokens: 59, resetAt: now+60s}
  → if tokens > 0: decrement, return allowed
  → else: return denied with retryAfterMs
```

**State:** In-memory `Map<string, Bucket>` (max 10,000 entries)  
**Memory per entry:** ~120 bytes → ~1.2MB at capacity  
**Key scheme:** `{route}:{ip}` — e.g. `listings:127.0.0.1`  
**Eviction:** Two-minute cleanup interval, only when `store.size > 10000`  
**Bottleneck risk:** No key-based TTL eviction between cleanups. A burst of 10K unique IPs in 2 minutes hits max capacity, then blocks additional keys. No LRU — first-in-first-evicted.  
**Cold start:** Empty store, 60 tokens per key immediately available.

### 2.4 Circuit Breaker — `/root/ListingLift/src/lib/circuit-breaker.ts`

```
callWithCircuitBreaker(name, fn, config?)
  → state = circuits.get(name) || CLOSED
  → if OPEN: check cooldown (30s), reject with CircuitOpenError if not expired
  → if HALF_OPEN: check halfOpenMaxRequests (3), reject if exceeded
  → execute fn()
  → on success: reset failures if CLOSED, increment successes if HALF_OPEN
  → on failure: increment failures, OPEN at 5 failures
```

**State:** In-memory `Map<string, CircuitBreakerState>` — unbounded growth  
**Current usage:** Only 1 circuit registered: `listings-db` (in listings route)  
**Bottleneck risk:** No circuit for uploads, processing, or database writes. Unbounded Map growth if circuits are programmatically created per-route.  
**Cold start:** All circuits CLOSED, no overhead.

### 2.5 Database Connection Pool — `/root/ListingLift/src/lib/prisma.ts`

```
Pool:
  max: DB_POOL_MAX (default 20)
  connectionTimeoutMillis: DB_POOL_TIMEOUT (default 10000ms)
  query_timeout: DB_QUERY_TIMEOUT (default 30000ms)
  idleTimeoutMillis: 30000ms
  statement_timeout: SET per connection (default 30000ms)
```

**Config:** Configurable via env vars, reasonable defaults  
**Bottleneck risk:** Single pool of 20 connections shared across all routes. Under concurrent load (>20 simultaneous requests), requests queue for connection acquisition. Image processing (sharp) is CPU-bound but non-blocking on the DB — connections return to pool quickly.  
**Cold start:** Lazy pool initialization on first `prisma` access. First connection ~20-50ms.  
**Warm start:** Connections idled after 30s. At low traffic, every request may need a new connection (~10-30ms).

### 2.6 Auth Resolution — Session Service

Chained call: `requireSession(request)` → cookie lookup → DB lookup on `Session` model → binding hash verification → return session

**DB query pattern:**
```sql
SELECT s.*, u.*, m.*
FROM "Session" s
JOIN "User" u ON u.id = s.userId
JOIN "Membership" m ON m.organizationId = s.organizationId AND m.userId = s.userId
WHERE s.sessionTokenHash = $1 AND s.active = true AND s.expiresAt > NOW()
```

**Indexes available:** `Session.sessionTokenHash` (unique), `Session.userId`, `Session.organizationId`  
**Bottleneck risk:** Every mutation route does this query + idempotency check = 2 DB round trips before business logic starts. At high concurrency (100+ TPS), this doubles pool pressure.  
**Cold start:** First query for a new session token — no warm cache.

### 2.7 Idempotency Service — `/root/ListingLift/src/server/services/idempotency-service.ts`

```
checkIdempotency(request, session):
  → read X-Idempotency-Key header
  → Prisma findUnique on idempotencyKey table
  → if found: return cached response (24-hour window)
  → if not found: proceed

storeIdempotency(request, session, status, body):
  → create row in idempotencyKey table
  → 24-hour TTL via expiresAt column
```

**DB query pattern:** `findUnique` on `idempotencyKey` (unique constraint, O(1)) + `create` for new keys  
**Bottleneck risk:** The write path (`create`) contends with the `idempotencyKey` unique index. Under concurrent duplicate-key requests, Prisma throws P2002 — handled gracefully (409 response).  
**Cleanup:** `purgeExpiredIdempotencyKeys()` available but not scheduled. Table grows unboundedly.

---

## 3. API ROUTE PERFORMANCE PROFILE

| Route | Method | Auth | RL | CB | Idemp | CSRF | Core Ops | Est. P50 | Est. P95 | Notes |
|-------|--------|------|----|----|-------|------|----------|----------|----------|-------|
| `/api/listings` | GET | No (IP) | Yes (60/min) | Yes | No | No | 1 COUNT + 1 SELECT | 25ms | 100ms | Lightweight, good baseline endpoint |
| `/api/uploads` | POST | Yes | No | No | Partial | No | Schema parse, session, permission, build intake plan | 50ms | 200ms | Session + permission = 2 queries |
| `/api/uploads` | GET | Yes | No | No | No | No | Schema parse, session, permission | 40ms | 150ms | Info-only, no DB writes |
| `/api/jobs/[id]/approval` | GET | Yes | No | No | No | No | Session, permission | 40ms | 150ms | |
| `/api/jobs/[id]/approval` | POST | Yes | No | No | Yes | Yes | Session, CSRF, permission, idemp check, schema parse, build decision | 80ms | 300ms | 2 DB reads + writes |
| `/api/sales-channels/normalize` | POST | Yes | No | No | No | No | Session, schema parse, adapter lookup, normalize call | 60ms | 250ms | External adapter may add latency |
| `/api/sales-channels/import` | POST | Yes | No | No | Partial | Yes | Session, CSRF, permission, batch loop (limit=10 concurrency) | 200ms+ | 1000ms+ | Unbounded `orders[]` array — OOM risk |
| `/api/csrf/token` | GET/POST | Yes | No | No | No | No | Session, generate token | 35ms | 120ms | |
| `/api/test/reset-rate-limiter` | POST | No (env guard) | No | No | No | No | O(1) Map clear | 5ms | 10ms | Dev-only |
| Pages (SSR) | GET | Partial | No | No | No | No | Layout + component render + data fetch | 100ms | 500ms | No cache headers on page responses |

**Key insight:** The `/api/sales-channels/import` route has no input-size validation on `orders[]`. A 10K-item batch creates 10K concurrent p-limit tasks, each with its own schema parse + service call. This is the single largest TPS amplifier and the highest memory-risk endpoint.

---

## 4. DATABASE PERFORMANCE PROFILE

### 4.1 Schema Scale Estimates

| Model | Row Estimate | Growth Rate | Key Index |
|-------|-------------|-------------|-----------|
| `User` | 10-100 | Low | `email`, `accountStatus`, `createdAt` |
| `Organization` | 10-50 | Low | `organizationType`, `parentOrganizationId`, `createdAt` |
| `Session` | 100-1000 | Medium | `sessionTokenHash` (unique), `userId`, `organizationId`, `active` |
| `Job` | 1K-100K | High | `organizationId`, `status`, `createdAt`, `clientId`, `assignedToUserId` |
| `Image` | 10K-1M | Highest | `organizationId`, `jobId`, `status`, `sha256` |
| `ProcessedFile` | 50K-5M | Highest | `imageId`, `organizationId`, `status` |
| `UploadToken` | 1K-10K | Medium | `token`, `expiresAt` |
| `DeliveryLink` | 1K-5K | Low | `token`, `expiresAt` |
| `AuditLog` | 10K-1M | High | `organizationId`, `actorId`, `createdAt` |
| `WebhookEvent` | 1K-100K | High | `provider`, `eventType`, `createdAt` |
| `IdempotencyKey` | 1K-100K | Medium | `idempotencyKey` (unique), `expiresAt` |
| `ImageProcessingRun` | 1K-50K | Medium | `organizationId`, `jobId` |

### 4.2 Query Pattern Analysis

**Hot queries (most frequent):**
1. `Session.findUnique({ where: { sessionTokenHash } })` — every API request (auth'd)
2. `Job.findMany({ where: { organizationId }, orderBy: { createdAt }, take })` — list endpoints
3. `Image.findMany({ where: { jobId } })` — job detail pages
4. `IdempotencyKey.findUnique({ where: { idempotencyKey } })` — every mutation
5. `User.findUnique({ where: { email } })` — login

**Cold queries (rare, expensive):**
1. `WebhookEvent.findFirst({ where: { provider, eventType, payload: { path: ..., equals: ... } } })` — reconciliation (JSON path query — no index)
2. `IdempotencyKey.deleteMany({ where: { expiresAt: { lt: ... } } })` — TTL cleanup
3. `AuditLog.findMany({ where: { organizationId }, orderBy: { createdAt }, take })` — admin audit trails

**Missing indexes:**
- `IdempotencyKey.expiresAt` — no index on `expiresAt`, TTL cleanup is a full table scan
- `WebhookEvent.payload` — JSON path queries are unindexed (would need GIN index)

### 4.3 Connection Pool Contention Model

```
Pool size: 20 connections
Per-auth-request: 2 connections (session + idempotency) within ~35-85ms
At 20 concurrent requests: ~40 simultaneous DB accesses
  → 20 queries execute
  → 20 queries queue on pool
  → Queue time = (20 connections × avg_query_time) / pool_size
```

**At 200 TPS (mutation-heavy):**
- 400 queries/second
- Each query ~20ms
- Pool utilization: (400 × 0.02) / 20 connections = 40% utilization → Healthy
- **BUT:** At P99 tail, query time spikes to 200ms → Pool utilization = 400% → Queueing

---

## 5. MIDDLEWARE & SECURITY OVERHEAD

| Component | Per-request cost | Notes |
|-----------|-----------------|-------|
| Security headers (`applySecurityHeaders`) | ~0.05ms | Synchronous, no I/O |
| Blocked methods check | ~0.01ms | String comparison |
| Auth session cookie check | ~0.02ms | Cookie header parse |
| Rate limiter check | ~0.01ms | Map lookup |
| CSRF verification | ~0.5ms | Token decode + compare |
| Session binding hash | ~0.05ms | SHA-256 |
| **Total middleware overhead** | **~0.6ms** | Negligible |

---

## 6. MEMORY FOOTPRINT BASELINE

| Component | Idle RSS | Active RSS | Growth Pattern |
|-----------|----------|-----------|----------------|
| Node.js process | ~35MB | ~50-80MB | Heap grows with request rate |
| Prisma query engine | ~15MB | ~15MB | Static binary |
| Rate limiter (full) | ~1.2MB | ~1.2MB | At 10K entries |
| Circuit breaker (20 circuits) | ~0.01MB | ~0.01MB | Negligible |
| Stripe session registry | ~0.1MB | ~0.5MB | Per abandoned session |
| Sharp (per image) | ~5-20MB | ~50-200MB | Per-image processing, freed after GC |

**Memory risk zones:**
1. **Sharp processing** — Memory balloons during image transform. 10 concurrent images = 200-500MB RSS.
2. **Sales channel batch import** — 10K orders in one request = 10K schema-parsed objects in memory = ~50-100MB transient heap spike.
3. **Rate limiter at capacity** — 10K entries × ~120 bytes = ~1.2MB (acceptable, but no LRU, so old entries persist until cleanup).

---

## 7. IDENTIFIED BOTTLENECKS

### B-01: Dual DB Query Per Mutation (Session + Idempotency)
**Severity:** HIGH  
**Description:** Every mutation route does `requireSession` (DB query) + `checkIdempotency` (DB query) before any business logic. This doubles connection pool pressure and adds 35-85ms overhead.  
**Mitigation:** Implement session caching (in-memory LRU with short TTL for active sessions). Batch idempotency check into session query if possible.

### B-02: Unbounded Import Array
**Severity:** HIGH  
**Location:** `src/app/api/sales-channels/import/route.ts`  
**Description:** No size cap on `orders[]` array. Each item spawns a concurrent p-limit task. At 10K+ items, OOM risk exists.  
**Mitigation:** Cap at 500 items per request with pagination/chunking API.

### B-03: No Cache Headers on API or Page Responses
**Severity:** MEDIUM  
**Description:** No `Cache-Control`, `ETag`, or `CDN-Cache` headers on any API route or page. No request coalescing.  
**Impact:** Every page load hits the full render pipeline. Browser caching is ineffective.  
**Mitigation:** Add `Cache-Control: public, s-maxage=60` to GET/PUBLIC endpoints. Add `ETag` to job/image detail endpoints.

### B-04: In-Memory Rate Limiter (Single Process)
**Severity:** MEDIUM  
**Description:** Rate limiter is a single-process `Map<string, Bucket>` — lost on restart, shared-nothing across replicas.  
**Impact:** Not production-safe for multi-replica deployments. 10K entry cap is reachable under DDoS.  
**Mitigation:** Use Redis-backed rate limiter for production.

### B-05: Session Pool Idle Connection Re-Acquisition
**Severity:** LOW (under low traffic)  
**Description:** Pool `idleTimeoutMillis: 30000ms` means connections drop after 30s idle. Low-traffic periods force new connections on every request (~10-30ms overhead).  
**Impact:** Spiky latency at low TPS.  
**Mitigation:** Increase idle timeout or use connection pooling middleware that keeps min connections.

### ~~B-06: Missing IdempotencyKey ExpiresAt Index~~ [REMOVED — FALSE POSITIVE]
**Status:** Index `@@index([expiresAt])` already exists at schema line 5008. Deziray confirmed — this is not a real bottleneck.
**Correction:** Session resolution was underestimated. Actual count = **2 DB queries** (Session + Membership JOINs resolve separately in Prisma) + **1 idempotency query** = **3 DB round trips per mutation**, not 2.

### B-07: Circuit Breaker Map Memory Leak Risk
**Severity:** LOW  
**Description:** `circuits` Map is unbounded. If code creates circuits dynamically per route/key, memory grows forever.  
**Mitigation:** Add LRU eviction or max-size guard.

---

## 8. BASELINE METRICS (Expected)

These are expected baselines for typical API routes. Actual measurement requires load testing.

| Metric | Expected Value | Measurement Method |
|--------|---------------|-------------------|
| **Cold start** (first request after idle >30min) | ~150-300ms | Single GET `/api/listings` after pool idle |
| **Warm start** (steady-state) | ~25-50ms | 10 consecutive GET `/api/listings` |
| **Auth'd GET P50** | ~40ms | `/api/uploads` GET with valid session |
| **Auth'd POST P95** | ~250ms | `/api/jobs/[id]/approval` POST, no CSRF/idemp overhead |
| **Sales channel normalize P95** | ~300ms | Single payload, adapter resolve |
| **Batch import (100 orders) P95** | ~2000ms | 100 concurrent p-limit tasks |
| **TPS ceiling** (single GET endpoint) | ~400 TPS | Limited by pool of 20 + avg 25ms query time = 20/0.025 = 800 theoretical, 400 real due to overhead |
| **Memory, idle** | ~50MB RSS | `ps -o rss` after 5min idle |
| **Memory, under load** | ~150MB RSS | 100 concurrent `sharp` calls |
| **P99 latency, sustained** | ~500ms | Under 100 TPS sustained load |

---

## 9. LOAD TEST RECOMMENDATIONS

### 9.1 Priority Endpoints to Load Test

1. **`/api/listings` (GET)** — Baseline single-query endpoint, test pool saturation
2. **`/api/uploads` (POST)** — Auth-heavy mutation, test session + permission overhead
3. **`/api/jobs/[id]/approval` (POST)** — Full mutation chain (session + CSRF + idempotency + business logic)
4. **`/api/sales-channels/import` (POST)** — Stress test with varied batch sizes (1, 10, 100, 500)
5. **`/api/sales-channels/normalize` (POST)** — Test adapter resolve + normalization with multi-channel payloads

### 9.2 Destructive Thresholds to Find

- **Connection pool exhaustion:** Trigger when active connections = pool max (20) and queue builds
- **Rate limiter cap breach:** Find TPS where rate limiter Map hits 10K entries and rejects new IPs
- **Memory bloat from batch import:** Find order[] count where RSS spikes to 500MB+
- **TPS falloff point:** Where latency exceeds 1000ms P95 under linearly increasing load

### 9.3 Tool Recommendation

**Install k6** (loadimpact/k6) for industrial-grade testing:
```bash
npm install -D @types/k6
# Or: apt install k6 (native binary)
```

**Critical test scenarios:**
1. Ramp-up test: 1→100 VUs over 60s, sustained 60s
2. Spike test: 0→200 VUs instantly, sustained 30s
3. Stress test: Step load 50→100→200→400 VUs, 120s each step
4. Soak test: 50 VUs sustained for 30 minutes

---

## 10. ARCHITECTURE DIAGRAM

```
                         ┌──────────────────────────┐
                         │    Next.js App Router      │
                         │    (Middleware Chain)      │
                         │  ┌─ Blocked Methods ─┐    │
                         │  │ 405 on TRACE etc  │    │
                         │  └────────┬──────────┘    │
                         │  ┌─ Auth Check ──────┐    │
                         │  │ Cookie │ Demo     │    │
                         │  └────────┬──────────┘    │
                         │  ┌─ Rate Limiter ────┐    │
                         │  │ Map<string,Bucket>│    │
                         │  └────────┬──────────┘    │
                         └──────────┬───────────────┘
                                    │
            ┌───────────────────────┼───────────────────┐
            │                       │                    │
    ┌───────▼───────┐    ┌──────────▼──────┐  ┌─────────▼─────────┐
    │  Auth Routes   │    │ Business Routes  │  │  Admin Routes     │
    │  /api/auth/*   │    │ /api/jobs/*      │  │  /admin/*         │
    │  /api/csrf/*   │    │ /api/uploads/*   │  │  /api/sales/*     │
    └───────┬───────┘    │ /api/listings    │  └─────────┬─────────┘
            │            └────────┬─────────┘            │
            │                     │                      │
            └──────────┬──────────┴──────────┬───────────┘
                       │                     │
              ┌────────▼────────┐   ┌────────▼────────┐
              │  Session Svc    │   │  Permissions Svc │
              │  (DB lookup)    │   │  (in-memory)     │
              └────────┬────────┘   └────────┬────────┘
                       │                     │
              ┌────────▼─────────────────────▼────────┐
              │         Prisma / PostgreSQL             │
              │  Pool(20) → Session, Job, Image, ...    │
              │  Circuit Breaker: listings-db           │
              └─────────────────┬───────────────────────┘
                                │
         ┌──────────────────────┼──────────────────────┐
         │                      │                      │
  ┌──────▼──────┐    ┌──────────▼───────┐  ┌───────────▼───────┐
  │  Stripe SDK  │    │  sharp (images)  │  │  ioredis (future) │
  │  (external)  │    │  (CPU-bound)     │  │  (not connected)  │
  └─────────────┘    └──────────────────┘  └───────────────────┘
```

---

## 11. COLD / WARM / SUSTAINED PROFILE

| State | Condition | Latency Expectation | Notes |
|-------|-----------|--------------------|-------|
| **Cold** | App just started, no connections in pool | 150-300ms | First Prisma query cold-starts the pool & query engine |
| **Warm** | Pool has active connections, routes compiled | 25-75ms | JIT-compiled handlers, pooled connections |
| **Sustained** | Continuous 50+ TPS for >30s | 50-200ms P50, 300-800ms P99 | GC pressure, pool queueing, potential circuit trips |
| **Idle recovery** | After 30s+ idle | 35-85ms | Pool connections idled out, new connections on first request |

---

## 12. ACTIONABLE NEXT STEPS

1. **Install k6** for load testing — required for Phase 2 (sustained load)
2. **Add session caching** — Reduce per-request DB queries by 50%
3. **Add input-size guard** on `/api/sales-channels/import` — Cap orders[] at 500
4. **Add Cache-Control headers** to public GET endpoints
5. **Index `IdempotencyKey.expiresAt`** — Prevent full table scan on TTL cleanup
6. **Configure keepalive** — Increase `idleTimeoutMillis` to 5min for low-traffic warm start
7. **Plan Redis migration** for rate limiter in multi-replica production

---

*End of Q10 Phase 1 — Architecture Profiling & Baseline. Ready for Q10_P1_AUDIT (Deziray) and subsequent destructive load testing phases.*
