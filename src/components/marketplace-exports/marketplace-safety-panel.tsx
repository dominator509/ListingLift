export function MarketplaceSafetyPanel() {
  return (
    <section className="rounded-2xl border bg-card p-5">
      <h2 className="text-lg font-semibold">Blocked actions</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {['Private page scraping', 'Password storage', 'Auto-publishing', 'Auto-uploading images', 'Buyer messaging automation', 'Compliance or ranking guarantees'].map((item) => (
          <div key={item} className="rounded-lg border bg-background p-3 text-sm">{item}</div>
        ))}
      </div>
    </section>
  );
}
