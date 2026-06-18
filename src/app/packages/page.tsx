import { PublicShell } from '@/components/layout/public-shell';
import { PackageGrid, PackageComparisonTable } from '@/components/packages';
import { listPublicPackages } from '@/server/services/package-service';

export const revalidate = 60;

export default function Page() {
  const packages = listPublicPackages();
  return (
    <PublicShell>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Service packages</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-950">ListingLift packages are data-driven fulfillment products</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Packages define image allowances, revision limits, sales-channel mappings, delivery expectations, and checkout behavior for the fulfillment workflow.
        </p>
        <div className="mt-8"><PackageGrid /></div>
        <div className="mt-12 grid gap-6">
          {packages.map((pkg) => (
            <section id={pkg.publicSlug} key={pkg.key} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-950">{pkg.name}</h2>
              <p className="mt-2 text-slate-600">{pkg.description}</p>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Images</p><p className="font-semibold text-slate-950">{pkg.imageAllowance ?? 'Custom allowance'}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Revisions</p><p className="font-semibold text-slate-950">{pkg.revisionAllowance}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Delivery</p><p className="font-semibold text-slate-950">{pkg.deliveryWindowDays ? `${pkg.deliveryWindowDays} days draft window` : 'Custom schedule'}</p></div>
              </div>
              <h3 className="mt-6 font-semibold text-slate-950">Deliverables</h3>
              <ul className="mt-2 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                {pkg.deliverables.map((item) => <li key={item}>• {item}</li>)}
              </ul>
              <p className="mt-5 text-xs leading-5 text-slate-500">{pkg.safeClaim}</p>
            </section>
          ))}
        </div>
        <div className="mt-12"><PackageComparisonTable /></div>
      </section>
    </PublicShell>
  );
}
