import { jsonFail, jsonOk, mapServiceError } from '@/lib/api-response';
import { requireSession } from '@/server/services/auth-session-service';
import { assertPermission } from '@/server/services/authorization-service';
import { checkIdempotency, storeIdempotency } from '@/server/services/idempotency-service';
import { verifyCsrfForRequest } from '@/server/services/csrf-protection-service';
import { prisma } from '@/lib/prisma';
import { recordAuditLog } from '@/server/services/audit-log-service';

export async function POST(request: Request, { params }: { params: Promise<{ linkId: string }> }) {
  try {
    const session = await requireSession(request);
    verifyCsrfForRequest(request, session);
    assertPermission(session, 'send:delivery');

    const idemp = await checkIdempotency(request, session);
    if (!idemp.shouldProcess) {
      return Response.json(idemp.body, { status: idemp.status });
    }

    const linkId = (await params).linkId;

    const link = await prisma.deliveryLink.findUnique({
      where: { id: linkId },
      select: { id: true, status: true, revokedAt: true, jobId: true },
    });

    if (!link) {
      return jsonFail('NOT_FOUND', 'Delivery link not found.', 404);
    }

    if (link.status !== 'ACTIVE') {
      return jsonFail('CONFLICT', `Cannot revoke delivery link in status '${link.status}'. Only ACTIVE links can be revoked.`, 409);
    }

    const now = new Date();
    const updated = await prisma.deliveryLink.update({
      where: { id: linkId },
      data: {
        status: 'REVOKED',
        revokedAt: now,
        revokedByUserId: session.userId,
      },
      select: { id: true, status: true, revokedAt: true, jobId: true },
    });

    // Record audit log for the revocation
    await recordAuditLog({
      organizationId: session.organizationId,
      actorUserId: session.userId,
      jobId: link.jobId,
      action: 'delivery.link_revoked',
      targetType: 'DeliveryLink',
      targetId: linkId,
      metadata: { previousStatus: link.status, revokedAt: now.toISOString() },
    });

    const result = {
      linkId: updated.id,
      status: updated.status,
      revokedAt: updated.revokedAt?.toISOString(),
      jobId: updated.jobId,
    };

    await storeIdempotency(request, session, 200, result);

    return jsonOk(result);
  } catch (error) {
    return mapServiceError(error);
  }
}
