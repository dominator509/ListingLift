import { ADVANCED_IMAGE_SECURITY_RULES } from '@/domain/advanced-image-processing';

export function AdvancedProcessingSafetyPanel() {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <h3 className="text-base font-semibold text-amber-950">Advanced processing safety gates</h3>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-900">
        {ADVANCED_IMAGE_SECURITY_RULES.map((rule) => <li key={rule}>{rule}</li>)}
      </ul>
    </section>
  );
}
