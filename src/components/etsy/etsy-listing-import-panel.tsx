import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function EtsyListingImportPanel() {
  return (
    <Card>
      <CardHeader><CardTitle>Etsy listing import planner</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm text-slate-600">
        <p>Prepare CSV/API-scaffold listing rows with listing ID, title, SKU, category, image count, and source URL.</p>
        <p>Phase 24 keeps this manual/API-scaffold only. Codex must prohibit private Etsy scraping and store only minimal listing metadata.</p>
      </CardContent>
    </Card>
  );
}
