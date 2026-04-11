'use client'

import { useResumeStore } from '@/lib/store'
import { templates } from '@/lib/templates'
import { cn } from '@/lib/utils'
import { Check, Lock, Palette } from 'lucide-react'

export function TemplateSelector() {
  const { selectedTemplateId, setSelectedTemplateId, customizations, updateCustomization } = useResumeStore()

  const colors = [
    { name: 'Slate', primary: '#0f172a', accent: '#3b82f6' },
    { name: 'Teal', primary: '#134e4a', accent: '#14b8a6' },
    { name: 'Navy', primary: '#1e3a5f', accent: '#60a5fa' },
    { name: 'Charcoal', primary: '#27272a', accent: '#a1a1aa' },
    { name: 'Wine', primary: '#4a1d30', accent: '#f43f5e' },
  ]

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-foreground">Templates</h3>
        <span className="text-xs text-muted-foreground">{templates.length} available</span>
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => template.tierRequired === 'FREE' && setSelectedTemplateId(template.id)}
            className={cn(
              'relative aspect-[3/4] rounded-lg border-2 transition-all overflow-hidden group',
              selectedTemplateId === template.id
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-border hover:border-muted-foreground/50',
              template.tierRequired !== 'FREE' && 'opacity-60 cursor-not-allowed'
            )}
          >
            {/* Template preview */}
            <div className="absolute inset-0 bg-muted p-2">
              {/* Mini resume preview */}
              <div className="h-full bg-card rounded border border-border p-1.5">
                <div className="w-full h-1.5 bg-primary/30 rounded-full mb-1" />
                <div className="w-2/3 h-1 bg-muted-foreground/20 rounded-full mb-2" />
                <div className="space-y-0.5">
                  <div className="w-full h-0.5 bg-muted-foreground/10 rounded-full" />
                  <div className="w-4/5 h-0.5 bg-muted-foreground/10 rounded-full" />
                  <div className="w-3/4 h-0.5 bg-muted-foreground/10 rounded-full" />
                </div>
              </div>
            </div>

            {/* Selected indicator */}
            {selectedTemplateId === template.id && (
              <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Check className="h-3 w-3 text-primary-foreground" />
              </div>
            )}

            {/* Pro badge */}
            {template.tierRequired !== 'FREE' && (
              <div className="absolute top-1 right-1 w-5 h-5 bg-muted rounded-full flex items-center justify-center">
                <Lock className="h-3 w-3 text-muted-foreground" />
              </div>
            )}

            {/* Template name tooltip */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-[10px] text-foreground font-medium truncate">{template.name}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Color palette */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Colors</span>
        </div>
        <div className="flex gap-2">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => {
                updateCustomization('primaryColor', color.primary)
                updateCustomization('accentColor', color.accent)
              }}
              className={cn(
                'w-8 h-8 rounded-full border-2 transition-all',
                customizations.primaryColor === color.primary
                  ? 'border-primary scale-110'
                  : 'border-transparent hover:scale-105'
              )}
              style={{ backgroundColor: color.primary }}
              title={color.name}
            >
              {customizations.primaryColor === color.primary && (
                <Check className="h-4 w-4 text-white mx-auto" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Font & Spacing controls */}
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Font Size</label>
          <select
            value={customizations.fontSize}
            onChange={(e) => updateCustomization('fontSize', e.target.value as 'small' | 'medium' | 'large')}
            className="w-full px-2 py-1.5 text-sm bg-muted border border-border rounded text-foreground"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Spacing</label>
          <select
            value={customizations.spacing}
            onChange={(e) => updateCustomization('spacing', e.target.value as 'compact' | 'normal' | 'relaxed')}
            className="w-full px-2 py-1.5 text-sm bg-muted border border-border rounded text-foreground"
          >
            <option value="compact">Compact</option>
            <option value="normal">Normal</option>
            <option value="relaxed">Relaxed</option>
          </select>
        </div>
      </div>
    </div>
  )
}
