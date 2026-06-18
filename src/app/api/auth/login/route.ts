import { type NextRequest } from 'next/server';
import { loginSchema } from '@/schemas/auth';
import { login } from '@/server/auth/auth-service';
import { attachSessionCookie, authError, authJson, requestAuthMeta } from '@/server/auth/route-utils';

export async function POST(request: NextRequest) {
  try {
    const body = loginSchema.parse(await request.json());
    const result = await login(body, requestAuthMeta(request));
    return attachSessionCookie(authJson({ user: result.user, session: result.session }), result.sessionToken);
  } catch (error) {
    return authError(error);
  }
}
