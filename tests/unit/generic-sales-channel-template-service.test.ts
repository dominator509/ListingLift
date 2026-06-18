import { describe, expect, it } from 'vitest';
import { createGenericProposalTemplate } from '@/server/services/generic-channel-template-service';

describe('generic sales channel templates', () => {
  it('uses compliance-safe proposal language', () => {
    const template = createGenericProposalTemplate({ channelKey: 'Contra', buyerName: 'Alex', imageCount: 25 });
    expect(template.body).toContain('platform-ready draft');
    expect(template.body).toContain('not guaranteed');
    expect(template.body.toLowerCase()).not.toContain('guaranteed sales');
  });
});
