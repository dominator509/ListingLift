import { Card } from '@/components/ui/card';
import type { PreviewGallerySummary } from '@/domain/preview-gallery';

export function BulkApprovalPanel({ summary }: { summary: PreviewGallerySummary }) {
  return (
    <Card title="Bulk preview approval" description="Approve selected review-ready previews. This does not send final delivery files.">
      <div className="grid gap-4 text-sm sm:grid-cols-4">
        <div><span className="text-2xl font-bold text-slate-950">{summary.readyForReview}</span><p className="text-slate-500">ready for review</p></div>
        <div><span className="text-2xl font-bold text-emerald-700">{summary.approved}</span><p className="text-slate-500">approved previews</p></div>
        <div><span className="text-2xl font-bold text-amber-700">{summary.flagged}</span><p className="text-slate-500">flagged</p></div>
        <div><span className="text-2xl font-bold text-rose-700">{summary.failed}</span><p className="text-slate-500">failed</p></div>
      </div>
      <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Final delivery remains hidden until the approval and delivery workflow explicitly exposes downloads.</p>
    </Card>
  );
}
