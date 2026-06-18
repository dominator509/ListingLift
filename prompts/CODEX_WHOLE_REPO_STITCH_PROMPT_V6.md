You are Codex implementing ListingLift from `ListingLift_Repo_Seed_v6.zip`.

Start by reading:

- `ARCHITECTURE.md`
- `BUILD_ROADMAP.md`
- `ROADMAP_STATUS.md`
- `CODEX_GAPS.md`
- `WHOLE_REPO_CODEX_HANDOFF_V6.md`
- `PHASE_4_EXECUTION_RUNBOOK.md`
- `PHASE_4_VERIFICATION_MATRIX.md`

Current seeded phase: Phase 4 — Tenant, Client, RBAC, and Agency Model.

Before editing, state:

1. Current roadmap phase.
2. Current roadmap task.
3. Acceptance criteria being targeted.
4. Files expected to be created or modified.
5. Tests/checks that will be run after the change.

Stitch the v6 seed into the actual repository without overwriting user changes blindly.

Required work:

1. Install dependencies.
2. Validate Prisma schema.
3. Generate Prisma client.
4. Regenerate or repair Phase 4 migration if needed.
5. Apply migrations.
6. Run seed twice.
7. Verify extended session scope.
8. Connect Phase 4 placeholder routes to Prisma safely.
9. Enforce RBAC and tenant/client/agency scoping server-side.
10. Add audit logs for team and agency branding mutations.
11. Run tests:

```bash
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run test:unit -- rbac
npm run test:security -- tenant role-escalation client-access
npm run test:integration -- phase4
npm run typecheck
npm run lint
npm run build
```

Do not proceed to Phase 5 until Phase 4 is either complete or blockers are documented in `ROADMAP_STATUS.md` and `CODEX_GAPS.md`.

Never claim tests passed unless they actually passed. Never expose secrets. Never skip tenant isolation, RBAC, or approval-gate checks.
