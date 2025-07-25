


// import { createServer } from 'http'
// import { parse } from 'url'
// import next from 'next'
// import { Server } from 'socket.io'
// import jwt from 'jsonwebtoken'
// import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient()

// const dev = process.env.NODE_ENV !== 'production'
// const hostname = 'localhost'
// const port = 3000

// const app = next({ dev, hostname, port })
// const handler = app.getRequestHandler()

// interface JWTPayload {
//   userId: string
//   email: string
//   displayName: string
//   iat?: number
//   exp?: number
// }

// interface AuthenticatedSocket extends Socket {
//   userId?: string
//   userEmail?: string
//   userDisplayName?: string
//   sessionId?: string
// }

// // Verify JWT token
// async function verifyToken(token: string): Promise<JWTPayload | null> {
//   try {
//     return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
//   } catch {
//     return null
//   }
// }

// app.prepare().then(() => {
//   const httpServer = createServer(async (req, res) => {
//     const parsedUrl = parse(req.url!, true)
//     await handler(req, res, parsedUrl)
//   })
  
//   // Initialize Socket.IO with optimized settings for multi-file sync
//   const io = new Server(httpServer, {
//     path: '/api/socket',
//     cors: {
//       origin: dev ? 'http://localhost:3000' : process.env.NEXTAUTH_URL,
//       methods: ['GET', 'POST'],
//       credentials: true
//     },
//     transports: ['polling', 'websocket'],
//     allowEIO3: true,
//     pingTimeout: 60000,
//     pingInterval: 25000,
//     // Enhanced settings for better performance
//     maxHttpBufferSize: 1e6, // 1MB buffer
//     connectTimeout: 45000
//   })

//   // Authentication middleware for Socket.IO
//   io.use(async (socket: AuthenticatedSocket, next) => {
//     try {
//       const token = socket.handshake.auth.token || 
//                    socket.handshake.headers.authorization?.replace('Bearer ', '')
      
//       if (!token) {
//         return next(new Error('Authentication token required'))
//       }

//       const payload = await verifyToken(token)
//       if (!payload) {
//         return next(new Error('Invalid authentication token'))
//       }

//       socket.userId = payload.userId
//       socket.userEmail = payload.email
//       socket.userDisplayName = payload.displayName
//       console.log(`🔐 User authenticated: ${payload.displayName} (${payload.email})`)
      
//       next()
//     } catch (error) {
//       console.error('Socket authentication error:', error)
//       next(new Error('Authentication failed'))
//     }
//   })

//   // Track active sessions and participants
//   const activeSessions = new Map<string, Set<string>>()
//   const userSockets = new Map<string, string>()
  
//   // FIXED: Track file update queues per session to prevent conflicts
//   const fileUpdateQueues = new Map<string, Map<string, NodeJS.Timeout>>()

//   // Socket.IO connection handling
//   io.on('connection', (socket: AuthenticatedSocket) => {
//     console.log(`✅ User connected: ${socket.userDisplayName} (${socket.id})`)
    
//     if (socket.userId) {
//       userSockets.set(socket.userId, socket.id)
//     }

//     socket.emit('connected', {
//       message: 'Successfully connected to Socket.IO server',
//       userId: socket.userId
//     })

//     // Join session
//     socket.on('join-session', async (sessionId: string) => {
//       try {
//         console.log(`👤 User ${socket.userDisplayName} joining session ${sessionId}`)
        
//         if (!sessionId) {
//           socket.emit('error', { message: 'Session ID is required' })
//           return
//         }

//         const session = await prisma.session.findUnique({
//           where: { id: sessionId },
//           include: {
//             owner: { select: { id: true, displayName: true, email: true } },
//             participants: {
//               include: { user: { select: { id: true, displayName: true, email: true } } }
//             }
//           }
//         })

//         if (!session) {
//           socket.emit('error', { message: 'Session not found' })
//           return
//         }

//         const hasAccess = session.ownerId === socket.userId ||
//           session.participants.some(p => p.userId === socket.userId) ||
//           session.type === 'PUBLIC'

//         if (!hasAccess && session.type === 'PRIVATE') {
//           socket.emit('error', { message: 'Access denied to private session' })
//           return
//         }

//         // Add/update participant
//         const existingParticipant = session.participants.find(p => p.userId === socket.userId)
//         if (!existingParticipant) {
//           await prisma.sessionParticipant.create({
//             data: {
//               userId: socket.userId!,
//               sessionId: sessionId,
//               role: session.ownerId === socket.userId ? 'HOST' : 'COLLABORATOR',
//               isActive: true
//             }
//           })
//         } else {
//           await prisma.sessionParticipant.update({
//             where: { id: existingParticipant.id },
//             data: { isActive: true }
//           })
//         }

//         // Update session last activity
//         await prisma.session.update({
//           where: { id: sessionId },
//           data: { lastActivity: new Date() }
//         })

//         // Track in memory
//         if (!activeSessions.has(sessionId)) {
//           activeSessions.set(sessionId, new Set())
//         }
//         activeSessions.get(sessionId)!.add(socket.userId!)

