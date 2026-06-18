# PHASE_36_EXECUTION_RUNBOOK.md

## Phase

Phase 36 — API Access and Advanced Integrations Scaffold

## Purpose

Guide Codex from the v38 repo seed to a runtime-verified API access and advanced integrations implementation.

## Preconditions

- Start from `ListingLift_Repo_Seed_v38.zip`.
- Do not overwrite source uploads or previous phase files.
- Keep real integrations disabled by default.
- Do not hardcode secrets.
- Do not expose token hashes, raw tokens, provider keys, marketplace credentials, or signed URLs.
- Preserve manual fallback and admin approval gates.

## Required Codex Steps

### 1. Install and baseline validation

```bash
npm install
npm run db:validate
npm run db:generate
```

If Prisma validation fails, repair `prisma/schema.prisma` and regenerate the Phase 36 migration from Prisma rather than trusting the scaffold SQL blindly.

### 2. Migration and seed

```bash
npm run db:migrate
npm run db:seed
npm run db:seed
```

Seed must be idempotent. Add seed records only if useful for local verification. Do not seed raw API tokens or raw webhook secrets.

### 3. Auth, RBAC, and tenant isolation

Wire admin API access routes to:

- authenticated sessions.
- `manage:api-access` permission.
- server-side tenant isolation.
- client and agency workspace scope.
- rate limits.
- audit logs.

Client-scoped users must not access admin API access pages or routes.

### 4. API token storage

Implement real token persistence:

- Generate raw API token server-side.
- Show raw token once in the creation response.
- Store only `tokenHash`, `tokenPrefix`, scopes, expiry, status, plan key, created actor, and tenant scope.
- Never return `tokenHash` or raw token after creation.
- Add revocation and rotation flows.
- Add expiry and last-used updates.

### 5. External API authentication

Replace dry-run API token context in `src/server/routes/api-token-route-helpers.ts` with:

- Authorization header parsing.
- SHA-256 hash of presented token.
- tenant-scoped `ApiAccessToken` lookup by hash.
- token status/expiry/revocation checks.
- scope checks.
- plan/subscription/payment gate checks.
- rate limits.
- request audit events.

### 6. Scope and plan enforcement

Enforce all Phase 36 scopes:

- `jobs:create`
- `jobs:read`
- `uploads:create`
- `images:read`
- `deliveries:read`
- `webhooks:manage`
- `presets:read`
- `presets:write`

Plan gates must use verified billing/subscription/agency plan data, not client-provided plan keys.

### 7. Wire API v1 routes to real services

- `POST /api/v1/jobs`: dedupe, normalize source channel, map package, create job transactionally, plan upload session when allowed.
- `GET /api/v1/jobs`: tenant-scoped, client-visible job summary only.
- `POST /api/v1/uploads`: issue scoped expiring upload token/session, preserve originals, enforce upload safety.
- `GET /api/v1/images/[imageId]`: metadata-only, no signed URLs or provider payloads.
- `GET /api/v1/deliveries/[deliveryId]`: approved delivery metadata only after QC/manual approval/download gates.
- `GET/POST /api/v1/presets`: read presets safely; write custom presets as manual-review drafts.
- `GET/POST /api/v1/webhooks`: manage webhook subscriptions without exposing secrets.

### 8. Webhook implementation

Add:

- signing secret hash/reference storage.
- signature generation.
- endpoint validation.
- event allowlist.
- retry policy.
- dead-letter queue.
- replay controls.
- rate limits.
- audit logs.

### 9. Advanced integrations

For Zapier, Make, n8n, custom API, and generic webhooks:

- Keep disabled unless feature flags are enabled.
- Store provider credentials only as encrypted secret references.
- Verify provider payloads before use.
- Do not scrape private marketplace pages.
- Do not automate prohibited marketplace outreach.
- Keep manual fallback.

### 10. Browser and test verification

Run:

```bash
npm run typecheck
npm run lint
npm run test:unit -- api-access
npm run test:security -- api-access
npm run test:integration -- api-access
npm run test:e2e -- api-access
npm run build
npm run smoke
```

Also manually verify browser rendering for:

- `/admin/api-access`
- `/admin/api-access/tokens`
- `/admin/api-access/scopes`
- `/admin/api-access/webhooks`
- `/admin/api-access/shared-upload-portal`
- `/admin/api-access/integrations`

## Rollback Plan

- Disable API access feature flags.
- Revoke API tokens by setting status to `REVOKED`.
- Disable advanced integration connections.
- Disable webhook subscriptions.
- Revoke shared upload portal links.
- Preserve original uploads and existing jobs.

## Completion Criteria

Phase 36 can be considered runtime-complete only after Codex has verified install, Prisma, migration, seed idempotency, typecheck, lint, unit/security/integration/E2E tests, build, smoke checks, browser rendering, token hashing, scope enforcement, plan gating, rate limits, audit logs, and secret redaction.
