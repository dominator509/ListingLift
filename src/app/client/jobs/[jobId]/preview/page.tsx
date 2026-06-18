import { PageHeader } from '@/components/ui/page-header';
import { buildClientPreviewGallery } from '@/server/services/preview-gallery-service';
import { BeforeAfterGrid, PreviewGalleryGrid, PreviewSummaryCards } from '@/components/previews';


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


export default function ClientJobPreviewPage({ params }: { params: { jobId: string } }) {
  const gallery = buildClientPreviewGallery({ organizationId: 'demo-org', jobId: params.jobId, clientPreviewEnabled: true, processedFiles: demoProcessedFiles });
  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <PageHeader eyebrow={`Job ${params.jobId}`} title="Approved previews" description="Approved preview images for seller review. Final downloads remain separate from preview access." />
      <PreviewSummaryCards summary={gallery.summary} />
      <BeforeAfterGrid pairs={gallery.beforeAfterPairs} />
      <PreviewGalleryGrid items={gallery.items} />
      <p className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">Preview images are platform-ready drafts. Seller review is recommended before publishing. No marketplace approval, ranking, sales, conversion, or ad-performance guarantee is made.</p>
    </main>
  );
}
