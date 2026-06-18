import { type NextRequest } from 'next/server';
import { requireSession } from '@/server/services/auth-session-service';
import { authError, authJson } from '@/server/auth/route-utils';

export async function GET(request: NextRequest) {
  try {
    const session = await requireSession(request);
    return authJson({ session });
  } catch (error) {
    return authError(error, 401);
  }
}
