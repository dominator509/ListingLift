import { PublicShell } from '@/components/layout/public-shell';
import { PackageGrid, PackageComparisonTable } from '@/components/packages';

export const revalidate = 60;

export default function Page() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">ListingLift pricing</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-950">Product image cleanup packages for sellers, launches, and agencies</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Choose one-time image packs, monthly seller retainers, or agency white-label fulfillment. Prices are server-side package records and every output is positioned as a platform-ready draft with seller review recommended.
        </p>
        <div className="mt-8"><PackageGrid /></div>
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-950">Compare packages</h2>
          <p className="mt-2 text-sm text-slate-600">Image allowance, revision allowance, and checkout mode are enforced by package rules, not marketing copy.</p>
          <div className="mt-5"><PackageComparisonTable /></div>
        </div>
      </section>
    </PublicShell>
  );
}
