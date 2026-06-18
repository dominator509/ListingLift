import { buildEtsyDeliveryMessage, buildEtsyVisualConsistencyReport } from '@/domain/etsy';
import { etsyDeliveryTemplateInputSchema, etsyReportInputSchema, type EtsyDeliveryTemplateInput, type EtsyReportInput } from '@/schemas/etsy';

export function createEtsyDeliveryTemplate(input: EtsyDeliveryTemplateInput) {
  const parsed = etsyDeliveryTemplateInputSchema.parse(input);
  return {
    deliveryMessage: buildEtsyDeliveryMessage(parsed),
    requiresOperatorReview: true,
    externalLinkAllowed: parsed.externalLinkAllowed,
    marketplaceSafe: true,
  };
}

export function createEtsyVisualReport(input: EtsyReportInput) {
  const parsed = etsyReportInputSchema.parse(input);
  return buildEtsyVisualConsistencyReport(parsed);
}
