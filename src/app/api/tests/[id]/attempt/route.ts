import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Helper to get user ID from token
function getUserIdFromToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  
  try {
    const payload = JSON.parse(Buffer.from(authHeader.substring(7), 'base64url').toString())
    if (payload.exp && payload.exp < Date.now()) return null
    return payload.userId
  } catch {
    return null
  }
}

// POST /api/tests/[id]/attempt - Start a new attempt
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = getUserIdFromToken(request)

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if test exists and is published
    const test = await db.mockTest.findUnique({ where: { id } })
    
    if (!test) {
      return NextResponse.json(
        { success: false, error: 'Test not found' },
        { status: 404 }
      )
    }

    if (test.status !== 'PUBLISHED') {
      return NextResponse.json(
        { success: false, error: 'This test is not available' },
        { status: 403 }
      )
    }

    // Check for existing in-progress attempt
    const existingAttempt = await db.testAttempt.findFirst({
      where: {
        userId,
        testId: id,
        status: 'IN_PROGRESS',
      }
    })

    if (existingAttempt) {
      // Return existing attempt
      return NextResponse.json({
        success: true,
        data: {
          attemptId: existingAttempt.id,
          message: 'Resumed existing attempt',
          startedAt: existingAttempt.startedAt,
        }
      })
    }

    // Create new attempt
    const attempt = await db.testAttempt.create({
      data: {
        userId,
        testId: id,
        status: 'IN_PROGRESS',
        totalScore: test.totalMarks,
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        attemptId: attempt.id,
        message: 'Test attempt started successfully',
        startedAt: attempt.startedAt,
        duration: test.duration,
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Start test attempt error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to start test attempt' },
      { status: 500 }
    )
  }
}
