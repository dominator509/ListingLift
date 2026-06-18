import { roleHasPermission } from '@/domain/rbac-matrix';
import { PERMISSIONS, type PermissionKey, type RoleKey } from '@/domain/permissions';
import { isClientScopedRole, isAgencyScopedRole } from '@/domain/tenant-rules';

export type MembershipScope = {
  organizationId: string;
  role: RoleKey;
  clientId?: string | null;
  agencyScope?: boolean | null;
};

export type ResourceScope = {
  organizationId: string;
  clientId?: string | null;
  assignedAdminUserId?: string | null;
  ownerUserId?: string | null;
};

export type AccessDecision = {
  allowed: boolean;
  reason: string;
};

export function evaluatePermission(scope: MembershipScope, permission: PermissionKey): AccessDecision {
  if (!roleHasPermission(scope.role, permission)) {
    return { allowed: false, reason: `role_lacks_permission:${permission}` };
  }

  if (scope.role === 'CLIENT_VIEWER' && ([PERMISSIONS.manageBilling, PERMISSIONS.uploadImages, PERMISSIONS.requestRevisions] as PermissionKey[]).includes(permission)) {
    return { allowed: false, reason: 'client_viewer_read_only' };
  }

  return { allowed: true, reason: 'permission_granted' };
}

export function evaluateTenantAccess(scope: MembershipScope, resource: ResourceScope): AccessDecision {
  if (scope.role === 'SUPER_ADMIN') return { allowed: true, reason: 'super_admin_global' };

  if (scope.organizationId !== resource.organizationId) {
    return { allowed: false, reason: 'organization_mismatch' };
  }

  if (isClientScopedRole(scope.role)) {
    if (!scope.clientId) return { allowed: false, reason: 'client_role_missing_client_scope' };
    if (resource.clientId && scope.clientId !== resource.clientId) return { allowed: false, reason: 'client_scope_mismatch' };
  }

  if (isAgencyScopedRole(scope.role) && scope.agencyScope === false) {
    return { allowed: false, reason: 'agency_scope_required' };
  }

  return { allowed: true, reason: 'tenant_scope_granted' };
}

export function assertAccess(decision: AccessDecision) {
  if (!decision.allowed) throw new Error(`Permission denied: ${decision.reason}`);
}

export function assertPermissionAndTenant(scope: MembershipScope, permission: PermissionKey, resource: ResourceScope) {
  assertAccess(evaluatePermission(scope, permission));
  assertAccess(evaluateTenantAccess(scope, resource));
}

export function canViewRevenue(scope: MembershipScope) {
  return evaluatePermission(scope, PERMISSIONS.viewRevenue).allowed;
}
