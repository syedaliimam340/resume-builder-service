'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Download, Eye, X, Check, Plus, Trash2, Save, 
  FileText, FileIcon, Edit3, ChevronLeft, ChevronRight
} from 'lucide-react'
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

interface Experience {
  id: string
  company: string
  title: string
  period: string
  bullets: string[]
}

interface Education {
  id: string
  degree: string
  school: string
  year: string
}

interface ResumeData {
  id: string
  name: string
  title: string
  email: string
  phone: string
  location: string
  summary: string
  experience: Experience[]
  education: Education[]
  skills: string[]
  createdAt: number
  updatedAt: number
}

const DEFAULT_TEMPLATE_ID = 'modern-professional'

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
  {
    id: 'ats-professional',
    name: 'ATS Optimized Professional',
    category: 'ATS',
    description: 'Maximum ATS compatibility with clean, simple formatting for best parsing results',
    colors: { primary: '#1a1a1a', accent: '#2563eb', background: '#ffffff' },
  },
  {
    id: 'ats-modern',
    name: 'ATS Optimized Modern',
    category: 'ATS',
    description: 'Professional look with ATS optimization — ideal for corporate and tech roles',
    colors: { primary: '#111827', accent: '#0ea5e9', background: '#f8fafc' },
  },
]

const defaultResumeData: Omit<ResumeData, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  summary: '',
  experience: [],
  education: [],
  skills: [],
}

const STORAGE_KEY = 'kangaroo-developers-resumes'

