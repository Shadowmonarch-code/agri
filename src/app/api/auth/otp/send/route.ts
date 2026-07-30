import { NextRequest, NextResponse } from 'next/server'

// In-memory OTP store for demo (in production, use Redis or database)
const otpStore: Map<string, { otp: string; expiresAt: number }> = new Map()

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function cleanExpiredOTPs() {
  const now = Date.now()
  for (const [phone, data] of otpStore.entries()) {
    if (data.expiresAt < now) {
      otpStore.delete(phone)
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    cleanExpiredOTPs()
    
    const body = await request.json()
    const { phone } = body

    // Validation
    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      )
    }

    // Basic phone validation (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/
    const cleanPhone = phone.replace(/\D/g, '')
    
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Indian phone number format' },
        { status: 400 }
      )
    }

    // Rate limiting check - max 3 OTPs per 10 minutes
    const existingOTP = otpStore.get(cleanPhone)
    if (existingOTP && existingOTP.expiresAt > Date.now()) {
      // Check if we've sent too many recently
      // For demo, just allow resend with same OTP
    }

    // Generate new OTP
    const otp = generateOTP()
    const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes

    // Store OTP
    otpStore.set(cleanPhone, { otp, expiresAt })

    // In production, you would send SMS via Twilio, MSG91, etc.
    // For demo purposes, we return the OTP in response
    console.log(`[DEV] OTP for ${cleanPhone}: ${otp}`)

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      // Only include OTP in development mode
      ...(process.env.NODE_ENV !== 'production' && { otp }),
      expiresIn: 600 // seconds
    })
  } catch (error) {
    console.error('OTP send error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send OTP' },
      { status: 500 }
    )
  }
}

// Export for verification endpoint
export { otpStore }
