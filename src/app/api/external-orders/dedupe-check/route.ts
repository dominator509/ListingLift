import { jsonOk, mapServiceError } from '@/lib/api-response';
import { normalizedExternalOrderSchema } from '@/schemas/sales-channel';
import { parseJson } from '@/server/routes/route-helpers';
import { requireSession } from '@/server/services/auth-session-service';
import { assertPermission } from '@/server/services/authorization-service';
import { externalOrderDedupeKey } from '@/server/services/external-order-service';
import { verifyCsrfForRequest } from '@/server/services/csrf-protection-service';

export async function POST(request: Request) {
  try {
    const session = await requireSession(request);
    verifyCsrfForRequest(request, session);
    assertPermission(session, 'manage:sales-channels');
    const body = await parseJson<Record<string, unknown>>(request, {});
    const order = normalizedExternalOrderSchema.parse(body);
    const key = externalOrderDedupeKey(order, session.organizationId);
    return jsonOk({ dedupeKey: key, note: 'Codex must query Prisma for this key before creating external orders.' });
  } catch (error) {
    return mapServiceError(error);
  }
}
