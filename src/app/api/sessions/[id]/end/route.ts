import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { reason } = await request.json()

    // Verify the user is the session owner
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { 
        ownerId: true, 
        title: true, 
        isActive: true,
        participants: {
          where: { isActive: true },
          include: {
            user: { select: { displayName: true, email: true } }
          }
        }
      }
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    if (session.ownerId !== user.id) {
      return NextResponse.json(
        { error: 'Only the session owner can end the session' },
        { status: 403 }
      )
    }

    if (!session.isActive) {
      return NextResponse.json(
        { error: 'Session is already ended' },
        { status: 400 }
      )
    }

    // End the session
    await prisma.session.update({
      where: { id: sessionId },
      data: { 
        isActive: false,
        lastActivity: new Date()
      }
    })

    // Mark all participants as inactive
    await prisma.sessionParticipant.updateMany({
      where: { sessionId },
      data: { isActive: false }
    })

    console.log(`🛑 Session "${session.title}" ended by ${user.displayName}`)
    console.log(`📊 ${session.participants.length} participants will be notified`)

    return NextResponse.json({ 
      message: 'Session ended successfully',
      sessionId,
      participantsNotified: session.participants.length
    })

  } catch (error) {
    console.error('End session error:', error)
    return NextResponse.json(
      { error: 'Failed to end session' },
      { status: 500 }
    )
  }
}
