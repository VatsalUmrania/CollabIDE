

// 'use client'

// import { useEffect, useState, useRef, useCallback } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import { useAuth } from '@/contexts/auth-context'
// import { useSocket } from '@/hooks/useSocket'
// import { Editor } from '@monaco-editor/react'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Badge } from '@/components/ui/badge'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { 
//   Users, 
//   MessageSquare, 
//   Download, 
//   Share2,
//   ArrowLeft,
//   Save,
//   Play,
//   Plus,
//   X,
//   FileText,
//   Terminal,
//   UserPlus,
//   Crown,
//   Send,
//   RefreshCw,
//   CheckCircle,
//   AlertCircle,
//   Clock,
//   Wifi,
//   WifiOff,
//   Copy,
//   Eye,
//   EyeOff,
//   MoreVertical,
//   UserMinus,
//   Mail,
//   File,
//   Code2,
//   Settings,
//   StopCircle,
//   LogOut,
//   Trash2,
//   Loader2,
//   XCircle
// } from 'lucide-react'
// import JSZip from 'jszip'

// // Interface definitions
// interface Participant {
//   id: string
//   user: {
//     id: string
//     displayName: string
//     email: string
//   }
//   role: 'HOST' | 'COLLABORATOR'
//   isActive: boolean
//   joinedAt: string
// }

// interface Message {
//   id: string
//   content: string
//   createdAt: string
//   user: {
//     id: string
//     displayName: string
//   }
// }

// interface OnlineUser {
//   userId: string
//   userEmail: string
//   displayName: string
//   socketId: string
//   joinedAt: Date
//   isOnline: boolean
// }

// interface CursorPosition {
//   userId: string
//   userDisplayName: string
//   position: { lineNumber: number; column: number }
//   selection?: { startLineNumber: number; startColumn: number; endLineNumber: number; endColumn: number }
//   color: string
//   fileId: string
// }

// interface FileData {
//   id: string
//   name: string
//   language: string
//   content: string
//   createdAt: string
//   updatedAt: string
//   createdBy: string
// }

// interface ExecutionResult {
//   output: string
//   error?: string
//   executionTime: number
//   language: string
// }

// interface SessionData {
//   id: string
//   title: string
//   description?: string
//   type: 'PUBLIC' | 'PRIVATE'
//   isActive: boolean
//   files: FileData[]
//   participants: Participant[]
//   messages: Message[]
//   owner: {
//     id: string
//     displayName: string
//     email: string
//   }
//   _count: {
//     participants: number
//     files: number
//   }
//   createdAt: string
// }

// export default function SessionPage() {
//   const params = useParams()
//   const router = useRouter()
//   const { user } = useAuth()
//   const { socket, connected, connecting } = useSocket()
  
//   // Session state
//   const [sessionJoined, setSessionJoined] = useState(false)
//   const [sessionId] = useState(params.id as string)
//   const [session, setSession] = useState<SessionData | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [participantCount, setParticipantCount] = useState(1)
//   const [connectionStatus, setConnectionStatus] = useState('Connecting...')
//   const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'offline'>('synced')
//   const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)
  
//   // File and editor state
//   const [files, setFiles] = useState<FileData[]>([])
//   const [activeFileId, setActiveFileId] = useState<string | null>(null)
//   const [cursors, setCursors] = useState<{ [key: string]: CursorPosition }>({})
//   const [showNewFileModal, setShowNewFileModal] = useState(false)
//   const [newFileName, setNewFileName] = useState('')
//   const [newFileLanguage, setNewFileLanguage] = useState('javascript')
//   const [fileCreationLoading, setFileCreationLoading] = useState(false)
  
//   // Code execution state
//   const [isExecuting, setIsExecuting] = useState(false)
//   const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null)
//   const [showOutput, setShowOutput] = useState(false)
  
//   // UI state
//   const [isPreviewVisible, setIsPreviewVisible] = useState(false)
//   const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
//   const [messages, setMessages] = useState<Message[]>([])
//   const [newMessage, setNewMessage] = useState('')
//   const [chatError, setChatError] = useState('')
//   const [isSendingMessage, setIsSendingMessage] = useState(false)
  
//   // Host controls
//   const [showParticipantMenu, setShowParticipantMenu] = useState<string | null>(null)
//   const [showInviteModal, setShowInviteModal] = useState(false)
//   const [showEndSessionModal, setShowEndSessionModal] = useState(false)
//   const [showSessionEndedModal, setShowSessionEndedModal] = useState(false)
//   const [sessionEndedReason, setSessionEndedReason] = useState('')
//   const [inviteEmail, setInviteEmail] = useState('')
//   const [inviteLoading, setInviteLoading] = useState(false)
//   const [endSessionLoading, setEndSessionLoading] = useState(false)
  
//   // Refs for sync management
//   const editorRef = useRef<any>(null)
//   const monacoRef = useRef<any>(null)
//   const decorationsRef = useRef<string[]>([])
//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const lastCodeChangeRef = useRef<{ [key: string]: string }>({})
//   const chatInputRef = useRef<HTMLInputElement>(null)
//   const messageIdRef = useRef<Set<string>>(new Set())
//   const isRemoteUpdateRef = useRef<{ [key: string]: boolean }>({})
//   const syncTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({})

//   // Check if current user is host
//   const isHost = session?.owner?.id === user?.id

//   // Get active file
//   const activeFile = files.find(file => file.id === activeFileId)

//   // User colors for cursors
//   const userColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8']
//   const getUserColor = useCallback((userId: string) => {
//     const hash = userId.split('').reduce((a, b) => {
//       a = ((a << 5) - a) + b.charCodeAt(0)
//       return a & a
//     }, 0)
//     return userColors[Math.abs(hash) % userColors.length]
//   }, [])

//   // Language configurations
//   const languageConfigs = {
//     javascript: {
//       name: 'JavaScript',
//       extension: 'js',
//       icon: '🟨',
//       executable: true,
//       defaultContent: `// JavaScript Code
// console.log('Hello, CollabIDE!');

// function greet(name) {
//     return \`Hello, \${name}!\`;
// }

// const result = greet('World');
// console.log(result);

// // Example: Simple calculation
// const numbers = [1, 2, 3, 4, 5];
// const sum = numbers.reduce((acc, num) => acc + num, 0);
// console.log('Sum:', sum);`
//     },
//     python: {
//       name: 'Python',
//       extension: 'py',
//       icon: '🐍',
//       executable: true,
//       defaultContent: `# Python Code
// print('Hello, CollabIDE!')

// def greet(name):
//     return f"Hello, {name}!"

// def fibonacci(n):
//     if n <= 1:
//         return n
//     return fibonacci(n - 1) + fibonacci(n - 2)

// # Example usage
// print(greet('World'))

// # Calculate fibonacci numbers
// for i in range(8):
//     print(f"Fibonacci({i}) = {fibonacci(i)}")

// # Simple list operations
// numbers = [1, 2, 3, 4, 5]
// print(f"Sum: {sum(numbers)}")
// print(f"Average: {sum(numbers) / len(numbers)}")`
//     },
//     cpp: {
//       name: 'C++',
//       extension: 'cpp',
//       icon: '🔵',
//       executable: true,
//       defaultContent: `#include <iostream>
// #include <vector>
// #include <string>

// using namespace std;

// string greet(const string& name) {
//     return "Hello, " + name + "!";
// }

// int fibonacci(int n) {
//     if (n <= 1) return n;
//     return fibonacci(n - 1) + fibonacci(n - 2);
// }

// int main() {
//     cout << "Hello, CollabIDE!" << endl;
//     cout << greet("World") << endl;
    
//     // Example: Fibonacci sequence
//     cout << "Fibonacci sequence:" << endl;
//     for (int i = 0; i < 8; i++) {
//         cout << "F(" << i << ") = " << fibonacci(i) << endl;
//     }
    
//     // Example: Vector operations
//     vector<int> numbers = {1, 2, 3, 4, 5};
//     int sum = 0;
//     for (int num : numbers) {
//         sum += num;
//     }
//     cout << "Sum: " << sum << endl;
    
//     return 0;
// }`
//     },
//     html: {
//       name: 'HTML',
//       extension: 'html',
//       icon: '🌐',
//       executable: false,
//       defaultContent: `<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>CollabIDE Project</title>
//     <style>
//         body { font-family: Arial, sans-serif; margin: 40px; }
//         .container { max-width: 800px; margin: 0 auto; }
//         h1 { color: #333; }
//         .highlight { background: #f0f8ff; padding: 20px; border-radius: 8px; }
//     </style>
// </head>
// <body>
//     <div class="container">
//         <h1>Welcome to CollabIDE!</h1>
//         <div class="highlight">
//             <p>This is a collaborative code editor where you can work together in real-time.</p>
//             <p>Start editing this HTML file or create new files to begin coding!</p>
//         </div>
//     </div>
// </body>
// </html>`
//     },
//     css: {
//       name: 'CSS',
//       extension: 'css',
//       icon: '🎨',
//       executable: false,
//       defaultContent: `/* CSS Styles for CollabIDE Project */

// * {
//     margin: 0;
//     padding: 0;
//     box-sizing: border-box;
// }

// body {
//     font-family: 'Arial', sans-serif;
//     line-height: 1.6;
//     color: #333;
//     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//     min-height: 100vh;
// }

// .container {
//     max-width: 1200px;
//     margin: 0 auto;
//     padding: 20px;
// }

// .card {
//     background: white;
//     border-radius: 10px;
//     padding: 30px;
//     box-shadow: 0 10px 30px rgba(0,0,0,0.1);
//     margin: 20px 0;
// }

// .btn {
//     background: #667eea;
//     color: white;
//     padding: 12px 24px;
//     border: none;
//     border-radius: 6px;
//     cursor: pointer;
//     transition: all 0.3s ease;
// }

// .btn:hover {
//     background: #764ba2;
//     transform: translateY(-2px);
// }`
//     }
//   }

//   // Scroll to bottom of messages
//   const scrollToBottom = useCallback(() => {
//     setTimeout(() => {
//       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//     }, 100)
//   }, [])

//   useEffect(() => {
//     scrollToBottom()
//   }, [messages, scrollToBottom])

//   // Handle active file switching when files change
//   useEffect(() => {
//     if (files.length > 0 && !activeFileId) {
//       setActiveFileId(files[0].id)
//     } else if (files.length > 0 && activeFileId && !files.some(f => f.id === activeFileId)) {
//       setActiveFileId(files[0].id)
//     }
//   }, [files, activeFileId])

//   // Fetch session data
//   const fetchSessionData = async () => {
//     try {
//       const token = localStorage.getItem('accessToken')
//       const response = await fetch(`/api/sessions/${sessionId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       })
      
//       if (response.ok) {
//         const data = await response.json()
//         console.log('📄 Session data loaded:', data.session)
//         setSession(data.session)
        
//         // Load files
//         if (data.session.files) {
//           console.log('📁 Loading files:', data.session.files.length)
//           setFiles(data.session.files)
          
//           // Set first file as active if none selected
//           if (!activeFileId && data.session.files.length > 0) {
//             setActiveFileId(data.session.files[0].id)
//             console.log('🎯 Set active file:', data.session.files[0].name)
//           }
//         } else if (data.session.files?.length === 0 && isHost) {
//           // Create default file for host if no files exist
//           createDefaultFile()
//         }
        
