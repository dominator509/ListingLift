import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { requireSession } from '@/server/services/auth-session-service';
import { assertPermission } from '@/server/services/authorization-service';
import { createDeliveryToken } from '@/server/services/delivery-token-service';
import { verifyCsrfForRequest } from '@/server/services/csrf-protection-service';

export async function POST(request: Request) {
  try {
    const session = await requireSession(request);
    verifyCsrfForRequest(request, session);
    assertPermission(session, 'send:delivery');
    const body = await parseJson<Record<string, unknown>>(request, { jobId: '' });
    const token = createDeliveryToken({ jobId: (body.jobId as string) || '', expiresInMinutes: (body.expiresInMinutes as number) || 1440, approvedOnly: (body.approvedOnly as boolean) ?? false });
    return jsonOk({ ...token, tokenHash: '[redacted]' });
  } catch (error) {
    return mapServiceError(error);
  }
}
