export const AGENCY_CLIENT_STATUSES = ['LEAD', 'ACTIVE', 'PAUSED', 'ARCHIVED'] as const;

export type AgencyWorkspaceSummary = {
  organizationId: string;
  organizationName: string;
  portalName?: string | null;
  clientCount: number;
  activeJobCount: number;
  whiteLabelEnabled: boolean;
};

export type AgencyClientSummary = {
  id: string;
  organizationId: string;
  name: string;
  businessName?: string | null;
  status: (typeof AGENCY_CLIENT_STATUSES)[number];
  assignedAdminUserId?: string | null;
};

export function canUseWhiteLabelMode(input: { role: string; organizationType?: string | null }) {
  return input.role === 'AGENCY_ADMIN' || input.role === 'SUPER_ADMIN' || input.organizationType === 'AGENCY';
}

export function formatAgencyClientLabel(client: { businessName?: string | null; name: string }) {
  return client.businessName ? `${client.businessName} — ${client.name}` : client.name;
}
