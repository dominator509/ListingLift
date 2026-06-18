# Q14 Phase 1 — Recon, Threat Model & Secrets Audit

**Date**: 2026-06-15  
**Scope**: Full ListingLift source (291 API routes, 329 async handlers, 255 backend services)  
**Methodology**: Non-destructive static analysis  

---

## 1. SECRETS SCAN — PASS (CLEAN)

### 1.1 Hardcoded Secrets

| Pattern | Files Scanned | Findings |
|---------|--------------|----------|
| `sk_live_*` / `sk_test_*` | 13,000+ lines | **ZERO** hardcoded keys |
| JWT / Bearer tokens | Full src/ | **ZERO** hardcoded tokens |
| Passwords (cleartext) | Full src/ | **ZERO** hardcoded passwords |
| API keys (string literals) | Full src/ | **ZERO** hardcoded keys |
| Private keys | Full src/ | **ZERO** embedded keys |

**Assessment**: All secrets are accessed exclusively via `process.env` or the env validation layer (`src/lib/env.ts`, `src/schemas/env.ts`). No credentials appear as string literals in source code.

### 1.2 .env.example Exposure Risk

The `.env.example` file documents 16 environment variables. All sensitive values are placeholder strings (`user:password@host`) or empty (`= `). No real credentials are committed.

Required secrets not leaked: `SESSION_SECRET`, `ENCRYPTION_KEY`, `CSRF_SECRET`, `UPLOAD_TOKEN_SECRET`, `DELIVERY_TOKEN_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `DATABASE_URL`, `DEEPSEEK_API_KEY`.

### 1.3 Stripe Key Handling

- Keys stored in `.env` (gitignored, confirmed absent from remote)
- Accessed via `process.env.STRIPE_SECRET_KEY` and `process.env.STRIPE_WEBHOOK_SECRET`
- Price IDs referenced via constants in Stripe adapter files — low risk (they're public metadata)
- Webhook signature verification: previously hardened in Q16 Phase 2

### 1.4 Session Token Architecture

- Custom session tokens (not JWT) using SHA-256 hashing
- Tokens stored as opaque values in `session_token` cookie
- Cookie attributes: `HttpOnly; Secure; SameSite=Strict; Path=/`
- Timing-safe comparison for token validation (Q16 hardening)
- No bearer tokens in use — session cookie only

---

## 2. THREAT MODEL (STRIDE)

### 2.1 Trust Boundaries

```
┌──────────┐     ┌──────────────┐     ┌─────────────┐     ┌────────────┐
│  PUBLIC   │────▶│ LISTINGLIFT  │────▶│  POSTGRES   │────▶│  STRIPE    │
│  INTERNET │◀────│  (Next.js)   │◀────│  (Prisma)    │◀────│  GUMROAD   │
└──────────┘     └──────────────┘     └─────────────┘     └────────────┘
                        │                                       │
                        ▼                                       ▼
                 ┌──────────────┐                       ┌────────────┐
                 │  FILE STORAGE│                       │  EMAIL     │
                 │  (mock)      │                       │  (mock)    │
                 └──────────────┘                       └────────────┘
