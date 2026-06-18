import { describe, expect, it } from 'vitest';
import { assertSameOrganization, scopedWhere } from '@/server/services/tenant-service';

const clientOwner = { userId: 'u1', organizationId: 'org_1', role: 'CLIENT_OWNER' as const };

describe('tenant isolation service', () => {
  it('allows same-organization access', () => {
    expect(() => assertSameOrganization(clientOwner, { organizationId: 'org_1' })).not.toThrow();
  });

  it('blocks cross-organization access for non-super admins', () => {
    expect(() => assertSameOrganization(clientOwner, { organizationId: 'org_2' })).toThrow(/Tenant isolation/);
  });

  it('returns scoped where clause for normal users', () => {
    expect(scopedWhere(clientOwner)).toEqual({ organizationId: 'org_1' });
  });
});