//         // Initialize file update queue for session if not exists
//         if (!fileUpdateQueues.has(sessionId)) {
//           fileUpdateQueues.set(sessionId, new Map())
//         }

//         socket.sessionId = sessionId
//         socket.join(`session-${sessionId}`)

//         const participantCount = activeSessions.get(sessionId)!.size

//         // Notify others
//         socket.to(`session-${sessionId}`).emit('user-joined', {
//           userId: socket.userId,
//           userEmail: socket.userEmail,
//           userDisplayName: socket.userDisplayName,
//           socketId: socket.id,
//           sessionId,
//           timestamp: new Date(),
//           participantCount
//         })

//         socket.emit('session-joined', {
//           sessionId,
//           message: 'Successfully joined session',
//           participantCount
//         })

//         io.to(`session-${sessionId}`).emit('participant-count-updated', {
//           participantCount,
//           sessionId
//         })

//         console.log(`✅ User ${socket.userDisplayName} joined session ${sessionId}. Total: ${participantCount}`)

//       } catch (error) {
//         console.error('Join session error:', error)
//         socket.emit('error', { message: 'Failed to join session' })
//       }
//     })

//     // FIXED: Enhanced file update with proper multi-file support and conflict resolution
//     socket.on('file-update', (data: { 
//       fileId: string, 
//       content: string, 
//       sessionId: string, 
//       timestamp: number 
//     }) => {
//       try {
//         if (!socket.sessionId || socket.sessionId !== data.sessionId) {
//           return
//         }

//         const { fileId, content, sessionId, timestamp } = data

//         console.log(`📝 File update: ${fileId} from ${socket.userDisplayName} (${content.length} chars) at ${timestamp}`)
        
//         // FIXED: Immediate broadcast for real-time sync - no server-side debouncing
//         const broadcastData = {
//           fileId,
//           content,
//           userId: socket.userId,
//           timestamp,
//           sessionId
//         }
        
//         // Broadcast immediately to all other participants
//         socket.to(`session-${sessionId}`).emit('file-update', broadcastData)
        
//         // Handle database save asynchronously with proper queueing per file
//         const sessionQueue = fileUpdateQueues.get(sessionId)!
        
//         // Clear existing timeout for this specific file to prevent race conditions
//         if (sessionQueue.has(fileId)) {
//           clearTimeout(sessionQueue.get(fileId)!)
//         }
        
//         // Set new timeout for database save (batched to reduce DB load)
//         const saveTimeout = setTimeout(async () => {
//           try {
//             await saveFileToDatabase(fileId, content)
//             await updateSessionActivity(sessionId)
//             sessionQueue.delete(fileId) // Clean up after save
//           } catch (error) {
//             console.error(`❌ Failed to save file ${fileId}:`, error)
//           }
//         }, 2000) // 2 second delay for database saves to batch rapid changes
        
//         sessionQueue.set(fileId, saveTimeout)

//         console.log(`✅ File update broadcasted immediately for ${fileId}`)

//       } catch (error) {
//         console.error('❌ File update error:', error)
//         socket.emit('error', { message: 'Failed to sync file changes' })
//       }
//     })

//     // Real-time cursor updates (no database save needed)
//     socket.on('cursor-update', (cursorData) => {
//       try {
//         if (!socket.sessionId || socket.sessionId !== cursorData.sessionId) {
//           return
//         }

//         // Immediate broadcast of cursor position for real-time feel
//         socket.to(`session-${cursorData.sessionId}`).emit('cursor-update', {
//           ...cursorData,
//           timestamp: Date.now()
//         })

//       } catch (error) {
//         console.error('Cursor update error:', error)
//       }
//     })

//     // File creation
//     socket.on('file-created', (data: { sessionId: string, file: any }) => {
//       if (socket.sessionId === data.sessionId) {
//         console.log(`📁 Broadcasting new file: ${data.file.name} in session ${data.sessionId}`)
        
//         // Broadcast to ALL other users in the session (excluding sender)
//         socket.to(`session-${data.sessionId}`).emit('file-created', {
//           file: data.file,
//           createdBy: socket.userDisplayName
//         })
//       }
//     })
    
//     socket.on('file-deleted', (data: { sessionId: string, fileId: string }) => {
//       if (socket.sessionId === data.sessionId) {
//         console.log(`🗑️ Broadcasting file deletion: ${data.fileId} in session ${data.sessionId}`)
        
//         socket.to(`session-${data.sessionId}`).emit('file-deleted', {
//           fileId: data.fileId,
//           deletedBy: socket.userDisplayName
//         })
//       }
//     })
//     socket.on('session-ended', (data: { sessionId: string }) => {
//       if (socket.sessionId === data.sessionId) {
//         console.log(`🛑 Broadcasting session end for ${data.sessionId}`)
        
//         // Broadcast to ALL users in the session
//         io.to(`session-${data.sessionId}`).emit('session-ended', {
//           sessionId: data.sessionId,
//           message: 'Session has been ended by the host'
//         })
        
