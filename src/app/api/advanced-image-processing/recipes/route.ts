import { NextResponse } from 'next/server';

import { listAdvancedImageRecipes } from '@/server/services/advanced-image-recipe-service';

export async function GET() {
  return NextResponse.json({ recipes: listAdvancedImageRecipes(), dryRun: true });
}
