import { PageHeader } from '@/components/ui/page-header';
import { FlaggedOutputTable, QualitySummaryCards, ManualReplacementPanel } from '@/components/qc';
import { buildJobQualityReview } from '@/server/services/quality-review-service';


const demoQualityOutputs = [
  {
    id: 'demo-processed-white-jpg',
    outputFileName: 'demo-product-001_white.jpg',
    outputType: 'WHITE_JPG',
    presetKey: 'AmazonMainImageDraft',
    platform: 'Amazon',
    width: 2000,
    height: 2000,
    qualityScore: 92,
    status: 'READY_FOR_REVIEW',
    approvedStatus: 'PENDING',
    flags: [],
  },
  {
    id: 'demo-processed-square-flagged',
    outputFileName: 'demo-product-002_square.jpg',
    outputType: 'SQUARE_ECOMMERCE',
    presetKey: 'SquareMarketplaceDraft',
    platform: 'Etsy',
    width: 2000,
    height: 2000,
    qualityScore: 72,
    status: 'FLAGGED',
    approvedStatus: 'PENDING',
    flags: ['edge_quality_issue', 'wrong_crop'],
  },
  {
    id: 'demo-processed-mask-failed',
    outputFileName: 'demo-product-003_transparent.png',
    outputType: 'TRANSPARENT_PNG',
    presetKey: 'TransparentPngCutout',
    platform: 'Transparent-PNG',
    width: 1600,
    height: 1600,
    qualityScore: 58,
    status: 'FAILED',
    approvedStatus: 'PENDING',
    flags: ['failed_mask', 'missing_part'],
  },
];


export default function AdminFlaggedOutputsPage() {
  const review = buildJobQualityReview({ organizationId: 'demo-org', jobId: 'JOB-DEMO-001', outputs: demoQualityOutputs });
  const flagged = review.reviews.filter((item) => item.finalDeliveryBlocked);
  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <PageHeader title="Flagged outputs" description="Admin queue for QC blockers, failed masks, wrong crops, and manual cleanup fallback decisions." />
      <QualitySummaryCards summary={review.summary} />
      <FlaggedOutputTable items={flagged} />
      <ManualReplacementPanel />
    </main>
  );
}
