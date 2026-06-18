import { guardedApiTokenRoute } from '@/server/routes/api-token-route-helpers';

export async function GET(request: Request) {
  return guardedApiTokenRoute(request, 'presets:read', (apiContext) => ({
    presets: [],
    organizationId: apiContext.organizationId,
    codexNote: 'Codex must return platform preset catalog and tenant-scoped custom presets without leaking private draft settings.',
  }));
}

export async function POST(request: Request) {
  return guardedApiTokenRoute(request, 'presets:write', () => ({
    dryRun: true,
    presetDraft: { reviewStatus: 'NEEDS_REVIEW', manualApprovalRequired: true },
    codexNote: 'Codex must persist custom preset drafts with admin review before production use.',
  }));
}
