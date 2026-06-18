export function BrandBackgroundPanel({ colors = ['#ffffff', '#f8fafc', '#111827'] }: { colors?: string[] }) {
  return (
    <section className="rounded-2xl border bg-white p-5">
      <h3 className="text-base font-semibold text-slate-950">Brand background drafts</h3>
      <p className="mt-2 text-sm text-slate-600">Use approved brand colors only. Every variant remains hidden until admin approval.</p>
      <div className="mt-4 flex gap-3">
        {colors.map((color) => <div key={color} className="h-12 w-24 rounded-xl border" style={{ background: color }} title={color} />)}
      </div>
    </section>
  );
}
