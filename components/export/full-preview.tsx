'use client'

import { useState } from 'react'
import { useResumeStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ZoomIn, ZoomOut, Maximize2, Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react'

export function FullPreview() {
  const { resume, customizations } = useResumeStore()
  const [zoom, setZoom] = useState(100)
  const { personalInfo, summary, experience, education, skills, certifications, languages, projects } = resume

  const handleZoomIn = () => setZoom(Math.min(zoom + 25, 200))
  const handleZoomOut = () => setZoom(Math.max(zoom - 25, 50))
  const handleResetZoom = () => setZoom(100)

  const getLinkIcon = (type: string) => {
    switch (type) {
      case 'linkedin': return Linkedin
      case 'github': return Github
      default: return Globe
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === 'present') return 'Present'
    const [year, month] = dateStr.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
        <h3 className="font-medium text-foreground">Full Preview</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={zoom <= 50}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground w-12 text-center">{zoom}%</span>
          <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={zoom >= 200}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <div className="w-px h-4 bg-border mx-2" />
          <Button variant="ghost" size="icon" onClick={handleResetZoom}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Preview container */}
      <div className="p-8 bg-muted/20 overflow-auto max-h-[70vh]">
        <div 
          className="mx-auto transition-transform origin-top"
          style={{ 
            transform: `scale(${zoom / 100})`,
            width: zoom > 100 ? `${(100 / zoom) * 100}%` : '100%',
          }}
        >
          {/* A4 Resume Paper */}
          <div 
            className="bg-white text-black w-full max-w-[612px] mx-auto shadow-2xl"
            style={{ 
              aspectRatio: '8.5 / 11',
              '--primary-color': customizations.primaryColor,
              '--accent-color': customizations.accentColor,
            } as React.CSSProperties}
          >
            <div className={cn(
              'p-8 h-full overflow-y-auto',
              customizations.spacing === 'compact' && 'p-6',
              customizations.spacing === 'relaxed' && 'p-10'
            )}>
              {/* Header */}
              <header className="text-center pb-4 border-b-2 mb-4" style={{ borderColor: customizations.accentColor }}>
                <h1 
                  className={cn(
                    'font-bold mb-1',
                    customizations.fontSize === 'small' && 'text-xl',
                    customizations.fontSize === 'medium' && 'text-2xl',
                    customizations.fontSize === 'large' && 'text-3xl',
                  )}
                  style={{ color: customizations.primaryColor }}
                >
                  {personalInfo.fullName || 'Your Name'}
                </h1>
                {personalInfo.title && (
                  <p 
                    className={cn(
                      'font-medium mb-2',
                      customizations.fontSize === 'small' && 'text-sm',
                      customizations.fontSize === 'medium' && 'text-base',
                      customizations.fontSize === 'large' && 'text-lg',
                    )}
                    style={{ color: customizations.accentColor }}
                  >
                    {personalInfo.title}
                  </p>
                )}
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600">
                  {personalInfo.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {personalInfo.email}
                    </span>
                  )}
                  {personalInfo.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {personalInfo.phone}
                    </span>
                  )}
                  {personalInfo.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {personalInfo.location}
                    </span>
                  )}
                </div>
                {personalInfo.links.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
                    {personalInfo.links.map((link, idx) => {
                      const Icon = getLinkIcon(link.type)
                      return (
                        <span key={idx} className="flex items-center gap-1 text-xs" style={{ color: customizations.accentColor }}>
                          <Icon className="h-3 w-3" />
                          {link.url.replace(/^https?:\/\//, '').split('/')[0]}
                        </span>
                      )
                    })}
                  </div>
                )}
              </header>

              {/* Content */}
              <div className={cn(
                customizations.spacing === 'compact' && 'space-y-3',
                customizations.spacing === 'normal' && 'space-y-4',
                customizations.spacing === 'relaxed' && 'space-y-5',
              )}>
                {/* Summary */}
                {summary && (
                  <section>
                    <h2 
                      className="text-sm font-bold uppercase tracking-wider mb-2 pb-1 border-b"
                      style={{ color: customizations.primaryColor, borderColor: customizations.accentColor }}
                    >
                      Professional Summary
                    </h2>
                    <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
                  </section>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                  <section>
                    <h2 
                      className="text-sm font-bold uppercase tracking-wider mb-2 pb-1 border-b"
                      style={{ color: customizations.primaryColor, borderColor: customizations.accentColor }}
                    >
                      Professional Experience
                    </h2>
                    <div className="space-y-3">
                      {experience.map((exp) => (
                        <div key={exp.id}>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-sm" style={{ color: customizations.primaryColor }}>
                                {exp.title}
                              </p>
                              <p className="text-xs text-gray-600">
                                {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500">
                              {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                            </p>
                          </div>
                          {exp.bullets.filter(b => b.trim()).length > 0 && (
                            <ul className="mt-1.5 space-y-1 ml-4">
                              {exp.bullets.filter(b => b.trim()).map((bullet, idx) => (
                                <li key={idx} className="text-xs text-gray-700 list-disc">
                                  {bullet}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Education */}
                {education.length > 0 && (
                  <section>
                    <h2 
                      className="text-sm font-bold uppercase tracking-wider mb-2 pb-1 border-b"
                      style={{ color: customizations.primaryColor, borderColor: customizations.accentColor }}
                    >
                      Education
                    </h2>
                    <div className="space-y-2">
                      {education.map((edu) => (
                        <div key={edu.id} className="flex justify-between">
                          <div>
                            <p className="font-semibold text-sm" style={{ color: customizations.primaryColor }}>
                              {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                            </p>
                            <p className="text-xs text-gray-600">{edu.institution}</p>
                          </div>
                          <p className="text-xs text-gray-500">{formatDate(edu.graduationDate)}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                  <section>
                    <h2 
                      className="text-sm font-bold uppercase tracking-wider mb-2 pb-1 border-b"
                      style={{ color: customizations.primaryColor, borderColor: customizations.accentColor }}
                    >
                      Skills
                    </h2>
                    <div className="space-y-1">
                      {skills.map((category) => (
                        <div key={category.category} className="text-sm">
                          <span className="font-medium text-gray-700">{category.category}: </span>
                          <span className="text-gray-600">
                            {category.items.map(s => s.name).join(', ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Certifications */}
                {certifications.length > 0 && (
                  <section>
                    <h2 
                      className="text-sm font-bold uppercase tracking-wider mb-2 pb-1 border-b"
                      style={{ color: customizations.primaryColor, borderColor: customizations.accentColor }}
                    >
                      Certifications
                    </h2>
                    <div className="space-y-1">
                      {certifications.map((cert) => (
                        <p key={cert.id} className="text-sm text-gray-700">
                          <span className="font-medium">{cert.name}</span> - {cert.issuer}, {formatDate(cert.date)}
                        </p>
                      ))}
                    </div>
                  </section>
                )}

                {/* Languages */}
                {languages.length > 0 && (
                  <section>
                    <h2 
                      className="text-sm font-bold uppercase tracking-wider mb-2 pb-1 border-b"
                      style={{ color: customizations.primaryColor, borderColor: customizations.accentColor }}
                    >
                      Languages
                    </h2>
                    <p className="text-sm text-gray-700">
                      {languages.map(l => `${l.language} (${l.proficiency})`).join(' | ')}
                    </p>
                  </section>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                  <section>
                    <h2 
                      className="text-sm font-bold uppercase tracking-wider mb-2 pb-1 border-b"
                      style={{ color: customizations.primaryColor, borderColor: customizations.accentColor }}
                    >
                      Projects
                    </h2>
                    <div className="space-y-2">
                      {projects.map((project) => (
                        <div key={project.id}>
                          <p className="font-semibold text-sm" style={{ color: customizations.primaryColor }}>
                            {project.name}
                          </p>
                          <p className="text-xs text-gray-600">{project.description}</p>
                          {project.technologies.length > 0 && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              <span className="font-medium">Tech:</span> {project.technologies.join(', ')}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
