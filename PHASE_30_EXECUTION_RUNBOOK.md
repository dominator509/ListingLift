# PHASE_30_EXECUTION_RUNBOOK.md

## Before implementation

Codex must state current roadmap phase, target task, acceptance criteria, expected files, and tests/checks before editing.

## Implementation steps

1. Validate the v32 seed against existing repo code.
2. Merge task-notification provider domain and schema files.
3. Wire adapters through an adapter registry.
4. Connect dry-run routes to tenant-scoped Prisma transactions.
5. Store provider credentials only through encrypted secret references or env vars.
6. Add audit logs to every connection, dispatch, export, task, failure, retry, and manual fallback.
7. Keep all real providers behind provider-specific and global integration flags.
8. Run tests/checks and update `ROADMAP_STATUS.md` with real results.

## Stop conditions

Stop and fix before proceeding if secrets are exposed, client files are exported, tenant isolation fails, RBAC fails, or any real integration call can occur without feature flags.
