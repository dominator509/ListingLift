# CODEX_WHOLE_REPO_STITCH_PROMPT_V26.md

You are Codex implementing ListingLift from Repo Seed v26.

Start by reading:

- `ARCHITECTURE.md`
- `BUILD_ROADMAP.md`
- `ROADMAP_STATUS.md`
- `CODEX_GAPS.md`
- `WHOLE_REPO_CODEX_HANDOFF_V26.md`
- `PHASE_24_EXECUTION_RUNBOOK.md`
- `PHASE_24_VERIFICATION_MATRIX.md`

Current seeded phase: Phase 24 — Etsy Workflow.

Your job:

1. Stitch the v26 seed into the real repository without overwriting working code blindly.
2. Validate and repair TypeScript and Prisma issues.
3. Regenerate/apply migrations.
4. Wire Etsy dry-run route contracts to real service-layer transactions where appropriate.
5. Enforce RBAC, tenant isolation, audit logs, dedupe, and marketplace safety.
6. Run tests/checks.
7. Update `ROADMAP_STATUS.md` with real results.

Do not claim production readiness unless checks actually pass.
Do not expose secrets.
Do not use real Etsy APIs unless feature flags and credentials are explicitly configured.
Do not scrape Etsy or automate buyer messages/listing edits outside approved integration paths.