//         setParticipantCount(data.session._count?.participants || 1)
        
//         if (data.session.messages) {
//           const newMessages = data.session.messages.filter((msg: Message) => 
//             !messageIdRef.current.has(msg.id)
//           )
//           newMessages.forEach((msg: Message) => messageIdRef.current.add(msg.id))
//           setMessages(newMessages)
//         }
        
//         // Initialize lastCodeChangeRef for all files
//         data.session.files?.forEach((file: FileData) => {
//           lastCodeChangeRef.current[file.id] = file.content
//         })
//       } else {
//         const errorData = await response.json()
//         throw new Error(errorData.error || 'Failed to fetch session data')
//       }
//     } catch (error) {
//       console.error('❌ Error fetching session:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Create default file if none exists
//   const createDefaultFile = async () => {
//     if (!user || !sessionId) return

//     try {
//       const token = localStorage.getItem('accessToken')
//       const response = await fetch('/api/sessions/files', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           sessionId,
//           name: 'main.js',
//           language: 'javascript',
//           content: languageConfigs.javascript.defaultContent
//         })
//       })

//       if (response.ok) {
//         const data = await response.json()
//         const newFile = data.file
//         setFiles([newFile])
//         setActiveFileId(newFile.id)
//         lastCodeChangeRef.current[newFile.id] = newFile.content
//         console.log('✅ Default file created:', newFile.name)
//       }
//     } catch (error) {
//       console.error('❌ Failed to create default file:', error)
//     }
//   }

//   // Socket event handlers - FIXED to prevent infinite loops
//   useEffect(() => {
//     if (!socket || !connected || !sessionId || !user?.id) {
//       if (socket && !connected) {
//         setConnectionStatus('Connecting to server...')
//         setSyncStatus('offline')
//       }
//       return
//     }

//     console.log('🎯 Setting up socket listeners for session:', sessionId)
//     setConnectionStatus('Joining session...')

//     // Join session
//     socket.emit('join-session', sessionId)

//     // Session events
//     socket.on('session-joined', (data) => {
//       console.log('✅ Successfully joined session:', data)
//       setSessionJoined(true)
//       setParticipantCount(data.participantCount || 1)
//       setConnectionStatus('Connected')
//       setSyncStatus('synced')
//       fetchSessionData()
//     })

//     socket.on('user-joined', (data) => {
//       console.log('👤 User joined session:', data)
      
//       if (data.participantCount !== undefined) {
//         setParticipantCount(data.participantCount)
//       }
      
//       const newUser: OnlineUser = {
//         userId: data.userId,
//         userEmail: data.userEmail,
//         displayName: data.userDisplayName || data.userEmail?.split('@')[0] || 'Anonymous',
//         socketId: data.socketId || socket.id!,
//         joinedAt: new Date(data.timestamp),
//         isOnline: true
//       }
      
//       setOnlineUsers(prev => {
//         const filtered = prev.filter(u => u.userId !== data.userId)
//         return [...filtered, newUser]
//       })
//     })

//     socket.on('user-left', (data) => {
//       console.log('👋 User left session:', data)
      
//       if (data.participantCount !== undefined) {
//         setParticipantCount(data.participantCount)
//       }
      
//       setOnlineUsers(prev => prev.filter(u => u.userId !== data.userId))
      
//       setCursors(prev => {
//         const newCursors = { ...prev }
//         Object.keys(newCursors).forEach(key => {
//           if (key.startsWith(data.userId)) {
//             delete newCursors[key]
//           }
//         })
//         return newCursors
//       })
//     })

//     // File update events
//     socket.on('file-update', (data) => {
//       if (data.userId === user.id) return

//       console.log('📥 Remote file update received:', {
//         fileId: data.fileId,
//         contentLength: data.content?.length,
//         fromUser: data.userId,
//         timestamp: data.timestamp
//       })
      
//       isRemoteUpdateRef.current[data.fileId] = true
      
//       setFiles(prev => prev.map(file => 
//         file.id === data.fileId ? { ...file, content: data.content } : file
//       ))
      
//       lastCodeChangeRef.current[data.fileId] = data.content
      
//       // Update editor if this is the active file
//       const currentActiveFileId = activeFileId // Capture current value
//       if (data.fileId === currentActiveFileId && editorRef.current) {
//         const currentValue = editorRef.current.getValue()
//         if (currentValue !== data.content) {
//           console.log('🔄 Updating Monaco editor for file', data.fileId)
//           const position = editorRef.current.getPosition()
//           editorRef.current.setValue(data.content)
//           if (position) {
//             editorRef.current.setPosition(position)
//           }
//         }
//       }
      
//       setTimeout(() => {
//         isRemoteUpdateRef.current[data.fileId] = false
//       }, 100)
//     })

//     // File creation events
//     socket.on('file-created', (data: { file: FileData }) => {
//       console.log('📁 New file created by another user:', data.file.name)
      
//       setFiles(prev => {
//         const exists = prev.some(f => f.id === data.file.id)
//         if (!exists) {
//           const newFiles = [...prev, data.file]
//           console.log('📁 Added file to list. Total files:', newFiles.length)
//           return newFiles
//         }
//         return prev
//       })
//     })

//     // File deletion events
//     socket.on('file-deleted', (data: { fileId: string }) => {
//       console.log('🗑️ File deleted by another user:', data.fileId)
      
//       setFiles(prev => prev.filter(f => f.id !== data.fileId))
      
//       // Handle active file switching
//       setActiveFileId(prevActiveId => {
//         if (data.fileId === prevActiveId) {
//           return null // Will be handled by useEffect
//         }
//         return prevActiveId
//       })
//     })

//     // Session ended event
//     socket.on('session-ended', (data) => {
//       console.log('🛑 Session ended by host:', data)
      
//       setShowSessionEndedModal(true)
//       setSessionEndedReason(data.reason || 'The host has ended this session')
      
//       // Automatically redirect after a delay
//       setTimeout(() => {
//         router.push('/dashboard')
//       }, 3000)
//     })

//     // Handle being kicked out by host
//     socket.on('participant-kicked', (data) => {
//       console.log('🚫 You were removed from the session:', data)
//       alert(`You have been removed from this session by the host: ${data.reason || 'No reason provided'}`)
//       router.push('/dashboard')
//     })

//     // Handle force disconnect
//     socket.on('force-disconnect', (data) => {
//       console.log('⚠️ Force disconnected:', data)
//       router.push('/dashboard')
//     })

//     // Chat events
//     socket.on('chat-message', (message) => {
//       console.log('💬 New chat message received:', message)
//       setChatError('')
      
//       if (!messageIdRef.current.has(message.id)) {
//         messageIdRef.current.add(message.id)
//         setMessages(prev => [...prev, message])
//       }
//     })

//     socket.on('chat-error', (error) => {
//       console.error('💬 Chat error:', error)
//       setChatError(error.message || 'Failed to send message')
//       setIsSendingMessage(false)
//     })

//     socket.on('message-sent', (data) => {
//       setIsSendingMessage(false)
//     })

//     socket.on('connect', () => {
//       setSyncStatus('synced')
//       setConnectionStatus('Connected')
//     })

//     socket.on('disconnect', () => {
//       setSyncStatus('offline')
//       setConnectionStatus('Disconnected')
//     })

//     socket.on('error', (error) => {
//       console.error('❌ Socket error:', error)
//       setSyncStatus('error')
//     })

//     // Cleanup function
//     return () => {
//       console.log('🧹 Cleaning up socket listeners')
//       socket.off('session-joined')
//       socket.off('user-joined')
//       socket.off('user-left')
//       socket.off('file-update')
//       socket.off('file-created')
//       socket.off('file-deleted')
//       socket.off('session-ended')
//       socket.off('participant-kicked')
//       socket.off('force-disconnect')
//       socket.off('chat-message')
//       socket.off('chat-error')
//       socket.off('message-sent')
//       socket.off('connect')
//       socket.off('disconnect')
//       socket.off('error')
//     }
//   }, [socket, connected, sessionId, user?.id, router]) // REMOVED problematic dependencies

//   // Handle file editor changes
//   const handleEditorChange = useCallback((value: string | undefined) => {
//     if (!value || !socket || !connected || !activeFileId) return
    
//     // Skip if this is a remote update
//     if (isRemoteUpdateRef.current[activeFileId]) {
//       return
//     }
    
//     // Update local file immediately
//     setFiles(prev => prev.map(file => 
//       file.id === activeFileId ? { ...file, content: value } : file
//     ))
    
//     // Only broadcast if the change is different from last known state
//     if (lastCodeChangeRef.current[activeFileId] !== value) {
//       lastCodeChangeRef.current[activeFileId] = value
//       setSyncStatus('syncing')
      
//       // Clear existing timeout
//       if (syncTimeoutRef.current[activeFileId]) {
//         clearTimeout(syncTimeoutRef.current[activeFileId])
//       }
      
//       // Fast debounce for real-time feel
//       syncTimeoutRef.current[activeFileId] = setTimeout(() => {
//         if (socket && connected && lastCodeChangeRef.current[activeFileId] === value) {
//           console.log(`🚀 Broadcasting file change for ${activeFileId}`)
//           socket.emit('file-update', {
//             fileId: activeFileId,
//             content: value,
//             sessionId,
//             timestamp: Date.now()
//           })
//           setSyncStatus('synced')
//           setLastSyncTime(new Date())
//         }
//       }, 200)
//     }
//   }, [socket, connected, sessionId, activeFileId])

//   // Handle editor mount
//   const handleEditorDidMount = (editor: any, monaco: any) => {
//     editorRef.current = editor
//     monacoRef.current = monaco
    
//     editor.updateOptions({
//       fontSize: 14,
//       minimap: { enabled: false },
//       scrollBeyondLastLine: false,
//       wordWrap: 'on',
//       automaticLayout: true,
//       theme: 'vs-dark',
//       tabSize: 2,
//       insertSpaces: true,
//       cursorBlinking: 'smooth',
//       cursorSmoothCaretAnimation: 'on',
//       smoothScrolling: true
//     })

//     // Set initial value if we have an active file
//     if (activeFile) {
//       editor.setValue(activeFile.content)
//     }
//   }

//   // Create new file
//   const createNewFile = async () => {
//     if (!newFileName.trim() || !socket || !connected) {
//       return
//     }
    
//     // Check for duplicate names
//     if (files.some(f => f.name.toLowerCase() === newFileName.toLowerCase())) {
//       alert('A file with this name already exists!')
//       return
//     }
    
//     setFileCreationLoading(true)
    
//     try {
//       const token = localStorage.getItem('accessToken')
//       const config = languageConfigs[newFileLanguage as keyof typeof languageConfigs]
      
//       const response = await fetch('/api/sessions/files', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           sessionId,
//           name: newFileName.trim(),
//           language: newFileLanguage,
//           content: config?.defaultContent || `// New ${newFileLanguage} file\nconsole.log('Hello World!');`
//         })
//       })
      
//       if (response.ok) {
//         const data = await response.json()
//         const newFile = data.file
        
//         console.log('✅ File created successfully:', newFile)
        
