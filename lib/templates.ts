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
  {
    id: 'creative-bold',
    name: 'Creative Bold',
    slug: 'creative-bold',
    description: 'Eye-catching design for creative professionals',
    thumbnailUrl: '/templates/creative-bold.png',
    category: 'CREATIVE',
    tierRequired: 'PRO',
  },
  {
    id: 'executive-premium',
    name: 'Executive Premium',
    slug: 'executive-premium',
    description: 'Sophisticated design for senior leadership positions',
    thumbnailUrl: '/templates/executive-premium.png',
    category: 'PROFESSIONAL',
    tierRequired: 'PRO',
  },
  {
    id: 'tech-developer',
    name: 'Tech Developer',
    slug: 'tech-developer',
    description: 'Optimized for software developers with skills matrix',
    thumbnailUrl: '/templates/tech-developer.png',
    category: 'MODERN',
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
