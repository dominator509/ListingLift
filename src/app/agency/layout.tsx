import type { ReactNode } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { agencyNav } from '@/config/navigation';

export default function AgencyLayout({ children }: { children: ReactNode }) {
  return <AppShell variant="agency" navItems={agencyNav}>{children}</AppShell>;
}
