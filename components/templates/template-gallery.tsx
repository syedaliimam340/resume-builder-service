'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Eye, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Template {
  id: string
  name: string
  category: string
  description: string
  colors: {
    primary: string
    accent: string
    background: string
  }
}

const templates: Template[] = [
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    category: 'Modern',
    description: 'Clean and contemporary design perfect for tech and corporate roles',
    colors: { primary: '#1e293b', accent: '#3b82f6', background: '#ffffff' },
  },
  {
    id: 'classic-elegant',
    name: 'Classic Elegant',
    category: 'Classic',
    description: 'Timeless design with traditional formatting for conservative industries',
    colors: { primary: '#1f2937', accent: '#059669', background: '#fafafa' },
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    category: 'Minimal',
    description: 'Sleek minimalist layout that lets your content shine',
    colors: { primary: '#18181b', accent: '#71717a', background: '#ffffff' },
  },
  {
    id: 'creative-bold',
    name: 'Creative Bold',
    category: 'Creative',
    description: 'Eye-catching design for creative professionals',
    colors: { primary: '#7c3aed', accent: '#ec4899', background: '#faf5ff' },
  },
  {
    id: 'executive-premium',
    name: 'Executive Premium',
    category: 'Executive',
    description: 'Sophisticated design for senior leadership positions',
    colors: { primary: '#0f172a', accent: '#ca8a04', background: '#fffbeb' },
  },
  {
    id: 'tech-developer',
    name: 'Tech Developer',
    category: 'Tech',
    description: 'Optimized for software developers with skills matrix',
    colors: { primary: '#0d9488', accent: '#06b6d4', background: '#f0fdfa' },
  },
]

// Sample resume data for preview
const sampleData = {
  name: 'Alex Johnson',
  title: 'Senior Software Engineer',
  email: 'alex.johnson@email.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  summary: 'Experienced software engineer with 8+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about building scalable applications.',
  experience: [
    {
      company: 'Tech Corp Inc.',
      title: 'Senior Software Engineer',
      period: '2020 - Present',
      bullets: ['Led development of microservices architecture', 'Mentored team of 5 junior developers'],
    },
    {
      company: 'StartupXYZ',
      title: 'Full Stack Developer',
      period: '2017 - 2020',
      bullets: ['Built core product features used by 100K+ users', 'Implemented CI/CD pipelines'],
    },
  ],
  education: [
    { degree: 'M.S. Computer Science', school: 'Stanford University', year: '2017' },
    { degree: 'B.S. Computer Science', school: 'UC Berkeley', year: '2015' },
  ],
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL'],
}

