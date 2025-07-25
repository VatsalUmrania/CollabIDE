import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

const createSessionSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  type: z.enum(['PUBLIC', 'PRIVATE']),
  settings: z.object({}).optional(),
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
    const { title, description, type, settings } = createSessionSchema.parse(body)

    const session = await prisma.session.create({
      data: {
        title,
        description,
        type,
        settings: settings || {},
        ownerId: user.id,
        participants: {
          create: {
            userId: user.id,
            role: 'HOST'
          }
        }
      },
      include: {
        owner: {
          select: {
            id: true,
            displayName: true,
            email: true
          }
        },
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

    return NextResponse.json({
      message: 'Session created successfully',
      session
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
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessions = await prisma.session.findMany({
      where: {
        OR: [
          { ownerId: user.id },
          { 
            participants: {
              some: { userId: user.id }
            }
          }
        ]
      },
      include: {
        owner: {
          select: { id: true, displayName: true, email: true }
        },
        _count: {
          select: {
            participants: { where: { isActive: true } },
            files: true,
            messages: true
          }
        }
      },
      orderBy: [
        { isActive: 'desc' }, // Active sessions first
        { lastActivity: 'desc' } // Then by most recent activity
      ]
    })

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error('Sessions fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 })
  }
}
