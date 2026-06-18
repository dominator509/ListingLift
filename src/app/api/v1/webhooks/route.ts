import { apiV1WebhookManageSchema } from '@/schemas/api-access';
import { parseJson } from '@/server/routes/route-helpers';
import { guardedApiTokenRoute } from '@/server/routes/api-token-route-helpers';

export async function GET(request: Request) {
  return guardedApiTokenRoute(request, 'webhooks:manage', (apiContext) => ({
    webhooks: [],
    organizationId: apiContext.organizationId,
    codexNote: 'Codex must list tenant-scoped webhooks without exposing signing secret hashes or encrypted references.',
  }));
}

export async function POST(request: Request) {
  return guardedApiTokenRoute(request, 'webhooks:manage', async (apiContext) => {
    const payload = apiV1WebhookManageSchema.parse(await parseJson(request, {}));
    return {
      dryRun: true,
      webhookAction: { ...payload, organizationId: apiContext.organizationId, signingSecretRequired: true, secretExposure: 'never' },
      codexNote: 'Codex must verify API token scope, store signing secret hash/reference only, add retries/dead-letter, rate-limit, and audit this action.',
    };
  });
}
