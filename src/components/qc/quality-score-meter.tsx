import { Card } from '@/components/ui/card';
import { assignQualityBand } from '@/server/services/quality-score-service';

export function QualityScoreMeter({ score }: { score: number }) {
  const band = assignQualityBand(score);
  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-600">Quality score</p>
        <p className="text-2xl font-bold text-slate-950">{score}</p>
      </div>
      <div className="h-3 rounded-full bg-slate-100">
        <div className="h-3 rounded-full bg-slate-900" style={{ width: `${Math.max(0, Math.min(100, score))}%` }} />
      </div>
      <p className="text-sm text-slate-500">Band: {band}. Final delivery still requires the approval workflow.</p>
    </Card>
  );
}
