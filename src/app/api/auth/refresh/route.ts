import { NextRequest, NextResponse } from 'next/server'
import { verifyRefreshToken, generateTokens } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { refreshToken } = body

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token required' },
        { status: 400 }
      )
    }

    console.log('🔄 Processing token refresh request')

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken)
    if (!payload) {
      console.log('❌ Invalid refresh token')
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      )
    }

    // Check if user still exists and is verified
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        displayName: true,
        isVerified: true
      }
    })

    if (!user || !user.isVerified) {
      console.log('❌ User not found or not verified')
      return NextResponse.json(
        { error: 'User not found or not verified' },
        { status: 401 }
      )
    }

    // Generate new tokens
    const newTokens = generateTokens({
      userId: user.id,
      email: user.email,
      displayName: user.displayName
    })

    console.log('✅ Tokens refreshed successfully for:', user.displayName)

    return NextResponse.json({
      message: 'Tokens refreshed successfully',
      ...newTokens
    })

  } catch (error) {
    console.error('❌ Token refresh error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
