import type { AdvancedImageRecipe } from '@/domain/advanced-image-processing';

export function AdvancedRecipeCard({ recipe }: { recipe: AdvancedImageRecipe }) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">{recipe.label}</h3>
          <p className="mt-2 text-sm text-slate-600">{recipe.description}</p>
        </div>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">Admin approval required</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {recipe.operations.map((operation) => (
          <span key={operation} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">{operation.replaceAll('_', ' ')}</span>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-500">{recipe.safeClaim}</p>
    </section>
  );
}
