import { apiV1JobCreateSchema } from '@/schemas/api-access';
import { parseJson } from '@/server/routes/route-helpers';
import { guardedApiTokenRoute } from '@/server/routes/api-token-route-helpers';

export async function GET(request: Request) {
  return guardedApiTokenRoute(request, 'jobs:read', (apiContext) => ({
    jobs: [],
    apiContext: { organizationId: apiContext.organizationId, tokenHashPreview: apiContext.tokenHashPreview, dryRun: apiContext.dryRun },
    codexNote: 'Codex must return tenant-scoped job summaries and exclude private admin notes, secrets, and unapproved delivery data.',
  }));
}

export async function POST(request: Request) {
  return guardedApiTokenRoute(request, 'jobs:create', async (apiContext) => {
    const payload = apiV1JobCreateSchema.parse(await parseJson(request, {}));
    return {
      dryRun: true,
      jobDraft: { ...payload, organizationId: apiContext.organizationId, sourceChannel: payload.sourceChannel || 'api', status: 'WAITING_FOR_UPLOAD', manualReviewRequired: true },
      codexNote: 'Codex must create jobs transactionally after dedupe, package mapping, plan checks, source attribution, tenant isolation, and audit logging.',
    };
  });
}
