// src/app/api/auth/oauth-token/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/db'
import { generateTokens } from '@/lib/auth'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, displayName: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Generate custom application tokens
    const customTokens = generateTokens({
      userId: user.id,
      email: user.email,
      displayName: user.displayName
    })

    console.log(`✅ Generated custom JWT for OAuth user: ${user.displayName}`)

    return NextResponse.json({
      ...customTokens,
      user
    })

  } catch (error) {
    console.error('❌ OAuth token exchange error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}