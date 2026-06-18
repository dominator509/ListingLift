# PHASE_5_IMPLEMENTATION_NOTES.md

## Phase

Phase 5 — Packages and Pricing

## ChatGPT-Coded Scope

This seed advances ListingLift into data-driven service packages and server-side pricing contracts. It does not call Stripe, Gumroad, or any real payment provider.

## Source Requirements Implemented as Seed Code

- Required package records are represented as structured data, not static cards only.
- Package cards and pricing pages read from server-side package records.
- Checkout entry page reads the selected package and creates a server-side quote preview.
- Package quote logic is handled in a backend service.
- Image allowance and revision allowance checks exist as pure service contracts.
- Admin package updates require `manage:packages` through route contracts.
- Sales-channel package mappings are derived from package records.
- Marketplace-safe claims are attached to each package and avoid guarantees.

## Key Files

- `src/domain/packages.ts`
- `src/schemas/package.ts`
- `src/server/services/package-service.ts`
- `src/server/services/pricing-service.ts`
- `src/server/services/checkout-entry-service.ts`
- `src/app/api/packages/route.ts`
- `src/app/api/packages/[packageKey]/route.ts`
- `src/app/api/pricing/quote/route.ts`
- `src/app/api/checkout/package-selection/route.ts`
- `src/components/packages/*`
- `src/app/pricing/page.tsx`
- `src/app/packages/page.tsx`
- `src/app/checkout/[packageKey]/page.tsx`
- `src/app/admin/packages/page.tsx`
- `prisma/migrations/0004_phase5_packages_pricing/migration.sql`

## Important Boundaries

- Stripe checkout is Phase 17 and remains disabled here.
- Gumroad checkout/webhook intake is Phase 18 and remains disabled here.
- Credits, subscriptions, and manual invoices are Phase 19 and remain only lightly scaffolded.
- Package edits are route/service contracts until Codex connects them to Prisma persistence and audit logs.
- Pricing estimates are not legally binding quotes; manual review can be required.

## Compliance Copy Rule

All package display and checkout copy must use language such as:

> Platform-ready draft. Seller review against current platform guidelines is recommended before publishing. Marketplace approval, ranking, sales, or ad performance are not guaranteed.

Do not guarantee marketplace compliance, marketplace approval, sales increases, ad performance, ranking, conversion lift, or product approval.
