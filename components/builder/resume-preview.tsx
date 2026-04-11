'use client'

import { useResumeStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink } from 'lucide-react'

export function ResumePreview() {
  const { resume, customizations } = useResumeStore()
  const { personalInfo, summary, experience, education, skills, certifications, languages, projects } = resume

  const fontSizeClasses = {
    small: 'text-[10px]',
    medium: 'text-xs',
    large: 'text-sm',
  }

  const spacingClasses = {
    compact: 'space-y-2',
    normal: 'space-y-3',
    relaxed: 'space-y-4',
  }

  const getLinkIcon = (type: string) => {
    switch (type) {
      case 'linkedin':
        return Linkedin
      case 'github':
        return Github
      default:
        return Globe
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === 'present') return 'Present'
    const [year, month] = dateStr.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const isEmpty = !personalInfo.fullName && !summary && experience.length === 0 && education.length === 0

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-3 border-b border-border flex items-center justify-between bg-muted/30">
        <span className="text-sm font-medium text-foreground">Live Preview</span>
        <span className="text-xs text-muted-foreground">Updates in real-time</span>
      </div>

      {/* Resume paper */}
      <div className="p-4 bg-muted/20">
        <div 
          className={cn(
            'bg-white text-black aspect-[8.5/11] w-full max-w-md mx-auto rounded shadow-lg overflow-hidden',
            fontSizeClasses[customizations.fontSize]
          )}
          style={{ 
            '--primary-color': customizations.primaryColor,
            '--accent-color': customizations.accentColor,
          } as React.CSSProperties}
        >
          {isEmpty ? (
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-gray-300">?</span>
                </div>
                <p className="text-gray-400 text-sm">Start filling in your details to see the preview</p>
              </div>
            </div>
          ) : (
            <div className={cn('p-6 h-full overflow-y-auto', spacingClasses[customizations.spacing])}>
              {/* Header */}
              <header className="text-center pb-3 border-b border-gray-200 mb-3">
                <h1 
                  className="text-lg font-bold mb-0.5"
                  style={{ color: customizations.primaryColor }}
                >
                  {personalInfo.fullName || 'Your Name'}
                </h1>
                {personalInfo.title && (
                  <p 
                    className="text-[11px] font-medium mb-1"
                    style={{ color: customizations.accentColor }}
                  >
                    {personalInfo.title}
                  </p>
                )}
                <div className="flex flex-wrap items-center justify-center gap-2 text-[9px] text-gray-600">
                  {personalInfo.email && (
                    <span className="flex items-center gap-0.5">
                      <Mail className="h-2.5 w-2.5" />
                      {personalInfo.email}
                    </span>
                  )}
                  {personalInfo.phone && (
                    <span className="flex items-center gap-0.5">
                      <Phone className="h-2.5 w-2.5" />
                      {personalInfo.phone}
                    </span>
                  )}
                  {personalInfo.location && (
                    <span className="flex items-center gap-0.5">
                      <MapPin className="h-2.5 w-2.5" />
                      {personalInfo.location}
                    </span>
                  )}
                </div>
                {personalInfo.links.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
                    {personalInfo.links.map((link, idx) => {
                      const Icon = getLinkIcon(link.type)
                      return (
                        <span key={idx} className="flex items-center gap-0.5 text-[9px]" style={{ color: customizations.accentColor }}>
                          <Icon className="h-2.5 w-2.5" />
                          {link.url.replace(/^https?:\/\//, '').split('/')[0]}
                        </span>
                      )
                    })}
                  </div>
                )}
              </header>

              {/* Summary */}
              {summary && (
                <section className="mb-3">
                  <h2 
                    className="text-[10px] font-bold uppercase tracking-wider mb-1 pb-0.5 border-b"
                    style={{ color: customizations.primaryColor, borderColor: customizations.accentColor }}
                  >
                    Professional Summary
                  </h2>
                  <p className="text-[9px] text-gray-700 leading-relaxed">{summary}</p>
                </section>
              )}

              {/* Experience */}
              {experience.length > 0 && (
                <section className="mb-3">
                  <h2 
                    className="text-[10px] font-bold uppercase tracking-wider mb-1 pb-0.5 border-b"
                    style={{ color: customizations.primaryColor, borderColor: customizations.accentColor }}
                  >
                    Experience
                  </h2>
                  <div className="space-y-2">
                    {experience.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-[10px]" style={{ color: customizations.primaryColor }}>
                              {exp.title}
                            </p>
                            <p className="text-[9px] text-gray-600">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                          </div>
                          <p className="text-[8px] text-gray-500 whitespace-nowrap">
                            {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                          </p>
                        </div>
                        {exp.bullets.length > 0 && (
                          <ul className="mt-1 space-y-0.5">
                            {exp.bullets.filter(b => b.trim()).map((bullet, idx) => (
                              <li key={idx} className="text-[9px] text-gray-700 pl-2 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
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
                <section className="mb-3">
                  <h2 
                    className="text-[10px] font-bold uppercase tracking-wider mb-1 pb-0.5 border-b"
                    style={{ color: customizations.primaryColor, borderColor: customizations.accentColor }}
                  >
                    Education
                  </h2>
                  <div className="space-y-1.5">
                    {education.map((edu) => (
                      <div key={edu.id} className="flex justify-between">
                        <div>
                          <p className="font-semibold text-[10px]" style={{ color: customizations.primaryColor }}>
                            {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                          </p>
                          <p className="text-[9px] text-gray-600">{edu.institution}</p>
                        </div>
                        <p className="text-[8px] text-gray-500">{formatDate(edu.graduationDate)}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <section className="mb-3">
                  <h2 
                    className="text-[10px] font-bold uppercase tracking-wider mb-1 pb-0.5 border-b"
                    style={{ color: customizations.primaryColor, borderColor: customizations.accentColor }}
                  >
                    Skills
                  </h2>
                  <div className="space-y-1">
                    {skills.map((category) => (
                      <div key={category.category}>
                        <span className="text-[9px] font-medium text-gray-700">{category.category}: </span>
                        <span className="text-[9px] text-gray-600">
                          {category.items.map(s => s.name).join(', ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Certifications */}
              {certifications.length > 0 && (
                <section className="mb-3">
                  <h2 
                    className="text-[10px] font-bold uppercase tracking-wider mb-1 pb-0.5 border-b"
                    style={{ color: customizations.primaryColor, borderColor: customizations.accentColor }}
                  >
                    Certifications
                  </h2>
                  <div className="space-y-0.5">
                    {certifications.map((cert) => (
                      <p key={cert.id} className="text-[9px] text-gray-700">
                        <span className="font-medium">{cert.name}</span> - {cert.issuer}, {formatDate(cert.date)}
                      </p>
                    ))}
                  </div>
                </section>
              )}

              {/* Languages */}
              {languages.length > 0 && (
                <section className="mb-3">
                  <h2 
                    className="text-[10px] font-bold uppercase tracking-wider mb-1 pb-0.5 border-b"
                    style={{ color: customizations.primaryColor, borderColor: customizations.accentColor }}
                  >
                    Languages
                  </h2>
                  <p className="text-[9px] text-gray-700">
                    {languages.map(l => `${l.language} (${l.proficiency})`).join(', ')}
                  </p>
                </section>
              )}

              {/* Projects */}
              {projects.length > 0 && (
                <section>
                  <h2 
                    className="text-[10px] font-bold uppercase tracking-wider mb-1 pb-0.5 border-b"
                    style={{ color: customizations.primaryColor, borderColor: customizations.accentColor }}
                  >
                    Projects
                  </h2>
                  <div className="space-y-1.5">
                    {projects.map((project) => (
                      <div key={project.id}>
                        <p className="font-semibold text-[10px]" style={{ color: customizations.primaryColor }}>
                          {project.name}
                        </p>
                        <p className="text-[9px] text-gray-600">{project.description}</p>
                        {project.technologies.length > 0 && (
                          <p className="text-[8px] text-gray-500 mt-0.5">
                            Technologies: {project.technologies.join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
