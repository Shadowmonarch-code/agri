import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { MaterialType, MaterialStatus } from '@prisma/client'

// Helper to parse query params
function getQueryParams(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  return {
    type: searchParams.get('type') as MaterialType | null,
    department: searchParams.get('department'),
    semester: searchParams.get('semester'),
    subject: searchParams.get('subject'),
    exam: searchParams.get('exam'),
    search: searchParams.get('search') || '',
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '12'),
    sort: searchParams.get('sort') || 'newest',
  }
}

// GET /api/materials - List materials with filters and pagination
export async function GET(request: NextRequest) {
  try {
    const params = getQueryParams(request)
    const { type, department, semester, subject, exam, search, page, limit, sort } = params

    // Build where clause
    const where: any = {
      status: MaterialStatus.PUBLISHED,
    }

    if (type) where.type = type
    if (department) where.departmentId = department
    if (semester) where.semester = parseInt(semester)
    if (subject) where.subject = { contains: subject, mode: 'insensitive' }
    if (exam) where.examId = exam
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { topic: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Build order by
    let orderBy: any = { createdAt: 'desc' }
    switch (sort) {
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'popular':
        orderBy = { downloadsCount: 'desc' }
        break
      case 'rating':
        orderBy = { rating: 'desc' }
        break
      case 'title':
        orderBy = { title: 'asc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    // Get total count
    const total = await db.studyMaterial.count({ where })

    // Get materials with pagination
    const materials = await db.studyMaterial.findMany({
      where,
      include: {
        department: {
          select: { id: true, name: true, slug: true, icon: true }
        },
        exam: {
          select: { id: true, name: true, slug: true, icon: true }
        },
        _count: {
          select: { bookmarks: true, downloads: true }
        }
      },
      orderBy,
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
        limit,
      }
    })
  } catch (error) {
    console.error('Get materials error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch materials' },
      { status: 500 }
    )
  }
}

// POST /api/materials - Create new material (Admin)
export async function POST(request: NextRequest) {
  try {
    // In production, verify admin token here
    const body = await request.json()
    const {
      title,
      description,
      type,
      departmentId,
      examId,
      semester,
      subject,
      unit,
      chapter,
      topic,
      fileUrl,
      driveUrl,
      thumbnailUrl,
      fileSize,
      pageCount,
      author,
      edition,
      publisher,
      language,
      isPremium,
      price,
    } = body

    // Validation
    if (!title || !type) {
      return NextResponse.json(
        { success: false, error: 'Title and type are required' },
        { status: 400 }
      )
    }

    if (!Object.values(MaterialType).includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid material type' },
        { status: 400 }
      )
    }

    // Create material
    const material = await db.studyMaterial.create({
      data: {
        title,
        description: description || null,
        type,
        departmentId: departmentId || null,
        examId: examId || null,
        semester: semester ? parseInt(semester) : null,
        subject: subject || null,
        unit: unit || null,
        chapter: chapter || null,
        topic: topic || null,
        fileUrl: fileUrl || null,
        driveUrl: driveUrl || null,
        thumbnailUrl: thumbnailUrl || null,
        fileSize: fileSize ? parseInt(fileSize) : null,
        pageCount: pageCount ? parseInt(pageCount) : null,
        author: author || null,
        edition: edition || null,
        publisher: publisher || null,
        language: language || 'English',
        isPremium: isPremium || false,
        price: price || 0,
        status: MaterialStatus.PUBLISHED,
        publishedAt: new Date(),
      },
      include: {
        department: { select: { id: true, name: true, slug: true } },
        exam: { select: { id: true, name: true, slug: true } },
      }
    })

    return NextResponse.json({
      success: true,
      data: material,
      message: 'Material created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Create material error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create material' },
      { status: 500 }
    )
  }
}
