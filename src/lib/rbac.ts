import { ROLE_PERMISSIONS, type PermissionKey, type RoleKey } from '@/domain/permissions';

export function hasPermission(role: RoleKey, permission: PermissionKey): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function requirePermission(role: RoleKey, permission: PermissionKey): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Permission denied: ${role} lacks ${permission}`);
  }
}

export function assertTenantScope(resourceOrgId: string, activeOrgId: string): void {
  if (!resourceOrgId || resourceOrgId !== activeOrgId) {
    throw new Error('Tenant isolation violation');
  }
}
