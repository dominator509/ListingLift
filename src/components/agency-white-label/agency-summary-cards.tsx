import { Card } from '@/components/ui/card';

export function AgencySummaryCards({ activeWorkspaces, monthlyImageVolume, inProduction, readyForDelivery }: { activeWorkspaces: number; monthlyImageVolume: number; inProduction: number; readyForDelivery: number }) {
  const cards = [
    ['Active workspaces', activeWorkspaces, 'Client workspaces inside the active agency tenant.'],
    ['Monthly image volume', monthlyImageVolume, 'Used for volume pricing and queue planning.'],
    ['In production', inProduction, 'Bulk queue items currently ready or processing.'],
    ['Ready for delivery', readyForDelivery, 'Still requires approval and secure delivery gates.'],
  ] as const;
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map(([label, value, helper]) => (
        <Card key={label}>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">{helper}</p>
        </Card>
      ))}
    </div>
  );
}
