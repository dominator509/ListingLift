import { Card } from '@/components/ui/card';
import type { ProcessingRunPlan } from '@/domain/image-processing';

export function ProcessingRunSummary({ plan }: { plan: ProcessingRunPlan }) {
  const items = [
    ['Provider', plan.providerKey],
    ['Images', plan.imageCount],
    ['Outputs', plan.outputCount],
    ['Presets', plan.selectedPresetKeys.length],
    ['Operations', plan.operations.length],
    ['Manual fallback', plan.manualFallbackRequired ? 'Yes' : 'No'],
  ] as const;
  return (
    <Card title="Run summary" description="Phase 11 run contract before persistence and worker execution.">
      <dl className="grid gap-3 md:grid-cols-3">
        {items.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-slate-50 p-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
            <dd className="mt-1 text-lg font-bold text-slate-950">{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
