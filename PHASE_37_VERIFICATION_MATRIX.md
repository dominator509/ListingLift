# PHASE_37_VERIFICATION_MATRIX.md

## Phase

Phase 37 — Security Hardening

## Verification status legend

- `Not run` — not executed in ChatGPT Project Mode.
- `Scaffolded` — code/test/doc contract exists, runtime not verified.
- `Codex required` — must be completed in runtime environment.
- `Blocked` — cannot be completed until a dependency is resolved.

| Area | Requirement | Scaffolded files | ChatGPT status | Codex verification required |
|---|---|---|---|---|
| Markdown review | Review v38 repo Markdown and source docs | `CHATGPT_MARKDOWN_REVIEW_INDEX_V39.md` | Scaffolded | Codex may re-review if source changes |
| Secret storage | Encrypted refs/env-only secrets; no raw secrets | `src/server/services/secret-reference-service.ts`, Prisma `SecuritySecretReference` | Scaffolded | Wire KMS/secret manager, no-leak tests |
| Upload validation | MIME, extension, size, parseability, unsafe file rejection | `security-upload-guard-service.ts` | Scaffolded | Wire all upload routes, real parser tests |
| ZIP safety | Prevent ZIP slip/nested archives/unsafe entries | `security-upload-guard-service.ts`, existing `zip-safety-service.ts` | Scaffolded | Test real archive handling before extraction |
| Token lifecycle | Hash, scope, expire, revoke tokens | `security-token-guard-service.ts`, Prisma `SecurityCsrfToken` | Scaffolded | Persist hashes only, enforce all token routes |
| Rate limits | Sensitive route policies | `security-rate-limit-policy-service.ts` | Scaffolded | Replace in-memory with distributed limiter |
| Headers | CSP, nosniff, referrer, frame, permissions, HSTS | `next.config.ts`, `src/middleware.ts`, `security-headers-service.ts` | Scaffolded | Browser/deployment header verification |
| CSRF | Session-bound token draft | `csrf-protection-service.ts`, `/api/admin/security/csrf` | Scaffolded | Wire to all state-changing browser mutations |
| XSS/output | Escape output, CSV safety, no-guarantee copy | `xss-output-protection-service.ts` | Scaffolded | Wire report/delivery/template/export outputs |
| Webhooks | Verify signatures before paid/client-facing state | `security-webhook-verification-service.ts` | Scaffolded | Raw-body provider verification, replay/idempotency |
| Audit map | Sensitive action coverage | `audit-completeness-map-service.ts`, Prisma `SecurityAuditCoverageItem`, `SecurityHardeningEvent` | Scaffolded | Persist/verify coverage and redaction |
| RBAC/tenant isolation | `manage:security`, org scope, object ownership | `permissions.ts`, `/api/admin/security/*` | Scaffolded | Production auth/session and isolation tests |
| UI | Admin security shells render | `src/app/admin/security/*`, `src/components/security-hardening/*` | Scaffolded | Playwright/browser smoke checks |
| API route contracts | Admin security route contracts | `/api/admin/security/*` | Scaffolded | Integration tests against real auth/persistence |
| Prisma | Security models and migration | `schema.prisma`, `0036_phase37_security_hardening` | Scaffolded | Prisma validate, generate, migrate |
| Tests | Unit/security/integration/E2E scaffolds | `tests/unit/*security*`, `tests/security/*`, `tests/integration/phase37*`, `tests/e2e/security-hardening.spec.ts` | Not run | Run and repair all tests |
| Build | Next build/typecheck/lint | package scripts | Not run | `npm run typecheck`, `npm run lint`, `npm run build` |

## Commands not run by ChatGPT

```bash
npm install
npm run db:validate
npm run db:generate
npm run db:migrate
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

## Minimum pass criteria before production

- All commands above pass.
- All Phase 37 code is wired to real persistence/auth/session where required.
- No secret leakage in source, logs, API responses, frontend props, snapshots, reports, exports, or audit metadata.
- Upload/ZIP/token/webhook/RBAC/tenant-isolation security tests pass.
- Browser smoke tests verify security pages and response headers.
- Real integrations remain disabled unless explicitly configured through audited feature flags and encrypted secret references.
