import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server, Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { networkInterfaces } from 'os'

const prisma = new PrismaClient()

const dev = process.env.NODE_ENV !== 'production'
const hostname = '0.0.0.0' // Bind to all interfaces for LAN access
const port = 3000

// Get local IP address for display
function getLocalIPAddress() {
  const nets = networkInterfaces()
  const results = Object.create(null)
  
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]!) {
      if (net.family === 'IPv4' && !net.internal) {
        if (!results[name]) {
          results[name] = []
        }
        results[name].push(net.address)
      }
    }
  }
  return Object.values(results).flat()[0] || 'localhost'
}

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

interface CursorPositionData {
  userId: string
  userName: string
  fileId: string
  position: { lineNumber: number; column: number }
  selection?: { startLineNumber: number; startColumn: number; endLineNumber: number; endColumn: number }
  timestamp: number
  sessionId: string
}

interface FileData {
  name: string
  content?: string
  id?: string
  [key: string]: unknown
}

// Rate limiting and session tracking
const userLastUpdate = new Map<string, number>()
const userLastCursor = new Map<string, number>()
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

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    const parsedUrl = parse(req.url!, true)
    await handler(req, res, parsedUrl)
  })
  
  const io = new Server(httpServer, {
    path: '/api/socket',
    cors: {
      origin: dev ? ['http://localhost:3000', `http://${getLocalIPAddress()}:3000`] : process.env.NEXTAUTH_URL,
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling'],
    upgradeTimeout: 10000,
    pingTimeout: 20000,
    pingInterval: 10000,
    allowEIO3: true,
    maxHttpBufferSize: 1e8
  })

  // Authentication middleware
  io.use(async (socket: Socket, next) => {
    try {
      const authSocket = socket as AuthenticatedSocket
      const token = authSocket.handshake.auth.token || 
                   authSocket.handshake.headers.authorization?.replace('Bearer ', '')
      
      if (!token) {
        return next(new Error('Authentication token required'))
      }

      const payload = await verifyToken(token)
      if (!payload) {
        return next(new Error('Invalid authentication token'))
      }

      authSocket.userId = payload.userId
      authSocket.userEmail = payload.email
      authSocket.userDisplayName = payload.displayName
      console.log(`🔐 User authenticated: ${payload.displayName} (${payload.email})`)
      
      next()
    } catch (error) {
      console.error('Socket authentication error:', error)
      next(new Error('Authentication failed'))
    }
  })

  // Socket connection handling
  io.on('connection', (socket: Socket) => {
    const authSocket = socket as AuthenticatedSocket
    console.log(`✅ User connected: ${authSocket.userDisplayName} (${authSocket.id})`)
    
    if (authSocket.userId) {
      userSockets.set(authSocket.userId, authSocket.id)
    }

    authSocket.emit('connected', {
      message: 'Successfully connected to Socket.IO server',
      userId: authSocket.userId
    })

    // Join session handler
    authSocket.on('join-session', async (sessionId: string) => {
      try {
        console.log(`👤 User ${authSocket.userDisplayName} joining session ${sessionId}`)
        
        if (!sessionId) {
          authSocket.emit('error', { message: 'Session ID is required' })
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
          authSocket.emit('error', { message: 'Session not found' })
          return
        }

        if (!session.isActive) {
          authSocket.emit('error', { message: 'This session has ended and is no longer available' })
          return
        }

        const hasAccess = session.ownerId === authSocket.userId ||
          session.participants.some(p => p.userId === authSocket.userId) ||
          session.type === 'PUBLIC'

        if (!hasAccess && session.type === 'PRIVATE') {
          authSocket.emit('error', { message: 'Access denied to private session' })
          return
        }

        // Add/update participant
        const existingParticipant = session.participants.find(p => p.userId === authSocket.userId)
        if (!existingParticipant) {
          await prisma.sessionParticipant.create({
            data: {
              userId: authSocket.userId!,
              sessionId: sessionId,
              role: session.ownerId === authSocket.userId ? 'HOST' : 'COLLABORATOR',
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
        activeSessions.get(sessionId)!.add(authSocket.userId!)

        if (!fileUpdateQueues.has(sessionId)) {
          fileUpdateQueues.set(sessionId, new Map())
        }

        authSocket.sessionId = sessionId
        authSocket.join(`session-${sessionId}`)

        const participantCount = activeSessions.get(sessionId)!.size

        // Notify others
        authSocket.to(`session-${sessionId}`).emit('user-joined', {
          userId: authSocket.userId,
          userEmail: authSocket.userEmail,
          userDisplayName: authSocket.userDisplayName,
          socketId: authSocket.id,
          sessionId,
          timestamp: new Date(),
          participantCount
        })

        authSocket.emit('session-joined', {
          sessionId,
          message: 'Successfully joined session',
          participantCount
        })

        io.to(`session-${sessionId}`).emit('participant-count-updated', {
          participantCount,
          sessionId
        })

        console.log(`✅ User ${authSocket.userDisplayName} joined session ${sessionId}. Total: ${participantCount}`)

      } catch (error) {
        console.error('Join session error:', error)
        authSocket.emit('error', { message: 'Failed to join session' })
      }
    })

    // **FIXED** Enhanced cursor position handler with proper validation and throttling
    authSocket.on('cursor-position', (data: CursorPositionData) => {
      try {
        // Validate required data
        if (!data.userId || !data.userName || !data.fileId || !data.position || !data.sessionId) {
          console.error('❌ Invalid cursor data received:', data)
          return
        }

        // Validate position structure
        if (typeof data.position !== 'object' || 
            typeof data.position.lineNumber !== 'number' || 
            typeof data.position.column !== 'number') {
          console.error('❌ Invalid position data:', data.position)
          return
        }

        // Rate limiting for cursor updates (prevent spam)
        const userId = data.userId
        const now = Date.now()
        const lastUpdate = userLastCursor.get(`cursor-${userId}`) || 0
        
        // 50ms throttle for cursor position updates
        if (now - lastUpdate < 50) {
          return
        }
        userLastCursor.set(`cursor-${userId}`, now)

        console.log(`📍 Server: Broadcasting cursor from ${data.userName} at line ${data.position.lineNumber}, col ${data.position.column}`)
        
        // Broadcast to all OTHER users in the same session with validated data
        authSocket.to(`session-${data.sessionId}`).emit('cursor-position', {
          userId: data.userId,
          userName: data.userName,
          fileId: data.fileId,
          position: {
            lineNumber: Math.max(1, Math.floor(data.position.lineNumber)),
            column: Math.max(1, Math.floor(data.position.column))
          },
          selection: data.selection ? {
            startLineNumber: Math.max(1, Math.floor(data.selection.startLineNumber)),
            startColumn: Math.max(1, Math.floor(data.selection.startColumn)),
            endLineNumber: Math.max(1, Math.floor(data.selection.endLineNumber)),
            endColumn: Math.max(1, Math.floor(data.selection.endColumn))
          } : null,
          timestamp: data.timestamp || now
        })
        
      } catch (error) {
        console.error('❌ Cursor position handler error:', error)
      }
    })

    // Real-time file updates with immediate broadcasting
    authSocket.on('file-update', (data: { 
      fileId: string, 
      content: string, 
      sessionId: string, 
      timestamp: number 
    }) => {
      try {
        if (!authSocket.sessionId || authSocket.sessionId !== data.sessionId) {
          return
        }

        const { fileId, content, sessionId, timestamp } = data

        console.log(`📝 File update: ${fileId} from ${authSocket.userDisplayName} (${content.length} chars) at ${timestamp}`)
        
        // Immediate broadcast for real-time sync
        const broadcastData = {
          fileId,
          content,
          userId: authSocket.userId,
          timestamp,
          sessionId
        }
        
        // Broadcast immediately to all other participants
        authSocket.to(`session-${sessionId}`).emit('file-update', broadcastData)
        
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
        authSocket.emit('error', { message: 'Failed to sync file changes' })
      }
    })

    // File creation handler
    authSocket.on('file-created', (data: { sessionId: string, file: FileData }) => {
      if (authSocket.sessionId === data.sessionId) {
        console.log(`📁 New file created: ${data.file.name} in session ${data.sessionId}`)
        authSocket.to(`session-${data.sessionId}`).emit('file-created', data)
      }
    })

    // File deletion
    authSocket.on('file-deleted', (data: { sessionId: string, fileId: string }) => {
      if (authSocket.sessionId === data.sessionId) {
        console.log(`🗑️ File deleted: ${data.fileId} in session ${data.sessionId}`)
        authSocket.to(`session-${data.sessionId}`).emit('file-deleted', data)
        
        // Clean up any pending saves for deleted file
        const sessionQueue = fileUpdateQueues.get(data.sessionId)
        if (sessionQueue && sessionQueue.has(data.fileId)) {
          clearTimeout(sessionQueue.get(data.fileId)!)
          sessionQueue.delete(data.fileId)
        }
      }
    })

    // Chat message handler
    authSocket.on('chat-message', async (messageData: { 
      content: string, 
      sessionId: string, 
      timestamp?: number 
    }) => {
      try {
        if (!authSocket.sessionId || authSocket.sessionId !== messageData.sessionId) {
          authSocket.emit('chat-error', { message: 'Not in the specified session' })
          return
        }

        if (!messageData.content || !messageData.content.trim()) {
          authSocket.emit('chat-error', { message: 'Message cannot be empty' })
          return
        }

        console.log(`💬 Processing chat message from ${authSocket.userDisplayName}`)

        const message = await prisma.message.create({
          data: {
            content: messageData.content.trim(),
            userId: authSocket.userId!,
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

        authSocket.emit('message-sent', { messageId: message.id })

      } catch (error) {
        console.error('💬 Chat message error:', error)
        authSocket.emit('chat-error', { message: 'Failed to send message' })
      }
    })

    // Enhanced session ending
    authSocket.on('end-session-broadcast', async (data: { 
      sessionId: string, 
      reason: string, 
      hostName: string 
    }) => {
      try {
        if (!authSocket.sessionId || authSocket.sessionId !== data.sessionId) {
          return
        }

        // Verify the user is the session owner
        const session = await prisma.session.findUnique({
          where: { id: data.sessionId },
          select: { ownerId: true, title: true }
        })

        if (!session || session.ownerId !== authSocket.userId) {
          authSocket.emit('error', { message: 'Only the session owner can end the session' })
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

        // Broadcast to ALL users in the session
        io.to(`session-${data.sessionId}`).emit('session-ended', {
          sessionId: data.sessionId,
          reason: data.reason,
          hostName: data.hostName,
          message: `Session "${session.title}" has been ended by ${data.hostName}`
        })

        // Clean up
        setTimeout(() => {
          if (activeSessions.has(data.sessionId)) {
            activeSessions.delete(data.sessionId)
          }
          
          const sessionQueue = fileUpdateQueues.get(data.sessionId)
          if (sessionQueue) {
            sessionQueue.forEach(timeout => clearTimeout(timeout))
            fileUpdateQueues.delete(data.sessionId)
          }
          
          console.log(`✅ Session ${data.sessionId} completely cleaned up`)
        }, 1000)

      } catch (error) {
        console.error('End session broadcast error:', error)
        authSocket.emit('error', { message: 'Failed to end session' })
      }
    })

    // Enhanced participant removal
    authSocket.on('remove-participant', async (data: { 
      sessionId: string, 
      participantId: string, 
      reason?: string 
    }) => {
      try {
        if (!authSocket.sessionId || authSocket.sessionId !== data.sessionId) {
          authSocket.emit('error', { message: 'Not in the specified session' })
          return
        }

        const session = await prisma.session.findUnique({
          where: { id: data.sessionId },
          select: { ownerId: true }
        })

        if (!session || session.ownerId !== authSocket.userId) {
          authSocket.emit('error', { message: 'Only the host can remove participants' })
          return
        }

        if (data.participantId === authSocket.userId) {
          authSocket.emit('error', { message: 'Host cannot remove themselves' })
          return
        }

        console.log(`🚫 Host ${authSocket.userDisplayName} removing participant ${data.participantId}`)

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
              hostName: authSocket.userDisplayName
            })
            
            // Force them to leave the room
            participantSocket.leave(`session-${data.sessionId}`)
            
            // Clear session ID
            if ('sessionId' in participantSocket) {
              (participantSocket as AuthenticatedSocket).sessionId = undefined
            }
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
        authSocket.emit('error', { message: 'Failed to remove participant' })
      }
    })

    // Disconnect handler
    authSocket.on('disconnect', async (reason: string) => {
      console.log(`❌ User disconnected: ${authSocket.userDisplayName} (${reason})`)
      
      if (authSocket.userId) {
        userSockets.delete(authSocket.userId)
        // Clear rate limiting data
        userLastUpdate.delete(`file-${authSocket.userId}`)
        userLastCursor.delete(`cursor-${authSocket.userId}`)
      }
      
      if (authSocket.sessionId && authSocket.userId) {
        await handleUserLeave(authSocket, authSocket.sessionId)
      }
    })

    // Enhanced user leave cleanup
    async function handleUserLeave(socket: AuthenticatedSocket, sessionIdParam: string) {
      try {
        if (activeSessions.has(sessionIdParam)) {
          activeSessions.get(sessionIdParam)!.delete(socket.userId!)
          if (activeSessions.get(sessionIdParam)!.size === 0) {
            activeSessions.delete(sessionIdParam)
            // Clean up file update queues when session becomes empty
            const sessionQueue = fileUpdateQueues.get(sessionIdParam)
            if (sessionQueue) {
              sessionQueue.forEach(timeout => clearTimeout(timeout))
              fileUpdateQueues.delete(sessionIdParam)
            }
          }
        }

        await prisma.sessionParticipant.updateMany({
          where: {
            userId: socket.userId!,
            sessionId: sessionIdParam
          },
          data: { isActive: false }
        })

        const participantCount = activeSessions.get(sessionIdParam)?.size || 0

        socket.to(`session-${sessionIdParam}`).emit('user-left', {
          userId: socket.userId,
          userEmail: socket.userEmail,
          userDisplayName: socket.userDisplayName,
          sessionId: sessionIdParam,
          timestamp: new Date(),
          participantCount
        })

        socket.to(`session-${sessionIdParam}`).emit('participant-count-updated', {
          participantCount,
          sessionId: sessionIdParam
        })

        socket.leave(`session-${sessionIdParam}`)
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
      for (const [, sessionQueue] of fileUpdateQueues.entries()) {
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

  const localIP = getLocalIPAddress()
  httpServer.listen(port, hostname, () => {
    console.log(`🚀 Server ready on:`)
    console.log(`   Local:    http://localhost:${port}`)
    console.log(`   Network:  http://${localIP}:${port}`)
    console.log(`   All:      http://${hostname}:${port}`)
  })
})
