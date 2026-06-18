# CODEX_WHOLE_REPO_STITCH_PROMPT_V10.md

You are Codex implementing ListingLift from `ListingLift_Repo_Seed_v10.zip`.

## Current Focus

Phase 8 — Direct Upload and File Intake

## Required First Actions

1. Read `ARCHITECTURE.md`, `BUILD_ROADMAP.md`, `ROADMAP_STATUS.md`, `CODEX_GAPS.md`, `WHOLE_REPO_CODEX_HANDOFF_V10.md`, `PHASE_8_EXECUTION_RUNBOOK.md`, and `PHASE_8_VERIFICATION_MATRIX.md`.
2. State the current roadmap phase, task, acceptance criteria, expected files, and tests/checks.
3. Stitch the v10 seed into the repository without deleting working runtime fixes.
4. Validate Prisma and TypeScript.
5. Connect the Phase 8 dry-run contracts to real persistence/storage where practical.
6. Run the required tests/checks.
7. Update `ROADMAP_STATUS.md` with real results.

## Guardrails

- Do not skip upload security checks.
- Do not store plaintext upload tokens.
- Do not trust client-submitted org/client/job IDs in public upload routes.
- Do not overwrite originals.
- Do not extract ZIP files before path and type validation.
- Do not expose final delivery after upload.
- Keep real storage/integration providers feature-flagged or mocked by default.

## Required Checks

```bash
npm install
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run test:unit -- upload-validation-service
npm run test:unit -- upload-token-service
npm run test:unit -- upload-intake-service
npm run test:security -- zip-safety-service
npm run test:security -- upload-file-rejection
npm run test:integration -- phase8-upload-route-contract
npm run test:e2e -- upload-flow
npm run typecheck
npm run lint
npm run build
```

Stop at a clean checkpoint after Phase 8 verification or after documenting blockers.
