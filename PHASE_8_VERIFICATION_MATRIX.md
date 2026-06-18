# PHASE_8_VERIFICATION_MATRIX.md

| Area | Verification | Required Result |
|---|---|---|
| Token issuing | Public token returned once, token hash persisted | Public token is never stored |
| Token resolving | Expired, used, revoked, and mismatched tokens rejected | Public upload link is scoped and safe |
| Direct image upload | JPG, PNG, WebP accepted within limits | Image rows created with immutable storage keys |
| Unsafe file rejection | EXE, JS, SH, HTML, SVG, traversal names rejected | Unsafe files never reach storage |
| ZIP safety | Absolute paths, `../`, nested archives, executables rejected | ZIP slip protection passes |
| Package allowance | Accepted image count cannot exceed package allowance | Over-limit upload rejected or requires admin override |
| Upload history | UploadBatch and UploadEvent rows created | Admin/client history is auditable |
| Admin fallback | Manual upload requires `manage:jobs` or approved role | Sensitive manual action audited |
| Originals | Original files preserved separately | Originals are never overwritten |
| Job status | Upload success updates job upload status | Job enters upload-received path only after persisted upload |
| UI | `/upload/[token]` and `/admin/uploads` render | Clear client/admin upload shell |
| Tests | Unit/security/integration/E2E/checks | All pass before Phase 8 completion |

## Commands Codex Must Run

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
