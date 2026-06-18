# Delivery and Email Notifications

Phase 16 prepares secure delivery links, mock-first email notifications, marketplace delivery copy, and download tracking.

## Guardrails

- Delivery tokens must be stored as hashes only.
- Links must expire and may have download limits.
- Final downloads remain hidden until manual approval, approved archive readiness, active token status, tenant/client scope, and link expiry checks pass.
- Email defaults to mock mode. SMTP must be feature-flagged and verified by Codex before production sends.
- Marketplace delivery messages are copyable drafts. Deliver inside marketplaces when platform workflow requires it.
- Do not guarantee marketplace approval, rankings, sales, conversions, ad performance, or product approval.

## Notification Types

The notification catalog includes upload received, processing started, manual review needed, job complete, revision requested, download ready, credits low, subscription renewal, failed job alert, upsell opportunity, marketplace order imported, Gumroad purchase, Stripe checkout, Fiverr manual order, Upwork manual project, Taskrabbit manual task, and deadline approaching.

## Codex Responsibilities

Codex must wire route contracts to Prisma transactions, encrypted/flagged email configuration, storage download streaming, signed or proxied URLs, audit logs, rate limiting, and browser-tested UI.
