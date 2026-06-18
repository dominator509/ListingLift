import { buildOtherSalesChannelFollowUpTemplate, buildOtherSalesChannelProposalTemplate, OTHER_SALES_CHANNEL_SAFE_COPY } from '@/domain/generic-sales-channels';
import { genericProposalTemplateInputSchema, type GenericProposalTemplateInput } from '@/schemas/generic-sales-channels';
import { getOtherSalesChannelDefinitionOrThrow } from './generic-sales-channel-catalog-service';

export function createGenericProposalTemplate(input: GenericProposalTemplateInput) {
  const parsed = genericProposalTemplateInputSchema.parse(input);
  const definition = parsed.channelKey ? getOtherSalesChannelDefinitionOrThrow(parsed.channelKey) : undefined;
  return {
    templateType: 'PROPOSAL' as const,
    channelLabel: parsed.channelLabel ?? definition?.label ?? 'selected source',
    body: buildOtherSalesChannelProposalTemplate({
      channelLabel: parsed.channelLabel ?? definition?.label,
      buyerName: parsed.buyerName,
      packageLabel: parsed.packageLabel,
      imageCount: parsed.imageCount,
      intent: parsed.intent,
    }),
    safeCopy: OTHER_SALES_CHANNEL_SAFE_COPY,
    sellerReviewRecommended: true,
  };
}

export function createGenericFollowUpTemplate(input: { channelKey?: string; buyerName?: string; nextStep?: string }) {
  const definition = input.channelKey ? getOtherSalesChannelDefinitionOrThrow(input.channelKey) : undefined;
  return {
    templateType: 'FOLLOW_UP' as const,
    channelLabel: definition?.label,
    body: buildOtherSalesChannelFollowUpTemplate({ buyerName: input.buyerName, nextStep: input.nextStep, channelLabel: definition?.label }),
    manualOperatorActionRequired: true,
  };
}

export function createGenericDeliveryTemplate(input: { channelKey: string; buyerName?: string; archiveFileName?: string; externalLinkAllowed?: boolean }) {
  const definition = getOtherSalesChannelDefinitionOrThrow(input.channelKey);
  const greeting = input.buyerName ? `Hi ${input.buyerName},` : 'Hi,';
  return {
    templateType: 'DELIVERY' as const,
    deliveryMode: definition.defaultDeliveryMode,
    body: `${greeting}\n\nYour ListingLift image pack is ready for seller review. ${input.archiveFileName ? `The delivery archive is ${input.archiveFileName}. ` : ''}${input.externalLinkAllowed ? 'Use the approved download link where the source platform allows external links. ' : 'Please keep delivery inside the source platform unless external links are allowed. '}These are platform-ready draft assets; review all files against current platform guidelines before publishing. Marketplace approval, ranking, sales, conversion, ad performance, product approval, or listing approval are not guaranteed.`,
    requiresApprovedArchive: true,
    requiresManualSend: true,
  };
}
