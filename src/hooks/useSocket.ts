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

//   useEffect(() => {
//     if (!user) {
//       console.log('No user, skipping socket connection')
//       return
//     }

//     const token = localStorage.getItem('accessToken')
//     if (!token) {
//       console.log('No token, skipping socket connection')
//       return
//     }

//     // Cleanup existing connection
//     if (socketRef.current) {
//       console.log('Cleaning up existing socket connection')
//       socketRef.current.disconnect()
//     }

//     console.log('🔌 Initializing Socket.IO connection...')
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
//       console.log('✅ Connected to Socket.IO server:', socketInstance.id)
//       setConnected(true)
//       setConnecting(false)
//     })

//     socketInstance.on('connected', (data) => {
//       console.log('🎉 Server confirmed connection:', data)
//     })

//     socketInstance.on('connect_error', (error) => {
//       console.error('❌ Socket connection error:', error.message)
//       setConnected(false)
//       setConnecting(false)
//     })

//     socketInstance.on('disconnect', (reason) => {
//       console.log('🔌 Disconnected from Socket.IO server:', reason)
//       setConnected(false)
//       setConnecting(false)
//     })

//     socketInstance.on('error', (error) => {
//       console.error('Socket error:', error)
//     })

//     socketRef.current = socketInstance
//     setSocket(socketInstance)

//     return () => {
//       console.log('🧹 Cleaning up socket connection')
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

'use client'

import { useEffect, useState, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '@/contexts/auth-context'

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const { user } = useAuth()
  const socketRef = useRef<Socket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (!user) {
      console.log('❌ No user, cannot establish socket connection')
      return
    }

    const token = localStorage.getItem('accessToken')
    if (!token) {
      console.log('❌ No access token available')
      return
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
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      forceNew: true
    })

    socketInstance.on('connect', () => {
      console.log('✅ Socket connected:', socketInstance.id)
      setConnected(true)
      setConnecting(false)
      
      // Clear any pending reconnection timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    })

    socketInstance.on('connected', (data) => {
      console.log('🎉 Server confirmed connection:', data)
    })

    socketInstance.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message)
      setConnected(false)
      setConnecting(false)
      
      // Implement exponential backoff for reconnection
      reconnectTimeoutRef.current = setTimeout(() => {
        if (!socketInstance.connected) {
          console.log('🔄 Attempting to reconnect...')
          socketInstance.connect()
        }
      }, 5000)
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
  }, [user])

  return { socket, connected, connecting }
}
