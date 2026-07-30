import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/stats/public - Public stats for landing page
export async function GET() {
  try {
    // Cache this response for 5 minutes in production
    
    // Get all counts in parallel
    const [
      totalStudents,
      totalMaterials,
      totalTests,
      totalExams,
      totalDepartments,
      totalDownloads,
      popularMaterials,
      recentTests,
      activeExams,
    ] = await Promise.all([
      db.user.count({ where: { isActive: true, role: 'STUDENT' } }),
      db.studyMaterial.count({ where: { status: 'PUBLISHED' } }),
      db.mockTest.count({ where: { status: 'PUBLISHED' } }),
      db.competitiveExam.count({ where: { isActive: true } }),
      db.department.count({ where: { isActive: true } }),
      db.studyMaterial.aggregate({ _sum: { downloadsCount: true } }),
      
      // Top downloaded materials
      db.studyMaterial.findMany({
        where: { status: 'PUBLISHED' },
        select: {
          id: true,
          title: true,
          type: true,
          downloadsCount: true,
          subject: true,
          department: { select: { name: true } },
        },
        orderBy: { downloadsCount: 'desc' },
        take: 5,
      }),

      // Recent tests
      db.mockTest.findMany({
        where: { status: 'PUBLISHED' },
        select: {
          id: true,
          title: true,
          totalQuestions: true,
          duration: true,
          difficulty: true,
          _count: { select: { testAttempts: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),

      // Popular exams
      db.competitiveExam.findMany({
        where: { isActive: true, popular: true },
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
          color: true,
          _count: { select: { studyMaterials: true, mockTests: true } },
        },
        take: 6,
      }),
    ])

    // Calculate additional stats
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [newStudentsToday, downloadsThisMonth] = await Promise.all([
      db.user.count({
        where: {
          createdAt: { gte: today },
          role: 'STUDENT',
        }
      }),
      db.download.count({
        where: {
          downloadedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalStudents,
          totalMaterials,
          totalTests,
          totalExams,
          totalDepartments,
          totalDownloads: totalDownloads._sum.downloadsCount || 0,
          newStudentsToday,
          downloadsThisMonth,
        },
        popularMaterials,
        recentTests,
        popularExams: activeExams,
        lastUpdated: new Date().toISOString(),
      }
    })

    // Add cache headers for CDN/proxy caching
    // In production, you might want to use Next.js revalidate or ISR instead
  } catch (error) {
    console.error('Get public stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch public statistics' },
      { status: 500 }
    )
  }
}
