import { jsonOk, mapServiceError } from '@/lib/api-response';
import { listSocialCommerceChannelMappings } from '@/server/services/social-commerce-channel-mapping-service';

export async function GET() {
  try {
    return jsonOk({ channels: listSocialCommerceChannelMappings(), note: 'Seed catalog route. Codex must reconcile persisted tenant-scoped mappings.' });
  } catch (error) {
    return mapServiceError(error);
  }
}