//         // Update local state
//         setFiles(prev => [...prev, newFile])
//         setActiveFileId(newFile.id)
//         lastCodeChangeRef.current[newFile.id] = newFile.content
        
//         // Clear form
//         setNewFileName('')
//         setNewFileLanguage('javascript')
//         setShowNewFileModal(false)
        
//         // Broadcast to other users
//         if (socket && connected) {
//           socket.emit('file-created', {
//             sessionId,
//             file: newFile
//           })
//         }
        
//       } else {
//         const error = await response.json()
//         alert(error.error || 'Failed to create file')
//       }
//     } catch (error) {
//       console.error('Failed to create file:', error)
//       alert('Failed to create file. Please try again.')
//     } finally {
//       setFileCreationLoading(false)
//     }
//   }

//   // Delete file
//   const deleteFile = async (fileId: string) => {
//     if (!isHost) return
    
//     if (files.length === 1) {
//       alert('Cannot delete the last file in the session')
//       return
//     }
    
//     if (!confirm('Are you sure you want to delete this file?')) return
    
//     try {
//       const token = localStorage.getItem('accessToken')
//       const response = await fetch(`/api/sessions/files/${fileId}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` }
//       })
      
//       if (response.ok) {
//         setFiles(prev => prev.filter(f => f.id !== fileId))
        
//         // Switch to first remaining file if deleted file was active
//         if (fileId === activeFileId) {
//           const remainingFiles = files.filter(f => f.id !== fileId)
//           if (remainingFiles.length > 0) {
//             setActiveFileId(remainingFiles[0].id)
//           } else {
//             setActiveFileId(null)
//           }
//         }
        
//         // Broadcast file deletion
//         socket?.emit('file-deleted', { sessionId, fileId })
//       }
//     } catch (error) {
//       console.error('Failed to delete file:', error)
//     }
//   }

//   // Execute code
//   const executeCode = useCallback(async () => {
//     if (!activeFile || isExecuting) return

//     setIsExecuting(true)
//     setShowOutput(true)
//     setExecutionResult(null)
    
//     try {
//       const startTime = performance.now()
      
//       const response = await fetch('/api/execute', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('accessToken')}`
//         },
//         body: JSON.stringify({
//           code: activeFile.content,
//           language: activeFile.language
//         })
//       })

//       const result = await response.json()
//       const executionTime = Math.round(performance.now() - startTime)

//       setExecutionResult({
//         output: result.output || '',
//         error: result.error || '',
//         executionTime,
//         language: activeFile.language
//       })

//     } catch (error) {
//       setExecutionResult({
//         output: '',
//         error: 'Network error: ' + (error as Error).message,
//         executionTime: 0,
//         language: activeFile.language
//       })
//     } finally {
//       setIsExecuting(false)
//     }
//   }, [activeFile, isExecuting])

//   // FIXED: Single endSession function - removed duplicate
//   const handleEndSession = async () => {
//     if (!isHost || !session) return

//     setEndSessionLoading(true)
    
//     try {
//       const token = localStorage.getItem('accessToken')
//       const response = await fetch(`/api/sessions/${sessionId}/end`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           reason: 'Session ended by host'
//         })
//       })

//       if (response.ok) {
//         // Broadcast session end to all participants before redirecting
//         if (socket && connected) {
//           console.log('📡 Broadcasting session end to all participants')
//           socket.emit('end-session-broadcast', { 
//             sessionId,
//             reason: 'Session ended by host',
//             hostName: user?.displayName || 'Host'
//           })
//         }
        
//         // Small delay to ensure message is sent
//         await new Promise(resolve => setTimeout(resolve, 500))
        
//         // Redirect host to dashboard
//         router.push('/dashboard')
//       } else {
//         const error = await response.json()
//         alert(error.error || 'Failed to end session')
//       }
//     } catch (error) {
//       console.error('Failed to end session:', error)
//       alert('Failed to end session. Please try again.')
//     } finally {
//       setEndSessionLoading(false)
//       setShowEndSessionModal(false)
//     }
//   }

