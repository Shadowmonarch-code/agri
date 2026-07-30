import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Helper to extract and verify token
function getTokenFromHeader(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}

function verifyToken(token: string): { userId: string; exp: number } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64url').toString())
    if (payload.exp && payload.exp < Date.now()) {
      return null // Token expired
    }
    return payload
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromHeader(request)

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Fetch user with relations
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
        bio: true,
        departmentId: true,
        university: true,
        yearOfStudy: true,
        coins: true,
        xp: true,
        level: true,
        streak: true,
        isVerified: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        department: {
          select: { id: true, name: true, slug: true, icon: true }
        },
        _count: {
          select: {
            bookmarks: true,
            downloads: true,
            testAttempts: true,
            quizResults: true,
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: 'Account is deactivated' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
