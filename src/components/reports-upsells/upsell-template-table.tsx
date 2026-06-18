import { listUpsellTemplates } from '@/server/services/upsell-template-service';

export function UpsellTemplateTable() {
  const templates = listUpsellTemplates();
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr><th className="p-3">Offer</th><th className="p-3">CTA</th><th className="p-3">Safe claim</th></tr>
        </thead>
        <tbody>
          {templates.map((template) => (
            <tr key={template.type} className="border-t align-top"><td className="p-3 font-medium">{template.title}</td><td className="p-3">{template.cta}</td><td className="p-3 text-slate-600">{template.safeClaim}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
