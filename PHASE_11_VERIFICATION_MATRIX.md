# PHASE_11_VERIFICATION_MATRIX.md — Core Image Processing Pipeline

| Requirement | Seeded in ChatGPT | Codex Verification Required |
|---|---:|---:|
| Queue-based processing pipeline | Yes, contract/draft | Yes, real DB + queue/runtime |
| Background removal step | Yes, provider-adapter call | Yes, provider/mock runtime |
| Transparent PNG generation | Yes, output plan | Yes, file transform/write |
| White JPG generation | Yes, output plan | Yes, file transform/write |
| WebP generation | Yes, output plan | Yes, Sharp/equivalent runtime |
| Resize step | Yes, transform plan | Yes, real dimensions |
| Compression step | Yes, transform plan | Yes, file-size checks |
| Preset output generation | Yes | Yes, DB-driven presets and folders |
| Per-image error handling | Yes, error drafts | Yes, persisted records and retry flow |
| Originals preserved | Yes, service guard | Yes, storage-level protection |
| Mock provider requires no paid keys | Yes | Yes, runtime test |
| Real providers feature-flagged | Yes via Phase 10 | Yes, runtime test |
| Admin processing UI shell | Yes | Yes, browser check |
| Tenant isolation | Contract only | Required before completion |
| Audit logs | Documented | Required before completion |

## Minimum Passing Evidence

- Prisma validation and generated migration pass.
- Seed runs twice without duplicate errors.
- A demo uploaded image produces configured output records.
- Output storage keys differ from original storage keys.
- At least one provider failure creates an `ImageProcessingError` and keeps other outputs independent.
- Processed files remain `READY_FOR_REVIEW`/`PENDING` and do not become client-downloadable.
