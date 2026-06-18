import clsx from 'clsx';

export function ProgressBar({ value, label, className }: { value: number; label?: string; className?: string }) {
  const safeValue = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={clsx('space-y-2', className)}>
      {label ? (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">{label}</span>
          <span className="text-slate-500">{safeValue}%</span>
        </div>
      ) : null}
      <div className="h-2 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-valuenow={safeValue} aria-valuemin={0} aria-valuemax={100} aria-label={label ?? 'Progress'}>
        <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}
