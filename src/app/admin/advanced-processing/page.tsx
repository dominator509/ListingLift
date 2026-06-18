import { ADVANCED_IMAGE_RECIPES } from '@/domain/advanced-image-processing';
import { AdvancedProcessingSafetyPanel, AdvancedRecipeCard, HeroSocialPlanPanel, QualityReportPreview } from '@/components/advanced-processing';

export default function AdvancedProcessingPage() {
  return (
    <main className="space-y-6 p-6">
      <div>
        <p className="text-sm font-medium text-blue-600">Phase 31</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Advanced Image Processing</h1>
        <p className="mt-2 max-w-3xl text-slate-600">Plan advanced enhancement, brand-background, hero/social, thumbnail, sequence, and quality-report workflows. This page is a scaffold until Codex wires runtime image transforms, storage, provider calls, Prisma, and approval gates.</p>
      </div>
      <AdvancedProcessingSafetyPanel />
      <div className="grid gap-4 lg:grid-cols-2">
        {ADVANCED_IMAGE_RECIPES.map((recipe) => <AdvancedRecipeCard key={recipe.key} recipe={recipe} />)}
      </div>
      <HeroSocialPlanPanel />
      <QualityReportPreview />
    </main>
  );
}
