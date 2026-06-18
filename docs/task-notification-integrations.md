# Task Notification Integrations

Phase 30 adds optional operator-support integrations for Slack, email, Google Sheets, Airtable, Trello, ClickUp, Asana, and Notion.

These integrations are support systems, not fulfillment dependencies. ListingLift must continue to process, review, approve, deliver, and audit work even if every external integration is unavailable.

## Providers

- Slack alerts
- SMTP/internal email
- Google Sheets data export
- Airtable data export
- Trello cards
- ClickUp tasks
- Asana tasks
- Notion pages/data export

## Rules

- Use adapters, never direct provider calls from feature code.
- Keep real provider calls feature-flagged.
- Store credentials encrypted or in secure environment variables only.
- Redact payloads before exporting.
- Do not send raw files, secrets, private notes, marketplace passwords, unapproved delivery links, or signed URL internals.
- Audit all sensitive actions.
