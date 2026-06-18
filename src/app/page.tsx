import { PackageGrid } from '@/components/marketing/package-grid';
import { PublicShell } from '@/components/layout/public-shell';
import { LinkButton } from '@/components/ui/button';
import { SafeClaimBanner } from '@/components/marketing/safe-claim-banner';
import { BeforeAfterCard } from '@/components/workflow/before-after-card';
import { UploadDropzone } from '@/components/workflow/upload-dropzone';

export const revalidate = 60;

export default function HomePage() {
  return (
    <PublicShell>
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1fr_420px] lg:items-center">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-700">AI-assisted ecommerce image fulfillment</p>
          <h1 className="text-5xl font-bold tracking-tight text-slate-950 md:text-6xl">Turn messy product photos into organized marketplace image packs.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Upload raw product photos. ListingLift prepares clean, professional, seller-review-ready image drafts with transparent PNGs, white JPGs, marketplace folders, manifests, and ZIP delivery.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/pricing">View packages</LinkButton>
            <LinkButton href="/examples" variant="ghost">See examples</LinkButton>
          </div>
          <div className="mt-8"><SafeClaimBanner /></div>
        </div>
        <BeforeAfterCard />
      </section>
      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-20 lg:grid-cols-[380px_1fr]">
        <UploadDropzone />
        <div>
          <h2 className="mb-6 text-2xl font-bold text-slate-950">Service packages</h2>
          <PackageGrid />
        </div>
      </section>
    </PublicShell>
  );
}
