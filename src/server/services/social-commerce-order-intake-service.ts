import { buildSocialCommerceCreativePlan, buildSocialCommerceDedupeKey, getSocialCommerceChannelDefinition, redactSocialCommerceIdentity } from '@/domain/social-commerce';
import { socialCommerceManualOrderInputSchema, type SocialCommerceManualOrderInput } from '@/schemas/social-commerce';
import { normalizeGenericMarketplaceOrder } from '@/server/services/sales-channel-normalizer';

export function createSocialCommerceManualOrderPlan(input: SocialCommerceManualOrderInput) {
  const parsed = socialCommerceManualOrderInputSchema.parse(input);
  const channel = getSocialCommerceChannelDefinition(parsed.channelKey);
  const packageKey = parsed.packageKey ?? channel.packageKey;
  const imageQuantity = parsed.imageQuantity ?? Math.max(parsed.productNames.length * 4, 10);
  const dedupeKey = buildSocialCommerceDedupeKey({
    organizationId: parsed.organizationId,
    channelKey: parsed.channelKey,
    externalReference: parsed.externalReference,
    sourceUrl: parsed.sourceUrl || undefined,
    buyerHandle: parsed.buyerHandleOrEmail,
  });
  const normalized = normalizeGenericMarketplaceOrder(channel.label, {
    externalOrderId: dedupeKey,
    buyerName: parsed.buyerName ?? parsed.businessName ?? channel.label,
    buyerEmailOrUsername: parsed.buyerHandleOrEmail ?? channel.key,
    packageKey,
    packagePurchased: parsed.packagePurchased ?? channel.label,
    orderAmountCents: parsed.orderAmountCents ?? 0,
    currency: parsed.currency,
    deadline: parsed.deadline,
    revisionAllowance: parsed.revisionAllowance ?? 1,
    sourceUrl: parsed.sourceUrl || undefined,
    paymentStatus: 'PENDING',
    uploadStatus: parsed.uploadStatus,
    fulfillmentStatus: 'NOT_STARTED',
  });

  return {
    mode: parsed.dryRun ? 'DRY_RUN' : 'PERSISTENCE_REQUIRED',
    channelKey: parsed.channelKey,
    channel,
    externalOrderDraft: {
      channelKey: channel.label,
      externalOrderId: dedupeKey,
      dedupeKey,
      sourceUrl: parsed.sourceUrl || undefined,
      buyerNameRedacted: redactSocialCommerceIdentity(parsed.buyerName),
      buyerHandleOrEmailRedacted: redactSocialCommerceIdentity(parsed.buyerHandleOrEmail),
      packageKey,
      productNames: parsed.productNames,
      creativeFormats: parsed.creativeFormats.length ? parsed.creativeFormats : channel.defaultCreativeFormats,
      normalized,
    },
    clientDraft: {
      existingClientId: parsed.existingClientId,
      displayName: parsed.businessName ?? parsed.buyerName ?? channel.label,
      buyerHandleOrEmail: parsed.buyerHandleOrEmail,
      source: channel.label,
    },
    jobDraft: {
      title: `${channel.label} social-commerce image pack`,
      packageKey,
      imageQuantity,
      targetPlatform: channel.label,
      selectedPresetKeys: channel.defaultPresetKeys,
      status: parsed.uploadStatus === 'RECEIVED' ? 'UPLOAD_RECEIVED' : 'WAITING_FOR_UPLOAD',
      deadline: parsed.deadline,
      sourceChannel: channel.label,
      adminNotes: parsed.notes,
      clientIntakeNotes: `Social-commerce products: ${parsed.productNames.join(', ') || 'manual social product batch'}`,
    },
    creativePlan: buildSocialCommerceCreativePlan({ channelKey: parsed.channelKey, productNames: parsed.productNames, brandColors: parsed.brandColors, formats: parsed.creativeFormats, campaignGoal: parsed.campaignGoal }),
    uploadLinkPlan: {
      shouldCreateUploadToken: true,
      reason: 'Social-commerce workflows require raw product photos, creative brief notes, or current platform screenshots/exports before fulfillment.',
      fileLimit: imageQuantity,
    },
    workflowEventDraft: {
      workflowStatus: parsed.uploadStatus === 'RECEIVED' ? 'FILES_RECEIVED' : 'SOURCE_CAPTURED',
      deliveryMode: parsed.deliveryMode,
      revisionStatus: parsed.revisionStatus,
      externalLinkAllowed: parsed.externalLinkAllowed,
    },
    revenueAttribution: {
      sourceChannel: channel.label,
      amountCents: parsed.orderAmountCents ?? 0,
      currency: parsed.currency,
      productCount: parsed.productNames.length,
    },
    safety: {
      manualOperatorCopyOnly: true,
      noScraping: true,
      noPasswordStorage: true,
      noAutomatedDmCommentPostUpload: true,
      sellerReviewRequired: true,
    },
  };
}
