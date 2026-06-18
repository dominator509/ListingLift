import { buildFiverrDeliveryTemplate, FIVERR_MARKETPLACE_SAFETY_RULES, FIVERR_SAFE_DELIVERY_LANGUAGE } from '@/domain/fiverr';
import { fiverrDeliveryTemplateInputSchema, type FiverrDeliveryTemplateInput } from '@/schemas/fiverr';

export function buildFiverrDeliveryTemplateDraft(input: FiverrDeliveryTemplateInput) {
  const parsed = fiverrDeliveryTemplateInputSchema.parse(input);
  const linkWarning = parsed.includeExternalLink && !parsed.externalLinkAllowed
    ? 'External link requested but not marked allowed. Codex/runtime must block sending until platform rules are confirmed.'
    : undefined;

  return {
    deliveryMode: parsed.deliveryMode,
    message: buildFiverrDeliveryTemplate(parsed),
    safeLanguage: FIVERR_SAFE_DELIVERY_LANGUAGE,
    linkWarning,
    safetyRules: [...FIVERR_MARKETPLACE_SAFETY_RULES],
    requiredManualActions: [
      'Confirm delivery method is allowed for the Fiverr order.',
      'Attach final ZIP or paste allowed delivery link manually inside Fiverr.',
      'Mark ListingLift job delivered only after Fiverr delivery is complete.',
    ],
  };
}

export function assertFiverrDeliveryMessageSafe(message: string) {
  const forbidden = /(?<!\b(?:not|no|never)\s+)(?:guarantee|guaranteed)|will\s+rank|guaranteed\s+ranking|increase\s+(sales|conversion)|approved\s+by\s+(amazon|etsy)|(?<!\b(?:not|no|never)\s+)ad\s+performance/i;
  return { safe: !forbidden.test(message), forbiddenMatched: forbidden.test(message) };
}
