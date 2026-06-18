import { OTHER_SALES_CHANNEL_SAFETY_RULES, isUnsafeOtherSalesChannelAction } from '@/domain/generic-sales-channels';
import { genericChannelSafetyCheckSchema, type GenericChannelSafetyCheckInput } from '@/schemas/generic-sales-channels';

export function checkGenericSalesChannelSafety(input: GenericChannelSafetyCheckInput) {
  const parsed = genericChannelSafetyCheckSchema.parse(input);
  const unsafeActions = parsed.intendedActions.filter(isUnsafeOtherSalesChannelAction);
  const blockers = [
    ...unsafeActions.map((action) => `Unsafe action: ${action}`),
    parsed.storesPassword ? 'Do not store source-platform passwords.' : undefined,
    parsed.scrapesPrivatePages ? 'Do not scrape private pages or lead inboxes.' : undefined,
    parsed.automatesMessages ? 'Do not automate messages, comments, proposals, DMs, or follow-ups without approved integration permissions.' : undefined,
    parsed.deliveryMode === 'SOURCE_PLATFORM_WITH_ALLOWED_LINK' && !parsed.externalLinkAllowed ? 'External links require platform allowance and customer consent.' : undefined,
  ].filter(Boolean);
  return {
    ok: blockers.length === 0,
    blockers,
    rules: OTHER_SALES_CHANNEL_SAFETY_RULES,
    manualFallbackRequired: true,
  };
}