//   // Auto-save functionality
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (files.length > 0 && connected) {
//         saveAllFiles()
//       }
//     }, 30000) // Auto-save every 30 seconds

//     return () => clearInterval(interval)
//   }, [files, connected])

//   const saveAllFiles = async () => {
//     try {
//       // Include current editor content in save
//       if (activeFileId && editorRef.current) {
//         const currentContent = editorRef.current.getValue()
//         const updatedFiles = files.map(file => 
//           file.id === activeFileId ? { ...file, content: currentContent } : file
//         )
        
//         const token = localStorage.getItem('accessToken')
//         const response = await fetch(`/api/sessions/${sessionId}/save`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`
//           },
//           body: JSON.stringify({ files: updatedFiles })
//         })
        
//         if (response.ok) {
//           console.log('✅ All files saved successfully')
//           setLastSyncTime(new Date())
//         }
//       }
//     } catch (error) {
//       console.error('❌ Failed to save files:', error)
//     }
//   }

//   // Send chat message
//   const sendMessage = useCallback(() => {
//     if (!newMessage.trim() || !socket || !connected || isSendingMessage) {
//       return
//     }

//     setIsSendingMessage(true)
//     setChatError('')

//     socket.emit('chat-message', {
//       content: newMessage.trim(),
//       sessionId,
//       timestamp: Date.now()
//     })

//     setNewMessage('')
    
//     setTimeout(() => {
//       setIsSendingMessage(false)
//     }, 5000)

//     if (chatInputRef.current) {
//       chatInputRef.current.focus()
//     }
//   }, [newMessage, socket, connected, sessionId, isSendingMessage])

//   // Handle enter key in chat
//   const handleChatKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault()
//       sendMessage()
//     }
//   }

//   // Remove participant (host only)
//   const removeParticipant = useCallback((participantId: string) => {
//     if (!isHost || !socket || !connected) return
    
//     socket.emit('remove-participant', {
//       sessionId,
//       participantId
//     })
    
//     setShowParticipantMenu(null)
//   }, [isHost, socket, connected, sessionId])

//   // Copy session link
//   const copySessionLink = () => {
//     const link = `${window.location.origin}/session/${sessionId}`
//     navigator.clipboard.writeText(link).then(() => {
//       console.log('📋 Session link copied to clipboard')
//     })
//   }

//   // Export session
//   const exportSession = async () => {
//     if (!session) return

//     const zip = new JSZip()
    
//     // Include current editor content
//     const currentFiles = files.map(file => {
//       if (file.id === activeFileId && editorRef.current) {
//         return { ...file, content: editorRef.current.getValue() }
//       }
//       return file
//     })
    
//     // Add all files
//     currentFiles.forEach(file => {
//       zip.file(file.name, file.content)
//     })
    
//     // Add README
//     const readme = `# ${session.title}

// ## Description
// ${session.description || 'No description provided'}

// ## Files
// ${currentFiles.map(f => `- ${f.name} (${f.language})`).join('\n')}

// ## Session Info
// - Created: ${new Date(session.createdAt).toLocaleString()}
// - Last Updated: ${new Date().toLocaleString()}
// - Type: ${session.type}
// - Status: ${session.isActive ? 'Active' : 'Ended'}

// Generated by CollabIDE - Real-time Collaborative Code Editor
// `
//     zip.file('README.md', readme)
    
//     const blob = await zip.generateAsync({ type: 'blob' })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement('a')
//     a.href = url
//     a.download = `${session.title.replace(/[^a-zA-Z0-9]/g, '_')}.zip`
//     document.body.appendChild(a)
//     a.click()
//     document.body.removeChild(a)
//     URL.revokeObjectURL(url)
//   }

//   // Generate preview HTML
//   const generatePreview = () => {
//     const htmlFile = files.find(f => f.language === 'html')
//     const cssFile = files.find(f => f.language === 'css')
//     const jsFile = files.find(f => f.language === 'javascript')
    
//     // Get current content if it's the active file
//     const getFileContent = (file: FileData) => {
//       if (file.id === activeFileId && editorRef.current) {
//         return editorRef.current.getValue()
//       }
//       return file.content
//     }
    
//     const htmlContent = htmlFile ? getFileContent(htmlFile) : ''
//     const cssContent = cssFile ? getFileContent(cssFile) : ''
//     const jsContent = jsFile ? getFileContent(jsFile) : ''
    
//     return `<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Preview - ${session?.title || 'CollabIDE'}</title>
//     <style>
//         ${cssContent}
//     </style>
// </head>
// <body>
//     ${htmlContent.replace(/<html.*?>|<\/html>|<head.*?>[\s\S]*?<\/head>|<body.*?>|<\/body>|<!DOCTYPE.*?>/gi, '') || '<h1>No HTML file found</h1>'}
//     <script>
//         try {
//             ${jsContent}
//         } catch (error) {
//             console.error('JavaScript Error:', error);
//         }
//     </script>
// </body>
// </html>`
//   }

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (socket && sessionId) {
//         socket.emit('leave-session', sessionId)
//       }
//       // Clear all timeouts
//       Object.values(syncTimeoutRef.current).forEach(timeout => {
//         if (timeout) clearTimeout(timeout)
//       })
//     }
//   }, [socket, sessionId])

//   // Loading states
//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
//           <p className="text-gray-600 mb-4">Please log in to access this session.</p>
//           <Button onClick={() => router.push('/auth/login')}>Sign In</Button>
//         </div>
//       </div>
//     )
//   }

//   if (loading || connecting) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-600" />
//           <h2 className="text-xl font-bold text-gray-900 mb-2">{connectionStatus}</h2>
//           <p className="text-gray-600">
//             {loading ? 'Loading session data...' : 'Establishing real-time connection...'}
//           </p>
//         </div>
//       </div>
//     )
//   }

//   if (!connected) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <WifiOff className="h-16 w-16 mx-auto mb-4 text-red-500" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Failed</h2>
//           <p className="text-gray-600 mb-4">Unable to connect to the collaboration server.</p>
//           <div className="space-x-4">
//             <Button onClick={() => window.location.reload()}>
//               <RefreshCw className="h-4 w-4 mr-2" />
//               Retry Connection
//             </Button>
//             <Button variant="outline" onClick={() => router.push('/dashboard')}>
//               Back to Dashboard
//             </Button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (!sessionJoined || !session) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-600" />
//           <h2 className="text-xl font-bold text-gray-900 mb-2">Joining Session</h2>
//           <p className="text-gray-600">Setting up your collaborative workspace...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="h-screen flex flex-col bg-gray-100">
//       {/* Enhanced Header */}
//       <header className="bg-white shadow-sm border-b px-4 py-3 flex-shrink-0">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center space-x-4">
//             <Button 
//               variant="outline" 
//               size="sm" 
//               onClick={() => router.push('/dashboard')}
//             >
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back
//             </Button>
//             <div>
//               <h1 className="text-xl font-bold text-gray-900">{session.title}</h1>
//               {session.description && (
//                 <p className="text-sm text-gray-600">{session.description}</p>
//               )}
//             </div>
//             <Badge variant={session.type === 'PUBLIC' ? 'secondary' : 'outline'}>
//               {session.type}
//             </Badge>
//             <Badge variant={session.isActive ? 'default' : 'secondary'}>
//               {session.isActive ? 'Active' : 'Ended'}
//             </Badge>
//             {isHost && (
//               <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
//                 <Crown className="h-3 w-3 mr-1" />
//                 Host
//               </Badge>
//             )}

//             {/* Sync Status */}
//             <Badge className={`flex items-center space-x-1 ${
//               syncStatus === 'synced' ? 'bg-green-100 text-green-800' :
//               syncStatus === 'syncing' ? 'bg-blue-100 text-blue-800' :
//               syncStatus === 'offline' ? 'bg-gray-100 text-gray-800' :
//               'bg-red-100 text-red-800'
//             }`}>
//               {syncStatus === 'synced' && <CheckCircle className="h-3 w-3" />}
//               {syncStatus === 'syncing' && <RefreshCw className="h-3 w-3 animate-spin" />}
//               {syncStatus === 'offline' && <WifiOff className="h-3 w-3" />}
//               {syncStatus === 'error' && <AlertCircle className="h-3 w-3" />}
//               <span className="capitalize">{syncStatus}</span>
//             </Badge>
//           </div>
          
//           <div className="flex items-center space-x-2">
//             <div className="flex items-center text-sm text-gray-600 mr-4">
//               <div className="flex items-center">
//                 <div className={`w-2 h-2 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                 <Users className="h-4 w-4 mr-1" />
//                 {participantCount} online
//               </div>
//             </div>
            
//             <Button size="sm" variant="outline" onClick={copySessionLink}>
//               <Share2 className="h-4 w-4 mr-1" />
//               Share
//             </Button>
            
//             <Button size="sm" variant="outline" onClick={saveAllFiles}>
//               <Save className="h-4 w-4 mr-1" />
//               Save
//             </Button>
            
//             <Button size="sm" variant="outline" onClick={exportSession}>
//               <Download className="h-4 w-4 mr-1" />
//               Export
//             </Button>

//             <Button 
//               size="sm" 
//               variant="outline" 
//               onClick={() => setIsPreviewVisible(!isPreviewVisible)}
//             >
//               {isPreviewVisible ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
//               Preview
//             </Button>

//             {/* Host Controls */}
//             {isHost && (
//               <div className="flex items-center space-x-2 border-l pl-2 ml-2">
//                 <Button 
//                   size="sm" 
//                   variant="outline"
//                   onClick={() => setShowInviteModal(true)}
//                 >
//                   <UserPlus className="h-4 w-4 mr-1" />
//                   Invite
//                 </Button>
                
//                 <Button 
//                   size="sm" 
//                   variant="destructive"
//                   onClick={() => setShowEndSessionModal(true)}
//                   disabled={endSessionLoading}
//                 >
//                   {endSessionLoading ? (
//                     <Loader2 className="h-4 w-4 mr-1 animate-spin" />
//                   ) : (
//                     <StopCircle className="h-4 w-4 mr-1" />
//                   )}
//                   End Session
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="flex-1 flex overflow-hidden">
//         {/* Editor Area */}
//         <div className="flex-1 flex flex-col">
//           {/* File Tabs */}
//           <div className="bg-white border-b flex items-center justify-between px-4 py-2">
//             <div className="flex items-center space-x-1 overflow-x-auto max-w-2xl">
//               {files.length === 0 ? (
//                 <div className="text-sm text-gray-500 italic">No files yet</div>
//               ) : (
//                 files.map((file) => {
//                   const config = languageConfigs[file.language as keyof typeof languageConfigs]
//                   return (
//                     <button
//                       key={file.id}
//                       onClick={() => setActiveFileId(file.id)}
//                       className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
//                         file.id === activeFileId
//                           ? 'bg-blue-100 text-blue-700 border border-blue-200'
//                           : 'hover:bg-gray-100 text-gray-600'
//                       }`}
//                     >
//                       <span className="text-base">{config?.icon || '📄'}</span>
//                       <span>{file.name}</span>
//                       {isHost && files.length > 1 && (
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             deleteFile(file.id)
//                           }}
//                           className="ml-1 hover:bg-red-100 hover:text-red-600 rounded p-1"
//                         >
//                           <X className="h-3 w-3" />
//                         </button>
//                       )}
//                     </button>
//                   )
//                 })
//               )}
//             </div>
            
//             <div className="flex items-center space-x-2 ml-4">
//               {isHost && (
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={() => setShowNewFileModal(true)}
//                   disabled={fileCreationLoading}
//                 >
//                   {fileCreationLoading ? (
//                     <Loader2 className="h-4 w-4 mr-1 animate-spin" />
//                   ) : (
//                     <Plus className="h-4 w-4 mr-1" />
//                   )}
//                   New File
//                 </Button>
//               )}
              
//               {activeFile && languageConfigs[activeFile.language as keyof typeof languageConfigs]?.executable && (
//                 <Button
//                   size="sm"
//                   onClick={executeCode}
//                   disabled={isExecuting}
//                   className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
//                 >
//                   {isExecuting ? (
//                     <>
//                       <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
//                       Running...
//                     </>
//                   ) : (
//                     <>
//                       <Play className="h-4 w-4 mr-1" />
//                       Run Code
//                     </>
//                   )}
//                 </Button>
//               )}
//             </div>
//           </div>

//           {/* Editor Content */}
//           <div className="flex-1 flex">
//             {/* Code Editor */}
//             <div className="flex-1">
//               {activeFile ? (
//                 <Editor
//                   height="100%"
//                   language={activeFile.language}
//                   value={activeFile.content}
//                   onChange={handleEditorChange}
//                   onMount={handleEditorDidMount}
//                   theme="vs-dark"
//                   options={{
//                     minimap: { enabled: false },
//                     fontSize: 14,
//                     wordWrap: 'on',
//                     automaticLayout: true,
//                     scrollBeyondLastLine: false,
//                     tabSize: 2,
//                     insertSpaces: true,
//                     cursorBlinking: 'smooth',
//                     cursorSmoothCaretAnimation: 'on',
//                     smoothScrolling: true
//                   }}
//                 />
//               ) : (
//                 <div className="flex items-center justify-center h-full bg-gray-900 text-white">
//                   <div className="text-center">
//                     <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                     <h3 className="text-lg font-medium mb-2">No file selected</h3>
//                     <p className="text-gray-400 mb-4">
//                       {files.length === 0 
//                         ? 'Create your first file to start coding' 
//                         : 'Select a file from the tabs above'
//                       }
//                     </p>
//                     {isHost && (
//                       <Button 
//                         onClick={() => setShowNewFileModal(true)}
//                         disabled={fileCreationLoading}
//                       >
//                         {fileCreationLoading ? (
//                           <>
//                             <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                             Creating...
//                           </>
//                         ) : (
//                           <>
//                             <Plus className="h-4 w-4 mr-2" />
//                             Create File
//                           </>
//                         )}
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Output Panel */}
//             {showOutput && (
//               <div className="w-2/5 border-l bg-white flex flex-col">
//                 <div className="bg-gray-900 text-white px-4 py-3 border-b flex justify-between items-center">
//                   <div className="flex items-center space-x-2">
//                     <Terminal className="h-4 w-4" />
//                     <h3 className="font-medium">Output</h3>
//                     {activeFile && (
//                       <Badge className="bg-gray-700 text-gray-200 text-xs">
//                         {languageConfigs[activeFile.language as keyof typeof languageConfigs]?.name || activeFile.language}
//                       </Badge>
//                     )}
//                   </div>
//                   <Button 
//                     size="sm" 
//                     variant="ghost" 
//                     onClick={() => setShowOutput(false)}
//                     className="text-gray-400 hover:text-white hover:bg-gray-800"
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
                
//                 <div className="flex-1 overflow-hidden flex flex-col">
//                   {isExecuting ? (
//                     <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
//                       <div className="text-center">
//                         <RefreshCw className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-600" />
//                         <p className="text-blue-700 font-medium">Executing code...</p>
//                       </div>
//                     </div>
//                   ) : executionResult ? (
//                     <div className="flex-1 flex flex-col">
//                       <div className={`px-4 py-3 text-sm border-b ${
//                         executionResult.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
//                       }`}>
//                         {executionResult.error ? (
//                           <div className="flex items-center">
//                             <AlertCircle className="h-4 w-4 mr-2" />
//                             Execution failed
//                           </div>
//                         ) : (
//                           <div className="flex items-center">
//                             <CheckCircle className="h-4 w-4 mr-2" />
//                             Executed successfully in {executionResult.executionTime}ms
//                           </div>
//                         )}
//                       </div>
                      
//                       <div className="flex-1 overflow-auto p-4">
//                         {executionResult.error ? (
//                           <pre className="text-sm text-red-600 whitespace-pre-wrap font-mono bg-red-50 p-3 rounded border">
//                             {executionResult.error}
//                           </pre>
//                         ) : (
//                           <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono bg-gray-50 p-3 rounded border min-h-32">
//                             {executionResult.output || 'No output generated'}
//                           </pre>
//                         )}
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
//                       <div className="text-center">
//                         <Terminal className="h-12 w-12 mx-auto mb-3 opacity-50" />
//                         <p>Click "Run Code" to execute</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Preview Panel */}
//         {isPreviewVisible && (
//           <div className="w-1/2 border-l bg-white flex flex-col">
//             <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
//               <h3 className="font-medium text-gray-900">Live Preview</h3>
//               <Button size="sm" variant="outline" onClick={() => setIsPreviewVisible(false)}>
//                 <EyeOff className="h-4 w-4" />
//               </Button>
//             </div>
//             <div className="flex-1">
//               <iframe
//                 srcDoc={generatePreview()}
//                 className="w-full h-full border-0"
//                 title="Preview"
//                 sandbox="allow-scripts allow-same-origin"
//               />
//             </div>
//           </div>
//         )}

//         {/* Sidebar */}
//         <div className="w-80 border-l bg-gray-50 flex flex-col">
//           {/* Participants */}
//           <Card className="m-4 mb-2 flex-shrink-0">
//             <CardHeader className="pb-3">
//               <CardTitle className="text-sm font-medium flex items-center justify-between">
//                 <div className="flex items-center">
//                   <Users className="h-4 w-4 mr-2" />
//                   Participants ({participantCount})
//                 </div>
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="pt-0 max-h-40 overflow-y-auto">
//               <div className="space-y-2">
//                 {/* Current user */}
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <div 
//                       className="w-3 h-3 rounded-full mr-2 border-2 border-white shadow-sm"
//                       style={{ backgroundColor: getUserColor(user.id) }}
//                     ></div>
//                     <span className="text-sm font-medium">{user?.displayName}</span>
//                     <span className="text-xs text-gray-500 ml-1">(You)</span>
//                   </div>
//                   {session.owner.id === user?.id && (
//                     <Badge variant="outline" className="text-xs">
//                       <Crown className="h-3 w-3 mr-1" />
//                       Host
//                     </Badge>
//                   )}
//                 </div>
                
//                 {/* Other online users */}
//                 {onlineUsers
//                   .filter(u => u.userId !== user?.id)
//                   .map((participant) => (
//                     <div key={participant.userId} className="flex items-center justify-between group">
//                       <div className="flex items-center">
//                         <div 
//                           className="w-3 h-3 rounded-full mr-2 border-2 border-white shadow-sm"
//                           style={{ backgroundColor: getUserColor(participant.userId) }}
//                         ></div>
//                         <span className="text-sm font-medium">{participant.displayName}</span>
//                         {session.owner.id === participant.userId && (
//                           <Badge variant="outline" className="text-xs ml-2">
//                             <Crown className="h-3 w-3 mr-1" />
//                             Host
//                           </Badge>
//                         )}
//                       </div>
//                       {isHost && session.owner.id !== participant.userId && (
//                         <div className="relative">
//                           <Button
//                             size="sm"
//                             variant="ghost"
//                             onClick={() => setShowParticipantMenu(
//                               showParticipantMenu === participant.userId ? null : participant.userId
//                             )}
//                             className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
//                           >
//                             <MoreVertical className="h-3 w-3" />
//                           </Button>
//                           {showParticipantMenu === participant.userId && (
//                             <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg py-1 z-20">
//                               <button
//                                 onClick={() => removeParticipant(participant.userId)}
//                                 className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
//                               >
//                                 <UserMinus className="h-3 w-3 mr-2" />
//                                 Remove
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   ))}
                
