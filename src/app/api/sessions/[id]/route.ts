// import { NextRequest, NextResponse } from 'next/server'
// import { z } from 'zod'
// import { prisma } from '@/lib/db'
// import { getUserFromRequest } from '@/lib/auth'

// // Force Node.js runtime for Prisma compatibility
// export const runtime = 'nodejs'

// const updateSessionSchema = z.object({
//   content: z.object({}).optional(),
//   settings: z.object({}).optional(),
// })

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const user = await getUserFromRequest(req)
//     if (!user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     const sessionId = params.id
//     const { searchParams } = new URL(req.url)
//     const includeFiles = searchParams.get('includeFiles') === 'true'

//     const session = await prisma.session.findUnique({
//       where: { id: sessionId },
//       include: {
//         owner: {
//           select: { id: true, displayName: true, email: true }
//         },
//         participants: {
//           include: {
//             user: {
//               select: { id: true, displayName: true, email: true }
//             }
//           }
//         },
//         messages: {
//           include: {
//             user: {
//               select: { id: true, displayName: true }
//             }
//           },
//           orderBy: { createdAt: 'asc' }
//         },
//         files: includeFiles ? {
//           orderBy: { createdAt: 'asc' }
//         } : false,
//         _count: {
//           select: {
//             participants: true,
//             files: true,
//             messages: true
//           }
//         }
//       }
//     })

//     if (!session) {
//       return NextResponse.json({ error: 'Session not found' }, { status: 404 })
//     }

//     // Check access permissions
//     const hasAccess = session.ownerId === user.id ||
//       session.participants.some(p => p.userId === user.id) ||
//       session.type === 'PUBLIC'

//     if (!hasAccess) {
//       return NextResponse.json({ error: 'Access denied' }, { status: 403 })
//     }

//     return NextResponse.json({ session })

//   } catch (error) {
//     console.error('Session fetch error:', error)
//     return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 })
//   }
// }


// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const user = await getUserFromRequest(request)
//     const { id } = await params
    
//     if (!user) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       )
//     }

//     const body = await request.json()
//     const { content, settings } = updateSessionSchema.parse(body)

//     const session = await prisma.session.findUnique({
//       where: { id },
//       include: {
//         participants: {
//           where: { userId: user.id }
//         }
//       }
//     })

//     if (!session) {
//       return NextResponse.json(
//         { error: 'Session not found' },
//         { status: 404 }
//       )
//     }

//     // Check if user is a participant
//     const isParticipant = session.ownerId === user.id || 
//       session.participants.length > 0

//     if (!isParticipant) {
//       return NextResponse.json(
//         { error: 'Access denied' },
//         { status: 403 }
//       )
//     }

//     const updatedSession = await prisma.session.update({
//       where: { id },
//       data: {
//         ...(content && { content }),
//         ...(settings && { settings }),
//         lastActivity: new Date(),
//         updatedAt: new Date()
//       }
//     })

//     return NextResponse.json({
//       message: 'Session updated successfully',
//       session: updatedSession
//     })

//   } catch (error) {
//     console.error('❌ Update session error:', error)
    
//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         { error: error.errors[0].message },
//         { status: 400 }
//       )
//     }

//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     )
//   }
// }

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const user = await getUserFromRequest(request)
//     const { id } = await params
    
//     if (!user) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       )
//     }

//     const session = await prisma.session.findUnique({
//       where: { id },
//       select: { ownerId: true, title: true }
//     })

//     if (!session) {
//       return NextResponse.json(
//         { error: 'Session not found' },
//         { status: 404 }
//       )
//     }

//     // Only session owner can delete
//     if (session.ownerId !== user.id) {
//       return NextResponse.json(
//         { error: 'Only the session owner can delete the session' },
//         { status: 403 }
//       )
//     }

//     await prisma.session.delete({
//       where: { id }
//     })

//     console.log(`🗑️ Session deleted: ${session.title} by ${user.displayName}`)

//     return NextResponse.json({
//       message: 'Session deleted successfully'
//     })

//   } catch (error) {
//     console.error('❌ Delete session error:', error)
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     )
//   }
// }



import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

// export async function GET(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const user = await getUserFromRequest(req)
//     if (!user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     const { id: sessionId } = await params  // ✅ Fixed: await params
//     const { searchParams } = new URL(req.url)
//     const includeFiles = searchParams.get('includeFiles') === 'true'

//     const session = await prisma.session.findUnique({
//       where: { id: sessionId },
//       include: {
//         owner: {
//           select: { id: true, displayName: true, email: true }
//         },
//         participants: {
//           include: {
//             user: {
//               select: { id: true, displayName: true, email: true }
//             }
//           }
//         },
//         messages: {
//           include: {
//             user: {
//               select: { id: true, displayName: true }
//             }
//           },
//           orderBy: { createdAt: 'asc' }
//         },
//         files: includeFiles ? {
//           orderBy: { createdAt: 'asc' }
//         } : false,
//         _count: {
//           select: {
//             participants: true,
//             files: true,
//             messages: true
//           }
//         }
//       }
//     })

//     if (!session) {
//       return NextResponse.json({ error: 'Session not found' }, { status: 404 })
//     }

//     // Check access permissions
//     const hasAccess = session.ownerId === user.id ||
//       session.participants.some(p => p.userId === user.id) ||
//       session.type === 'PUBLIC'

//     if (!hasAccess) {
//       return NextResponse.json({ error: 'Access denied' }, { status: 403 })
//     }

//     return NextResponse.json({ session })

//   } catch (error) {
//     console.error('Session fetch error:', error)
//     return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 })
//   }
// }

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            displayName: true,
            email: true
          }
        },
        participants: {
          where: { isActive: true },
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
                email: true
              }
            }
          }
        },
        files: {
          orderBy: { createdAt: 'asc' },
          include: {
            creator: {
              select: { displayName: true }
            }
          }
        },
        messages: {
          include: {
            user: {
              select: {
                id: true,
                displayName: true
              }
            }
          },
          orderBy: { createdAt: 'asc' },
          take: 100
        },
        _count: {
          select: {
            participants: { where: { isActive: true } },
            files: true,
            messages: true
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

    // Check access permissions
    const hasAccess = session.ownerId === user.id ||
      session.participants.some(p => p.userId === user.id) ||
      session.type === 'PUBLIC'

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    console.log(`✅ Session data sent: ${session.files.length} files included`)

    return NextResponse.json({ session })

  } catch (error) {
    console.error('Get session error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: sessionId } = await params  // ✅ Fixed: await params
    const body = await req.json()

    // ... rest of your PATCH logic
    
  } catch (error) {
    console.error('Session update error:', error)
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: sessionId } = await params  // ✅ Fixed: await params
    
    // ... rest of your DELETE logic

  } catch (error) {
    console.error('Session delete error:', error)
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 })
  }
}
