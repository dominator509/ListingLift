import { jsonOk, mapServiceError } from '@/lib/api-response';
import { requireSession } from '@/server/services/auth-session-service';
import { generateCsrfToken } from '@/server/services/csrf-protection-service';

export async function GET(request: Request) {
  try {
    const session = await requireSession(request);
    const { token, expiresAt } = generateCsrfToken(session);
    return jsonOk({ csrfToken: token, expiresAt });
  } catch (error) {
    return mapServiceError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession(request);
    const { token, expiresAt } = generateCsrfToken(session);
    return jsonOk({ csrfToken: token, expiresAt });
  } catch (error) {
    return mapServiceError(error);
  }
}
