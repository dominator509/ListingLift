import { EtsyManualOrderForm, EtsySafetyPanel } from '@/components/etsy';

export default function AdminEtsyOrderIntakePage() {
  return (
    <main className="mx-auto grid max-w-5xl gap-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Etsy order intake</h1>
        <p className="mt-3 text-slate-600">Create a normalized ListingLift job from a manually entered Etsy order or seller request.</p>
      </div>
      <EtsyManualOrderForm />
      <EtsySafetyPanel />
    </main>
  );
}
