# PHASE_13_VERIFICATION_MATRIX.md — Preview Gallery and Before/After

| Area | Check | Owner |
|---|---|---|
| Schema | `prisma validate` passes after preview models are added | Codex |
| Migration | Migration applies cleanly to target Postgres | Codex |
| Seed | Seed can run twice without duplicate preview records | Codex |
| Admin gallery | Admin sees ready, approved, flagged, failed, and rejected outputs | Codex |
| Client gallery | Client sees approved client-visible previews only | Codex |
| Before/after | Original image groups with processed outputs by image ID | Codex |
| Bulk approval | Only ready-for-review outputs are bulk-approvable | Codex |
| Security | Tenant/job/client scoping enforced server-side | Codex |
| Security | Failed/flagged outputs never leak to client preview view | Codex |
| Claims | No marketplace approval/ranking/sales/conversion guarantee language | Codex |
| Runtime | `/admin/previews`, `/admin/jobs/[jobId]/preview`, `/client/jobs/[jobId]/preview` render | Codex |
| Tests | Phase 13 unit, integration, security, E2E, typecheck, lint, build checks run | Codex |

## Commands Codex Should Run

```bash
npm run db:validate
npm run db:generate
npm run test:unit -- preview
npm run test:integration -- previews
npm run test:security -- preview
npm run test:e2e -- preview-gallery
npm run typecheck
npm run lint
npm run build
```
