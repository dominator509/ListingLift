import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function DeliveryReadinessPanel({ approved = false, zipGenerated = false, deliverySent = false }: { approved?: boolean; zipGenerated?: boolean; deliverySent?: boolean }) {
  const steps = [
    ['Admin approved', approved],
    ['ZIP generated', zipGenerated],
    ['Delivery sent', deliverySent],
  ] as const;

  return (
    <Card title="Delivery readiness" description="Client downloads must stay hidden until approval and delivery-link checks pass server-side.">
      <ul className="space-y-3">
        {steps.map(([label, done]) => (
          <li key={label} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm">
            <span className="font-medium text-slate-700">{label}</span>
            <Badge tone={done ? 'green' : 'amber'}>{done ? 'Done' : 'Pending'}</Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
