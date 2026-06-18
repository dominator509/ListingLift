import { canClientViewPreview, type PreviewGalleryItem, type PreviewReviewStatus } from '@/domain/preview-gallery';

export function assertAdminCanReviewPreviews(input: { organizationId: string; jobOrganizationId: string }) {
  if (input.organizationId !== input.jobOrganizationId) {
    throw new Error('Preview access denied: job does not belong to the active organization.');
  }
}

export function filterClientVisiblePreviews(items: PreviewGalleryItem[], options: { clientPreviewEnabled: boolean }) {
  return items.filter((item) => canClientViewPreview({ reviewStatus: item.reviewStatus, approvedStatus: item.approvedStatus, clientPreviewEnabled: options.clientPreviewEnabled }));
}

export function buildPreviewVisibilityDecision(input: { clientPreviewEnabled: boolean; approvedStatus?: string | null; reviewStatus: PreviewReviewStatus }) {
  const clientVisible = canClientViewPreview({
    reviewStatus: input.reviewStatus,
    approvedStatus: input.approvedStatus,
    clientPreviewEnabled: input.clientPreviewEnabled,
  });
  return {
    clientVisible,
    reason: clientVisible ? 'Preview is approved and client preview access is enabled.' : 'Preview remains admin-only until approval and client preview access are enabled.',
  };
}
