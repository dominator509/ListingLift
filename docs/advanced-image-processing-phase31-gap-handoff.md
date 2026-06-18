# Phase 31 Gap Handoff — Advanced Image Processing

## ChatGPT-coded scope

This seed includes domain constants, schemas, service planners, route contracts, admin UI shells, Prisma scaffolds, tests, and documentation for advanced image processing.

## Codex-only gaps

Codex must:

1. Validate and repair Prisma schema relations.
2. Regenerate migration SQL with the installed Prisma version.
3. Generate Prisma client.
4. Apply migrations.
5. Run seed twice.
6. Wire route contracts to authenticated, tenant-scoped Prisma transactions.
7. Read input images from the configured file-storage adapter.
8. Write advanced outputs as new storage objects only.
9. Persist advanced run/report records.
10. Create `ProcessedFile` rows for image outputs.
11. Create report records for quality/sequence recommendations.
12. Keep all outputs hidden until QC and manual approval gates allow access.
13. Keep real AI/model/image-worker calls disabled unless flags are explicitly enabled.
14. Add audit logs for queue, processing, retry, failure, manual fallback, output creation, report creation, and approval handoff.
15. Verify no marketplace, ranking, sales, conversion, ad performance, or approval guarantees appear.
16. Run unit, integration, security, E2E, typecheck, lint, build, Prisma validate, migration, and seed checks.

## Non-negotiable safety gates

- Never overwrite originals.
- Never expose unapproved outputs.
- Never auto-publish or auto-replace external store assets.
- Never require paid APIs for baseline operation.
- Always preserve manual fallback.
