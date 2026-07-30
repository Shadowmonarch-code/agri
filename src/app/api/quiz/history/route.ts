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

// GET /api/quiz/history - User's quiz history
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request)

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type') as 'DAILY' | 'TOPIC' | 'SUBJECT' | null

    // Build where clause
    const where: any = { userId }
    if (type) where.quizType = type

    const total = await db.quizResult.count({ where })

    const history = await db.quizResult.findMany({
      where,
      orderBy: { date: 'desc' },
      skip: (page - 1) * limit,
      take: Math.min(limit, 50),
    })

    // Calculate stats
    const stats = await db.quizResult.groupBy({
      by: ['quizType'],
      where: { userId },
      _sum: { correctAnswers: true, totalQuestions: true },
      _count: true,
    })

    const totalQuizzes = await db.quizResult.count({ where: { userId } })
    const bestScore = await db.quizResult.aggregate({
      where: { userId },
      _max: { score: true },
    })

    // Calculate average across all quizzes
    const avgResult = await db.quizResult.aggregate({
      where: { userId },
      _avg: { correctAnswers: true, totalQuestions: true },
    })

    const overallAverage = avgResult._avg.totalQuestions 
      ? ((avgResult._avg.correctAnswers || 0) / avgResult._avg.totalQuestions) * 100 
      : 0

    return NextResponse.json({
      success: true,
      data: {
        history: history.map(h => ({
          id: h.id,
          type: h.quizType,
          score: h.score,
          totalQuestions: h.totalQuestions,
          correctAnswers: h.correctAnswers,
          wrongAnswers: h.wrongAnswers,
          percentage: h.totalQuestions > 0 ? (h.correctAnswers / h.totalQuestions) * 100 : 0,
          timeTaken: h.timeTaken,
          date: h.date,
        })),
        pagination: {
          total,
          page,
          totalPages: Math.ceil(total / limit),
        },
        summary: {
          totalQuizzes,
          overallAverage: Math.round(overallAverage * 100) / 100,
          bestScore: bestScore._max.score || 0,
          byType: stats.map(s => ({
            type: s.quizType,
            count: s._count,
            average: s._sum.totalQuestions ? Math.round((s._sum.correctAnswers || 0) / s._sum.totalQuestions * 100 * 100) / 100 : 0,
            totalCorrect: s._sum.correctAnswers || 0,
            totalQuestions: s._sum.totalQuestions || 0,
          })),
        }
      }
    })
  } catch (error) {
    console.error('Get quiz history error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quiz history' },
      { status: 500 }
    )
  }
}
