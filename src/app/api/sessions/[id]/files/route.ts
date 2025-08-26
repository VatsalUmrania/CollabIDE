import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionId = params.id
    const { fileId, name, language, content, size } = await req.json()

    // Check if user has access to the session
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        participants: true
      }
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const hasAccess = session.ownerId === user.id ||
      session.participants.some(p => p.userId === user.id) ||
      session.type === 'PUBLIC'

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Upsert the file
    const savedFile = await prisma.sessionFile.upsert({
      where: {
        sessionId_name: {
          sessionId,
          name
        }
      },
      update: {
        content,
        language,
        size: size || content.length,
        updatedAt: new Date()
      },
      create: {
        id: fileId,
        name,
        language,
        content,
        size: size || content.length,
        sessionId,
        createdBy: user.id
      }
    })

    // Update session activity
    await prisma.session.update({
      where: { id: sessionId },
      data: { lastActivity: new Date() }
    })

    return NextResponse.json({ file: savedFile })

  } catch (error) {
    console.error('File save error:', error)
    return NextResponse.json({ error: 'Failed to save file' }, { status: 500 })
  }
}
