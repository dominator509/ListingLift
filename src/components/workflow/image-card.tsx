import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export type ImageCardStatus = 'original' | 'processed' | 'flagged' | 'approved' | 'replacement-needed';

const statusTone = {
  original: 'slate',
  processed: 'blue',
  flagged: 'red',
  approved: 'green',
  'replacement-needed': 'amber',
} as const;

export function ImageCard({ title, subtitle, status = 'original', meta = [] }: { title: string; subtitle?: string; status?: ImageCardStatus; meta?: string[] }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="grid aspect-square place-items-center bg-gradient-to-br from-slate-100 to-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Preview placeholder
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-slate-950">{title}</p>
            {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
          </div>
          <Badge tone={statusTone[status]}>{status.replaceAll('-', ' ')}</Badge>
        </div>
        {meta.length ? <p className="mt-3 text-xs leading-5 text-slate-500">{meta.join(' · ')}</p> : null}
      </div>
    </Card>
  );
}
