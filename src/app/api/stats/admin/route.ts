import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Helper to get user ID from token and verify admin
async function getAdminUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  
  try {
    const payload = JSON.parse(Buffer.from(authHeader.substring(7), 'base64url').toString())
    if (payload.exp && payload.exp < Date.now()) return null
    
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, role: true, name: true }
    })
    
    if (!user || (user.role !== 'ADMIN' && user.role !== 'MODERATOR')) {
      return null
    }
    
    return user
  } catch {
    return null
  }
}

// GET /api/stats/admin - Admin analytics
export async function GET(request: NextRequest) {
  try {
    const adminUser = await getAdminUser(request)

    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Calculate date ranges
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    const yearStart = new Date(now.getFullYear(), 0, 1)

    // Fetch all analytics data in parallel
    const [
      // User stats
      totalUsers,
      activeUsers,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
      verifiedUsers,

      // Content stats
      totalMaterials,
      publishedMaterials,
      draftMaterials,
      totalTests,
      publishedTests,
      totalQuestions,

      // Engagement stats
      totalDownloads,
      downloadsToday,
      downloadsThisMonth,
      totalAttempts,
      attemptsThisWeek,
      totalQuizResults,

      // Department breakdown
      usersByDepartment,
      materialsByType,
      materialsByDepartment,

      // Growth data (simplified - would use time-series in production)
      monthlySignups,
      monthlyDownloads,

      // Recent activity
      recentUsers,
      recentDownloads,
      recentAttempts,

      // System health
      totalNotifications,
      unreadNotifications,
      totalBookmarks,
    ] = await Promise.all([
      // Users
      db.user.count(),
      db.user.count({ where: { lastLoginAt: { gte: monthAgo }, isActive: true } }),
      db.user.count({ where: { createdAt: { gte: today } } }),
      db.user.count({ where: { createdAt: { gte: weekAgo } } }),
      db.user.count({ where: { createdAt: { gte: monthAgo } } }),
      db.user.count({ where: { isVerified: true } }),

      // Materials
      db.studyMaterial.count(),
      db.studyMaterial.count({ where: { status: 'PUBLISHED' } }),
      db.studyMaterial.count({ where: { status: 'DRAFT' } }),
      db.mockTest.count(),
      db.mockTest.count({ where: { status: 'PUBLISHED' } }),
      db.question.count({ where: { isActive: true } }),

      // Engagement
      db.download.count(),
      db.download.count({ where: { downloadedAt: { gte: today } } }),
      db.download.count({ where: { downloadedAt: { gte: monthAgo } } }),
      db.testAttempt.count({ where: { status: 'COMPLETED' } }),
      db.testAttempt.count({ where: { completedAt: { gte: weekAgo }, status: 'COMPLETED' } }),
      db.quizResult.count(),

      // Breakdowns
      db.user.groupBy({
        by: ['departmentId'],
        _count: true,
        where: { departmentId: { not: null } },
      }),
      db.studyMaterial.groupBy({
        by: ['type'],
        _count: true,
      }),
      db.studyMaterial.groupBy({
        by: ['departmentId'],
        _count: true,
        where: { departmentId: { not: null } },
      }),

      // Monthly growth (simplified)
      db.user.groupBy({
        by: ['createdAt'],
        _count: true,
        where: { createdAt: { gte: yearStart } },
        // This would need proper date truncation in production
      }),
      db.download.groupBy({
        by: ['downloadedAt'],
        _count: true,
        where: { downloadedAt: { gte: yearStart } },
      }),

      // Recent activity
      db.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, name: true, email: true, createdAt: true, department: { select: { name: true } } },
      }),
      db.download.findMany({
        include: {
          user: { select: { name: true } },
          material: { select: { title: true } },
        },
        orderBy: { downloadedAt: 'desc' },
        take: 10,
      }),
      db.testAttempt.findMany({
        where: { status: 'COMPLETED' },
        include: {
          user: { select: { name: true } },
          test: { select: { title: true } },
        },
        orderBy: { completedAt: 'desc' },
        take: 10,
      }),

      // System
      db.notification.count(),
      db.notification.count({ where: { isRead: false } }),
      db.bookmark.count(),
    ])

    // Get department names for breakdowns
    const departments = await db.department.findMany({
      select: { id: true, name: true, slug: true },
    })
    const deptMap = new Map(departments.map(d => [d.id, d.name]))

    return NextResponse.json({
      success: true,
      data: {
        // Overview cards
        overview: {
          users: {
            total: totalUsers,
            active: activeUsers,
            newToday: newUsersToday,
            newThisWeek: newUsersThisWeek,
            newThisMonth: newUsersThisMonth,
            verified: verifiedUsers,
            verificationRate: totalUsers > 0 ? (verifiedUsers / totalUsers * 100).toFixed(1) : 0,
          },
          content: {
            totalMaterials,
            publishedMaterials,
            draftMaterials,
            totalTests,
            publishedTests,
            totalQuestions,
          },
          engagement: {
            totalDownloads,
            downloadsToday,
            downloadsThisMonth,
            totalAttempts,
            attemptsThisWeek,
            totalQuizResults,
            totalBookmarks,
          },
        },

        // Breakdowns
        breakdowns: {
          usersByDepartment: usersByDepartment.map(d => ({
            department: d.departmentId ? (deptMap.get(d.departmentId) || 'Unknown') : 'Unknown',
            count: d._count,
          })).sort((a, b) => b.count - a.count),
          materialsByType: materialsByType.map(m => ({
            type: m.type,
            count: m._count,
          })),
          materialsByDepartment: materialsByDepartment.map(m => ({
            department: m.departmentId ? (deptMap.get(m.departmentId) || 'Unknown') : 'Unknown',
            count: m._count,
          })).sort((a, b) => b.count - a.count),
        },

        // Recent activity
        recentActivity: {
          newUsers: recentUsers,
          downloads: recentDownloads.map(d => ({
            userName: d.user.name || 'Anonymous',
            materialTitle: d.material.title,
            downloadedAt: d.downloadedAt,
          })),
          testAttempts: recentAttempts.map(a => ({
            userName: a.user.name || 'Anonymous',
            testTitle: a.test.title,
            score: a.percentage,
            completedAt: a.completedAt,
          })),
        },

        // System health
        system: {
          totalNotifications,
          unreadNotifications,
          totalBookmarks,
        },

        // Metadata
        generatedAt: new Date().toISOString(),
        generatedBy: adminUser.name,
      }
    })
  } catch (error) {
    console.error('Get admin stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin statistics' },
      { status: 500 }
    )
  }
}
