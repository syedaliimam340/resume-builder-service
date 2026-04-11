import { NextRequest, NextResponse } from 'next/server'
import { templates, getTemplatesByCategory, getFreeTemplates } from '@/lib/templates'
import type { ApiResponse, TemplateData } from '@/lib/types'

// GET /api/templates - List all templates
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const tier = searchParams.get('tier')

  let filteredTemplates: TemplateData[] = templates

  // Filter by category if provided
  if (category) {
    const validCategories = ['MODERN', 'CLASSIC', 'CREATIVE', 'MINIMAL', 'PROFESSIONAL']
    if (validCategories.includes(category.toUpperCase())) {
      filteredTemplates = getTemplatesByCategory(category.toUpperCase() as TemplateData['category'])
    }
  }

  // Filter by tier if provided
  if (tier === 'free') {
    filteredTemplates = filteredTemplates.filter(t => t.tierRequired === 'FREE')
  } else if (tier === 'pro') {
    filteredTemplates = filteredTemplates.filter(t => t.tierRequired === 'PRO')
  }

  return NextResponse.json<ApiResponse<TemplateData[]>>({
    success: true,
    data: filteredTemplates,
  })
}
