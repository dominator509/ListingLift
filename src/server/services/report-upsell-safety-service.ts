import { inspectReportCopy } from './report-safety-service';

export function inspectUpsellCopy(copy: string) {
  const reportSafety = inspectReportCopy(copy);
  const unsafeAutomation = /(auto[-\s]?dm|spam|scrape|guaranteed sales|guaranteed ranking|guaranteed conversion)/i.test(copy);
  return {
    safe: reportSafety.safe && !unsafeAutomation,
    unsafeMatches: [...reportSafety.unsafeMatches, ...(unsafeAutomation ? ['unsafe upsell automation or guarantee language'] : [])],
    requiredDisclaimer: reportSafety.requiredDisclaimer,
  };
}

export function ensureManualUpsellDelivery(channel: string) {
  const automatedChannels = ['AUTO_DM', 'AUTO_COMMENT', 'AUTO_MARKETPLACE_MESSAGE'];
  return {
    allowed: !automatedChannels.includes(channel),
    manualReviewRequired: channel === 'EMAIL_DRAFT' || channel === 'MANUAL_PLATFORM_MESSAGE',
  };
}
