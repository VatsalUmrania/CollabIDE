


// 'use client'

// import { useEffect, useState } from 'react'
// import { useAuth } from '@/contexts/auth-context'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Badge } from '@/components/ui/badge'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { 
//   Plus, 
//   Users, 
//   Clock, 
//   Settings, 
//   Search,
//   ExternalLink,
//   Link as LinkIcon,
//   LogOut,
//   CheckCircle,
//   XCircle,
//   PlayCircle,
//   Archive,
//   Calendar,
//   Timer,
//   Crown,
//   Eye,
//   Download,
//   MessageSquare, 
//   FileText
// } from 'lucide-react'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'

// // Enhanced interface with session status
// interface Session {
//   id: string
//   title: string
//   description?: string
//   type: 'PUBLIC' | 'PRIVATE'
//   isActive: boolean
//   createdAt: string
//   updatedAt: string
//   lastActivity: string
//   owner: {
//     id: string
//     displayName: string
//     email: string
//   }
//   _count: {
//     participants: number
//     files: number
//     messages: number
//   }
// }

// export default function DashboardPage() {
//   const { user, logout } = useAuth()
//   const router = useRouter()
//   const [sessions, setSessions] = useState<Session[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [activeTab, setActiveTab] = useState('active')
  
//   const [showJoinModal, setShowJoinModal] = useState(false)
//   const [joinSessionId, setJoinSessionId] = useState('')
//   const [joinLoading, setJoinLoading] = useState(false)
//   const [joinError, setJoinError] = useState('')

//   useEffect(() => {
//     fetchSessions()
//     handleJoinFromUrl()
//   }, [])

//   const fetchSessions = async () => {
//     try {
//       const token = localStorage.getItem('accessToken')
//       const response = await fetch('/api/sessions', {
//         headers: { Authorization: `Bearer ${token}` }
//       })
      
//       if (response.ok) {
//         const data = await response.json()
//         setSessions(data.sessions)
//       }
//     } catch (error) {
//       console.error('Failed to fetch sessions:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleJoinSession = async () => {
//     if (!joinSessionId.trim()) {
//       setJoinError('Please enter a session ID or link')
//       return
//     }

//     setJoinLoading(true)
//     setJoinError('')

//     try {
//       let sessionId = joinSessionId.trim()
//       const urlPattern = /\/session\/([a-zA-Z0-9]+)/
//       const match = sessionId.match(urlPattern)
//       if (match) {
//         sessionId = match[1]
//       }

//       const token = localStorage.getItem('accessToken')
//       const response = await fetch(`/api/sessions/${sessionId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       })

//       if (response.ok) {
//         const data = await response.json()
//         if (!data.session.isActive) {
//           setJoinError('This session has ended and is no longer available')
//           return
//         }
//         router.push(`/session/${sessionId}`)
//         setShowJoinModal(false)
//         setJoinSessionId('')
//       } else {
//         const data = await response.json()
//         setJoinError(data.error || 'Failed to join session')
//       }
//     } catch (error) {
//       setJoinError('Invalid session ID or link')
//     } finally {
//       setJoinLoading(false)
//     }
//   }

//   const handleJoinFromUrl = () => {
//     const urlParams = new URLSearchParams(window.location.search)
//     const sessionId = urlParams.get('join')
//     if (sessionId) {
//       setJoinSessionId(sessionId)
//       setShowJoinModal(true)
//       window.history.replaceState({}, '', window.location.pathname)
//     }
//   }

//   // Export ended session
//   const exportSession = async (sessionId: string, title: string) => {
//     try {
//       const token = localStorage.getItem('accessToken')
//       const response = await fetch(`/api/sessions/${sessionId}/export`, {
//         headers: { Authorization: `Bearer ${token}` }
//       })
      
//       if (response.ok) {
//         const blob = await response.blob()
//         const url = URL.createObjectURL(blob)
//         const a = document.createElement('a')
//         a.href = url
//         a.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.zip`
//         document.body.appendChild(a)
//         a.click()
//         document.body.removeChild(a)
//         URL.revokeObjectURL(url)
//       }
//     } catch (error) {
//       console.error('Export failed:', error)
//     }
//   }

