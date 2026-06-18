import { buildEtsyVisualConsistencyReport } from '@/domain/etsy';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function EtsyVisualReportPanel() {
  const report = buildEtsyVisualConsistencyReport({ listingTitles: ['Handmade candle', 'Ceramic mug'], flaggedIssues: ['Review crop consistency before publishing.'] });
  return (
    <Card>
      <CardHeader><CardTitle>Etsy shop visual report</CardTitle></CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {report.sections.map((section) => (
          <div key={section.key} className="rounded-lg border p-3 text-sm text-slate-600">
            <p className="font-medium text-slate-900">{section.title}</p>
            <ul className="mt-2 space-y-1">{section.notes.map((note) => <li key={note}>• {note}</li>)}</ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
