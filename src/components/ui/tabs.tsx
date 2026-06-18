import type { ReactNode } from 'react';
import clsx from 'clsx';

export type TabItem = { key: string; label: string; content: ReactNode };

export function Tabs({ tabs, activeKey }: { tabs: TabItem[]; activeKey?: string }) {
  const active = tabs.find((tab) => tab.key === activeKey) ?? tabs[0];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 border-b border-slate-200" role="tablist" aria-label="ListingLift tabs">
        {tabs.map((tab) => {
          const selected = tab.key === active.key;
          return (
            <a
              key={tab.key}
              href={`#${tab.key}`}
              className={clsx('border-b-2 px-3 py-2 text-sm font-semibold transition', selected ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-900')}
              role="tab"
              aria-selected={selected}
            >
              {tab.label}
            </a>
          );
        })}
      </div>
      <section id={active.key} role="tabpanel">
        {active.content}
      </section>
    </div>
  );
}
