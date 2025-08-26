import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

// Force Node.js runtime for Prisma compatibility
export const runtime = 'nodejs'

const saveFilesSchema = z.object({
  files: z.array(z.object({
    id: z.string().cuid(),
    content: z.string()
  }))
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request)
    const { id: sessionId } = await params
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { files } = saveFilesSchema.parse(body)

    console.log(`💾 Saving ${files.length} files for session ${sessionId}`)

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

    const hasAccess = session.ownerId === user.id || session.participants.length > 0

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Save all files in a transaction
    const results = await prisma.$transaction(async (tx) => {
      const updatePromises = files.map(file => 
        tx.sessionFile.update({
          where: { id: file.id },
          data: { 
            content: file.content,
            size: file.content.length,
            updatedAt: new Date()
          }
        })
      )

      await Promise.all(updatePromises)

      // Update session last activity
      return await tx.session.update({
        where: { id: sessionId },
        data: { lastActivity: new Date() }
      })
    })

    console.log(`✅ Successfully saved ${files.length} files for session ${sessionId}`)

    return NextResponse.json({
      message: `Successfully saved ${files.length} files`,
      savedAt: new Date()
    })

  } catch (error) {
    console.error('❌ Save files error:', error)
    
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