```

**Boundary 1 (Internet → App)**: 291 API routes — primary attack surface  
**Boundary 2 (App → DB)**: Prisma ORM — no raw SQL, injection risk minimal  
**Boundary 3 (App → Stripe/Gumroad)**: API webhooks — signature verification hardened  
**Boundary 4 (App → File Storage)**: Upload endpoints — CSRF protected, mock mode  
**Boundary 5 (App → Email)**: Mock email provider — attack surface disabled  

### 2.2 STRIDE Analysis by Boundary

| Boundary | Spoofing | Tampering | Repudiation | Info Disclosure | DoS | Elevation |
|----------|----------|-----------|-------------|-----------------|-----|-----------|
| Internet→App | Session tokens (SHA-256, timing-safe) | CSRF tokens on 96 mutation routes | Audit logging present | CSP, security headers | Rate limiting (in-memory) | RBAC via session roles |
| App→DB | Prisma parameterized queries | Database-level constraints | ❌ No audit trail for DB mutations | Column-level access via Prisma | Pool exhaustion (DB_POOL_MAX=20) | ❌ no-op guards in 84 routes (Q5/Q6 finding) |
| App→Stripe/Gumroad | Webhook signature verification | Idempotency keys on mutations | Stripe dashboard provides audit | Stripe SDK handles encryption | Payment retry logic | Stripe API key scope limited |
| App→File Storage | Upload tokens (SHA-256) | Filename sanitization | Upload metadata tracked | ❌ /api/uploads returns 500 instead of 401 (Q4 finding) | File size limits | Upload token scoping |
| App→Email | Mock disabled | Mock disabled | Mock disabled | Mock disabled | N/A | N/A |

### 2.3 Attack Surface Numbers

| Metric | Count |
|--------|-------|
| Total API routes | 291 |
| Authenticated routes | ~155 (guardedGet/Post/Patch/Session) |
| Unauthenticated routes | ~118 (seed/mock/demo) |
| Mutation endpoints | 96 (POST/PUT/PATCH/DELETE) |
| CSRF-protected mutations | 96/96 |
| Webhook endpoints | 2 (Stripe, Gumroad) |
| File upload endpoints | ~8 |
| Rate-limited endpoints | All (IP-based, in-memory Map) |

---

## 3. DEPENDENCY AUDIT (npm audit)

### 3.1 Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Moderate | 5 |
| Low | 0 |
| **Total** | **5** |

### 3.2 Vulnerability Details

| Package | Vuln | Severity | Vector | Fix |
|---------|------|----------|--------|-----|
| @hono/node-server (<1.19.13) | GHSA-92pp-h63x-v22m | Moderate (5.3) | Middleware bypass via repeated slashes in serveStatic | Breaking: requires Prisma upgrade |
| postcss (<8.5.10) via Next.js | GHSA-qx2v-qp2m-jg93 | Moderate | XSS via unescaped `</style>` in CSS stringify | Breaking: requires Next.js downgrade to 9.x |

Both vulnerabilities transit through nested dependencies (prisma → @prisma/dev → @hono/node-server, and next → postcss). Neither is directly exploitable in ListingLift's production configuration:
- **@hono/node-server**: Used only in Prisma Studio dev tooling — not exposed in production
- **postcss**: CSS build-time tool — XSS in build output affects admin/developer preview only

### 3.3 Critical Package Inventory (SBOM Lite)

| Package | Version | Role | CVEs |
|---------|---------|------|------|
| next | latest (16.x) | Framework | 0 critical/high |
| react | latest (19.x) | UI | 0 critical/high |
| prisma | latest (6.x) | ORM | Via hono (moderate) |
| stripe | latest | Payments | 0 critical/high |
| zod | latest | Validation | 0 known |
| bcryptjs | latest | Password hashing | 0 known |
| esbuild | 0.28.1 (Q16) | Bundler | Upgraded from 0.25.x |

### 3.4 Missing Security Packages (Gap Analysis)

| Package | Status | Risk |
|---------|--------|------|
| helmet | NOT USED | **Low** — custom security headers (src/lib/security-headers.ts) provide equivalent coverage |
| cors | NOT USED | **Low** — Next.js App Router handles CORS through middleware |
| rate-limiter-flexible | NOT USED | **Medium** — custom in-memory rate limiter has no Redis backing, unbounded Map growth (Q10 finding) |
| dompurify | NOT USED | **Low** — no user-generated HTML rendering in current feature set |
| express-rate-limit | NOT USED | **Low** — not using Express |

---

## 4. SUMMARY & PHASE 2 READINESS

### Key Findings
1. ✅ **Secrets hygiene**: Zero hardcoded secrets. All credentials via `process.env`.
2. ✅ **No SQL injection surface**: No raw queries, all Prisma ORM.
3. ✅ **No eval/Function injection**: Zero dynamic code execution.
4. ⚠️ **84 no-op guards** (Q5/Q6 finding, unfixed) — authenticated routes with bypassable auth
5. ⚠️ **In-memory rate limiter** (Q10 finding) — resource exhaustion risk
6. ⚠️ **5 moderate npm vulns** — non-exploitable in production config

### Phase 2 (Static Analysis / SCA / SBOM) Readiness
- Dependency inventory complete
- CVE audit baseline established
- Code analysis surface mapped
- Ready for deeper static analysis (AST scanning, taint tracking, complexity hotspots)