//   // Filter sessions by status and search term
//   const activeSessions = sessions.filter(session => 
//     session.isActive && 
//     (session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//      session.owner.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
//   )

//   const endedSessions = sessions.filter(session => 
//     !session.isActive && 
//     (session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//      session.owner.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
//   )

//   // Get session duration for ended sessions
//   const getSessionDuration = (createdAt: string, lastActivity: string) => {
//     const start = new Date(createdAt)
//     const end = new Date(lastActivity)
//     const diffMs = end.getTime() - start.getTime()
//     const diffMins = Math.floor(diffMs / 60000)
//     const diffHours = Math.floor(diffMins / 60)
    
//     if (diffHours > 0) {
//       return `${diffHours}h ${diffMins % 60}m`
//     }
//     return `${diffMins}m`
//   }

//   // Get relative time
//   const getRelativeTime = (dateString: string) => {
//     const date = new Date(dateString)
//     const now = new Date()
//     const diffMs = now.getTime() - date.getTime()
//     const diffMins = Math.floor(diffMs / 60000)
//     const diffHours = Math.floor(diffMins / 60)
//     const diffDays = Math.floor(diffHours / 24)
    
//     if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
//     if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
//     if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
//     return 'Just now'
//   }

//   const SessionCard = ({ session, isEnded = false }: { session: Session, isEnded?: boolean }) => (
//     <Card className={`bg-white/80 backdrop-blur-lg border transition-all duration-300 flex flex-col ${
//       isEnded 
//         ? 'border-slate-200/50 hover:border-slate-400 hover:shadow-lg' 
//         : 'border-slate-200/50 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1'
//     }`}>
//       <CardHeader>
//         <div className="flex justify-between items-start">
//           <CardTitle className={`text-xl font-bold line-clamp-1 ${
//             isEnded ? 'text-slate-600' : 'text-slate-800'
//           }`}>
//             {session.title}
//           </CardTitle>
//           <div className="flex space-x-2">
//             <Badge variant={session.type === 'PUBLIC' ? 'default' : 'secondary'}>
//               {session.type}
//             </Badge>
//             <Badge className={`${
//               session.isActive 
//                 ? 'bg-green-100 text-green-800' 
//                 : 'bg-gray-100 text-gray-600'
//             }`}>
//               {session.isActive ? (
//                 <>
//                   <PlayCircle className="h-3 w-3 mr-1" />
//                   Active
//                 </>
//               ) : (
//                 <>
//                   <Archive className="h-3 w-3 mr-1" />
//                   Ended
//                 </>
//               )}
//             </Badge>
//           </div>
//         </div>
//         <CardDescription className="line-clamp-2 h-10 pt-1">
//           {session.description || 'No description provided.'}
//         </CardDescription>
//       </CardHeader>
      
//       <CardContent className="flex-grow">
//         <div className="space-y-3">
//           {/* Session Stats */}
//           <div className="grid grid-cols-3 gap-2 text-sm text-slate-500">
//             <div className="flex items-center">
//               <Users className="h-4 w-4 mr-1.5" />
//               {session._count.participants}
//             </div>
//             <div className="flex items-center">
//               <FileText className="h-4 w-4 mr-1.5" />
//               {session._count.files}
//             </div>
//             <div className="flex items-center">
//               <MessageSquare className="h-4 w-4 mr-1.5" />
//               {session._count.messages}
//             </div>
//           </div>

//           {/* Session Timing */}
//           <div className="text-sm text-slate-600">
//             {isEnded ? (
//               <div className="space-y-1">
//                 <div className="flex items-center">
//                   <Timer className="h-4 w-4 mr-1.5" />
//                   Duration: {getSessionDuration(session.createdAt, session.lastActivity)}
//                 </div>
//                 <div className="flex items-center">
//                   <Calendar className="h-4 w-4 mr-1.5" />
//                   Ended: {getRelativeTime(session.lastActivity)}
//                 </div>
//               </div>
//             ) : (
//               <div className="flex items-center">
//                 <Clock className="h-4 w-4 mr-1.5" />
//                 Last active: {getRelativeTime(session.lastActivity)}
//               </div>
//             )}
//           </div>

