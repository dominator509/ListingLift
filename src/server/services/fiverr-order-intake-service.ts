import { buildFiverrDedupeKey, normalizeFiverrOrderId, redactFiverrBuyer } from '@/domain/fiverr';
import { fiverrManualOrderInputSchema, type FiverrManualOrderInput } from '@/schemas/fiverr';
import { normalizeFiverrOrder } from '@/server/services/sales-channel-normalizer';
import { resolveFiverrGigMapping } from './fiverr-package-mapping-service';

export function createFiverrManualOrderPlan(input: FiverrManualOrderInput) {
  const parsed = fiverrManualOrderInputSchema.parse(input);
  const mapping = resolveFiverrGigMapping(parsed);
  const externalOrderId = normalizeFiverrOrderId(parsed.orderId);
  const amountCents = parsed.orderAmountCents ?? parsed.orderAmount ?? 0;
  const normalized = normalizeFiverrOrder({
    order_id: externalOrderId,
    buyer_username: parsed.buyerUsername,
    buyer_name: parsed.buyerName,
    gig_title: parsed.gigTitle,
    packagePurchased: parsed.packagePurchased ?? mapping.mapping.gigTitle,
    package_key: mapping.packageKey,
    amount: amountCents / 100,
    currency: parsed.currency,
    deadline: parsed.deadline,
    revisions: parsed.revisionAllowance ?? mapping.revisionAllowance,
    order_url: parsed.sourceUrl || undefined,
    paymentStatus: 'MANUAL_CONFIRMED',
  });

  return {
    mode: parsed.dryRun ? 'DRY_RUN' : 'PERSISTENCE_REQUIRED',
    externalOrderDraft: {
      provider: 'fiverr',
      externalOrderId,
      dedupeKey: buildFiverrDedupeKey(externalOrderId),
      buyerUsernameRedacted: redactFiverrBuyer(parsed.buyerUsername),
      buyerName: parsed.buyerName,
      gigTitle: parsed.gigTitle,
      packageKey: mapping.packageKey,
      amountCents,
      currency: parsed.currency,
      deadline: parsed.deadline,
      revisionAllowance: parsed.revisionAllowance ?? mapping.revisionAllowance,
      sourceUrl: parsed.sourceUrl || undefined,
      normalized,
    },
    clientDraft: {
      existingClientId: parsed.existingClientId,
      displayName: parsed.buyerName ?? parsed.buyerUsername,
      marketplaceUsername: parsed.buyerUsername,
      source: 'Fiverr',
    },
    jobDraft: {
      title: `Fiverr ${mapping.mapping.gigTitle} — ${externalOrderId}`,
      packageKey: mapping.packageKey,
      imageQuantity: mapping.imageAllowance,
      status: parsed.uploadStatus === 'RECEIVED' ? 'UPLOAD_RECEIVED' : 'WAITING_FOR_UPLOAD',
      targetPlatform: 'Marketplace sellers',
      deadline: parsed.deadline,
      sourceChannel: 'Fiverr',
      adminNotes: parsed.orderInstructions,
    },
    uploadLinkPlan: mapping.mapping.createsUploadLink
      ? { shouldCreateUploadToken: true, reason: 'Fiverr order requires source files before processing.', fileLimit: mapping.imageAllowance }
      : { shouldCreateUploadToken: false, reason: 'Selected Fiverr mapping does not require an upload link.' },
    safety: {
      manualFirst: true,
      noScraping: true,
      noPasswordStorage: true,
      noUnauthorizedMessaging: true,
      deliveryShouldOccurInsideFiverrWhenRequired: true,
    },
  };
}
