# Reports and Upsell Engine

Phase 32 adds report-generation and upsell-planning scaffolds for ListingLift.

## Scope

The engine prepares implementation-ready drafts for:

- Delivery summary reports
- Image quality reports
- Listing recommendation reports
- Monthly cleanup reports
- White-label agency reports
- Revenue attribution summaries
- Client progress summaries
- Upsell opportunity detection
- Upsell offer draft generation

## Safety Rules

Reports and upsells must never guarantee:

- marketplace approval
- ranking
- sales
- conversion increases
- product approval
- listing approval
- ad performance

Use wording such as:

- “platform-ready draft”
- “seller-review recommended”
- “formatted for common marketplace use”
- “review against current platform guidelines before publishing”

## Manual Review

Upsell offers are drafts. Marketplace messages, client emails, dashboard prompts, and white-label offers require human review before sending.

## Codex Runtime Work

Codex must connect the dry-run services to Prisma, RBAC, audit logs, report export storage, notification adapters, and dashboard visibility gates.
