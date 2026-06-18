import { addMinutes } from '@/lib/date';
import { randomToken, sha256 } from '@/lib/hash';
import { deliveryLinkCreateSchema, type DeliveryLinkCreateInput } from '@/schemas/delivery';

export function createDeliveryToken(input: DeliveryLinkCreateInput) {
  const data = deliveryLinkCreateSchema.parse(input);
  const token = randomToken();
  return {
    jobId: data.jobId,
    token,
    tokenHash: sha256(token),
    expiresAt: addMinutes(new Date(), data.expiresInMinutes),
    approvedOnly: data.approvedOnly,
  };
}

export function hashDeliveryToken(token: string) {
  return sha256(token);
}
