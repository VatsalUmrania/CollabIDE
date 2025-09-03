import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    let currentUser = null

    // **METHOD 1: Try NextAuth session (for OAuth users)**
    try {
      const session = await getServerSession(authOptions)
      if (session?.user?.email) {
        currentUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { id: true, email: true, displayName: true, isVerified: true }
        })
        if (currentUser) {
          console.log('✅ NextAuth user authenticated:', currentUser.displayName)
        }
      }
    } catch (error) {
      console.log('⚠️ NextAuth session not found, trying custom auth...')
    }

    // **METHOD 2: Try custom JWT tokens (for custom login users)**
    if (!currentUser) {
      const authHeader = request.headers.get('authorization')
      const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

      if (token) {
        const payload = verifyToken(token)
        if (payload?.userId) {
          currentUser = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: { id: true, email: true, displayName: true, isVerified: true }
          })
          if (currentUser) {
            console.log('✅ Custom JWT user authenticated:', currentUser.displayName)
          }
        }
      }
    }

    // **METHOD 3: Try getting from request body (frontend passes user info)**
    if (!currentUser) {
      const { participantId, currentUserId, currentUserEmail } = await request.json()
      
      if (currentUserId && currentUserEmail) {
        currentUser = await prisma.user.findUnique({
          where: { 
            id: currentUserId,
            email: currentUserEmail 
          },
          select: { id: true, email: true, displayName: true, isVerified: true }
        })
        if (currentUser) {
          console.log('✅ Frontend-passed user authenticated:', currentUser.displayName)
        }
      }
    }

    // **No valid authentication found**
    if (!currentUser) {
      console.log('❌ No valid authentication method worked')
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    // **Continue with your existing logic...**
    const sessionId = params.id
    const { participantId } = await request.json()

    if (!sessionId || !participantId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get session data
    const sessionData = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        owner: true,
        participants: {
          include: {
            user: { select: { id: true, displayName: true, email: true } }
          }
        }
      }
    })

    if (!sessionData) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Verify user is session owner
    if (sessionData.owner.id !== currentUser.id) {
      return NextResponse.json(
        { error: 'Forbidden: Only the session host can remove participants' },
        { status: 403 }
      )
    }

    // Find and remove participant
    const participantToRemove = sessionData.participants.find(
      p => p.userId === participantId
    )

    if (!participantToRemove) {
      return NextResponse.json(
        { error: 'Participant not found in this session' },
        { status: 404 }
      )
    }

    await prisma.sessionParticipant.delete({
      where: { id: participantToRemove.id }
    })

    console.log(`✅ User ${currentUser.email} removed participant ${participantId} from session ${sessionId}`)

    return NextResponse.json({
      success: true,
      message: 'Participant removed successfully',
      removedParticipant: {
        id: participantToRemove.userId,
        name: participantToRemove.user.displayName,
        email: participantToRemove.user.email
      }
    })

  } catch (error: any) {
    console.error('❌ Error removing participant:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to remove participant' },
      { status: 500 }
    )
  }
}
