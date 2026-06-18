# PHASE_5_VERIFICATION_MATRIX.md

## Phase 5 — Packages and Pricing

| Requirement | ChatGPT Seeded | Codex Must Verify |
|---|---:|---:|
| Required package records exist | Yes | Yes |
| Packages are data-driven | Yes | Yes |
| Pricing pages read package records | Yes, server seed records | Yes, runtime verified |
| Admin package table exists | Yes | Yes |
| Admin can edit active packages | Route/schema scaffold | Prisma persistence + audit |
| Checkout uses server-side pricing | Service/route scaffold | Runtime/browser/API verified |
| Image allowance enforced | Service contract | Job/checkout integration verified |
| Revision allowance enforced | Service contract | Job/revision integration verified |
| Sales-channel package mapping exists | Service contract | Normalization integration verified in Phase 7 |
| Marketplace-safe copy exists | Yes | Yes |
| Stripe/Gumroad not called | Yes | Yes |

## Commands Codex Should Run

```bash
npm install
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run test:unit -- package pricing
npm run test:integration -- packages-pricing
npm run test:e2e -- pricing
npm run typecheck
npm run lint
npm run build
```

## Manual Review Checklist

- Confirm all package prices match the architecture-approved ranges.
- Confirm package edit route requires `manage:packages`.
- Confirm public pages do not display unsupported claims.
- Confirm checkout page does not call real payment providers before Phase 17/18.
- Confirm admin package changes write audit logs once Prisma persistence is connected.