//           {/* Owner */}
//           <div className="flex items-center text-sm text-slate-600">
//             {session.owner.id === user?.id ? (
//               <>
//                 <Crown className="h-4 w-4 mr-1.5 text-yellow-600" />
//                 Your session
//               </>
//             ) : (
//               <>
//                 <Users className="h-4 w-4 mr-1.5" />
//                 By {session.owner.displayName}
//               </>
//             )}
//           </div>
//         </div>
//       </CardContent>
      
//       <CardFooter className="border-t border-slate-200/80 pt-4">
//         <div className="flex w-full space-x-2">
//           {isEnded ? (
//             <>
//               <Button variant="outline" className="flex-1" onClick={() => exportSession(session.id, session.title)}>
//                 <Download className="h-4 w-4 mr-2" />
//                 Export
//               </Button>
//               <Button variant="outline" size="icon" title="View Details">
//                 <Eye className="h-4 w-4" />
//               </Button>
//             </>
//           ) : (
//             <>
//               <Link href={`/session/${session.id}`} className="flex-1">
//                 <Button className="w-full">
//                   <PlayCircle className="h-4 w-4 mr-2" />
//                   Join Session
//                 </Button>
//               </Link>
//               {session.owner.id === user?.id && (
//                 <Button variant="outline" size="icon" title="Session Settings">
//                   <Settings className="h-4 w-4" />
//                 </Button>
//               )}
//             </>
//           )}
//         </div>
//       </CardFooter>
//     </Card>
//   )

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-slate-600 text-lg">Loading Dashboard...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-100">
//       {/* Header */}
//       <header className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-slate-200 z-40">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-2">
//               <div className="bg-blue-600 p-2 rounded-lg">
//                 <Users className="h-5 w-5 text-white" />
//               </div>
//               <h1 className="text-2xl font-bold text-slate-800">CollabIDE</h1>
//             </div>
//             <div className="flex items-center space-x-4">
//               <span className="hidden sm:block text-slate-700 font-medium">Welcome, {user?.displayName}!</span>
//               <Button variant="outline" onClick={logout}>
//                 <LogOut className="mr-2 h-4 w-4" />
//                 Sign out
//               </Button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//         <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
//           <div>
//             <h2 className="text-4xl font-extrabold text-slate-900">Your Sessions</h2>
//             <p className="mt-1 text-slate-500">Create, join, and manage your collaborative coding sessions.</p>
//             <div className="flex items-center space-x-4 mt-3">
//               <div className="flex items-center text-sm text-slate-600">
//                 <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
//                 {activeSessions.length} Active
//               </div>
//               <div className="flex items-center text-sm text-slate-600">
//                 <Archive className="h-4 w-4 mr-1 text-gray-600" />
//                 {endedSessions.length} Ended
//               </div>
//             </div>
//           </div>
//           <div className="flex space-x-3 mt-4 md:mt-0">
//             <Button 
//               variant="outline" 
//               onClick={() => setShowJoinModal(true)}
//               className="bg-accent"
//             >
//               <ExternalLink className="mr-2 h-4 w-4" />
//               Join Session
//             </Button>
//             <Link href="/session/create">
//               <Button>
//                 <Plus className="mr-2 h-4 w-4" />
//                 New Session
//               </Button>
//             </Link>
//           </div>
//         </div>
        
//         {/* Search bar */}
//         <div className="mb-6">
//           <div className="relative max-w-md">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
//             <Input
//               type="text"
//               placeholder="Search by title or creator..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 h-11 text-base"
//             />
//           </div>
//         </div>

//         {/* Tabs for Active/Ended Sessions */}
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
//             <TabsTrigger value="active" className="flex items-center">
//               <PlayCircle className="h-4 w-4 mr-2" />
//               Active Sessions ({activeSessions.length})
//             </TabsTrigger>
//             <TabsTrigger value="ended" className="flex items-center">
//               <Archive className="h-4 w-4 mr-2" />
//               Previous Sessions ({endedSessions.length})
//             </TabsTrigger>
//           </TabsList>

