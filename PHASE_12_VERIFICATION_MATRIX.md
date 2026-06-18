# PHASE_12_VERIFICATION_MATRIX.md

| Area | Verification | Owner |
|---|---|---|
| Naming | Output names are safe, predictable, include SKU/job/preset context, and avoid unsafe characters | Codex |
| Folder Generation | Folder tree is generated from selected presets and includes required standard folders | Codex |
| ZIP Safety | Relative paths only; reject absolute, drive-letter, empty, `.` and `..` segments | Codex |
| Manifest | Manifest lists archive path, source image, processed file, preset, dimensions, format, status, and seller-review flag | Codex |
| CSV Safety | Formula-leading cells are neutralized | Codex |
| ReadMe | Compliance-safe language avoids marketplace/sales/performance guarantees | Codex |
| Persistence | DeliveryArchive and DeliveryArchiveFile rows persist transactionally | Codex |
| Storage | ZIP generated from processed outputs only; originals preserved | Codex |
| Approval Gate | Client downloads remain hidden until admin approval and later delivery checks pass | Codex |
| Audit | Archive/ZIP/manifest/readme generation and failures are audited | Codex |
| Runtime | `/admin/jobs/[jobId]/delivery` renders in browser | Codex |
