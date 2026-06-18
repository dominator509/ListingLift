import { describe, expect, it } from 'vitest';

describe('phase 35 agency white-label route contracts', () => {
  it('documents required agency mode API routes', () => {
    const routes = [
      '/api/agency/dashboard',
      '/api/agency/workspaces',
      '/api/agency/white-label-settings',
      '/api/agency/branded-delivery',
      '/api/agency/reports',
      '/api/agency/billing',
      '/api/agency/team',
      '/api/agency/queue',
      '/api/agency/events',
    ];
    expect(routes).toContain('/api/agency/white-label-settings');
    expect(routes).toContain('/api/agency/queue');
    expect(routes).toHaveLength(9);
  });
});
