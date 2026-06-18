# Phase 28 Verification Matrix

| Area | Required Check | Owner |
|---|---|---|
| Prisma | Validate schema and regenerate migration | Codex |
| Secrets | Provider secrets never appear in frontend/logs/responses | Codex |
| RBAC | Storage routes enforce `manage:integrations`, `upload:images`, `download:files`, or delivery permissions | Codex |
| Tenant Isolation | Every connection/ref/event query scoped by organization | Codex |
| Original Preservation | Originals cannot be overwritten/deleted through storage flows | Codex |
| Mock Baseline | Mock/local storage works without third-party keys | Codex |
| Google Drive | Real calls disabled unless flags and encrypted secrets exist | Codex |
| Dropbox | Real calls disabled unless flags and encrypted secrets exist | Codex |
| Client Access | Only approved client-downloadable object kinds are exposed | Codex |
| Audit | Import/export/access/health/manual actions audited | Codex |
| UI | `/admin/file-storage/*` pages render | Codex |
