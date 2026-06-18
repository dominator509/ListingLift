import { Card } from '@/components/ui';
import { DEFAULT_ROLES } from '@/domain/roles';
import { PermissionChipList } from '@/components/rbac/permission-chip-list';

export function RoleMatrixCard() {
  return (
    <Card title="Role and permission matrix" description="Server-side permissions control every sensitive ListingLift action.">
      <div className="space-y-5">
        {DEFAULT_ROLES.map((role) => (
          <section key={role.key} className="rounded-xl border border-slate-200 p-4">
            <div className="mb-3">
              <h3 className="font-semibold text-slate-950">{role.name}</h3>
              <p className="text-sm text-slate-600">{role.description}</p>
            </div>
            <PermissionChipList role={role.key} />
          </section>
        ))}
      </div>
    </Card>
  );
}
