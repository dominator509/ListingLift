import { PERMISSIONS } from '@/domain/permissions';
import { guardedGet } from '@/server/routes/route-helpers';

export async function GET(request: Request) {
  return guardedGet(request, 'manage:team', async () => ({ items: Object.values(PERMISSIONS) }));
}
