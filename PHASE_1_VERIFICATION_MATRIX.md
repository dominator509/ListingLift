# PHASE_1_VERIFICATION_MATRIX.md

| Requirement | Seeded Artifact | Codex Verification |
|---|---|---|
| Public shell renders | `src/components/layout/public-shell.tsx`, public pages | `npm run build`, Playwright public shell test |
| Auth shell renders | `src/components/layout/auth-shell.tsx`, login/signup pages | Route render check |
| Admin shell renders | `src/app/admin/layout.tsx`, `src/components/layout/app-shell.tsx` | `/admin` route check |
| Client shell renders | `src/app/client/layout.tsx` | `/client` route check |
| Agency shell renders | `src/app/agency/layout.tsx` | `/agency` route check |
| Navigation exists | `src/config/navigation.ts` | `tests/unit/ui-shell-contract.test.ts` |
| UI primitives exist | `src/components/ui/*` | Typecheck/import verification |
| Upload UI exists | `src/components/workflow/upload-dropzone.tsx` | Typecheck/render verification |
| Gallery components exist | `preview-gallery`, `image-card`, `before-after-card` | Typecheck/render verification |
| Job/source badges exist | `job-status-badge`, `source-channel-badge` | Unit contract test |
| Loading state exists | `skeleton.tsx` | Typecheck/import verification |
| Empty state exists | `empty-state.tsx` | DataTable empty render behavior |
| Error state exists | `error-state.tsx` | Typecheck/import verification |
| No upload logic implemented | Component code only | Manual review |
| No secrets exposed | No env values in UI | Static grep/build review |

## Required Commands

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run test:e2e -- ui-shell
```
