You are Codex implementing ListingLift from `ListingLift_Repo_Seed_v14.zip`.

Start by inspecting the current repository. Preserve all user changes. Stitch the v14 seed carefully.

Current seed coverage: Phase 0 through Phase 12 scaffolds.

Focus of this package: Phase 12 — Smart Naming, Folder Generation, Manifest, and ZIP.

Required actions:

1. Inspect repo structure and package manager.
2. Apply/stitch v14 files without blind overwrites.
3. Validate Prisma schema and regenerate Phase 12 migration SQL.
4. Generate Prisma client and apply migrations.
5. Run seed twice and fix idempotency issues.
6. Connect delivery archive routes to tenant-scoped Prisma queries and storage.
7. Ensure ZIP generation uses processed outputs only and never overwrites originals.
8. Persist DeliveryArchive and DeliveryArchiveFile rows transactionally.
9. Add audit logs for archive plan, ZIP, manifest, ReadMe, and archive failures.
10. Verify client-facing downloads remain hidden until admin approval and delivery visibility gates pass.
11. Run relevant unit, security, integration, E2E, typecheck, lint, and build checks.
12. Update ROADMAP_STATUS.md with actual command results.

Do not mark Phase 12 complete unless all acceptance criteria pass. Do not advance to Phase 13 until the checkpoint is clean or documented.
