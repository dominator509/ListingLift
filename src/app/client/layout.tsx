import type { ReactNode } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { clientNav } from '@/config/navigation';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return <AppShell variant="client" navItems={clientNav}>{children}</AppShell>;
}
