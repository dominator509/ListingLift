import { describe, expect, it } from 'vitest';
import { PERMISSIONS } from '@/domain/permissions';
import { assertTenantScope, hasPermission } from '@/lib/rbac';

describe('rbac', () => {
  it('allows super admin to manage integrations', () => {
    expect(hasPermission('SUPER_ADMIN', PERMISSIONS.manageIntegrations)).toBe(true);
  });

  it('does not allow client viewer to approve outputs', () => {
    expect(hasPermission('CLIENT_VIEWER', PERMISSIONS.approveOutputs)).toBe(false);
  });

  it('blocks cross-tenant access', () => {
    expect(() => assertTenantScope('org-a', 'org-b')).toThrow('Tenant isolation violation');
  });
});
