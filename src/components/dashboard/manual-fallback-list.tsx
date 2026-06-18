import { MANUAL_FALLBACK_ACTIONS } from '@/domain/manual-fallbacks';

export function ManualFallbackList() {
  return (
    <ul className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
      {MANUAL_FALLBACK_ACTIONS.map((action) => (
        <li key={action} className="rounded-lg border border-slate-200 bg-white p-3">
          {action.replaceAll('_', ' ')}
        </li>
      ))}
    </ul>
  );
}
