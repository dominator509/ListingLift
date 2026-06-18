import type { ReactNode } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { adminNav, salesChannelNav } from '@/config/navigation';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AppShell variant="admin" navItems={adminNav} secondaryNavItems={salesChannelNav}>{children}</AppShell>;
}
