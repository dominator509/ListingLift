import { type UpsellChannel, type UpsellSignalInput } from '@/domain/reports-upsells';
import { detectUpsellOpportunities } from './upsell-opportunity-service';
import { buildUpsellTemplate } from './upsell-template-service';

export function generateUpsellOfferDrafts(input: { signal: UpsellSignalInput; channel?: UpsellChannel; requestedTypes?: string[] }) {
  const opportunities = detectUpsellOpportunities(input.signal).filter((opportunity) =>
    input.requestedTypes?.length ? input.requestedTypes.includes(opportunity.type) : true,
  );
  const channel = input.channel ?? 'CLIENT_DASHBOARD';
  return opportunities.map((opportunity) => {
    const template = buildUpsellTemplate(opportunity.type, channel);
    return {
      organizationId: opportunity.organizationId,
      clientId: opportunity.clientId,
      jobId: opportunity.jobId,
      opportunityType: opportunity.type,
      priorityScore: opportunity.priorityScore,
      reason: opportunity.reason,
      offerType: opportunity.type,
      title: template.title,
      body: template.body,
      cta: template.cta,
      suggestedPriceCents: template.suggestedPriceCents,
      currency: 'USD',
      channel,
      status: 'DRAFT',
      safeClaim: template.safeClaim,
      dryRun: true,
    };
  });
}
