import { type NextRequest } from 'next/server';
import { accountSettingsSchema } from '@/schemas/auth';
import { requireSession } from '@/server/services/auth-session-service';
import { updateAccountSettings } from '@/server/services/account-service';
import { authError, authJson } from '@/server/auth/route-utils';
import { verifyCsrfForRequest } from '@/server/services/csrf-protection-service';

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireSession(request);
    verifyCsrfForRequest(request, session);
    const settings = accountSettingsSchema.parse(await request.json());
    const user = await updateAccountSettings({ userId: session.userId, organizationId: session.organizationId, settings });
    return authJson({ user });
  } catch (error) {
    return authError(error);
  }
}
