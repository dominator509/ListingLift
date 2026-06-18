# Phase 23 Verification Matrix

| Area | Required Check | Owner |
|---|---|---|
| Catalog | All Phase 23 sources exist as selectable sources | Codex |
| Manual order | Creates ExternalOrder/Client/Job/UploadToken draft transactionally | Codex |
| Dedupe | Organization + channel + external reference prevents duplicates | Codex |
| Revenue | Source attribution is persisted | Codex |
| Templates | Proposal/follow-up/delivery copy is compliance-safe | Codex |
| Safety | Blocks scraping, password storage, private message scraping, unauthorized messaging automation | Codex |
| External links | Allowed only where source rules/customer consent permit | Codex |
| UI | `/admin/other-sales-channels` and child pages render | Codex |
| Tests | Unit/security/integration/E2E/typecheck/lint/build pass | Codex |
