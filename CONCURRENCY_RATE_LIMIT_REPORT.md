# CONCURRENCY, RATE LIMITING, AND IDEMPOTENCY REPORT

> Phase 5 — Q5 API Contract & Security Validation
> Investigated: All 48 API routes, Prisma schema, rate-limit services

---

## 1. RATE LIMITING

### 1.1 Auth Rate Limiter (`src/server/auth/rate-limit.ts`)

| Property | Value |
|----------|-------|
| **Scope** | Auth endpoints (login, signup) |
| **Implementation** | In-memory `Map<string, Bucket>` |
| **Default Limit** | 5 requests per 15 minutes |
| **Key Composition** | `email::ip` (lowercased) |
| **Headers** | ❌ No `X-RateLimit-*` HTTP headers emitted |
| **Persistence** | ❌ Lost on restart, not shared across instances |
| **Tests** | ✅ 46 unit tests pass (3 test files) |

**Finding RL-1 (LOW): In-memory only, no persistence.** The auth rate limiter uses a global `Map` that is lost on server restart. In a multi-instance deployment, each instance maintains independent counters, allowing an attacker to multiply effective limits by the instance count. A 60-byte comment in the source acknowledges this. **Acceptable for MVP, must replace with Redis before horizontal scaling.**

**Finding RL-2 (MEDIUM): No HTTP response headers.** None of the three rate limiters emit `X-RateLimit-Limit`, `X-RateLimit-Remaining`, or `X-RateLimit-Reset` headers on responses. Clients cannot programmatically back off. The 429 response body is whatever the consuming route returns — no standardized shape.

**Finding RL-3 (MEDIUM): No global API gateway middleware.** Rate limiting is only applied at the auth service layer and in the security-rate-limit-policy-service. The remaining 40+ API routes (uploads, jobs, quality control, previews, revisions, deliveries, notifications, external orders) have **no rate limiting whatsoever**.

### 1.2 Security Rate Limit Policy Service (`src/server/services/security-rate-limit-policy-service.ts`)

| Property | Value |
|----------|-------|
| **Scope** | Security-sensitive actions (auth.login, etc.) |
| **Implementation** | In-memory `Map`, SHA-256 subject hashing |
| **Hashing** | `sha256(action|key1:val1|key2:val2|...)` |
| **Enforcement** | `checkSecurityRateLimit()` — reads policy from draft config |
| **Tests** | ✅ 2 tests pass |

**Finding RL-4 (LOW): Scaffold-only.** The service exists and has correct design (subject hashing, action-scoped policies) but is only ever invoked from test files, not from any actual route handler.

### 1.3 Automation Rate Limit Service (`src/server/services/automation-rate-limit-service.ts`)

| Property | Value |
|----------|-------|
| **Scope** | Automation/internal endpoints |
| **Default Limit** | 30 requests per 60 seconds |
| **Implementation** | In-memory `Map<string, {count, resetAt}>` |
| **Headers** | ❌ None |

### 1.4 Boundary Tests

| Test Case | Endpoint | Status |
|-----------|----------|--------|
| Burst just under limit (4/5 auth) | `/api/auth/login` | ✅ Unit-tested |
| At limit (5/5) | `/api/auth/login` | ✅ Unit-tested |
| Just over limit (6/5) | `/api/auth/login` | ✅ Unit-tested, returns `allowed: false` |
| Reset after window expiry | `/api/auth/login` | ✅ Unit-tested |
| IP rotation bypass (X-Forwarded-For) | All | ❌ Not integration-tested |
| Key isolation (different email, same IP) | `/api/auth/login` | ✅ Unit-tested |
| Key isolation (same email, different IP) | `/api/auth/login` | ✅ Unit-tested |

**Finding RL-5 (LOW): IP-based key works but not integration-tested.** The `getRateLimitKey()` function incorporates IP via `email::ip` format, but no test verifies that an attacker rotating `X-Forwarded-For` headers gets separate buckets.

---

## 2. CONCURRENCY / RACE CONDITIONS

### 2.1 Database-Level Protections

| Resource | Protection | Type |
|----------|-----------|------|
| User email uniqueness | `email @unique` | DB unique index |
| Membership per org+user | `@@unique([organizationId, userId])` | DB unique composite |
| Session token hash | `sessionTokenHash @unique` | DB unique index |
| Stripe webhook event ID | `stripeEventId @unique` | DB unique index |
| Gumroad webhook sale ID | `gumroadSaleId @unique` | DB unique index |
| ExternalOrder dedup | `@@unique([organizationId, dedupeKey])` | DB unique composite |
| SalesChannel key | `@@unique([organizationId, key])` | DB unique composite |
| GumroadProductMapping | `@@unique([organizationId, offerKey])` + `@@unique([organizationId, productId])` | DB unique composites |

