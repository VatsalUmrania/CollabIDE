import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

// Force Node.js runtime for Prisma compatibility
export const runtime = 'nodejs'

const createFileSchema = z.object({
  sessionId: z.string().cuid(),
  name: z.string().min(1, 'File name is required').max(255),
  language: z.string().min(1, 'Language is required'),
  content: z.string().optional().default(''),
})

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { sessionId, name, language, content } = createFileSchema.parse(body)

    console.log('📁 Creating file:', { sessionId, name, language, userId: user.id })

    // Verify user has access to session
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        participants: {
          where: { userId: user.id, isActive: true }
        }
      }
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Check if user is owner or active participant
    const hasAccess = session.ownerId === user.id || session.participants.length > 0

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied to this session' },
        { status: 403 }
      )
    }

    // Check if session is active
    if (!session.isActive) {
      return NextResponse.json(
        { error: 'Cannot add files to an inactive session' },
        { status: 400 }
      )
    }

    // Check for duplicate file names in this session
    const existingFile = await prisma.sessionFile.findFirst({
      where: {
        sessionId,
        name: name.trim()
      }
    })

    if (existingFile) {
      return NextResponse.json(
        { error: 'A file with this name already exists in this session' },
        { status: 409 }
      )
    }

    // Create the file
    const file = await prisma.sessionFile.create({
      data: {
        name: name.trim(),
        language,
        content: content || '',
        size: content?.length || 0,
        sessionId,
        createdBy: user.id
      },
      include: {
        creator: {
          select: { displayName: true }
        }
      }
    })

    // Update session last activity
    await prisma.session.update({
      where: { id: sessionId },
      data: { lastActivity: new Date() }
    })

    console.log(`✅ File created: ${file.name} in session ${sessionId} by ${user.displayName}`)

    return NextResponse.json({
      message: 'File created successfully',
      file: {
        id: file.id,
        name: file.name,
        language: file.language,
        content: file.content,
        createdAt: file.createdAt,
        updatedAt: file.updatedAt,
        createdBy: file.createdBy
      }
    }, { status: 201 })

  } catch (error) {
    console.error('❌ Create file error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: `Validation error: ${error.errors[0].message}` },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Verify access to session
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        participants: {
          where: { userId: user.id, isActive: true }
        }
      }
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    const hasAccess = session.ownerId === user.id || session.participants.length > 0

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    const files = await prisma.sessionFile.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      include: {
        creator: {
          select: { displayName: true }
        }
      }
    })

    return NextResponse.json({ files })

  } catch (error) {
    console.error('Get files error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
