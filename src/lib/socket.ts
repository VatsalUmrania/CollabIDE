// import { Server as NetServer } from 'http'
// import { NextApiRequest, NextApiResponse } from 'next'
// import { Server as ServerIO } from 'socket.io'
// import { prisma } from './db'
// import { verifyToken } from './auth'

// export type NextApiResponseServerIO = NextApiResponse & {
//   socket: Socket & {
//     server: NetServer & {
//       io: ServerIO
//     }
//   }
// }

// interface AuthenticatedSocket extends Socket {
//   userId?: string
//   sessionId?: string
// }

// export const initializeSocket = (server: NetServer) => {
//   const io = new ServerIO(server, {
//     path: '/api/socket',
//     addTrailingSlash: false,
//     cors: {
//       origin: process.env.NODE_ENV === 'production' 
//         ? process.env.NEXTAUTH_URL 
//         : 'http://localhost:3000',
//       methods: ['GET', 'POST']
//     }
//   })

//   // Authentication middleware
//   io.use(async (socket: AuthenticatedSocket, next) => {
//     try {
//       const token = socket.handshake.auth.token
//       if (!token) {
//         return next(new Error('Authentication required'))
//       }

//       const payload = verifyToken(token)
//       if (!payload) {
//         return next(new Error('Invalid token'))
//       }

//       const user = await prisma.user.findUnique({
//         where: { id: payload.userId },
//         select: { id: true, displayName: true, email: true }
//       })

//       if (!user) {
//         return next(new Error('User not found'))
//       }

//       socket.userId = user.id
//       socket.user = user
//       next()
//     } catch (error) {
//       next(new Error('Authentication failed'))
//     }
//   })

//   io.on('connection', (socket: AuthenticatedSocket) => {
//     console.log('User connected:', socket.user?.displayName)

//     // Join session room
//     socket.on('join-session', async (sessionId: string) => {
//       try {
//         const session = await prisma.session.findUnique({
//           where: { id: sessionId },
//           include: {
//             participants: {
//               include: {
//                 user: {
//                   select: { id: true, displayName: true, email: true }
//                 }
//               }
//             }
//           }
//         })

//         if (!session) {
//           socket.emit('error', 'Session not found')
//           return
//         }

//         // Check access permissions
//         const hasAccess = session.ownerId === socket.userId ||
//           session.participants.some(p => p.userId === socket.userId) ||
//           session.type === 'PUBLIC'

//         if (!hasAccess) {
//           if (session.type === 'PRIVATE') {
//             // Create join request for private sessions
//             await prisma.joinRequest.upsert({
//               where: {
//                 userId_sessionId: {
//                   userId: socket.userId!,
//                   sessionId: sessionId
//                 }
//               },
//               create: {
//                 userId: socket.userId!,
//                 sessionId: sessionId,
//                 status: 'PENDING'
//               },
//               update: {}
//             })

//             // Notify session owner
//             socket.to(`session-${sessionId}`).emit('join-request', {
//               user: socket.user,
//               sessionId
//             })

//             socket.emit('join-request-sent')
//             return
//           } else {
//             socket.emit('error', 'Access denied')
//             return
//           }
//         }

//         // Add user as participant if not already
//         if (!session.participants.some(p => p.userId === socket.userId)) {
//           await prisma.sessionParticipant.create({
//             data: {
//               userId: socket.userId!,
//               sessionId: sessionId,
//               role: 'COLLABORATOR'
//             }
//           })
//         }

//         socket.sessionId = sessionId
//         socket.join(`session-${sessionId}`)

//         // Notify other participants
//         socket.to(`session-${sessionId}`).emit('user-joined', {
//           user: socket.user,
//           timestamp: new Date()
//         })

//         // Send current session state
//         socket.emit('session-joined', {
//           session,
//           content: session.content
//         })

//       } catch (error) {
//         console.error('Join session error:', error)
//         socket.emit('error', 'Failed to join session')
//       }
//     })
//     socket.on('code-update', (data) => {
//       console.log('📥 Received code update:', data.language, 'from user:', data.userId)
      
//       if (data.userId !== user?.id) {
//         console.log('✅ Applying remote code change for', data.language)
        
