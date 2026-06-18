import { PublicShell } from '@/components/layout/public-shell';

export default function Page() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-4xl font-bold text-slate-950">Agency White-Label</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">Multi-client workspaces, branded delivery, and volume fulfillment for agencies.</p>
        <p className='mt-6 text-sm text-slate-500'>Seller-review recommended. No marketplace approval, sales, ranking, or ad performance guarantees.</p>
      </section>
    </PublicShell>
  );
}