//           {/* Active Sessions Tab */}
//           <TabsContent value="active">
//             {activeSessions.length === 0 ? (
//               <div className="text-center py-20 border-2 border-dashed border-slate-300 rounded-xl bg-white/50">
//                 <PlayCircle className="h-16 w-16 mx-auto mb-4 text-slate-400" />
//                 <h3 className="text-2xl font-semibold text-slate-800">
//                   {searchTerm ? 'No Active Sessions Found' : 'No Active Sessions'}
//                 </h3>
//                 <p className="text-slate-500 mt-2">
//                   {searchTerm ? 'Try a different search term.' : 'Get started by creating your first session!'}
//                 </p>
//                 {!searchTerm && (
//                   <div className="mt-6">
//                     <Link href="/session/create">
//                       <Button size="lg">Create Your First Session</Button>
//                     </Link>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {activeSessions.map((session) => (
//                   <SessionCard key={session.id} session={session} />
//                 ))}
//               </div>
//             )}
//           </TabsContent>

//           {/* Ended Sessions Tab */}
//           <TabsContent value="ended">
//             {endedSessions.length === 0 ? (
//               <div className="text-center py-20 border-2 border-dashed border-slate-300 rounded-xl bg-white/50">
//                 <Archive className="h-16 w-16 mx-auto mb-4 text-slate-400" />
//                 <h3 className="text-2xl font-semibold text-slate-800">
//                   {searchTerm ? 'No Ended Sessions Found' : 'No Previous Sessions'}
//                 </h3>
//                 <p className="text-slate-500 mt-2">
//                   {searchTerm ? 'Try a different search term.' : 'Your completed sessions will appear here.'}
//                 </p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {endedSessions.map((session) => (
//                   <SessionCard key={session.id} session={session} isEnded={true} />
//                 ))}
//               </div>
//             )}
//           </TabsContent>
//         </Tabs>
//       </main>

//       {/* Join Session Modal */}
//       {showJoinModal && (
//         <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 animate-in fade-in-0">
//           <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md mx-4 border animate-in zoom-in-95">
//             <h2 className="text-2xl font-bold text-slate-900 mb-2">Join a Session</h2>
//             <p className="text-slate-500 mb-6">Enter a session ID or paste a link to join an active session.</p>
            
//             {joinError && (
//               <Alert variant="destructive" className="mb-4">
//                 <AlertDescription>{joinError}</AlertDescription>
//               </Alert>
//             )}

//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="session-id-input" className="block text-sm font-medium text-slate-700 mb-1">
//                   Session ID or Link
//                 </label>
//                 <div className="relative">
//                   <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
//                   <Input
//                     id="session-id-input"
//                     type="text"
//                     placeholder="e.g., abc123xyz or https://collab.example.com/session/abc123xyz"
//                     value={joinSessionId}
//                     onChange={(e) => setJoinSessionId(e.target.value)}
//                     className="pl-10 h-11 text-base"
//                     disabled={joinLoading}
//                   />
//                 </div>
//               </div>

//               <div className="flex justify-end space-x-3 pt-4">
//                 <Button 
//                   variant="ghost" 
//                   onClick={() => {
//                     setShowJoinModal(false)
//                     setJoinSessionId('')
//                     setJoinError('')
//                   }}
//                   disabled={joinLoading}
//                 >
//                   Cancel
//                 </Button>
//                 <Button 
//                   onClick={handleJoinSession}
//                   disabled={joinLoading || !joinSessionId.trim()}
//                   className="w-28"
//                 >
//                   {joinLoading ? (
//                     <div className="flex items-center justify-center">
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                       Joining...
//                     </div>
//                   ) : (
//                     'Join'
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }



'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Users, 
  Clock, 
  Settings, 
  Search,
  ExternalLink,
  Link as LinkIcon,
  LogOut,
  CheckCircle,
  XCircle,
  PlayCircle,
  Archive,
  Calendar,
  Timer,
  Crown,
  Eye,
  Download,
  MessageSquare, 
  FileText,
  Sparkles,
  Loader2,
  TrendingUp,
  Globe,
  Lock,
  Filter
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useToast } from '@/hooks/use-toast'

