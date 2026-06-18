# Security Hardening Phase 37 Gap Handoff

## Package

ListingLift Repo Seed v39

## Summary

Phase 37 adds security-hardening scaffolds. Codex must convert these scaffolds into runtime-enforced security controls before production.

## Immediate Codex priorities

1. Install dependencies and run the full verification chain.
2. Validate Prisma and regenerate/repair migration SQL.
3. Wire `manage:security` routes to production auth/RBAC/tenant isolation.
4. Replace secret-reference placeholders with real encrypted secret storage.
5. Wire upload and ZIP guards to all intake surfaces before persistence or extraction.
6. Replace in-memory rate-limit drafts with production-safe rate limits.
7. Wire CSRF to state-changing browser routes.
8. Verify response headers in browser/deployment context.
9. Wire provider webhook signature verification against raw request bodies.
10. Complete audit coverage and metadata redaction.

## Files Codex should inspect first

- `src/domain/security-hardening.ts`
- `src/schemas/security-hardening.ts`
- `src/server/services/secret-reference-service.ts`
- `src/server/services/security-upload-guard-service.ts`
- `src/server/services/security-token-guard-service.ts`
- `src/server/services/security-rate-limit-policy-service.ts`
- `src/server/services/security-headers-service.ts`
- `src/server/services/csrf-protection-service.ts`
- `src/server/services/xss-output-protection-service.ts`
- `src/server/services/security-webhook-verification-service.ts`
- `src/server/services/audit-completeness-map-service.ts`
- `src/app/api/admin/security/*`
- `src/components/security-hardening/*`
- `prisma/schema.prisma`
- `prisma/migrations/0036_phase37_security_hardening/migration.sql`

## Known scaffold limitations

- Draft encrypted secret refs are not real encryption.
- In-memory rate limits are not production-grade.
- CSRF is not globally enforced.
- Security headers are not browser-verified.
- Upload image parseability is not runtime-wired.
- ZIP inspection is not wired to real extraction.
- Webhook signature verification is represented as decision contracts only.
- Audit coverage is not persisted or verified.
- Prisma migration has not been validated.
- Tests have not been run.

## Required security checks

```bash
npm run test:security
npm run security-check
npm run typecheck
npm run lint
npm run build
npm run test:integration
npm run test:e2e
```

## Do not proceed to production if any of these are true

- Any raw provider secret can be persisted, returned, or logged.
- Any unsafe upload can be accepted.
- ZIP slip is possible.
- Any original upload can be overwritten.
- Any delivery can be downloaded before approval.
- Any final download can be exposed without an approved, scoped, expiring token.
- Any webhook can create paid/client-facing state without verified signature and idempotency.
- Any protected route relies only on UI hiding.
- Any tenant can read or mutate another tenant's data.
- Any marketplace approval/ranking/sales/conversion/ad-performance guarantee appears in generated output.
