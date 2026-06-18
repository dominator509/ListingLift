# PHASE_0_EXECUTION_RUNBOOK.md

## Purpose

This runbook gives Codex a strict, implementation-ready sequence for completing **Phase 0 — Repository Initialization** only.

Phase 0 establishes the repository foundation for ListingLift. It must not implement product features, authentication, dashboards, uploads, payments, image processing, sales-channel integrations, or database business schema beyond the minimum scaffold required by the chosen framework/tooling.

---

## Phase 0 Boundary

### Allowed

- Inspect the repository.
- Identify existing framework/package manager constraints.
- Create or normalize canonical docs.
- Create a clean TypeScript full-stack scaffold.
- Add strict TypeScript configuration.
- Add Tailwind or equivalent UI styling support.
- Add baseline lint/format tooling.
- Add Vitest setup.
- Add Playwright setup if practical.
- Add environment validation scaffold.
- Add `.env.example` with fake placeholders only.
- Add `/api/health` or framework-equivalent health route.
- Add a placeholder public landing page.
- Add initial tests for environment validation and health endpoint where practical.
- Add package scripts.
- Update `ROADMAP_STATUS.md`.
- Commit if git is available.

### Forbidden

- Do not implement auth.
- Do not implement tenant/RBAC logic.
- Do not implement Prisma production schema beyond placeholder setup.
- Do not implement dashboards.
- Do not implement uploads or delivery links.
- Do not implement image processing.
- Do not implement packages/pricing as app data yet.
- Do not implement Stripe, Gumroad, or marketplace integrations.
- Do not add real API calls.
- Do not add secrets.
- Do not claim tests passed without running them.
- Do not move to Phase 1.

---

## Required Pre-Change Statement

Before editing, Codex must state:

```md
Current roadmap phase: Phase 0 — Repository Initialization
Current roadmap task: Repository inspection and bootstrap setup
Acceptance criteria targeted:
- Runnable TypeScript scaffold
- Baseline scripts
- Safe environment validation
- Health endpoint
- Canonical docs present
- ROADMAP_STATUS.md updated
Files expected to be created or modified:
- package.json
- tsconfig.json
- app/framework files as needed
- .env.example
- README.md
- ARCHITECTURE.md
- BUILD_ROADMAP.md
- AGENTS.md
- SECURITY.md
- TESTING.md
- ROADMAP_STATUS.md
- tests as practical
Tests/checks to run:
- npm run typecheck
- npm run lint
- npm run test
- npm run build
- npm run smoke
```

If the repository uses another package manager, translate commands appropriately but keep script names in `package.json` where practical.

---

## Step-by-Step Execution

### Step 1 — Repository Inspection

Codex must inspect:

- Existing file tree.
- Existing `package.json`, lockfiles, config files.
- Existing framework, if any.
- Existing docs.
- Existing tests.
- Existing `.env`, `.env.example`, or ignored secret files.
- Git availability/status.

Codex must not overwrite existing work blindly.

### Step 2 — Framework Decision

Preferred default: **Next.js + TypeScript**.

Use another full-stack TypeScript framework only if the repository already clearly uses one or project constraints require it.

Decision rule:

1. If Next.js already exists, continue with Next.js.
2. If another TypeScript full-stack framework already exists and is working, preserve it.
3. If no app exists, create a clean Next.js TypeScript scaffold.
4. If package installation fails because of environment constraints, use the smallest viable TypeScript scaffold and document the deviation in `ROADMAP_STATUS.md`.

### Step 3 — Baseline Tooling

Install/configure where practical:

- TypeScript strict mode.
- ESLint.
- Prettier.
- Tailwind or equivalent utility-first styling.
- Zod.
- Vitest.
- Playwright where practical.
- Prisma or equivalent typed ORM scaffold only, without implementing business schema.
- Sharp or equivalent if supported; if not supported, document fallback.
- ZIP utility.

### Step 4 — Required Scripts

Add or preserve these scripts where practical:

```json
{
  "scripts": {
    "dev": "...",
    "build": "...",
    "start": "...",
    "typecheck": "...",
    "lint": "...",
    "format": "...",
    "test": "...",
    "test:unit": "...",
    "test:integration": "...",
    "test:e2e": "...",
    "test:security": "...",
    "test:adapter-contract": "...",
    "db:migrate": "...",
    "db:seed": "...",
    "smoke": "...",
    "verify-env": "...",
    "security-check": "..."
  }
}
```

