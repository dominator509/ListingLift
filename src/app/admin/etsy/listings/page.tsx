import { EtsyListingImportPanel, EtsyVisualReportPanel } from '@/components/etsy';

export default function AdminEtsyListingsPage() {
  return (
    <main className="mx-auto grid max-w-5xl gap-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Etsy listings</h1>
        <p className="mt-3 text-slate-600">Plan CSV/API-scaffold listing imports and visual consistency reports without scraping private Etsy pages.</p>
      </div>
      <EtsyListingImportPanel />
      <EtsyVisualReportPanel />
    </main>
  );
}
