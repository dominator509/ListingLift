import { SAFE_MARKETPLACE_LANGUAGE } from '@/lib/constants';
import { reportCreateSchema, upsellOfferSchema, type ReportCreateInput, type UpsellOfferInput } from '@/schemas/report';

export function createQualityReportDraft(input: ReportCreateInput) {
  const data = reportCreateSchema.parse(input);
  const footer = `\n\nMarketplace note: ${SAFE_MARKETPLACE_LANGUAGE.join('; ')}.`;
  return { ...data, body: `${data.body}${footer}` };
}

export function createUpsellOfferDraft(input: UpsellOfferInput) {
  return upsellOfferSchema.parse(input);
}
