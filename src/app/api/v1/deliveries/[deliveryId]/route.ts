import { guardedApiTokenRoute } from '@/server/routes/api-token-route-helpers';

export async function GET(request: Request, context: { params: Promise<{ deliveryId: string }> }) {
  return guardedApiTokenRoute(request, 'deliveries:read', async (apiContext) => {
    const { deliveryId } = await context.params;
    return {
      delivery: { id: deliveryId, organizationId: apiContext.organizationId, approvedOnly: true, downloadUrl: '[not-exposed-before-token-gate]' },
      codexNote: 'Codex must enforce approved archive, QC, manual approval, expiring delivery token, download limits, and client scope before returning delivery data.',
    };
  });
}
