import { ADVANCED_IMAGE_RECIPES } from '@/domain/advanced-image-processing';
import { AdvancedRecipeCard } from '@/components/advanced-processing';

export default function AdvancedProcessingRecipesPage() {
  return (
    <main className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-slate-950">Advanced processing recipes</h1>
      <div className="grid gap-4 lg:grid-cols-2">{ADVANCED_IMAGE_RECIPES.map((recipe) => <AdvancedRecipeCard key={recipe.key} recipe={recipe} />)}</div>
    </main>
  );
}
