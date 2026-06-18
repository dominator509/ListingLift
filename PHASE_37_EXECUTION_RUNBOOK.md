# PHASE_37_EXECUTION_RUNBOOK.md

## Phase

Phase 37 — Security Hardening

## Purpose

Give Codex an operational sequence to turn the v39 security scaffolds into runtime-verified implementation.

## Preflight

1. Confirm working package is `ListingLift_Repo_Seed_v39`.
2. Read:
   - `ROADMAP_STATUS.md`
   - `CODEX_GAPS.md`
   - `WHOLE_REPO_CODEX_HANDOFF_V39.md`
   - `PHASE_37_IMPLEMENTATION_NOTES.md`
   - `PHASE_37_VERIFICATION_MATRIX.md`
   - `docs/security-hardening.md`
   - `docs/security-hardening-phase37-gap-handoff.md`
3. Confirm real integrations remain disabled by default.
4. Confirm no real secrets are committed.

## Runtime setup sequence

```bash
npm install
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:seed
npm run typecheck
npm run lint
npm run test:unit
npm run test:security
npm run test:integration
npm run test:e2e
npm run security-check
npm run build
npm run smoke
```

If any command fails, fix the issue or document the blocker in `CODEX_GAPS.md` before continuing.

## Implementation order

### 1. Prisma and persistence

- Validate Phase 37 Prisma schema additions.
- Regenerate/repair migration SQL.
- Decide whether `SecurityHardeningEvent` should coexist with or be merged into the existing audit log model.
- Persist security secret references, rate-limit rules, audit coverage items, CSRF token hashes if using persisted tokens, and security hardening events transactionally.

### 2. Secret storage

- Replace draft `enc_ref_*` generation with real KMS/envelope encryption or provider secret manager references.
- Ensure raw secrets never persist or return to frontend/API.
- Add secret rotation and revocation flows.
- Add no-secret-leakage tests.

### 3. Upload and ZIP enforcement

- Wire upload guard to all upload surfaces before storage or processing.
- Add image parseability checks.
- Add ZIP inspection before extraction.
- Preserve originals and never overwrite originals.
- Add regression tests for unsafe types, oversize files, ZIP slip, nested archives, and tenant/job/token scope.

### 4. Token lifecycle

- Enforce hashed expiring scoped tokens for upload, delivery, API, agency invite, shared portal, CSRF if persisted, and webhook signing secrets where applicable.
- Add revocation, max-use/download, approval, replay, and audit checks.

### 5. Rate limits

- Replace in-memory limiter with deployment-appropriate distributed counters.
- Add rate-limit middleware/service calls to all sensitive routes.
- Add safe retry headers and sanitized audit events.

### 6. Security headers

- Verify response headers in actual Next runtime.
- Tune CSP for checkout redirects, storage/CDN/image providers, and Next runtime requirements.
- Add browser smoke checks.

### 7. CSRF and XSS

- Wire CSRF to state-changing browser requests.
- Exempt only bearer-token API routes and provider webhooks where CSRF is not applicable.
- Wire XSS/output/CSV protections into reports, delivery notes, listing copy, integration templates, notification templates, and exports.

### 8. Webhooks

- Verify raw request body signatures for Stripe, Gumroad, API webhooks, automation webhooks, and future ecommerce webhooks where supported.
- Block unsigned/unsupported/stale/duplicate/mismatched events from paid/client-facing state changes.
- Add idempotency and replay protection.

### 9. Audit and RBAC

- Enforce `manage:security` server-side.
- Verify tenant isolation across security records.
- Complete audit coverage for all sensitive actions.
- Verify metadata redaction.

## Browser smoke targets

- `/admin/security`
- `/admin/security/upload-safety`
- `/admin/security/secrets`
- `/admin/security/rate-limits`
- `/admin/security/webhooks`
- `/admin/security/audit-map`

## Required documentation updates after Codex work

- `CODEX_GAPS.md`
- `ROADMAP_STATUS.md`
- `SECURITY.md`
- `API.md`
- `ADMIN_GUIDE.md`
- `PHASE_37_VERIFICATION_MATRIX.md`
- Any migration/runtime notes

## Stop conditions

Stop and document blockers if:

- A secret appears in source, logs, test snapshots, API responses, or frontend props.
- A protected security route can be accessed without auth/RBAC/tenant scope.
- A webhook can create paid/client-facing state without verified signature and idempotency.
- A delivery can be downloaded before approval.
- An upload can overwrite an original.
- ZIP slip extraction is possible.
- Unsafe marketplace guarantee copy appears.
