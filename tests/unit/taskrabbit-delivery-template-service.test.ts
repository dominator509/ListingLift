import { describe, expect, it } from 'vitest';
import { createTaskrabbitDeliveryMessage } from '@/server/services/taskrabbit-delivery-template-service';

describe('taskrabbit delivery template service', () => {
  it('uses safe non-guarantee language', () => {
    const result = createTaskrabbitDeliveryMessage({ customerName: 'Alex', taskId: 'tr-9', includeExternalLink: true, externalLinkAllowed: true });
    expect(result.deliveryMessage).toContain('platform-ready draft');
    expect(result.deliveryMessage).toContain('not guaranteed');
    expect(result.deliveryMessage.toLowerCase()).not.toContain('guaranteed sales');
  });
});