export function TemplateGallery() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const handlePreview = (template: Template) => {
    setSelectedTemplate(template)
    setIsPreviewOpen(true)
  }

  const handleDownload = async (template: Template) => {
    setIsDownloading(true)
    setDownloadSuccess(false)
    
    // Simulate download process
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Generate HTML content for the resume
    const htmlContent = generateResumeHTML(template)
    
    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `resume-${template.id}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setIsDownloading(false)
    setDownloadSuccess(true)
    setTimeout(() => setDownloadSuccess(false), 3000)
  }

  const generateResumeHTML = (template: Template) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${sampleData.name} - Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', system-ui, sans-serif; 
      background: ${template.colors.background}; 
      color: ${template.colors.primary};
      line-height: 1.6;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid ${template.colors.accent}; }
    .name { font-size: 28px; font-weight: 700; margin-bottom: 4px; }
    .title { font-size: 16px; color: ${template.colors.accent}; margin-bottom: 8px; }
    .contact { font-size: 12px; color: #666; }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: ${template.colors.accent}; margin-bottom: 12px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
    .summary { font-size: 14px; color: #4b5563; }
    .job { margin-bottom: 16px; }
    .job-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
    .job-title { font-weight: 600; }
    .job-period { font-size: 12px; color: #666; }
    .job-company { font-size: 14px; color: ${template.colors.accent}; }
    .bullets { list-style: disc; padding-left: 20px; font-size: 13px; }
    .edu-item { margin-bottom: 8px; }
    .edu-degree { font-weight: 600; }
    .edu-school { font-size: 13px; color: #666; }
    .skills { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill { background: ${template.colors.accent}15; color: ${template.colors.accent}; padding: 4px 12px; border-radius: 4px; font-size: 12px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">${sampleData.name}</div>
    <div class="title">${sampleData.title}</div>
    <div class="contact">${sampleData.email} | ${sampleData.phone} | ${sampleData.location}</div>
  </div>
  
  <div class="section">
    <div class="section-title">Professional Summary</div>
    <p class="summary">${sampleData.summary}</p>
  </div>
  
  <div class="section">
    <div class="section-title">Experience</div>
    ${sampleData.experience.map(job => `
      <div class="job">
        <div class="job-header">
          <span class="job-title">${job.title}</span>
          <span class="job-period">${job.period}</span>
        </div>
        <div class="job-company">${job.company}</div>
        <ul class="bullets">
          ${job.bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    `).join('')}
  </div>
  
  <div class="section">
    <div class="section-title">Education</div>
    ${sampleData.education.map(edu => `
      <div class="edu-item">
        <div class="edu-degree">${edu.degree}</div>
        <div class="edu-school">${edu.school}, ${edu.year}</div>
      </div>
    `).join('')}
  </div>
  
  <div class="section">
    <div class="section-title">Skills</div>
    <div class="skills">
      ${sampleData.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
    </div>
  </div>
</body>
</html>`
  }

  return (
    <section id="templates" className="py-24 bg-card/30">
      <div className="container px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Template
          </h2>
          <p className="text-lg text-muted-foreground">
            Browse our collection of professionally designed resume templates. 
            Preview any template and download instantly.
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Template Preview */}
              <div 
                className="aspect-[3/4] relative p-4"
                style={{ backgroundColor: template.colors.background }}
              >
                {/* Mini resume preview */}
                <div className="h-full rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                  <div 
                    className="h-3 w-24 rounded mb-1"
                    style={{ backgroundColor: template.colors.primary }}
                  />
                  <div 
                    className="h-2 w-16 rounded mb-3"
                    style={{ backgroundColor: template.colors.accent, opacity: 0.7 }}
                  />
                  <div className="space-y-2 mb-3">
                    <div className="h-1.5 w-full rounded bg-gray-200" />
                    <div className="h-1.5 w-4/5 rounded bg-gray-200" />
                    <div className="h-1.5 w-3/5 rounded bg-gray-200" />
                  </div>
                  <div 
                    className="h-2 w-12 rounded mb-2"
                    style={{ backgroundColor: template.colors.accent, opacity: 0.5 }}
                  />
                  <div className="space-y-2 mb-3">
                    <div className="h-1.5 w-full rounded bg-gray-200" />
                    <div className="h-1.5 w-5/6 rounded bg-gray-200" />
                  </div>
                  <div className="flex gap-1 mt-auto">
                    {[1, 2, 3].map((i) => (
                      <div 
                        key={i}
                        className="h-4 w-10 rounded text-[6px] flex items-center justify-center text-white"
                        style={{ backgroundColor: template.colors.accent }}
                      >
                        Skill
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handlePreview(template)}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleDownload(template)}
                    disabled={isDownloading}
                    className="gap-2"
                  >
                    {isDownloading ? (
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : downloadSuccess ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    Download
                  </Button>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{template.name}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {template.category}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Download success notification */}
        {downloadSuccess && (
          <div className="fixed bottom-6 right-6 bg-primary text-primary-foreground px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-4">
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">Resume downloaded successfully!</span>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && selectedTemplate && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h3 className="font-semibold text-foreground">{selectedTemplate.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => handleDownload(selectedTemplate)}
                  disabled={isDownloading}
                  className="gap-2"
                >
                  {isDownloading ? (
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Download
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsPreviewOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Modal Content - Resume Preview */}
            <div className="flex-1 overflow-auto p-6 bg-muted/50">
              <div 
                className="max-w-2xl mx-auto rounded-lg shadow-xl p-8"
                style={{ backgroundColor: selectedTemplate.colors.background }}
              >
                {/* Resume Header */}
                <div 
                  className="border-b-2 pb-4 mb-6"
                  style={{ borderColor: selectedTemplate.colors.accent }}
                >
                  <h1 
                    className="text-2xl font-bold mb-1"
                    style={{ color: selectedTemplate.colors.primary }}
                  >
                    {sampleData.name}
                  </h1>
                  <p 
                    className="text-lg mb-2"
                    style={{ color: selectedTemplate.colors.accent }}
                  >
                    {sampleData.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {sampleData.email} | {sampleData.phone} | {sampleData.location}
                  </p>
                </div>

                {/* Summary */}
                <div className="mb-6">
                  <h2 
                    className="text-sm font-semibold uppercase tracking-wider mb-2 border-b pb-1"
                    style={{ color: selectedTemplate.colors.accent, borderColor: '#e5e7eb' }}
                  >
                    Professional Summary
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{sampleData.summary}</p>
                </div>

                {/* Experience */}
                <div className="mb-6">
                  <h2 
                    className="text-sm font-semibold uppercase tracking-wider mb-3 border-b pb-1"
                    style={{ color: selectedTemplate.colors.accent, borderColor: '#e5e7eb' }}
                  >
                    Experience
                  </h2>
                  {sampleData.experience.map((job, idx) => (
                    <div key={idx} className="mb-4">
                      <div className="flex justify-between items-start mb-1">
                        <span 
                          className="font-semibold"
                          style={{ color: selectedTemplate.colors.primary }}
                        >
                          {job.title}
                        </span>
                        <span className="text-xs text-gray-500">{job.period}</span>
                      </div>
                      <p 
                        className="text-sm mb-2"
                        style={{ color: selectedTemplate.colors.accent }}
                      >
                        {job.company}
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {job.bullets.map((bullet, i) => (
                          <li key={i}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Education */}
                <div className="mb-6">
                  <h2 
                    className="text-sm font-semibold uppercase tracking-wider mb-3 border-b pb-1"
                    style={{ color: selectedTemplate.colors.accent, borderColor: '#e5e7eb' }}
                  >
                    Education
                  </h2>
                  {sampleData.education.map((edu, idx) => (
                    <div key={idx} className="mb-2">
                      <p 
                        className="font-semibold"
                        style={{ color: selectedTemplate.colors.primary }}
                      >
                        {edu.degree}
                      </p>
                      <p className="text-sm text-gray-600">{edu.school}, {edu.year}</p>
                    </div>
                  ))}
                </div>

                {/* Skills */}
                <div>
                  <h2 
                    className="text-sm font-semibold uppercase tracking-wider mb-3 border-b pb-1"
                    style={{ color: selectedTemplate.colors.accent, borderColor: '#e5e7eb' }}
                  >
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {sampleData.skills.map((skill) => (
                      <span 
                        key={skill}
                        className="px-3 py-1 rounded text-xs"
                        style={{ 
                          backgroundColor: `${selectedTemplate.colors.accent}15`,
                          color: selectedTemplate.colors.accent 
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
