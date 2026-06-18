You are Codex implementing ListingLift from `ListingLift_Repo_Seed_v32.zip`.

Start by inspecting the existing repository and this seed package. Follow `ARCHITECTURE.md`, `BUILD_ROADMAP.md`, `ROADMAP_STATUS.md`, `CODEX_GAPS.md`, and `WHOLE_REPO_CODEX_HANDOFF_V32.md`.

Current seed phase: Phase 30 — Notifications and Task/Data Exports.

Before editing, state:
1. Current roadmap phase.
2. Current roadmap task.
3. Acceptance criteria being targeted.
4. Files expected to be created or modified.
5. Tests/checks that will be run.

Implement carefully:
- Stitch Phase 30 files into the repo.
- Validate TypeScript imports and routing.
- Validate Prisma schema and regenerate migrations.
- Keep Slack, email, Google Sheets, Airtable, Trello, ClickUp, Asana, and Notion real calls feature-flagged.
- Store secrets only through encrypted references or env vars.
- Redact payloads and prevent raw files/unapproved delivery links/secrets/private notes from leaving ListingLift.
- Ensure provider failure creates manual fallback and never blocks paid fulfillment.
- Enforce RBAC, tenant isolation, rate limits, and audit logs server-side.

Run relevant tests/checks. Do not claim success unless commands actually pass. Update `ROADMAP_STATUS.md` with real results.