//         // Clean up the session from active sessions
//         if (activeSessions.has(data.sessionId)) {
//           activeSessions.delete(data.sessionId)
//         }
//       }
//     })

//     // Chat message handler
//     socket.on('chat-message', async (messageData: { 
//       content: string, 
//       sessionId: string, 
//       timestamp?: number 
//     }) => {
//       try {
//         if (!socket.sessionId || socket.sessionId !== messageData.sessionId) {
//           socket.emit('chat-error', { message: 'Not in the specified session' })
//           return
//         }

//         if (!messageData.content || !messageData.content.trim()) {
//           socket.emit('chat-error', { message: 'Message cannot be empty' })
//           return
//         }

//         console.log(`💬 Processing chat message from ${socket.userDisplayName}`)

//         const message = await prisma.message.create({
//           data: {
//             content: messageData.content.trim(),
//             userId: socket.userId!,
//             sessionId: messageData.sessionId
//           },
//           include: {
//             user: {
//               select: { id: true, displayName: true }
//             }
//           }
//         })

//         // Update session activity
//         await updateSessionActivity(messageData.sessionId)

//         // Broadcast to ALL users in the session (including sender)
//         io.to(`session-${messageData.sessionId}`).emit('chat-message', {
//           id: message.id,
//           content: message.content,
//           createdAt: message.createdAt,
//           user: {
//             id: message.user.id,
//             displayName: message.user.displayName
//           }
//         })

//         socket.emit('message-sent', { messageId: message.id })

//       } catch (error) {
//         console.error('💬 Chat message error:', error)
//         socket.emit('chat-error', { message: 'Failed to send message' })
//       }
//     })

//     // Handle participant removal (host only)
//     socket.on('remove-participant', async (data: { sessionId: string, participantId: string }) => {
//       try {
//         if (!socket.sessionId || socket.sessionId !== data.sessionId) {
//           socket.emit('error', { message: 'Not in the specified session' })
//           return
//         }

//         const session = await prisma.session.findUnique({
//           where: { id: data.sessionId },
//           select: { ownerId: true }
//         })

//         if (!session || session.ownerId !== socket.userId) {
//           socket.emit('error', { message: 'Only the host can remove participants' })
//           return
//         }

//         if (data.participantId === socket.userId) {
//           socket.emit('error', { message: 'Host cannot remove themselves' })
//           return
//         }

//         console.log(`🚫 Host ${socket.userDisplayName} removing participant ${data.participantId}`)

//         await prisma.sessionParticipant.deleteMany({
//           where: {
//             userId: data.participantId,
//             sessionId: data.sessionId
//           }
//         })

//         if (activeSessions.has(data.sessionId)) {
//           activeSessions.get(data.sessionId)!.delete(data.participantId)
//         }

//         const participantSocketId = userSockets.get(data.participantId)
//         if (participantSocketId) {
//           const participantSocket = io.sockets.sockets.get(participantSocketId)
//           if (participantSocket) {
//             participantSocket.leave(`session-${data.sessionId}`)
//           }
//         }

//         const participantCount = activeSessions.get(data.sessionId)?.size || 0

//         io.to(`session-${data.sessionId}`).emit('participant-removed', {
//           userId: data.participantId,
//           sessionId: data.sessionId,
//           participantCount
//         })

//         io.to(`session-${data.sessionId}`).emit('participant-count-updated', {
//           participantCount,
//           sessionId: data.sessionId
//         })

//       } catch (error) {
//         console.error('Remove participant error:', error)
//         socket.emit('error', { message: 'Failed to remove participant' })
//       }
//     })

//     // Handle disconnect
//     socket.on('disconnect', async (reason) => {
//       console.log(`❌ User disconnected: ${socket.userDisplayName} (${reason})`)
      
//       if (socket.userId) {
//         userSockets.delete(socket.userId)
//       }
      
//       if (socket.sessionId && socket.userId) {
//         await handleUserLeave(socket, socket.sessionId)
//       }
//     })

//     async function handleUserLeave(socket: AuthenticatedSocket, sessionId: string) {
//       try {
//         if (activeSessions.has(sessionId)) {
//           activeSessions.get(sessionId)!.delete(socket.userId!)
//           if (activeSessions.get(sessionId)!.size === 0) {
//             activeSessions.delete(sessionId)
//             // Clean up file update queues when session becomes empty
//             const sessionQueue = fileUpdateQueues.get(sessionId)
//             if (sessionQueue) {
//               sessionQueue.forEach(timeout => clearTimeout(timeout))
//               fileUpdateQueues.delete(sessionId)
//             }
//           }
//         }

//         await prisma.sessionParticipant.updateMany({
//           where: {
//             userId: socket.userId!,
//             sessionId: sessionId
//           },
//           data: { isActive: false }
//         })

//         const participantCount = activeSessions.get(sessionId)?.size || 0

