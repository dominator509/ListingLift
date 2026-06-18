# Phase 16 Execution Runbook — Delivery and Email Notifications

## Before implementation

Codex must state:

1. Current roadmap phase: Phase 16 — Delivery and Email Notifications.
2. Current task.
3. Acceptance criteria being targeted.
4. Files expected to change.
5. Tests/checks that will run.

## Required implementation sequence

1. Validate and repair Prisma schema/migration.
2. Generate Prisma client.
3. Apply migration.
4. Run seed twice.
5. Wire delivery link issue route to tenant-scoped job/archive lookup.
6. Persist delivery tokens as hashes only.
7. Implement delivery token resolution by hash.
8. Implement delivery download access checks.
9. Stream or redirect ZIP downloads through safe storage adapter.
10. Record delivery download events and audit logs.
11. Implement mock email send flow and optional SMTP adapter behind flags.
12. Persist notification logs.
13. Add marketplace delivery copy generation to admin flow.
14. Verify public delivery page, admin send page, and notification page.
15. Run all required checks.
16. Update `ROADMAP_STATUS.md` with real results.

## Stop conditions

Stop and fix before moving forward if delivery tokens are logged raw, client downloads are exposed before approval, token expiry fails, tenant isolation fails, or notification secrets leak.
