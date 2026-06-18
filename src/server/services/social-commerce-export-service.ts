import { getSocialCommerceChannelDefinition } from '@/domain/social-commerce';

export function createSocialCommerceExportPlan(input: { channelKey: string; jobId?: string; includeRevenue?: boolean }) {
  const channel = getSocialCommerceChannelDefinition(input.channelKey);
  return {
    jobId: input.jobId,
    channelKey: channel.key,
    channelLabel: channel.label,
    exportColumns: ['channel', 'source_reference', 'buyer_or_handle_redacted', 'package_key', 'job_id', 'delivery_mode', 'revision_status', 'revenue_amount_cents', 'currency', 'operator_notes'],
    includeRevenue: input.includeRevenue ?? true,
    safety: {
      noPrivateScraping: true,
      noAutomatedMessaging: true,
      redactBuyerIdentity: true,
    },
  };
}
