import { DEFAULT_UPWORK_OFFER_MAPPINGS, UPWORK_MARKETPLACE_SAFETY_RULES } from '@/domain/upwork';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function UpworkWorkflowBoard() {
  const columns = ['Contract captured', 'Files needed', 'Processing', 'Review', 'Delivery ready', 'Revision/retainer'];
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {columns.map((column) => (
        <Card key={column}>
          <CardHeader><CardTitle>{column}</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>Manual-first Upwork workflow stage.</p>
            <p className="text-xs text-slate-500">Supported offers: {DEFAULT_UPWORK_OFFER_MAPPINGS.length}</p>
          </CardContent>
        </Card>
      ))}
      <Card className="lg:col-span-3">
        <CardHeader><CardTitle>Marketplace safety</CardTitle></CardHeader>
        <CardContent>
          <ul className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
            {UPWORK_MARKETPLACE_SAFETY_RULES.slice(0, 6).map((rule) => <li key={rule}>• {rule}</li>)}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
