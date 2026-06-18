import { Card } from '@/components/ui/card';
import type { ProcessingStepDraft } from '@/domain/image-processing';

export function ProcessingStepList({ steps }: { steps: ProcessingStepDraft[] }) {
  return (
    <Card title="Processing steps" description="Deterministic step plan for each image/output. Codex must persist step status changes transactionally.">
      <ol className="space-y-3">
        {steps.map((step, index) => (
          <li key={`${step.imageId}-${step.operation}-${index}`} className="rounded-xl border border-slate-200 p-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold text-slate-900">{step.operation}</span>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{step.status}</span>
            </div>
            <p className="mt-1 text-slate-500">Image {step.imageId} · preset {step.presetKey ?? 'base'} · provider {step.providerKey}</p>
          </li>
        ))}
      </ol>
    </Card>
  );
}
