import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// In-memory reset token store for demo
const resetTokenStore: Map<string, { userId: string; expiresAt: number }> = new Map()

function generateResetToken(): string {
  return `reset_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validation
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Find user (don't reveal if user exists or not for security)
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    })

    // Always return success to prevent email enumeration
    // In production, send actual email with reset link
    if (user) {
      const resetToken = generateResetToken()
      const expiresAt = Date.now() + 30 * 60 * 1000 // 30 minutes

      resetTokenStore.set(resetToken, { userId: user.id, expiresAt })

      console.log(`[DEV] Reset token for ${email}: ${resetToken}`)
      
      // Create notification about password reset
      await db.notification.create({
        data: {
          userId: user.id,
          title: 'Password Reset Requested',
          message: 'A password reset was requested for your account. If this was not you, please ignore this message.',
          type: 'INFO',
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a password reset link will be sent.',
      // Include reset token in development only
      ...(process.env.NODE_ENV !== 'production' && user && { 
        devResetToken: Array.from(resetTokenStore.entries())
          .find(([_, v]) => v.userId === user.id)?.[0] 
      })
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
