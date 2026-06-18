import {
  AGENCY_WHITE_LABEL_SAFE_COPY,
  buildAgencyWorkspaceLabel,
  getAgencyWorkspaceStatusTone,
  normalizeAgencyWorkspaceStatus,
  summarizeAgencyWorkspaces,
  type AgencyWorkspaceInput,
} from '@/domain/agency-white-label';
import { agencyWorkspaceDraftSchema, agencyWorkspaceQuerySchema, type AgencyWorkspaceDraftInput, type AgencyWorkspaceQuery } from '@/schemas/agency-white-label';

export const demoAgencyWorkspaces: AgencyWorkspaceInput[] = [
  { id: 'agency_workspace_aster', clientId: 'client_aster', clientName: 'Aster Handmade', workspaceName: 'Aster Handmade Marketplace Studio', status: 'ACTIVE', sourceChannels: ['Etsy', 'Shopify'], activeJobs: 3, completedJobs: 12, monthlyImageVolume: 180, whiteLabelEnabled: true, brandedReportsEnabled: true, lastDeliveryAt: '2026-06-05T18:00:00.000Z' },
  { id: 'agency_workspace_northstar', clientId: 'client_northstar', clientName: 'Northstar Goods', workspaceName: 'Northstar Product Launches', status: 'ACTIVE', sourceChannels: ['Shopify', 'Amazon'], activeJobs: 2, completedJobs: 7, monthlyImageVolume: 320, whiteLabelEnabled: true, brandedReportsEnabled: true, lastDeliveryAt: '2026-06-03T18:00:00.000Z' },
  { id: 'agency_workspace_bright', clientId: 'client_bright', clientName: 'Bright Pantry', workspaceName: 'Bright Pantry Social Commerce', status: 'PAUSED', sourceChannels: ['TikTok Shop', 'Instagram'], activeJobs: 1, completedJobs: 4, monthlyImageVolume: 96, whiteLabelEnabled: false, brandedReportsEnabled: false, lastDeliveryAt: '2026-05-28T18:00:00.000Z' },
];

export function validateAgencyWorkspaceDraft(input: AgencyWorkspaceDraftInput) {
  return agencyWorkspaceDraftSchema.parse(input);
}

export function filterAgencyWorkspaces(workspaces: AgencyWorkspaceInput[], query: Record<string, unknown> = {}) {
  const parsed = agencyWorkspaceQuerySchema.parse(query);
  return workspaces
    .filter((workspace) => (parsed.status ? normalizeAgencyWorkspaceStatus(workspace.status) === parsed.status : true))
    .filter((workspace) => (parsed.whiteLabelOnly ? Boolean(workspace.whiteLabelEnabled) : true))
    .filter((workspace) => {
      if (!parsed.search) return true;
      const haystack = `${workspace.clientName} ${workspace.workspaceName} ${(workspace.sourceChannels ?? []).join(' ')}`.toLowerCase();
      return haystack.includes(parsed.search.toLowerCase());
    });
}

export function buildAgencyWorkspaceRows(workspaces: AgencyWorkspaceInput[] = demoAgencyWorkspaces, query: Record<string, unknown> = {}) {
  return filterAgencyWorkspaces(workspaces, query).map((workspace) => {
    const status = normalizeAgencyWorkspaceStatus(workspace.status);
    return {
      ...workspace,
      label: buildAgencyWorkspaceLabel(workspace),
      status,
      statusTone: getAgencyWorkspaceStatusTone(status),
      sourceChannels: workspace.sourceChannels ?? [],
      activeJobs: workspace.activeJobs ?? 0,
      completedJobs: workspace.completedJobs ?? 0,
      monthlyImageVolume: workspace.monthlyImageVolume ?? 0,
      whiteLabelEnabled: Boolean(workspace.whiteLabelEnabled),
      brandedReportsEnabled: Boolean(workspace.brandedReportsEnabled),
    };
  });
}

export function buildAgencyWorkspaceSummary(workspaces: AgencyWorkspaceInput[] = demoAgencyWorkspaces) {
  return {
    ...summarizeAgencyWorkspaces(workspaces),
    safeCopy: AGENCY_WHITE_LABEL_SAFE_COPY.runtimeNotice,
    dryRun: true,
  };
}