//         // Update state immediately
//         setCode(prev => {
//           const newCode = { ...prev, [data.language]: data.content }
//           lastCodeChangeRef.current[data.language] = data.content
//           return newCode
//         })
        
//         // Update Monaco editor if it's the active tab
//         if (activeTab === data.language && editorRef.current) {
//           const currentValue = editorRef.current.getValue()
//           if (currentValue !== data.content) {
//             console.log('🔄 Updating Monaco editor with remote changes')
            
//             // Temporarily disable change events to prevent loops
//             const model = editorRef.current.getModel()
//             if (model) {
//               model.setValue(data.content)
//             }
//           }
//         }
//       }
//     })
//     // Handle code changes (Y.js operations)
//     socket.on('code-operation', (operation) => {
//       if (socket.sessionId) {
//         socket.to(`session-${socket.sessionId}`).emit('code-operation', {
//           operation,
//           userId: socket.userId,
//           timestamp: Date.now()
//         })
//       }
//     })

//     // Handle cursor position updates
//     socket.on('cursor-update', (cursorData) => {
//       if (socket.sessionId) {
//         socket.to(`session-${socket.sessionId}`).emit('cursor-update', {
//           ...cursorData,
//           userId: socket.userId,
//           user: socket.user
//         })
//       }
//     })

//     // Handle chat messages
//     socket.on('chat-message', async (messageData) => {
//       try {
//         if (!socket.sessionId) return

//         const message = await prisma.message.create({
//           data: {
//             content: messageData.content,
//             userId: socket.userId!,
//             sessionId: socket.sessionId
//           },
//           include: {
//             user: {
//               select: { id: true, displayName: true }
//             }
//           }
//         })

//         io.to(`session-${socket.sessionId}`).emit('chat-message', message)

//       } catch (error) {
//         console.error('Chat message error:', error)
//         socket.emit('error', 'Failed to send message')
//       }
//     })

//     // Handle join request responses (for hosts)
//     socket.on('join-request-response', async ({ requestId, approved }) => {
//       try {
//         const joinRequest = await prisma.joinRequest.findUnique({
//           where: { id: requestId },
//           include: {
//             session: true
//           }
//         })

//         if (!joinRequest || joinRequest.session.ownerId !== socket.userId) {
//           return
//         }

//         await prisma.joinRequest.update({
//           where: { id: requestId },
//           data: { status: approved ? 'APPROVED' : 'DENIED' }
//         })

//         if (approved) {
//           // Add as participant
//           await prisma.sessionParticipant.create({
//             data: {
//               userId: joinRequest.userId,
//               sessionId: joinRequest.sessionId,
//               role: 'COLLABORATOR'
//             }
//           })
//         }

//         // Notify the requesting user
//         socket.emit('join-request-handled', {
//           requestId,
//           approved,
//           sessionId: joinRequest.sessionId
//         })

//       } catch (error) {
//         console.error('Join request response error:', error)
//       }
//     })
// // In your session page, ensure this event handler is properly set up
// socket.on('file-update', (data) => {
//   // This should trigger when another user makes changes
//   if (data.userId !== user?.id && data.fileId === activeFileId) {
//     console.log('📥 Receiving code update from another user')
//     setFiles(prev => prev.map(file => 
//       file.id === data.fileId 
//         ? { ...file, content: data.content, updatedAt: new Date() }
//         : file
//     ))
//   }
// })

//     // Handle disconnect
//     socket.on('disconnect', () => {
//       console.log('User disconnected:', socket.user?.displayName)
      
//       if (socket.sessionId) {
//         socket.to(`session-${socket.sessionId}`).emit('user-left', {
//           user: socket.user,
//           timestamp: new Date()
//         })
//       }
//     })
//   })

//   // In your session page useEffect for socket events, update the session-ended handler:

// socket.on('session-ended', (data) => {
//   console.log('🛑 Session ended by host:', data)
  
//   // Show notification modal instead of alert
//   setShowSessionEndedModal(true)
//   setSessionEndedReason(data.reason || 'The host has ended this session')
  
