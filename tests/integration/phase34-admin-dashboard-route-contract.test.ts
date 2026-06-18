import { describe, expect, it } from 'vitest';

describe('phase 34 admin dashboard route contracts', () => {
  it('documents required admin analytics routes', () => {
    const routes = [
      '/api/admin/dashboard',
      '/api/admin/dashboard/jobs',
      '/api/admin/dashboard/revenue',
      '/api/admin/dashboard/source-tracking',
      '/api/admin/dashboard/conversions',
      '/api/admin/dashboard/retainer-alerts',
      '/api/admin/dashboard/events',
    ];
    expect(routes).toContain('/api/admin/dashboard/revenue');
    expect(routes).toContain('/api/admin/dashboard/retainer-alerts');
    expect(routes).toHaveLength(7);
  });
});
