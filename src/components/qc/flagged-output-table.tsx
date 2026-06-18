import { Card } from '@/components/ui/card';
import type { QualityReviewDecision } from '@/domain/quality-control';
import { QualityFlagBadge } from './quality-flag-badge';

export function FlaggedOutputTable({ items }: { items: QualityReviewDecision[] }) {
  return (
    <Card title="Flagged outputs" description="Outputs with blockers, warnings, failed masks, or manual replacement requirements.">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="py-3 pr-4">Output</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Score</th>
              <th className="py-3 pr-4">Flags</th>
              <th className="py-3 pr-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.outputId}>
                <td className="py-4 pr-4 font-medium text-slate-950">{item.outputId}</td>
                <td className="py-4 pr-4">{item.status}</td>
                <td className="py-4 pr-4">{item.score}</td>
                <td className="py-4 pr-4">
                  <div className="flex flex-wrap gap-2">
                    {item.flags.map((flag) => <QualityFlagBadge key={flag.key} label={flag.label} severity={flag.severity} />)}
                  </div>
                </td>
                <td className="py-4 pr-4 text-slate-600">{item.recommendedAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
