'use client'

import { useState } from 'react'
import { useResumeStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { FullPreview } from './full-preview'
import { ExportOptions } from './export-options'
import { exportToPDF } from '@/lib/pdf-export'
import { 
  Download, 
  Share2, 
  Edit3, 
  Check,
  ArrowUp,
  Sparkles
} from 'lucide-react'

export function ExportSection() {
  const { resume, customizations, isDirty, markSaved } = useResumeStore()
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  const handleExport = async (format: string) => {
    setIsExporting(true)
    try {
      if (format === 'pdf') {
        exportToPDF(resume, customizations)
        // PDF export opens a print dialog; just wait briefly
        await new Promise(resolve => setTimeout(resolve, 500))
      } else if (format === 'json') {
        const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${resume.personalInfo.fullName || 'resume'}.json`
        a.click()
        URL.revokeObjectURL(url)
      } else if (format === 'txt') {
        const lines: string[] = []
        const pi = resume.personalInfo
        if (pi.fullName) lines.push(pi.fullName)
        if (pi.title) lines.push(pi.title)
        const contact = [pi.email, pi.phone, pi.location].filter(Boolean).join(' | ')
        if (contact) lines.push(contact)
        if (pi.links.length) lines.push(pi.links.map(l => l.url).join(' | '))
        if (resume.summary) { lines.push('', 'PROFESSIONAL SUMMARY', resume.summary) }
        if (resume.experience.length) {
          lines.push('', 'EXPERIENCE')
          resume.experience.forEach(exp => {
            lines.push(`${exp.title} at ${exp.company}`)
            exp.bullets.filter(b => b.trim()).forEach(b => lines.push(`• ${b}`))
          })
        }
        if (resume.education.length) {
          lines.push('', 'EDUCATION')
          resume.education.forEach(edu => {
            lines.push(`${edu.degree}${edu.field ? ` in ${edu.field}` : ''} – ${edu.institution}`)
          })
        }
        if (resume.skills.length) {
          lines.push('', 'SKILLS')
          resume.skills.forEach(cat => lines.push(`${cat.category}: ${cat.items.map(s => s.name).join(', ')}`))
        }
        const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${resume.personalInfo.fullName || 'resume'}.txt`
        a.click()
        URL.revokeObjectURL(url)
      } else {
        // Simulate other formats (docx, png)
        await new Promise(resolve => setTimeout(resolve, 1500))
      }
      setExportSuccess(true)
      markSaved()
      setTimeout(() => setExportSuccess(false), 3000)
    } finally {
      setIsExporting(false)
    }
  }

  const scrollToBuilder = () => {
    document.getElementById('builder')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hasContent = resume.personalInfo.fullName || resume.experience.length > 0 || resume.education.length > 0

  return (
    <section id="export" className="py-24 min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div className="container relative z-10 px-4 md:px-6">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary">Almost there!</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Review & Download
          </h2>
          <p className="text-lg text-muted-foreground">
            Preview your resume, make final adjustments, and download in your preferred format.
          </p>
        </div>

        {hasContent ? (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left side - Full Preview */}
            <div className="lg:col-span-3">
              <FullPreview />
            </div>

            {/* Right side - Export Options */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status card */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  {isDirty ? (
                    <>
                      <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
                      <span className="text-sm text-muted-foreground">Unsaved changes</span>
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-sm text-muted-foreground">All changes saved</span>
                    </>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Sections completed</span>
                    <span className="font-medium text-foreground">
                      {[
                        resume.personalInfo.fullName,
                        resume.experience.length > 0,
                        resume.education.length > 0,
                        resume.skills.length > 0,
                      ].filter(Boolean).length} / 4
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{
                        width: `${([
                          resume.personalInfo.fullName,
                          resume.experience.length > 0,
                          resume.education.length > 0,
                          resume.skills.length > 0,
                        ].filter(Boolean).length / 4) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Export options */}
              <ExportOptions onExport={handleExport} isExporting={isExporting} />

              {/* Success message */}
              {exportSuccess && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <p className="text-sm text-green-500">Resume downloaded successfully!</p>
                </div>
              )}

              {/* Quick actions */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-medium text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3"
                    onClick={scrollToBuilder}
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Resume
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3"
                  >
                    <Share2 className="h-4 w-4" />
                    Share Link
                  </Button>
                </div>
              </div>

              {/* Pro features teaser */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
                <h3 className="font-medium text-foreground mb-2">Upgrade to Pro</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get access to premium templates, AI suggestions, and unlimited downloads.
                </p>
                <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Download className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No resume to export yet</h3>
            <p className="text-muted-foreground mb-6">
              Start building your resume to see the preview and download options.
            </p>
            <Button onClick={scrollToBuilder} size="lg">
              Start Building
            </Button>
          </div>
        )}

        {/* Back to top */}
        <div className="mt-16 text-center">
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowUp className="h-4 w-4" />
            <span className="text-sm">Back to top</span>
          </button>
        </div>
      </div>
    </section>
  )
}
