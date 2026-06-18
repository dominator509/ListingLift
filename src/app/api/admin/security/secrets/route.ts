import { PERMISSIONS } from '@/domain/permissions';
import { parseJson, guardedSession } from '@/server/routes/route-helpers';
import { assertPermission } from '@/server/services/authorization-service';
import { securitySecretReferenceDraftSchema } from '@/schemas/security-hardening';
import { buildSecuritySecretReferenceDraft } from '@/server/services/secret-reference-service';

export async function POST(request: Request) {
  return guardedSession(request, async (session) => {
    assertPermission(session, PERMISSIONS.manageSecurity);
    const body = await parseJson(request, {});
    const parsed = securitySecretReferenceDraftSchema.parse({ ...(typeof body === 'object' && body !== null ? body : {}), organizationId: session.organizationId, createdByUserId: session.userId });
    const draft = buildSecuritySecretReferenceDraft(parsed);
    return {
      draft,
      codexNote: 'Scaffold only. Codex must persist encrypted secret references transactionally and never accept or return raw secret material from this route.',
    };
  });
}
