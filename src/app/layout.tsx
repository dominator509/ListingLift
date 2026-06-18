import type { Metadata } from 'next';
import './globals.css';
import SiteNav from '@/components/site-nav';

export const metadata: Metadata = {
  title: 'ListingLift',
  description: 'Product photo cleanup and ecommerce image fulfillment.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-950 focus:shadow-lg focus:outline-none" aria-label="Skip to main content">
          Skip to main content
        </a>
        <SiteNav />
        <main id="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
