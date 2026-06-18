import { Card } from '@/components/ui/card';
import { calculateProcessingProgress, type ProcessingProgressSnapshot } from '@/server/services/image-processing-progress-service';

export function PipelineStatusCard({ snapshot }: { snapshot: ProcessingProgressSnapshot }) {
  const progress = calculateProcessingProgress(snapshot);
  return (
    <Card title="Pipeline status" description="Tracks queued, running, completed, failed, and manual-fallback processing outputs.">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">{progress.status}</span>
          <span className="text-slate-500">{progress.done}/{progress.total} outputs</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-slate-900" style={{ width: `${progress.percent}%` }} />
        </div>
        <p className="text-sm text-slate-600">{progress.failed} failed outputs require admin review or manual fallback.</p>
      </div>
    </Card>
  );
}
