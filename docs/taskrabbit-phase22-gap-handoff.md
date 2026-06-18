# Taskrabbit Phase 22 Gap Handoff

ChatGPT Project Mode prepared Taskrabbit workflow code, schemas, dry-run APIs, UI shells, Prisma schema additions, migration scaffold, and tests. Codex must complete runtime integration.

## Codex-owned gaps

- Validate Prisma schema.
- Regenerate or repair Phase 22 migration SQL.
- Generate Prisma client.
- Apply migrations.
- Run seed twice.
- Seed Taskrabbit service mappings idempotently with fake task IDs only.
- Connect `/api/taskrabbit/manual-task` to real tenant-scoped Prisma transactions.
- Create or match Client records from Taskrabbit customer/business fields without storing unnecessary private data.
- Create ExternalOrder with channel `Taskrabbit`, dedupe by task ID, and preserve revenue attribution.
- Create Job, initial JobStatusEvent, optional UploadToken, TaskrabbitWorkflowEvent, and AuditLog transactionally.
- Store task ID, customer, category, appointment/deadline, value, and conversion status.
- Track direct-retainer conversion status without violating platform rules or customer consent boundaries.
- Ensure delivery copy never exposes unapproved, flagged, failed, rejected, pending, or admin-only files.
- Record manual Taskrabbit delivery completion without automated messaging unless an approved integration exists.
- Confirm whether external links are permitted for each Taskrabbit task context.
- Avoid storing full addresses unless absolutely required; prefer city/area notes.
- Verify no code scrapes private Taskrabbit pages, stores passwords, or automates messages/bookings/cancellations.
- Verify `/admin/taskrabbit`, `/admin/taskrabbit/task-intake`, `/admin/taskrabbit/delivery`, and `/admin/taskrabbit/conversions` render in browser.
- Run Phase 22 unit, security, integration, E2E, typecheck, lint, build, Prisma validate, and seed checks.
