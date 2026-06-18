# Stripe Checkout and Billing

Stripe is the paid checkout path for ListingLift packages, subscriptions, retainers, credits, and agency plans. The baseline seed keeps Stripe disabled by default and preserves manual fallback.

## Supported checkout purposes

- Package purchase
- Subscription purchase
- Credit purchase
- Monthly seller retainer
- Agency white-label plan

## Safety rules

- Verify webhook signatures before processing.
- Dedupe events by Stripe event ID.
- Never trust client-submitted prices or entitlements.
- Failed payment must not grant access.
- Paid checkout may create jobs and upload links only after verified payment.
- Delivery remains blocked until manual approval and delivery gates pass.
- No Stripe secret may reach the frontend.

## Codex handoff

Codex must replace seed drafts with official Stripe SDK calls, test in Stripe test mode, persist all billing events transactionally, and update roadmap status with actual command results.
