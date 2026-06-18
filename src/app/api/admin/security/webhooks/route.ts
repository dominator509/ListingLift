import { PERMISSIONS } from '@/domain/permissions';
import { parseJson, guardedSession } from '@/server/routes/route-helpers';
import { assertPermission } from '@/server/services/authorization-service';
import { webhookSignatureProbeSchema } from '@/schemas/security-hardening';
import { buildWebhookVerificationDecision, requiredWebhookHeaders } from '@/server/services/security-webhook-verification-service';

export async function POST(request: Request) {
  return guardedSession(request, async (session) => {
    assertPermission(session, PERMISSIONS.manageSecurity);
    const body = webhookSignatureProbeSchema.parse(await parseJson(request, {}));
    return {
      decision: buildWebhookVerificationDecision(body),
      requiredHeaders: requiredWebhookHeaders(body.provider),
      codexNote: 'Dry-run only. Codex must verify raw request bodies and provider signatures before paid/client-facing state changes for organization ' + session.organizationId + '.',
    };
  });
}
