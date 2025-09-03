import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get sessionId from URL params and participantId from request body
    const sessionId = params.id
    const body = await request.json()
    const { participantId } = body

    // Validate required fields
    if (!sessionId || !participantId) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId and participantId' },
        { status: 400 }
      )
    }

    // Get session data with owner and participants
    const sessionData = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        owner: true,
        participants: {
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
                email: true
              }
            }
          }
        }
      }
    })

    if (!sessionData) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Verify that current user is the session owner
    if (sessionData.owner.id !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden: Only the session host can remove participants' },
        { status: 403 }
      )
    }

    // Prevent owner from removing themselves
    if (participantId === session.user.id) {
      return NextResponse.json(
        { error: 'Session host cannot remove themselves' },
        { status: 400 }
      )
    }

    // Check if participant exists in the session
    const participantToRemove = sessionData.participants.find(
      p => p.userId === participantId
    )

    if (!participantToRemove) {
      return NextResponse.json(
        { error: 'Participant not found in this session' },
        { status: 404 }
      )
    }

    // Remove participant from session
    await prisma.sessionParticipant.delete({
      where: {
        id: participantToRemove.id
      }
    })

    // Log the action
    console.log(`User ${session.user.email} removed participant ${participantId} from session ${sessionId}`)

    return NextResponse.json({
      success: true,
      message: 'Participant removed successfully',
      removedParticipant: {
        id: participantToRemove.userId,
        name: participantToRemove.user.displayName || participantToRemove.user.email,
        email: participantToRemove.user.email
      }
    })

  } catch (error: any) {
    console.error('Error removing participant:', error)

    // Handle specific Prisma errors
    if (error.code === 'P2025') {
      return NextResponse.json(
        { 
          error: 'Participant not found',
          message: 'The participant you are trying to remove does not exist'
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: 'Failed to remove participant'
      },
      { status: 500 }
    )
  }
}
