import { PERMISSIONS } from '@/domain/permissions';
import { parseJson, guardedSession } from '@/server/routes/route-helpers';
import { assertPermission } from '@/server/services/authorization-service';
import { createCsrfTokenDraft, verifyCsrfTokenDraft } from '@/server/services/csrf-protection-service';
import { csrfTokenDraftSchema, csrfVerificationSchema } from '@/schemas/security-hardening';

export async function POST(request: Request) {
  return guardedSession(request, async (session) => {
    assertPermission(session, PERMISSIONS.manageSecurity);
    const body = await parseJson(request, {});
    const bodyObject = typeof body === 'object' && body !== null ? body : {};
    const csrfSecret = process.env.CSRF_SECRET ?? process.env.SESSION_SECRET ?? 'dev-csrf-secret-dev-csrf-secret';
    const baseInput = {
      ...bodyObject,
      sessionId: session.userId,
      organizationId: session.organizationId,
      csrfSecret,
    };
    const mode = typeof body === 'object' && body !== null && 'token' in body ? 'verify' : 'create';
    if (mode === 'verify') {
      const parsed = csrfVerificationSchema.parse(baseInput);
      return { result: verifyCsrfTokenDraft(parsed), codexNote: 'Codex must wire this to state-changing browser route contracts and store/derive token hashes safely.' };
    }
    const parsed = csrfTokenDraftSchema.parse({ expiresInMinutes: 30, ...baseInput });
    return { result: createCsrfTokenDraft(parsed), codexNote: 'Draft response includes raw CSRF token for browser use; Codex must store only hash or verify statelessly with server secret.' };
  });
}
