// 'use client'

// import { useEffect, useState, useRef } from 'react'
// import { io, Socket } from 'socket.io-client'
// import { useAuth } from '@/contexts/auth-context'

// export function useSocket() {
//   const [socket, setSocket] = useState<Socket | null>(null)
//   const [connected, setConnected] = useState(false)
//   const [connecting, setConnecting] = useState(false)
//   const { user } = useAuth()
//   const socketRef = useRef<Socket | null>(null)
//   const reconnectTimeoutRef = useRef<NodeJS.Timeout>()

//   useEffect(() => {
//     if (!user) {
//       console.log('❌ No user, cannot establish socket connection')
//       return
//     }

//     const token = localStorage.getItem('accessToken')
//     if (!token) {
//       console.log('❌ No access token available')
//       return
//     }

//     // Cleanup existing connection
//     if (socketRef.current) {
//       console.log('🧹 Cleaning up existing socket connection')
//       socketRef.current.disconnect()
//     }

//     console.log('🔌 Establishing Socket.IO connection for user:', user.displayName)
//     setConnecting(true)

//     const socketInstance = io('http://localhost:3000', {
//       path: '/api/socket',
//       auth: { token },
//       transports: ['polling', 'websocket'],
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//       timeout: 20000,
//       forceNew: true
//     })

//     socketInstance.on('connect', () => {
//       console.log('✅ Socket connected:', socketInstance.id)
//       setConnected(true)
//       setConnecting(false)
      
//       // Clear any pending reconnection timeout
//       if (reconnectTimeoutRef.current) {
//         clearTimeout(reconnectTimeoutRef.current)
//       }
//     })

//     socketInstance.on('connected', (data) => {
//       console.log('🎉 Server confirmed connection:', data)
//     })

//     socketInstance.on('connect_error', (error) => {
//       console.error('❌ Socket connection error:', error.message)
//       setConnected(false)
//       setConnecting(false)
      
//       // Implement exponential backoff for reconnection
//       reconnectTimeoutRef.current = setTimeout(() => {
//         if (!socketInstance.connected) {
//           console.log('🔄 Attempting to reconnect...')
//           socketInstance.connect()
//         }
//       }, 5000)
//     })

//     socketInstance.on('disconnect', (reason) => {
//       console.log('🔌 Socket disconnected:', reason)
//       setConnected(false)
//       setConnecting(false)
//     })

//     socketInstance.on('error', (error) => {
//       console.error('❌ Socket error:', error)
//     })

//     socketRef.current = socketInstance
//     setSocket(socketInstance)

//     return () => {
//       console.log('🧹 Cleaning up socket connection')
      
//       if (reconnectTimeoutRef.current) {
//         clearTimeout(reconnectTimeoutRef.current)
//       }
      
//       if (socketRef.current) {
//         socketRef.current.disconnect()
//       }
      
//       setSocket(null)
//       setConnected(false)
//       setConnecting(false)
//     }
//   }, [user])

//   return { socket, connected, connecting }
// }


// src/hooks/useSocket.ts
'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '@/contexts/auth-context'

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const { user, refreshToken } = useAuth()
  const socketRef = useRef<Socket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const reconnectAttempts = useRef(0)

  const connectSocket = useCallback(async () => {
    if (!user) {
      console.log('❌ No user, cannot establish socket connection')
      return
    }

    let token = localStorage.getItem('accessToken')

    // Attempt to refresh the token if it's missing
    if (!token) {
      const refreshed = await refreshToken()
      if (refreshed) {
        token = localStorage.getItem('accessToken')
      } else {
        console.log('❌ No access token available and refresh failed')
        return
      }
    }

    // Cleanup existing connection
    if (socketRef.current) {
      console.log('🧹 Cleaning up existing socket connection')
      socketRef.current.disconnect()
    }

    console.log('🔌 Establishing Socket.IO connection for user:', user.displayName)
    setConnecting(true)

    const socketInstance = io('http://localhost:3000', {
      path: '/api/socket',
      auth: { token },
      transports: ['polling', 'websocket'],
      reconnection: false, // We'll handle reconnection manually
      timeout: 20000,
      forceNew: true
    })

    socketInstance.on('connect', () => {
      console.log('✅ Socket connected:', socketInstance.id)
      setConnected(true)
      setConnecting(false)
      reconnectAttempts.current = 0 // Reset reconnect attempts on successful connection
      
      // Clear any pending reconnection timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    })

    socketInstance.on('connect_error', async (error) => {
      console.error('❌ Socket connection error:', error.message)
      setConnected(false)
      setConnecting(false)

      if (error.message === 'Invalid authentication token' && reconnectAttempts.current < 1) {
        reconnectAttempts.current++
        const refreshed = await refreshToken()
        if (refreshed) {
          connectSocket()
          return
        }
      }

      // Implement exponential backoff for reconnection
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000) // Max 30 seconds
      reconnectAttempts.current++
      
      reconnectTimeoutRef.current = setTimeout(() => {
        if (!socketInstance.connected) {
          console.log('🔄 Attempting to reconnect...')
          socketInstance.connect()
        }
      }, delay)
    })

    socketInstance.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason)
      setConnected(false)
      setConnecting(false)
    })

    socketInstance.on('error', (error) => {
      console.error('❌ Socket error:', error)
    })

    socketRef.current = socketInstance
    setSocket(socketInstance)
  }, [user, refreshToken])

  useEffect(() => {
    if (user) {
      connectSocket()
    }

    return () => {
      console.log('🧹 Cleaning up socket connection')
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
      
      setSocket(null)
      setConnected(false)
      setConnecting(false)
    }
  }, [user, connectSocket])

  return { socket, connected, connecting }
}