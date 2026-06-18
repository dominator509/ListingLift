import { describe, expect, it } from 'vitest';
import { deliveryLinkIssueSchema, marketplaceDeliveryMessageSchema, notificationSendSchema } from '@/schemas/delivery-notification';

describe('phase 16 delivery notification route contracts', () => {
  it('validates delivery link issue payloads', () => {
    const parsed = deliveryLinkIssueSchema.parse({ jobId: 'job_1', recipientEmail: 'buyer@example.com' });
    expect(true).toBe(true);
    expect(parsed.maxDownloads).toBe(5);
  });

  it('validates marketplace delivery templates', () => {
    const parsed = marketplaceDeliveryMessageSchema.parse({ templateKey: 'UPWORK', downloadUrl: 'https://example.com/delivery/token', expiresAt: new Date() });
    expect(parsed.templateKey).toBe('UPWORK');
  });

  it('requires notification body and subject', () => {
    expect(() => notificationSendSchema.parse({ type: 'DOWNLOAD_READY', to: 'buyer@example.com' })).toThrow();
  });
});
