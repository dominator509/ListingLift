import { SAFE_MARKETPLACE_LANGUAGE } from '@/lib/constants';

export function SafeClaimBanner() {
  return (
    <aside className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <strong>Marketplace safety:</strong> {SAFE_MARKETPLACE_LANGUAGE.join(' · ')}.
    </aside>
  );
}
