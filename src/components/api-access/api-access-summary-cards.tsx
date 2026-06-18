import { Card } from '@/components/ui/card';

export function ApiAccessSummaryCards({ activeTokens, usedTokenCount, activeWebhookDrafts, sharedPortalDrafts }: { activeTokens: number; usedTokenCount: number; activeWebhookDrafts: number; sharedPortalDrafts: number }) {
  const cards = [
    { label: 'Active tokens', value: activeTokens, detail: 'Hashed token records only' },
    { label: 'Recently used', value: usedTokenCount, detail: 'Last-used requires Codex persistence' },
    { label: 'Webhook drafts', value: activeWebhookDrafts, detail: 'Signing secret refs required' },
    { label: 'Shared portals', value: sharedPortalDrafts, detail: 'Expiring upload scopes' },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <p className="text-sm font-medium text-slate-500">{card.label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{card.value}</p>
          <p className="mt-1 text-xs text-slate-500">{card.detail}</p>
        </Card>
      ))}
    </div>
  );
}
