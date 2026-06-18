import { PageHeader } from '@/components/ui/page-header';
import { buildAdminPreviewGallery } from '@/server/services/preview-gallery-service';
import { BulkApprovalPanel, PreviewFilterBar, PreviewGalleryGrid, PreviewSummaryCards, BeforeAfterGrid } from '@/components/previews';


const demoProcessedFiles = [
  {
    id: 'demo-processed-white-jpg',
    imageId: 'demo-original-001',
    originalName: 'demo-product-001.jpg',
    originalStorageKey: 'demo/originals/demo-product-001.jpg',
    outputFileName: 'demo-product-001_white.jpg',
    outputType: 'WHITE_JPG',
    outputFormat: 'JPG',
    presetKey: 'AmazonMainImageDraft',
    platform: 'Amazon',
    width: 2000,
    height: 2000,
    qualityScore: 92,
    status: 'READY_FOR_REVIEW',
    approvedStatus: 'PENDING',
    qualityFlags: [],
  },
  {
    id: 'demo-processed-transparent-png',
    imageId: 'demo-original-001',
    originalName: 'demo-product-001.jpg',
    originalStorageKey: 'demo/originals/demo-product-001.jpg',
    outputFileName: 'demo-product-001_transparent.png',
    outputType: 'TRANSPARENT_PNG',
    outputFormat: 'PNG',
    presetKey: 'TransparentPngCutout',
    platform: 'Transparent-PNG',
    width: 2000,
    height: 2000,
    qualityScore: 88,
    status: 'APPROVED',
    approvedStatus: 'APPROVED',
    qualityFlags: [],
  },
  {
    id: 'demo-processed-flagged',
    imageId: 'demo-original-002',
    originalName: 'demo-product-002.jpg',
    originalStorageKey: 'demo/originals/demo-product-002.jpg',
    outputFileName: 'demo-product-002_square.jpg',
    outputType: 'SQUARE_ECOMMERCE',
    outputFormat: 'JPG',
    presetKey: 'SquareMarketplaceDraft',
    platform: 'Etsy',
    width: 2000,
    height: 2000,
    qualityScore: 61,
    status: 'FLAGGED',
    approvedStatus: 'PENDING',
    qualityFlags: ['edge_artifact', 'wrong_crop'],
  },
];


export default function AdminJobPreviewPage({ params }: { params: { jobId: string } }) {
  const gallery = buildAdminPreviewGallery({ organizationId: 'demo-org', jobId: params.jobId, clientPreviewEnabled: true, processedFiles: demoProcessedFiles });
  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <PageHeader eyebrow={`Job ${params.jobId}`} title="Job previews" description="Admin-only preview review with before/after comparisons and bulk preview approval controls." />
      <PreviewSummaryCards summary={gallery.summary} />
      <BulkApprovalPanel summary={gallery.summary} />
      <PreviewFilterBar filters={gallery.availableFilters} />
      <BeforeAfterGrid pairs={gallery.beforeAfterPairs} />
      <PreviewGalleryGrid items={gallery.items} selectable />
    </main>
  );
}
