import { Badge } from '@/components/ui';
import { ROLE_PERMISSIONS, type RoleKey } from '@/domain/permissions';

export function PermissionChipList({ role }: { role: RoleKey }) {
  const permissions = ROLE_PERMISSIONS[role] ?? [];
  return (
    <div className="flex flex-wrap gap-2">
      {permissions.map((permission) => (
        <Badge key={permission}>{permission}</Badge>
      ))}
    </div>
  );
}
