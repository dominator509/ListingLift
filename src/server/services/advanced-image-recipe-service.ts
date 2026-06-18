import { ADVANCED_IMAGE_OPERATIONS, ADVANCED_IMAGE_RECIPES, getAdvancedImageRecipe } from '@/domain/advanced-image-processing';

export function listAdvancedImageRecipes() {
  return ADVANCED_IMAGE_RECIPES.map((recipe) => ({
    ...recipe,
    operationsDetailed: recipe.operations.map((operationKey) => ADVANCED_IMAGE_OPERATIONS.find((operation) => operation.key === operationKey)),
  }));
}

export function getAdvancedImageRecipeDetail(recipeKey: string) {
  const recipe = getAdvancedImageRecipe(recipeKey as never);
  if (!recipe) {
    return { found: false, recipe: null, errors: [`Unknown advanced image recipe: ${recipeKey}`] };
  }
  return {
    found: true,
    recipe: {
      ...recipe,
      operationsDetailed: recipe.operations.map((operationKey) => ADVANCED_IMAGE_OPERATIONS.find((operation) => operation.key === operationKey)),
    },
    errors: [],
  };
}
