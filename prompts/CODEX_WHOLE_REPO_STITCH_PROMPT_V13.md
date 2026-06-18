# CODEX_WHOLE_REPO_STITCH_PROMPT_V13.md

You are Codex implementing ListingLift from `ListingLift_Repo_Seed_v13.zip`.

Start by inspecting the existing repository. Preserve user changes and stitch the seed carefully.

Current seed coverage: Phase 0 through Phase 11 scaffolds are present. Do not mark any phase complete until real checks pass.

Your immediate implementation focus is to verify and wire Phase 11 — Core Image Processing Pipeline.

Required behavior:

- Follow `ARCHITECTURE.md`, `BUILD_ROADMAP.md`, `ROADMAP_STATUS.md`, and `CODEX_GAPS.md`.
- Run real commands; do not invent test results.
- Regenerate Prisma migrations as needed.
- Keep original uploads immutable.
- Store outputs as separate processed records/files.
- Keep final downloads hidden until admin approval.
- Keep real providers feature-flagged and optional.
- Use mock provider by default.
- Persist per-image errors and manual fallback decisions.
- Enforce auth, RBAC, and tenant isolation server-side.
- Update `ROADMAP_STATUS.md` after each major block.

Run at minimum:

```bash
npm install
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run test:unit -- image-processing
npm run test:integration -- phase11
npm run test:security -- image-processing
npm run test:e2e -- admin-processing
npm run typecheck
npm run lint
npm run build
```

Stop at a clean checkpoint and document all failures or deviations in `ROADMAP_STATUS.md` and `CODEX_GAPS.md`.
