import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

// Force Node.js runtime for Prisma compatibility
export const runtime = 'nodejs'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request)
    const { id } = await params
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const file = await prisma.sessionFile.findUnique({
      where: { id },
      include: {
        session: {
          select: { ownerId: true, id: true, title: true }
        }
      }
    })

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Only session owner can delete files
    if (file.session.ownerId !== user.id) {
      return NextResponse.json(
        { error: 'Only the session owner can delete files' },
        { status: 403 }
      )
    }

    // Check if this is the last file
    const fileCount = await prisma.sessionFile.count({
      where: { sessionId: file.session.id }
    })

    if (fileCount <= 1) {
      return NextResponse.json(
        { error: 'Cannot delete the last file in the session' },
        { status: 400 }
      )
    }

    await prisma.sessionFile.delete({
      where: { id }
    })

    // Update session activity
    await prisma.session.update({
      where: { id: file.session.id },
      data: { lastActivity: new Date() }
    })

    console.log(`🗑️ File deleted: ${file.name} from session ${file.session.title} by ${user.displayName}`)

    return NextResponse.json({
      message: 'File deleted successfully'
    })

  } catch (error) {
    console.error('❌ Delete file error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request)
    const { id } = await params
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { content } = body

    if (typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content must be a string' },
        { status: 400 }
      )
    }

    const file = await prisma.sessionFile.findUnique({
      where: { id },
      include: {
        session: {
          include: {
            participants: {
              where: { userId: user.id, isActive: true }
            }
          }
        }
      }
    })

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Check if user has access to modify this file
    const hasAccess = file.session.ownerId === user.id || file.session.participants.length > 0

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    const updatedFile = await prisma.sessionFile.update({
      where: { id },
      data: { 
        content,
        size: content.length,
        updatedAt: new Date()
      }
    })

    // Update session activity
    await prisma.session.update({
      where: { id: file.session.id },
      data: { lastActivity: new Date() }
    })

    return NextResponse.json({
      message: 'File updated successfully',
      file: updatedFile
    })

  } catch (error) {
    console.error('❌ Update file error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
