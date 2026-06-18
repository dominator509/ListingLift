import { describe, expect, it } from 'vitest';
import { adminAnalyticsCopyContainsUnsafeGuarantee } from '@/domain/admin-dashboard-analytics';
import { assertAdminDashboardAnalyticsAccess, canAccessAdminAnalytics } from '@/server/services/admin-dashboard-security-service';

describe('admin dashboard analytics access', () => {
  it('allows admin revenue roles with tenant match', () => {
    expect(assertAdminDashboardAnalyticsAccess({ organizationId: 'org-a', userId: 'u1', role: 'OPERATOR' }, { organizationId: 'org-a' })).toBe(true);
    expect(canAccessAdminAnalytics({ organizationId: 'org-a', userId: 'u2', role: 'BILLING_MANAGER' })).toBe(true);
  });

  it('blocks cross-tenant and client-scoped access', () => {
    expect(() => assertAdminDashboardAnalyticsAccess({ organizationId: 'org-a', userId: 'u1', role: 'OPERATOR' }, { organizationId: 'org-b' })).toThrow(/Tenant scope/);
    expect(canAccessAdminAnalytics({ organizationId: 'org-a', userId: 'client-user', role: 'CLIENT_OWNER', clientId: 'client-a' })).toBe(false);
  });

  it('detects unsafe analytics or upsell claims', () => {
    expect(adminAnalyticsCopyContainsUnsafeGuarantee('This does not guarantee sales or approval.')).toBe(false);
    expect(adminAnalyticsCopyContainsUnsafeGuarantee('Guaranteed sales from this image pack.')).toBe(true);
  });
});
