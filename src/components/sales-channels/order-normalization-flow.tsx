import { Card } from '@/components/ui/card';

const steps = [
  'Import or receive order payload',
  'Normalize channel fields',
  'Prevent duplicate external order',
  'Match or create client',
  'Create ListingLift job draft',
  'Record revenue attribution',
  'Trigger secure upload link when eligible',
];

export function OrderNormalizationFlow() {
  return (
    <Card title="Normalization flow" description="Codex must wire this flow through one transaction when persistence is implemented.">
      <ol className="grid gap-3 md:grid-cols-2">
        {steps.map((step, index) => (
          <li key={step} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">{index + 1}</span>
            {step}
          </li>
        ))}
      </ol>
    </Card>
  );
}
