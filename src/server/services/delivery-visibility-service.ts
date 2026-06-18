import { isExpired } from '@/lib/date';

export type DeliveryVisibilityInput = {
  jobStatus: string;
  approvedAt?: Date | string | null;
  deliveryLinkStatus: string;
  expiresAt: Date;
  approvedOnly?: boolean;
};

export function canShowClientDownload(input: DeliveryVisibilityInput) {
  if (input.deliveryLinkStatus !== 'ACTIVE') return false;
  if (isExpired(input.expiresAt)) return false;
  if (input.approvedOnly !== false && !input.approvedAt) return false;
  return ['READY_FOR_DELIVERY', 'DELIVERED', 'COMPLETED'].includes(input.jobStatus);
}
