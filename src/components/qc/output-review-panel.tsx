import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { QualityReviewDecision } from '@/domain/quality-control';

export function OutputReviewPanel({ review }: { review: QualityReviewDecision }) {
  return (
    <Card title="Output review decision" description="Seed UI for reviewer decisions. Codex must wire these actions to server-side audited mutations.">
      <div className="space-y-3 text-sm text-slate-600">
        <p><strong className="text-slate-950">Output:</strong> {review.outputId}</p>
        <p><strong className="text-slate-950">Recommended action:</strong> {review.recommendedAction}</p>
        <p><strong className="text-slate-950">Delivery blocked:</strong> {review.finalDeliveryBlocked ? 'Yes' : 'No'}</p>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button type="button">Pass QC</Button>
        <Button type="button" variant="ghost">Flag output</Button>
        <Button type="button" variant="secondary">Request reprocess</Button>
      </div>
      <p className="mt-4 text-xs text-slate-500">QC pass does not send final delivery. Delivery remains hidden until the approval and delivery phases pass.</p>
    </Card>
  );
}
