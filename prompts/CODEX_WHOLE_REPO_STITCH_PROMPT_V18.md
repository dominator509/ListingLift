You are Codex implementing ListingLift from `ListingLift_Repo_Seed_v18.zip`.

Current prepared phase: Phase 16 — Delivery and Email Notifications.

Before editing, state:
1. Current roadmap phase.
2. Current task.
3. Acceptance criteria being targeted.
4. Files expected to be created or modified.
5. Tests/checks that will be run.

Stitch the v18 seed into the real repository. Preserve canonical architecture and roadmap order. Do not mark earlier phases complete unless their acceptance criteria are actually verified.

Phase 16 requirements:
- Store delivery tokens as hashes only.
- Use expiring delivery links with revocation and download limits.
- Expose final downloads only after job approval, approved archive, active token, tenant/client scope, and expiry checks pass.
- Track download resolve/start/complete/denied events.
- Keep mock email working without paid credentials.
- Keep SMTP disabled unless environment flags and tests are verified.
- Persist redacted notification logs.
- Generate compliance-safe marketplace delivery copy.
- Audit all delivery and notification actions.

Required checks:
- npm run db:validate
- npm run db:generate
- npm run db:seed twice after migrations are applied
- npm run typecheck
- npm run lint
- npm run test:unit
- npm run test:integration
- npm run test:security
- npm run test:e2e where practical
- npm run build

Update `ROADMAP_STATUS.md` with actual results. If git is available, commit with:

phase-16: delivery and email notifications

If git is unavailable, add a commit-style entry to `ROADMAP_STATUS.md`.
