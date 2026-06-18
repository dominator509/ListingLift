# Social Commerce Phase 26 Gap Handoff

## Gaps Codex Must Close
- Validate Prisma schema and migration.
- Persist channel mappings and workflow events.
- Convert dry-run routes into tenant-scoped transactional mutations.
- Enforce RBAC server-side.
- Add audit logs for source intake, mapping, creative plan generation, delivery-template generation, revision status changes, export planning, and safety checks.
- Verify delivery templates use approved archives only.
- Confirm external links are allowed per social source and customer context.
- Run all tests and fix failures.

## Safety Gaps
Codex must prove that no code scrapes private social pages, stores social passwords, automates DMs/comments/posts/uploads, buys engagement, or guarantees social results.
