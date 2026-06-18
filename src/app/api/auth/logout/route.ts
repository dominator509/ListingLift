import { type NextRequest } from 'next/server';
import { logout } from '@/server/auth/auth-service';
import { attachClearSessionCookie, authError, authJson, requestAuthMeta } from '@/server/auth/route-utils';

export async function POST(request: NextRequest) {
  try {
    await logout(request);
    return attachClearSessionCookie(authJson({ loggedOut: true }));
  } catch (error) {
    return authError(error);
  }
}
