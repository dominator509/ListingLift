import { GUMROAD_SAFE_DELIVERY_CLAIM, redactGumroadEmail } from '@/domain/gumroad';
import type { GumroadPurchaseIntakeRequest } from '@/schemas/gumroad';
import { resolveGumroadOfferMapping } from './gumroad-product-mapping-service';
import { normalizeGumroadPurchase, shouldIgnoreGumroadPurchase } from './gumroad-webhook-event-service';

export function createGumroadPurchaseIntakePlan(input: GumroadPurchaseIntakeRequest) {
  const purchase = normalizeGumroadPurchase(input.payload);
  const mapping = resolveGumroadOfferMapping(input.payload);
  const ignore = shouldIgnoreGumroadPurchase(purchase);
  const offer = mapping.offer;

  const clientDraft = {
    organizationId: input.organizationId ?? 'resolved-by-codex',
    existingClientId: input.existingClientId,
    matchStrategy: input.existingClientId ? 'internal_client_id' : purchase.buyerEmail ? 'email' : 'manual_review',
    name: purchase.buyerName || purchase.buyerEmail || 'Gumroad buyer',
    email: purchase.buyerEmail,
    redactedEmail: redactGumroadEmail(purchase.buyerEmail),
    sourceChannel: 'Gumroad',
  };

  const externalOrderDraft = {
    provider: 'gumroad',
    salesChannelKey: 'Gumroad',
    dedupeKey: purchase.dedupeKey,
    externalOrderId: purchase.saleId,
    externalCustomerId: purchase.buyerEmail,
    buyerName: purchase.buyerName,
    buyerEmailOrUsername: purchase.buyerEmail,
    packageKey: offer?.packageKey ?? undefined,
    packagePurchasedRaw: purchase.productName,
    orderAmountCents: purchase.amountCents,
    currency: purchase.currency,
    paymentStatus: purchase.paymentStatus,
    uploadStatus: offer?.sendsUploadLink ? 'TOKEN_SENT' : 'NOT_STARTED',
    fulfillmentStatus: offer?.createsJob ? 'NOT_STARTED' : 'COMPLETE',
    sourceUrl: purchase.permalink ? `https://gumroad.com/l/${purchase.permalink}` : undefined,
    normalizedPayload: purchase.rawPayload,
    revenueAttribution: {
      source: 'gumroad',
      saleId: purchase.saleId,
      amountCents: purchase.amountCents,
      currency: purchase.currency,
      offerKey: offer?.key,
    },
  };

  const jobDraft = offer?.createsJob
    ? {
        title: `${offer.label} — Gumroad ${purchase.saleId}`,
        status: 'WAITING_FOR_UPLOAD',
        packageKey: offer.packageKey,
        imageQuantityExpected: offer.imageAllowance,
        revisionAllowance: offer.revisionAllowance,
        sourceChannel: 'Gumroad',
        externalOrderDedupeKey: purchase.dedupeKey,
        notes: GUMROAD_SAFE_DELIVERY_CLAIM,
      }
    : null;

  const creditLedgerDraft = offer?.creditAmount
    ? {
        amount: offer.creditAmount,
        creditType: 'gumroad_purchase',
        source: 'gumroad',
        reason: `${offer.label} purchase ${purchase.saleId}`,
      }
    : null;

  const uploadLinkPlan = offer?.sendsUploadLink && jobDraft
    ? {
        createUploadToken: true,
        emailBuyer: Boolean(purchase.buyerEmail),
        recipientRedacted: redactGumroadEmail(purchase.buyerEmail),
        packageKey: offer.packageKey,
        imageLimit: offer.imageAllowance,
      }
    : { createUploadToken: false, emailBuyer: false };

  return {
    purchase,
    mapping,
    ignore,
    clientDraft,
    externalOrderDraft,
    jobDraft,
    creditLedgerDraft,
    uploadLinkPlan,
    adminNotificationPlan: {
      sendAdminNotification: offer?.sendsAdminNotification ?? true,
      subject: `Gumroad intake: ${purchase.productName ?? 'Unmapped product'}`,
      safeSummary: GUMROAD_SAFE_DELIVERY_CLAIM,
    },
    dryRun: input.dryRun,
    codexPersistenceRequired: [
      'dedupe Gumroad sale ID',
      'upsert/match Client',
      'create ExternalOrder',
      'create Job or CreditLedger when applicable',
      'create upload token and delivery-safe email only after verified payment',
      'audit all mutation steps',
    ],
  };
}
