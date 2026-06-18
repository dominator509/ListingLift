# WHOLE_REPO_CODEX_HANDOFF_V39.md

## Package

ListingLift Repo Seed v39

## Current phase

Phase 37 — Security Hardening

## Previous phase

Phase 36 — API Access and Advanced Integrations Scaffold was seeded in v38. It remains runtime-unverified.

## Next planned phase

Phase 38 — Full Testing and QA

## What ChatGPT Project Mode did in v39

- Unzipped and reviewed `ListingLift_Repo_Seed_v38.zip`.
- Reviewed every Markdown file in the v38 repo.
- Reviewed `ListingLift.md` and `ListingLift_BUILD_ROADMAP.md`.
- Confirmed roadmap/gap state from `ROADMAP_STATUS.md`, `CODEX_GAPS.md`, `WHOLE_REPO_CODEX_HANDOFF_V38.md`, and `REPO_FILE_MANIFEST_V38.md`.
- Advanced to Phase 37 because Phase 36 had no remaining ChatGPT-codeable work beyond Codex/runtime/database/install/test/browser verification.
- Added Phase 37 security hardening scaffolds.
- Updated docs, gaps, roadmap, manifest, review index, runbook, verification matrix, and Codex prompt.

## Phase 37 files added

### Domain/schemas/lib

- `src/domain/security-hardening.ts`
- `src/schemas/security-hardening.ts`
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

### UI

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

### Prisma

- `prisma/schema.prisma` updated with Phase 37 enums/models.
- `prisma/migrations/0036_phase37_security_hardening/migration.sql`

### Tests

- `tests/unit/security-hardening-domain.test.ts`
- `tests/unit/security-upload-guard-service.test.ts`
- `tests/unit/security-rate-limit-policy-service.test.ts`
- `tests/security/security-hardening-controls.test.ts`
- `tests/security/csrf-and-headers.test.ts`
- `tests/integration/phase37-security-hardening-route-contract.test.ts`
- `tests/e2e/security-hardening.spec.ts`

### Docs/handoff

- `PHASE_37_IMPLEMENTATION_NOTES.md`
- `PHASE_37_EXECUTION_RUNBOOK.md`
- `PHASE_37_VERIFICATION_MATRIX.md`
- `docs/security-hardening.md`
- `docs/security-hardening-phase37-gap-handoff.md`
- `prompts/CODEX_WHOLE_REPO_STITCH_PROMPT_V39.md`

## Files updated

- `ROADMAP_STATUS.md`
- `CODEX_GAPS.md`
- `API.md`
- `ADMIN_GUIDE.md`
- `SECURITY.md`
- `IMPLEMENTATION_SEQUENCE.md`
- `src/domain/permissions.ts`
- `src/config/navigation.ts`
- `src/middleware.ts`
- `next.config.ts`
- `.env.example`
- `prisma/schema.prisma`
- `WHOLE_REPO_CODEX_HANDOFF.md`
- `REPO_FILE_MANIFEST.md`
- `CHATGPT_MARKDOWN_REVIEW_INDEX.md`
- `docs/source/ListingLift.md`
- `docs/source/ListingLift_BUILD_ROADMAP.md`

## Phase 37 architecture intent

Security hardening must protect the full ListingLift fulfillment engine:

- service packages,
- sales-channel normalization,
- upload intake,
- job/admin queue,
- image processing pipeline,
- platform presets,
- QC and flagged outputs,
- manual approval and revisions,
- delivery ZIPs and expiring links,
- billing/credits/subscriptions,
- marketplace workflows,
- storage integrations,
- automation integrations,
- reports and upsells,
- client dashboard,
- admin dashboard,
- agency white-label mode,
- API access and advanced integrations.

It must not turn ListingLift into a generic uploader or generic compliance dashboard.

## Codex must not trust these scaffolds as production-ready

The following are scaffold-only:

- Prisma schema additions and migration SQL.
- Secret reference placeholder generation.
- In-memory rate-limit buckets.
- CSRF token draft helper.
- Security header config/middleware behavior.
- Upload guard dry-run probes.
- ZIP guard dry-run probes.
- Token lifecycle record drafts.
- Webhook verification decisions.
- Audit completeness rows.
- Admin security route contracts.
- Security UI pages.
- Unit/security/integration/E2E tests.

## Required Codex sequence

1. Install dependencies.
2. Validate Prisma schema.
3. Regenerate/repair migration SQL.
4. Generate Prisma client.
5. Apply migrations.
6. Run seed twice.
7. Run typecheck.
8. Run lint.
9. Run unit/security/integration/E2E tests.
10. Run `npm run security-check`.
11. Run build and smoke checks.
12. Browser-render all Phase 37 admin pages.
13. Verify actual response headers.
14. Wire real persistence, auth, RBAC, tenant isolation, rate limits, CSRF, upload parseability, ZIP safety, webhook signatures, and audit logs.
15. Update gaps and verification matrix with actual results.

## Phase 37 critical security requirements

- Never hardcode, log, return, or expose raw provider secrets, API keys, OAuth tokens, SMTP credentials, webhook secrets, signed URLs, marketplace credentials, marketplace passwords, raw bearer tokens, raw API tokens, upload tokens, delivery tokens, invite tokens, or portal tokens.
- Keep real integrations disabled by default.
- Store secrets as encrypted references or env/secret-manager values.
- Store tokens only as hashes.
- Preserve original uploads and never overwrite originals.
- Reject unsafe uploads before storage/processing.
- Prevent ZIP slip before extraction.
- Enforce server-side RBAC and tenant isolation.
- Verify webhooks before paid/client-facing state changes.
- Rate-limit sensitive routes.
- Audit sensitive actions with sanitized metadata.
- Keep final downloads hidden before approval.
- Never guarantee marketplace approval, ranking, sales, conversion, listing approval, product approval, or ad performance.

## Commands ChatGPT did not run

```bash
npm install
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run typecheck
npm run lint
npm run test
npm run test:unit
npm run test:security
npm run test:integration
npm run test:e2e
npm run security-check
npm run build
npm run smoke
```

## Next recommended Codex prompt

Use `prompts/CODEX_WHOLE_REPO_STITCH_PROMPT_V39.md`.
