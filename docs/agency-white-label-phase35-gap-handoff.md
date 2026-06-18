# Phase 35 Gap Handoff — Agency White-Label Mode

## ChatGPT-Seeded Artifacts

- Domain, schema, service, UI, API route, Prisma, migration, test, and documentation scaffolds for Phase 35.
- Dry-run agency dashboard data for workspaces, queue, branding, reports, delivery, billing, and team members.
- Safe-copy and access-control guardrail logic.

## Codex-Owned Runtime Work

- Install dependencies and run full verification.
- Validate Prisma and regenerate migration SQL.
- Wire agency routes to real session context, Prisma transactions, audit logs, rate limits, and server-side RBAC.
- Replace dry-run rows with tenant-scoped records.
- Connect branded delivery to approved delivery archives and expiring hashed delivery tokens.
- Connect branded reports to approved report records and privacy filters.
- Connect volume pricing to subscriptions, invoices, credits, payment records, and admin approval.
- Connect team invites to users/memberships with hashed expiring invite tokens.
- Connect bulk queue to jobs/images/processing while preserving originals.

## Security and Privacy Gaps

- Verify agency admins cannot cross tenant boundaries.
- Verify client-scoped users cannot access agency admin routes.
- Verify no secrets, raw provider data, raw webhook payloads, signed URLs, tokens, marketplace credentials, private notes, or unapproved files are exposed.
- Verify branded delivery cannot bypass manual approval, QC gates, delivery-token expiration, download limits, or approved archive checks.
- Verify role assignment cannot escalate privileges.
- Verify no marketplace or performance guarantees exist in copy.
