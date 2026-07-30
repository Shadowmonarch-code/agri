import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { TestStatus } from '@prisma/client'

// GET /api/tests - List available tests with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters = {
      department: searchParams.get('department'),
      exam: searchParams.get('exam'),
      subject: searchParams.get('subject'),
      difficulty: searchParams.get('difficulty'),
      search: searchParams.get('search') || '',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '12'),
    }

    // Build where clause
    const where: any = { status: TestStatus.PUBLISHED }
    
    if (filters.department) where.departmentId = filters.department
    if (filters.exam) where.examId = filters.exam
    if (filters.subject) where.subject = { contains: filters.subject, mode: 'insensitive' }
    if (filters.difficulty) where.difficulty = filters.difficulty
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    const total = await db.mockTest.count({ where })

    const tests = await db.mockTest.findMany({
      where,
      include: {
        department: {
          select: { id: true, name: true, slug: true, icon: true }
        },
        exam: {
          select: { id: true, name: true, slug: true, icon: true }
        },
        _count: {
          select: { 
            testAttempts: true,
            questions: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (filters.page - 1) * filters.limit,
      take: Math.min(filters.limit, 50),
    })

    return NextResponse.json({
      success: true,
      data: tests,
      pagination: {
        total,
        page: filters.page,
        totalPages: Math.ceil(total / filters.limit),
      }
    })
  } catch (error) {
    console.error('Get tests error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tests' },
      { status: 500 }
    )
  }
}
