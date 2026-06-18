# API Access Advanced Integrations Phase 36 Gap Handoff

## Current State

Phase 36 has been scaffolded in v38. It includes domain rules, schemas, services, UI shells, route contracts, Prisma schema/migration scaffolds, tests, docs, and handoff files.

## Codex Must Complete

- Install dependencies.
- Validate Prisma schema.
- Regenerate or repair Phase 36 migration SQL.
- Generate Prisma client.
- Apply migrations.
- Run seed twice.
- Replace dry-run token contexts with real hashed-token database lookup.
- Enforce `manage:api-access` on admin API routes.
- Enforce all API scopes on external API routes.
- Gate all API actions by verified plan/subscription/payment/token state.
- Add rate limits to admin and external API routes.
- Add transactional audit logs.
- Wire API job creation to normalized orders/jobs/upload planning.
- Wire API upload sessions to upload safety and original preservation.
- Wire API image and delivery reads to approved tenant-scoped data only.
- Wire preset writes as manual-review drafts.
- Wire webhook signing, retries, dead-letter, replay, event allowlist, and endpoint validation.
- Keep Zapier/Make/n8n/custom API/webhook integrations disabled by default until feature flags and encrypted secrets are ready.
- Ensure no frontend/client response exposes raw tokens, token hashes, provider keys, marketplace credentials, raw webhook payloads, signed URLs, private notes, or unapproved delivery data.
- Run typecheck, lint, unit/security/integration/E2E tests, build, smoke checks, and browser rendering.

## Special Security Notes

The external API routes currently use dry-run token contexts to express route contracts. This is not production authentication. Codex must replace that with real bearer-token hashing and `ApiAccessToken` lookup before any deployment or provider testing.

Raw tokens must be shown once only. Do not seed, log, snapshot, or return real raw tokens outside the creation response.
