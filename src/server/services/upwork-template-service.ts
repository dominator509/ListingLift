import {
  UPWORK_SAFE_SERVICE_LANGUAGE,
  buildUpworkDeliveryTemplate,
  buildUpworkProposalTemplate,
  buildUpworkRetainerUpsellReminder,
} from '@/domain/upwork';
import {
  upworkDeliveryTemplateInputSchema,
  upworkProposalTemplateInputSchema,
  upworkRetainerReminderInputSchema,
  type UpworkDeliveryTemplateInput,
  type UpworkProposalTemplateInput,
  type UpworkRetainerReminderInput,
} from '@/schemas/upwork';

const bannedGuaranteePattern = /guarantee(?:d)?\s+(?:amazon|etsy|shopify|ranking|sales|conversion|approval|performance)|guaranteed\s+(?:ranking|sales|approval|conversion)/i;

export function buildUpworkProposalTemplateDraft(input: UpworkProposalTemplateInput) {
  const parsed = upworkProposalTemplateInputSchema.parse(input);
  const message = buildUpworkProposalTemplate(parsed);
  return {
    templateType: 'PROPOSAL',
    subjectHint: parsed.contractTitle ? `Proposal for ${parsed.contractTitle}` : 'Product image cleanup proposal',
    message,
    safeLanguage: UPWORK_SAFE_SERVICE_LANGUAGE,
    retainerUpsellIncluded: /monthly|retainer|ongoing/i.test(message),
  };
}

export function buildUpworkDeliveryTemplateDraft(input: UpworkDeliveryTemplateInput) {
  const parsed = upworkDeliveryTemplateInputSchema.parse(input);
  const message = buildUpworkDeliveryTemplate(parsed);
  return {
    templateType: 'DELIVERY',
    deliveryMode: parsed.deliveryMode,
    externalLinkIncluded: parsed.includeExternalLink && parsed.externalLinkAllowed,
    message,
    safeLanguage: UPWORK_SAFE_SERVICE_LANGUAGE,
  };
}

export function buildUpworkRetainerReminderDraft(input: UpworkRetainerReminderInput) {
  const parsed = upworkRetainerReminderInputSchema.parse(input);
  const message = buildUpworkRetainerUpsellReminder(parsed);
  return {
    templateType: 'RETAINER_REMINDER',
    message,
    safeLanguage: UPWORK_SAFE_SERVICE_LANGUAGE,
    nextAction: 'Operator may send manually in Upwork only when appropriate for the contract context.',
  };
}

export function assertUpworkMessageSafe(message: string) {
  return {
    safe: !bannedGuaranteePattern.test(message),
    containsSafeDisclaimer: message.includes('not guaranteed') || message.includes('not guarantee'),
    marketplaceGuaranteeDetected: bannedGuaranteePattern.test(message),
  };
}
