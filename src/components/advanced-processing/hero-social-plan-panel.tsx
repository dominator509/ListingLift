export function HeroSocialPlanPanel() {
  const rows = ['Hero image draft', 'Instagram square draft', 'TikTok vertical draft', 'Thumbnail variation draft', 'Sequence recommendation'];
  return (
    <section className="rounded-2xl border bg-white p-5">
      <h3 className="text-base font-semibold text-slate-950">Hero and social plan</h3>
      <ul className="mt-3 space-y-2 text-sm text-slate-700">
        {rows.map((row) => <li key={row} className="rounded-lg bg-slate-50 px-3 py-2">{row}</li>)}
      </ul>
      <p className="mt-4 text-xs text-slate-500">Drafts require seller review and do not guarantee conversion, ranking, sales, ad performance, or platform approval.</p>
    </section>
  );
}
