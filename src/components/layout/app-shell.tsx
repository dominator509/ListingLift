import type { ReactNode } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import type { NavItem } from '@/config/navigation';

export type AppShellVariant = 'admin' | 'client' | 'agency';

const variantLabel: Record<AppShellVariant, string> = {
  admin: 'Admin operations',
  client: 'Client portal',
  agency: 'Agency workspace',
};

const variantAccent: Record<AppShellVariant, string> = {
  admin: 'bg-slate-950 text-white',
  client: 'bg-blue-700 text-white',
  agency: 'bg-violet-700 text-white',
};

export function AppShell({ variant, navItems, children, secondaryNavItems = [] }: { variant: AppShellVariant; navItems: NavItem[]; secondaryNavItems?: NavItem[]; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="border-b border-slate-200 bg-white lg:min-h-screen lg:border-b-0 lg:border-r" aria-label={`${variantLabel[variant]} navigation`}>
        <div className={clsx('px-6 py-6', variantAccent[variant])}>
          <Link className="block text-xl font-bold" href="/">ListingLift</Link>
          <p className="mt-1 text-sm opacity-80">{variantLabel[variant]}</p>
        </div>
        <nav className="flex gap-2 overflow-x-auto p-4 text-sm lg:block lg:space-y-1 lg:overflow-visible" aria-label="Primary workspace navigation">
          {navItems.map((item) => <ShellLink key={item.href} item={item} />)}
        </nav>
        {secondaryNavItems.length ? (
          <div className="hidden border-t border-slate-200 p-4 lg:block">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Channels</p>
            <nav className="space-y-1" aria-label="Sales channel navigation">
              {secondaryNavItems.map((item) => <ShellLink key={item.href} item={item} compact />)}
            </nav>
          </div>
        ) : null}
      </aside>
      <div className="min-w-0">
        <header className="border-b border-slate-200 bg-white px-6 py-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <p className="text-sm font-semibold text-slate-700">{variantLabel[variant]}</p>
            <p className="text-xs text-slate-500">Auth, RBAC, and tenant isolation must be enforced server-side in later phases.</p>
          </div>
        </header>
        <div id="main-content" className="mx-auto max-w-7xl px-6 py-8">{children}</div>
      </div>
    </div>
  );
}

function ShellLink({ item, compact = false }: { item: NavItem; compact?: boolean }) {
  return (
    <a
      className={clsx(
        'block shrink-0 rounded-xl px-3 py-2.5 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950',
        compact ? 'text-xs' : 'text-sm',
        'min-h-[44px]',
      )}
      href={item.href}
    >
      {item.label}
    </a>
  );
}
