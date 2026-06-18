# FIRST_CODEX_PROMPT.md

You are Codex implementing ListingLift.

Start Phase 0 only: Repository Initialization.

Before editing, inspect the repository and identify:

1. Existing files.
2. Existing framework, if any.
3. Package manager.
4. Available scripts.
5. Existing docs.
6. Constraints or conflicts.

Source-of-truth files:

- `ListingLift.md`, if present, must be normalized into `ARCHITECTURE.md`.
- `ListingLift_BUILD_ROADMAP.md`, if present, must be normalized into `BUILD_ROADMAP.md`.
- If canonical docs already exist, preserve and reconcile them instead of overwriting blindly.

Phase 0 goals:

1. Create or normalize a clean TypeScript project scaffold.
2. Add required canonical docs.
3. Add `.env.example` with fake placeholders only.
4. Add environment validation scaffold.
5. Add a health endpoint.
6. Add baseline scripts.
7. Add starter tests for environment validation and health endpoint where practical.
8. Update `ROADMAP_STATUS.md`.
9. Run relevant checks.
10. Stop after Phase 0.

Do not implement Phase 1+ features.
Do not add auth, database schema, payments, uploads, dashboards, image pipeline, sales-channel logic, or real integrations yet.
Do not claim tests passed unless actually run.
Do not require paid APIs for baseline operation.
Do not expose or commit secrets.

Before making changes, report:

1. Current roadmap phase.
2. Current roadmap task.
3. Acceptance criteria being targeted.
4. Files expected to be created or modified.
5. Tests/checks that will be run after the change.

After changes:

1. Update `ROADMAP_STATUS.md`.
2. Run relevant tests/checks.
3. Report pass/fail results honestly.
4. Fix failures before marking Phase 0 complete.
5. Commit with message `phase-0: initialize repository scaffold` if git is available.
6. If git is unavailable, add that commit-style entry to `ROADMAP_STATUS.md`.
