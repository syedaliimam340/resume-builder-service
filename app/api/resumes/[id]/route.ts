import { NextRequest, NextResponse } from 'next/server'
import type { ApiResponse } from '@/lib/types'

// In-memory storage reference (shared with parent route in production via database)
const resumes = new Map<string, any>()

// GET /api/resumes/[id] - Get a specific resume
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const resume = resumes.get(id)

  if (!resume) {
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Resume not found',
    }, { status: 404 })
  }

  return NextResponse.json<ApiResponse<typeof resume>>({
    success: true,
    data: resume,
  })
}

// PATCH /api/resumes/[id] - Update a resume
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const resume = resumes.get(id)

    if (!resume) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Resume not found',
      }, { status: 404 })
    }

    const body = await request.json()
    const updatedResume = {
      ...resume,
      ...body,
      updatedAt: new Date(),
    }

    resumes.set(id, updatedResume)

    return NextResponse.json<ApiResponse<typeof updatedResume>>({
      success: true,
      data: updatedResume,
    })
  } catch {
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to update resume',
    }, { status: 400 })
  }
}

// DELETE /api/resumes/[id] - Delete a resume
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const existed = resumes.delete(id)

  if (!existed) {
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Resume not found',
    }, { status: 404 })
  }

  return NextResponse.json<ApiResponse<{ deleted: boolean }>>({
    success: true,
    data: { deleted: true },
  })
}
