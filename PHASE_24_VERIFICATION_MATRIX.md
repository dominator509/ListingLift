# PHASE_24_VERIFICATION_MATRIX.md

| Area | Required verification | Owner |
|---|---|---|
| Prisma | Schema validates and migration applies | Codex |
| Seed | Seed can run twice without duplicates | Codex |
| Manual order | Etsy order creates/matches Client, ExternalOrder, Job, UploadToken, EtsyWorkflowEvent, AuditLog | Codex |
| Dedupe | Duplicate Etsy order/shop cannot create duplicate jobs | Codex |
| Presets | EtsyListingSquare outputs are selected for Etsy jobs | Codex |
| ZIP | Etsy folder exists in delivery archive plans | Codex |
| Reports | Etsy visual consistency report uses safe, non-guarantee language | Codex |
| Delivery | Delivery template only references approved archives and allowed links | Codex |
| Revisions | Open Etsy revisions block completion | Codex |
| Safety | No scraping, password storage, unauthorized messaging/listing automation | Codex |
| UI | Etsy admin pages render in browser | Codex |
| Tests | Unit, security, integration, E2E, typecheck, lint, build pass | Codex |
