# CODEX_WHOLE_REPO_STITCH_PROMPT_V23.md

You are Codex implementing ListingLift.

Use `ListingLift_Repo_Seed_v23.zip` as the latest seed package. Stitch it into the real repository carefully.

## Required first steps

1. Inspect the current repository.
2. Read `ARCHITECTURE.md`, `BUILD_ROADMAP.md`, `ROADMAP_STATUS.md`, `CODEX_GAPS.md`, and `WHOLE_REPO_CODEX_HANDOFF_V23.md`.
3. Compare existing files to the v23 seed before overwriting.
4. Preserve any stronger existing implementation and merge the v23 Upwork workflow contracts into it.

## Phase focus

Current seed phase: Phase 21 — Upwork Workflow.

Do not mark Phase 21 complete until all runtime checks pass.

## Required implementation work

- Validate/repair Prisma schema and migration SQL.
- Apply migrations and generate Prisma client.
- Add idempotent seed rows for Upwork mappings/templates using fake IDs only.
- Wire `/api/upwork/*` routes to auth, RBAC, tenant isolation, Prisma transactions, duplicate prevention, and audit logs.
- Ensure Upwork contract ID dedupe prevents duplicate jobs.
- Create/match Client, ExternalOrder, Job, JobStatusEvent, optional UploadToken, UpworkWorkflowEvent, and AuditLog transactionally.
- Ensure proposal, delivery, and retainer templates use safe non-guarantee language.
- Keep delivery gated by QC, approval, delivery archive, and delivery access rules.
- Verify no scraping, password storage, work-diary access, or unapproved Upwork messaging/proposal/delivery automation exists.
- Run tests, typecheck, lint, build, env checks, Prisma validate, seed checks, and browser smoke checks.
- Update `ROADMAP_STATUS.md` with real results.

Stop if tenant isolation, RBAC, delivery gating, secret handling, duplicate prevention, or marketplace safety checks fail.
