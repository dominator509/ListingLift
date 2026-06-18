import { describe, expect, it } from 'vitest';
import { redactEmailAddress } from '@/domain/delivery-notifications';
import { sendDeliveryNotification } from '@/server/services/delivery-notification-service';

describe('delivery email redaction', () => {
  it('redacts recipient email in send result', async () => {
    const result = await sendDeliveryNotification({ type: 'DOWNLOAD_READY', to: 'client@example.com', subject: 'Ready', bodyText: 'Body', dryRun: true });
    expect(result.redactedTo).toBe('c***@example.com');
    expect(redactEmailAddress('buyer@example.com')).toBe('b***@example.com');
  });
});
