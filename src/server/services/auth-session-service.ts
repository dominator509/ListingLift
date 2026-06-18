import { resolveSessionFromRequest } from '@/server/auth/auth-service';
import { parseSessionCookie } from '@/server/auth/session-cookie';

export async function requireSession(request: Request) {
  const session = await resolveSessionFromRequest(request);
  if (!session) {
    throw Object.assign(new Error('Authentication required.'), { code: 'SESSION_REQUIRED' });
  }
  return session;
}

export async function resolveSessionOptional(request: Request) {
  return resolveSessionFromRequest(request);
}
