You are Codex implementing ListingLift.

Use `ListingLift_Repo_Seed_v30.zip` as the latest repo seed.

Current prepared phase: Phase 28 — File Storage Integrations.

Before editing, state:
1. Current roadmap phase.
2. Current task.
3. Acceptance criteria being targeted.
4. Files expected to be created or modified.
5. Tests/checks that will be run after the change.

Then:
1. Stitch the v30 files into the repository.
2. Preserve existing correct implementation where present.
3. Validate Prisma schema and regenerate/repair the Phase 28 migration.
4. Generate Prisma client.
5. Wire file storage routes to real Prisma transactions, RBAC, tenant isolation, encrypted secret references, and audit logs.
6. Implement or verify mock/local storage baseline without third-party APIs.
7. Keep Google Drive and Dropbox disabled unless `REAL_INTEGRATIONS_ENABLED` plus provider-specific flags and encrypted secrets are configured.
8. Ensure original uploads cannot be overwritten.
9. Ensure client-facing downloads require approval, tenant scope, client scope, job scope, and delivery/archive permission.
10. Run relevant tests: unit, security, integration, E2E smoke, typecheck, lint, build, Prisma validate, migration, and seed.
11. Fix failures before moving on.
12. Update `ROADMAP_STATUS.md` with real results.

Do not expose secrets. Do not create permanent public links. Do not skip manual fallback. Do not mark Phase 28 complete until acceptance criteria and checks pass.
