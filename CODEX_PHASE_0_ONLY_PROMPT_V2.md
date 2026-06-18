# CODEX_PHASE_0_ONLY_PROMPT_V2.md

You are Codex implementing **ListingLift**.

Your task is **Phase 0 only: Repository Initialization**.

Use these files as authority:

- `ARCHITECTURE.md`
- `BUILD_ROADMAP.md`
- `ROADMAP_STATUS.md`
- `AGENTS.md`
- `SECURITY.md`
- `ENVIRONMENT.md`
- `TESTING.md`
- `PHASE_0_EXECUTION_RUNBOOK.md`
- `PHASE_0_REPO_SCAFFOLD_SPEC.md`
- `PHASE_0_VERIFICATION_MATRIX.md`

If `ListingLift.md` and `ListingLift_BUILD_ROADMAP.md` exist, preserve them and normalize them into canonical docs if canonical docs are missing or incomplete.

## Required Starting Report

Before editing, report:

1. Current roadmap phase: Phase 0 — Repository Initialization.
2. Current roadmap task.
3. Acceptance criteria being targeted.
4. Files expected to be created or modified.
5. Tests/checks that will be run after the change.

## Implement Only This

Create or normalize a clean, runnable, Replit-compatible TypeScript scaffold with:

- Strict TypeScript.
- Baseline full-stack framework, preferably Next.js unless repo constraints require otherwise.
- Tailwind or equivalent utility-first styling support.
- Zod environment validation.
- `.env.example` with fake placeholders only.
- Health endpoint with safe JSON only.
- Placeholder ListingLift landing page using marketplace-safe language.
- Baseline scripts.
- Baseline tests where practical.
- Canonical docs present.
- `ROADMAP_STATUS.md` updated.

## Do Not Implement

Do not implement:

- Auth.
- User accounts.
- Tenant/RBAC logic.
- Database business schema.
- Package/pricing data records.
- Uploads.
- Delivery links.
- Image processing.
- Admin/client/agency dashboards.
- Stripe/Gumroad/payment logic.
- Sales-channel adapters.
- Marketplace integrations.
- File storage integrations.
- Automation integrations.
- Reports or upsells.
- Phase 1+ UI shell components beyond a simple landing placeholder.

## Required Commands

Run these or document exactly why each cannot run:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run smoke
npm run verify-env
npm run security-check
```

## Required End Report

End with:

```md
## Phase 0 Completion Report

### Phase
Phase 0 — Repository Initialization

### Summary

### Files Created/Modified

### Tests/Checks Run

### Test Results

### Failures or Blockers

### ROADMAP_STATUS.md Updated

### Commit

### Next Phase
Phase 1 — Design System and UI Shell

### Stop Point
Stopping here. Phase 1 has not been started.
```

## Commit Rule

If git is available, commit with:

```bash
git add .
git commit -m "phase-0: initialize repository scaffold"
```

If git is unavailable, add this to `ROADMAP_STATUS.md`:

```md
- phase-0: initialize repository scaffold — Git unavailable; commit-style checkpoint recorded in ROADMAP_STATUS.md.
```

Stop after Phase 0. Do not begin Phase 1.
