import { quoteAgencyVolumePricing } from '@/domain/agency-white-label';
import { agencyVolumePricingRequestSchema, type AgencyVolumePricingRequest } from '@/schemas/agency-white-label';

export function buildAgencyVolumePricingQuote(input: AgencyVolumePricingRequest) {
  const parsed = agencyVolumePricingRequestSchema.parse(input);
  return {
    ...quoteAgencyVolumePricing(parsed),
    request: parsed,
    codexNote: 'Codex must wire agency billing to verified subscriptions, invoices, credits, payment provider status, and manual approval before charging.',
    dryRun: true,
  };
}