Scripts may be placeholders only when the underlying feature is not yet implemented, but placeholders must fail safely or report `not implemented for current phase` clearly.

### Step 5 — Environment Validation

Create a safe environment validation module using Zod or equivalent.

Required behavior:

- Development/test can run with safe placeholder defaults where appropriate.
- Production must reject missing/weak secrets.
- Real integrations must be disabled by default.
- No secret values may be logged.
- Health endpoint must not expose secrets or config values.

Minimum `.env.example` keys are defined in `ENVIRONMENT.md` and `.env.example`.

### Step 6 — Health Endpoint

Create a health endpoint returning safe JSON only.

Required fields may include:

```json
{
  "ok": true,
  "service": "listinglift",
  "environment": "development",
  "version": "0.0.0",
  "timestamp": "ISO-8601"
}
```

Forbidden:

- No secrets.
- No database URLs.
- No provider keys.
- No full environment dumps.
- No internal stack traces.

### Step 7 — Placeholder Landing Page

Create a minimal public landing page that makes clear this is ListingLift.

Allowed copy:

- Product photo cleanup.
- Marketplace image packs.
- Platform-ready draft image delivery.
- Seller review recommended.

Forbidden copy:

- Guaranteed marketplace approval.
- Guaranteed sales lift.
- Guaranteed ranking improvement.
- Guaranteed conversion increase.

### Step 8 — Canonical Docs

Ensure these root docs exist:

- `ARCHITECTURE.md`
- `BUILD_ROADMAP.md`
- `ROADMAP_STATUS.md`
- `AGENTS.md`
- `SECURITY.md`
- `ENVIRONMENT.md`
- `DEPLOYMENT.md`
- `TESTING.md`
- `API.md`
- `USER_GUIDE.md`
- `ADMIN_GUIDE.md`
- `README.md`
- `CHANGELOG.md`

If source files exist:

- Normalize `ListingLift.md` into `ARCHITECTURE.md`.
- Normalize `ListingLift_BUILD_ROADMAP.md` into `BUILD_ROADMAP.md`.

Do not delete source files unless explicitly instructed.

### Step 9 — Starter Tests

Add tests where practical for:

- Environment validation.
- Health endpoint response shape.
- No secret leakage in health response.
- Landing page smoke route.

Tests must not require real paid API keys.

### Step 10 — Run Checks

Run these, or document why each could not run:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run smoke
npm run verify-env
npm run security-check
```

### Step 11 — Update ROADMAP_STATUS.md

Update:

- Current Phase
- Current Task
- Phase Checklist
- Acceptance Criteria
- Implementation Log
- Files Changed
- Tests/Checks Run
- Test Results
- Known Issues
- Deviations
- Production Readiness Progress
- Commit-Style History

Phase 0 can only be marked complete if acceptance criteria are met.

### Step 12 — Commit or Commit-Style Entry

If git is available:

```bash
git status
git add .
git commit -m "phase-0: initialize repository scaffold"
```

If git is unavailable, add this under `ROADMAP_STATUS.md`:

```md
- phase-0: initialize repository scaffold — Git unavailable; commit-style checkpoint recorded in ROADMAP_STATUS.md.
```

---

## Phase 0 Completion Criteria

Phase 0 is complete only when:

- The app can start locally/Replit-compatible.
- TypeScript is strict.
- Baseline scripts exist.
- Health endpoint exists and does not leak secrets.
- `.env.example` contains placeholders only.
- Real integrations are disabled by default.
- Required docs exist.
- Relevant tests/checks were run or honest blockers were documented.
- `ROADMAP_STATUS.md` is updated.
- No Phase 1+ product features were implemented.

---

## Required Final Report Format

Codex must finish Phase 0 with:

```md
## Phase 0 Completion Report

### Phase
Phase 0 — Repository Initialization

### Summary
[What changed]

### Files Created/Modified
[List]

### Tests/Checks Run
[List commands and results]

### Failures or Blockers
[List or “None”]

### ROADMAP_STATUS.md Updated
Yes/No

### Commit
[Commit hash or commit-style entry]

### Next Phase
Phase 1 — Design System and UI Shell

### Stop Point
Stopping here. Phase 1 has not been started.
```
