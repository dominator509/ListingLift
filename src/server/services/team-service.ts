import { DEFAULT_ROLES } from '@/domain/roles';
import { type RoleKey } from '@/domain/permissions';
import { teamInviteSchema, membershipUpdateSchema, type TeamInviteInput, type MembershipUpdateInput } from '@/schemas/rbac';
import { type SessionContext } from '@/schemas/auth';
import { assertPermission } from '@/server/services/authorization-service';

const ROLE_RANK: Record<RoleKey, number> = {
  SUPER_ADMIN: 100,
  OPERATOR: 80,
  AGENCY_ADMIN: 70,
  FULFILLMENT_REVIEWER: 55,
  DESIGNER_EDITOR: 50,
  BILLING_MANAGER: 45,
  CLIENT_OWNER: 30,
  CLIENT_VIEWER: 10,
};

export function validateTeamInvite(input: TeamInviteInput) {
  return teamInviteSchema.parse(input);
}

export function validateMembershipUpdate(input: MembershipUpdateInput) {
  return membershipUpdateSchema.parse(input);
}

export function assertCanManageRole(actor: SessionContext, targetRole: RoleKey) {
  assertPermission(actor, 'manage:team');
  if (actor.role !== 'SUPER_ADMIN' && ROLE_RANK[targetRole] >= ROLE_RANK[actor.role]) {
    throw new Error('Permission denied: cannot assign a role equal to or higher than the actor role.');
  }
}

export function getAssignableRoles(actor: SessionContext) {
  return DEFAULT_ROLES.filter((role) => {
    if (actor.role === 'SUPER_ADMIN') return true;
    return ROLE_RANK[role.key] < ROLE_RANK[actor.role];
  });
}

export function buildMembershipCreateData(actor: SessionContext, input: TeamInviteInput, userId: string, roleId: string) {
  assertCanManageRole(actor, input.roleKey);
  const parsed = validateTeamInvite(input);
  return {
    organizationId: actor.organizationId,
    userId,
    roleId,
    roleKey: parsed.roleKey,
    clientId: parsed.clientId ?? null,
    agencyScope: parsed.agencyScope,
  };
}
