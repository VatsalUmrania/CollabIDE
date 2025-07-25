import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { hashPassword, generateOTP } from '@/lib/auth'
import { sendVerificationEmail } from '@/lib/email'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain uppercase, lowercase, number and special character'
  ),
  displayName: z.string().min(2).max(50),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, displayName } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password and generate OTP
    const hashedPassword = await hashPassword(password)
    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        displayName,
        verificationToken: `${otp}:${otpExpiry.getTime()}`,
      }
    })

    // Send verification email
    await sendVerificationEmail(email, otp)

    return NextResponse.json({
      message: 'Registration successful. Please check your email for verification code.',
      userId: user.id
    })

  } catch (error) {
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
