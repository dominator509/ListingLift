# WHOLE_REPO_CODEX_HANDOFF_V38.md

## Package

ListingLift Repo Seed v38

## Current phase

Phase 36 — API Access and Advanced Integrations Scaffold

## Previous phase

Phase 35 — Agency White-Label Mode was seeded in v37. It remains runtime-unverified.

## Next planned phase

Phase 37 — Security Hardening

## What ChatGPT Project Mode did in v38

- Unzipped and reviewed `ListingLift_Repo_Seed_v37.zip`.
- Reviewed every Markdown file in the v37 repo.
- Reviewed `ListingLift.md` and `ListingLift_BUILD_ROADMAP.md`.
- Confirmed roadmap/gap state from `ROADMAP_STATUS.md`, `CODEX_GAPS.md`, `WHOLE_REPO_CODEX_HANDOFF_V37.md`, and `REPO_FILE_MANIFEST_V37.md`.
- Advanced to Phase 36 because Phase 35 has no remaining ChatGPT-codeable work beyond Codex/runtime/database/install/test/browser verification.
- Added Phase 36 API access and advanced integration scaffolds.
- Updated docs, gaps, roadmap, manifest, review index, runbook, verification matrix, and Codex prompt.

## Phase 36 files added

### Domain/schemas

- `src/domain/api-access.ts`
- `src/schemas/api-access.ts`

### Services/routes helpers

- `src/server/services/api-access-token-service.ts`
- `src/server/services/api-access-plan-service.ts`
- `src/server/services/api-access-scope-service.ts`
- `src/server/services/api-access-event-service.ts`
- `src/server/services/api-access-dashboard-service.ts`
- `src/server/services/advanced-integration-catalog-service.ts`
- `src/server/routes/api-token-route-helpers.ts`

### UI

- `src/components/api-access/api-access-shell.tsx`
- `src/components/api-access/api-access-summary-cards.tsx`
- `src/components/api-access/api-token-table.tsx`
- `src/components/api-access/api-scope-matrix-panel.tsx`
- `src/components/api-access/api-plan-gate-panel.tsx`
- `src/components/api-access/advanced-integration-catalog-panel.tsx`
- `src/components/api-access/api-webhook-management-panel.tsx`
- `src/components/api-access/shared-upload-portal-panel.tsx`
- `src/components/api-access/api-guardrail-panel.tsx`
- `src/components/api-access/index.ts`

### Admin pages

- `src/app/admin/api-access/page.tsx`
- `src/app/admin/api-access/tokens/page.tsx`
- `src/app/admin/api-access/scopes/page.tsx`
- `src/app/admin/api-access/webhooks/page.tsx`
- `src/app/admin/api-access/shared-upload-portal/page.tsx`
- `src/app/admin/api-access/integrations/page.tsx`

### Admin API route contracts

- `src/app/api/admin/api-access/tokens/route.ts`
- `src/app/api/admin/api-access/tokens/[tokenId]/revoke/route.ts`
- `src/app/api/admin/api-access/scopes/route.ts`
- `src/app/api/admin/api-access/plan-gate/route.ts`
- `src/app/api/admin/api-access/integrations/route.ts`
- `src/app/api/admin/api-access/webhooks/route.ts`
- `src/app/api/admin/api-access/shared-upload-portal/route.ts`
- `src/app/api/admin/api-access/events/route.ts`

### External API route contracts

- `src/app/api/v1/jobs/route.ts`
- `src/app/api/v1/jobs/[jobId]/route.ts`
- `src/app/api/v1/uploads/route.ts`
- `src/app/api/v1/images/[imageId]/route.ts`
- `src/app/api/v1/deliveries/[deliveryId]/route.ts`
- `src/app/api/v1/presets/route.ts`
- `src/app/api/v1/webhooks/route.ts`

### Prisma

- `prisma/schema.prisma` updated with Phase 36 enums/models.
- `prisma/migrations/0035_phase36_api_access_advanced_integrations/migration.sql`

### Tests

- `tests/unit/api-access-domain.test.ts`
- `tests/unit/api-access-token-service.test.ts`
- `tests/security/api-access-token-security.test.ts`
- `tests/integration/phase36-api-access-route-contract.test.ts`
- `tests/e2e/api-access.spec.ts`

