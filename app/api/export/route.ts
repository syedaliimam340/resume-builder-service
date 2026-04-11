import { NextRequest, NextResponse } from 'next/server'
import type { ResumeContent, ResumeCustomizations, ExportFormat, ApiResponse } from '@/lib/types'

interface ExportRequest {
  format: ExportFormat
  content: ResumeContent
  customizations: ResumeCustomizations
}

// POST /api/export - Generate resume in specified format
export async function POST(request: NextRequest) {
  try {
    const body: ExportRequest = await request.json()
    const { format, content, customizations } = body

    // Validate format
    const validFormats: ExportFormat[] = ['pdf', 'docx', 'txt', 'png', 'json']
    if (!validFormats.includes(format)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Invalid export format',
      }, { status: 400 })
    }

    // Validate content
    if (!content || !content.personalInfo) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Resume content is required',
      }, { status: 400 })
    }

    // Generate export based on format
    switch (format) {
      case 'json':
        return NextResponse.json({
          success: true,
          data: {
            content,
            customizations,
            exportedAt: new Date().toISOString(),
          },
        })

      case 'txt':
        const textContent = generatePlainText(content)
        return new NextResponse(textContent, {
          headers: {
            'Content-Type': 'text/plain',
            'Content-Disposition': `attachment; filename="resume.txt"`,
          },
        })

      case 'pdf':
      case 'docx':
      case 'png':
        // In production, these would use libraries like:
        // - PDF: @react-pdf/renderer, puppeteer, or jspdf
        // - DOCX: docx or officegen
        // - PNG: puppeteer or html2canvas
        return NextResponse.json<ApiResponse<{ downloadUrl: string }>>({
          success: true,
          data: {
            downloadUrl: `/api/export/download?format=${format}&id=${Date.now()}`,
          },
        })

      default:
        return NextResponse.json<ApiResponse<null>>({
          success: false,
          error: 'Format not yet supported',
        }, { status: 501 })
    }
  } catch {
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to generate export',
    }, { status: 500 })
  }
}

// Helper function to generate plain text resume
function generatePlainText(content: ResumeContent): string {
  const { personalInfo, summary, experience, education, skills, certifications, languages, projects } = content
  
  let text = ''

  // Header
  text += `${personalInfo.fullName || 'Your Name'}\n`
  text += `${personalInfo.title || ''}\n`
  text += `${[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(' | ')}\n`
  if (personalInfo.links.length > 0) {
    text += personalInfo.links.map(l => l.url).join(' | ') + '\n'
  }
  text += '\n'

  // Summary
  if (summary) {
    text += '=== PROFESSIONAL SUMMARY ===\n'
    text += summary + '\n\n'
  }

  // Experience
  if (experience.length > 0) {
    text += '=== PROFESSIONAL EXPERIENCE ===\n'
    experience.forEach(exp => {
      text += `${exp.title} at ${exp.company}\n`
      text += `${exp.startDate} - ${exp.endDate || 'Present'}${exp.location ? ` | ${exp.location}` : ''}\n`
      exp.bullets.filter(b => b.trim()).forEach(bullet => {
        text += `  - ${bullet}\n`
      })
      text += '\n'
    })
  }

  // Education
  if (education.length > 0) {
    text += '=== EDUCATION ===\n'
    education.forEach(edu => {
      text += `${edu.degree} in ${edu.field}\n`
      text += `${edu.institution} | ${edu.graduationDate}\n`
      if (edu.gpa) text += `GPA: ${edu.gpa}\n`
      text += '\n'
    })
  }

  // Skills
  if (skills.length > 0) {
    text += '=== SKILLS ===\n'
    skills.forEach(category => {
      text += `${category.category}: ${category.items.map(s => s.name).join(', ')}\n`
    })
    text += '\n'
  }

  // Certifications
  if (certifications.length > 0) {
    text += '=== CERTIFICATIONS ===\n'
    certifications.forEach(cert => {
      text += `${cert.name} - ${cert.issuer} (${cert.date})\n`
    })
    text += '\n'
  }

  // Languages
  if (languages.length > 0) {
    text += '=== LANGUAGES ===\n'
    text += languages.map(l => `${l.language} (${l.proficiency})`).join(', ') + '\n\n'
  }

  // Projects
  if (projects.length > 0) {
    text += '=== PROJECTS ===\n'
    projects.forEach(proj => {
      text += `${proj.name}\n`
      text += `${proj.description}\n`
      if (proj.technologies.length > 0) {
        text += `Technologies: ${proj.technologies.join(', ')}\n`
      }
      text += '\n'
    })
  }

  return text.trim()
}
