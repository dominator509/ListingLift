You are Codex implementing ListingLift from `ListingLift_Repo_Seed_v31.zip`.

Current target: Phase 29 — Automation Webhooks.

Before editing, inspect the repository and compare it with the v31 seed. Stitch the seed carefully without overwriting unrelated user changes.

Mandatory rules:

- Follow `ARCHITECTURE.md`, `BUILD_ROADMAP.md`, `ROADMAP_STATUS.md`, and `CODEX_GAPS.md`.
- Preserve roadmap order and update `ROADMAP_STATUS.md` before and after each major block.
- Keep real automation dispatch disabled by default.
- Mock automation must work without external services.
- Never expose webhook URLs, signing secrets, OAuth tokens, API keys, signed URL internals, or provider credentials to the frontend, logs, seed data, snapshots, or test fixtures.
- Store provider secrets only as encrypted secret references or environment variables.
- Redact payloads before dispatch and dead-letter storage.
- Rate-limit subscription, test, dispatch, retry, and replay routes.
- Enforce RBAC and tenant isolation server-side.
- Audit every automation subscription, dispatch, retry, failure, dead-letter, replay, and manual fallback action.
- Fulfillment must never depend on automation success.

Run relevant checks:

- `npm run typecheck`
- `npm run lint`
- `npm run test -- automation`
- `npm run test:security -- webhooks automation`
- `npm run test:integration -- automation-webhooks`
- `npm run test:e2e -- automation-webhooks`
- `npm run build`
- `npm run verify-env`
- `npx prisma validate`
- migration/seed checks supported by the repo

Report exact pass/fail results. Do not claim success unless commands were run.