//                 {/* Show message if only one user */}
//                 {participantCount === 1 && (
//                   <div className="text-center text-gray-500 text-sm py-2">
//                     You're the only one here. {isHost ? 'Invite others to collaborate!' : 'Waiting for others...'}
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Chat */}
//           <Card className="mx-4 mb-4 flex-1 flex flex-col min-h-0">
//             <CardHeader className="pb-3 flex-shrink-0">
//               <CardTitle className="text-sm font-medium flex items-center justify-between">
//                 <div className="flex items-center">
//                   <MessageSquare className="h-4 w-4 mr-2" />
//                   Chat
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                   <span className="text-xs text-gray-500">
//                     {messages.length} message{messages.length !== 1 ? 's' : ''}
//                   </span>
//                 </div>
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="pt-0 flex-1 flex flex-col min-h-0">
//               {chatError && (
//                 <Alert variant="destructive" className="mb-2">
//                   <AlertDescription>{chatError}</AlertDescription>
//                 </Alert>
//               )}
              
//               <div className="flex-1 overflow-y-auto space-y-3 mb-3 min-h-0 pr-2">
//                 {messages.length === 0 ? (
//                   <div className="text-center text-gray-500 text-sm py-8">
//                     No messages yet. Start the conversation! 💬
//                   </div>
//                 ) : (
//                   messages.map((message) => (
//                     <div key={message.id} className="text-sm">
//                       <div className="flex items-center justify-between mb-1">
//                         <div className="flex items-center">
//                           <div 
//                             className="w-2 h-2 rounded-full mr-2"
//                             style={{ backgroundColor: getUserColor(message.user.id) }}
//                           ></div>
//                           <span className={`font-medium ${message.user.id === user?.id ? 'text-blue-700' : 'text-gray-700'}`}>
//                             {message.user.displayName}
//                             {message.user.id === user?.id && ' (You)'}
//                           </span>
//                         </div>
//                         <span className="text-xs text-gray-500">
//                           {new Date(message.createdAt).toLocaleTimeString()}
//                         </span>
//                       </div>
//                       <p className={`text-gray-600 rounded-lg px-3 py-2 border ${
//                         message.user.id === user?.id 
//                           ? 'bg-blue-50 border-blue-200 ml-4' 
//                           : 'bg-white border-gray-200'
//                       }`}>
//                         {message.content}
//                       </p>
//                     </div>
//                   ))
//                 )}
//                 <div ref={messagesEndRef} />
//               </div>
              
//               <div className="flex space-x-2 flex-shrink-0">
//                 <Input
//                   ref={chatInputRef}
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   placeholder={connected ? "Type a message..." : "Connecting..."}
//                   className="text-sm"
//                   onKeyPress={handleChatKeyPress}
//                   disabled={!connected || isSendingMessage}
//                   maxLength={500}
//                 />
//                 <Button 
//                   size="sm" 
//                   onClick={sendMessage} 
//                   disabled={!connected || !newMessage.trim() || isSendingMessage}
//                   className="px-3"
//                 >
//                   {isSendingMessage ? (
//                     <Loader2 className="h-3 w-3 animate-spin" />
//                   ) : (
//                     <Send className="h-4 w-4" />
//                   )}
//                 </Button>
//               </div>
//               <div className="text-xs text-gray-500 mt-1">
//                 {newMessage.length}/500 characters
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {/* New File Modal */}
//       {showNewFileModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">Create New File</h2>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   File Name
//                 </label>
//                 <Input
//                   type="text"
//                   placeholder="e.g., calculator, script, main"
//                   value={newFileName}
//                   onChange={(e) => setNewFileName(e.target.value)}
//                   disabled={fileCreationLoading}
//                   autoFocus
//                 />
//                 {files.some(f => f.name.toLowerCase() === newFileName.toLowerCase()) && (
//                   <p className="text-xs text-red-500 mt-1">A file with this name already exists</p>
//                 )}
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Language
//                 </label>
//                 <Select 
//                   value={newFileLanguage} 
//                   onValueChange={setNewFileLanguage}
//                   disabled={fileCreationLoading}
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {Object.entries(languageConfigs).map(([key, config]) => (
//                       <SelectItem key={key} value={key}>
//                         <div className="flex items-center space-x-2">
//                           <span>{config.icon}</span>
//                           <span>{config.name}</span>
//                           {config.executable && (
//                             <Badge variant="secondary" className="text-xs">
//                               Executable
//                             </Badge>
//                           )}
//                         </div>
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="text-sm text-gray-500">
//                 File will be created as: {newFileName}.{languageConfigs[newFileLanguage as keyof typeof languageConfigs]?.extension}
//               </div>

//               <div className="flex justify-end space-x-3">
//                 <Button 
//                   variant="outline" 
//                   onClick={() => {
//                     setShowNewFileModal(false)
//                     setNewFileName('')
//                     setNewFileLanguage('javascript')
//                   }}
//                   disabled={fileCreationLoading}
//                 >
//                   Cancel
//                 </Button>
//                 <Button 
//                   onClick={createNewFile}
//                   disabled={fileCreationLoading || !newFileName.trim() || files.some(f => f.name.toLowerCase() === newFileName.toLowerCase())}
//                 >
//                   {fileCreationLoading ? (
//                     <>
//                       <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                       Creating...
//                     </>
//                   ) : (
//                     <>
//                       <Plus className="h-4 w-4 mr-1" />
//                       Create File
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Invite Modal */}
//       {showInviteModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">Invite Collaborator</h2>
//             <p className="text-gray-600 mb-4">
//               Share this session with others by sending them the link or session ID.
//             </p>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Session Link
//                 </label>
//                 <div className="flex space-x-2">
//                   <Input
//                     type="text"
//                     value={`${window.location.origin}/session/${sessionId}`}
//                     readOnly
//                     className="flex-1"
//                   />
//                   <Button
//                     variant="outline"
//                     onClick={copySessionLink}
//                     className="px-3"
//                   >
//                     <Copy className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Session ID
//                 </label>
//                 <div className="flex space-x-2">
//                   <Input
//                     type="text"
//                     value={sessionId}
//                     readOnly
//                     className="flex-1 font-mono text-sm"
//                   />
//                   <Button
//                     variant="outline"
//                     onClick={() => navigator.clipboard.writeText(sessionId)}
//                     className="px-3"
//                   >
//                     <Copy className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               <div className="flex justify-end space-x-3">
//                 <Button 
//                   variant="outline" 
//                   onClick={() => setShowInviteModal(false)}
//                 >
//                   Close
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* End Session Modal */}
//       {showEndSessionModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
//             <div className="flex items-center mb-4">
//               <StopCircle className="h-6 w-6 text-red-600 mr-2" />
//               <h2 className="text-xl font-bold text-gray-900">End Session</h2>
//             </div>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to end this session? This will kick out all participants and mark the session as inactive. This action cannot be undone.
//             </p>
            
//             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
//               <div className="flex items-center">
//                 <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
//                 <span className="text-sm text-yellow-800">
//                   All files will be saved and participants will be notified.
//                 </span>
//               </div>
//             </div>

//             <div className="flex justify-end space-x-3">
//               <Button 
//                 variant="outline" 
//                 onClick={() => setShowEndSessionModal(false)}
//                 disabled={endSessionLoading}
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 variant="destructive"
//                 onClick={handleEndSession}
//                 disabled={endSessionLoading}
//               >
//                 {endSessionLoading ? (
//                   <>
//                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                     Ending...
//                   </>
//                 ) : (
//                   <>
//                     <StopCircle className="h-4 w-4 mr-2" />
//                     End Session
//                   </>
//                 )}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Session Ended Modal */}
//       {showSessionEndedModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4 text-center">
//             <div className="mb-6">
//               <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
//               <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Ended</h2>
//               <p className="text-gray-600">{sessionEndedReason}</p>
//             </div>
            
//             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
//               <div className="flex items-center justify-center">
//                 <Clock className="h-4 w-4 text-yellow-600 mr-2" />
//                 <span className="text-sm text-yellow-800">
//                   Redirecting to dashboard in 3 seconds...
//                 </span>
//               </div>
//             </div>

//             <Button 
//               onClick={() => router.push('/dashboard')}
//               className="w-full"
//             >
//               Go to Dashboard Now
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }



'use client'

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useSocket } from '@/hooks/useSocket';
import JSZip from 'jszip';
import { 
  Users, MessageSquare, Download, Share2, ArrowLeft, Save, Play, 
  Plus, X, FileText, Terminal, UserPlus, Crown, Send, RefreshCw, 
  CheckCircle, AlertCircle, Clock, Wifi, WifiOff, Copy, Eye, 
  EyeOff, MoreVertical, UserMinus, Mail, File, Code2, Settings, 
  StopCircle, LogOut, Trash2, Loader2, XCircle 
} from 'lucide-react';

// Components
import SessionHeader from './components/SessionHeader';
import FileTabs from './components/FileTabs';
import EditorArea from './components/EditorArea';
import PreviewPanel from './components/PreviewPanel';
import Sidebar from './components/Sidebar';
import NewFileModal from './components/NewFileModal';
import InviteModal from './components/InviteModal';
import EndSessionModal from './components/EndSessionModal';
import SessionEndedModal from './components/SessionEndedModal';

// Utils
import { languageConfigs } from './utils/languageConfigs';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

// Interfaces
interface Participant {
  id: string;
  user: {
    id: string;
    displayName: string;
    email: string;
  };
  role: 'HOST' | 'COLLABORATOR';
  isActive: boolean;
  joinedAt: string;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    displayName: string;
  };
}

interface OnlineUser {
  userId: string;
  userEmail: string;
  displayName: string;
  socketId: string;
  joinedAt: Date;
  isOnline: boolean;
}

interface CursorPosition {
  userId: string;
  userName: string;
  fileId: string;
  position: { lineNumber: number; column: number };
  selection?: { startLineNumber: number; startColumn: number; endLineNumber: number; endColumn: number };
  color: string;
  timestamp: number;
}

