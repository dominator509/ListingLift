# DELTA BLAST RADIUS REPORT — Q7 Phase 2

## Baseline: Q6 (`pre-retrofit-20260613T232959Z`)
## HEAD: Q7 Phase 1 (`569ad36`)

---

## 1. Git Diff Summary

| Metric | Count |
|---|---|
| Commits since Q6 | 50 |
| Author | Dominic Sarria-Wiley (50/50) |
| Files changed | 351 |
| Lines added | 30,339 |
| Lines removed | 9,185 |
| Net delta | +21,154 |

| Directory | Added | Removed | Net |
|---|---|---|---|
| `src/` | 1,415 | 1,075 | +340 |
| `tests/` | 8,054 | 86 | +7,968 |
| `spec/` | ~3,100 | 0 | +3,100 |
| Reports (`.md`) | ~8,700 | 0 | +8,700 |
| Config/root | ~7,000 | 8,024 | -1,024 |

---

## 2. Blast Radius — Changed Source Files

### 2.1 Top 15 Most-Changed Source Files (by churn)

```
File                                    +       -      Total churn
───────────────────────────────────────────────────────────────
src/schemas/security-hardening.ts      209     127         336
src/server/auth/auth-service.ts        114     180         294
src/server/services/csrf-protection..  102       1         103
src/schemas/upload.ts                   70      68         138
src/server/services/upload-token-svc    66      55         121
src/schemas/stripe-billing.ts           61      74         135
src/schemas/env.ts                      61      61         122
src/server/services/upload-intake-svc   54      48         102
src/server/routes/route-helpers.ts      53      44          97
src/domain/platform-presets.ts          52       0          52
src/server/auth/session-cookie.ts       43      34          77
src/server/services/gumroad-fulfill..   37      29          66
src/server/auth/password.ts             25      20          45
src/server/services/stripe-billing-o..  19      21          40
src/lib/prisma.ts                       19       2          21
```

### 2.2 Files Deleted

- `prisma/schema.prisma.backup` (4,992 lines, stale backup)
- `prisma/seed.ts.backup` (1,341 lines, stale backup)
- `prisma/migrations/20260611190000_qa_tables/migration.sql`
- `prisma/migrations/20260611193000_qa_ledger/migration.sql`
- `prisma/migrations/migration_lock.toml`
- `prisma/config.ts.backup` / `prisma/config.ts.backup`
- `tmp_seed_body.ts`, `tmp_seed_head.ts`
- `src/server/services/full-testing-qa-verification-ledger-service.ts.backup`
- `ROADMAP_STATUS.md.bak`

---

## 3. Subsystem Impact Map

### 3.1 Subsystems Touched

| Subsystem | Files | Churn | Risk |
|---|---|---|---|
| **Authentication** | 5 | 460 lines | **HIGH** |
| **CSRF / Security Hardening** | 3 | 441 lines | **HIGH** |
| **Upload Pipeline** | 3 | 361 lines | **HIGH** |
| **Route Infrastructure** | 1 | 97 lines | **MEDIUM** |
| **Stripe Billing** | 3 | 241 lines | **HIGH** |
| **Schema Layer** | 8 | 901 lines | **MEDIUM** |
| **Domain Logic** | 7 | 75 lines | **LOW-MEDIUM** |
| **Library Utilities** | 6 | 107 lines | **MEDIUM** |
| **Database (Prisma)** | 2 | 39 lines | **MEDIUM** |
| **Gumroad Fulfillment** | 1 | 66 lines | **MEDIUM** |
| **UI Components** | 7 | 27 lines | **LOW** |
| **Config / Build** | 8 | 30 lines | **LOW** |

### 3.2 Cross-Subsystem Coupling Hotspots

