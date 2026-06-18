# Phase 15 Execution Runbook — Manual Approval and Revision Workflow

1. Validate Prisma schema and regenerate the migration.
2. Apply migrations in a safe development database.
3. Generate Prisma client.
4. Run seed twice and confirm idempotency.
5. Replace dry-run approval and revision route payloads with tenant-scoped Prisma lookups.
6. Persist `ManualApprovalGate`, `ManualApprovalEvent`, and `RevisionWorkflowEvent` transactionally.
7. Enforce `review:outputs`, `approve:outputs`, `request:revisions`, and `manage:jobs` permissions server-side.
8. Confirm unresolved blocking flags, open revisions, and missing manual replacements block approval.
9. Confirm approval does not create public delivery links.
10. Run unit, integration, security, E2E, typecheck, lint, and build checks.