// Enhanced interface with session status
interface Session {
  id: string
  title: string
  description?: string
  type: 'PUBLIC' | 'PRIVATE'
  isActive: boolean
  createdAt: string
  updatedAt: string
  lastActivity: string
  owner: {
    id: string
    displayName: string
    email: string
  }
  _count: {
    participants: number
    files: number
    messages: number
  }
}
import Image from 'next/image';
export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('active')
  
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [joinSessionId, setJoinSessionId] = useState('')
  const [joinLoading, setJoinLoading] = useState(false)
  const [joinError, setJoinError] = useState('')

  useEffect(() => {
    fetchSessions()
    handleJoinFromUrl()
  }, [])

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/sessions', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions)
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
      toast({
        variant: "destructive",
        title: "Failed to load sessions",
        description: "Please refresh the page to try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleJoinSession = async () => {
    if (!joinSessionId.trim()) {
      setJoinError('Please enter a session ID or link')
      return
    }

    setJoinLoading(true)
    setJoinError('')

    try {
      let sessionId = joinSessionId.trim()
      const urlPattern = /\/session\/([a-zA-Z0-9]+)/
      const match = sessionId.match(urlPattern)
      if (match) {
        sessionId = match[1]
      }

      const token = localStorage.getItem('accessToken')
      const response = await fetch(`/api/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        if (!data.session.isActive) {
          setJoinError('This session has ended and is no longer available')
          return
        }
        
        toast({
          variant: "success",
          title: "Joining session...",
          description: `Redirecting to "${data.session.title}"`,
        })
        
        router.push(`/session/${sessionId}`)
        setShowJoinModal(false)
        setJoinSessionId('')
      } else {
        const data = await response.json()
        setJoinError(data.error || 'Failed to join session')
      }
    } catch (error) {
      setJoinError('Invalid session ID or link')
    } finally {
      setJoinLoading(false)
    }
  }

  const handleJoinFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const sessionId = urlParams.get('join')
    if (sessionId) {
      setJoinSessionId(sessionId)
      setShowJoinModal(true)
      window.history.replaceState({}, '', window.location.pathname)
    }
  }

  // Export ended session
  const exportSession = async (sessionId: string, title: string) => {
    try {
      toast({
        variant: "loading",
        title: "Preparing export...",
        description: "Creating downloadable archive",
      })

      const token = localStorage.getItem('accessToken')
      const response = await fetch(`/api/sessions/${sessionId}/export`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.zip`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        toast({
          variant: "success",
          title: "Export complete!",
          description: "Session files have been downloaded",
        })
      }
    } catch (error) {
      console.error('Export failed:', error)
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "Unable to export session files",
      })
    }
  }

  // Filter sessions by status and search term
  const activeSessions = sessions.filter(session => 
    session.isActive && 
    (session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     session.owner.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const endedSessions = sessions.filter(session => 
    !session.isActive && 
    (session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     session.owner.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Get session duration for ended sessions
  const getSessionDuration = (createdAt: string, lastActivity: string) => {
    const start = new Date(createdAt)
    const end = new Date(lastActivity)
    const diffMs = end.getTime() - start.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMins % 60}m`
    }
    return `${diffMins}m`
  }

  // Get relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    return 'Just now'
  }

  const SessionCard = ({ session, isEnded = false }: { session: Session, isEnded?: boolean }) => (
    <Card className={`group bg-white/90 backdrop-blur-sm border transition-all duration-300 hover:shadow-xl ${
      isEnded 
        ? 'border-slate-200/70 hover:border-slate-300' 
        : 'border-slate-200/70 hover:border-blue-300 hover:-translate-y-1'
    } ${!isEnded ? 'hover:bg-white/95' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3">
          <CardTitle className={`text-lg font-semibold line-clamp-2 leading-tight ${
            isEnded ? 'text-slate-600' : 'text-slate-800'
          }`}>
            {session.title}
          </CardTitle>
          <div className="flex flex-col space-y-1.5 flex-shrink-0">
            <Badge 
              variant={session.type === 'PUBLIC' ? 'success' : 'secondary'}
              className="text-xs font-medium"
            >
              {session.type === 'PUBLIC' ? (
                <>
                  <Globe className="h-3 w-3 mr-1" />
                  Public
                </>
              ) : (
                <>
                  <Lock className="h-3 w-3 mr-1" />
                  Private
                </>
              )}
            </Badge>
            <Badge className={`text-xs font-medium ${
              session.isActive 
                ? 'bg-green-100 text-green-700 border-green-200' 
                : 'bg-gray-100 text-gray-600 border-gray-200'
            }`}>
              {session.isActive ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse" />
                  Active
                </>
              ) : (
                <>
                  <Archive className="h-3 w-3 mr-1" />
                  Ended
                </>
              )}
            </Badge>
          </div>
        </div>
        {session.description && (
          <CardDescription className="line-clamp-2 text-sm leading-relaxed mt-2">
            {session.description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="space-y-4">
          {/* Session Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-2 bg-slate-50 rounded-lg">
              <Users className="h-4 w-4 text-slate-500 mb-1" />
              <span className="text-sm font-medium text-slate-700">{session._count.participants}</span>
              <span className="text-xs text-slate-500">Users</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-slate-50 rounded-lg">
              <FileText className="h-4 w-4 text-slate-500 mb-1" />
              <span className="text-sm font-medium text-slate-700">{session._count.files}</span>
              <span className="text-xs text-slate-500">Files</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-slate-50 rounded-lg">
              <MessageSquare className="h-4 w-4 text-slate-500 mb-1" />
              <span className="text-sm font-medium text-slate-700">{session._count.messages}</span>
              <span className="text-xs text-slate-500">Messages</span>
            </div>
          </div>

          {/* Session Timing */}
          <div className="space-y-2">
            {isEnded ? (
              <>
                <div className="flex items-center text-sm text-slate-600">
                  <Timer className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="font-medium">Duration:</span>
                  <span className="ml-1">{getSessionDuration(session.createdAt, session.lastActivity)}</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium">Ended:</span>
                  <span className="ml-1">{getRelativeTime(session.lastActivity)}</span>
                </div>
              </>
            ) : (
              <div className="flex items-center text-sm text-slate-600">
                <Clock className="h-4 w-4 mr-2 text-green-500" />
                <span className="font-medium">Last active:</span>
                <span className="ml-1">{getRelativeTime(session.lastActivity)}</span>
              </div>
            )}
          </div>

          {/* Owner */}
          <div className="flex items-center text-sm">
            {session.owner.id === user?.id ? (
              <div className="flex items-center text-amber-700 bg-amber-50 px-2 py-1 rounded-lg">
                <Crown className="h-4 w-4 mr-1.5" />
                <span className="font-medium">Your session</span>
              </div>
            ) : (
              <div className="flex items-center text-slate-600">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-2">
                  <span className="text-xs font-medium text-white">
                    {session.owner.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span>Created by <span className="font-medium">{session.owner.displayName}</span></span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-slate-100 pt-4">
        <div className="flex w-full gap-2">
          {isEnded ? (
            <>
              <Button 
                variant="outline" 
                className="flex-1 hover:bg-blue-50 hover:border-blue-300" 
                onClick={() => exportSession(session.id, session.title)}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="icon" className="hover:bg-slate-100" title="View Details">
                <Eye className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href={`/session/${session.id}`} className="flex-1">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-sm">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Join Session
                </Button>
              </Link>
              {session.owner.id === user?.id && (
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="hover:bg-slate-100" 
                  title="Session Settings"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  )

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6">
              <Sparkles className="h-8 w-8 text-white animate-pulse" />
            </div>
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Loading Dashboard</h2>
            </div>
            <p className="text-gray-600">Fetching your collaborative sessions...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        {/* Enhanced Header */}
        <header className="sticky top-0 bg-white/95 backdrop-blur-lg border-b border-slate-200/60 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                
                <Image
      src="/logo.png" // ✅ Relative to public/
      alt="CollabIDE Logo"
      width={60}
      height={60}
    />
                
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    CollabIDE
                  </h1>
                  <p className="text-xs text-slate-500 hidden sm:block">Collaborative Development</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-3 bg-slate-100 rounded-full px-4 py-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.displayName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-slate-700 font-medium">{user?.displayName}</span>
                </div>
                <Button variant="ghost" onClick={logout} className="hover:bg-red-50 hover:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Sign out</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl mb-6 shadow-lg">
              <Users className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-slate-900 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Your Collaboration Hub
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Create, join, and manage your collaborative coding sessions with ease. 
              Build amazing projects together with your team in real-time.
            </p>
            
            {/* Quick Stats */}
            <div className="flex justify-center space-x-8 mb-8">
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">{activeSessions.length} Active</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200">
                <Archive className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{endedSessions.length} Completed</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">{sessions.length} Total</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/session/create">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg px-8">
                  <Plus className="mr-2 h-5 w-5" />
                  Create New Session
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setShowJoinModal(true)}
                className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 px-8"
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                Join Session
              </Button>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search sessions or creators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base bg-white/80 backdrop-blur-sm border-slate-200 focus:border-blue-300"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <span className="text-sm text-slate-500">Showing {activeTab === 'active' ? activeSessions.length : endedSessions.length} sessions</span>
            </div>
          </div>

          {/* Enhanced Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-2 mb-8 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="active" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                <PlayCircle className="h-4 w-4" />
                <span>Active Sessions</span>
                <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700 text-xs">
                  {activeSessions.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="ended" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-500 data-[state=active]:to-gray-600 data-[state=active]:text-white">
                <Archive className="h-4 w-4" />
                <span>Previous Sessions</span>
                <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-700 text-xs">
                  {endedSessions.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* Active Sessions Tab */}
            <TabsContent value="active">
              {activeSessions.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-slate-300 rounded-2xl bg-white/50 backdrop-blur-sm">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6">
                    <PlayCircle className="h-10 w-10 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-800 mb-3">
                    {searchTerm ? 'No Active Sessions Found' : 'No Active Sessions Yet'}
                  </h3>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto">
                    {searchTerm 
                      ? 'Try adjusting your search terms or check back later.' 
                      : 'Start collaborating by creating your first session or joining an existing one!'
                    }
                  </p>
                  {!searchTerm && (
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <Link href="/session/create">
                        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          <Plus className="mr-2 h-5 w-5" />
                          Create Your First Session
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="lg"
                        onClick={() => setShowJoinModal(true)}
                        className="border-blue-200 hover:bg-blue-50"
                      >
                        <ExternalLink className="mr-2 h-5 w-5" />
                        Join a Session
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeSessions.map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Ended Sessions Tab */}
            <TabsContent value="ended">
              {endedSessions.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-slate-300 rounded-2xl bg-white/50 backdrop-blur-sm">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-100 to-slate-100 rounded-full mb-6">
                    <Archive className="h-10 w-10 text-gray-500" />
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-800 mb-3">
                    {searchTerm ? 'No Previous Sessions Found' : 'No Previous Sessions'}
                  </h3>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto">
                    {searchTerm 
                      ? 'Try adjusting your search terms.' 
                      : 'Your completed collaboration sessions will appear here for review and export.'
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {endedSessions.map((session) => (
                    <SessionCard key={session.id} session={session} isEnded={true} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>

        {/* Enhanced Join Session Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 animate-in fade-in-0 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border animate-in zoom-in-95 slide-in-from-bottom-4">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4">
                  <ExternalLink className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Join a Session</h2>
                <p className="text-slate-600">Enter a session ID or paste a session link to join an active collaboration.</p>
              </div>
              
              {joinError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{joinError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-6">
                <div>
                  <label htmlFor="session-id-input" className="block text-sm font-medium text-slate-700 mb-2">
                    Session ID or Link
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <Input
                      id="session-id-input"
                      type="text"
                      placeholder="e.g., abc123xyz or full session URL"
                      value={joinSessionId}
                      onChange={(e) => setJoinSessionId(e.target.value)}
                      className="pl-10 h-12 text-base"
                      disabled={joinLoading}
                      onKeyPress={(e) => e.key === 'Enter' && handleJoinSession()}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    You can paste either the session ID or the complete session URL
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setShowJoinModal(false)
                      setJoinSessionId('')
                      setJoinError('')
                    }}
                    disabled={joinLoading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleJoinSession}
                    disabled={joinLoading || !joinSessionId.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 min-w-[100px]"
                  >
                    {joinLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Join
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