```
auth-service.ts
  → password.ts, session-cookie.ts, rate-limit.ts
  → schemas/auth.ts
  → audit-log-service.ts
  Impact spread: 5 files across 3 subsystems

csrf-protection-service.ts
  → lib/hash.ts, lib/date.ts
  → schemas/security-hardening.ts
  → process.env (env.ts)
  Impact spread: 4 files across 3 subsystems

upload-intake-service.ts + upload-token-service.ts
  → lib/hash.ts, lib/tokens.ts
  → schemas/upload.ts, schemas/security-hardening.ts
  → prisma schema (database)
  Impact spread: 6 files across 4 subsystems

route-helpers.ts
  → 68+ API route handlers (every guardedGet/guardedPost call site)
  → auth-session-service.ts, authorization-service.ts
  → lib/api-response.ts
  Impact spread: 70+ files across 3 subsystems — HIGHEST CONNECTIVITY
```

---

## 4. Risk Classification

### HIGH Risk — Auth, Payment, Data Mutation Paths Touched

| Path | Reason |
|---|---|
| `src/server/auth/auth-service.ts` | Complete rewrite: removed rate limiting, audit logging, email normalization. Transitioned to inlined logic. High regression risk on login/signup flows. |
| `src/server/auth/session-cookie.ts` | Session creation and cookie handling changed. Impacts all authenticated routes. |
| `src/server/auth/password.ts` | Password hashing/verification logic modified. |
| `src/schemas/auth.ts` | Auth schema contract changed. |
| `src/server/services/csrf-protection-service.ts` | New 3-layer CSRF defense (origin validation + stateless token + HMAC signing). Every mutation route depends on this. |
| `src/schemas/security-hardening.ts` | Full schema rewrite — all security validation contracts changed. |
| `src/server/services/stripe-billing-orchestrator.ts` | Billing orchestration logic changed. Directly touches payment flows. |
| `src/schemas/stripe-billing.ts` | Billing schema contract changed. |
| `src/server/services/upload-intake-service.ts` | Upload intake logic changed — data mutation path. |
| `src/server/services/upload-token-service.ts` | Upload token lifecycle changed — security boundary. |
| `src/app/api/approvals/*` (6 route files) | Approval chain routes modified — data mutation + RBAC boundary. |
| `src/app/api/delivery/*` (6 route files) | Delivery workflow routes modified — data mutation. |
| `src/app/api/stripe/webhook/route.ts` | Stripe webhook handling changed — payment data mutation. |

### MEDIUM Risk — Shared Utilities, Middleware, Config

| Path | Reason |
|---|---|
| `src/server/routes/route-helpers.ts` | Core route wrapper changed: removed actual auth guards, replaced with demo-session bypass. Impacts all 68+ routes indirectly. |
| `src/lib/prisma.ts` | Prisma client refactored to use `@prisma/adapter-pg` with pg pool. Database connectivity changed. |
| `src/lib/env.ts` | Environment config simplified — removes schema validation. Missing env vars may silently default. |
| `src/lib/hash.ts` | Hashing utilities changed. Impacts CSRF tokens, upload tokens, auth. |
| `src/lib/tokens.ts` | Token utilities changed. Impacts delivery and upload tokens. |
| `src/lib/api-response.ts` | Response helpers changed. Impacts all route handlers. |
| `src/schemas/env.ts` | Environment schema orphaned (src/lib/env.ts bypasses it; schema file still exists) |
| `prisma/schema.prisma` | QaVerificationLedger model field formatting changed. Table-index preserved. |
| `src/server/services/gumroad-fulfillment-orchestrator.ts` | Fulfillment logic changed — medium blast radius to Gumroad sales channel. |

### LOW Risk — UI Components, Docs, Non-Critical Utilities

| Path | Reason |
|---|---|
| UI page components (7 files, 2-line changes each) | Mostly import path fixes, minor prop adjustments. |
| `src/domain/platform-presets.ts` (new 52 lines) | New domain logic, no existing dependents to break. |
| `src/domain/amazon-ebay-woocommerce.ts` (6 lines) | Minor additions. |
| `src/domain/database-keys.ts` (2 lines) | Trivial addition. |
| `src/lib/csv.ts`, `src/lib/errors.ts`, `src/lib/date.ts` | Small utility additions — non-breaking. |
| `tests/` (all files) | Test additions only — no impact on production. |

