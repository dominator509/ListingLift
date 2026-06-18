# PHASE_7_VERIFICATION_MATRIX.md — Sales Channel Normalization Layer

| Area | Requirement | ChatGPT Seeded | Codex Must Verify |
|---|---|---:|---:|
| Normalized fields | Required sales-channel fields represented | Yes | Yes |
| Adapter registry | Registry includes all named channels | Yes | Yes |
| Manual fallback | Every channel has manual/manual-like fallback | Yes | Yes |
| Real integrations | Disabled unless feature-flagged | Yes | Yes |
| Dedupe | Prevent duplicate external orders | Contract | DB constraint + tests |
| Client matching | Match by internal ID, email, external customer, username | Contract | Prisma workflow |
| Job creation | Create ListingLift job from external order | Contract | Prisma transaction |
| Revenue attribution | Preserve channel/order/package/amount/currency/source | Contract | Dashboard/report linkage |
| Upload trigger | Plan upload-token trigger after paid/manual-confirmed order | Contract | Phase 8 integration |
| Marketplace safety | No scraping/password/platform messaging abuse | Yes | Security review |
| RBAC | Manual order/import permission-gated | Route scaffold | Runtime tests |
| Tenant isolation | Organization-scoped dedupe and persistence | Schema/contract | DB tests |
| Audit logs | Sensitive actions must be audited | Documented | Implemented and tested |
| Prisma migration | Phase 7 migration scaffold | Yes | Regenerate/apply |
| Runtime | Typecheck/build/UI/API work | Not run | Required |

## Acceptance Criteria

Phase 7 is complete only when:

- Manual order creates external order and job.
- Duplicate external order is prevented.
- Source revenue attribution is stored.
- Registry includes all named channels.
- Real integrations stay feature-flagged/off by default.
- Manual fallback works for every channel.
- Sales-channel routes enforce RBAC and tenant isolation.
- Audit logs capture manual order creation, imports, duplicate prevention, client matching, and job creation.
- Tests pass in the real repo.