//   // Automatically redirect after a delay
//   setTimeout(() => {
//     router.push('/dashboard')
//   }, 3000)
// })

// // Add this to handle being kicked out by host
// socket.on('participant-kicked', (data) => {
//   console.log('🚫 You were removed from the session:', data)
//   alert(`You have been removed from this session by the host: ${data.reason || 'No reason provided'}`)
//   router.push('/dashboard')
// })

// // Handle force disconnect
// socket.on('force-disconnect', (data) => {
//   console.log('⚠️ Force disconnected:', data)
//   router.push('/dashboard')
// })

//   return io
// }

import { Server as NetServer } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'
import { Server as ServerIO } from 'socket.io'
import { prisma } from './db'
import { verifyToken } from './auth'

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: ServerIO
    }
  }
}

interface AuthenticatedSocket extends Socket {
  userId?: string
  sessionId?: string
  user?: {
    id: string
    displayName: string
    email: string
  }
}

export const initializeSocket = (server: NetServer) => {
  const io = new ServerIO(server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.NEXTAUTH_URL 
        : 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  })

  // Clean up expired locks periodically
  setInterval(async () => {
    try {
      const expiredLocks = await prisma.fileLock.findMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      })

      if (expiredLocks.length > 0) {
        await prisma.fileLock.deleteMany({
          where: {
            expiresAt: {
              lt: new Date()
            }
          }
        })

        // Notify clients about released locks
        expiredLocks.forEach(lock => {
          io.emit('lock-released', { fileId: lock.fileId })
        })
      }
    } catch (error) {
      console.error('Failed to cleanup expired locks:', error)
    }
  }, 30000) // Check every 30 seconds

  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token
      if (!token) {
        return next(new Error('Authentication required'))
      }

      const payload = verifyToken(token)
      if (!payload) {
        return next(new Error('Invalid token'))
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, displayName: true, email: true }
      })

      if (!user) {
        return next(new Error('User not found'))
      }

      socket.userId = user.id
      socket.user = user
      next()
    } catch (error) {
      next(new Error('Authentication failed'))
    }
  })

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log('User connected:', socket.user?.displayName)

    // Join session room
    socket.on('join-session', async (sessionId: string) => {
      try {
        const session = await prisma.session.findUnique({
          where: { id: sessionId },
          include: {
            participants: {
              include: {
                user: {
                  select: { id: true, displayName: true, email: true }
                }
              }
            },
            files: {
              include: {
                lock: {
                  include: {
                    user: {
                      select: { id: true, displayName: true }
                    }
                  }
                }
              }
            },
            messages: {
              include: {
                user: {
                  select: { id: true, displayName: true }
                }
              },
              orderBy: { createdAt: 'asc' }
            }
          }
        })

        if (!session) {
          socket.emit('error', 'Session not found')
          return
        }

        // Check access permissions
        const hasAccess = session.ownerId === socket.userId ||
          session.participants.some(p => p.userId === socket.userId) ||
          session.type === 'PUBLIC'

        if (!hasAccess) {
          socket.emit('error', 'Access denied')
          return
        }

        // Add user as participant if not already
        if (!session.participants.some(p => p.userId === socket.userId)) {
          await prisma.sessionParticipant.create({
            data: {
              userId: socket.userId!,
              sessionId: sessionId,
              role: 'COLLABORATOR'
            }
          })
        }

        socket.sessionId = sessionId
        socket.join(`session-${sessionId}`)

        // Get current participant count
        const participantCount = await prisma.sessionParticipant.count({
          where: { 
            sessionId: sessionId,
            isActive: true 
          }
        })

        // Notify other participants
        socket.to(`session-${sessionId}`).emit('user-joined', {
          userId: socket.userId,
          userEmail: socket.user?.email,
          userDisplayName: socket.user?.displayName,
          socketId: socket.id,
          participantCount: participantCount + 1,
          timestamp: new Date()
        })

        // Send current session state with file locks
        socket.emit('session-joined', {
          session: {
            ...session,
            files: session.files.map(file => ({
              ...file,
              lockedBy: file.lock?.lockedBy || null,
              lockedByUser: file.lock?.user || null
            }))
          },
          participantCount: participantCount + 1,
          timestamp: new Date()
        })

      } catch (error) {
        console.error('Join session error:', error)
        socket.emit('error', 'Failed to join session')
      }
    })

    // File lock management
    socket.on('request-file-lock', async ({ fileId }) => {
      try {
        console.log('🔒 Lock request for file:', fileId, 'by user:', socket.user?.displayName)
        
        // Check if file is already locked
        const existingLock = await prisma.fileLock.findUnique({
          where: { fileId },
          include: {
            user: {
              select: { id: true, displayName: true }
            }
          }
        })

        if (existingLock && existingLock.lockedBy !== socket.userId) {
          // File is locked by someone else
          socket.emit('lock-denied', { 
            fileId, 
            lockedBy: existingLock.lockedBy,
            lockedByUser: existingLock.user
          })
          return
        }

        // Create or update lock (expires in 5 minutes)
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000)
        
        const lock = await prisma.fileLock.upsert({
          where: { fileId },
          create: {
            fileId,
            lockedBy: socket.userId!,
            expiresAt
          },
          update: {
            expiresAt // Extend lock
          },
          include: {
            user: {
              select: { id: true, displayName: true }
            }
          }
        })

        // Notify all users in session about the lock
        io.to(`session-${socket.sessionId}`).emit('file-locked', {
          fileId,
          lockedBy: lock.lockedBy,
          lockedByUser: lock.user,
          expiresAt: lock.expiresAt
        })

        console.log('✅ File locked:', fileId, 'by:', socket.user?.displayName)

      } catch (error) {
        console.error('Failed to acquire file lock:', error)
        socket.emit('lock-error', { fileId, message: 'Failed to acquire lock' })
      }
    })

    socket.on('release-file-lock', async ({ fileId }) => {
      try {
        console.log('🔓 Lock release for file:', fileId, 'by user:', socket.user?.displayName)
        
        const deletedLock = await prisma.fileLock.deleteMany({
          where: {
            fileId,
            lockedBy: socket.userId
          }
        })

        if (deletedLock.count > 0) {
          // Notify all users in session about the release
          io.to(`session-${socket.sessionId}`).emit('file-unlocked', { fileId })
          console.log('✅ File unlocked:', fileId)
        }

      } catch (error) {
        console.error('Failed to release file lock:', error)
      }
    })

    socket.on('extend-file-lock', async ({ fileId }) => {
      try {
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000)
        
        await prisma.fileLock.updateMany({
          where: {
            fileId,
            lockedBy: socket.userId
          },
          data: { expiresAt }
        })

      } catch (error) {
        console.error('Failed to extend file lock:', error)
      }
    })

    // File updates (only allowed if user has lock)
    socket.on('file-update', async (data) => {
      try {
        console.log('📝 File update received:', data.fileId, 'from user:', socket.user?.displayName)
        
        // Check if user has lock on this file
        const lock = await prisma.fileLock.findUnique({
          where: { fileId: data.fileId }
        })

        if (!lock || lock.lockedBy !== socket.userId) {
          socket.emit('file-update-denied', { 
            fileId: data.fileId, 
            message: 'You do not have edit access to this file' 
          })
          return
        }

        // Extend lock on each update
        await prisma.fileLock.update({
          where: { fileId: data.fileId },
          data: { expiresAt: new Date(Date.now() + 5 * 60 * 1000) }
        })

        // Update file in database
        await prisma.sessionFile.update({
          where: { id: data.fileId },
          data: { 
            content: data.content,
            updatedAt: new Date()
          }
        })

        // Broadcast to all other users in the session
        socket.to(`session-${socket.sessionId}`).emit('file-update', {
          ...data,
          userId: socket.userId,
          timestamp: Date.now()
        })

      } catch (error) {
        console.error('Failed to update file:', error)
        socket.emit('file-update-error', { fileId: data.fileId, message: 'Failed to update file' })
      }
    })

    // FIXED: Correct cursor tracking handlers
    socket.on('cursor-position', (data) => {
      console.log('📍 SERVER received cursor position from:', socket.user?.displayName, 'at:', data.position);
      if (socket.sessionId) {
        // Broadcast to all other users in the session except sender
        socket.to(`session-${socket.sessionId}`).emit('cursor-position', {
          ...data,
          userId: socket.userId,
          userName: socket.user?.displayName || 'Anonymous',
          timestamp: Date.now()
        });
        console.log('📡 Cursor position broadcasted to session:', socket.sessionId);
      }
    });

    socket.on('cursor-selection', (data) => {
      console.log('🔤 SERVER received cursor selection from:', socket.user?.displayName);
      if (socket.sessionId) {
        // Broadcast to all other users in the session except sender
        socket.to(`session-${socket.sessionId}`).emit('cursor-selection', {
          ...data,
          userId: socket.userId,
          userName: socket.user?.displayName || 'Anonymous',
          timestamp: Date.now()
        });
        console.log('📡 Cursor selection broadcasted to session:', socket.sessionId);
      }
    });

    // File creation
    socket.on('file-created', (data) => {
      console.log('📁 File created:', data.file.name, 'by user:', socket.user?.displayName)
      
      if (socket.sessionId) {
        socket.to(`session-${socket.sessionId}`).emit('file-created', {
          file: data.file,
          userId: socket.userId,
          timestamp: Date.now()
        })
      }
    })

    // File deletion
    socket.on('file-deleted', async (data) => {
      console.log('🗑️ File deleted:', data.fileId, 'by user:', socket.user?.displayName)
      
      // Remove any existing lock
      await prisma.fileLock.deleteMany({
        where: { fileId: data.fileId }
      })
      
      if (socket.sessionId) {
        socket.to(`session-${socket.sessionId}`).emit('file-deleted', {
          fileId: data.fileId,
          userId: socket.userId,
          timestamp: Date.now()
        })
      }
    })

    // Chat messages
    socket.on('chat-message', async (messageData) => {
      try {
        if (!socket.sessionId) return

        const message = await prisma.message.create({
          data: {
            content: messageData.content,
            userId: socket.userId!,
            sessionId: socket.sessionId
          },
          include: {
            user: {
              select: { id: true, displayName: true }
            }
          }
        })

        io.to(`session-${socket.sessionId}`).emit('chat-message', message)
        socket.emit('message-sent', { messageId: message.id })

      } catch (error) {
        console.error('Chat message error:', error)
        socket.emit('chat-error', { message: 'Failed to send message' })
      }
    })

    // Session management
    socket.on('end-session-broadcast', async (data) => {
      console.log('🛑 Host ending session:', data.sessionId)
      
      if (socket.sessionId) {
        try {
          // Release all locks for this session
          await prisma.fileLock.deleteMany({
            where: {
              file: {
                sessionId: data.sessionId
              }
            }
          })

          // Update session status
          await prisma.session.update({
            where: { id: data.sessionId },
            data: { isActive: false }
          })

          // Broadcast to all participants
          socket.to(`session-${socket.sessionId}`).emit('session-ended', {
            reason: data.reason || 'Session ended by host',
            hostName: data.hostName || 'Host',
            timestamp: new Date()
          })

        } catch (error) {
          console.error('Failed to end session:', error)
        }
      }
    })

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.user?.displayName)
      
      if (socket.sessionId && socket.userId) {
        try {
          // Release all locks held by this user
          const userLocks = await prisma.fileLock.findMany({
            where: { lockedBy: socket.userId }
          })

          await prisma.fileLock.deleteMany({
            where: { lockedBy: socket.userId }
          })

          // Notify about released locks
          userLocks.forEach(lock => {
            socket.to(`session-${socket.sessionId}`).emit('file-unlocked', { fileId: lock.fileId })
          })

          // Get updated participant count
          const participantCount = await prisma.sessionParticipant.count({
            where: { 
              sessionId: socket.sessionId,
              isActive: true 
            }
          })

          // Notify other participants
          socket.to(`session-${socket.sessionId}`).emit('user-left', {
            userId: socket.userId,
            userDisplayName: socket.user?.displayName,
            participantCount: Math.max(0, participantCount - 1),
            timestamp: new Date()
          })

        } catch (error) {
          console.error('Disconnect cleanup error:', error)
        }
      }
    })
  })

  return io
}
