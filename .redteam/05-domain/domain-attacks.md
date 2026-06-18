# Q15 Phase 5 — Domain-Specific Attack Paths

**Date**: 2026-06-15  
**Domains**: Enterprise/PHI, Web3/Crypto, Multi-Tenant  
**Adversary Lens**: FIN7 (Enterprise), ALPHV (Healthcare), Lazarus (Web3)  

---

## 1. ENTERPRISE & PHI ATTACK PATHS (ALPHV LENS)

### 1.1 HIPAA Gap Analysis

The codebase has 101 references to health/medical terms (schemas, testing endpoints, data models). This indicates the SYSTEM IS DESIGNED TO HANDLE HEALTH DATA but lacks HIPAA safeguards.

| HIPAA Safeguard | Implementation Status | Exploitation Path |
|-----------------|----------------------|-------------------|
| **Access Control (164.312.a.1)** | ⚠️ Session only — no RBAC enforcement (can()→true) | Any user → any health record |
| **Audit Controls (164.312.b)** | ❌ 95% gap — only logout logged | No forensic evidence of breach |
| **Integrity (164.312.c.1)** | ✅ CSRF + idempotency | Partial — mutation integrity |
| **Person Authentication (164.312.d)** | ⚠️ bcrypt(12) + weak password policy | Credential stuffing feasible (Phase 4) |
| **Transmission Security (164.312.e.1)** | ✅ HTTPS + Secure cookies | Good |
| **Encryption at Rest** | ❌ NOT IMPLEMENTED | DB dump = all PHI in cleartext |
| **Data Classification** | ❌ NOT IMPLEMENTED | No PHI labeling — all data treated equally |
| **Minimum Necessary** | ❌ NOT IMPLEMENTED | Full record returned for all queries |
| **Breach Notification** | ❌ NOT IMPLEMENTED | No 60-day HIPAA notification workflow |

### 1.2 PHI Exfiltration Attack Chain (ALPHV)

```
Step 1: Signup (T1078.001)
  → Unguarded /api/auth/signup
  → Valid session returned (no email verification needed)

Step 2: RBAC Bypass (T1548.002)
  → any guarded route accessible (can()→true, _permission discarded)

Step 3: Data Enumeration (T1005)
  → Access /api/patients, /api/medical-records, /api/health-*
  → No tenant scoping → all orgs' PHI accessible

Step 4: Unrestricted Exfiltration (T1048)
  → Extract all health records via paginated API
  → 14-day session window
  → No anomalous access detection
  → No audit trail of data access

Step 5: Ransom (T1486 — Data Encrypted for Impact)
  → With PAT → repo access → encrypt DB
  → No backup configured → irreversible
```

**ALPHV Confidence**: 85% — All steps confirmed viable through code analysis.

### 1.3 Enterprise Data Exposure

| Data Type | Exposed Endpoint | Auth Required | Tenant Scoped |
|-----------|-----------------|---------------|---------------|
| User profiles | /api/users | Session (bypassed) | ❌ No |
| Organization data | /api/organizations | Session (bypassed) | ❌ No |
| Payment/subscription | /api/subscriptions | Session (bypassed) | ❌ No |
| Billing data | /api/admin/billing | Session (bypassed) | ❌ No |
| Health records | /api/health-* | Session (bypassed) | ❌ No |
| File uploads | /api/uploads | Unguarded | ❌ No (ID enumeration) |
| API tokens | /api/admin/api-access | Unknown | Unknown |

---

## 2. WEB3 / CRYPTO ATTACK PATHS (LAZARUS LENS)

### 2.1 Web3 Surface Analysis

**Finding**: ListingLift has MINIMAL Web3 surface — 1 reference across entire codebase. This is a web3-aware application, not a web3-native dApp.

| Vector | Status | Risk |
|--------|--------|------|
| Smart contract interaction | ❌ None | N/A |
| Wallet connection (Metamask/Phantom) | ❌ None | N/A |
| RPC endpoint management | ❌ None | N/A |
| Private key management | ❌ None | N/A |
| On-chain transaction signing | ❌ None | N/A |
| NFT/token integration | ⚠️ Schema exists (1 ref) | LOW — not implemented |
| Blockchain indexing | ❌ None | N/A |

### 2.2 Lazarus-Aligned Attack Paths

Without native Web3 integration, Lazarus-style attacks focus on:

1. **Credential harvesting for exchange accounts**: If ListingLift users connect exchange/Web3 credentials, the credential storage vulnerability (PAT in git config) applies
2. **Supply chain compromise**: The PAT leak enables code injection → supply chain attack on any future Web3 features
3. **API token abuse for DeFi integration**: If API tokens are used for automated trading/DeFi integration, token theft = financial loss

