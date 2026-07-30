import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { MaterialStatus } from '@prisma/client'

// GET /api/materials/[id] - Get single material details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const material = await db.studyMaterial.findUnique({
      where: { id },
      include: {
        department: {
          select: { id: true, name: true, slug: true, icon: true, description: true }
        },
        exam: {
          select: { id: true, name: true, slug: true, icon: true, description: true }
        },
        _count: {
          select: { bookmarks: true, downloads: true }
        }
      }
    })

    if (!material) {
      return NextResponse.json(
        { success: false, error: 'Material not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await db.studyMaterial.update({
      where: { id },
      data: { viewsCount: { increment: 1 } }
    })

    // Get related materials (same subject or department)
    const relatedMaterials = await db.studyMaterial.findMany({
      where: {
        AND: [
          { id: { not: id } },
          { status: MaterialStatus.PUBLISHED },
          {
            OR: [
              ...(material.subject ? [{ subject: material.subject }] : []),
              ...(material.departmentId ? [{ departmentId: material.departmentId }] : []),
            ]
          }
        ]
      },
      take: 6,
      select: {
        id: true,
        title: true,
        type: true,
        thumbnailUrl: true,
        downloadsCount: true,
        rating: true,
        subject: true,
        department: { select: { name: true, slug: true } },
      },
      orderBy: { downloadsCount: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: { ...material, relatedMaterials }
    })
  } catch (error) {
    console.error('Get material error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch material' },
      { status: 500 }
    )
  }
}

// PUT /api/materials/[id] - Update material (Admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Check if material exists
    const existingMaterial = await db.studyMaterial.findUnique({ where: { id } })
    if (!existingMaterial) {
      return NextResponse.json(
        { success: false, error: 'Material not found' },
        { status: 404 }
      )
    }

    // Update material
    const material = await db.studyMaterial.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.type && { type: body.type }),
        ...(body.departmentId !== undefined && { departmentId: body.departmentId }),
        ...(body.examId !== undefined && { examId: body.examId }),
        ...(body.semester !== undefined && { semester: body.semester ? parseInt(body.semester) : null }),
        ...(body.subject !== undefined && { subject: body.subject }),
        ...(body.unit !== undefined && { unit: body.unit }),
        ...(body.chapter !== undefined && { chapter: body.chapter }),
        ...(body.topic !== undefined && { topic: body.topic }),
        ...(body.fileUrl !== undefined && { fileUrl: body.fileUrl }),
        ...(body.driveUrl !== undefined && { driveUrl: body.driveUrl }),
        ...(body.thumbnailUrl !== undefined && { thumbnailUrl: body.thumbnailUrl }),
        ...(body.fileSize !== undefined && { fileSize: body.fileSize ? parseInt(body.fileSize) : null }),
        ...(body.pageCount !== undefined && { pageCount: body.pageCount ? parseInt(body.pageCount) : null }),
        ...(body.author !== undefined && { author: body.author }),
        ...(body.edition !== undefined && { edition: body.edition }),
        ...(body.publisher !== undefined && { publisher: body.publisher }),
        ...(body.language && { language: body.language }),
        ...(body.isPremium !== undefined && { isPremium: body.isPremium }),
        ...(body.price !== undefined && { price: parseFloat(body.price) }),
        ...(body.status && { status: body.status }),
      },
      include: {
        department: { select: { id: true, name: true, slug: true } },
        exam: { select: { id: true, name: true, slug: true } },
      }
    })

    return NextResponse.json({
      success: true,
      data: material,
      message: 'Material updated successfully'
    })
  } catch (error) {
    console.error('Update material error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update material' },
      { status: 500 }
    )
  }
}

// DELETE /api/materials/[id] - Soft delete material (Admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if material exists
    const existingMaterial = await db.studyMaterial.findUnique({ where: { id } })
    if (!existingMaterial) {
      return NextResponse.json(
        { success: false, error: 'Material not found' },
        { status: 404 }
      )
    }

    // Soft delete - set status to ARCHIVED
    await db.studyMaterial.update({
      where: { id },
      data: { status: MaterialStatus.ARCHIVED }
    })

    return NextResponse.json({
      success: true,
      message: 'Material deleted successfully'
    })
  } catch (error) {
    console.error('Delete material error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete material' },
      { status: 500 }
    )
  }
}
