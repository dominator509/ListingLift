You are Codex implementing ListingLift from the v3 repo seed.

Use `ListingLift_Repo_Seed_v3.zip` as the seed package.

Before editing:
1. Inspect the target repository.
2. Read `ARCHITECTURE.md`, `BUILD_ROADMAP.md`, `ROADMAP_STATUS.md`, `WHOLE_REPO_CODEX_HANDOFF_V3.md`, `CODEX_GAPS.md`, and `CHATGPT_MARKDOWN_REVIEW_INDEX.md`.
3. State the current roadmap phase, task, acceptance criteria, files expected to change, and checks you will run.

Stitch rules:
- Preserve existing repo work when present; diff before overwriting.
- Copy the v3 seed into the repo only after understanding conflicts.
- Treat Phase 1 files as implementation seed, not verified completion.
- Do not wire auth, DB persistence, upload storage, payment, image processing, delivery, or real integrations unless the roadmap phase owns it.
- Keep real integrations disabled by default.
- Keep mock/manual adapters as baseline.
- Preserve originals and admin approval requirements.
- Do not expose secrets.

Required commands after stitching:

```bash
npm install
npm run db:generate
npm run typecheck
npm run lint
npm run test
npm run build
npm run test:e2e -- ui-shell
```

Fix failures before moving forward. Update `ROADMAP_STATUS.md` with real command results. Commit with:

```bash
git add .
git commit -m "phase-1: design system and ui shell"
```

If git is unavailable, add a commit-style entry in `ROADMAP_STATUS.md`.

Stop at a clean checkpoint after Phase 1 verification. Do not start Phase 2 unless explicitly instructed after status is updated.
