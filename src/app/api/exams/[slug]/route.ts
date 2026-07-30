import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/exams/[slug] - Get exam details with syllabus and preparation materials
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const exam = await db.competitiveExam.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            studyMaterials: true,
            mockTests: true,
            leaderboardEntries: true,
          }
        }
      }
    })

    if (!exam) {
      return NextResponse.json(
        { success: false, error: 'Exam not found' },
        { status: 404 }
      )
    }

    // Parse JSON fields
    let parsedSyllabus = null
    let parsedFeatures = null
    
    try {
      parsedSyllabus = exam.syllabus ? JSON.parse(exam.syllabus) : null
      parsedFeatures = exam.features ? JSON.parse(exam.features) : null
    } catch {
      // Keep as string if parsing fails
    }

    // Get recent materials for this exam
    const materials = await db.studyMaterial.findMany({
      where: {
        examId: exam.id,
        status: 'PUBLISHED',
      },
      take: 10,
      orderBy: { downloadsCount: 'desc' },
      select: {
        id: true,
        title: true,
        type: true,
        subject: true,
        semester: true,
        downloadsCount: true,
        rating: true,
        thumbnailUrl: true,
        isPremium: true,
      }
    })

    // Get mock tests for this exam
    const tests = await db.mockTest.findMany({
      where: {
        examId: exam.id,
        status: 'PUBLISHED',
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        totalQuestions: true,
        totalMarks: true,
        duration: true,
        difficulty: true,
        _count: { select: { testAttempts: true } }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        ...exam,
        syllabus: parsedSyllabus || exam.syllabus,
        features: parsedFeatures || exam.features,
        recentMaterials: materials,
        mockTests: tests,
      }
    })
  } catch (error) {
    console.error('Get exam details error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch exam details' },
      { status: 500 }
    )
  }
}

// GET /api/exams/[slug]/materials - Get study materials specific to this exam
// This is handled as a separate query parameter for simplicity
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()
    const { type, subject, semester, page = 1, limit = 12 } = body

    // Find exam first
    const exam = await db.competitiveExam.findUnique({ where: { slug } })
    if (!exam) {
      return NextResponse.json(
        { success: false, error: 'Exam not found' },
        { status: 404 }
      )
    }

    // Build where clause
    const where: any = {
      examId: exam.id,
      status: 'PUBLISHED',
    }

    if (type) where.type = type
    if (subject) where.subject = { contains: subject, mode: 'insensitive' }
    if (semester) where.semester = parseInt(semester)

    const total = await db.studyMaterial.count({ where })

    const materials = await db.studyMaterial.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        subject: true,
        semester: true,
        unit: true,
        chapter: true,
        topic: true,
        thumbnailUrl: true,
        downloadsCount: true,
        rating: true,
        isPremium: true,
        price: true,
        language: true,
        createdAt: true,
      },
      orderBy: { downloadsCount: 'desc' },
      skip: (page - 1) * limit,
      take: Math.min(limit, 50),
    })

    return NextResponse.json({
      success: true,
      data: materials,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      }
    })
  } catch (error) {
    console.error('Get exam materials error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch exam materials' },
      { status: 500 }
    )
  }
}
