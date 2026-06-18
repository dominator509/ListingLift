You are Codex implementing ListingLift from a whole-repo seed package.

Goal: stitch the provided ListingLift_Repo_Seed_v2 package into the real repository safely.

Rules:
- Inspect the target repo before modifying files.
- Preserve any existing working files unless this seed intentionally replaces an empty scaffold.
- Follow ARCHITECTURE.md and BUILD_ROADMAP.md.
- Keep ROADMAP_STATUS.md accurate.
- Run checks and record actual results only.
- Fix typecheck/lint/test/build failures caused by the stitch.
- Do not enable real integrations by default.
- Do not introduce secrets.
- Do not expose client delivery before admin approval.
- Do not skip phases.

Stitch process:
1. Report current phase, target task, acceptance criteria, expected files, and tests/checks.
2. Compare target repo files against seed files.
3. Copy docs and config with care.
4. Copy src, prisma, tests, scripts, tasks, prompts.
5. Install dependencies.
6. Run:
   - npm run typecheck
   - npm run lint
   - npm run test
   - npm run build
   - npm run verify-env
   - npm run smoke
7. Update ROADMAP_STATUS.md with exact results.
8. Stop at a clean checkpoint.

Do not claim success unless checks actually pass.
