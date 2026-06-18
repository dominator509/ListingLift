# Upwork Phase 21 Gap Handoff

These gaps are Codex-owned and cannot be completed inside ChatGPT Project Mode.

- Validate Prisma schema and regenerate migration SQL.
- Apply migration and generate Prisma client.
- Seed Upwork mapping/template rows idempotently.
- Wire dry-run APIs to real Prisma transactions.
- Enforce RBAC, tenant isolation, and audit logging.
- Dedupe Upwork contract IDs at the database layer.
- Create or match clients from Upwork contract metadata without storing unnecessary private data.
- Create ExternalOrder, Job, JobStatusEvent, UploadToken, UpworkWorkflowEvent, and AuditLog rows transactionally.
- Connect delivery template generation to approved DeliveryArchive records only.
- Ensure no unapproved/flagged/failed/rejected/pending/admin-only outputs leak into delivery copy or links.
- Record revision status and block job completion while revisions are open.
- Keep retainer reminder as a manual prompt.
- Confirm external link allowance per Upwork contract context.
- Browser-test all Upwork pages.
- Run tests, lint, typecheck, build, Prisma validate, seed, and smoke checks.
