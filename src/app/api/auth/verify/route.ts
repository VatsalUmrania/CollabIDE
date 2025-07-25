import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { generateTokens } from '@/lib/auth'

const verifySchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, otp } = verifySchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !user.verificationToken) {
      return NextResponse.json(
        { error: 'Invalid verification request' },
        { status: 400 }
      )
    }

    const [storedOtp, expiryTime] = user.verificationToken.split(':')
    
    if (Date.now() > parseInt(expiryTime)) {
      return NextResponse.json(
        { error: 'Verification code expired' },
        { status: 400 }
      )
    }

    if (storedOtp !== otp) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    // Verify user and clear verification token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
      }
    })

    const tokens = generateTokens({
      userId: user.id,
      email: user.email
    })

    return NextResponse.json({
      message: 'Email verified successfully',
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
      },
      ...tokens
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