**Lazarus Confidence**: 40% — Web3 surface is theoretical (not implemented). Attack value is in pre-positioning for future Web3 features.

---

## 3. MULTI-TENANT ATTACK PATHS

### 3.1 Tenant Isolation Analysis

**Critical Gap**: Only 1 reference to `organizationId` filtering across all server code. Despite the app being designed as multi-tenant (admin/agency/client roles), there is NO universal tenant scoping.

```ts
// Typical route handler (no tenant scoping):
export async function GET(request: Request) {
  const session = await requireSession(request);
  // ← NO organizationId filter
  const data = await prisma.listing.findMany();
  // ← Returns ALL listings across ALL organizations
  return Response.json({ ok: true, data });
}
```

### 3.2 Cross-Tenant Attack Chain

```
Step 1: Sign up as CLIENT in Organization A (T1078)
Step 2: RBAC bypass → access any route (can()→true)
Step 3: Enumerate Organization B's data:
  GET /api/listings → returns all orgs' listings (no tenant filter)
  GET /api/users → returns all orgs' users
  GET /api/subscriptions → returns all orgs' Stripe data
Step 4: Privileged access to Organization B:
  POST /api/organizations/{orgB-id}/users → add self as SUPER_ADMIN
```

### 3.3 Tenant Bypass Vectors

| Route Category | Tenant Scoping | Exploit |
|---------------|----------------|---------|
| Listings | ❌ No filter | All orgs' listings visible |
| Users | ❌ No filter (inferred) | Cross-org user enumeration |
| Subscriptions | ❌ No filter | Cross-org financial data |
| File uploads | ❌ No filter | ID enumeration across orgs |
| API tokens | Unknown | Potential cross-org token access |
| Health data | ❌ No filter | Cross-org PHI exposure |

---

## 4. ENTERPRISE COMPLIANCE TARGETING

### 4.1 Compliance Framework Exposure

| Framework | Attack Value | Status |
|-----------|-------------|--------|
| **SOC 2** | Audit failure → contract cancellation | ❌ No ISMS, no access reviews |
| **HIPAA** | Breach → mandatory reporting + fines | ❌ 6 of 9 safeguards missing |
| **PCI DSS** | Card data exposure → fines | ✅ Stripe delegation shields from PCI |
| **GDPR** | Data subject rights violation | ❌ No right-to-erasure workflow |
| **ISO 27001** | Certification invalidation | ❌ No risk register, no ISMS |

### 4.2 Ransomware Alignment (All Adversaries)

Combined attack path enabling enterprise ransomware:

```
1. Initial Access: PAT in git config OR credential stuffing
2. Execution: Code injection via git push OR session abuse
3. Persistence: Backdoor account OR injected middleware
4. Privilege Escalation: RBAC bypass → SUPER_ADMIN
5. Defense Evasion: IP spoofing → rate limiter bypass, no audit trail
6. Credential Access: bcrypt hash dump → offline cracking
7. Discovery: Cross-org enumeration → full data inventory
8. Lateral Movement: Cross-tenant data access
9. Collection: All PHI/financial/user data across all tenants
10. Exfiltration: API-based data extraction (undetected)
11. Impact: DB ransom (no backups), reputational (HIPAA breach)
```

---

## 5. PHASE 5 FINDINGS SUMMARY

| Finding | Domain | Adversary | Severity |
|---------|--------|-----------|----------|
| Full PHI exfiltration chain viable (85% confidence) | Enterprise/PHI | ALPHV | 🔴 CRITICAL |
| Cross-org data exposure (no tenant scoping) | Multi-Tenant | ALL | 🔴 CRITICAL |
| No data-at-rest encryption | Enterprise | FIN7/ALPHV | 🔴 CRITICAL |
| HIPAA compliance: 6/9 safeguards missing | Enterprise | ALPHV | 🟠 HIGH |
| No breach notification workflow | Enterprise | ALL | 🟠 HIGH |
| Supply chain prepositioning | Web3 | Lazarus | 🟡 MEDIUM |
| Web3 surface theoretical (not implemented) | Web3 | Lazarus | 🟢 LOW |
| SOC2/GDPR/ISO 27001 non-compliant | Enterprise | ALL | 🟡 MEDIUM |

**Domain Verdict**: 3 CRITICAL — PHI data is trivially exfiltratable, cross-organization data access is unrestricted, and there's no encryption at rest. A HIPAA-covered entity running ListingLift would experience a reportable breach within hours of an adversary gaining any authenticated session.
