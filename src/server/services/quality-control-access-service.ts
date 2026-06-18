import { type PreviewGalleryItem } from '@/domain/preview-gallery';

export function canExposeQualityReviewToClient(input: { approvedStatus?: string | null; reviewStatus?: string | null; visibility?: string | null }) {
  return input.approvedStatus?.toUpperCase() === 'APPROVED' && input.reviewStatus?.toUpperCase() === 'PASSED' && input.visibility?.toUpperCase() === 'CLIENT_VISIBLE';
}

export function redactQualityReviewForClient<T extends { adminNotes?: string | null; flags?: string[] | null; finalDeliveryBlocked?: boolean }>(review: T) {
  return {
    ...review,
    adminNotes: undefined,
    flags: canExposeQualityReviewToClient({ approvedStatus: 'APPROVED', reviewStatus: review.finalDeliveryBlocked ? 'FLAGGED' : 'PASSED', visibility: 'CLIENT_VISIBLE' }) ? review.flags : [],
  };
}

export function assertPreviewItemStillAdminOnlyWhenFlagged(item: PreviewGalleryItem) {
  if ((item.flags?.length ?? 0) > 0 && item.clientVisible) {
    throw new Error('Flagged preview items must not be client-visible.');
  }
  return true;
}
