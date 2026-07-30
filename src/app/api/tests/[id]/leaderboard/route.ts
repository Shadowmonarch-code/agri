import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/tests/[id]/leaderboard - Get top performers for this test
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    
    const limit = parseInt(searchParams.get('limit') || '50')

    // Verify test exists
    const test = await db.mockTest.findUnique({ 
      where: { id },
      select: { id: true, title: true }
    })

    if (!test) {
      return NextResponse.json(
        { success: false, error: 'Test not found' },
        { status: 404 }
      )
    }

    // Get top performers
    const leaderboard = await db.testAttempt.findMany({
      where: {
        testId: id,
        status: 'COMPLETED',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            level: true,
            department: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: [
        { percentage: 'desc' },
        { timeTaken: 'asc' },
        { completedAt: 'asc' }
      ],
      take: Math.min(limit, 100),
    })

    // Add rank to each entry
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      rank: index + 1,
      userId: entry.user.id,
      userName: entry.user.name || 'Anonymous',
      avatar: entry.user.avatar,
      level: entry.user.level,
      department: entry.user.department?.name,
      score: entry.obtainedScore || 0,
      totalScore: entry.totalScore || 0,
      percentage: entry.percentage || 0,
      timeTaken: entry.timeTaken || 0,
      completedAt: entry.completedAt,
    }))

    // Get current user's rank if authenticated
    const authHeader = request.headers.get('authorization')
    let currentUserRank: number | null = null

    if (authHeader?.startsWith('Bearer ')) {
      try {
        const payload = JSON.parse(Buffer.from(authHeader.substring(7), 'base64url').toString())
        if (!(payload.exp && payload.exp < Date.now())) {
          const userAttempts = await db.testAttempt.count({
            where: {
              testId: id,
              status: 'COMPLETED',
              userId: { not: payload.userId },
              OR: [
                { percentage: { gt: 0 } }, // Will be refined below
              ]
            }
          })

          const userBestAttempt = await db.testAttempt.findFirst({
            where: {
              testId: id,
              userId: payload.userId,
              status: 'COMPLETED',
            },
            orderBy: { percentage: 'desc' },
            select: { percentage: true, obtainedScore: true, timeTaken: true }
          })

          if (userBestAttempt) {
            const betterScores = await db.testAttempt.count({
              where: {
                testId: id,
                status: 'COMPLETED',
                userId: { not: payload.userId },
                percentage: { gt: userBestAttempt.percentage! }
              }
            })
            
            currentUserRank = betterScores + 1
          }
        }
      } catch {
        // Ignore token parsing errors
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        test: { id: test.id, title: test.title },
        leaderboard: rankedLeaderboard,
        totalEntries: rankedLeaderboard.length,
        currentUserRank,
      }
    })
  } catch (error) {
    console.error('Get test leaderboard error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}
