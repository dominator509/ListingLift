import { Card } from '@/components/ui/card';
import type { ImageProcessingErrorDraft } from '@/domain/image-processing';

export function ProcessingErrorPanel({ errors }: { errors: ImageProcessingErrorDraft[] }) {
  return (
    <Card title="Processing errors" description="Per-image errors stay isolated so one bad image does not block the entire batch.">
      {errors.length === 0 ? <p className="text-sm text-slate-600">No errors in this dry-run plan.</p> : null}
      <div className="space-y-3">
        {errors.map((error, index) => (
          <div key={`${error.code}-${index}`} className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
            <div className="font-semibold">{error.code}</div>
            <p className="mt-1">{error.message}</p>
            <p className="mt-1 text-xs">Manual fallback: {error.manualFallbackRequired ? 'required' : 'not required'}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
