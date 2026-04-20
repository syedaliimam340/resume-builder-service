import type { ResumeContent, ResumeCustomizations } from './types'

function formatDate(dateStr: string): string {
  if (!dateStr || dateStr === 'present') return 'Present'
  const [year, month] = dateStr.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function generateResumeHTML(resume: ResumeContent, customizations: ResumeCustomizations): string {
  const { personalInfo, summary, experience, education, skills, certifications, languages, projects } = resume
  const { primaryColor, accentColor, fontFamily, fontSize, spacing } = customizations

  const fontSizeMap = { small: '11px', medium: '12px', large: '13px' }
  const spacingMap = { compact: '12px', normal: '16px', relaxed: '20px' }
  const baseFontSize = fontSizeMap[fontSize]
  const sectionSpacing = spacingMap[spacing]

  const linkItems = personalInfo.links.map(link => {
    const label = link.url.replace(/^https?:\/\//, '').split('/')[0]
    return `<span style="margin-right:12px">${link.type.charAt(0).toUpperCase() + link.type.slice(1)}: ${label}</span>`
  }).join('')

  const contactLine = [
    personalInfo.email && `<span style="margin-right:12px">✉ ${personalInfo.email}</span>`,
    personalInfo.phone && `<span style="margin-right:12px">📞 ${personalInfo.phone}</span>`,
    personalInfo.location && `<span style="margin-right:12px">📍 ${personalInfo.location}</span>`,
  ].filter(Boolean).join('')

  const summarySection = summary ? `
    <div style="margin-bottom:${sectionSpacing}">
      <h2 style="font-size:${baseFontSize};font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${primaryColor};border-bottom:1.5px solid ${accentColor};padding-bottom:3px;margin-bottom:6px">Professional Summary</h2>
      <p style="font-size:${baseFontSize};color:#374151;line-height:1.6">${summary}</p>
    </div>` : ''

  const experienceSection = experience.length > 0 ? `
    <div style="margin-bottom:${sectionSpacing}">
      <h2 style="font-size:${baseFontSize};font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${primaryColor};border-bottom:1.5px solid ${accentColor};padding-bottom:3px;margin-bottom:8px">Professional Experience</h2>
      ${experience.map(exp => `
        <div style="margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <p style="font-weight:600;font-size:${baseFontSize};color:${primaryColor};margin:0">${exp.title}</p>
              <p style="font-size:${baseFontSize};color:#4B5563;margin:0">${exp.company}${exp.location ? ` | ${exp.location}` : ''}</p>
            </div>
            <p style="font-size:${baseFontSize};color:#6B7280;white-space:nowrap;margin:0">${formatDate(exp.startDate)} – ${formatDate(exp.endDate)}</p>
          </div>
          ${exp.bullets.filter(b => b.trim()).length > 0 ? `
          <ul style="margin:6px 0 0 16px;padding:0">
            ${exp.bullets.filter(b => b.trim()).map(b => `<li style="font-size:${baseFontSize};color:#374151;line-height:1.5;margin-bottom:2px">${b}</li>`).join('')}
          </ul>` : ''}
        </div>`).join('')}
    </div>` : ''

  const educationSection = education.length > 0 ? `
    <div style="margin-bottom:${sectionSpacing}">
      <h2 style="font-size:${baseFontSize};font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${primaryColor};border-bottom:1.5px solid ${accentColor};padding-bottom:3px;margin-bottom:8px">Education</h2>
      ${education.map(edu => `
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
          <div>
            <p style="font-weight:600;font-size:${baseFontSize};color:${primaryColor};margin:0">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</p>
            <p style="font-size:${baseFontSize};color:#4B5563;margin:0">${edu.institution}</p>
          </div>
          <p style="font-size:${baseFontSize};color:#6B7280;margin:0">${formatDate(edu.graduationDate)}</p>
        </div>`).join('')}
    </div>` : ''

  const skillsSection = skills.length > 0 ? `
    <div style="margin-bottom:${sectionSpacing}">
      <h2 style="font-size:${baseFontSize};font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${primaryColor};border-bottom:1.5px solid ${accentColor};padding-bottom:3px;margin-bottom:6px">Skills</h2>
      ${skills.map(cat => `
        <div style="margin-bottom:3px;font-size:${baseFontSize}">
          <span style="font-weight:600;color:#374151">${cat.category}: </span>
          <span style="color:#4B5563">${cat.items.map(s => s.name).join(', ')}</span>
        </div>`).join('')}
    </div>` : ''

  const certificationsSection = certifications.length > 0 ? `
    <div style="margin-bottom:${sectionSpacing}">
      <h2 style="font-size:${baseFontSize};font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${primaryColor};border-bottom:1.5px solid ${accentColor};padding-bottom:3px;margin-bottom:6px">Certifications</h2>
      ${certifications.map(cert => `
        <p style="font-size:${baseFontSize};color:#374151;margin:0 0 3px"><span style="font-weight:600">${cert.name}</span> – ${cert.issuer}, ${formatDate(cert.date)}</p>`).join('')}
    </div>` : ''

  const languagesSection = languages.length > 0 ? `
    <div style="margin-bottom:${sectionSpacing}">
      <h2 style="font-size:${baseFontSize};font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${primaryColor};border-bottom:1.5px solid ${accentColor};padding-bottom:3px;margin-bottom:6px">Languages</h2>
      <p style="font-size:${baseFontSize};color:#374151;margin:0">${languages.map(l => `${l.language} (${l.proficiency})`).join(' | ')}</p>
    </div>` : ''

  const projectsSection = projects.length > 0 ? `
    <div style="margin-bottom:${sectionSpacing}">
      <h2 style="font-size:${baseFontSize};font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${primaryColor};border-bottom:1.5px solid ${accentColor};padding-bottom:3px;margin-bottom:8px">Projects</h2>
      ${projects.map(proj => `
        <div style="margin-bottom:8px">
          <p style="font-weight:600;font-size:${baseFontSize};color:${primaryColor};margin:0">${proj.name}</p>
          <p style="font-size:${baseFontSize};color:#4B5563;margin:2px 0">${proj.description}</p>
          ${proj.technologies.length > 0 ? `<p style="font-size:${baseFontSize};color:#6B7280;margin:0"><span style="font-weight:600">Tech:</span> ${proj.technologies.join(', ')}</p>` : ''}
        </div>`).join('')}
    </div>` : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${personalInfo.fullName || 'Resume'}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: '${fontFamily}', Inter, Arial, sans-serif;
      font-size: ${baseFontSize};
      color: #111827;
      background: white;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      width: 8.5in;
      min-height: 11in;
      padding: 0.6in 0.7in;
      margin: 0 auto;
      background: white;
    }
    @media print {
      html, body { width: 8.5in; height: 11in; }
      .page { margin: 0; padding: 0.6in 0.7in; page-break-inside: avoid; }
      @page { size: letter; margin: 0; }
    }
  </style>
</head>
<body>
  <div class="page">
    <header style="text-align:center;padding-bottom:14px;border-bottom:2px solid ${accentColor};margin-bottom:${sectionSpacing}">
      <h1 style="font-size:22px;font-weight:700;color:${primaryColor};margin-bottom:4px">${personalInfo.fullName || 'Your Name'}</h1>
      ${personalInfo.title ? `<p style="font-size:14px;font-weight:500;color:${accentColor};margin-bottom:6px">${personalInfo.title}</p>` : ''}
      <div style="font-size:11px;color:#4B5563;margin-bottom:${personalInfo.links.length > 0 ? '4px' : '0'}">
        ${contactLine}
      </div>
      ${personalInfo.links.length > 0 ? `<div style="font-size:11px;color:${accentColor}">${linkItems}</div>` : ''}
    </header>
    ${summarySection}
    ${experienceSection}
    ${educationSection}
    ${skillsSection}
    ${certificationsSection}
    ${languagesSection}
    ${projectsSection}
  </div>
</body>
</html>`
}

export function exportToPDF(resume: ResumeContent, customizations: ResumeCustomizations): void {
  const html = generateResumeHTML(resume, customizations)
  const printWindow = window.open('', '_blank', 'width=900,height=700')
  if (!printWindow) return

  printWindow.document.write(html)
  printWindow.document.close()

  // Give fonts a moment to load before printing
  printWindow.addEventListener('load', () => {
    setTimeout(() => {
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    }, 300)
  })
}
