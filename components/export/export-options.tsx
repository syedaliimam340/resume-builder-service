'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  FileText, 
  FileType, 
  FileCode, 
  Image, 
  Download,
  Loader2,
  Check
} from 'lucide-react'
import type { ExportFormat } from '@/lib/types'

interface ExportOptionsProps {
  onExport: (format: string) => Promise<void>
  isExporting: boolean
}

const exportFormats: { 
  id: ExportFormat
  name: string
  description: string
  icon: typeof FileText
  isPro: boolean
}[] = [
  {
    id: 'pdf',
    name: 'PDF Document',
    description: 'Best for job applications',
    icon: FileText,
    isPro: false,
  },
  {
    id: 'docx',
    name: 'Word Document',
    description: 'Editable in Microsoft Word',
    icon: FileType,
    isPro: false,
  },
  {
    id: 'txt',
    name: 'Plain Text',
    description: 'For online job portals',
    icon: FileCode,
    isPro: false,
  },
  {
    id: 'png',
    name: 'Image (PNG)',
    description: 'For portfolio websites',
    icon: Image,
    isPro: true,
  },
  {
    id: 'json',
    name: 'JSON Data',
    description: 'Export raw data',
    icon: FileCode,
    isPro: true,
  },
]

export function ExportOptions({ onExport, isExporting }: ExportOptionsProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf')
  const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(null)

  const handleExport = async () => {
    setExportingFormat(selectedFormat)
    await onExport(selectedFormat)
    setExportingFormat(null)
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="font-medium text-foreground mb-4">Download Format</h3>

      {/* Format options */}
      <div className="space-y-2 mb-6">
        {exportFormats.map((format) => (
          <button
            key={format.id}
            onClick={() => !format.isPro && setSelectedFormat(format.id)}
            disabled={format.isPro}
            className={cn(
              'w-full flex items-center gap-4 p-3 rounded-lg border transition-all text-left',
              selectedFormat === format.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-muted-foreground/50',
              format.isPro && 'opacity-60 cursor-not-allowed'
            )}
          >
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              selectedFormat === format.id ? 'bg-primary/20' : 'bg-muted'
            )}>
              <format.icon className={cn(
                'h-5 w-5',
                selectedFormat === format.id ? 'text-primary' : 'text-muted-foreground'
              )} />
            </div>
            <div className="flex-1">
              <p className={cn(
                'font-medium text-sm',
                selectedFormat === format.id ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {format.name}
                {format.isPro && (
                  <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-primary/20 text-primary rounded">
                    PRO
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">{format.description}</p>
            </div>
            {selectedFormat === format.id && (
              <Check className="h-5 w-5 text-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Download button */}
      <Button 
        size="lg" 
        className="w-full gap-2"
        onClick={handleExport}
        disabled={isExporting}
      >
        {isExporting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating {selectedFormat.toUpperCase()}...
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Download as {selectedFormat.toUpperCase()}
          </>
        )}
      </Button>

      {/* Info text */}
      <p className="text-xs text-muted-foreground text-center mt-4">
        Your resume will be generated with your current settings and downloaded instantly.
      </p>
    </div>
  )
}
