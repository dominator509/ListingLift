import { NextResponse } from 'next/server';

export async function POST(request: Request, context: { params: Promise<{ imageId: string }> }) {
  const params = await context.params;
  const body = await request.json();
  return NextResponse.json({
    imageId: (await params).imageId,
    recipeKey: body.recipeKey ?? 'marketplace-polish',
    dryRun: true,
    status: 'NEEDS_CODEX_RUNTIME',
    createsNewOutputsOnly: true,
    originalPreserved: true,
    requiresAdminApproval: true,
  });
}
