import { NextRequest, NextResponse } from 'next/server'
import type { ResumeContent, ResumeCustomizations, ApiResponse } from '@/lib/types'

// In-memory storage for demo (replace with database in production)
const resumes = new Map<string, {
  id: string
  title: string
  content: ResumeContent
  customizations: ResumeCustomizations
  templateId: string
  createdAt: Date
  updatedAt: Date
}>()

// GET /api/resumes - List all resumes
export async function GET() {
  const resumeList = Array.from(resumes.values()).map(r => ({
    id: r.id,
    title: r.title,
    templateId: r.templateId,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }))

  return NextResponse.json<ApiResponse<typeof resumeList>>({
    success: true,
    data: resumeList,
  })
}

// POST /api/resumes - Create a new resume
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, customizations, templateId } = body

    const id = crypto.randomUUID()
    const now = new Date()

    const newResume = {
      id,
      title: title || 'Untitled Resume',
      content,
      customizations,
      templateId: templateId || 'modern-professional',
      createdAt: now,
      updatedAt: now,
    }

    resumes.set(id, newResume)

    return NextResponse.json<ApiResponse<typeof newResume>>({
      success: true,
      data: newResume,
    }, { status: 201 })
  } catch {
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to create resume',
    }, { status: 400 })
  }
}
