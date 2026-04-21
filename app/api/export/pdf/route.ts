import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

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
}

interface TemplateColors {
  primary: string
  accent: string
  background: string
}

interface PdfExportRequest {
  resume: ResumeData
  template: {
    id: string
    name: string
    category: string
    colors: TemplateColors
  }
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

function hexToRgb(hex: string): [number, number, number] {
  const cleaned = hex.replace('#', '').trim()
  const normalized =
    cleaned.length === 3
      ? cleaned
          .split('')
          .map((c) => c + c)
          .join('')
      : cleaned.padStart(6, '0').slice(0, 6)
  // Validate that the string is a valid 6-character hex value
  if (!/^[0-9a-f]{6}$/i.test(normalized)) {
    return [0, 0, 0]
  }
  const num = parseInt(normalized, 16)
  return [((num >> 16) & 0xff) / 255, ((num >> 8) & 0xff) / 255, (num & 0xff) / 255]
}

function wrapText(text: string, maxWidth: number, font: { widthOfTextAtSize: (t: string, s: number) => number }, fontSize: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
      current = candidate
    } else {
      if (current) lines.push(current)
      // If a single word is wider than maxWidth, truncate it with ellipsis
      if (!current && font.widthOfTextAtSize(word, fontSize) > maxWidth) {
        let truncated = word
        while (truncated.length > 1 && font.widthOfTextAtSize(truncated + '...', fontSize) > maxWidth) {
          truncated = truncated.slice(0, -1)
        }
        lines.push(truncated + '...')
        current = ''
      } else {
        current = word
      }
    }
  }
  if (current) lines.push(current)
  return lines
}

// POST /api/export/pdf - Generate PDF server-side
export async function POST(request: NextRequest) {
  try {
    const body: PdfExportRequest = await request.json()
    const { resume, template } = body

    if (!resume || !template) {
      return NextResponse.json(
        { success: false, error: 'Resume and template data are required' },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    const pdfDoc = await PDFDocument.create()
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)

    const isATS = template.category === 'ATS'
    const [pr, pg, pb] = hexToRgb(isATS ? '#1a1a1a' : template.colors.primary)
    const [ar, ag, ab] = hexToRgb(isATS ? '#2563eb' : template.colors.accent)
    const primaryColor = rgb(pr, pg, pb)
    const accentColor = rgb(ar, ag, ab)
    const grayColor = rgb(0.45, 0.45, 0.45)
    const lightGrayColor = rgb(0.78, 0.78, 0.78)

    const marginX = 50
    const marginTop = 760
    const pageWidth = 595   // A4 points
    const contentWidth = pageWidth - marginX * 2
    const lineHeight = 14
    const smallLineHeight = 12

    let page = pdfDoc.addPage([pageWidth, 842]) // A4
    let y = marginTop

    const checkPageBreak = (needed: number) => {
      if (y - needed < 40) {
        page = pdfDoc.addPage([pageWidth, 842])
        y = marginTop
      }
    }

    const drawText = (
      text: string,
      opts: {
        font?: typeof boldFont
        size?: number
        color?: ReturnType<typeof rgb>
        x?: number
        align?: 'left' | 'right'
      } = {}
    ) => {
      const { font = regularFont, size = 10, color = primaryColor, x = marginX, align = 'left' } = opts
      let drawX = x
      if (align === 'right') {
        drawX = pageWidth - marginX - font.widthOfTextAtSize(text, size)
      }
      page.drawText(text, { x: drawX, y, size, font, color })
    }

    // ── Name
    drawText(resume.name || 'Your Name', { font: boldFont, size: 22, color: primaryColor })
    y -= 16

    // ── Title
    if (resume.title) {
      drawText(resume.title, { font: regularFont, size: 13, color: accentColor })
      y -= 14
    }

    // ── Contact
    const contact = [resume.email, resume.phone, resume.location].filter(Boolean).join('  |  ')
    if (contact) {
      drawText(contact, { font: regularFont, size: 9, color: grayColor })
      y -= 10
    }

    // ── Divider
    page.drawLine({
      start: { x: marginX, y },
      end: { x: pageWidth - marginX, y },
      thickness: 0.5,
      color: accentColor,
    })
    y -= 16

    const drawSectionTitle = (title: string) => {
      checkPageBreak(20)
      drawText(title.toUpperCase(), { font: boldFont, size: 10, color: accentColor })
      y -= 4
      page.drawLine({
        start: { x: marginX, y },
        end: { x: pageWidth - marginX, y },
        thickness: 0.3,
        color: lightGrayColor,
      })
      y -= 10
    }

    // ── Summary
    if (resume.summary) {
      drawSectionTitle('Professional Summary')
      const lines = wrapText(resume.summary, contentWidth, regularFont, 10)
      lines.forEach((line) => {
        checkPageBreak(lineHeight)
        drawText(line, { size: 10, color: grayColor })
        y -= lineHeight
      })
      y -= 6
    }

    // ── Experience
    const hasExp = resume.experience.some((e) => e.company || e.title)
    if (hasExp) {
      drawSectionTitle('Work Experience')
      resume.experience
        .filter((job) => job.company || job.title)
        .forEach((job) => {
          checkPageBreak(20)
          drawText(job.title || 'Job Title', { font: boldFont, size: 11, color: primaryColor })
          if (job.period) {
            drawText(job.period, { font: regularFont, size: 9, color: grayColor, align: 'right' })
          }
          y -= 13

          if (job.company) {
            drawText(job.company, { font: italicFont, size: 10, color: accentColor })
            y -= 12
          }

          job.bullets
            .filter((b) => b.trim())
            .forEach((bullet) => {
              const wrapped = wrapText(bullet, contentWidth - 12, regularFont, 10)
              wrapped.forEach((line, i) => {
                checkPageBreak(smallLineHeight)
                if (i === 0) {
                  drawText('\u2022', { size: 10, color: grayColor, x: marginX })
                  drawText(line, { size: 10, color: grayColor, x: marginX + 10 })
                } else {
                  drawText(line, { size: 10, color: grayColor, x: marginX + 10 })
                }
                y -= smallLineHeight
              })
            })
          y -= 6
        })
      y -= 4
    }

    // ── Education
    const hasEdu = resume.education.some((e) => e.school || e.degree)
    if (hasEdu) {
      drawSectionTitle('Education')
      resume.education
        .filter((edu) => edu.school || edu.degree)
        .forEach((edu) => {
          checkPageBreak(20)
          drawText(edu.degree || 'Degree', { font: boldFont, size: 11, color: primaryColor })
          y -= 13
          drawText(
            `${edu.school || 'School'}${edu.year ? `  (${edu.year})` : ''}`,
            { size: 10, color: grayColor }
          )
          y -= 14
        })
      y -= 4
    }

    // ── Skills
    if (resume.skills.length > 0) {
      drawSectionTitle('Skills')
      const skillText = resume.skills.join('  \u2022  ')
      const lines = wrapText(skillText, contentWidth, regularFont, 10)
      lines.forEach((line) => {
        checkPageBreak(lineHeight)
        drawText(line, { size: 10, color: primaryColor })
        y -= lineHeight
      })
    }

    const pdfBytes = await pdfDoc.save()
    // Sanitize filename: keep only alphanumeric chars and hyphens, limit length
    const safeName = (resume.name || 'resume')
      .replace(/[^a-z0-9\s-]/gi, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase()
      .slice(0, 64) || 'resume'
    const filename = `${safeName}-resume.pdf`

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate PDF' },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}
