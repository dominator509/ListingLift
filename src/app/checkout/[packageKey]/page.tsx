import { PublicShell } from '@/components/layout/public-shell';
import { CheckoutSummary } from '@/components/packages';
import { buildPackageQuote } from '@/server/services/pricing-service';
import { findPackageByKey } from '@/server/services/package-service';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export default async function Page({ params }: { params: Promise<{ packageKey: string }> | { packageKey: string } }) {
  const resolved = await params;
  const pkg = findPackageByKey(resolved.packageKey);

  if (!pkg) {
    return (
      <PublicShell>
        <main className="mx-auto max-w-3xl px-6 py-16">
          <Card title="Package not found" description="Return to pricing and select an active ListingLift package.">
            <a className="text-sm font-semibold text-blue-700" href="/pricing">Back to pricing</a>
          </Card>
        </main>
      </PublicShell>
    );
  }

  const quote = buildPackageQuote({ packageKey: pkg.key, imageQuantity: pkg.imageAllowance ?? pkg.imageMin ?? 10, rushRequested: false, needsBrandBackgrounds: false, needsManualEditing: false });

  return (
    <PublicShell>
      <main className="mx-auto grid max-w-6xl gap-8 px-6 py-16 lg:grid-cols-[1fr_380px]">
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Checkout entry</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-950">Start {pkg.name}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            This entry form prepares a normalized ListingLift job draft. Codex must wire the submit action to server-side checkout/package selection in the implementation repo.
          </p>
          <form className="mt-8 grid gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Input name="buyerName" label="Your name" placeholder="Jane Seller" />
            <Input name="buyerEmail" type="email" label="Email" placeholder="jane@example.com" />
            <Input name="businessName" label="Business or store name" placeholder="Example Goods" />
            <Select name="targetPlatform" label="Primary target platform" options={[
              { label: 'Amazon', value: 'Amazon' },
              { label: 'Etsy', value: 'Etsy' },
              { label: 'Shopify', value: 'Shopify' },
              { label: 'TikTok Shop', value: 'TikTok Shop' },
              { label: 'Instagram', value: 'Instagram' },
              { label: 'Other / multiple', value: 'Other' },
            ]} />
            <Input name="imageQuantity" label="Image quantity" defaultValue={pkg.imageAllowance ?? pkg.imageMin ?? 10} />
            <Button type="button">Continue to Stripe checkout draft</Button>
            <p className="text-xs leading-5 text-slate-500">Stripe checkout is prepared in Phase 17 as a server-side feature-flagged flow. Client prices are ignored; Codex must call the server checkout endpoint and preserve manual fallback.</p>
          </form>
        </section>
        <aside>
          <CheckoutSummary quote={quote} />
        </aside>
      </main>
    </PublicShell>
  );
}