export function TemplateGallery() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [savedResumes, setSavedResumes] = useState<ResumeData[]>([])
  const [currentResume, setCurrentResume] = useState<ResumeData | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState<'pdf' | 'docx' | null>(null)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [newSkill, setNewSkill] = useState('')
  const [editorStep, setEditorStep] = useState(0)

  // Load saved resumes from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setSavedResumes(JSON.parse(stored))
      } catch {
        setSavedResumes([])
      }
    }
  }, [])

  // Save resumes to localStorage
  const saveToStorage = useCallback((resumes: ResumeData[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes))
    setSavedResumes(resumes)
  }, [])

  const createNewResume = (template: Template) => {
    const newResume: ResumeData = {
      ...defaultResumeData,
      id: `resume-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      experience: [{
        id: `exp-${Date.now()}`,
        company: '',
        title: '',
        period: '',
        bullets: ['']
      }],
      education: [{
        id: `edu-${Date.now()}`,
        degree: '',
        school: '',
        year: ''
      }]
    }
    setCurrentResume(newResume)
    setSelectedTemplate(template)
    setEditorStep(0)
    setIsEditorOpen(true)
  }

  const editResume = (resume: ResumeData, template: Template) => {
    setCurrentResume({ ...resume })
    setSelectedTemplate(template)
    setEditorStep(0)
    setIsEditorOpen(true)
  }

  const saveResume = () => {
    if (!currentResume) return
    
    const updatedResume = { ...currentResume, updatedAt: Date.now() }
    const existingIndex = savedResumes.findIndex(r => r.id === currentResume.id)
    
    let newResumes: ResumeData[]
    if (existingIndex >= 0) {
      newResumes = [...savedResumes]
      newResumes[existingIndex] = updatedResume
    } else {
      newResumes = [...savedResumes, updatedResume]
    }
    
    saveToStorage(newResumes)
    setCurrentResume(updatedResume)
    setShowSaveSuccess(true)
    setTimeout(() => setShowSaveSuccess(false), 2000)
  }

  const deleteResume = (id: string) => {
    const newResumes = savedResumes.filter(r => r.id !== id)
    saveToStorage(newResumes)
    setShowDeleteConfirm(null)
    if (currentResume?.id === id) {
      setCurrentResume(null)
      setIsEditorOpen(false)
    }
  }

  const updateResumeField = (field: keyof ResumeData, value: string | Experience[] | Education[] | string[]) => {
    if (!currentResume) return
    setCurrentResume({ ...currentResume, [field]: value })
  }

  const addExperience = () => {
    if (!currentResume) return
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      company: '',
      title: '',
      period: '',
      bullets: ['']
    }
    updateResumeField('experience', [...currentResume.experience, newExp])
  }

  const updateExperience = (id: string, field: keyof Experience, value: string | string[]) => {
    if (!currentResume) return
    const updated = currentResume.experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    )
    updateResumeField('experience', updated)
  }

  const removeExperience = (id: string) => {
    if (!currentResume) return
    updateResumeField('experience', currentResume.experience.filter(exp => exp.id !== id))
  }

  const addEducation = () => {
    if (!currentResume) return
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      degree: '',
      school: '',
      year: ''
    }
    updateResumeField('education', [...currentResume.education, newEdu])
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    if (!currentResume) return
    const updated = currentResume.education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    )
    updateResumeField('education', updated)
  }

  const removeEducation = (id: string) => {
    if (!currentResume) return
    updateResumeField('education', currentResume.education.filter(edu => edu.id !== id))
  }

  const addSkill = () => {
    if (!currentResume || !newSkill.trim()) return
    if (!currentResume.skills.includes(newSkill.trim())) {
      updateResumeField('skills', [...currentResume.skills, newSkill.trim()])
    }
    setNewSkill('')
  }

  const removeSkill = (skill: string) => {
    if (!currentResume) return
    updateResumeField('skills', currentResume.skills.filter(s => s !== skill))
  }

  const mixWithWhite = (hex: string, weight: number) => {
    const cleaned = hex.replace('#', '').trim()
    const normalized = cleaned.length === 3
      ? cleaned.split('').map((c) => c + c).join('')
      : cleaned.padStart(6, '0').slice(0, 6)
    const num = parseInt(normalized, 16)
    const r = (num >> 16) & 0xff
    const g = (num >> 8) & 0xff
    const b = num & 0xff
    const mix = (channel: number) => Math.round(channel * weight + 255 * (1 - weight))
    const toHex = (channel: number) => mix(channel).toString(16).padStart(2, '0')
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }

  const generateResumeHTML = (resume: ResumeData, template: Template) => {
    const isATS = template.category === 'ATS'
    const accentTint = mixWithWhite(template.colors.accent, 0.15)
    // Apply print color adjustments in both CSS and inline styles for PDF/Word export fidelity.
    const printAdjust = 'print-color-adjust: exact; -webkit-print-color-adjust: exact;'
    const styledFontFamily = "'Segoe UI', system-ui, sans-serif"
    const mutedTextColor = mixWithWhite(template.colors.primary, 0.45)
    const fadedBodyTextColor = mixWithWhite(template.colors.primary, 0.6)
    const dividerColor = mixWithWhite(template.colors.primary, 0.2)

    const bodyStyle = `font-family: ${styledFontFamily}; background: ${template.colors.background}; color: ${template.colors.primary}; line-height: 1.6; padding: 40px; max-width: 800px; margin: 0 auto; font-size: 14px; ${printAdjust}`
    const headerStyle = `margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid ${template.colors.accent};`
    const nameStyle = `font-size: 28px; font-weight: 700; margin-bottom: 4px; color: ${template.colors.primary};`
    const titleStyle = `font-size: 16px; font-weight: 600; color: ${template.colors.accent}; margin-bottom: 8px;`
    const contactStyle = `font-size: 12px; color: ${mutedTextColor};`
    const sectionStyle = 'margin-bottom: 20px;'
    const sectionTitleStyle = `font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: ${template.colors.accent}; margin-bottom: 12px; border-bottom: 1px solid ${dividerColor}; padding-bottom: 4px;`
    const summaryStyle = `font-size: 14px; color: ${fadedBodyTextColor};`
    const jobStyle = 'margin-bottom: 16px;'
    const jobHeaderStyle = 'display: flex; justify-content: space-between; margin-bottom: 4px; gap: 12px;'
    const jobTitleStyle = `font-weight: 600; color: ${template.colors.primary};`
    const jobPeriodStyle = `font-size: 12px; color: ${mutedTextColor}; white-space: nowrap;`
    const jobCompanyStyle = `font-size: 14px; color: ${template.colors.accent};`
    const bulletsStyle = `list-style: disc; padding-left: 20px; font-size: 13px; margin-top: 6px; color: ${fadedBodyTextColor};`
    const eduItemStyle = 'margin-bottom: 8px;'
    const eduDegreeStyle = `font-weight: 600; color: ${template.colors.primary};`
    const eduSchoolStyle = `font-size: 13px; color: ${mutedTextColor};`
    const skillsStyle = 'display: flex; flex-wrap: wrap; gap: 8px;'
    const skillStyle = `background: ${accentTint}; color: ${template.colors.accent}; padding: 4px 12px; border-radius: 4px; font-size: 12px;`

    const atsBodyStyle = `font-family: Arial, Helvetica, sans-serif; color: #000000; background: #ffffff; line-height: 1.5; padding: 40px; max-width: 800px; margin: 0 auto; font-size: 14px; ${printAdjust}`
    const atsNameStyle = 'font-size: 22px; font-weight: bold; margin-bottom: 2px; color: #000000;'
    const atsTitleStyle = 'font-size: 15px; margin-bottom: 4px; color: #000000;'
    const atsContactStyle = 'font-size: 13px; margin-bottom: 16px; color: #000000;'
    const atsSectionTitleStyle = 'font-size: 14px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000000; padding-bottom: 2px; margin-top: 16px; margin-bottom: 8px; letter-spacing: 0.5px; color: #000000;'
    const atsParagraphStyle = 'font-size: 13px; margin-bottom: 8px; color: #000000;'
    const atsJobStyle = 'margin-bottom: 12px;'
    const atsJobHeaderStyle = 'display: flex; justify-content: space-between; margin-bottom: 2px; gap: 12px;'
    const atsJobTitleStyle = 'font-weight: bold; font-size: 13px; color: #000000;'
    const atsJobCompanyStyle = 'font-size: 13px; color: #000000;'
    const atsJobPeriodStyle = 'font-size: 12px; color: #000000; white-space: nowrap;'
    const atsListStyle = 'list-style: disc; padding-left: 18px; font-size: 13px; margin-top: 4px; color: #000000;'
    const atsEduItemStyle = 'margin-bottom: 8px;'
    const atsEduDegreeStyle = 'font-weight: bold; font-size: 13px; color: #000000;'
    const atsEduSchoolStyle = 'font-size: 13px; color: #000000;'
    const atsSkillsStyle = 'font-size: 13px; color: #000000;'

    if (isATS) {
      // ATS-optimized output: plain structure, no decorative styles, standard fonts
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resume.name || 'Resume'} - Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; ${printAdjust} }
    html, body { ${printAdjust} }
    @media print { body { padding: 20px; background: #ffffff; } }
  </style>
</head>
 <body style="${atsBodyStyle}">
   <h1 style="${atsNameStyle}">${resume.name || 'Your Name'}</h1>
   <div style="${atsTitleStyle}">${resume.title || ''}</div>
   <div style="${atsContactStyle}">${[resume.email, resume.phone, resume.location].filter(Boolean).join(' | ')}</div>
 
  ${resume.summary ? `<h2 style="${atsSectionTitleStyle}">Professional Summary</h2>
  <p style="${atsParagraphStyle}">${resume.summary}</p>` : ''}
 
  ${resume.experience.length > 0 && resume.experience.some(e => e.company || e.title) ? `<h2 style="${atsSectionTitleStyle}">Work Experience</h2>
  ${resume.experience.filter(job => job.company || job.title).map(job => `
  <div style="${atsJobStyle}">
    <div style="${atsJobHeaderStyle}">
      <span style="${atsJobTitleStyle}">${job.title || 'Job Title'} — <span style="${atsJobCompanyStyle}">${job.company || 'Company'}</span></span>
      <span style="${atsJobPeriodStyle}">${job.period || ''}</span>
    </div>
    ${job.bullets.filter(b => b.trim()).length > 0 ? `<ul style="${atsListStyle}">${job.bullets.filter(b => b.trim()).map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
  </div>`).join('')}` : ''}
 
  ${resume.education.length > 0 && resume.education.some(e => e.school || e.degree) ? `<h2 style="${atsSectionTitleStyle}">Education</h2>
  ${resume.education.filter(edu => edu.school || edu.degree).map(edu => `
  <div style="${atsEduItemStyle}">
    <div style="${atsEduDegreeStyle}">${edu.degree || 'Degree'}</div>
    <div style="${atsEduSchoolStyle}">${edu.school || 'School'}${edu.year ? ` (${edu.year})` : ''}</div>
  </div>`).join('')}` : ''}
 
  ${resume.skills.length > 0 ? `<h2 style="${atsSectionTitleStyle}">Skills</h2>
  <p style="${atsSkillsStyle}">${resume.skills.join(', ')}</p>` : ''}
</body>
</html>`
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resume.name || 'Resume'} - Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; ${printAdjust} }
    html, body { ${printAdjust} }
    @media print { body { padding: 20px; background: ${template.colors.background}; } }
  </style>
</head>
 <body style="${bodyStyle}">
   <div style="${headerStyle}">
     <div style="${nameStyle}">${resume.name || 'Your Name'}</div>
     <div style="${titleStyle}">${resume.title || 'Professional Title'}</div>
     <div style="${contactStyle}">${[resume.email, resume.phone, resume.location].filter(Boolean).join(' | ')}</div>
   </div>
   
   ${resume.summary ? `<div style="${sectionStyle}">
     <div style="${sectionTitleStyle}">Professional Summary</div>
     <p style="${summaryStyle}">${resume.summary}</p>
   </div>` : ''}
   
   ${resume.experience.length > 0 && resume.experience.some(e => e.company || e.title) ? `<div style="${sectionStyle}">
     <div style="${sectionTitleStyle}">Experience</div>
     ${resume.experience.filter(job => job.company || job.title).map(job => `
       <div style="${jobStyle}">
         <div style="${jobHeaderStyle}">
           <span style="${jobTitleStyle}">${job.title || 'Job Title'}</span>
           <span style="${jobPeriodStyle}">${job.period || ''}</span>
         </div>
         <div style="${jobCompanyStyle}">${job.company || 'Company'}</div>
         ${job.bullets.filter(b => b.trim()).length > 0 ? `<ul style="${bulletsStyle}">
           ${job.bullets.filter(b => b.trim()).map(b => `<li>${b}</li>`).join('')}
         </ul>` : ''}
       </div>
     `).join('')}
   </div>` : ''}
   
   ${resume.education.length > 0 && resume.education.some(e => e.school || e.degree) ? `<div style="${sectionStyle}">
     <div style="${sectionTitleStyle}">Education</div>
     ${resume.education.filter(edu => edu.school || edu.degree).map(edu => `
       <div style="${eduItemStyle}">
         <div style="${eduDegreeStyle}">${edu.degree || 'Degree'}</div>
         <div style="${eduSchoolStyle}">${edu.school || 'School'}${edu.year ? `, ${edu.year}` : ''}</div>
       </div>
     `).join('')}
   </div>` : ''}
   
   ${resume.skills.length > 0 ? `<div style="${sectionStyle}">
     <div style="${sectionTitleStyle}">Skills</div>
     <div style="${skillsStyle}">
       ${resume.skills.map(skill => `<span style="${skillStyle}">${skill}</span>`).join('')}
     </div>
   </div>` : ''}
</body>
</html>`
  }

  const addWordNamespaces = (html: string) => {
    const normalized = html.replace(/<!doctype[^>]*>/i, '').trim()
    if (typeof DOMParser === 'undefined') {
      return `<!DOCTYPE html>${normalized}`
    }
    const parser = new DOMParser()
    const doc = parser.parseFromString(normalized, 'text/html')
    const htmlEl = doc.documentElement
    if (!htmlEl.getAttribute('xmlns:o')) {
      htmlEl.setAttribute('xmlns:o', 'urn:schemas-microsoft-com:office:office')
    }
    if (!htmlEl.getAttribute('xmlns:w')) {
      htmlEl.setAttribute('xmlns:w', 'urn:schemas-microsoft-com:office:word')
    }
    return `<!DOCTYPE html>${htmlEl.outerHTML}`
  }

  const handleDownload = async (format: 'pdf' | 'docx') => {
    if (!currentResume || !selectedTemplate) return
    
    setIsDownloading(true)
    setDownloadFormat(format)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const htmlContent = generateResumeHTML(currentResume, selectedTemplate)
    
    if (format === 'pdf') {
      // Open in new window for print to PDF
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(htmlContent)
        printWindow.document.close()
        printWindow.onload = () => {
          printWindow.print()
        }
      }
    } else {
      const wordContent = addWordNamespaces(htmlContent)
      const blob = new Blob([wordContent], { type: 'application/msword' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${currentResume.name || 'resume'}-resume.doc`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
    
    setIsDownloading(false)
    setDownloadFormat(null)
  }

  const editorSteps = ['Personal Info', 'Experience', 'Education', 'Skills', 'Preview']

  return (
    <section id="templates" className="py-24 bg-card/30">
      <div className="container px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Template
          </h2>
          <p className="text-lg text-muted-foreground">
            Select a template, fill in your details, and download your resume in PDF or Word format.
            All your data is saved locally - no account needed.
          </p>
        </div>

        {/* Saved Resumes */}
        {savedResumes.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-foreground mb-4">Your Saved Resumes</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedResumes.map((resume) => (
                <div 
                  key={resume.id}
                  className="bg-card border border-border rounded-xl p-4 flex items-center justify-between group hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{resume.name || 'Untitled Resume'}</p>
                      <p className="text-xs text-muted-foreground">
                        Updated {new Date(resume.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => editResume(resume, templates[0])}
                      className="gap-1"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setShowDeleteConfirm(resume.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

                {/* Hover overlay — visible on hover (desktop) */}
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center gap-3">
                  <Button 
                    size="sm"
                    onClick={() => createNewResume(template)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create Resume
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
                <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                {/* Always-visible Create Resume button (important for mobile) */}
                <Button
                  size="sm"
                  onClick={() => createNewResume(template)}
                  className="w-full gap-2 md:hidden"
                >
                  <Plus className="h-4 w-4" />
                  Create Resume
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button — mobile only */}
      <div className="fixed bottom-6 right-6 z-40 md:hidden">
        <Button
          size="lg"
          onClick={() => createNewResume(templates.find(t => t.id === DEFAULT_TEMPLATE_ID) ?? templates[0])}
          className="rounded-full h-14 w-14 shadow-lg gap-0 p-0"
          title="Create Resume"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-foreground mb-2">Delete Resume?</h3>
            <p className="text-muted-foreground mb-6">
              This action cannot be undone. Your resume data will be permanently deleted.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => deleteResume(showDeleteConfirm)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {isEditorOpen && currentResume && selectedTemplate && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-auto">
          <div className="min-h-screen py-8 px-4">
            <div className="max-w-5xl mx-auto">
              {/* Editor Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsEditorOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {currentResume.name || 'New Resume'}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Template: {selectedTemplate.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    onClick={saveResume}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsPreviewOpen(true)}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                </div>
              </div>

              {/* Step Navigation */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {editorSteps.map((step, idx) => (
                  <button
                    key={step}
                    onClick={() => setEditorStep(idx)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      editorStep === idx 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-card text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {step}
                  </button>
                ))}
              </div>

              {/* Editor Content */}
              <div className="bg-card border border-border rounded-xl p-6">
                {/* Personal Info */}
                {editorStep === 0 && (
                  <div className="space-y-6 max-w-2xl mx-auto">
                    <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={currentResume.name}
                          onChange={(e) => updateResumeField('name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Professional Title</Label>
                        <Input
                          id="title"
                          placeholder="Software Engineer"
                          value={currentResume.title}
                          onChange={(e) => updateResumeField('title', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={currentResume.email}
                          onChange={(e) => updateResumeField('email', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          placeholder="+1 (555) 123-4567"
                          value={currentResume.phone}
                          onChange={(e) => updateResumeField('phone', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="San Francisco, CA"
                          value={currentResume.location}
                          onChange={(e) => updateResumeField('location', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="summary">Professional Summary</Label>
                        <Textarea
                          id="summary"
                          placeholder="Brief overview of your professional background and key strengths..."
                          rows={4}
                          value={currentResume.summary}
                          onChange={(e) => updateResumeField('summary', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Experience */}
                {editorStep === 1 && (
                  <div className="space-y-6 max-w-2xl mx-auto">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">Work Experience</h3>
                      <Button variant="outline" size="sm" onClick={addExperience} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Experience
                      </Button>
                    </div>
                    {currentResume.experience.map((exp, idx) => (
                      <div key={exp.id} className="border border-border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            Experience {idx + 1}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => removeExperience(exp.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Job Title</Label>
                            <Input
                              placeholder="Software Engineer"
                              value={exp.title}
                              onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Company</Label>
                            <Input
                              placeholder="Tech Corp Inc."
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2 sm:col-span-2">
                            <Label>Period</Label>
                            <Input
                              placeholder="Jan 2020 - Present"
                              value={exp.period}
                              onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2 sm:col-span-2">
                            <Label>Key Achievements (one per line)</Label>
                            <Textarea
                              placeholder="Led development of new features&#10;Improved performance by 50%"
                              rows={3}
                              value={exp.bullets.join('\n')}
                              onChange={(e) => updateExperience(exp.id, 'bullets', e.target.value.split('\n'))}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Education */}
                {editorStep === 2 && (
                  <div className="space-y-6 max-w-2xl mx-auto">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">Education</h3>
                      <Button variant="outline" size="sm" onClick={addEducation} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Education
                      </Button>
                    </div>
                    {currentResume.education.map((edu, idx) => (
                      <div key={edu.id} className="border border-border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            Education {idx + 1}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => removeEducation(edu.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Degree</Label>
                            <Input
                              placeholder="Bachelor of Science"
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>School</Label>
                            <Input
                              placeholder="University Name"
                              value={edu.school}
                              onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Year</Label>
                            <Input
                              placeholder="2020"
                              value={edu.year}
                              onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills */}
                {editorStep === 3 && (
                  <div className="space-y-6 max-w-2xl mx-auto">
                    <h3 className="text-lg font-semibold text-foreground">Skills</h3>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a skill..."
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      />
                      <Button onClick={addSkill}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentResume.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {skill}
                          <button
                            onClick={() => removeSkill(skill)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    {currentResume.skills.length === 0 && (
                      <p className="text-muted-foreground text-sm">
                        No skills added yet. Type a skill and press Enter or click Add.
                      </p>
                    )}
                  </div>
                )}

                {/* Preview & Download */}
                {editorStep === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">Preview & Download</h3>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleDownload('pdf')}
                          disabled={isDownloading}
                          className="gap-2"
                        >
                          {isDownloading && downloadFormat === 'pdf' ? (
                            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                          Download PDF
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleDownload('docx')}
                          disabled={isDownloading}
                          className="gap-2"
                        >
                          {isDownloading && downloadFormat === 'docx' ? (
                            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FileIcon className="h-4 w-4" />
                          )}
                          Download Word
                        </Button>
                      </div>
                    </div>
                    
                    {/* Resume Preview */}
                    <div className="bg-muted/50 rounded-lg p-6 overflow-auto">
                      <div 
                        className="max-w-2xl mx-auto rounded-lg shadow-xl p-8"
                        style={{ backgroundColor: selectedTemplate.colors.background }}
                      >
                        <div 
                          className="border-b-2 pb-4 mb-6"
                          style={{ borderColor: selectedTemplate.colors.accent }}
                        >
                          <h1 
                            className="text-2xl font-bold mb-1"
                            style={{ color: selectedTemplate.colors.primary }}
                          >
                            {currentResume.name || 'Your Name'}
                          </h1>
                          <p style={{ color: selectedTemplate.colors.accent }}>
                            {currentResume.title || 'Professional Title'}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {[currentResume.email, currentResume.phone, currentResume.location]
                              .filter(Boolean)
                              .join(' | ')}
                          </p>
                        </div>

                        {currentResume.summary && (
                          <div className="mb-6">
                            <h2 
                              className="text-sm font-semibold uppercase tracking-wider mb-2"
                              style={{ color: selectedTemplate.colors.accent }}
                            >
                              Summary
                            </h2>
                            <p className="text-sm text-gray-600">{currentResume.summary}</p>
                          </div>
                        )}

                        {currentResume.experience.some(e => e.company || e.title) && (
                          <div className="mb-6">
                            <h2 
                              className="text-sm font-semibold uppercase tracking-wider mb-3"
                              style={{ color: selectedTemplate.colors.accent }}
                            >
                              Experience
                            </h2>
                            {currentResume.experience.filter(e => e.company || e.title).map((exp) => (
                              <div key={exp.id} className="mb-4">
                                <div className="flex justify-between">
                                  <span className="font-semibold" style={{ color: selectedTemplate.colors.primary }}>
                                    {exp.title || 'Job Title'}
                                  </span>
                                  <span className="text-xs text-gray-500">{exp.period}</span>
                                </div>
                                <p className="text-sm" style={{ color: selectedTemplate.colors.accent }}>
                                  {exp.company || 'Company'}
                                </p>
                                {exp.bullets.filter(b => b.trim()).length > 0 && (
                                  <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                                    {exp.bullets.filter(b => b.trim()).map((b, i) => (
                                      <li key={i}>{b}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {currentResume.education.some(e => e.school || e.degree) && (
                          <div className="mb-6">
                            <h2 
                              className="text-sm font-semibold uppercase tracking-wider mb-3"
                              style={{ color: selectedTemplate.colors.accent }}
                            >
                              Education
                            </h2>
                            {currentResume.education.filter(e => e.school || e.degree).map((edu) => (
                              <div key={edu.id} className="mb-2">
                                <p className="font-semibold" style={{ color: selectedTemplate.colors.primary }}>
                                  {edu.degree || 'Degree'}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {edu.school || 'School'}{edu.year ? `, ${edu.year}` : ''}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {currentResume.skills.length > 0 && (
                          <div>
                            <h2 
                              className="text-sm font-semibold uppercase tracking-wider mb-3"
                              style={{ color: selectedTemplate.colors.accent }}
                            >
                              Skills
                            </h2>
                            <div className="flex flex-wrap gap-2">
                              {currentResume.skills.map((skill) => (
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
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step Navigation Buttons */}
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={() => setEditorStep(Math.max(0, editorStep - 1))}
                  disabled={editorStep === 0}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  onClick={() => setEditorStep(Math.min(editorSteps.length - 1, editorStep + 1))}
                  disabled={editorStep === editorSteps.length - 1}
                  className="gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Save Success Toast */}
          {showSaveSuccess && (
            <div className="fixed bottom-6 right-6 bg-primary text-primary-foreground px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-4">
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">Resume saved successfully!</span>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
