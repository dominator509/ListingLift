# Delivery Notifications Gap Handoff

This document summarizes the runtime-only work Codex must complete for Phase 16.

## Runtime blockers

- Real database migrations must be generated from Prisma.
- Storage adapter must stream or sign approved ZIP downloads.
- Token resolution must use constant-time comparison where practical.
- Rate limiting must protect token resolve/download endpoints.
- SMTP must be disabled by default and verified before use.
- Notification logs must store redacted recipients.
- Audit logs must be written for every client-facing delivery action.

## Safety checks

- Attempt expired token download.
- Attempt revoked token download.
- Attempt cross-tenant token access.
- Attempt download before manual approval.
- Attempt download before archive approval.
- Attempt download after maxDownloads reached.
- Confirm raw token appears only once at creation and nowhere else.
