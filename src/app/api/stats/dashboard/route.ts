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

// GET /api/stats/dashboard - Authenticated user's dashboard stats
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request)

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Fetch user profile
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        department: { select: { name: true, slug: true, color: true } },
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Calculate date ranges
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Fetch all stats in parallel
    const [
      totalDownloads,
      totalBookmarks,
      totalAttempts,
      totalQuizzes,
      downloadsThisWeek,
      attemptsThisWeek,
      quizzesThisWeek,
      recentActivity,
      recentResults,
      upcomingTests,
      recommendedMaterials,
      unreadNotifications,
      achievements,
    ] = await Promise.all([
      db.download.count({ where: { userId } }),
      db.bookmark.count({ where: { userId } }),
      db.testAttempt.count({ where: { userId, status: 'COMPLETED' } }),
      db.quizResult.count({ where: { userId } }),
      db.download.count({ where: { userId, downloadedAt: { gte: weekAgo } } }),
      db.testAttempt.count({ where: { userId, completedAt: { gte: weekAgo }, status: 'COMPLETED' } }),
      db.quizResult.count({ where: { userId, date: { gte: weekAgo } } }),
      
      // Recent activity (last 10 items)
      Promise.all([
        db.download.findMany({
          where: { userId },
          include: { material: { select: { title: true, type: true } } },
          orderBy: { downloadedAt: 'desc' },
          take: 5,
        }),
        db.testAttempt.findMany({
          where: { userId, status: 'COMPLETED' },
          include: { test: { select: { title: true } } },
          orderBy: { completedAt: 'desc' },
          take: 5,
        }),
      ]),

      // Recent test results
      db.testAttempt.findMany({
        where: { userId, status: 'COMPLETED' },
        include: { test: { select: { title: true, subject: true, totalMarks: true } } },
        orderBy: { completedAt: 'desc' },
        take: 5,
      }),

      // Upcoming/recommended tests
      db.mockTest.findMany({
        where: {
          status: 'PUBLISHED',
          ...(user.departmentId && { departmentId: user.departmentId }),
        },
        select: {
          id: true,
          title: true,
          duration: true,
          totalQuestions: true,
          difficulty: true,
          _count: { select: { testAttempts: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),

      // Recommended materials based on department
      db.studyMaterial.findMany({
        where: {
          status: 'PUBLISHED',
          ...(user.departmentId && { departmentId: user.departmentId }),
        },
        select: {
          id: true,
          title: true,
          type: true,
          subject: true,
          downloadsCount: true,
          rating: true,
        },
        orderBy: { downloadsCount: 'desc' },
        take: 4,
      }),

      // Unread notifications count
      db.notification.count({ where: { userId, isRead: false } }),

      // User achievements
      db.userAchievement.findMany({
        where: { userId },
        include: {
          achievement: {
            select: { name: true, slug: true, description: true, icon: true, rarity: true, points: true }
          }
        },
        orderBy: { earnedAt: 'desc' },
        take: 6,
      }),
    ])

    // Calculate average scores
    const avgTestScore = await db.testAttempt.aggregate({
      where: { userId, status: 'COMPLETED', completedAt: { gte: monthAgo } },
      _avg: { percentage: true },
    })

    const avgQuizScore = await db.quizResult.aggregate({
      where: { userId, date: { gte: monthAgo } },
      _avg: { score: true },
    })

    // Format recent activity
    const [downloads, attempts] = recentActivity
    const activity = [
      ...downloads.map(d => ({
        type: 'download' as const,
        title: `Downloaded "${d.material.title}"`,
        timestamp: d.downloadedAt,
        materialType: d.material.type,
      })),
      ...attempts.map(a => ({
        type: 'test_attempt' as const,
        title: `Completed "${a.test.title}"`,
        timestamp: a.completedAt!,
        score: a.percentage,
      })),
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10)

    // Calculate level progress
    const xpForNextLevel = user.level * 1000
    const currentLevelXP = (user.level - 1) * 1000
    const progressInLevel = ((user.xp - currentLevelXP) / (xpForNextLevel - currentLevelXP)) * 100

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          level: user.level,
          xp: user.xp,
          coins: user.coins,
          streak: user.streak,
          department: user.department,
          levelProgress: Math.min(Math.max(progressInLevel, 0), 100),
        },
        stats: {
          learning: {
            totalDownloads,
            totalBookmarks,
            totalAttempts,
            totalQuizzes,
            downloadsThisWeek,
            attemptsThisWeek,
            quizzesThisWeek,
          },
          performance: {
            averageTestScore: Math.round(avgTestScore._avg.percentage || 0),
            averageQuizScore: Math.round(((avgQuizScore._avg.score || 0) / 10) * 100), // Assuming out of 10
          },
          engagement: {
            unreadNotifications,
          },
        },
        recentActivity: activity,
        recentResults: recentResults.map(r => ({
          id: r.id,
          testTitle: r.test.title,
          subject: r.test.subject,
          score: r.obtainedScore || 0,
          totalScore: r.test.totalMarks || 0,
          percentage: r.percentage || 0,
          completedAt: r.completedAt,
        })),
        recommendations: {
          tests: upcomingTests,
          materials: recommendedMaterials,
        },
        achievements: achievements.map(a => ({
          ...a.achievement,
          earnedAt: a.earnedAt,
          progress: a.progress,
        })),
        lastUpdated: new Date().toISOString(),
      }
    })
  } catch (error) {
    console.error('Get dashboard stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}
