import { DEFAULT_ETSY_LISTING_PACKS, ETSY_MARKETPLACE_SAFETY_RULES } from '@/domain/etsy';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function EtsyWorkflowBoard() {
  const columns = ['Order captured', 'Listing data', 'Files received', 'Processing', 'Seller review', 'Delivery/revision'];
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {columns.map((column) => (
        <Card key={column}>
          <CardHeader><CardTitle>{column}</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>Manual-first Etsy workflow stage with seller-review required.</p>
            <p className="text-xs text-slate-500">Preset focus: Etsy square listing drafts.</p>
          </CardContent>
        </Card>
      ))}
      <Card className="lg:col-span-3">
        <CardHeader><CardTitle>Etsy marketplace safety</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-slate-600">Supported packs: {DEFAULT_ETSY_LISTING_PACKS.map((pack) => pack.title).join(', ')}</p>
          <ul className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
            {ETSY_MARKETPLACE_SAFETY_RULES.slice(0, 6).map((rule) => <li key={rule}>• {rule}</li>)}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
