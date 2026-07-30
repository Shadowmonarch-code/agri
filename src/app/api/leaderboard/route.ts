import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { LeaderboardPeriod } from '@prisma/client'

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

// GET /api/leaderboard - Get top entries
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters = {
      period: (searchParams.get('period') || 'ALL_TIME') as LeaderboardPeriod,
      department: searchParams.get('department'),
      exam: searchParams.get('exam'),
      limit: parseInt(searchParams.get('limit') || '100'),
    }

    // Build where clause
    const where: any = { period: filters.period }
    
    if (filters.department) {
      // Find users in this department
      const usersInDept = await db.user.findMany({
        where: { departmentId: filters.department },
        select: { id: true }
      })
      where.userId = { in: usersInDept.map(u => u.id) }
    }
    
    if (filters.exam) {
      where.examId = filters.exam
    }

    // Get leaderboard entries
    const entries = await db.leaderboardEntry.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            level: true,
            department: {
              select: { name: true, slug: true, color: true }
            },
          }
        },
        exam: {
          select: { id: true, name: true, slug: true, icon: true }
        }
      },
      orderBy: { rank: 'asc' },
      take: Math.min(filters.limit, 100),
    })

    // Format response
    const leaderboard = entries.map((entry, index) => ({
      rank: entry.rank,
      previousRank: entry.previousRank,
      change: entry.change,
      userId: entry.user.id,
      userName: entry.user.name || 'Anonymous',
      avatar: entry.user.avatar,
      level: entry.user.level,
      department: entry.user.department?.name,
      score: entry.score,
      exam: entry.exam ? { id: entry.exam.id, name: entry.exam.name, slug: entry.exam.slug } : null,
    }))

    // Get current user's rank if authenticated
    let currentUserEntry: any = null
    const userId = getUserIdFromToken(request)

    if (userId) {
      const entry = await db.leaderboardEntry.findFirst({
        where: {
          userId,
          period: filters.period,
          ...(filters.exam && { examId: filters.exam }),
        },
        include: {
          user: { select: { name: true, avatar: true, level: true } }
        }
      })

      if (entry) {
        currentUserEntry = {
          rank: entry.rank,
          score: entry.score,
          userName: entry.user.name || 'Anonymous',
          avatar: entry.user.avatar,
          level: entry.user.level,
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        period: filters.period,
        leaderboard,
        totalEntries: leaderboard.length,
        currentUserRank: currentUserEntry,
      }
    })
  } catch (error) {
    console.error('Get leaderboard error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}

// GET /api/leaderboard/rank/:userId - Get user's current rank
// This is handled via query param for simplicity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, period = 'ALL_TIME', examId } = body

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    const where: any = { userId, period }
    if (examId) where.examId = examId

    const entry = await db.leaderboardEntry.findFirst({
      where,
      include: {
        exam: { select: { id: true, name: true, slug: true } }
      }
    })

    if (!entry) {
      return NextResponse.json({
        success: true,
        data: { ranked: false, message: 'User not found on this leaderboard' }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        ranked: true,
        rank: entry.rank,
        previousRank: entry.previousRank,
        change: entry.change,
        score: entry.score,
        period: entry.period,
        exam: entry.exam,
      }
    })
  } catch (error) {
    console.error('Get user rank error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get user rank' },
      { status: 500 }
    )
  }
}
