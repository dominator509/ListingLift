# Whole Repo Codex Handoff V18 — ListingLift

## Current Seed Version

ListingLift Repo Seed v18

## Current Prepared Phase

Phase 16 — Delivery and Email Notifications

## What ChatGPT Added

- Delivery notification domain and schemas.
- Mock-first email adapter registry.
- Delivery link issue/resolve/download-tracking services.
- Delivery email preview and marketplace delivery message services.
- Delivery send orchestrator dry-run.
- Public delivery download page and admin notification/send UI shells.
- Delivery/token/send/notification API route contracts.
- Prisma schema and migration scaffold for notification logs and download events.
- Phase 16 tests and docs.
- Updated `CODEX_GAPS.md`, `ROADMAP_STATUS.md`, manifest, and stitch prompt.

## Critical Guardrails

- Store only hashed delivery tokens.
- Never log raw delivery tokens or SMTP secrets.
- Do not expose downloads until manual approval, approved archive, active token, expiry, and scope gates pass.
- Use mock email by default.
- Keep SMTP and all real sends feature-flagged.
- Marketplace delivery messages are copyable drafts only and must comply with platform workflow rules.

## Codex First Action

Unzip `ListingLift_Repo_Seed_v18.zip`, inspect the repository, compare with existing files, then stitch these changes carefully. Run Prisma validation, migrations, seed, typecheck, lint, tests, and build. Update `ROADMAP_STATUS.md` with real results.
