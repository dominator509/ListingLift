import { QA_SMOKE_ROUTE_TARGETS } from '@/domain/full-testing-qa';

export function getQaSmokeRouteTargets(group?: string) {
  return QA_SMOKE_ROUTE_TARGETS.filter((target) => !group || target.group === group).map((target) => ({
    ...target,
    routeCount: target.routes.length,
    requiredHeaders: target.group.startsWith('admin')
      ? { 'x-demo-user-id': 'user_qa', 'x-demo-organization-id': 'org_qa', 'x-demo-role': 'SUPER_ADMIN' }
      : target.group === 'client'
        ? { 'x-demo-user-id': 'user_client_qa', 'x-demo-organization-id': 'org_qa', 'x-demo-role': 'CLIENT_OWNER', 'x-demo-client-id': 'client_qa' }
        : target.group === 'agency'
          ? { 'x-demo-user-id': 'user_agency_qa', 'x-demo-organization-id': 'org_qa', 'x-demo-role': 'AGENCY_ADMIN', 'x-demo-agency-scope': 'true' }
          : {},
    status: 'CODEX_REQUIRED' as const,
    codexNote: 'Codex must browser-render this route group and attach screenshot/trace evidence before marking PASS.',
  }));
}

export function summarizeQaSmokeTargets() {
  const groups = getQaSmokeRouteTargets();
  return {
    groupCount: groups.length,
    routeCount: groups.reduce((sum, group) => sum + group.routeCount, 0),
    productionReady: false,
  };
}
