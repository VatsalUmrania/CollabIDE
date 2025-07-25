import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { generateOTP } from '@/lib/auth'
import { sendVerificationEmail } from '@/lib/email'

const resendSchema = z.object({
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = resendSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.isVerified) {
      return NextResponse.json(
        { error: 'User is already verified' },
        { status: 400 }
      )
    }

    // Generate new OTP
    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    // Update user with new verification token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken: `${otp}:${otpExpiry.getTime()}`,
      }
    })

    // Send verification email
    await sendVerificationEmail(email, otp)

    return NextResponse.json({
      message: 'Verification code resent successfully'
    })

  } catch (error) {
    console.error('Resend verification error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
