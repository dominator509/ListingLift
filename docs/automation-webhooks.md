# Automation Webhooks

Phase 29 adds optional outbound automation webhook scaffolds for ListingLift events.

## Scope

Automation webhooks are not required for fulfillment. If automation fails, operators must still be able to complete every paid job manually.

## Supported trigger catalog

- New paid order
- New image upload
- Job processing started
- Job waiting for review
- Job completed
- Revision requested
- Download ready
- Credits low
- Subscription inactive
- Upsell opportunity detected

## Supported action catalog

- Create job
- Send email
- Create Slack message
- Create Trello card
- Create ClickUp task
- Create Google Drive folder
- Export ZIP
- Update CRM
- Notify admin

## Provider scaffolds

- Internal mock automation
- Generic signed webhook
- Zapier webhook
- Make webhook
- n8n webhook

Real provider calls must stay disabled by default. Mock automation must work without any paid API or external service.

## Security requirements

- Never expose webhook URLs/signing secrets to frontend code.
- Store secrets through encrypted secret references.
- Sign outbound payloads where supported.
- Redact emails, tokens, passwords, secrets, signed URLs, and provider credentials.
- Do not send raw client files or unapproved delivery URLs to automation providers.
- Rate-limit test/dispatch/retry routes.
- Persist dispatch attempts, failures, and dead-letter records.
- Audit subscription changes and manual replays.

## Codex runtime work

Codex must connect dry-run route contracts to Prisma, encrypted secrets, provider flags, rate limits, outbound HTTP clients, retry queues, dead-letter handling, and tests.
