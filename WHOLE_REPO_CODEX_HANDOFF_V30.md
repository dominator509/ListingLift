# Whole Repo Codex Handoff V30

## Current Package

`ListingLift_Repo_Seed_v30.zip`

## Latest Phase Prepared

Phase 28 — File Storage Integrations.

## What Changed

- Added file storage domain registry and security rules.
- Added Zod schemas for connection, access, folder import, and delivery export planning.
- Added file-storage adapter contracts.
- Added local, mock, Google Drive, and Dropbox adapter scaffolds.
- Added services for policy, connections, access, folder import, delivery export, health, and audit planning.
- Added API route contracts under `/api/file-storage/*`.
- Added admin pages and reusable components under `/admin/file-storage/*`.
- Added Prisma model scaffolds and migration notes.
- Added Phase 28 docs, tests, and verification matrix.

## Codex Priority

1. Stitch files.
2. Validate Prisma schema and repair migration.
3. Wire storage routes to Prisma, RBAC, encrypted secrets, storage adapters, and audit logs.
4. Keep mock/local baseline functional without third-party APIs.
5. Keep Google Drive/Dropbox disabled unless feature flags and encrypted secret references exist.
6. Run checks and update `ROADMAP_STATUS.md` with real results.

## Stop Conditions

Stop and fix immediately if storage routes can expose secrets, overwrite originals, bypass tenant scope, bypass delivery approval, or create permanent public links.
