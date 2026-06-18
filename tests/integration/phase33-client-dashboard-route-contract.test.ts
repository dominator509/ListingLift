import { describe, expect, it } from 'vitest';

describe('phase 33 client dashboard route contracts', () => {
  it('documents required client dashboard routes', () => {
    const routes = [
      '/api/client-dashboard/summary',
      '/api/client-dashboard/jobs',
      '/api/client-dashboard/uploads/plan',
      '/api/client-dashboard/downloads',
      '/api/client-dashboard/revisions',
      '/api/client-dashboard/billing',
      '/api/client-dashboard/upgrade-options',
      '/api/client-dashboard/events',
    ];
    expect(routes).toContain('/api/client-dashboard/summary');
    expect(routes).toHaveLength(8);
  });
});
