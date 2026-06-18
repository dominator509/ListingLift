# Q15 Phase 1 — Recon & Target Development Dossier

**Date**: 2026-06-15  
**Adversary Personas**: FIN7 (enterprise), ALPHV (healthcare), Lazarus (Web3)  
**ROE**: Forks/canaries only — proof not destruction  

---

## 1. TARGET FINGERPRINTING

### 1.1 Technology Stack (T1590.001 — Gather Victim Network Information)

| Layer | Technology | Version | Adversary Value |
|-------|-----------|---------|-----------------|
| Framework | Next.js (App Router) | 16.x | Known CVE surface, SSR/API routes |
| UI | React | 19.x | Client-side state manipulation |
| ORM | Prisma | 6.x | Query introspection, migration access |
| Auth | Custom (bcryptjs) | latest | No JWT = session tokens only |
| Payments | Stripe SDK | latest | Webhook replay, price manipulation |
| Validation | Zod | latest | Schema bypass fuzzing |
| CSS | Tailwind CSS | 4.x | Build-time only, no runtime risk |
| DB | PostgreSQL | — | Direct DB access if connection leaks |
| Bundler | esbuild | 0.28.1 | Build chain compromise (Q16 upgrade) |

### 1.2 Server Fingerprint (T1590.004 — Gather Victim Network Topology)

- **Web server**: Next.js built-in (no Express middleware)
- **Server header**: Not present (no `X-Powered-By` leak)
- **CSP**: Present but scaffold (allows tuning identification)
- **CORS**: Minimal — no explicit CORS configuration (same-origin default)
- **Security headers**: HSTS, X-Frame-Options=DENY, X-Content-Type=nosniff
- **Cookie**: `session_token` (HttpOnly, Secure, SameSite=Strict)

### 1.3 Version Disclosure (T1590.006 — Gather Victim Network Identity)

| Detail | Value | Risk |
|--------|-------|------|
| Application name | listinglift | Low |
| Version | 0.1.0 | **MEDIUM** — signals early-stage, patches may lag |
| Private | true | Low — not published to npm |
| NODE_ENV detection | `NODE_ENV === 'production'` | Low — no debug environment leak |

---

## 2. ATTACK SURFACE MAPPING (T1590 — Gather Victim Network Information)

### 2.1 Route Enumeration

| Category | Count | Risk |
|----------|-------|------|
| Total API routes | 291 | Full attack surface |
| Guarded routes (auth required) | ~156 | Elevated access needed |
| Unguarded routes (no auth) | **135** | **HIGH** — 46% of routes unprotected |
| Mutation endpoints (POST/PUT/PATCH/DELETE) | 96 | CSRF-protected |
| Webhook endpoints | 2 (Stripe, Gumroad) | Signature-verified (Q16) |
| File upload endpoints | ~8 | Token-protected |

### 2.2 High-Value Unguarded Targets

| Endpoint | Type | Exposure |
|----------|------|----------|
| `/api/health` | GET | Server health, uptime, status |
| `/api/auth/login` | POST | Credential harvesting/stuffing |
| `/api/auth/signup` | POST | Account creation abuse |
| `/api/auth/verify-email` | POST | Token enumeration |
| `/api/listings` | GET | Public data enumeration |
| `/api/subscriptions` | GET | Revenue intelligence |
| `/api/automation-webhooks/*` | Various | Webhook abuse, dispatch manipulation |
| `/api/advanced-image-processing/*` | Various | Resource exhaustion vector |
| `/api/manual-invoices` | GET | Financial data exposure |

### 2.3 Admin Panel Exposure

- **Admin routes**: `/admin/*` — guarded by session/auth middleware
- **Admin pages**: Billing (Stripe management), dashboard, user management
- **Bypass vector**: `x-demo-*` headers + 84 no-op guards (Q5/Q6 finding)

---

## 3. CREDENTIAL EXPOSURE (T1552 — Unsecured Credentials)

### 3.1 🔴 CRITICAL: PAT in Git Remote URL

```
git remote -v reveals:
https://dominator509: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@github.com/dominator509/ListingLift.git
```

| Attribute | Value |
|-----------|-------|
| **Username**: dominator509 |
| **PAT prefix**: `github_pat_11BFFKK5Q0A` |
| **Full PAT**: Exposed in git remote URL |
| **Access**: Full repository access (private repo) |
| **Vector**: `git remote -v` or `cat .git/config` |
| **CVSS**: 8.6 (HIGH) — credential leak with filesystem access |
| **ATT&CK**: T1552.001 — Credentials in Files |

**Impact**: Anyone with shell/filesystem access to the ListingLift server can extract the PAT and gain full read/write access to the GitHub repository.

### 3.2 Credential Storage Audit

| Location | Finding | Risk |
|----------|---------|------|
| `.git/config` | PAT in URL | **CRITICAL** |
| `.env` | Gitignored (verified absent from remote) | OK |
| `.env.example` | Placeholder values only | OK |
| Git credential helper | Not configured | **MEDIUM** — no secure credential storage |
| Git history (cdefdde) | `.env` with fake creds in seed commit | LOW — structure exposed |
| `process.env` access | All secrets via runtime env | OK |

### 3.3 Email Harvesting (T1589.001 — Credential from Password Store)

| Source | Email Found |
|--------|------------|
| Git config (`git config user.email`) | `dominicsarria@protonmail.com` |
| GitHub username | `dominator509` |
| GitHub profile email | `dominicarria@protonmail.com` |

