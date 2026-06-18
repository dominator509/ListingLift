import type { ReactNode } from 'react';
import Link from 'next/link';
import { SafeClaimBanner } from '@/components/marketing/safe-claim-banner';

export function AuthShell({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <main id="main-content" className="min-h-screen bg-slate-50">
      <div className="mx-auto grid min-h-screen max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[1fr_440px] lg:items-center">
        <section>
          <Link className="text-lg font-bold text-slate-950" href="/">ListingLift</Link>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-blue-700">Secure service fulfillment portal</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">{title}</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">{description}</p>
          <div className="mt-8 max-w-xl"><SafeClaimBanner /></div>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
          {children}
        </section>
      </div>
    </main>
  );
}
