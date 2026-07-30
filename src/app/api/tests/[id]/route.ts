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

// GET /api/tests/[id] - Get test details with questions
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const test = await db.mockTest.findUnique({
      where: { id },
      include: {
        department: {
          select: { id: true, name: true, slug: true, icon: true }
        },
        exam: {
          select: { id: true, name: true, slug: true, icon: true }
        },
        questions: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
          select: {
            id: true,
            questionText: true,
            optionA: true,
            optionB: true,
            optionC: true,
            optionD: true,
            hint: true,
            subject: true,
            chapter: true,
            topic: true,
            difficulty: true,
            marks: true,
            order: true,
            // Don't include correctOption and explanation in initial fetch
          }
        },
        _count: {
          select: { testAttempts: true }
        }
      }
    })

    if (!test) {
      return NextResponse.json(
        { success: false, error: 'Test not found' },
        { status: 404 }
      )
    }

    // Check if user has already attempted this test
    const userId = getUserIdFromToken(request)
    let userAttempt: any = null
    
    if (userId) {
      const attempt = await db.testAttempt.findFirst({
        where: {
          userId,
          testId: id,
          status: { in: ['IN_PROGRESS', 'COMPLETED'] }
        },
        orderBy: { startedAt: 'desc' },
        select: {
          id: true,
          status: true,
          startedAt: true,
          completedAt: true,
          obtainedScore: true,
          totalScore: true,
          percentage: true,
        }
      })
      
      if (attempt) {
        userAttempt = attempt
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...test,
        userAttempt,
      }
    })
  } catch (error) {
    console.error('Get test details error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch test details' },
      { status: 500 }
    )
  }
}