### Docs/handoff

- `PHASE_36_IMPLEMENTATION_NOTES.md`
- `PHASE_36_EXECUTION_RUNBOOK.md`
- `PHASE_36_VERIFICATION_MATRIX.md`
- `docs/api-access-advanced-integrations.md`
- `docs/api-access-advanced-integrations-phase36-gap-handoff.md`
- `prompts/CODEX_WHOLE_REPO_STITCH_PROMPT_V38.md`

## Files updated

- `ROADMAP_STATUS.md`
- `CODEX_GAPS.md`
- `API.md`
- `ADMIN_GUIDE.md`
- `IMPLEMENTATION_SEQUENCE.md`
- `src/domain/permissions.ts`
- `src/config/navigation.ts`
- `prisma/schema.prisma`
- `WHOLE_REPO_CODEX_HANDOFF.md`
- `REPO_FILE_MANIFEST.md`
- `CHATGPT_MARKDOWN_REVIEW_INDEX.md`

## Phase 36 architecture intent

API access must not turn ListingLift into a generic file uploader. It must preserve the product-photo fulfillment engine:

- service packages.
- sales-channel normalization.
- upload intake.
- job/admin queue.
- image processing pipeline.
- platform presets.
- QC and flagged outputs.
- manual approval and revisions.
- delivery ZIPs and expiring links.
- billing/credits/subscriptions.
- marketplace workflows.
- storage integrations.
- automation integrations.
- reports and upsells.
- client dashboard.
- admin dashboard.
- agency white-label mode.

## Codex must not trust these scaffolds as production-ready

The following are scaffold-only:

- Prisma schema additions.
- migration SQL.
- API token route helper.
- dry-run API token context.
- dashboard demo rows.
- admin API route dry-run payloads.
- external `/api/v1/*` route contracts.
- webhook/subscription/portal drafts.
- tests.

## Critical Codex tasks

1. Install dependencies.
2. Validate Prisma schema.
3. Regenerate or repair Phase 36 migration SQL.
4. Generate Prisma client.
5. Apply migrations.
6. Run seed twice.
7. Replace dry-run token context with real bearer-token hash lookup.
8. Persist `ApiAccessToken`, `AdvancedIntegrationConnection`, `ApiWebhookSubscription`, `SharedUploadPortalLink`, and `ApiAccessEvent` records transactionally.
9. Enforce `manage:api-access` RBAC on admin routes.
10. Enforce API token scopes on every external route.
11. Gate API access by verified subscription/agency plan/payment/token state.
12. Add rate limits and audit logs.
13. Ensure raw API tokens are shown once only and never persisted.
14. Ensure token hashes, provider secrets, signing secrets, signed URLs, marketplace credentials, and raw webhook payloads never leak.
15. Wire API job creation to dedupe/package/source-channel/job/upload/billing workflows.
16. Wire API upload sessions and shared portals to upload safety and original preservation.
17. Wire image and delivery reads to approved tenant-scoped data only.
18. Wire preset writes as manual-review drafts.
19. Wire webhooks with signatures, retries, dead letters, replays, endpoint validation, and event allowlists.
20. Keep Zapier/Make/n8n/custom API/webhooks disabled by default unless explicit feature flags and encrypted secret references are ready.
21. Run typecheck, lint, unit/security/integration/E2E tests, build, smoke checks, and browser rendering.

## Tests ChatGPT added but did not run

- API access domain tests.
- API token service tests.
- API access token security tests.
- Phase 36 route contract test.
- API access Playwright scaffold.

## Checks ChatGPT actually ran

- Static alias import target scan.
- Suspicious secret-pattern scan.
- ZIP integrity check.

## Checks ChatGPT did not run

- `npm install`
- Prisma validation
- Prisma migration generation/application
- Prisma client generation
- seed scripts
- typecheck
- lint
- Vitest
- Playwright
- Next build
- browser rendering
- provider API calls
- webhook signature verification
- runtime RBAC/tenant isolation verification

## Next Codex prompt

Use:

`prompts/CODEX_WHOLE_REPO_STITCH_PROMPT_V38.md`
