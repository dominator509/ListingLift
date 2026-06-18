import { describe, expect, it } from 'vitest';
import { buildDeliveryEmailPreview } from '@/server/services/delivery-email-template-service';

describe('delivery email templates', () => {
  it('uses compliance-safe language and avoids guarantees', () => {
    const preview = buildDeliveryEmailPreview({ jobId: 'JOB-1', recipientEmail: 'buyer@example.com', downloadUrl: 'https://example.com/delivery/token', expiresAt: new Date('2030-01-01'), notificationType: 'DOWNLOAD_READY' });
    expect(preview.bodyText).toContain('platform-ready drafts');
    expect(preview.bodyText).toContain('not guaranteed');
    expect(preview.bodyText.toLowerCase()).not.toContain('guaranteed marketplace approval');
  });
});
