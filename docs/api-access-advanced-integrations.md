# API Access and Advanced Integrations

## Phase

Phase 36 — API Access and Advanced Integrations Scaffold

## Purpose

ListingLift API access supports agency API clients, shared upload portals, Zapier/Make/n8n workflows, custom apps, and webhook-driven operations while preserving the core product-photo fulfillment workflow.

This is not a generic file uploader or generic API. API access must remain tied to:

- service packages.
- sales-channel normalization.
- upload intake.
- jobs and admin queue.
- image processing pipeline.
- platform presets.
- QC and flagged outputs.
- manual approval.
- delivery ZIPs and expiring links.
- billing/credits/subscriptions.
- reports and upsells.
- client and agency dashboards.

## Supported Phase 36 Scopes

- `jobs:create`
- `jobs:read`
- `uploads:create`
- `images:read`
- `deliveries:read`
- `webhooks:manage`
- `presets:read`
- `presets:write`

## Token Rules

- Generate API tokens server-side.
- Show raw API tokens exactly once.
- Store only token hashes.
- Store a token prefix for operator identification.
- Never return raw tokens after creation.
- Never return token hashes to UI or API clients.
- Support expiry, revocation, rotation, scope changes, and last-used timestamps.
- Audit token creation, one-time display, scope checks, revocations, rotations, and API requests.

## Plan Gate Rules

API access must be gated by verified records, not client-provided values:

- subscription status.
- agency plan.
- payment status.
- token status.
- token expiry.
- token revocation.
- requested scopes.
- organization/client/agency workspace scope.

## External API Contract Intent

External API routes are scaffolded under `/api/v1/*` for:

- job creation and job reads.
- upload session creation.
- image metadata reads.
- delivery metadata reads.
- preset reads and draft preset writes.
- webhook subscription management.

Codex must replace dry-run route context with real hashed-token lookup, scope checks, tenant isolation, rate limits, and audit logs.

## Shared Upload Portals

Shared upload portals are agency/API-adjacent intake flows. They must:

- use hash-only expiring tokens.
- be scoped to organization/client/job/agency workspace.
- reject unsafe uploads.
- prevent ZIP slip.
- reject executable files.
- enforce size and count limits.
- preserve original uploads.
- never overwrite originals.
- audit intake events.

## Webhooks

Webhook subscriptions must include:

- event allowlists.
- endpoint validation.
- signing secret hash/reference storage.
- signature generation.
- retries.
- dead-letter queue.
- replay controls.
- rate limits.
- audit logs.

Do not expose raw webhook payloads, signing secrets, token hashes, or encrypted secret references in client-visible responses.

## Advanced Integrations

The scaffold includes catalog entries for:

- Zapier.
- Make.
- n8n.
- custom agency API clients.
- generic webhooks.

All real integrations must stay disabled by default until:

- feature flags are explicitly enabled.
- provider credentials are stored as encrypted secret references.
- provider payload verification is implemented.
- RBAC and tenant isolation are verified.
- rate limits and audit logs are active.

## Non-Guarantee Rule

API docs, admin UI, webhook payloads, and integration templates must never guarantee marketplace approval, ranking, sales, conversion, listing approval, product approval, or ad performance.
