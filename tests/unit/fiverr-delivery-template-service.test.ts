import { describe, expect, it } from 'vitest';
import { assertFiverrDeliveryMessageSafe, buildFiverrDeliveryTemplateDraft } from '@/server/services/fiverr-delivery-template-service';

describe('Fiverr delivery template', () => {
  it('uses marketplace-safe wording', () => {
    const draft = buildFiverrDeliveryTemplateDraft({ deliveryMode: 'FIVERR_MESSAGE_WITH_ALLOWED_LINK', includeExternalLink: true, externalLinkAllowed: false, buyerUsername: 'buyer', jobNumber: 'JOB-1', archiveFileName: 'delivery.zip' });
    expect(draft.message).toContain('platform-ready draft');
    expect(assertFiverrDeliveryMessageSafe(draft.message).safe).toBe(true);
  });

  it('flags unsafe guarantee wording', () => {
    expect(assertFiverrDeliveryMessageSafe('This guarantees ranking and sales increase.').safe).toBe(false);
  });
});
