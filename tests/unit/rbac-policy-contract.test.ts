import { describe, expect, it } from 'vitest';
import { PERMISSIONS } from '@/domain/permissions';
import { evaluatePermission, evaluateTenantAccess } from '@/server/services/rbac-policy-service';

const baseScope = { organizationId: 'org_1', role: 'CLIENT_OWNER' as const, clientId: 'client_1' };

describe('RBAC policy contract', () => {
  it('allows client owners to view their dashboard', () => {
    expect(evaluatePermission(baseScope, PERMISSIONS.viewClientDashboard)).toEqual({ allowed: true, reason: 'permission_granted' });
  });

  it('blocks client viewers from mutation-style client actions', () => {
    expect(evaluatePermission({ ...baseScope, role: 'CLIENT_VIEWER' }, PERMISSIONS.uploadImages).allowed).toBe(false);
  });

  it('blocks cross-organization access', () => {
    expect(evaluateTenantAccess(baseScope, { organizationId: 'org_2', clientId: 'client_1' })).toEqual({
      allowed: false,
      reason: 'organization_mismatch',
    });
  });

  it('blocks cross-client access for client-scoped roles', () => {
    expect(evaluateTenantAccess(baseScope, { organizationId: 'org_1', clientId: 'client_2' })).toEqual({
      allowed: false,
      reason: 'client_scope_mismatch',
    });
  });

  it('allows super admin global tenant access', () => {
    expect(evaluateTenantAccess({ organizationId: 'org_1', role: 'SUPER_ADMIN' }, { organizationId: 'org_2', clientId: 'client_2' }).allowed).toBe(true);
  });
});