//         socket.to(`session-${sessionId}`).emit('user-left', {
//           userId: socket.userId,
//           userEmail: socket.userEmail,
//           userDisplayName: socket.userDisplayName,
//           sessionId: sessionId,
//           timestamp: new Date(),
//           participantCount
//         })

//         socket.to(`session-${sessionId}`).emit('participant-count-updated', {
//           participantCount,
//           sessionId
//         })

//         socket.leave(`session-${sessionId}`)
//         socket.sessionId = undefined

//       } catch (error) {
//         console.error('User leave cleanup error:', error)
//       }
//     }
//   })

//   // FIXED: Enhanced database operations with better error handling
//   async function saveFileToDatabase(fileId: string, content: string) {
//     try {
//       const result = await prisma.sessionFile.update({
//         where: { id: fileId },
//         data: { 
//           content,
//           updatedAt: new Date()
//         }
//       })
//       console.log(`💾 File ${fileId} saved to database (${content.length} chars)`)
//       return result
//     } catch (error) {
//       console.error(`❌ Database save error for file ${fileId}:`, error)
//       throw error
//     }
//   }

//   async function updateSessionActivity(sessionId: string) {
//     try {
//       await prisma.session.update({
//         where: { id: sessionId },
//         data: { lastActivity: new Date() }
//       })
//     } catch (error) {
//       console.error('Session activity update error:', error)
//     }
//   }

//   // Enhanced cleanup with file queue cleanup
//   setInterval(async () => {
//     try {
//       const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
//       const inactiveSessions = await prisma.session.findMany({
//         where: {
//           lastActivity: { lt: oneHourAgo },
//           isActive: true
//         },
//         select: { id: true }
//       })

//       if (inactiveSessions.length > 0) {
//         await prisma.session.updateMany({
//           where: {
//             id: { in: inactiveSessions.map(s => s.id) }
//           },
//           data: { isActive: false }
//         })
        
//         // Clean up file update queues for inactive sessions
//         inactiveSessions.forEach(session => {
//           const sessionQueue = fileUpdateQueues.get(session.id)
//           if (sessionQueue) {
//             sessionQueue.forEach(timeout => clearTimeout(timeout))
//             fileUpdateQueues.delete(session.id)
//           }
//         })
        
//         console.log(`🧹 Marked ${inactiveSessions.length} sessions as inactive and cleaned up queues`)
//       }
//     } catch (error) {
//       console.error('Session cleanup error:', error)
//     }
//   }, 10 * 60 * 1000) // Run every 10 minutes

//   httpServer.listen(port, () => {
//     console.log(`🚀 Server ready on http://${hostname}:${port}`)
//     console.log(`📡 Socket.IO server optimized for multi-file collaboration`)
//   })
// })





import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000

const app = next({ dev, hostname, port })
const handler = app.getRequestHandler()

interface JWTPayload {
  userId: string
  email: string
  displayName: string
  iat?: number
  exp?: number
}

interface AuthenticatedSocket extends Socket {
  userId?: string
  userEmail?: string
  userDisplayName?: string
  sessionId?: string
}

// Rate limiting maps
const userLastUpdate = new Map<string, number>()
const userLastCursor = new Map<string, number>()
const userLastTyping = new Map<string, number>()

// Enhanced session management
const activeSessions = new Map<string, Set<string>>()
const userSockets = new Map<string, string>()
const fileUpdateQueues = new Map<string, Map<string, NodeJS.Timeout>>()

// Verify JWT token
async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
  } catch {
    return null
  }
}

