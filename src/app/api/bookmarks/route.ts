import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { BookmarkType } from '@prisma/client'

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

// GET /api/bookmarks - Get user's bookmarks
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request)

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as BookmarkType | null
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = { userId }
    if (type) where.type = type

    const total = await db.bookmark.count({ where })

    const bookmarks = await db.bookmark.findMany({
      where,
      include: {
        material: {
          select: {
            id: true,
            title: true,
            description: true,
            type: true,
            subject: true,
            semester: true,
            thumbnailUrl: true,
            downloadsCount: true,
            rating: true,
            isPremium: true,
            department: { select: { name: true, slug: true } },
            exam: { select: { name: true, slug: true } },
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: Math.min(limit, 50),
    })

    return NextResponse.json({
      success: true,
      data: bookmarks.map(b => ({
        id: b.id,
        materialId: b.materialId,
        type: b.type,
        createdAt: b.createdAt,
        material: b.material,
      })),
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      }
    })
  } catch (error) {
    console.error('Get bookmarks error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookmarks' },
      { status: 500 }
    )
  }
}

// POST /api/bookmarks - Add bookmark
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
    const { materialId, type = BookmarkType.MATERIAL } = body

    if (!materialId) {
      return NextResponse.json(
        { success: false, error: 'Material ID is required' },
        { status: 400 }
      )
    }

    // Check if material exists
    const material = await db.studyMaterial.findUnique({
      where: { id: materialId }
    })

    if (!material) {
      return NextResponse.json(
        { success: false, error: 'Material not found' },
        { status: 404 }
      )
    }

    // Check if already bookmarked
    const existingBookmark = await db.bookmark.findUnique({
      where: {
        userId_materialId: { userId, materialId }
      }
    })

    if (existingBookmark) {
      return NextResponse.json(
        { success: false, error: 'Already bookmarked' },
        { status: 409 }
      )
    }

    // Create bookmark
    const bookmark = await db.bookmark.create({
      data: {
        userId,
        materialId,
        type,
      },
      include: {
        material: {
          select: { id: true, title: true, type: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: bookmark,
      message: 'Bookmarked successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Create bookmark error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create bookmark' },
      { status: 500 }
    )
  }
}

// DELETE /api/bookmarks/:id - Remove bookmark
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserIdFromToken(request)

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Verify ownership
    const bookmark = await db.bookmark.findFirst({
      where: { id, userId }
    })

    if (!bookmark) {
      return NextResponse.json(
        { success: false, error: 'Bookmark not found' },
        { status: 404 }
      )
    }

    await db.bookmark.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: 'Bookmark removed successfully'
    })
  } catch (error) {
    console.error('Delete bookmark error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete bookmark' },
      { status: 500 }
    )
  }
}
