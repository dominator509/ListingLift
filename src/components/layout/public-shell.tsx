import type { ReactNode } from 'react';
import Link from 'next/link';
import { LinkButton } from '@/components/ui/button';
import { publicNav } from '@/config/navigation';
import { MobileNav } from '@/components/ui/mobile-nav';

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <main id="main-content" className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <Link className="block min-h-[44px] py-2.5 text-lg font-bold tracking-tight text-slate-950" href="/" aria-label="ListingLift home">ListingLift</Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex" aria-label="Public navigation">
            {publicNav.map((item) => <a key={item.href} className="inline-flex min-h-[44px] items-center px-2 py-2 hover:text-slate-950" href={item.href}>{item.label}</a>)}
          </nav>
          <div className="flex items-center gap-2">
            <a className="hidden py-2 text-sm font-semibold text-slate-600 hover:text-slate-950 sm:inline min-h-[44px]" href="/login">Log in</a>
            <LinkButton href="/upload/demo-token" variant="secondary">Start upload</LinkButton>
            <MobileNav items={publicNav} />
          </div>
        </div>
      </header>
      {children}
    </main>
  );
}