Two email addresses discovered — useful for phishing/social engineering vectors.

---

## 4. INFORMATION DISCLOSURE (T1591 — Gather Victim Org Information)

### 4.1 Error Handling

| Pattern | Finding | Risk |
|---------|---------|------|
| Stack traces in responses | **ZERO** — no `.stack` in API routes | ✅ |
| Console logging in routes | **ZERO** — clean error handling | ✅ |
| Prisma error interception | mapped via `mapServiceError` (Q7) | OK |
| Verbose 500 errors | Not observed | ✅ |

### 4.2 Debug/Diagnostic Endpoints

| Endpoint | Status |
|----------|--------|
| `/api/health` | Exposed — no auth |
| `/api/adapters/health` | Exposed — no auth |
| `/api/advanced-image-processing/health` | Exposed — no auth |
| `/api/automation-webhooks/health` | Exposed — no auth |

4 health endpoints exposed without authentication — reveals subsystem status.

### 4.3 Directory Listing

No directory listing vulnerability detected. Next.js App Router does not serve directory indexes by default.

---

## 5. ATTACK PATH PRIORITIZATION

### 5.1 Attack Chains (Confidence-Scored)

| # | Attack Chain | Techniques | Confidence | Impact |
|---|-------------|-----------|------------|--------|
| 1 | PAT extraction → repo access → code injection → supply chain | T1552.001, T1195.002 | **HIGH (90%)** | CRITICAL |
| 2 | Demo header bypass → admin access → data exfil | T1548.002, T1078.001 | **HIGH (85%)** | HIGH |
| 3 | Unguarded webhook → Gumroad forgery → financial fraud | T1203, T1059 | **MEDIUM (60%)** | HIGH |
| 4 | Signup abuse → credential stuffing → account takeover | T1110.001, T1078 | **MEDIUM (55%)** | MEDIUM |
| 5 | Upload endpoint → filename traversal → file overwrite | T1003.003, T1505.003 | **LOW (30%)** | MEDIUM |
| 6 | Rate limiter exhaustion → DoS → availability loss | T1499.001, T1498.001 | **MEDIUM (65%)** | MEDIUM |
| 7 | CSP bypass → XSS → session hijacking | T1189, T1539 | **LOW (15%)** | HIGH |

### 5.2 Threat Actor Alignment

| Attack Chain | FIN7 (Enterprise) | ALPHV (Healthcare) | Lazarus (Web3) |
|-------------|-------------------|-------------------|----------------|
| Chain 1 (PAT/supply chain) | ✅ Primary | ✅ | ✅ Primary |
| Chain 2 (Demo bypass) | ✅ Secondary | ✅ Primary | ✅ Secondary |
| Chain 3 (Webhook fraud) | ✅ | ✅ Primary | — |
| Chain 4 (Credential stuffing) | ✅ | ✅ | ✅ |
| Chain 6 (Rate limit DoS) | ✅ | — | ✅ Primary |

---

## 6. MITRE ATT&CK RECONNAISSANCE COVERAGE

| Technique ID | Technique | Evidence | Detection |
|-------------|-----------|----------|-----------|
| T1590 | Gather Victim Network Info | Tech stack, 291 routes, server headers | ❌ No recon detection |
| T1590.001 | Determine Physical Layout | N/A (cloud-hosted) | N/A |
| T1590.004 | Network Topology | Server → DB → Stripe → Email (mapped) | ❌ Not logged |
| T1590.005 | IP Addresses | Not enumerated in recon | N/A |
| T1590.006 | Network Identity | App: listinglift v0.1.0 | ❌ Version leak |
| T1591 | Gather Victim Org Info | GitHub profile, emails | ❌ No profiling detection |
| T1592 | Gather Victim Host Info | Server headers, error patterns | ❌ No fingerprinting detection |
| T1593 | Search Open Websites/Domains | GitHub repo analysis | ✅ GitHub audit log (server-side) |
| T1593.001 | Social Media | N/A — no social presence linked | N/A |
| T1593.002 | Search Engines | Not performed | N/A |
| T1594 | Search Victim-Owned Websites | Route enumeration, /api/health | ❌ No access pattern alerting |
| T1598 | Phishing for Information | Emails discovered for phishing prep | N/A |

### Recon Detection Gap Summary

- **8/10 recon techniques have ZERO detection coverage**
- Only GitHub audit logs provide server-side detection (T1593)
- No web application firewall (WAF) to detect scanning/fingerprinting
- No anomaly detection on route enumeration patterns
- Rate limiter is IP-based only — does not detect recon behavior (many different endpoints at low rate)

---

## 7. PHASE 1 VERDICT: COMPLETE

### Key Findings Prioritized for Weaponization (Phase 2)

1. 🔴 **PAT in git remote** — Critical credential leak (T1552.001)
2. 🔴 **135 unguarded routes** — 46% attack surface without auth
3. 🟠 **84 no-op guards** — Admin bypass via demo headers (T1548.002)
4. 🟠 **4 health endpoints exposed** — Subsystem intelligence
5. 🟡 **Email addresses harvested** — Phishing entry point
6. 🟡 **Version 0.1.0 disclosure** — Early-stage, patches may lag
7. 🟡 **No credential helper** — Plaintext PAT in git config
8. 🟢 **No error stack disclosure** — Good operational security

### Detection Gap: 80% of MITRE reconnaissance TTPs undetected
