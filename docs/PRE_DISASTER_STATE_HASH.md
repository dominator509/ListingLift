# Pre-Disaster State Hash — Q9 Phase 1 Baseline

## Schema Dump

- **File:** `/tmp/schema_dump.sql` (349,517 bytes)
- **SHA256:** `60a9ff1f6ff79229a60c8ea9ee61a8a3c02dfe6149b396b917b1ee1ec4035cc6`
- **Generated:** `pg_dump --schema-only --no-owner --no-acl -d listinglift_dev`

## WAL Position

| Property | Value |
|----------|-------|
| Current WAL LSN | `0/1CDB9968` |
| WAL Bytes | 483,264,264 |

## Database Connection Count

| Property | Value |
|----------|-------|
| Active connections (pg_stat_activity) | 1 |
| Active sessions (Session table, expires > now) | 0 |
| All sessions | 0 |

## Table Row Counts & Checksums

### Schema-level tables (public)

| Table | Rows | CHECKSUM (md5) |
|-------|------|-----------------|
| _prisma_migrations | 1 | `32f8e5abc74312a959dc86e4330895f0` |
| AdminDashboardEvent | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| AdminDashboardPreference | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| AdvancedImageProcessingRecipe | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| AdvancedImageProcessingReport | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| AdvancedImageProcessingRun | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| AdvancedIntegrationConnection | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| AgencyBrandedDeliveryTemplate | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| AgencyBrandedReportTemplate | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| AgencyBrandingReview | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| AgencyBulkProcessingBatch | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| AgencyBulkProcessingItem | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| AgencyTeamInvite | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| AgencyVolumePricingQuote | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| AgencyWhiteLabelEvent | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| AgencyWorkspaceSetting | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| ApiAccessEvent | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| ApiAccessToken | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| ApiWebhookSubscription | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| AuditLog | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| AutomationDeadLetter | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| AutomationEvent | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| AutomationWebhookDelivery | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| AutomationWebhookSubscription | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| BrandSetting | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| Client | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| ClientDashboardEvent | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| ClientDashboardPreference | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| CreditLedger | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| DeliveryArchive | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| DeliveryArchiveFile | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| DeliveryDownloadEvent | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| DeliveryLink | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| DeliveryNotificationLog | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| EncryptedSecret | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| EtsyListingImportRow | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| EtsyListingPackMapping | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| EtsyWorkflowEvent | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| ExternalFileReference | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| ExternalOrder | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| FileStorageConnection | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| FileStorageSyncEvent | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| FiverrDeliveryTemplate | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| FiverrGigMapping | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| FiverrWorkflowEvent | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| GenericSalesChannelMapping | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| GenericSalesChannelWorkflowEvent | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| GumroadProductMapping | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| GumroadWebhookEvent | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| IdempotencyKey | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| Image | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| ImageProcessingError | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| ImageProcessingRun | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| ImageProcessingStep | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| ImageProviderConfiguration | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| ImageProviderHealthCheck | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| IntegrationConnection | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| InvoicePayment | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| Job | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| JobStatusEvent | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| ManualApprovalEvent | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| ManualApprovalGate | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| ManualInvoice | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| ManualInvoicePayment | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| MarketplaceDirectConversionSignal | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| MarketplaceExportMapping | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| MarketplaceExportWorkflowEvent | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| Membership | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| Organization | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| Package | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| Permission | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| PlatformPreset | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| PreviewGallery | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| PreviewGalleryItem | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| ProcessedFile | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| QaCheckResult | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| QaEvidenceReference | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| QaRun | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| QaSmokeRouteResult | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| QaVerificationLedger | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| QualityFlag | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| QualityReview | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| QualityReviewEvent | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| Report | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| ReportDeliveryEvent | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| ReportMetricSnapshot | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| RetainerOpportunityAlert | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| RevenueAnalyticsSnapshot | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| RevisionRequest | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| RevisionWorkflowEvent | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| Role | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| RolePermission | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| SalesChannel | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| SecurityAuditCoverageItem | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| SecurityCsrfToken | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| SecurityHardeningEvent | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| SecurityRateLimitRule | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| SecuritySecretReference | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| Session | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| SharedUploadPortalLink | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| ShopifyImagePackMapping | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| ShopifyProductImportRow | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| ShopifyStoreConnection | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| ShopifyWorkflowEvent | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| SocialCommerceChannelMapping | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| SocialCommerceCreativePlan | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| SocialCommerceWorkflowEvent | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| StripeCheckoutSession | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| StripeWebhookEvent | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| Subscription | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| SubscriptionEntitlement | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| TaskDataExport | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| TaskIntegrationTask | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| TaskNotificationConnection | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| TaskNotificationDelivery | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| TaskrabbitServiceMapping | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| TaskrabbitWorkflowEvent | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| UploadBatch | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| UploadEvent | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| UploadToken | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| UpsellEvent | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| UpsellOffer | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| UpsellOpportunity | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| UpsellTemplate | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| UpworkOfferMapping | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| UpworkProposalTemplate | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| UpworkWorkflowEvent | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| User | 0 | `d41d8cd98f00b204e9800998ecf8427e` |
| WebhookEvent | 0 | `d41d8cd98f00b204e9800998ecf8427e` |

## Pending Business State

| Property | Value |
|----------|-------|
| Pending Jobs (not COMPLETED/CANCELLED/FAILED/DELIVERED) | 0 |
| External Orders | 0 |
| Active Sessions (expires > now) | 0 |
| Pending Image Processing Runs | 0 |

## Filesystem State

| Property | Value |
|----------|-------|
| uploads/ directory | Does not exist |
| Files in uploads/ | 0 |

## Rollback Reference

This file is THE reference for Phase 5 rollback verification. To verify integrity after a disaster:

1. Re-dump schema and compare SHA256
2. Re-run checksum queries on all tables
3. Compare row counts
4. Compare WAL position progression

**Empty baseline note:** All business tables are at zero rows. The only data is `_prisma_migrations` (1 row, migration tracking). This is expected for a fresh development database. Checksums should match exactly after recovery.
