import { Card } from '@/components/ui/card';
import { getQualityControlChecklist } from '@/server/services/quality-control-checklist-service';
import { QualityFlagBadge } from './quality-flag-badge';

export function QualityChecklistPanel() {
  const checklist = getQualityControlChecklist();
  return (
    <Card title="QC checklist" description="Reviewer checklist for product image fulfillment. Blockers must be resolved before final delivery.">
      <div className="grid gap-3 md:grid-cols-2">
        {checklist.items.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-slate-950">{item.label}</p>
              <QualityFlagBadge label={item.severity} severity={item.severity} />
            </div>
            <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">{item.category}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.suggestedAction}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-slate-500">{checklist.safeLanguage}</p>
    </Card>
  );
}
