import { PERMISSIONS } from '@/domain/permissions';
import { guardedGet } from '@/server/routes/route-helpers';
import { getImageProviderReadinessReport } from '@/server/services/image-provider-health-service';

export async function GET(request: Request) {
  return guardedGet(request, PERMISSIONS.manageIntegrations, () => getImageProviderReadinessReport());
}
