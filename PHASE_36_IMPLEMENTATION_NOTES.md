# PHASE_36_IMPLEMENTATION_NOTES.md

## Phase

Phase 36 — API Access and Advanced Integrations Scaffold

## Objective

Add repo-seed scaffolding for ListingLift API access, advanced integrations, shared upload portals, scoped API token management, scope enforcement, and plan gating without claiming runtime readiness.

## Source Review

Before implementation, ChatGPT Project Mode unzipped `ListingLift_Repo_Seed_v37.zip`, reviewed all Markdown files in the repo, and reviewed the project source documents:

- `ListingLift.md`
- `ListingLift_BUILD_ROADMAP.md`
- `ROADMAP_STATUS.md`
- `CODEX_GAPS.md`
- `WHOLE_REPO_CODEX_HANDOFF_V37.md`
- `REPO_FILE_MANIFEST_V37.md`

Confirmed roadmap state:

- Current seeded phase before this work: Phase 35 — Agency White-Label Mode.
- Next planned phase: Phase 36 — API Access and Advanced Integrations Scaffold.
- Phase 35 remaining work is Codex/runtime/database/install/test/browser verification only.

## What Was Added

### Domain and schema contracts

- `src/domain/api-access.ts`
  - API scopes.
  - API token statuses.
  - plan keys and scope allowlists.
  - plan-gate evaluation.
  - scope normalization/enforcement helpers.
  - token masking/prefix helpers.
  - event metadata redaction.
  - unsafe guarantee-copy detection.
- `src/schemas/api-access.ts`
  - API token creation/query/revocation schemas.
  - plan-gate and scope-check schemas.
  - advanced integration connection schema.
  - webhook subscription schema.
  - shared upload portal schema.
  - external API v1 job/upload/webhook schemas.

### Server services

- `src/server/services/api-access-token-service.ts`
  - one-time raw token issue draft.
  - hash-only token record draft.
  - token verification helper.
  - revoke draft.
  - redacted token record preview.
- `src/server/services/api-access-plan-service.ts`
  - plan-gate decision helper.
  - scope matrix helper.
- `src/server/services/api-access-scope-service.ts`
  - token scope and plan gate checks.
- `src/server/services/api-access-event-service.ts`
  - sanitized API access event draft.
- `src/server/services/api-access-dashboard-service.ts`
  - dry-run dashboard rows for token, webhook, and portal views.
- `src/server/services/advanced-integration-catalog-service.ts`
  - Zapier, Make, n8n, custom API, and webhook catalog.
  - integration connection draft.
  - webhook subscription draft.
  - shared upload portal draft.
- `src/server/routes/api-token-route-helpers.ts`
  - external API bearer-token route scaffold.
  - dry-run context that Codex must replace with hashed-token Prisma lookup.

### UI shell

Added `src/components/api-access/*` for:

- API dashboard summary cards.
- token table.
- scope matrix.
- plan gate preview.
- advanced integration catalog.
- webhook management.
- shared upload portal panel.
- guardrail panel.
- composed API access shell.

Added admin pages:

- `/admin/api-access`
- `/admin/api-access/tokens`
- `/admin/api-access/scopes`
- `/admin/api-access/webhooks`
- `/admin/api-access/shared-upload-portal`
- `/admin/api-access/integrations`

### Route contracts

Added admin route contracts:

- `GET/POST /api/admin/api-access/tokens`
- `POST /api/admin/api-access/tokens/[tokenId]/revoke`
- `GET /api/admin/api-access/scopes`
- `POST /api/admin/api-access/plan-gate`
- `GET/POST /api/admin/api-access/integrations`
- `GET/POST /api/admin/api-access/webhooks`
- `GET/POST /api/admin/api-access/shared-upload-portal`
- `POST /api/admin/api-access/events`

Added external API route contracts:

- `GET/POST /api/v1/jobs`
- `GET /api/v1/jobs/[jobId]`
- `POST /api/v1/uploads`
- `GET /api/v1/images/[imageId]`
- `GET /api/v1/deliveries/[deliveryId]`
- `GET/POST /api/v1/presets`
- `GET/POST /api/v1/webhooks`

### Prisma scaffold

Added schema and migration scaffold for:

- `ApiAccessToken`
- `AdvancedIntegrationConnection`
- `ApiWebhookSubscription`
- `SharedUploadPortalLink`
- `ApiAccessEvent`

Migration scaffold:

- `prisma/migrations/0035_phase36_api_access_advanced_integrations/migration.sql`

## Security Intent

Phase 36 is explicitly designed around these rules:

- Raw API tokens are shown once only.
- API tokens are stored only as hashes.
- Token hashes are never returned to API/UI clients.
- Scopes are enforced server-side.
- API access is gated by verified plan/subscription/payment/token state.
- Shared upload portals use hash-only expiring tokens and preserve originals.
- Webhook signing secrets must be stored as hashes or encrypted secret references.
- Provider keys and integration secrets never reach frontend code.
- Real integrations remain disabled by default.
- API reads must not expose private admin notes, raw provider payloads, raw webhook payloads, signed URLs, marketplace credentials, or unapproved delivery data.

## ChatGPT-Only Checks Performed

- Static alias-import target scan across newly added TS/TSX files.
- Suspicious secret-pattern scan across newly added Phase 36 code/test files.
- ZIP integrity check after packaging.

## Not Performed

ChatGPT Project Mode did not run:

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
- real provider/API calls
- webhook signature verification
- runtime RBAC/tenant isolation verification

All runtime and production-readiness work remains Codex-only.