---

## 5. Dependency Graph — Transitive Closure

### Critical Import Chains

```
route-helpers.ts
  → guardedGet/guardedPost → 68+ API route files (entire API surface)
  → parseJson → affects all JSON request parsing
  → extractDemoSession → bypasses real auth for all routes

auth-service.ts
  → signup() → prisma.user.create, prisma.organization.create
  → login() → prisma.user.findUnique
  → Used by: auth route handlers, signup/login pages

csrf-protection-service.ts
  → originAllowedForRequest → ALLOWED_ORIGINS check
  → generateCsrfToken → session binding
  → verifyCsrfToken → HMAC verification
  → Every POST/PUT/DELETE route calls at least one of these

prisma.ts (refactored)
  → pg.Pool + PrismaPg adapter
  → Every service that imports `prisma` is transitively affected
  → All database queries now flow through the new pool

upload-intake-service.ts
  → Calls: hash.ts, tokens.ts, prisma, security-hardening schemas
  → Called by: upload route handlers
  → Affects: file storage, job creation, preview system
```

### High-Connectivity Hub Files (by number of dependents)

| Hub File | Est. Dependents | Risk |
|---|---|---|
| `src/lib/prisma.ts` | 60+ services and routes | **HIGH** — db connectivity changed |
| `src/server/routes/route-helpers.ts` | 68+ API route files | **HIGH** — all route guards changed |
| `src/server/auth/auth-service.ts` | 12+ auth routes/pages | **HIGH** — auth core rewritten |
| `src/server/services/csrf-protection-service.ts` | 80+ mutation routes | **HIGH** — new mandatory middleware |
| `src/lib/hash.ts` | 8+ services | **MEDIUM** — shared utility |
| `src/lib/api-response.ts` | 30+ route files | **MEDIUM** — response format changed |
| `src/schemas/security-hardening.ts` | 10+ services and CSRF | **HIGH** — all security contracts |

---

## 6. Regression Risk Assessment

### 6.1 Routes Requiring Re-Testing

Based on blast radius analysis, the following routes MUST be re-tested:

**AUTH (HIGH priority):**
- `POST /api/auth/signup` — auth-service.ts rewritten
- `POST /api/auth/login` — auth-service.ts rewritten
- `GET /api/auth/session` — session-cookie.ts changed
- `POST /api/auth/logout` — session handling changed

**CSRF (HIGH priority — every mutation route affected):**
- All POST/PUT/PATCH/DELETE routes across all 96 mutation endpoints
- Especially: approvals, delivery, upload, processing, quality-control, stripe webhooks

**UPLOAD (HIGH priority):**
- `POST /api/upload/*` — upload-intake + upload-token services both changed
- File validation, token creation, intake pipeline

**APPROVALS (HIGH priority):**
- `POST /api/approvals/jobs/[jobId]/approve`
- `POST /api/approvals/jobs/[jobId]/reject`
- `POST /api/approvals/outputs/[processedFileId]/approve`
- `POST /api/approvals/outputs/[processedFileId]/reject`

**DELIVERY (HIGH priority):**
- `POST /api/delivery/jobs/[jobId]/send`
- `POST /api/delivery/create-token`
- `POST /api/delivery/jobs/[jobId]/email-preview`

**PROCESSING (MEDIUM priority):**
- `POST /api/processing/images/[imageId]/process`
- `POST /api/processing/jobs/[jobId]/start`

**STRIPE (HIGH priority):**
- `POST /api/stripe/webhook` — webhook handler changed
- `POST /api/stripe/checkout/*` — billing orchestrator changed

### 6.2 Test Coverage Gaps