### 2.2 Application-Level Protections

| Race Condition Scenario | Protection | Status |
|------------------------|-----------|--------|
| Concurrent signup, same email | DB unique constraint on `User.email` | ✅ DB-level |
| Concurrent membership creation | DB unique constraint on `Membership.(orgId, userId)` | ✅ DB-level |
| Concurrent Stripe webhook | DB unique constraint on `StripeWebhookEvent.stripeEventId` | ✅ DB-level, seed route |
| Concurrent Gumroad webhook | DB unique constraint on `GumroadWebhookEvent.gumroadSaleId` | ✅ DB-level, seed route |
| Concurrent session creation | DB unique constraint on `Session.sessionTokenHash` | ✅ DB-level |
| Concurrent job creation | No unique constraint on title | ❌ Unprotected |
| Concurrent checkout session | No unique constraint on session reference | ❌ Unprotected |
| Concurrent CSRF token issuance | In-memory Map, no DB | ❌ Race possible (seed-only) |
| Concurrent profile update | `updatedAt` tracked, no optimistic lock | ❌ Last-write-wins |
| Concurrent membership changes | No version field | ❌ Last-write-wins |

**Finding CC-1 (CRITICAL): No optimistic locking.** None of the Prisma models have a `version` integer field. Concurrent updates silently overwrite (last-write-wins). Affects: `User`, `Organization`, `Membership`, `Session`, `Job`, `ExternalOrder`. **Mitigation: Add `version Int @default(1)` and use `where: { version }`.**

**Finding CC-2 (HIGH): No Prisma $transaction boundaries.** Every seed route handler returns a plan without persistence. When persistence is wired, none use `prisma.$transaction()` for multi-table writes — concurrent requests could interleave mid-insert.

**Finding CC-3 (MEDIUM): Concurrent signup with unique emails is parallel-safe.** The E2E test exercises 10 parallel signups with unique emails — each creates a unique `User.email`, no conflict.

**Finding CC-4 (MEDIUM): Webhook resilience tests exist but require a running server.** Three E2E tests: duplicate Stripe webhooks, duplicate Gumroad webhooks, out-of-order events. Require `APP_URL` pointing to a running instance.

### 2.3 Connection Pool

| Property | Value |
|----------|-------|
| **Pool library** | `pg.Pool` (via `@prisma/adapter-pg`) |
| **Default max connections** | 10 |
| **Connection limit in .env** | Not specified |

**Finding CC-5 (MEDIUM): Default pool size of 10 may be insufficient.** 20 concurrent session lookups (E2E test) could exhaust the pool — 10 connections serve, 10 queue. No pool saturation test exists.

---

## 3. IDEMPOTENCY

### 3.1 Idempotency Key Support

| Aspect | Status |
|--------|--------|
| `Idempotency-Key` header on POST/PUT | ❌ **Not implemented anywhere** |
| Stripe webhook idempotency (by event ID) | ⚠️ Partial — DB unique constraint, route is seed-only |
| Gumroad webhook idempotency (by sale ID) | ⚠️ Partial — DB unique constraint, route is seed-only |
| Checkout session idempotency | ❌ Not implemented |
| Manual order creation idempotency | ❌ Not implemented |

**Finding ID-1 (CRITICAL): No idempotency-key header support.** The entire API surface lacks `Idempotency-Key` header processing. Any POST/PUT can be called multiple times with the same payload, creating duplicate resources. Stripe webhook route has a code comment acknowledging this gap but the code is **not implemented**.

**Finding ID-2 (MEDIUM): DB unique constraints provide implicit insert idempotency.** `StripeWebhookEvent.stripeEventId @unique` and `GumroadWebhookEvent.gumroadSaleId @unique` prevent duplicate records (second insert throws `P2002`). However, no error handler catches this — duplicates return 500 instead of 200.

**Finding ID-3 (MEDIUM): Checkout double-charge protection absent.** Calling `POST /api/stripe/checkout/package` twice creates two Stripe Checkout Sessions and two potential charges.

### 3.2 Existing Idempotency Tests

| Test | File | Status |
|------|------|--------|
| Duplicate Stripe webhook → 200 | `tests/e2e/webhook-resilience.spec.ts` | Written, needs live server |
| Duplicate Gumroad webhook → graceful | `tests/e2e/webhook-resilience.spec.ts` | Written, needs live server |
| Out-of-order Stripe events → no 500 | `tests/e2e/webhook-resilience.spec.ts` | Written, needs live server |

---

## 4. RESOURCE EXHAUSTION

**Finding RE-1 (MEDIUM): No pool saturation test.** 20 concurrent lookups + 15 concurrent job creations in E2E tests assert "no crash" but do not measure latency degradation under pool contention.

