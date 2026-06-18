# PHASE_37_IMPLEMENTATION_NOTES.md

## Phase

Phase 37 — Security Hardening

## Package

ListingLift Repo Seed v39

## Objective

Add repo-seed scaffolding for project-wide security hardening without claiming production runtime verification. This phase converts the roadmap's security requirements into code contracts, UI shells, route contracts, Prisma/migration scaffolds, tests, and Codex handoff instructions.

## Review performed before coding

- Unzipped `ListingLift_Repo_Seed_v38.zip`.
- Read all Markdown files in the unzipped v38 repo.
- Read `ListingLift.md`.
- Read `ListingLift_BUILD_ROADMAP.md`.
- Confirmed v38 roadmap state from `ROADMAP_STATUS.md`, `CODEX_GAPS.md`, `WHOLE_REPO_CODEX_HANDOFF_V38.md`, and `REPO_FILE_MANIFEST_V38.md`.
- Confirmed next planned phase was Phase 37 — Security Hardening.
- Confirmed Phase 36 had no remaining ChatGPT-codeable work beyond Codex/runtime/database/install/test/browser verification.

## Architecture intent

Security hardening must protect ListingLift as an ecommerce product-image fulfillment system, not a generic uploader. The security controls must preserve:

- Service packages.
- Sales-channel normalization.
- Upload intake.
- Job/admin queue.
- Image processing pipeline.
- Platform presets.
- QC and flagged outputs.
- Manual approval and revisions.
- Delivery ZIPs and expiring links.
- Billing/credits/subscriptions.
- Marketplace workflows.
- Storage integrations.
- Automation integrations.
- Reports and upsells.
- Client dashboard.
- Admin dashboard.
- Agency white-label mode.
- API access and advanced integrations.

## Code added

### Domain and schemas

- `src/domain/security-hardening.ts`
- `src/schemas/security-hardening.ts`

### Shared security header helper

- `src/lib/security-headers.ts`

### Services

- `src/server/services/secret-reference-service.ts`
- `src/server/services/security-upload-guard-service.ts`
- `src/server/services/security-token-guard-service.ts`
- `src/server/services/security-rate-limit-policy-service.ts`
- `src/server/services/security-headers-service.ts`
- `src/server/services/csrf-protection-service.ts`
- `src/server/services/xss-output-protection-service.ts`
- `src/server/services/security-webhook-verification-service.ts`
- `src/server/services/audit-completeness-map-service.ts`
- `src/server/services/security-dashboard-service.ts`

### UI shells

- `src/components/security-hardening/security-hardening-shell.tsx`
- `src/components/security-hardening/security-summary-cards.tsx`
- `src/components/security-hardening/security-control-table.tsx`
- `src/components/security-hardening/upload-security-panel.tsx`
- `src/components/security-hardening/secret-token-security-panel.tsx`
- `src/components/security-hardening/rate-limit-security-panel.tsx`
- `src/components/security-hardening/header-csrf-xss-panel.tsx`
- `src/components/security-hardening/webhook-audit-security-panel.tsx`
- `src/components/security-hardening/security-guardrail-panel.tsx`
- `src/components/security-hardening/index.ts`

### Admin pages

- `src/app/admin/security/page.tsx`
- `src/app/admin/security/upload-safety/page.tsx`
- `src/app/admin/security/secrets/page.tsx`
- `src/app/admin/security/rate-limits/page.tsx`
- `src/app/admin/security/webhooks/page.tsx`
- `src/app/admin/security/audit-map/page.tsx`

### Admin API route contracts

- `src/app/api/admin/security/dashboard/route.ts`
- `src/app/api/admin/security/upload-guard/route.ts`
- `src/app/api/admin/security/secrets/route.ts`
- `src/app/api/admin/security/rate-limits/route.ts`
- `src/app/api/admin/security/csrf/route.ts`
- `src/app/api/admin/security/webhooks/route.ts`
- `src/app/api/admin/security/audit-map/route.ts`
- `src/app/api/admin/security/headers/route.ts`

### Config and permissions

- `src/domain/permissions.ts` adds `manage:security`.
- `src/config/navigation.ts` adds security nav entries.
- `next.config.ts` adds baseline security headers.
- `src/middleware.ts` applies security headers to middleware responses.
- `.env.example` adds Phase 37 security environment placeholders.

### Prisma

- `prisma/schema.prisma` adds Phase 37 security enums and models.
- `prisma/migrations/0036_phase37_security_hardening/migration.sql` is scaffold-only.

## Tests added

- `tests/unit/security-hardening-domain.test.ts`
- `tests/unit/security-upload-guard-service.test.ts`
- `tests/unit/security-rate-limit-policy-service.test.ts`
- `tests/security/security-hardening-controls.test.ts`
- `tests/security/csrf-and-headers.test.ts`
- `tests/integration/phase37-security-hardening-route-contract.test.ts`
- `tests/e2e/security-hardening.spec.ts`

## Key design decisions

- Security routes use `manage:security` and must be restricted to trusted admin roles at runtime.
- Security dashboards remain scaffold-only and should not be treated as verified compliance evidence.
- Secret references intentionally use draft `enc_ref_*` placeholders; this is not encryption.
- Security rate-limit service includes in-memory buckets for testable contracts only; production needs distributed limits.
- CSRF service is a session-bound HMAC draft; Codex must decide persisted hash versus stateless verification and wire it to mutating browser routes.
- Webhook verification scaffold intentionally never auto-processes events. Codex must add raw-body provider verification before paid/client-facing state changes.
- Security headers are seeded in both Next config and middleware, but actual browser/deployment behavior must be verified by Codex.

## Non-production statements

ChatGPT Project Mode did not install dependencies, validate Prisma, generate Prisma client, apply migrations, run seed, typecheck, lint, build, run Vitest, run Playwright, render pages in a browser, make real provider calls, test real storage, verify real webhooks, or run `npm run security-check`.
