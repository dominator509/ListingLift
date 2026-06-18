import { agencyTeamInviteDraftSchema, type AgencyTeamInviteDraftInput } from '@/schemas/agency-white-label';
import type { AgencyTeamMemberInput } from '@/domain/agency-white-label';

export const demoAgencyTeamMembers: AgencyTeamMemberInput[] = [
  { id: 'agency_team_001', name: 'Maya Agency Admin', email: 'maya@example-agency.test', role: 'AGENCY_ADMIN', status: 'ACTIVE', clientWorkspaceCount: 3 },
  { id: 'agency_team_002', name: 'Theo Fulfillment Reviewer', email: 'theo@example-agency.test', role: 'FULFILLMENT_REVIEWER', status: 'ACTIVE', clientWorkspaceCount: 2 },
  { id: 'agency_team_003', name: 'Rin Billing Manager', email: 'rin@example-agency.test', role: 'BILLING_MANAGER', status: 'INVITED', clientWorkspaceCount: 0 },
];

export function buildAgencyTeamRows(members: AgencyTeamMemberInput[] = demoAgencyTeamMembers) {
  return members.map((member) => ({
    ...member,
    status: member.status ?? 'INVITED',
    clientWorkspaceCount: member.clientWorkspaceCount ?? 0,
    secretSafe: true,
  }));
}

export function buildAgencyTeamInviteDraft(input: AgencyTeamInviteDraftInput) {
  const parsed = agencyTeamInviteDraftSchema.parse(input);
  return {
    ...parsed,
    status: 'INVITED' as const,
    inviteTokenShown: false,
    inviteTokenStorage: 'Codex must store only a hashed invite token with expiration.',
    auditRequired: true,
    dryRun: true,
  };
}
