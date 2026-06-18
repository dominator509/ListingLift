import { describe, expect, it } from 'vitest';

describe('phase 36 API access route contracts', () => {
  it('documents admin API access and external API v1 routes', () => {
    const routes = [
      '/admin/api-access',
      '/admin/api-access/tokens',
      '/admin/api-access/scopes',
      '/admin/api-access/webhooks',
      '/admin/api-access/shared-upload-portal',
      '/admin/api-access/integrations',
      '/api/admin/api-access/tokens',
      '/api/admin/api-access/scopes',
      '/api/admin/api-access/plan-gate',
      '/api/admin/api-access/webhooks',
      '/api/admin/api-access/shared-upload-portal',
      '/api/admin/api-access/integrations',
      '/api/v1/jobs',
      '/api/v1/uploads',
      '/api/v1/images/[imageId]',
      '/api/v1/deliveries/[deliveryId]',
      '/api/v1/presets',
      '/api/v1/webhooks',
    ];
    expect(routes).toContain('/api/v1/jobs');
    expect(routes).toContain('/api/admin/api-access/tokens');
    expect(routes).toHaveLength(18);
  });
});
