import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    advancedImageProcessingEnabled: process.env.ADVANCED_IMAGE_PROCESSING_ENABLED === 'true',
    realAdvancedImageProcessingEnabled: process.env.REAL_ADVANCED_IMAGE_PROCESSING_ENABLED === 'true',
    mockProviderAvailable: process.env.MOCK_IMAGE_PROVIDER_ENABLED !== 'false',
    manualFallbackRequired: true,
    status: 'SCAFFOLD_ONLY',
  });
}
