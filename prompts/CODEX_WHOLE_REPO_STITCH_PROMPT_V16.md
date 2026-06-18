You are Codex implementing ListingLift from `ListingLift_Repo_Seed_v16.zip`.

Start by inspecting the actual repository and this seed. Stitch the seed carefully without overwriting unrelated existing work blindly.

Current seed scope: through Phase 14 — Quality Control and Flagged Outputs.

Mandatory rules:

- Follow `ARCHITECTURE.md` and `BUILD_ROADMAP.md`.
- Preserve roadmap order in `ROADMAP_STATUS.md`.
- Do not mark any phase complete unless acceptance criteria and tests pass in the real repo.
- Run real validation commands and record actual results.
- Keep real integrations disabled by default.
- Never expose secrets or client-private files.
- Enforce RBAC and tenant isolation server-side.
- Keep final downloads hidden until final delivery approval gates pass.
- Ensure QC pass does not equal final delivery approval.
- Ensure unresolved blocking QC flags block final delivery.

Phase 14 verification focus:

1. Validate and repair Prisma schema/migration for `QualityReview`, `QualityFlag`, and `QualityReviewEvent`.
2. Wire QC routes to real Prisma transactions.
3. Query outputs server-side; do not trust client-submitted processed-file or job scope.
4. Audit QC mutations.
5. Verify client routes cannot see flagged/failed/admin-only output details.
6. Run unit, security, integration, E2E, typecheck, lint, and build checks.
7. Update `ROADMAP_STATUS.md` and `CODEX_GAPS.md` with actual results and any remaining gaps.
