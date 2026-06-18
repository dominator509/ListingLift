# WHOLE_REPO_CODEX_HANDOFF_V32.md

## Summary

This package advances ListingLift to a Phase 30 seed: Slack, email, Google Sheets, Airtable, Trello, ClickUp, Asana, and Notion notification/task/data-export scaffolds.

## Source Review

ChatGPT unzipped the v31 seed and reviewed every Markdown file plus `ListingLift.md` and `ListingLift_BUILD_ROADMAP.md`. See `CHATGPT_MARKDOWN_REVIEW_INDEX_V32.md`.

## What is included

- Domain and Zod schemas for task/notification integrations.
- Adapter registry and provider scaffolds.
- Service planners for alerts, data exports, task creation, health, secrets, and safety.
- API route contracts under `/api/task-notification-integrations/*`.
- Admin UI shells under `/admin/task-notification-integrations/*`.
- Prisma schema scaffolds and migration stub.
- Unit, security, integration, and E2E test scaffolds.
- Updated docs, gaps, roadmap status, and manifest.

## Codex must do next

1. Stitch v32 into the repository.
2. Install dependencies and update lockfile.
3. Validate and repair TypeScript imports.
4. Validate Prisma schema and regenerate migration SQL.
5. Apply migrations and run seed twice.
6. Wire dry-run routes to tenant-scoped Prisma transactions.
7. Implement real provider adapters only behind flags.
8. Enforce RBAC, rate limits, audit logs, and secret redaction.
9. Run all required tests/checks.
10. Update `ROADMAP_STATUS.md` with real command output.

## Non-negotiable rules

- No provider secrets in frontend, logs, JSON responses, tests, seed data, or snapshots.
- No raw files or unapproved delivery links in exports/tasks/notifications.
- Manual fallback must exist for every provider.
- Provider failure must not block fulfillment.
- No marketplace approval/sales/ranking/conversion/ad-performance guarantees.
