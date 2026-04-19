import type { TemplateData } from './types'

export const templates: TemplateData[] = [
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    slug: 'modern-professional',
    description: 'Clean, contemporary design perfect for tech and corporate roles',
    thumbnailUrl: '/templates/modern-professional.png',
    category: 'MODERN',
    tierRequired: 'FREE',
  },
  {
    id: 'classic-elegant',
    name: 'Classic Elegant',
    slug: 'classic-elegant',
    description: 'Timeless design with traditional formatting for conservative industries',
    thumbnailUrl: '/templates/classic-elegant.png',
    category: 'CLASSIC',
    tierRequired: 'FREE',
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    slug: 'minimal-clean',
    description: 'Sleek, minimalist layout that lets your content shine',
    thumbnailUrl: '/templates/minimal-clean.png',
    category: 'MINIMAL',
    tierRequired: 'FREE',
  },
]

export function getTemplateById(id: string): TemplateData | undefined {
  return templates.find((t) => t.id === id)
}

export function getTemplatesByCategory(category: TemplateData['category']): TemplateData[] {
  return templates.filter((t) => t.category === category)
}

export function getFreeTemplates(): TemplateData[] {
  return templates.filter((t) => t.tierRequired === 'FREE')
}
