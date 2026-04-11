import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import type { ApiResponse } from '@/lib/types'

// In-memory user storage for demo (replace with database in production)
const users = new Map<string, {
  id: string
  email: string
  passwordHash: string
  name: string
  tier: 'FREE' | 'PRO' | 'ENTERPRISE'
  createdAt: Date
}>()

const sessions = new Map<string, {
  userId: string
  expiresAt: Date
}>()

// Simple hash function for demo (use bcrypt in production)
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16)
}

// POST /api/auth - Handle auth actions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email, password, name } = body

    switch (action) {
      case 'register': {
        if (!email || !password) {
          return NextResponse.json<ApiResponse<null>>({
            success: false,
            error: 'Email and password are required',
          }, { status: 400 })
        }

        if (users.has(email)) {
          return NextResponse.json<ApiResponse<null>>({
            success: false,
            error: 'User already exists',
          }, { status: 400 })
        }

        const userId = crypto.randomUUID()
        const passwordHash = simpleHash(password)

        users.set(email, {
          id: userId,
          email,
          passwordHash,
          name: name || email.split('@')[0],
          tier: 'FREE',
          createdAt: new Date(),
        })

        // Create session
        const sessionId = crypto.randomUUID()
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

        sessions.set(sessionId, {
          userId,
          expiresAt,
        })

        // Set cookie
        const cookieStore = await cookies()
        cookieStore.set('session', sessionId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          expires: expiresAt,
        })

        return NextResponse.json<ApiResponse<{ user: { id: string; email: string; name: string } }>>({
          success: true,
          data: {
            user: {
              id: userId,
              email,
              name: name || email.split('@')[0],
            },
          },
        }, { status: 201 })
      }

      case 'login': {
        if (!email || !password) {
          return NextResponse.json<ApiResponse<null>>({
            success: false,
            error: 'Email and password are required',
          }, { status: 400 })
        }

        const user = users.get(email)
        if (!user || user.passwordHash !== simpleHash(password)) {
          return NextResponse.json<ApiResponse<null>>({
            success: false,
            error: 'Invalid credentials',
          }, { status: 401 })
        }

        // Create session
        const sessionId = crypto.randomUUID()
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

        sessions.set(sessionId, {
          userId: user.id,
          expiresAt,
        })

        // Set cookie
        const cookieStore = await cookies()
        cookieStore.set('session', sessionId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          expires: expiresAt,
        })

        return NextResponse.json<ApiResponse<{ user: { id: string; email: string; name: string } }>>({
          success: true,
          data: {
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
            },
          },
        })
      }

      case 'logout': {
        const cookieStore = await cookies()
        const sessionId = cookieStore.get('session')?.value

        if (sessionId) {
          sessions.delete(sessionId)
          cookieStore.delete('session')
        }

        return NextResponse.json<ApiResponse<{ loggedOut: boolean }>>({
          success: true,
          data: { loggedOut: true },
        })
      }

      default:
        return NextResponse.json<ApiResponse<null>>({
          success: false,
          error: 'Invalid action',
        }, { status: 400 })
    }
  } catch {
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Authentication failed',
    }, { status: 500 })
  }
}

// GET /api/auth - Get current user
export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session')?.value

    if (!sessionId) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Not authenticated',
      }, { status: 401 })
    }

    const session = sessions.get(sessionId)
    if (!session || session.expiresAt < new Date()) {
      sessions.delete(sessionId)
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Session expired',
      }, { status: 401 })
    }

    // Find user by session
    let currentUser = null
    for (const user of users.values()) {
      if (user.id === session.userId) {
        currentUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          tier: user.tier,
        }
        break
      }
    }

    if (!currentUser) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'User not found',
      }, { status: 404 })
    }

    return NextResponse.json<ApiResponse<typeof currentUser>>({
      success: true,
      data: currentUser,
    })
  } catch {
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to get user',
    }, { status: 500 })
  }
}
