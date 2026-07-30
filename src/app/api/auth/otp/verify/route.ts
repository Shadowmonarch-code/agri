import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Import OTP store from send endpoint (shared module would be better in production)
const otpStore: Map<string, { otp: string; expiresAt: number }> = new Map()

// Simple JWT-like token generation
function generateToken(userId: string): string {
  const payload = { userId, iat: Date.now(), exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }
  return Buffer.from(JSON.stringify(payload)).toString('base64url')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, otp } = body

    // Validation
    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, error: 'Phone number and OTP are required' },
        { status: 400 }
      )
    }

    const cleanPhone: string = phone.replace(/\D/g, '')

    // Get stored OTP (in production, fetch from DB/Redis)
    const storedData = otpStore.get(cleanPhone)

    if (!storedData) {
      return NextResponse.json(
        { success: false, error: 'No OTP found. Please request a new one.' },
        { status: 400 }
      )
    }

    // Check expiry
    if (storedData.expiresAt < Date.now()) {
      otpStore.delete(cleanPhone)
      return NextResponse.json(
        { success: false, error: 'OTP has expired. Please request a new one.' },
        { status: 410 }
      )
    }

    // Verify OTP
    if (storedData.otp !== otp.toString()) {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP' },
        { status: 401 }
      )
    }

    // Clear used OTP
    otpStore.delete(cleanPhone)

    // Find or create user by phone (phone is not unique, so use findFirst)
    const existingUser = await db.user.findFirst({
      where: { phone: cleanPhone },
      include: {
        department: {
          select: { id: true, name: true, slug: true }
        }
      }
    })

    let user: any

    if (!existingUser) {
      // Create new user with phone
      user = await db.user.create({
        data: {
          email: `${cleanPhone}@agriverse.local`, // Generate dummy email for phone-only users
          phone: cleanPhone,
          name: `User_${cleanPhone.slice(-4)}`,
          isVerified: true,
          emailVerified: true,
        },
        include: {
          department: {
            select: { id: true, name: true, slug: true }
          }
        }
      })
    } else {
      // Update verification status
      user = await db.user.update({
        where: { id: existingUser.id },
        data: { isVerified: true, emailVerified: true },
        include: {
          department: {
            select: { id: true, name: true, slug: true }
          }
        }
      })
    }

    // Generate token
    const token = generateToken(user.id)

    // Update last login
    await db.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    })

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token,
      message: 'Phone verified successfully'
    })
  } catch (error) {
    console.error('OTP verify error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify OTP' },
      { status: 500 }
    )
  }
}
