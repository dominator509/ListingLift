# File Storage Integrations

## Current Phase

Phase 28 — File Storage Integrations.

## Objective

Provide a safe storage abstraction for ListingLift uploads, processed outputs, previews, delivery archives, manifests, reports, manual replacements, Google Drive folder intake, Dropbox folder intake, local storage, and mock testing.

## Providers

- Local storage: baseline development/Replit-compatible scaffold.
- Mock storage: default for tests and no-key operation.
- Google Drive: feature-flagged OAuth/API scaffold.
- Dropbox: feature-flagged OAuth/API scaffold.
- OneDrive later: disabled placeholder.
- Box later: disabled placeholder.

## Hard Rules

- Preserve original uploads.
- Never overwrite originals.
- Never expose provider keys, OAuth tokens, refresh tokens, access tokens, webhook secrets, or signed URL internals to frontend code.
- Store third-party provider credentials only as encrypted secret references.
- Real provider calls are disabled by default.
- Manual upload/download fallback remains mandatory.
- Use approved archive records before exporting client-facing delivery files.
- Audit imports, exports, signed access generation, downloads, health checks, and manual overrides.

## Codex Must Implement

- Real Prisma persistence for `FileStorageConnection`, `ExternalFileReference`, and `FileStorageSyncEvent`.
- Server-side RBAC and tenant isolation on every storage route.
- Streaming upload/download through storage adapters.
- Official Google Drive and Dropbox SDK/API calls only when flags and encrypted secrets are configured.
- Signed or server-mediated short-lived access for downloads.
- Durable local/Replit-compatible storage or production storage adapter.
