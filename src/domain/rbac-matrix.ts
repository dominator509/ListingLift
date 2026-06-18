import { ROLE_PERMISSIONS, type PermissionKey, type RoleKey } from '@/domain/permissions';

export type PermissionMatrixRow = {
  role: RoleKey;
  permissions: PermissionKey[];
};

export const RBAC_MATRIX: PermissionMatrixRow[] = Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => ({
  role: role as RoleKey,
  permissions: permissions as PermissionKey[],
}));

export function roleHasPermission(role: RoleKey, permission: PermissionKey) {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