| Area | Existing Tests | Coverage |
|---|---|---|
| Auth flow | `tests/integration/auth-flow.test.ts` (162 lines, new) | **ADEQUATE** |
| CSRF lifecycle | `tests/integration/csrf-lifecycle.test.ts` (125 lines, new) | **ADEQUATE** |
| CSRF protection | `tests/unit/csrf-protection.test.ts` (322 lines, new) | **ADEQUATE** |
| Upload pipeline | `tests/integration/upload-pipeline.test.ts` (199 lines, new) | **ADEQUATE** |
| File upload pipeline | `tests/integration/file-upload-pipeline.test.ts` (146 lines, new) | **ADEQUATE** |
| Stripe checkout | `tests/integration/stripe-checkout.test.ts` (116 lines, new) | **ADEQUATE** |
| Concurrency/rate-limit | `tests/unit/concurrency-rate-limit-idempotency.test.ts` (575 lines, new) | **ADEQUATE** |
| Auth hash/verify | `tests/unit/auth-hash-verify.test.ts` (200 lines, new) | **ADEQUATE** |
| Auth rate limit | `tests/unit/auth-rate-limit.test.ts` (176 lines, new) | **ADEQUATE** |
| Business logic | `tests/unit/business-logic.test.ts` (342 lines, new) | **ADEQUATE** |
| Data transformers | `tests/unit/data-transformers.test.ts` (273 lines, new) | **ADEQUATE** |
| **Gap: Delivery token security** | `tests/security/delivery-token-security.test.ts` (2-line update only) | **MINIMAL** |
| **Gap: Marketplace safety** | Minor updates only (2-3 lines each) | **MINIMAL** |
| **Gap: Stripe billing orchestrator** | No dedicated unit test | **NONE** |
| **Gap: Route helpers** | No dedicated unit test for `guardedGet`/`guardedPost` | **NONE** |
| **Gap: Session cookie** | No dedicated unit test | **NONE** |

### 6.3 Risk Summary

```
HIGH RISK CHANGES:     12 files (auth, csrf, upload, approvals, delivery, stripe)
MEDIUM RISK CHANGES:   10 files (routes, prisma, env, hash, tokens, api-response)
LOW RISK CHANGES:      121 files (ui, domain, tests, docs, config)

Total source changed:  143 files
Blast radius           ~80+ routes potentially impacted
Existing test coverage: Strong for auth, csrf, upload, stripe
                       Weak for delivery security, route helpers, session cookies
```

---

## 7. Key Findings

1. **Auth service rewritten**: Removed rate limiting and audit logging from the core auth flow. The new code is more compact but loses defense-in-depth layers present in Q6.

2. **CSRF defense completely new**: CIA/NSA-grade 3-layer CSRF added. This is the single highest-blast-radius change — every mutation route (96 endpoints) now depends on this middleware functioning correctly.

3. **Route helpers gutted**: `guardedGet`/`guardedPost` no longer enforce authentication or permission checks. They now call the handler directly without session validation. This is the highest-risk architectural change in Q7.

4. **Prisma adapter migrated**: From default Prisma client to `@prisma/adapter-pg` with explicit `pg.Pool`. Database connection behavior, pooling, and lifecycle are different.

5. **Environment config orphaned**: Zod schema validation for env vars now bypassed by runtime env.ts, which uses hardcoded defaults. The schema file (src/schemas/env.ts) still exists but is no longer referenced — orphaned, not removed.

6. **143 source files changed** (+1,415/-1,075 lines) — concentrated in security, auth, billing, and upload subsystems.

7. **Test coverage was added in parallel**: 8,054 lines of new tests covering auth, CSRF, upload pipeline, concurrency, and adversarial scenarios. However, route helpers and session cookies have no dedicated test coverage.

8. **Stale files cleaned up**: 8 backup/temp files removed (7,809 lines deleted). Clean but each deletion breaks any script referencing those paths.

---

*Report generated by Ip Man — Q7 Phase 2 Delta & Blast Radius Analysis*