**Finding RE-2 (MEDIUM): No request body size enforcement.** No middleware rejects oversized payloads. A 100MB JSON POST consumes memory proportional to payload size. **Mitigation: Reject Content-Length > 1MB before body parsing.**

**Finding RE-3 (LOW): No query parameter limit.** GET endpoints have no limit on query param count. 1000+ params could cause excessive parsing.

---

## 5. DEADLOCK / LIVELOCK ANALYSIS

**Finding DL-1 (LOW): No Prisma $transaction usage exists.** All seed routes return plans without DB writes — no multi-table transactions exist yet to deadlock. When persistence is added, acquire locks in consistent order and use `prisma.$transaction()` with serializable isolation.

---

## 6. EXISTING TEST COVERAGE SUMMARY

| Test File | Tests | Type | Scope | Status |
|-----------|-------|------|-------|--------|
| `tests/unit/rate-limiting.test.ts` | 23 | Unit | Auth rate limit core logic | ✅ All pass |
| `tests/unit/auth-rate-limit.test.ts` | 22 | Unit | Auth rate limit edge cases | ✅ All pass |
| `tests/security/auth-rate-limit.test.ts` | 1 | Unit | Auth rate limit contract | ✅ Passes |
| `tests/unit/security-rate-limit-policy-service.test.ts` | 2 | Unit | Security policy service | ✅ All pass |
| `tests/e2e/rate-limiting.spec.ts` | 4 | E2E | Auth rate limit in browser | ⏳ Needs live server |
| `tests/e2e/concurrent-requests.spec.ts` | 3 | E2E | Parallel signup, sessions, jobs | ⏳ Needs live server |
| `tests/e2e/webhook-resilience.spec.ts` | 4 | E2E | Duplicate webhooks, out-of-order | ⏳ Needs live server |
| **Idempotency tests** | **0** | — | Idempotency-key header | ❌ Not written |

---

## 7. RISK SCORING SUMMARY

| ID | Finding | Severity | Category |
|----|---------|----------|----------|
| ID-1 | No `Idempotency-Key` header — duplicate POSTs create duplicates | **CRITICAL** | Idempotency |
| CC-1 | No optimistic locking — concurrent updates silently overwrite | **CRITICAL** | Concurrency |
| CC-2 | No `$transaction` boundaries for multi-table writes | **HIGH** | Concurrency |
| ID-3 | No checkout double-charge protection | **HIGH** | Idempotency |
| RL-2 | No `X-RateLimit-*` headers emitted | **MEDIUM** | Rate Limiting |
| RL-3 | No global rate limiting — 40+ routes unprotected | **MEDIUM** | Rate Limiting |
| CC-4 | Webhook idempotency DB constraints exist but seed-only | **MEDIUM** | Concurrency |
| CC-5 | Default pool size 10 may saturate under load | **MEDIUM** | Concurrency |
| RE-2 | No request body size limits enforced | **MEDIUM** | Resource Exhaustion |
| ID-2 | Duplicate webhook P2002 errors → 500 instead of 200 | **MEDIUM** | Idempotency |
| RE-1 | No pool saturation test | **MEDIUM** | Resource Exhaustion |
| RL-1 | In-memory rate limits not shared across instances | **LOW** | Rate Limiting |
| RL-4 | Security rate limit policy service not wired to routes | **LOW** | Rate Limiting |
| RL-5 | X-Forwarded-For IP rotation not integration-tested | **LOW** | Rate Limiting |
| RE-3 | No query parameter limit | **LOW** | Resource Exhaustion |
| DL-1 | No transaction usage yet, but no pattern established | **LOW** | Deadlock |

### Severity Counts: CRITICAL(2) | HIGH(2) | MEDIUM(7) | LOW(5)

---

## 8. RECOMMENDATIONS

1. **Add `Idempotency-Key` middleware** — Process `Idempotency-Key` headers, store completed responses, return cached on replay (checkout, order creation).

2. **Add optimistic locking** — `version Int @default(1)` on core models; use `where: { version }` in all Prisma updates.

3. **Wire Stripe webhook idempotency gate** — Upsert `StripeWebhookEvent` by `stripeEventId`, return 200 on duplicate.

4. **Add global rate limiting middleware** — Apply limits to all routes, not just auth.

5. **Emit `X-RateLimit-*` headers** — Propagate `remaining` and `resetAt` to HTTP responses.

6. **Enforce request body size limits** — Reject `Content-Length > 1MB` via middleware.

7. **Increase default pool size** — Set `max: 25` in `pg.Pool` config.

8. **Wrap multi-table writes in `$transaction`** — Every 2+ table write must use `prisma.$transaction()` with consistent ordering.

---

*End of report — 48 API routes analyzed, 3 rate-limit services examined, Prisma schema fully reviewed.*