interface FileData {
  id: string;
  name: string;
  language: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface ExecutionResult {
  output: string;
  error?: string;
  executionTime: number;
  language: string;
}

interface SessionData {
  id: string;
  title: string;
  description?: string;
  type: 'PUBLIC' | 'PRIVATE';
  isActive: boolean;
  files: FileData[];
  participants: Participant[];
  messages: Message[];
  owner: {
    id: string;
    displayName: string;
    email: string;
  };
  _count: {
    participants: number;
    files: number;
  };
  createdAt: string;
}

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { socket, connected, connecting } = useSocket();
  
  // Session state
  const [sessionJoined, setSessionJoined] = useState(false);
  const [sessionId] = useState(params.id as string);
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [participantCount, setParticipantCount] = useState(1);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'offline'>('synced');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  
  // File and editor state
  const [files, setFiles] = useState<FileData[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [cursors, setCursors] = useState<{ [key: string]: CursorPosition }>({});
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileLanguage, setNewFileLanguage] = useState('javascript');
  const [fileCreationLoading, setFileCreationLoading] = useState(false);
  
  // Code execution state
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [showOutput, setShowOutput] = useState(false);
  
  // UI state
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatError, setChatError] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  
  // Host controls
  const [showParticipantMenu, setShowParticipantMenu] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEndSessionModal, setShowEndSessionModal] = useState(false);
  const [showSessionEndedModal, setShowSessionEndedModal] = useState(false);
  const [sessionEndedReason, setSessionEndedReason] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [endSessionLoading, setEndSessionLoading] = useState(false);
  
  // Refs for sync management and cursor tracking
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const decorationsRef = useRef<{ [key: string]: string[] }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastCodeChangeRef = useRef<{ [key: string]: string }>({});
  const chatInputRef = useRef<HTMLInputElement>(null);
  const messageIdRef = useRef<Set<string>>(new Set());
  const isRemoteUpdateRef = useRef<{ [key: string]: boolean }>({});
  const syncTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  // Check if current user is host
  const isHost = session?.owner?.id === user?.id;

  // Get active file
  const activeFile = files.find(file => file.id === activeFileId);

  // User colors for cursors
  const userColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
  const getUserColor = useCallback((userId: string) => {
    const hash = userId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return userColors[Math.abs(hash) % userColors.length];
  }, []);

  // Cursor decoration functions
  const updateCursorDecorations = useCallback((cursorData: CursorPosition, color: string) => {
    if (!editorRef.current || !monacoRef.current) return;
    
    const { userId, userName, position } = cursorData;
    
    // Remove previous decorations for this user
    if (decorationsRef.current[userId]) {
      editorRef.current.deltaDecorations(decorationsRef.current[userId], []);
    }
    
    // Create cursor decoration
    const decorations = [
      {
        range: new monacoRef.current.Range(
          position.lineNumber,
          position.column,
          position.lineNumber,
          position.column
        ),
        options: {
          className: `cursor-${userId}`,
          stickiness: monacoRef.current.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
          beforeContentClassName: `cursor-line-${userId}`,
          afterContentClassName: `cursor-label-${userId}`,
        }
      }
    ];
    
    // Apply decorations
    const newDecorations = editorRef.current.deltaDecorations([], decorations);
    decorationsRef.current[userId] = newDecorations;
    
    // Add custom CSS for cursor
    addCursorStyles(userId, userName, color);
  }, []);

  const updateSelectionDecorations = useCallback((selectionData: CursorPosition, color: string) => {
    if (!editorRef.current || !monacoRef.current) return;
    
    const { userId, selection } = selectionData;
    
    if (!selection || (
      selection.startLineNumber === selection.endLineNumber &&
      selection.startColumn === selection.endColumn
    )) return;
    
    const selectionDecorations = [
      {
        range: new monacoRef.current.Range(
          selection.startLineNumber,
          selection.startColumn,
          selection.endLineNumber,
          selection.endColumn
        ),
        options: {
          className: `selection-${userId}`,
          stickiness: monacoRef.current.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        }
      }
    ];
    
    // Apply selection decorations
    if (decorationsRef.current[`${userId}-selection`]) {
      editorRef.current.deltaDecorations(decorationsRef.current[`${userId}-selection`], []);
    }
    
    const newSelectionDecorations = editorRef.current.deltaDecorations([], selectionDecorations);
    decorationsRef.current[`${userId}-selection`] = newSelectionDecorations;
    
    // Add selection styles
    addSelectionStyles(userId, color);
  }, []);

  const addCursorStyles = (userId: string, userName: string, color: string) => {
    // Remove existing styles for this user
    const existingStyle = document.getElementById(`cursor-style-${userId}`);
    if (existingStyle) {
      existingStyle.remove();
    }
    
    const style = document.createElement('style');
    style.id = `cursor-style-${userId}`;
    style.textContent = `
      .cursor-line-${userId}::before {
        content: '';
        position: absolute;
        top: 0;
        left: -1px;
        width: 2px;
        height: 100%;
        background: linear-gradient(to bottom, ${color}, ${color}aa);
        z-index: 1000;
        animation: cursor-pulse-${userId} 1.5s ease-in-out infinite;
        box-shadow: 0 0 3px ${color}50;
      }
      
      .cursor-label-${userId}::after {
        content: '${userName.replace(/'/g, "\\'")}';
        position: absolute;
        top: -28px;
        left: -1px;
        background: linear-gradient(135deg, ${color}, ${color}dd);
        color: white;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 600;
        white-space: nowrap;
        z-index: 1001;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.1);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        line-height: 1.2;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        pointer-events: none;
        letter-spacing: 0.5px;
        border: 1px solid ${color}aa;
        transform: translateY(0);
        transition: all 0.2s ease;
      }
      
      .cursor-label-${userId}:hover::after {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      }
      
      @keyframes cursor-pulse-${userId} {
        0%, 100% { 
          opacity: 1; 
          transform: scaleX(1);
        }
        50% { 
          opacity: 0.7; 
          transform: scaleX(1.2);
        }
      }
      
      .cursor-${userId} {
        position: relative;
      }
    `;
    
    document.head.appendChild(style);
  };

  const addSelectionStyles = (userId: string, color: string) => {
    const existingStyle = document.getElementById(`selection-style-${userId}`);
    if (existingStyle) {
      existingStyle.remove();
    }
    
    const style = document.createElement('style');
    style.id = `selection-style-${userId}`;
    style.textContent = `
      .selection-${userId} {
        background: linear-gradient(90deg, ${color}25, ${color}35) !important;
        border: 1px solid ${color}60;
        border-radius: 3px;
        box-shadow: inset 0 1px 2px ${color}20;
      }
    `;
    
    document.head.appendChild(style);
  };

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle active file switching when files change
  useEffect(() => {
    if (files.length > 0 && !activeFileId) {
      setActiveFileId(files[0].id);
    } else if (files.length > 0 && activeFileId && !files.some(f => f.id === activeFileId)) {
      setActiveFileId(files[0].id);
    }
  }, [files, activeFileId]);

  // Update cursor decorations when cursors change
  useEffect(() => {
    if (editorRef.current && activeFile && cursors) {
      // Clear all existing decorations
      Object.keys(decorationsRef.current).forEach(key => {
        if (decorationsRef.current[key]) {
          editorRef.current.deltaDecorations(decorationsRef.current[key], []);
        }
      });
      decorationsRef.current = {};
      
      // Apply cursors for the current active file
      Object.values(cursors).forEach(cursor => {
        if (cursor.fileId === activeFile.id && cursor.userId !== user?.id) {
          const userColor = getUserColor(cursor.userId);
          updateCursorDecorations(cursor, userColor);
          if (cursor.selection) {
            updateSelectionDecorations(cursor, userColor);
          }
        }
      });
    }
  }, [cursors, activeFile, getUserColor, user?.id, updateCursorDecorations, updateSelectionDecorations]);

  // Fetch session data
  const fetchSessionData = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('📄 Session data loaded:', data.session);
        setSession(data.session);
        
        // Load files
        if (data.session.files) {
          console.log('📁 Loading files:', data.session.files.length);
          setFiles(data.session.files);
          
          if (!activeFileId && data.session.files.length > 0) {
            setActiveFileId(data.session.files[0].id);
            console.log('🎯 Set active file:', data.session.files[0].name);
          }
        } else if (data.session.files?.length === 0 && isHost) {
          createDefaultFile();
        }
        
        setParticipantCount(data.session._count?.participants || 1);
        
        // FIX: Load chat messages from database
        if (data.session.messages && Array.isArray(data.session.messages)) {
          console.log('💬 Loading messages:', data.session.messages.length);
          
          // Clear existing message IDs and add new ones
          messageIdRef.current.clear();
          
          const loadedMessages = data.session.messages.map((msg: Message) => {
            messageIdRef.current.add(msg.id);
            return msg;
          });
          
          setMessages(loadedMessages);
          console.log('✅ Messages loaded successfully:', loadedMessages.length);
        } else {
          console.log('📭 No messages found, starting with empty chat');
          setMessages([]);
        }
        
        // Initialize lastCodeChangeRef for all files
        data.session.files?.forEach((file: FileData) => {
          lastCodeChangeRef.current[file.id] = file.content;
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch session data');
      }
    } catch (error) {
      console.error('❌ Error fetching session:', error);
    } finally {
      setLoading(false);
    }
  }, [sessionId, activeFileId, isHost]);

  // Create default file if none exists
  const createDefaultFile = useCallback(async () => {
    if (!user || !sessionId) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/sessions/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          sessionId,
          name: 'main.js',
          language: 'javascript',
          content: languageConfigs.javascript.defaultContent
        })
      });

      if (response.ok) {
        const data = await response.json();
        const newFile = data.file;
        setFiles([newFile]);
        setActiveFileId(newFile.id);
        lastCodeChangeRef.current[newFile.id] = newFile.content;
        console.log('✅ Default file created:', newFile.name);
      }
    } catch (error) {
      console.error('❌ Failed to create default file:', error);
    }
  }, [user, sessionId]);

  // Socket event handlers with cursor tracking
  useEffect(() => {
    if (!socket || !connected || !sessionId || !user?.id) {
      if (socket && !connected) {
        setConnectionStatus('Connecting to server...');
        setSyncStatus('offline');
      }
      return;
    }

    console.log('🎯 Setting up socket listeners for session:', sessionId);
    setConnectionStatus('Joining session...');

    // Join session
    socket.emit('join-session', sessionId);

    // Session events
    socket.on('session-joined', (data) => {
      console.log('✅ Successfully joined session:', data);
      setSessionJoined(true);
      setParticipantCount(data.participantCount || 1);
      setConnectionStatus('Connected');
      setSyncStatus('synced');
      fetchSessionData();
    });

    socket.on('user-joined', (data) => {
      console.log('👤 User joined session:', data);
      
      if (data.participantCount !== undefined) {
        setParticipantCount(data.participantCount);
      }
      
      const newUser: OnlineUser = {
        userId: data.userId,
        userEmail: data.userEmail,
        displayName: data.userDisplayName || data.userEmail?.split('@')[0] || 'Anonymous',
        socketId: data.socketId || socket.id!,
        joinedAt: new Date(data.timestamp),
        isOnline: true
      };
      
      setOnlineUsers(prev => {
        const filtered = prev.filter(u => u.userId !== data.userId);
        return [...filtered, newUser];
      });
    });

    socket.on('user-left', (data) => {
      console.log('👋 User left session:', data);
      
      if (data.participantCount !== undefined) {
        setParticipantCount(data.participantCount);
      }
      
      setOnlineUsers(prev => prev.filter(u => u.userId !== data.userId));
      
      // Remove cursors when user leaves
      setCursors(prev => {
        const newCursors = { ...prev };
        Object.keys(newCursors).forEach(key => {
          if (key.startsWith(data.userId)) {
            delete newCursors[key];
          }
        });
        return newCursors;
      });

      // Remove decorations
      if (editorRef.current && decorationsRef.current[data.userId]) {
        editorRef.current.deltaDecorations(decorationsRef.current[data.userId], []);
        delete decorationsRef.current[data.userId];
      }

      // Clean up cursor styles
      const cursorStyle = document.getElementById(`cursor-style-${data.userId}`);
      const selectionStyle = document.getElementById(`selection-style-${data.userId}`);
      if (cursorStyle) cursorStyle.remove();
      if (selectionStyle) selectionStyle.remove();
    });

    // Cursor tracking events
    // socket.on('cursor-position', (data) => {
    //   if (data.userId === user?.id) return; // Don't show own cursor
      
    //   const cursorKey = `${data.userId}-${data.fileId}`;
    //   const userColor = getUserColor(data.userId);
      
    //   setCursors(prev => ({
    //     ...prev,
    //     [cursorKey]: {
    //       ...data,
    //       color: userColor
    //     }
    //   }));
      
    //   // Update cursor decoration in Monaco if it's the active file
    //   if (data.fileId === activeFileId && editorRef.current) {
    //     updateCursorDecorations(data, userColor);
    //   }
    // });

    // socket.on('cursor-selection', (data) => {
    //   if (data.userId === user?.id) return;
      
    //   const cursorKey = `${data.userId}-${data.fileId}`;
    //   const userColor = getUserColor(data.userId);
      
    //   setCursors(prev => ({
    //     ...prev,
    //     [cursorKey]: {
    //       ...prev[cursorKey],
    //       selection: data.selection,
    //       color: userColor
    //     }
    //   }));
      
    //   if (data.fileId === activeFileId && editorRef.current) {
    //     updateSelectionDecorations(data, userColor);
    //   }
    // });

    socket.on('cursor-position', (data) => {
      console.log('👁️ RECEIVED cursor position from:', data.userName, 'at:', data.position);
      if (data.userId === user?.id) return; // Don't show own cursor
      
      const cursorKey = `${data.userId}-${data.fileId}`;
      const userColor = getUserColor(data.userId);
      
      setCursors(prev => ({
        ...prev,
        [cursorKey]: {
          ...data,
          color: userColor
        }
      }));
    });
    
    socket.on('cursor-selection', (data) => {
      console.log('👁️ RECEIVED cursor selection from:', data.userName);
      if (data.userId === user?.id) return;
      
      const cursorKey = `${data.userId}-${data.fileId}`;
      const userColor = getUserColor(data.userId);
      
      setCursors(prev => ({
        ...prev,
        [cursorKey]: {
          ...prev[cursorKey],
          selection: data.selection,
          color: userColor
        }
      }));
    });

    // File update events
    socket.on('file-update', (data) => {
      if (data.userId === user.id) return;

      console.log('📥 Remote file update received:', {
        fileId: data.fileId,
        contentLength: data.content?.length,
        fromUser: data.userId,
        timestamp: data.timestamp
      });
      
      isRemoteUpdateRef.current[data.fileId] = true;
      
      setFiles(prev => prev.map(file => 
        file.id === data.fileId ? { ...file, content: data.content } : file
      ));
      
      lastCodeChangeRef.current[data.fileId] = data.content;
      
      // Update editor if this is the active file
      if (data.fileId === activeFileId && editorRef.current) {
        const currentValue = editorRef.current.getValue();
        if (currentValue !== data.content) {
          console.log('🔄 Updating Monaco editor for file', data.fileId);
          const position = editorRef.current.getPosition();
          editorRef.current.setValue(data.content);
          if (position) {
            editorRef.current.setPosition(position);
          }
        }
      }
      
      setTimeout(() => {
        isRemoteUpdateRef.current[data.fileId] = false;
      }, 100);
    });

    // File creation events
    socket.on('file-created', (data: { file: FileData }) => {
      console.log('📁 New file created by another user:', data.file.name);
      
      setFiles(prev => {
        const exists = prev.some(f => f.id === data.file.id);
        if (!exists) {
          const newFiles = [...prev, data.file];
          console.log('📁 Added file to list. Total files:', newFiles.length);
          return newFiles;
        }
        return prev;
      });
    });

    // File deletion events
    socket.on('file-deleted', (data: { fileId: string }) => {
      console.log('🗑️ File deleted by another user:', data.fileId);
      
      setFiles(prev => prev.filter(f => f.id !== data.fileId));
      
      // Handle active file switching
      setActiveFileId(prevActiveId => {
        if (data.fileId === prevActiveId) {
          return null; // Will be handled by useEffect
        }
        return prevActiveId;
      });
    });

    // Session ended event
    socket.on('session-ended', (data) => {
      console.log('🛑 Session ended by host:', data);
      
      setShowSessionEndedModal(true);
      setSessionEndedReason(data.reason || 'The host has ended this session');
      
      // Automatically redirect after a delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    });

    // Handle being kicked out by host
    socket.on('participant-kicked', (data) => {
      console.log('🚫 You were removed from the session:', data);
      alert(`You have been removed from this session by the host: ${data.reason || 'No reason provided'}`);
      router.push('/dashboard');
    });

    // Handle force disconnect
    socket.on('force-disconnect', (data) => {
      console.log('⚠️ Force disconnected:', data);
      router.push('/dashboard');
    });

    // Chat events
    socket.on('chat-message', (message) => {
      console.log('💬 New chat message received:', message);
      setChatError('');
      
      if (!messageIdRef.current.has(message.id)) {
        messageIdRef.current.add(message.id);
        setMessages(prev => [...prev, message]);
      }
    });

    socket.on('chat-error', (error) => {
      console.error('💬 Chat error:', error);
      setChatError(error.message || 'Failed to send message');
      setIsSendingMessage(false);
    });

    socket.on('message-sent', (data) => {
      setIsSendingMessage(false);
    });

    socket.on('connect', () => {
      setSyncStatus('synced');
      setConnectionStatus('Connected');
    });

    socket.on('disconnect', () => {
      setSyncStatus('offline');
      setConnectionStatus('Disconnected');
    });

    socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
      setSyncStatus('error');
    });

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up socket listeners');
      socket.off('session-joined');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('cursor-position');
      socket.off('cursor-selection');
      socket.off('file-update');
      socket.off('file-created');
      socket.off('file-deleted');
      socket.off('session-ended');
      socket.off('participant-kicked');
      socket.off('force-disconnect');
      socket.off('chat-message');
      socket.off('chat-error');
      socket.off('message-sent');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('error');
    };
  }, [socket, connected, sessionId, user?.id, router, activeFileId, getUserColor, updateCursorDecorations, updateSelectionDecorations]);

  // Handle file editor changes
  const handleEditorChange = useCallback((value: string | undefined) => {
    if (!value || !socket || !connected || !activeFileId) return;
    
    // Skip if this is a remote update
    if (isRemoteUpdateRef.current[activeFileId]) {
      return;
    }
    
    // Update local file immediately
    setFiles(prev => prev.map(file => 
      file.id === activeFileId ? { ...file, content: value } : file
    ));
    
    // Only broadcast if the change is different from last known state
    if (lastCodeChangeRef.current[activeFileId] !== value) {
      lastCodeChangeRef.current[activeFileId] = value;
      setSyncStatus('syncing');
      
      // Clear existing timeout
      if (syncTimeoutRef.current[activeFileId]) {
        clearTimeout(syncTimeoutRef.current[activeFileId]);
      }
      
      // Fast debounce for real-time feel
      syncTimeoutRef.current[activeFileId] = setTimeout(() => {
        if (socket && connected && lastCodeChangeRef.current[activeFileId] === value) {
          console.log(`🚀 Broadcasting file change for ${activeFileId}`);
          socket.emit('file-update', {
            fileId: activeFileId,
            content: value,
            sessionId,
            timestamp: Date.now()
          });
          setSyncStatus('synced');
          setLastSyncTime(new Date());
        }
      }, 200);
    }
  }, [socket, connected, sessionId, activeFileId]);

  // Enhanced handle editor mount with cursor tracking
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    editor.updateOptions({
      fontSize: 14,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      automaticLayout: true,
      theme: 'vs-dark',
      tabSize: 2,
      insertSpaces: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      smoothScrolling: true
    });

    // Set initial value if we have an active file
    if (activeFile) {
      editor.setValue(activeFile.content);
    }

    // Add cursor tracking if socket is available
    if (socket && connected && sessionId && user) {
      // Track cursor position changes
      editor.onDidChangeCursorPosition((e: any) => {
        const position = e.position;
        const selection = editor.getSelection();
        
        // Emit cursor position to other users
        socket.emit('cursor-position', {
          sessionId,
          fileId: activeFileId,
          userId: user.id,
          userName: user.displayName || user.name || 'Anonymous',
          position: {
            lineNumber: position.lineNumber,
            column: position.column
          },
          selection: selection ? {
            startLineNumber: selection.startLineNumber,
            startColumn: selection.startColumn,
            endLineNumber: selection.endLineNumber,
            endColumn: selection.endColumn
          } : null,
          timestamp: Date.now()
        });
      });

      // Track selection changes
      editor.onDidChangeCursorSelection((e: any) => {
        const selection = e.selection;
        
        socket.emit('cursor-selection', {
          sessionId,
          fileId: activeFileId,
          userId: user.id,
          userName: user.displayName || user.name || 'Anonymous',
          selection: {
            startLineNumber: selection.startLineNumber,
            startColumn: selection.startColumn,
            endLineNumber: selection.endLineNumber,
            endColumn: selection.endColumn
          },
          timestamp: Date.now()
        });
      });
    }
  };

  // Create new file
  const createNewFile = async () => {
    if (!newFileName.trim() || !socket || !connected) {
      return;
    }
    
    // Check for duplicate names
    if (files.some(f => f.name.toLowerCase() === newFileName.toLowerCase())) {
      alert('A file with this name already exists!');
      return;
    }
    
    setFileCreationLoading(true);
    
    try {
      const token = localStorage.getItem('accessToken');
      const config = languageConfigs[newFileLanguage as keyof typeof languageConfigs];
      
      const response = await fetch('/api/sessions/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          sessionId,
          name: newFileName.trim(),
          language: newFileLanguage,
          content: config?.defaultContent || `// New ${newFileLanguage} file\nconsole.log('Hello World!');`
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const newFile = data.file;
        
        console.log('✅ File created successfully:', newFile);
        
        // Update local state
        setFiles(prev => [...prev, newFile]);
        setActiveFileId(newFile.id);
        lastCodeChangeRef.current[newFile.id] = newFile.content;
        
        // Clear form
        setNewFileName('');
        setNewFileLanguage('javascript');
        setShowNewFileModal(false);
        
        // Broadcast to other users
        if (socket && connected) {
          socket.emit('file-created', {
            sessionId,
            file: newFile
          });
        }
        
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create file');
      }
    } catch (error) {
      console.error('Failed to create file:', error);
      alert('Failed to create file. Please try again.');
    } finally {
      setFileCreationLoading(false);
    }
  };

  // Delete file
  const deleteFile = async (fileId: string) => {
    if (!isHost) return;
    
    if (files.length === 1) {
      alert('Cannot delete the last file in the session');
      return;
    }
    
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/sessions/files/${fileId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        setFiles(prev => prev.filter(f => f.id !== fileId));
        
        // Switch to first remaining file if deleted file was active
        if (fileId === activeFileId) {
          const remainingFiles = files.filter(f => f.id !== fileId);
          if (remainingFiles.length > 0) {
            setActiveFileId(remainingFiles[0].id);
          } else {
            setActiveFileId(null);
          }
        }
        
        // Broadcast file deletion
        socket?.emit('file-deleted', { sessionId, fileId });
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  // Execute code
  const executeCode = useCallback(async () => {
    if (!activeFile || isExecuting) return;

    setIsExecuting(true);
    setShowOutput(true);
    setExecutionResult(null);
    
    try {
      const startTime = performance.now();
      
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          code: activeFile.content,
          language: activeFile.language
        })
      });

      const result = await response.json();
      const executionTime = Math.round(performance.now() - startTime);

      setExecutionResult({
        output: result.output || '',
        error: result.error || '',
        executionTime,
        language: activeFile.language
      });

    } catch (error) {
      setExecutionResult({
        output: '',
        error: 'Network error: ' + (error as Error).message,
        executionTime: 0,
        language: activeFile.language
      });
    } finally {
      setIsExecuting(false);
    }
  }, [activeFile, isExecuting]);

  // End session
  const handleEndSession = async () => {
    if (!isHost || !session) return;

    setEndSessionLoading(true);
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/sessions/${sessionId}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          reason: 'Session ended by host'
        })
      });

      if (response.ok) {
        // Broadcast session end to all participants before redirecting
        if (socket && connected) {
          console.log('📡 Broadcasting session end to all participants');
          socket.emit('end-session-broadcast', { 
            sessionId,
            reason: 'Session ended by host',
            hostName: user?.displayName || 'Host'
          });
        }
        
        // Small delay to ensure message is sent
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Redirect host to dashboard
        router.push('/dashboard');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to end session');
      }
    } catch (error) {
      console.error('Failed to end session:', error);
      alert('Failed to end session. Please try again.');
    } finally {
      setEndSessionLoading(false);
      setShowEndSessionModal(false);
    }
  };

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (files.length > 0 && connected) {
        saveAllFiles();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, [files, connected]);

  const saveAllFiles = async () => {
    try {
      // Include current editor content in save
      if (activeFileId && editorRef.current) {
        const currentContent = editorRef.current.getValue();
        const updatedFiles = files.map(file => 
          file.id === activeFileId ? { ...file, content: currentContent } : file
        );
        
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`/api/sessions/${sessionId}/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ files: updatedFiles })
        });
        
        if (response.ok) {
          console.log('✅ All files saved successfully');
          setLastSyncTime(new Date());
        }
      }
    } catch (error) {
      console.error('❌ Failed to save files:', error);
    }
  };

  // Send chat message
  const sendMessage = useCallback(() => {
    if (!newMessage.trim() || !socket || !connected || isSendingMessage) {
      return;
    }

    setIsSendingMessage(true);
    setChatError('');

    socket.emit('chat-message', {
      content: newMessage.trim(),
      sessionId,
      timestamp: Date.now()
    });

    setNewMessage('');
    
    setTimeout(() => {
      setIsSendingMessage(false);
    }, 5000);

    if (chatInputRef.current) {
      chatInputRef.current.focus();
    }
  }, [newMessage, socket, connected, sessionId, isSendingMessage]);

  // Handle enter key in chat
  const handleChatKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Remove participant (host only)
  const removeParticipant = useCallback((participantId: string) => {
    if (!isHost || !socket || !connected) return;
    
    socket.emit('remove-participant', {
      sessionId,
      participantId
    });
    
    setShowParticipantMenu(null);
  }, [isHost, socket, connected, sessionId]);

  // Copy session link
  const copySessionLink = () => {
    const link = `${window.location.origin}/session/${sessionId}`;
    navigator.clipboard.writeText(link).then(() => {
      console.log('📋 Session link copied to clipboard');
    });
  };

  // Export session
  const exportSession = async () => {
    if (!session) return;

    const zip = new JSZip();
    
    // Include current editor content
    const currentFiles = files.map(file => {
      if (file.id === activeFileId && editorRef.current) {
        return { ...file, content: editorRef.current.getValue() };
      }
      return file;
    });
    
    // Add all files
    currentFiles.forEach(file => {
      zip.file(file.name, file.content);
    });
    
    // Add README
    const readme = `# ${session.title}

## Description
${session.description || 'No description provided'}

## Files
${currentFiles.map(f => `- ${f.name} (${f.language})`).join('\n')}

## Session Info
- Created: ${new Date(session.createdAt).toLocaleString()}
- Last Updated: ${new Date().toLocaleString()}
- Type: ${session.type}
- Status: ${session.isActive ? 'Active' : 'Ended'}

Generated by CollabIDE - Real-time Collaborative Code Editor
`;
    zip.file('README.md', readme);
    
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.title.replace(/[^a-zA-Z0-9]/g, '_')}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate preview HTML
  const generatePreview = () => {
    const htmlFile = files.find(f => f.language === 'html');
    const cssFile = files.find(f => f.language === 'css');
    const jsFile = files.find(f => f.language === 'javascript');
    
    // Get current content if it's the active file
    const getFileContent = (file: FileData) => {
      if (file.id === activeFileId && editorRef.current) {
        return editorRef.current.getValue();
      }
      return file.content;
    };
    
    const htmlContent = htmlFile ? getFileContent(htmlFile) : '';
    const cssContent = cssFile ? getFileContent(cssFile) : '';
    const jsContent = jsFile ? getFileContent(jsFile) : '';
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview - ${session?.title || 'CollabIDE'}</title>
    <style>
        ${cssContent}
    </style>
</head>
<body>
    ${htmlContent.replace(/<html.*?>|<\/html>|<head.*?>[\s\S]*?<\/head>|<body.*?>|<\/body>|<!DOCTYPE.*?>/gi, '') || '<h1>No HTML file found</h1>'}
    <script>
        try {
            ${jsContent}
        } catch (error) {
            console.error('JavaScript Error:', error);
        }
    </script>
</body>
</html>`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket && sessionId) {
        socket.emit('leave-session', sessionId);
      }
      // Clear all timeouts
      Object.values(syncTimeoutRef.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
      // Clean up cursor styles
      Object.keys(cursors).forEach(cursorKey => {
        const userId = cursorKey.split('-')[0];
        const cursorStyle = document.getElementById(`cursor-style-${userId}`);
        const selectionStyle = document.getElementById(`selection-style-${userId}`);
        if (cursorStyle) cursorStyle.remove();
        if (selectionStyle) selectionStyle.remove();
      });
    };
  }, [socket, sessionId, cursors]);

  // Loading states
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to access this session.</p>
          <Button onClick={() => router.push('/auth/login')}>Sign In</Button>
        </div>
      </div>
    );
  }

  if (loading || connecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">{connectionStatus}</h2>
          <p className="text-gray-600">
            {loading ? 'Loading session data...' : 'Establishing real-time connection...'}
          </p>
        </div>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <WifiOff className="h-16 w-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Failed</h2>
          <p className="text-gray-600 mb-4">Unable to connect to the collaboration server.</p>
          <div className="space-x-4">
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Connection
            </Button>
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!sessionJoined || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Joining Session</h2>
          <p className="text-gray-600">Setting up your collaborative workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <SessionHeader 
        session={session}
        isHost={isHost}
        connected={connected}
        syncStatus={syncStatus}
        participantCount={participantCount}
        copySessionLink={copySessionLink}
        saveAllFiles={saveAllFiles}
        exportSession={exportSession}
        isPreviewVisible={isPreviewVisible}
        togglePreview={() => setIsPreviewVisible(!isPreviewVisible)}
        showInviteModal={() => setShowInviteModal(true)}
        showEndSessionModal={() => setShowEndSessionModal(true)}
        endSessionLoading={endSessionLoading}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col">
          <FileTabs
            files={files}
            activeFileId={activeFileId}
            setActiveFileId={setActiveFileId}
            isHost={isHost}
            showNewFileModal={() => setShowNewFileModal(true)}
            fileCreationLoading={fileCreationLoading}
            deleteFile={deleteFile}
            executeCode={executeCode}
            isExecuting={isExecuting}
            activeFile={activeFile}
          />

          <EditorArea
            activeFile={activeFile}
            handleEditorChange={handleEditorChange}
            handleEditorDidMount={handleEditorDidMount}
            isHost={isHost}
            showNewFileModal={() => setShowNewFileModal(true)}
            fileCreationLoading={fileCreationLoading}
            showOutput={showOutput}
            setShowOutput={setShowOutput}
            isExecuting={isExecuting}
            executionResult={executionResult}
            // Pass cursor props
            socket={socket}
            connected={connected}
            sessionId={sessionId}
            user={user}
            cursors={cursors}
            setCursors={setCursors}
            getUserColor={getUserColor}
          />
        </div>

        <PreviewPanel
          isPreviewVisible={isPreviewVisible}
          setIsPreviewVisible={setIsPreviewVisible}
          generatePreview={generatePreview}
          session={session}
        />

        <Sidebar
          user={user}
          session={session}
          isHost={isHost}
          onlineUsers={onlineUsers}
          participantCount={participantCount}
          getUserColor={getUserColor}
          showParticipantMenu={showParticipantMenu}
          setShowParticipantMenu={setShowParticipantMenu}
          removeParticipant={removeParticipant}
          messages={messages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          chatError={chatError}
          connected={connected}
          isSendingMessage={isSendingMessage}
          sendMessage={sendMessage}
          handleChatKeyPress={handleChatKeyPress}
          messagesEndRef={messagesEndRef}
        />
      </div>

      {/* Modals */}
      {showNewFileModal && (
        <NewFileModal
          newFileName={newFileName}
          setNewFileName={setNewFileName}
          newFileLanguage={newFileLanguage}
          setNewFileLanguage={setNewFileLanguage}
          fileCreationLoading={fileCreationLoading}
          createNewFile={createNewFile}
          files={files}
          closeModal={() => setShowNewFileModal(false)}
        />
      )}

      {showInviteModal && (
        <InviteModal
          sessionId={sessionId as string}
          closeModal={() => setShowInviteModal(false)}
        />
      )}

      {showEndSessionModal && (
        <EndSessionModal
          endSessionLoading={endSessionLoading}
          handleEndSession={handleEndSession}
          closeModal={() => setShowEndSessionModal(false)}
        />
      )}

      {showSessionEndedModal && (
        <SessionEndedModal
          sessionEndedReason={sessionEndedReason}
          goToDashboard={() => router.push('/dashboard')}
        />
      )}
    </div>
  );
}