// Throttle function for high-frequency events
function throttle<T extends any[]>(
  func: (...args: T) => void,
  delay: number,
  key: string,
  trackingMap: Map<string, number>
): (...args: T) => void {
  return (...args: T) => {
    const now = Date.now()
    const lastCall = trackingMap.get(key) || 0
    
    if (now - lastCall >= delay) {
      trackingMap.set(key, now)
      func(...args)
    }
  }
}

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    const parsedUrl = parse(req.url!, true)
    await handler(req, res, parsedUrl)
  })
  
  // Initialize Socket.IO with optimized settings for real-time collaboration
  const io = new Server(httpServer, {
    path: '/api/socket',
    cors: {
      origin: dev ? 'http://localhost:3000' : process.env.NEXTAUTH_URL,
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling'],
    upgradeTimeout: 10000,
    pingTimeout: 20000,
    pingInterval: 10000,
    allowEIO3: true,
    compression: false,
    httpCompression: false,
    maxHttpBufferSize: 1e8
  })

  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || 
                   socket.handshake.headers.authorization?.replace('Bearer ', '')
      
      if (!token) {
        return next(new Error('Authentication token required'))
      }

      const payload = await verifyToken(token)
      if (!payload) {
        return next(new Error('Invalid authentication token'))
      }

      socket.userId = payload.userId
      socket.userEmail = payload.email
      socket.userDisplayName = payload.displayName
      console.log(`🔐 User authenticated: ${payload.displayName} (${payload.email})`)
      
      next()
    } catch (error) {
      console.error('Socket authentication error:', error)
      next(new Error('Authentication failed'))
    }
  })

  // Socket.IO connection handling
  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`✅ User connected: ${socket.userDisplayName} (${socket.id})`)
    
    if (socket.userId) {
      userSockets.set(socket.userId, socket.id)
    }

    socket.emit('connected', {
      message: 'Successfully connected to Socket.IO server',
      userId: socket.userId
    })

    // Join session
    socket.on('join-session', async (sessionId: string) => {
      try {
        console.log(`👤 User ${socket.userDisplayName} joining session ${sessionId}`)
        
        if (!sessionId) {
          socket.emit('error', { message: 'Session ID is required' })
          return
        }

        const session = await prisma.session.findUnique({
          where: { id: sessionId },
          include: {
            owner: { select: { id: true, displayName: true, email: true } },
            participants: {
              include: { user: { select: { id: true, displayName: true, email: true } } }
            }
          }
        })

        if (!session) {
          socket.emit('error', { message: 'Session not found' })
          return
        }

        // Check if session is active
        if (!session.isActive) {
          socket.emit('error', { message: 'This session has ended and is no longer available' })
          return
        }

        const hasAccess = session.ownerId === socket.userId ||
          session.participants.some(p => p.userId === socket.userId) ||
          session.type === 'PUBLIC'

        if (!hasAccess && session.type === 'PRIVATE') {
          socket.emit('error', { message: 'Access denied to private session' })
          return
        }

        // Add/update participant
        const existingParticipant = session.participants.find(p => p.userId === socket.userId)
        if (!existingParticipant) {
          await prisma.sessionParticipant.create({
            data: {
              userId: socket.userId!,
              sessionId: sessionId,
              role: session.ownerId === socket.userId ? 'HOST' : 'COLLABORATOR',
              isActive: true
            }
          })
        } else {
          await prisma.sessionParticipant.update({
            where: { id: existingParticipant.id },
            data: { isActive: true }
          })
        }

        // Update session last activity
        await prisma.session.update({
          where: { id: sessionId },
          data: { lastActivity: new Date() }
        })

        // Track in memory
        if (!activeSessions.has(sessionId)) {
          activeSessions.set(sessionId, new Set())
        }
        activeSessions.get(sessionId)!.add(socket.userId!)

        // Initialize file update queue for session if not exists
        if (!fileUpdateQueues.has(sessionId)) {
          fileUpdateQueues.set(sessionId, new Map())
        }

        socket.sessionId = sessionId
        socket.join(`session-${sessionId}`)

        const participantCount = activeSessions.get(sessionId)!.size

        // Notify others
        socket.to(`session-${sessionId}`).emit('user-joined', {
          userId: socket.userId,
          userEmail: socket.userEmail,
          userDisplayName: socket.userDisplayName,
          socketId: socket.id,
          sessionId,
          timestamp: new Date(),
          participantCount
        })

        socket.emit('session-joined', {
          sessionId,
          message: 'Successfully joined session',
          participantCount
        })

        io.to(`session-${sessionId}`).emit('participant-count-updated', {
          participantCount,
          sessionId
        })

        console.log(`✅ User ${socket.userDisplayName} joined session ${sessionId}. Total: ${participantCount}`)

      } catch (error) {
        console.error('Join session error:', error)
        socket.emit('error', { message: 'Failed to join session' })
      }
    })

    // Real-time file updates with immediate broadcasting
    socket.on('file-update', (data: { 
      fileId: string, 
      content: string, 
      sessionId: string, 
      timestamp: number 
    }) => {
      try {
        if (!socket.sessionId || socket.sessionId !== data.sessionId) {
          return
        }

        const { fileId, content, sessionId, timestamp } = data

        console.log(`📝 File update: ${fileId} from ${socket.userDisplayName} (${content.length} chars) at ${timestamp}`)
        
        // Immediate broadcast for real-time sync
        const broadcastData = {
          fileId,
          content,
          userId: socket.userId,
          timestamp,
          sessionId
        }
        
        // Broadcast immediately to all other participants
        socket.to(`session-${sessionId}`).emit('file-update', broadcastData)
        
        // Handle database save asynchronously with proper queueing per file
        const sessionQueue = fileUpdateQueues.get(sessionId)!
        
        // Clear existing timeout for this specific file to prevent race conditions
        if (sessionQueue.has(fileId)) {
          clearTimeout(sessionQueue.get(fileId)!)
        }
        
        // Set new timeout for database save (batched to reduce DB load)
        const saveTimeout = setTimeout(async () => {
          try {
            await saveFileToDatabase(fileId, content)
            await updateSessionActivity(sessionId)
            sessionQueue.delete(fileId)
          } catch (error) {
            console.error(`❌ Failed to save file ${fileId}:`, error)
          }
        }, 2000)
        
        sessionQueue.set(fileId, saveTimeout)

        console.log(`✅ File update broadcasted immediately for ${fileId}`)

      } catch (error) {
        console.error('❌ File update error:', error)
        socket.emit('error', { message: 'Failed to sync file changes' })
      }
    })

    // Real-time cursor updates
    socket.on('cursor-update', (cursorData) => {
      try {
        if (!socket.sessionId || socket.sessionId !== cursorData.sessionId) {
          return
        }

        socket.to(`session-${cursorData.sessionId}`).emit('cursor-update', {
          ...cursorData,
          timestamp: Date.now()
        })

      } catch (error) {
        console.error('Cursor update error:', error)
      }
    })

    // File creation
    socket.on('file-created', (data: { sessionId: string, file: any }) => {
      if (socket.sessionId === data.sessionId) {
        console.log(`📁 New file created: ${data.file.name} in session ${data.sessionId}`)
        socket.to(`session-${data.sessionId}`).emit('file-created', data)
      }
    })

    // File deletion
    socket.on('file-deleted', (data: { sessionId: string, fileId: string }) => {
      if (socket.sessionId === data.sessionId) {
        console.log(`🗑️ File deleted: ${data.fileId} in session ${data.sessionId}`)
        socket.to(`session-${data.sessionId}`).emit('file-deleted', data)
        
        // Clean up any pending saves for deleted file
        const sessionQueue = fileUpdateQueues.get(data.sessionId)
        if (sessionQueue && sessionQueue.has(data.fileId)) {
          clearTimeout(sessionQueue.get(data.fileId)!)
          sessionQueue.delete(data.fileId)
        }
      }
    })

    // Enhanced session ending with complete participant removal
    socket.on('end-session-broadcast', async (data: { 
      sessionId: string, 
      reason: string, 
      hostName: string 
    }) => {
      try {
        if (!socket.sessionId || socket.sessionId !== data.sessionId) {
          return
        }

        // Verify the user is the session owner
        const session = await prisma.session.findUnique({
          where: { id: data.sessionId },
          select: { ownerId: true, title: true }
        })

        if (!session || session.ownerId !== socket.userId) {
          socket.emit('error', { message: 'Only the session owner can end the session' })
          return
        }

        console.log(`🛑 Host ${data.hostName} ending session ${data.sessionId}`)

        // Update session in database
        await prisma.session.update({
          where: { id: data.sessionId },
          data: { 
            isActive: false,
            lastActivity: new Date()
          }
        })

        // Mark all participants as inactive
        await prisma.sessionParticipant.updateMany({
          where: { sessionId: data.sessionId },
          data: { isActive: false }
        })

        // Get all sockets in the session room
        const room = io.sockets.adapter.rooms.get(`session-${data.sessionId}`)
        
        if (room) {
          console.log(`📡 Notifying ${room.size} participants about session end`)
          
          // Broadcast to ALL users in the session (including host)
          io.to(`session-${data.sessionId}`).emit('session-ended', {
            sessionId: data.sessionId,
            reason: data.reason,
            hostName: data.hostName,
            message: `Session "${session.title}" has been ended by ${data.hostName}`
          })

          // Force disconnect all participants after a short delay
          setTimeout(() => {
            room.forEach((socketId) => {
              const participantSocket = io.sockets.sockets.get(socketId)
              if (participantSocket && participantSocket.id !== socket.id) {
                participantSocket.emit('force-disconnect', {
                  reason: 'Session ended',
                  sessionId: data.sessionId
                })
                participantSocket.leave(`session-${data.sessionId}`)
                
                // Clear session ID from socket
                if ('sessionId' in participantSocket) {
                  (participantSocket as AuthenticatedSocket).sessionId = undefined
                }
              }
            })
            
            // Clean up the room
            io.sockets.adapter.rooms.delete(`session-${data.sessionId}`)
            
            // Clean up tracking data
            if (activeSessions.has(data.sessionId)) {
              activeSessions.delete(data.sessionId)
            }
            
            // Clean up file update queues
            const sessionQueue = fileUpdateQueues.get(data.sessionId)
            if (sessionQueue) {
              sessionQueue.forEach(timeout => clearTimeout(timeout))
              fileUpdateQueues.delete(data.sessionId)
            }
            
            console.log(`✅ Session ${data.sessionId} completely cleaned up`)
          }, 1000) // 1 second delay to ensure message delivery
        }

      } catch (error) {
        console.error('End session broadcast error:', error)
        socket.emit('error', { message: 'Failed to end session' })
      }
    })

    // Enhanced participant removal with kick notifications
    socket.on('remove-participant', async (data: { 
      sessionId: string, 
      participantId: string, 
      reason?: string 
    }) => {
      try {
        if (!socket.sessionId || socket.sessionId !== data.sessionId) {
          socket.emit('error', { message: 'Not in the specified session' })
          return
        }

        const session = await prisma.session.findUnique({
          where: { id: data.sessionId },
          select: { ownerId: true }
        })

        if (!session || session.ownerId !== socket.userId) {
          socket.emit('error', { message: 'Only the host can remove participants' })
          return
        }

        if (data.participantId === socket.userId) {
          socket.emit('error', { message: 'Host cannot remove themselves' })
          return
        }

        console.log(`🚫 Host ${socket.userDisplayName} removing participant ${data.participantId}`)

        // Remove from database
        await prisma.sessionParticipant.deleteMany({
          where: {
            userId: data.participantId,
            sessionId: data.sessionId
          }
        })

        // Remove from memory tracking
        if (activeSessions.has(data.sessionId)) {
          activeSessions.get(data.sessionId)!.delete(data.participantId)
        }

        const participantSocketId = userSockets.get(data.participantId)
        if (participantSocketId) {
          const participantSocket = io.sockets.sockets.get(participantSocketId)
          if (participantSocket) {
            // Notify the participant they were kicked
            participantSocket.emit('participant-kicked', {
              sessionId: data.sessionId,
              reason: data.reason || 'Removed by host',
              hostName: socket.userDisplayName
            })
            
            // Force them to leave the room
            participantSocket.leave(`session-${data.sessionId}`)
            
            // Clear session ID
            if ('sessionId' in participantSocket) {
              (participantSocket as AuthenticatedSocket).sessionId = undefined
            }
            
            // Force disconnect after a short delay
            setTimeout(() => {
              participantSocket.emit('force-disconnect', {
                reason: 'Removed from session',
                sessionId: data.sessionId
              })
            }, 500)
          }
        }

        const participantCount = activeSessions.get(data.sessionId)?.size || 0

        // Notify remaining participants
        io.to(`session-${data.sessionId}`).emit('participant-removed', {
          userId: data.participantId,
          sessionId: data.sessionId,
          participantCount,
          reason: data.reason || 'Removed by host'
        })

        io.to(`session-${data.sessionId}`).emit('participant-count-updated', {
          participantCount,
          sessionId: data.sessionId
        })

      } catch (error) {
        console.error('Remove participant error:', error)
        socket.emit('error', { message: 'Failed to remove participant' })
      }
    })

    // Chat message handler
    socket.on('chat-message', async (messageData: { 
      content: string, 
      sessionId: string, 
      timestamp?: number 
    }) => {
      try {
        if (!socket.sessionId || socket.sessionId !== messageData.sessionId) {
          socket.emit('chat-error', { message: 'Not in the specified session' })
          return
        }

        if (!messageData.content || !messageData.content.trim()) {
          socket.emit('chat-error', { message: 'Message cannot be empty' })
          return
        }

        console.log(`💬 Processing chat message from ${socket.userDisplayName}`)

        const message = await prisma.message.create({
          data: {
            content: messageData.content.trim(),
            userId: socket.userId!,
            sessionId: messageData.sessionId
          },
          include: {
            user: {
              select: { id: true, displayName: true }
            }
          }
        })

        // Update session activity
        await updateSessionActivity(messageData.sessionId)

        // Broadcast to ALL users in the session (including sender)
        io.to(`session-${messageData.sessionId}`).emit('chat-message', {
          id: message.id,
          content: message.content,
          createdAt: message.createdAt,
          user: {
            id: message.user.id,
            displayName: message.user.displayName
          }
        })

        socket.emit('message-sent', { messageId: message.id })

      } catch (error) {
        console.error('💬 Chat message error:', error)
        socket.emit('chat-error', { message: 'Failed to send message' })
      }
    })

    // Handle user disconnect
    socket.on('disconnect', async (reason) => {
      console.log(`❌ User disconnected: ${socket.userDisplayName} (${reason})`)
      
      if (socket.userId) {
        userSockets.delete(socket.userId)
        // Clear rate limiting data
        userLastUpdate.delete(`file-${socket.userId}`)
        userLastCursor.delete(`cursor-${socket.userId}`)
        userLastTyping.delete(`typing-${socket.userId}`)
      }
      
      if (socket.sessionId && socket.userId) {
        await handleUserLeave(socket, socket.sessionId)
      }
    })

    // Enhanced user leave cleanup
    async function handleUserLeave(socket: AuthenticatedSocket, sessionId: string) {
      try {
        if (activeSessions.has(sessionId)) {
          activeSessions.get(sessionId)!.delete(socket.userId!)
          if (activeSessions.get(sessionId)!.size === 0) {
            activeSessions.delete(sessionId)
            // Clean up file update queues when session becomes empty
            const sessionQueue = fileUpdateQueues.get(sessionId)
            if (sessionQueue) {
              sessionQueue.forEach(timeout => clearTimeout(timeout))
              fileUpdateQueues.delete(sessionId)
            }
          }
        }

        await prisma.sessionParticipant.updateMany({
          where: {
            userId: socket.userId!,
            sessionId: sessionId
          },
          data: { isActive: false }
        })

        const participantCount = activeSessions.get(sessionId)?.size || 0

        socket.to(`session-${sessionId}`).emit('user-left', {
          userId: socket.userId,
          userEmail: socket.userEmail,
          userDisplayName: socket.userDisplayName,
          sessionId: sessionId,
          timestamp: new Date(),
          participantCount
        })

        socket.to(`session-${sessionId}`).emit('participant-count-updated', {
          participantCount,
          sessionId
        })

        socket.leave(`session-${sessionId}`)
        socket.sessionId = undefined

      } catch (error) {
        console.error('User leave cleanup error:', error)
      }
    }
  })

  // Enhanced database operations
  async function saveFileToDatabase(fileId: string, content: string) {
    try {
      const result = await prisma.sessionFile.update({
        where: { id: fileId },
        data: { 
          content,
          size: content.length,
          updatedAt: new Date()
        }
      })
      console.log(`💾 File ${fileId} saved to database (${content.length} chars)`)
      return result
    } catch (error) {
      console.error(`❌ Database save error for file ${fileId}:`, error)
      throw error
    }
  }

  async function updateSessionActivity(sessionId: string) {
    try {
      await prisma.session.update({
        where: { id: sessionId },
        data: { lastActivity: new Date() }
      })
    } catch (error) {
      console.error('Session activity update error:', error)
    }
  }

  // Enhanced cleanup with comprehensive session management
  setInterval(async () => {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      
      // Find inactive sessions
      const inactiveSessions = await prisma.session.findMany({
        where: {
          lastActivity: { lt: oneHourAgo },
          isActive: true
        },
        select: { id: true, title: true }
      })

      if (inactiveSessions.length > 0) {
        // Mark sessions as inactive
        await prisma.session.updateMany({
          where: {
            id: { in: inactiveSessions.map(s => s.id) }
          },
          data: { isActive: false }
        })
        
        // Mark all participants as inactive
        await prisma.sessionParticipant.updateMany({
          where: {
            sessionId: { in: inactiveSessions.map(s => s.id) }
          },
          data: { isActive: false }
        })
        
        // Clean up memory and socket data
        inactiveSessions.forEach(session => {
          // Clean up active sessions tracking
          if (activeSessions.has(session.id)) {
            activeSessions.delete(session.id)
          }
          
          // Clean up file update queues
          const sessionQueue = fileUpdateQueues.get(session.id)
          if (sessionQueue) {
            sessionQueue.forEach(timeout => clearTimeout(timeout))
            fileUpdateQueues.delete(session.id)
          }
          
          // Notify any remaining users in the room
          const room = io.sockets.adapter.rooms.get(`session-${session.id}`)
          if (room && room.size > 0) {
            io.to(`session-${session.id}`).emit('session-ended', {
              sessionId: session.id,
              reason: 'Session ended due to inactivity',
              message: `Session "${session.title}" ended due to inactivity`
            })
            
            // Force disconnect users
            room.forEach((socketId) => {
              const socket = io.sockets.sockets.get(socketId)
              if (socket) {
                socket.emit('force-disconnect', {
                  reason: 'Session ended due to inactivity',
                  sessionId: session.id
                })
                socket.leave(`session-${session.id}`)
              }
            })
          }
        })
        
        console.log(`🧹 Cleaned up ${inactiveSessions.length} inactive sessions`)
      }

      // Clean up orphaned file update queues
      for (const [sessionId] of fileUpdateQueues.entries()) {
        if (!activeSessions.has(sessionId)) {
          const sessionQueue = fileUpdateQueues.get(sessionId)
          if (sessionQueue) {
            sessionQueue.forEach(timeout => clearTimeout(timeout))
            fileUpdateQueues.delete(sessionId)
          }
        }
      }

    } catch (error) {
      console.error('Session cleanup error:', error)
    }
  }, 10 * 60 * 1000) // Run every 10 minutes

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('🛑 Gracefully shutting down server...')
    
    try {
      // Notify all connected users
      io.emit('server-shutdown', {
        message: 'Server is shutting down for maintenance'
      })
      
      // Mark all sessions as inactive
      await prisma.sessionParticipant.updateMany({
        data: { isActive: false }
      })
      
      // Clean up all timeouts
      for (const [sessionId, sessionQueue] of fileUpdateQueues.entries()) {
        sessionQueue.forEach(timeout => clearTimeout(timeout))
      }
      
      console.log('✅ All sessions marked as inactive and timeouts cleared')
      
      // Close socket server
      io.close(() => {
        console.log('✅ Socket.IO server closed')
      })
      
      // Close HTTP server
      httpServer.close(() => {
        console.log('✅ HTTP server closed')
      })
      
    } catch (error) {
      console.error('Error during shutdown:', error)
    }
    
    await prisma.$disconnect()
    process.exit(0)
  })

  httpServer.listen(port, () => {
    console.log(`🚀 Server ready on http://${hostname}:${port}`)
    console.log(`📡 Socket.IO server with enhanced session management`)
    console.log(`🎯 Features enabled:`)
    console.log(`   • Real-time file collaboration`)
    console.log(`   • Session ending with participant removal`)
    console.log(`   • Enhanced participant management`)
    console.log(`   • Automatic cleanup and memory management`)
    console.log(`   • Force disconnect capabilities`)
    console.log(`   • Comprehensive error handling`)
  })
})
