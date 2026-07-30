import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/search - Global search across materials, exams, departments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.trim() || ''
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query || query.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Search query must be at least 2 characters' },
        { status: 400 }
      )
    }

    // Execute parallel searches
    const [materials, exams, departments] = await Promise.all([
      // Search materials
      db.studyMaterial.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { subject: { contains: query } },
            { topic: { contains: query } },
            { author: { contains: query } },
          ]
        },
        take: limit,
        select: {
          id: true,
          title: true,
          type: true,
          subject: true,
          semester: true,
          thumbnailUrl: true,
          downloadsCount: true,
          rating: true,
          department: { select: { name: true, slug: true } },
          exam: { select: { name: true, slug: true } },
        },
        orderBy: { downloadsCount: 'desc' }
      }),

      // Search exams
      db.competitiveExam.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: query } },
            { fullName: { contains: query } },
            { description: { contains: query } },
          ]
        },
        take: 5,
        select: {
          id: true,
          name: true,
          fullName: true,
          slug: true,
          icon: true,
          color: true,
          difficulty: true,
          _count: { select: { studyMaterials: true, mockTests: true } }
        }
      }),

      // Search departments
      db.department.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
          ]
        },
        take: 5,
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
          color: true,
          description: true,
          _count: { select: { studyMaterials: true, users: true } }
        }
      }),
    ])

    // Search questions for quiz practice
    const questions = await db.question.findMany({
      where: {
        isActive: true,
        OR: [
          { questionText: { contains: query } },
          { subject: { contains: query } },
          { topic: { contains: query } },
        ]
      },
      take: Math.floor(limit / 2),
      select: {
        id: true,
        questionText: true,
        subject: true,
        difficulty: true,
        test: { select: { title: true } }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        query,
        results: {
          materials: {
            count: materials.length,
            items: materials,
          },
          exams: {
            count: exams.length,
            items: exams,
          },
          departments: {
            count: departments.length,
            items: departments,
          },
          questions: {
            count: questions.length,
            items: questions.map(q => ({
              ...q,
              questionText: q.questionText.substring(0, 150) + (q.questionText.length > 150 ? '...' : ''),
            })),
          },
        },
        totalResults: materials.length + exams.length + departments.length + questions.length,
      }
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    )
  }
}
