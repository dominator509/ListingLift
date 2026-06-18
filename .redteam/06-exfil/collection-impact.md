# Q15 Phase 6 — Collection, Exfiltration & Impact

**Date**: 2026-06-15  
**ATT&CK Phases**: Collection (TA0009), Exfiltration (TA0010), Impact (TA0040)  

---

## 1. COLLECTION (TA0009)

### 1.1 Data Sources Available to Attacker

| Data Type | Endpoint Access | Collection Method | Records Estimate |
|-----------|----------------|-------------------|-----------------|
| User profiles (PII) | /api/users | Paginated GET, no tenant filter | All users, all orgs |
| Password hashes | DB only (via PAT/RCE) | Direct DB read | All users, all orgs |
| Session tokens | DB only (via PAT/RCE) | Direct DB read | All active sessions |
| Listings (business data) | /api/listings | Paginated GET, no tenant filter | All listings, all orgs |
| Subscriptions (financial) | /api/subscriptions | GET, no tenant filter | All Stripe data |
| Billing history | /api/admin/billing | GET | All billing records |
| File uploads | /api/uploads | ID enumeration (no auth) | All uploaded files |
| Health records | /api/health-* | GET | All PHI across all orgs |
| API tokens | /api/admin/api-access | Unknown | Unknown |
| Organization metadata | /api/organizations | GET | All orgs, all orgs |

### 1.2 Collection Automation

With a valid session (signup → immediate access), an attacker can script:

```python
# Automated collection — pseudocode
session = signup_account("attacker@evil.com")
for endpoint in ALL_DATA_ENDPOINTS:
    page = 1
    while True:
        data = GET(f"{endpoint}?page={page}", session_token=session.token)
        if not data: break
        exfiltrate(data)  # No audit trail, no anomaly detection
        page += 1
```

**Detection**: ZERO — no bulk download alerting, no rate limiting on GET requests, no pattern analysis.

### 1.3 Collection Capability Assessment

| Capability | Status | Limit |
|-----------|--------|-------|
| Full DB dump via API | ✅ Yes (paginated enumeration) | API response size only |
| Full DB dump via PAT | ✅ Yes (direct DB access) | DB connection required |
| Real-time collection | ✅ Yes (long-lived session, 14d) | Session expiry |
| Selective collection | ✅ Yes (targeted queries) | None |
| Cross-org collection | ✅ Yes (no tenant scoping) | None |
| PHI collection | ✅ Yes | None |

---

## 2. EXFILTRATION (TA0010)

### 2.1 Exfiltration Channels

| Channel | Stealth | Bandwidth | Detection |
|---------|---------|-----------|-----------|
| API response (standalone) | LOW | High (unlimited GET) | ❌ None configured |
| Webhook callback | MEDIUM | Medium | ⚠️ Only if webhook logging exists |
| Git push (via PAT) | HIGH | Very High (git push) | ❌ No push monitoring |
| Database dump (via PAT) | MEDIUM | Very High | ❌ No DB monitoring |
| File upload → attacker server | LOW | High | ❌ None configured |

### 2.2 Exfiltration Over C2

The PAT leak enables exfiltration via GitHub:
```
1. git clone repo
2. Add exfiltrated data to repo (looks like normal data files)
3. git push
4. Data leaves organization as "code changes"
```

This is particularly stealthy because git push is expected behavior from the server.

### 2.3 Exfiltration Detection Gap

| What Should Trigger | Currently Implemented? |
|--------------------|------------------------|
| Anomalous data volume (MBs transferred) | ❌ No |
| Unusual endpoint diversity (many diff routes) | ❌ No WAF |
| Off-hours data access | ❌ No temporal baseline |
| Cross-org data access pattern | ❌ No tenant anomaly |
| GitHub push from unexpected IP | ⚠️ GitHub audit log exists |

---

## 3. IMPACT (TA0040)

### 3.1 Attack Scenarios

#### Scenario A: Ransomware via PAT (FIN7)
```
PAT access → git push code injection
  → Encrypt DB with injected key
  → Delete backups (none configured → trivially successful)
  → Ransom demand with proof of PHI access
  → HIPAA breach notification triggers (45-day reporting deadline)
```

**Impact**: Financial (ransom), regulatory (HIPAA fines up to $50K/violation), reputational, operational (DB unavailable)

#### Scenario B: Data Extortion (ALPHV)
```
Signup → RBAC bypass → full data enumeration
  → Extract all PHI across all orgs
  → No encryption at rest → cleartext dump
  → Extortion: pay or release PHI
  → No audit trail → victim unaware of scope
```

**Impact**: Regulatory, reputational, class-action liability

#### Scenario C: Supply Chain Poisoning (Lazarus)
```
PAT access → inject malicious dependency in package.json
  → Next.js rebuild picks up malicious package
  → Backdoor in production for all users
  → Long-term crypto wallet draining / data exfiltration
```

**Impact**: Persistent, wide-reaching, hard to detect

### 3.2 Impact Likelihood Matrix

| Scenario | Initial Access Confidence | Execution Confidence | Overall Risk |
|----------|--------------------------|---------------------|-------------|
| A: Ransomware | 90% (PAT confirmed) | 80% (no backup) | 🔴 CRITICAL |
| B: Data extortion | 95% (signup→RBAC bypass) | 85% (no audit) | 🔴 CRITICAL |
| C: Supply chain | 90% (PAT confirmed) | 70% (requires build system knowledge) | 🟠 HIGH |

### 3.3 System Destruction Capability

| Action | Feasibility | Recovery |
|--------|------------|----------|
| Drop all DB tables | ✅ Yes (PAT → Prisma) | ❌ No backup configured |
| Delete all files | ✅ Yes (PAT → git push delete) | ❌ Manual recovery only |
| Revoke all sessions | ✅ Yes (DB write) | 14-day self-recovery |
| Rotate Stripe keys | ❌ No (Stripe requires admin console) | N/A |
| Deface website | ✅ Yes (PAT → code injection) | Requires code rollback |
| Delete git history | ✅ Yes (PAT → force push empty) | ❌ GitHub retains? |
| DoS via rate limiter | ✅ Yes (IP spoofing + mass requests → unbounded Map → OOM) | Server restart |

---

## 4. COMBINED ADVERSARY KILL CHAIN

### FIN7 / ALPHV / Lazarus Unified Attack

```
T1552.001  PAT in .git/config CRITICAL
    ↘
T1078.001  Signup → immediate session (no email verification) CRITICAL
    ↘
T1548.002  RBAC bypass → can()→true + _permission discarded CRITICAL
    ↘
T1531      IP spoofing → rate limiter bypass CRITICAL
    ↘
T1562.001  Audit log evasion → 95% of actions unlogged CRITICAL
    ↘
T1005      Full data collection → all orgs, all records CRITICAL
    ↘
T1048      Data exfiltration via API or git push CRITICAL
    ↘
T1486      Data encrypted for impact (ransomware) CRITICAL
```

**10 CRITICAL-rated TTPs with zero detection coverage.**
