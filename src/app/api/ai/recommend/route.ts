import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

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

// POST /api/ai/recommend - Generate personalized recommendations
export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request)

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { userId: requestedUserId } = body
    const targetUserId = requestedUserId || userId

    // Get user profile data
    const user = await db.user.findUnique({
      where: { id: targetUserId },
      include: {
        department: { select: { name: true, slug: true } },
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

    // Get user's recent activity
    const recentDownloads = await db.download.findMany({
      where: { userId: targetUserId },
      include: {
        material: {
          select: { type: true, subject: true, departmentId: true, examId: true }
        }
      },
      orderBy: { downloadedAt: 'desc' },
      take: 10,
    })

    const recentAttempts = await db.testAttempt.findMany({
      where: { userId: targetUserId, status: 'COMPLETED' as const },
      include: {
        test: { select: { subject: true, departmentId: true, examId: true, difficulty: true } }
      },
      orderBy: { completedAt: 'desc' },
      take: 5,
    })

    // Extract interests from activity (filter out nulls with type guard)
    const subjects: string[] = [...new Set([
      ...recentDownloads.map(d => d.material.subject).filter((s): s is string => Boolean(s)),
      ...recentAttempts.map(a => a.test.subject).filter((s): s is string => Boolean(s)),
    ])]

    const weakAreas: string[] = recentAttempts
      .filter(a => a.percentage !== null && a.percentage < 60)
      .map(a => a.test.subject)
      .filter((s): s is string => Boolean(s))

    // Get recommended materials based on interests
    let recommendedMaterials: any[] = []
    
    if (subjects.length > 0) {
      // Build where clause dynamically to avoid type issues
      const whereClause: any = {
        status: 'PUBLISHED',
        OR: [
          { subject: { in: subjects.slice(0, 5) } },
        ],
      }
      
      if (user.departmentId) {
        whereClause.OR.push({ departmentId: user.departmentId })
      }

      recommendedMaterials = await db.studyMaterial.findMany({
        where: whereClause,
        include: {
          department: { select: { name: true, slug: true } },
          exam: { select: { name: true, slug: true } },
        },
        orderBy: { downloadsCount: 'desc' },
        take: 8,
      })
    }

    // Get recommended tests
    const testWhereClause: any = {
      status: 'PUBLISHED',
    }
    
    const testConditions: any[] = []
    
    if (user.departmentId) {
      testConditions.push({ departmentId: user.departmentId })
    }
    
    if (subjects.length > 0) {
      testConditions.push({ subject: { in: subjects.slice(0, 3) } })
    }
    
    if (testConditions.length > 0) {
      testWhereClause.OR = testConditions
    }

    const recommendedTests = await db.mockTest.findMany({
      where: testWhereClause,
      select: {
        id: true,
        title: true,
        subject: true,
        difficulty: true,
        totalQuestions: true,
        duration: true,
        _count: { select: { testAttempts: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    // Use AI to generate personalized insights
    let aiInsights: any = null
    
    try {
      const zai = await ZAI.create()
      
      const userProfile = `
User Profile:
- Department: ${user.department?.name || 'Not specified'}
- Level: ${user.level}
- XP: ${user.xp}
- Study Streak: ${user.streak} days
- Total Downloads: ${user._count.downloads}
- Test Attempts: ${user._count.testAttempts}
- Quiz Results: ${user._count.quizResults}

Recent Subjects Studied: ${subjects.join(', ') || 'None yet'}
Weak Areas (if any): ${weakAreas.join(', ') || 'None identified'}
`

      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are a learning analytics AI for AgriVerse Academy. Based on the user profile provided, generate:
1. A brief encouragement message (2-3 sentences)
2. 2-3 specific study recommendations based on their progress
3. Topics they should focus on next

Respond in JSON format: {"encouragement": "...", "recommendations": ["...", "..."], "focusTopics": ["...", "..."]}`
          },
          {
            role: 'user',
            content: `Generate personalized recommendations for this student:\n${userProfile}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      })

      const responseText = completion.choices[0]?.message?.content || '{}'
      aiInsights = JSON.parse(responseText)
    } catch (error) {
      console.error('AI recommendation error:', error)
      // Continue without AI insights
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          level: user.level,
          department: user.department?.name,
        },
        materials: recommendedMaterials,
        tests: recommendedTests,
        insights: aiInsights,
        generatedAt: new Date().toISOString(),
      }
    })
  } catch (error) {
    console.error('AI Recommend error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}
