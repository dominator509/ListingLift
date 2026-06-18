# CODEX_WHOLE_REPO_STITCH_PROMPT_V38.md

You are Codex taking over `ListingLift_Repo_Seed_v38.zip`.

## Mission

Stitch, validate, and runtime-harden the v38 repo seed for ListingLift through Phase 36 — API Access and Advanced Integrations Scaffold.

This is not a blank project. Preserve the repo structure, source-of-truth architecture, roadmap, and all prior phase files. Do not delete prior phase scaffolds unless a compile/runtime error requires a minimal repair.

## Mandatory first review

Before changing code, read:

- `ListingLift.md` if available in the project context.
- `ListingLift_BUILD_ROADMAP.md` if available in the project context.
- `ROADMAP_STATUS.md`
- `CODEX_GAPS.md`
- `WHOLE_REPO_CODEX_HANDOFF_V38.md`
- `REPO_FILE_MANIFEST_V38.md`
- `CHATGPT_MARKDOWN_REVIEW_INDEX_V38.md`
- `PHASE_36_IMPLEMENTATION_NOTES.md`
- `PHASE_36_EXECUTION_RUNBOOK.md`
- `PHASE_36_VERIFICATION_MATRIX.md`
- `docs/api-access-advanced-integrations.md`
- `docs/api-access-advanced-integrations-phase36-gap-handoff.md`

## Current package

ListingLift Repo Seed v38

## Current phase

Phase 36 — API Access and Advanced Integrations Scaffold

## Next planned phase

Phase 37 — Security Hardening

## Critical product guardrail

ListingLift is an AI-powered product photo cleanup, marketplace image pack, ecommerce visual optimization, and multi-platform service sales engine. Do not drift into a generic file uploader, generic API, generic background remover, static landing page, or simple gallery.

API access must preserve:

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

## Security rules

Maintain these at all times:

- Never hardcode secrets.
- Never log secrets.
- Never expose provider keys to frontend.
- Never store marketplace passwords.
- Store provider tokens/keys only as encrypted secret references or env values.
- Store API tokens only as hashes.
- Show raw API tokens once only.
- Never return raw API tokens after creation.
- Never return token hashes to clients.
- Preserve original uploads and never overwrite originals.
- Use server-side auth, RBAC, tenant isolation, client isolation, and agency workspace isolation.
- Validate inputs with Zod/shared schemas.
- Reject unsafe uploads.
- Prevent ZIP slip.
- Neutralize CSV formula injection where exports are involved.
- Use expiring upload, delivery, invite, portal, and API tokens where appropriate.
- Store only hashed token values.
- Verify webhook signatures where applicable.
- Rate-limit sensitive routes.
- Audit paid/client-facing/manual override/admin analytics/agency/API token/webhook/shared upload portal actions.
- Keep real integrations disabled unless feature flags are explicitly enabled.
- Preserve manual fallback.
- Preserve admin approval before final delivery.
- Never expose final downloads before approval.
- Never guarantee marketplace approval, ranking, sales, conversion, ad performance, listing approval, or product approval.

## Phase 36 scope list

Enforce these scopes server-side:

- `jobs:create`
- `jobs:read`
- `uploads:create`
- `images:read`
- `deliveries:read`
- `webhooks:manage`
- `presets:read`
- `presets:write`

## Required runtime work

1. Run `npm install`.
2. Run `npm run db:validate`.
3. Repair `prisma/schema.prisma` if needed.
4. Regenerate or repair `prisma/migrations/0035_phase36_api_access_advanced_integrations/migration.sql` from Prisma.
5. Run `npm run db:generate`.
6. Apply migrations in the target dev environment.
7. Run seed twice and make it idempotent.
8. Run `npm run typecheck` and fix errors.
9. Run `npm run lint` and fix errors.
10. Run unit/security/integration/E2E tests and fix failures.
11. Run `npm run build` and fix errors.
12. Run smoke checks.
13. Verify browser rendering for Phase 36 admin pages.

## Required Phase 36 implementation repairs

- Replace dry-run API token context in `src/server/routes/api-token-route-helpers.ts` with real bearer-token hash lookup against `ApiAccessToken`.
- Ensure external API routes reject missing, malformed, revoked, expired, cross-tenant, insufficient-plan, insufficient-scope, or rate-limited tokens.
- Add transactionally persisted `ApiAccessEvent` audit events with sanitized metadata.
- Wire admin API access routes to `manage:api-access`, tenant isolation, rate limits, and audit logs.
- Wire token creation to hash-only persistence with one-time raw token display.
- Wire token revocation and rotation.
- Wire plan gates from verified subscription, invoice, credit, payment, and agency plan records.
- Wire API job creation into ListingLift job/package/source-channel/upload/billing workflows.
- Wire upload sessions/shared upload portals into upload safety and original preservation.
- Wire image reads to approved tenant-scoped metadata only.
- Wire delivery reads to approved delivery archives only after QC/manual approval/download gates.
- Wire preset writes as manual-review drafts.
- Wire webhooks with signing secrets, signatures, retries, dead-letter, replay controls, endpoint validation, event allowlists, rate limits, and audits.
- Keep Zapier, Make, n8n, custom API, and generic webhook integrations disabled by default unless explicit feature flags and encrypted secret references are ready.

## Verification commands

Run and report actual results:

```bash
npm install
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:seed
npm run typecheck
npm run lint
npm run test:unit -- api-access
npm run test:security -- api-access
npm run test:integration -- api-access
npm run test:e2e -- api-access
npm run build
npm run smoke
```

If a command cannot run in your environment, document exactly why and add it to `CODEX_GAPS.md`.

## Required output update

After completing your pass, update:

- `ROADMAP_STATUS.md`
- `CODEX_GAPS.md`
- `WHOLE_REPO_CODEX_HANDOFF.md`
- any phase-specific docs you changed
- verification notes with actual command results

Do not claim any command passed unless it actually ran.
