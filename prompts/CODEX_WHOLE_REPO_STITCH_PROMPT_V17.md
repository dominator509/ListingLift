You are Codex stitching ListingLift Repo Seed v17 into the real repository.

Current advanced seed phase: Phase 15 — Manual Approval and Revision Workflow.

Before editing:
1. Inspect the repository.
2. Read ARCHITECTURE.md, BUILD_ROADMAP.md, ROADMAP_STATUS.md, CODEX_GAPS.md, WHOLE_REPO_CODEX_HANDOFF_V17.md, and PHASE_15_* docs.
3. State the current phase, current task, acceptance criteria, expected files, and checks.

Implement/stitch only in roadmap order. Earlier phases may still need runtime repair; do not mark them complete without running checks.

For Phase 15:
- Wire manual approval and revision routes to Prisma transactions.
- Enforce RBAC and tenant/client/job scope server-side.
- Persist ManualApprovalGate, ManualApprovalEvent, RevisionWorkflowEvent, RevisionRequest, ProcessedFile, Job, and AuditLog changes safely.
- Do not expose delivery links after approval.
- Block approval when QC blockers, open revisions, or missing manual replacements remain.
- Preserve originals.
- Audit every sensitive mutation.

Run relevant tests/checks and update ROADMAP_STATUS.md with real results. Do not fake test results.
