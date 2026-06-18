# Phase 29 Gap Handoff — Automation Webhooks

## ChatGPT-created seed artifacts

This repo seed includes provider definitions, trigger/action catalogs, adapters, route contracts, admin UI shells, Prisma schema scaffolds, migration scaffolds, and tests for automation webhook workflows.

## Codex-only work

Codex must:

1. Validate and repair the Prisma schema.
2. Regenerate migration SQL from Prisma.
3. Apply migrations in the target environment.
4. Connect `AutomationWebhookSubscription`, `AutomationWebhookDelivery`, and `AutomationDeadLetter` persistence.
5. Connect provider secrets to `EncryptedSecret` only.
6. Implement real HTTP dispatch only behind flags and encrypted secret references.
7. Add queue/retry/backoff execution using the repo-supported runtime.
8. Enforce RBAC and tenant isolation server-side.
9. Add rate limits to dispatch, test, retry, and subscription routes.
10. Audit all subscription, dispatch, retry, dead-letter, and manual fallback actions.
11. Ensure fulfillment never depends on automation success.
12. Run unit, security, integration, E2E, typecheck, lint, build, Prisma validate, migration, and seed checks.

## Critical blockers before completion

Do not mark Phase 29 complete until real runtime checks prove:

- Mock automation works without external APIs.
- Real dispatch is disabled by default.
- Secrets are never exposed in frontend responses, logs, snapshots, seed data, or tests.
- Payloads are redacted before dispatch and dead-letter storage.
- Failed automations create manual fallback paths.
- Delivery links are not sent before approval gates allow them.
