# Stripe Phase 17 Gap Handoff

## Cannot be completed inside ChatGPT Project Mode

- Installing the Stripe SDK in the target repo.
- Running `npm install`, typecheck, lint, build, and tests.
- Validating Prisma schema in the target runtime.
- Generating real migration SQL.
- Creating Stripe test-mode Checkout Sessions.
- Receiving real Stripe webhook test events.
- Validating raw body behavior in the deployed framework runtime.
- Confirming database transactions.

## Codex must verify

1. Stripe Checkout works in test mode.
2. Webhook signature verification uses raw body bytes/string.
3. Failed payment does not create upload tokens, credits, jobs, subscriptions, or dashboard access.
4. Paid checkout creates normalized external order, job, upload link, invoice/payment record, and audit log as appropriate.
5. Duplicate webhook events do not duplicate fulfillment records.
