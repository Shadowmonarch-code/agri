import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/exams - List all competitive exams with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters = {
      popular: searchParams.get('popular') === 'true',
      difficulty: searchParams.get('difficulty'),
      search: searchParams.get('search') || '',
      limit: parseInt(searchParams.get('limit') || '50'),
    }

    // Build where clause
    const where: any = { isActive: true }
    
    if (filters.popular) {
      where.popular = true
    }
    
    if (filters.difficulty) {
      where.difficulty = filters.difficulty
    }
    
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { fullName: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    // Fetch exams with counts
    const exams = await db.competitiveExam.findMany({
      where,
      include: {
        _count: {
          select: {
            studyMaterials: true,
            mockTests: true,
          }
        }
      },
      orderBy: [
        { popular: 'desc' },
        { name: 'asc' }
      ],
      take: Math.min(filters.limit, 100),
    })

    return NextResponse.json({
      success: true,
      data: exams,
      count: exams.length,
    })
  } catch (error) {
    console.error('Get exams error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch exams' },
      { status: 500 }
    )
  }
}
