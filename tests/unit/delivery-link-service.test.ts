import { describe, expect, it } from 'vitest';
import { evaluateDeliveryAccess } from '@/domain/delivery-notifications';
import { issueDeliveryLinkDraft } from '@/server/services/delivery-link-service';

describe('delivery link service', () => {
  it('issues raw token only in draft output and stores a separate hash', () => {
    const draft = issueDeliveryLinkDraft({ jobId: 'job_1', recipientEmail: 'buyer@example.com', expiresInMinutes: 60, maxDownloads: 3, sendEmail: true, marketplaceTemplateKey: 'DIRECT_WEBSITE' });
    expect(draft.token).not.toEqual(draft.tokenHash);
    expect(draft.tokenHash).toHaveLength(64);
    expect(draft.publicUrl).toContain('/delivery/');
  });

  it('blocks delivery unless approval, archive approval, active token, and ready job are present', () => {
    const decision = evaluateDeliveryAccess({
      jobId: 'job_1',
      jobStatus: 'WAITING_FOR_REVIEW',
      deliveryLinkStatus: 'ACTIVE',
      deliveryArchiveStatus: 'APPROVED',
      tokenExpiresAt: new Date(Date.now() + 60_000),
      approvedAt: null,
      deliveryArchiveApprovedAt: new Date(),
    });
    expect(decision.allowed).toBe(false);
    expect(decision.blockers.length).toBeGreaterThan(0);
  });
});
