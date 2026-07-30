import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Helper to extract user ID from token
function getUserIdFromToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }
  
  try {
    const token = authHeader.substring(7)
    const payload = JSON.parse(Buffer.from(token, 'base64url').toString())
    if (payload.exp && payload.exp < Date.now()) {
      return null
    }
    return payload.userId
  } catch {
    return null
  }
}

// POST /api/materials/[id]/download - Record download and return URL
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = getUserIdFromToken(request)

    // Check if material exists
    const material = await db.studyMaterial.findUnique({
      where: { id },
      include: {
        department: { select: { name: true } },
        exam: { select: { name: true } },
      }
    })

    if (!material) {
      return NextResponse.json(
        { success: false, error: 'Material not found' },
        { status: 404 }
      )
    }

    if (material.status !== 'PUBLISHED') {
      return NextResponse.json(
        { success: false, error: 'This material is not available for download' },
        { status: 403 }
      )
    }

    // Record download if user is authenticated
    if (userId) {
      await db.download.create({
        data: {
          userId,
          materialId: id,
        }
      })

      // Increment download count
      await db.studyMaterial.update({
        where: { id },
        data: { downloadsCount: { increment: 1 } }
      })

      // Award coins/XP for download (gamification)
      await db.user.update({
        where: { id: userId },
        data: {
          coins: { increment: 2 },
          xp: { increment: 5 },
        }
      })
    }

    // Determine download URL
    let downloadUrl = material.driveUrl || material.fileUrl
    
    // If it's a Google Drive link, convert to direct preview link
    if (downloadUrl?.includes('drive.google.com')) {
      const fileIdMatch = downloadUrl.match(/\/d\/([a-zA-Z0-9_-]+)/)
      if (fileIdMatch) {
        downloadUrl = `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        downloadUrl,
        fileName: `${material.title}.${material.type === 'VIDEO' ? 'mp4' : 'pdf'}`,
        fileType: material.type.toLowerCase(),
        fileSize: material.fileSize,
        material: {
          id: material.id,
          title: material.title,
          type: material.type,
        }
      },
      message: userId ? 'Download recorded successfully' : 'Download link generated'
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process download' },
      { status: 500 }
    )
  }
}
