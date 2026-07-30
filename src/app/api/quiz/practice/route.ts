import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/quiz/practice - Get practice MCQs with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters = {
      department: searchParams.get('department'),
      subject: searchParams.get('subject'),
      difficulty: searchParams.get('difficulty'),
      count: parseInt(searchParams.get('count') || '10'),
      topic: searchParams.get('topic'),
    }

    // Build where clause
    const where: any = { isActive: true }

    if (filters.department) {
      // Find tests in this department and get their questions
      const testsInDept = await db.mockTest.findMany({
        where: { departmentId: filters.department },
        select: { id: true }
      })
      where.testId = { in: testsInDept.map(t => t.id) }
    }

    if (filters.subject) {
      where.subject = { contains: filters.subject, mode: 'insensitive' }
    }

    if (filters.difficulty) {
      where.difficulty = filters.difficulty
    }

    if (filters.topic) {
      where.topic = { contains: filters.topic, mode: 'insensitive' }
    }

    // Get questions
    const allQuestions = await db.question.findMany({
      where,
      include: {
        test: {
          select: { 
            id: true, 
            title: true, 
            subject: true,
            department: { select: { name: true, slug: true } }
          }
        }
      },
      orderBy: { id: 'asc' },
      take: Math.min(filters.count * 3, 200), // Get extra for randomization
    })

    // Randomize and limit
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, filters.count)

    // Format questions (include answers for practice mode)
    const formattedQuestions = shuffled.map((q, index) => ({
      id: q.id,
      questionNumber: index + 1,
      questionText: q.questionText,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctOption: q.correctOption,
      explanation: q.explanation,
      hint: q.hint,
      subject: q.subject || q.test?.subject,
      chapter: q.chapter,
      topic: q.topic,
      difficulty: q.difficulty,
      marks: q.marks,
      department: q.test?.department?.name,
    }))

    // Get available subjects for filter options
    const subjects = await db.question.groupBy({
      by: ['subject'],
      where: { isActive: true, subject: { not: null } },
      _count: true,
      take: 20,
      orderBy: { subject: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: {
        questions: formattedQuestions,
        totalAvailable: allQuestions.length,
        returned: formattedQuestions.length,
        availableFilters: {
          subjects: subjects.filter(s => s.subject).map(s => ({
            value: s.subject,
            count: s._count,
          })),
          difficulties: ['Easy', 'Medium', 'Hard'],
        }
      }
    })
  } catch (error) {
    console.error('Get practice quiz error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch practice questions' },
      { status: 500 }
    )
  }
}
