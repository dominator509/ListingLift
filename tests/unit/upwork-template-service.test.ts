import { describe, expect, it } from 'vitest';
import { assertUpworkMessageSafe, buildUpworkDeliveryTemplateDraft, buildUpworkProposalTemplateDraft, buildUpworkRetainerReminderDraft } from '@/server/services/upwork-template-service';

describe('upwork template service', () => {
  it('adds marketplace-safe language to proposals', () => {
    const draft = buildUpworkProposalTemplateDraft({ contractType: 'FIXED_PRICE', contractTitle: 'Amazon image cleanup', imageAllowance: 50 });
    expect(draft.message).toContain('not guaranteed');
    expect(assertUpworkMessageSafe(draft.message).safe).toBe(true);
  });

  it('blocks unsafe guarantee language', () => {
    expect(assertUpworkMessageSafe('Guaranteed Amazon approval and sales').safe).toBe(false);
  });

  it('creates delivery and retainer templates', () => {
    expect(buildUpworkDeliveryTemplateDraft({ deliveryMode: 'MANUAL_EXTERNAL_DELIVERY_RECORDED', includeExternalLink: false, externalLinkAllowed: false, contractId: 'up-1' }).message).toContain('Upwork');
    expect(buildUpworkRetainerReminderDraft({ monthlyImageEstimate: 100 }).message).toContain('monthly');
  });
});
