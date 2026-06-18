import { describe, expect, it } from 'vitest';
import { buildDownloadTrackingEvent } from '@/server/services/delivery-download-tracking-service';
import { issueDeliveryLinkDraft } from '@/server/services/delivery-link-service';

describe('delivery token security', () => {
  it('tracks token hash and does not require storing raw token in event draft', () => {
    const link = issueDeliveryLinkDraft({ jobId: 'job_1', recipientEmail: 'buyer@example.com', expiresInMinutes: 60, maxDownloads: 3, sendEmail: true, marketplaceTemplateKey: 'DIRECT_WEBSITE' });
    const event = buildDownloadTrackingEvent({ token: link.token, eventType: 'DOWNLOAD_STARTED' });
    expect(event.tokenHash).toHaveLength(64);
    expect(event.tokenHash).not.toEqual(link.token);
  });
});
