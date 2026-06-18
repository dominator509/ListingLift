import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export function DeliveryPackageChecklist() {
  const rows = [
    ['Originals preserved', true],
    ['Folder paths ZIP-safe', true],
    ['Manifest CSV generated', true],
    ['ReadMe compliance copy included', true],
    ['Admin approval required before client download', false],
  ] as const;
  return (
    <Card title="Delivery package checklist" description="Codex must enforce these checks server-side before marking Phase 12 complete.">
      <ul className="space-y-3">
        {rows.map(([label, done]) => (
          <li key={label} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm">
            <span className="font-medium text-slate-700">{label}</span>
            <Badge tone={done ? 'green' : 'amber'}>{done ? 'Seeded' : 'Codex verification'}</Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
