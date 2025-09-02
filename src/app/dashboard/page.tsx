// 'use client'

// import { useEffect, useState } from 'react'
// import { useAuth } from '@/contexts/auth-context'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Badge } from '@/components/ui/badge'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
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
//   PlayCircle,
//   Archive,
//   Calendar,
//   Timer,
//   Crown,
//   Eye,
//   Download,
//   MessageSquare, 
//   FileText,
//   Sparkles,
//   Loader2,
//   TrendingUp,
//   Globe,
//   Lock,
//   Filter,
//   AlertCircle,
//   Share,
//   Code,
//   Zap
// } from 'lucide-react'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { ProtectedRoute } from '@/components/ProtectedRoute'
// import { cn } from '@/lib/utils'
// import { toast } from 'sonner'

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
//       toast.error("Failed to load sessions. Please refresh the page to try again.")
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
        
//         toast.success(`Joining "${data.session.title}"...`)
        
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
//       toast.loading("Preparing export...")

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
        
//         toast.success("Session files have been downloaded!")
//       }
//     } catch (error) {
//       console.error('Export failed:', error)
//       toast.error("Unable to export session files")
//     }
//   }

//   // Copy session link
//   const copySessionLink = async (sessionId: string) => {
//     try {
//       const link = `${window.location.origin}/session/${sessionId}`
//       await navigator.clipboard.writeText(link)
//       toast.success("Session link copied to clipboard!")
//     } catch (error) {
//       toast.error("Failed to copy link")
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
//     <Card className={cn(
//       "group transition-all duration-300 hover:shadow-lg border-0 bg-card/50 backdrop-blur-sm min-w-[320px] max-w-md",
//       isEnded 
//         ? 'hover:border-muted-foreground/20' 
//         : 'hover:border-primary/30 hover:-translate-y-1 hover:shadow-primary/5'
//     )}>
//       <CardHeader className="pb-4">
//         <div className="flex justify-between items-start gap-3">
//           <CardTitle className={cn(
//             "text-lg line-clamp-2 leading-tight transition-colors duration-200",
//             isEnded ? 'text-muted-foreground' : 'text-foreground group-hover:text-primary'
//           )}>
//             {session.title}
//           </CardTitle>
//           <div className="flex flex-col space-y-2 flex-shrink-0">
//             <Badge variant={session.type === 'PUBLIC' ? 'default' : 'secondary'} className="text-xs">
//               {session.type === 'PUBLIC' ? (
//                 <>
//                   <Globe className="h-3 w-3 mr-1" />
//                   Public
//                 </>
//               ) : (
//                 <>
//                   <Lock className="h-3 w-3 mr-1" />
//                   Private
//                 </>
//               )}
//             </Badge>
//             <Badge variant={session.isActive ? 'default' : 'secondary'} className="text-xs">
//               {session.isActive ? (
//                 <>
//                   <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse" />
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
//         {session.description && (
//           <CardDescription className="line-clamp-2 text-sm leading-relaxed mt-2">
//             {session.description}
//           </CardDescription>
//         )}
//       </CardHeader>
      
//       <CardContent className="space-y-4">
//         {/* Session Stats */}
//         <div className="grid grid-cols-3 gap-3">
//           <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg transition-all duration-200 hover:bg-muted/40">
//             <Users className="h-4 w-4 text-muted-foreground mb-1" />
//             <span className="text-sm font-medium">{session._count.participants}</span>
//             <span className="text-xs text-muted-foreground">Users</span>
//           </div>
//           <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg transition-all duration-200 hover:bg-muted/40">
//             <FileText className="h-4 w-4 text-muted-foreground mb-1" />
//             <span className="text-sm font-medium">{session._count.files}</span>
//             <span className="text-xs text-muted-foreground">Files</span>
//           </div>
//           <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg transition-all duration-200 hover:bg-muted/40">
//             <MessageSquare className="h-4 w-4 text-muted-foreground mb-1" />
//             <span className="text-sm font-medium">{session._count.messages}</span>
//             <span className="text-xs text-muted-foreground">Messages</span>
//           </div>
//         </div>

//         {/* Session Timing */}
//         <div className="space-y-2">
//           {isEnded ? (
//             <>
//               <div className="flex items-center text-sm text-muted-foreground">
//                 <Timer className="h-4 w-4 mr-2 text-blue-500" />
//                 <span className="font-medium">Duration:</span>
//                 <span className="ml-1">{getSessionDuration(session.createdAt, session.lastActivity)}</span>
//               </div>
//               <div className="flex items-center text-sm text-muted-foreground">
//                 <Calendar className="h-4 w-4 mr-2" />
//                 <span className="font-medium">Ended:</span>
//                 <span className="ml-1">{getRelativeTime(session.lastActivity)}</span>
//               </div>
//             </>
//           ) : (
//             <div className="flex items-center text-sm text-muted-foreground">
//               <Clock className="h-4 w-4 mr-2 text-green-500" />
//               <span className="font-medium">Last active:</span>
//               <span className="ml-1">{getRelativeTime(session.lastActivity)}</span>
//             </div>
//           )}
//         </div>

//         {/* Owner */}
//         <div className="flex items-center text-sm">
//           {session.owner.id === user?.id ? (
//             <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
//               <Crown className="h-3 w-3 mr-1" />
//               Your session
//             </Badge>
//           ) : (
//             <div className="flex items-center text-muted-foreground">
//               <div className="w-6 h-6 bg-gradient-to-r from-primary to-purple-500 rounded-full flex items-center justify-center mr-2">
//                 <span className="text-xs font-medium text-white">
//                   {session.owner.displayName.charAt(0).toUpperCase()}
//                 </span>
//               </div>
//               <span>Created by <span className="font-medium text-foreground">{session.owner.displayName}</span></span>
//             </div>
//           )}
//         </div>

//         {/* Action Buttons */}
//         <div className="flex w-full gap-2 pt-2 border-t">
//           {isEnded ? (
//             <>
//               <Button 
//                 variant="outline" 
//                 size="sm"
//                 className="flex-1 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 dark:hover:bg-blue-900/20" 
//                 onClick={() => exportSession(session.id, session.title)}
//               >
//                 <Download className="h-4 w-4 mr-2" />
//                 Export
//               </Button>
//               <Button 
//                 variant="outline" 
//                 size="sm"
//                 className="hover:bg-muted/50"
//               >
//                 <Eye className="h-4 w-4" />
//               </Button>
//             </>
//           ) : (
//             <>
//               <Button asChild size="sm" className="flex-1">
//                 <Link href={`/session/${session.id}`}>
//                   <PlayCircle className="h-4 w-4 mr-2" />
//                   Join Session
//                 </Link>
//               </Button>
//               <Button 
//                 variant="outline" 
//                 size="sm"
//                 onClick={() => copySessionLink(session.id)}
//                 className="hover:bg-muted/50"
//               >
//                 <Share className="h-4 w-4" />
//               </Button>
//               {session.owner.id === user?.id && (
//                 <Button 
//                   variant="outline" 
//                   size="sm"
//                   className="hover:bg-muted/50"
//                 >
//                   <Settings className="h-4 w-4" />
//                 </Button>
//               )}
//             </>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   )

//   if (loading) {
//     return (
//       <ProtectedRoute>
//         <div className="min-h-screen bg-background flex items-center justify-center">
//           {/* Background Elements */}
//           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
//           <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-primary/10 animate-pulse" />
          
//           <div className="w-full max-w-md mx-auto p-4">
//             <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur relative z-10">
//               <CardHeader className="text-center pb-6">
//                 <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
//                   <Code className="w-6 h-6 text-primary-foreground" />
//                 </div>
                
//                 <div className="mx-auto mb-6 p-4 bg-primary/10 rounded-full w-fit">
//                   <Sparkles className="h-10 w-10 text-primary animate-pulse" />
//                 </div>
                
//                 <CardTitle className="text-2xl font-bold mb-3">Loading Dashboard</CardTitle>
//                 <CardDescription className="text-lg">
//                   Fetching your collaborative sessions...
//                 </CardDescription>
//               </CardHeader>
              
//               <CardContent className="text-center">
//                 <div className="flex items-center justify-center space-x-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
//                   <Loader2 className="h-5 w-5 animate-spin text-primary" />
//                   <span className="text-sm text-primary font-medium">Loading workspace...</span>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </ProtectedRoute>
//     )
//   }

//   return (
//     <ProtectedRoute>
//       {/* Main Container - PROPERLY CENTERED */}
//       <div className="min-h-screen bg-background">
//         {/* Background Elements */}
//         <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
//         <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-primary/10 animate-pulse" />
//         <div className="fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl bg-purple-500/10 animate-pulse" style={{ animationDelay: '2s' }} />
        
//         {/* Header */}
//         <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//           <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex h-16 items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
//                   <Code className="w-5 h-5 text-primary-foreground" />
//                 </div>
//                 <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
//                   CollabIDE
//                 </span>
//               </div>
              
//               <div className="flex items-center space-x-4">
//                 <div className="hidden sm:flex items-center space-x-3 bg-muted/50 rounded-full px-4 py-2">
//                   <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-500 rounded-full flex items-center justify-center">
//                     <span className="text-sm font-medium text-white">
//                       {user?.displayName?.charAt(0).toUpperCase()}
//                     </span>
//                   </div>
//                   <span className="font-medium">{user?.displayName}</span>
//                 </div>
//                 <Button variant="ghost" onClick={logout}>
//                   <LogOut className="mr-2 h-4 w-4" />
//                   <span className="hidden sm:inline">Sign out</span>
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Main Content - CENTERED WITH PROPER CONSTRAINTS */}
//         <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl relative z-10">
//           {/* Hero Section - PERFECTLY CENTERED */}
//           <div className="text-center mb-16">
//             <div className="w-20 h-20 bg-gradient-to-r from-primary via-purple-500 to-accent rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
//               <Users className="h-10 w-10 text-white" />
//             </div>
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent mb-6">
//               Your Collaboration Hub
//             </h1>
//             <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
//               Create, join, and manage your collaborative coding sessions with ease. 
//               Build amazing projects together with your team in real-time.
//             </p>
            
//             {/* Quick Stats - CENTERED */}
//             <div className="flex flex-wrap justify-center gap-4 mb-10">
//               <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-4 py-2 text-sm">
//                 <CheckCircle className="h-4 w-4 mr-2" />
//                 {activeSessions.length} Active
//               </Badge>
//               <Badge variant="secondary" className="px-4 py-2 text-sm">
//                 <Archive className="h-4 w-4 mr-2" />
//                 {endedSessions.length} Completed
//               </Badge>
//               <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm">
//                 <TrendingUp className="h-4 w-4 mr-2" />
//                 {sessions.length} Total
//               </Badge>
//             </div>

//             {/* Action Buttons - CENTERED */}
//             <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
//               <Button asChild size="lg" className="flex-1 sm:flex-none px-8 h-14 text-base font-semibold">
//                 <Link href="/session/create">
//                   <Plus className="mr-2 h-5 w-5" />
//                   Create New Session
//                 </Link>
//               </Button>
              
//               <Dialog open={showJoinModal} onOpenChange={setShowJoinModal}>
//                 <DialogTrigger asChild>
//                   <Button variant="outline" size="lg" className="flex-1 sm:flex-none px-8 h-14 text-base font-semibold">
//                     <ExternalLink className="mr-2 h-5 w-5" />
//                     Join Session
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="sm:max-w-md">
//                   <DialogHeader>
//                     <div className="w-16 h-16 bg-gradient-to-r from-primary to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                       <ExternalLink className="h-8 w-8 text-white" />
//                     </div>
//                     <DialogTitle className="text-2xl font-bold text-center">Join a Session</DialogTitle>
//                     <DialogDescription className="text-center">
//                       Enter a session ID or paste a session link to join an active collaboration.
//                     </DialogDescription>
//                   </DialogHeader>
                  
//                   <div className="space-y-6">
//                     {joinError && (
//                       <Alert variant="destructive">
//                         <AlertCircle className="h-4 w-4" />
//                         <AlertDescription>{joinError}</AlertDescription>
//                       </Alert>
//                     )}

//                     <div className="space-y-2">
//                       <Label htmlFor="session-id-input">Session ID or Link</Label>
//                       <div className="relative">
//                         <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
//                         <Input
//                           id="session-id-input"
//                           type="text"
//                           placeholder="e.g., abc123xyz or full session URL"
//                           value={joinSessionId}
//                           onChange={(e) => setJoinSessionId(e.target.value)}
//                           className="pl-10"
//                           disabled={joinLoading}
//                           onKeyPress={(e) => e.key === 'Enter' && handleJoinSession()}
//                         />
//                       </div>
//                       <p className="text-xs text-muted-foreground">
//                         You can paste either the session ID or the complete session URL
//                       </p>
//                     </div>

//                     <div className="flex justify-end space-x-3">
//                       <Button 
//                         variant="ghost" 
//                         onClick={() => {
//                           setShowJoinModal(false)
//                           setJoinSessionId('')
//                           setJoinError('')
//                         }}
//                         disabled={joinLoading}
//                       >
//                         Cancel
//                       </Button>
//                       <Button 
//                         onClick={handleJoinSession}
//                         disabled={joinLoading || !joinSessionId.trim()}
//                       >
//                         {joinLoading ? (
//                           <>
//                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                             Joining...
//                           </>
//                         ) : (
//                           <>
//                             <ExternalLink className="mr-2 h-4 w-4" />
//                             Join
//                           </>
//                         )}
//                       </Button>
//                     </div>
//                   </div>
//                 </DialogContent>
//               </Dialog>
//             </div>
//           </div>
          
//           {/* Search and Filter - CENTERED */}
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 max-w-4xl mx-auto">
//             <div className="relative w-full sm:max-w-md">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
//               <Input
//                 type="text"
//                 placeholder="Search sessions or creators..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//             <Badge variant="outline" className="flex items-center gap-2 whitespace-nowrap">
//               <Filter className="h-4 w-4" />
//               Showing {activeTab === 'active' ? activeSessions.length : endedSessions.length} sessions
//             </Badge>
//           </div>

//           {/* Tabs - CENTERED */}
//           <div className="max-w-2xl mx-auto mb-8">
//             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//               <TabsList className="grid w-full grid-cols-2">
//                 <TabsTrigger value="active" className="flex items-center space-x-2">
//                   <PlayCircle className="h-4 w-4" />
//                   <span>Active Sessions</span>
//                   <Badge variant="secondary" className="ml-2 text-xs">
//                     {activeSessions.length}
//                   </Badge>
//                 </TabsTrigger>
//                 <TabsTrigger value="ended" className="flex items-center space-x-2">
//                   <Archive className="h-4 w-4" />
//                   <span>Previous Sessions</span>
//                   <Badge variant="secondary" className="ml-2 text-xs">
//                     {endedSessions.length}
//                   </Badge>
//                 </TabsTrigger>
//               </TabsList>

//               {/* Active Sessions Tab */}
//               <TabsContent value="active" className="mt-8">
//                 {activeSessions.length === 0 ? (
//                   <Card className="text-center py-16 border-2 border-dashed max-w-2xl mx-auto">
//                     <CardContent className="space-y-6">
//                       <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
//                         <PlayCircle className="h-10 w-10 text-primary" />
//                       </div>
//                       <div>
//                         <CardTitle className="text-2xl mb-3">
//                           {searchTerm ? 'No Active Sessions Found' : 'No Active Sessions Yet'}
//                         </CardTitle>
//                         <CardDescription className="mb-8">
//                           {searchTerm 
//                             ? 'Try adjusting your search terms or check back later.' 
//                             : 'Start collaborating by creating your first session or joining an existing one!'
//                           }
//                         </CardDescription>
//                       </div>
//                       {!searchTerm && (
//                         <div className="flex flex-col sm:flex-row justify-center gap-4">
//                           <Button asChild size="lg">
//                             <Link href="/session/create">
//                               <Plus className="mr-2 h-5 w-5" />
//                               Create Your First Session
//                             </Link>
//                           </Button>
//                           <Button 
//                             variant="outline" 
//                             size="lg"
//                             onClick={() => setShowJoinModal(true)}
//                           >
//                             <ExternalLink className="mr-2 h-5 w-5" />
//                             Join a Session
//                           </Button>
//                         </div>
//                       )}
//                     </CardContent>
//                   </Card>
//                 ) : (
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {activeSessions.map((session) => (
//                       <SessionCard key={session.id} session={session} />
//                     ))}
//                   </div>
//                 )}
//               </TabsContent>

//               {/* Ended Sessions Tab */}
//               <TabsContent value="ended" className="mt-8">
//                 {endedSessions.length === 0 ? (
//                   <Card className="text-center py-16 border-2 border-dashed max-w-2xl mx-auto">
//                     <CardContent className="space-y-6">
//                       <div className="w-20 h-20 bg-muted-foreground/10 rounded-full flex items-center justify-center mx-auto">
//                         <Archive className="h-10 w-10 text-muted-foreground" />
//                       </div>
//                       <div>
//                         <CardTitle className="text-2xl mb-3">
//                           {searchTerm ? 'No Previous Sessions Found' : 'No Previous Sessions'}
//                         </CardTitle>
//                         <CardDescription className="mb-8">
//                           {searchTerm 
//                             ? 'Try adjusting your search terms.' 
//                             : 'Your completed collaboration sessions will appear here for review and export.'
//                           }
//                         </CardDescription>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ) : (
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {endedSessions.map((session) => (
//                       <SessionCard key={session.id} session={session} isEnded={true} />
//                     ))}
//                   </div>
//                 )}
//               </TabsContent>
//             </Tabs>
//           </div>
//         </main>

//         {/* Footer - CENTERED */}
//         <div className="flex justify-center py-8 relative z-10">
//           <Badge variant="outline" className="flex items-center gap-2">
//             <Zap className="h-3 w-3 text-red-500" />
//             <span>Built with love for developers worldwide</span>
//           </Badge>
//         </div>
//       </div>
//     </ProtectedRoute>
//   )
// }


'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
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
  Filter,
  AlertCircle,
  Share,
  Code,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

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

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
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
      toast.error("Failed to load sessions. Please refresh the page to try again.")
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
        
        toast.success(`Joining "${data.session.title}"...`)
        
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
      toast.loading("Preparing export...")

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
        
        toast.success("Session files have been downloaded!")
      }
    } catch (error) {
      console.error('Export failed:', error)
      toast.error("Unable to export session files")
    }
  }

  // Copy session link
  const copySessionLink = async (sessionId: string) => {
    try {
      const link = `${window.location.origin}/session/${sessionId}`
      await navigator.clipboard.writeText(link)
      toast.success("Session link copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy link")
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
    <Card className={cn(
      "group transition-all duration-300 hover:shadow-xl border-0 bg-card/50 backdrop-blur-sm h-full w-full",
      isEnded 
        ? 'hover:border-muted-foreground/20' 
        : 'hover:border-primary/30 hover:-translate-y-2 hover:shadow-primary/10'
    )}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-3">
          <CardTitle className={cn(
            "text-xl line-clamp-2 leading-tight transition-colors duration-200",
            isEnded ? 'text-muted-foreground' : 'text-foreground group-hover:text-primary'
          )}>
            {session.title}
          </CardTitle>
          <div className="flex flex-col space-y-2 flex-shrink-0">
            <Badge variant={session.type === 'PUBLIC' ? 'default' : 'secondary'} className="text-xs">
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
            <Badge variant={session.isActive ? 'default' : 'secondary'} className="text-xs">
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
      
      <CardContent className="space-y-6">
        {/* Session Stats */}
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg transition-all duration-200 hover:bg-muted/40">
            <Users className="h-5 w-5 text-muted-foreground mb-2" />
            <span className="text-lg font-semibold">{session._count.participants}</span>
            <span className="text-xs text-muted-foreground">Users</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg transition-all duration-200 hover:bg-muted/40">
            <FileText className="h-5 w-5 text-muted-foreground mb-2" />
            <span className="text-lg font-semibold">{session._count.files}</span>
            <span className="text-xs text-muted-foreground">Files</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg transition-all duration-200 hover:bg-muted/40">
            <MessageSquare className="h-5 w-5 text-muted-foreground mb-2" />
            <span className="text-lg font-semibold">{session._count.messages}</span>
            <span className="text-xs text-muted-foreground">Messages</span>
          </div>
        </div>

        {/* Session Timing */}
        <div className="space-y-3">
          {isEnded ? (
            <>
              <div className="flex items-center text-sm text-muted-foreground">
                <Timer className="h-4 w-4 mr-3 text-blue-500" />
                <span className="font-medium">Duration:</span>
                <span className="ml-2">{getSessionDuration(session.createdAt, session.lastActivity)}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-3" />
                <span className="font-medium">Ended:</span>
                <span className="ml-2">{getRelativeTime(session.lastActivity)}</span>
              </div>
            </>
          ) : (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-3 text-green-500" />
              <span className="font-medium">Last active:</span>
              <span className="ml-2">{getRelativeTime(session.lastActivity)}</span>
            </div>
          )}
        </div>

        {/* Owner */}
        <div className="flex items-center text-sm">
          {session.owner.id === user?.id ? (
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
              <Crown className="h-3 w-3 mr-1" />
              Your session
            </Badge>
          ) : (
            <div className="flex items-center text-muted-foreground">
              <div className="w-7 h-7 bg-gradient-to-r from-primary to-purple-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm font-medium text-white">
                  {session.owner.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              <span>Created by <span className="font-medium text-foreground">{session.owner.displayName}</span></span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex w-full gap-3 pt-4 border-t">
          {isEnded ? (
            <>
              <Button 
                variant="outline" 
                size="default"
                className="flex-1 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 dark:hover:bg-blue-900/20" 
                onClick={() => exportSession(session.id, session.title)}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button 
                variant="outline" 
                size="default"
                className="hover:bg-muted/50 px-4"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button asChild size="default" className="flex-1">
                <Link href={`/session/${session.id}`}>
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Join Session
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="default"
                onClick={() => copySessionLink(session.id)}
                className="hover:bg-muted/50 px-4"
              >
                <Share className="h-4 w-4" />
              </Button>
              {session.owner.id === user?.id && (
                <Button 
                  variant="outline" 
                  size="default"
                  className="hover:bg-muted/50 px-4"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-primary/10 animate-pulse" />
          
          <div className="w-full max-w-md mx-auto p-4">
            <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur relative z-10">
              <CardHeader className="text-center pb-6">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Code className="w-6 h-6 text-primary-foreground" />
                </div>
                
                <div className="mx-auto mb-6 p-4 bg-primary/10 rounded-full w-fit">
                  <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                </div>
                
                <CardTitle className="text-2xl font-bold mb-3">Loading Dashboard</CardTitle>
                <CardDescription className="text-lg">
                  Fetching your collaborative sessions...
                </CardDescription>
              </CardHeader>
              
              <CardContent className="text-center">
                <div className="flex items-center justify-center space-x-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-sm text-primary font-medium">Loading workspace...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      {/* Main Container */}
      <div className="min-h-screen bg-background">
        {/* Background Elements */}
        <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
        <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-primary/10 animate-pulse" />
        <div className="fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl bg-purple-500/10 animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  CollabIDE
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-3 bg-muted/50 rounded-full px-4 py-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.displayName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium">{user?.displayName}</span>
                </div>
                <Button variant="ghost" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Sign out</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 sm:px-8 lg:px-12 py-12 max-w-[1600px] relative z-10">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="w-24 h-24 bg-gradient-to-r from-primary via-purple-500 to-accent rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Users className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent mb-8">
              Your Collaboration Hub
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed">
              Create, join, and manage your collaborative coding sessions with ease. 
              Build amazing projects together with your team in real-time.
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-6 py-3 text-base">
                <CheckCircle className="h-5 w-5 mr-2" />
                {activeSessions.length} Active
              </Badge>
              <Badge variant="secondary" className="px-6 py-3 text-base">
                <Archive className="h-5 w-5 mr-2" />
                {endedSessions.length} Completed
              </Badge>
              <Badge className="bg-primary/10 text-primary border-primary/20 px-6 py-3 text-base">
                <TrendingUp className="h-5 w-5 mr-2" />
                {sessions.length} Total
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-2xl mx-auto">
              <Button asChild size="lg" className="flex-1 sm:flex-none px-10 h-16 text-lg font-semibold">
                <Link href="/session/create">
                  <Plus className="mr-3 h-6 w-6" />
                  Create New Session
                </Link>
              </Button>
              
              <Dialog open={showJoinModal} onOpenChange={setShowJoinModal}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg" className="flex-1 sm:flex-none px-10 h-16 text-lg font-semibold">
                    <ExternalLink className="mr-3 h-6 w-6" />
                    Join Session
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <ExternalLink className="h-8 w-8 text-white" />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-center">Join a Session</DialogTitle>
                    <DialogDescription className="text-center">
                      Enter a session ID or paste a session link to join an active collaboration.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {joinError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{joinError}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="session-id-input">Session ID or Link</Label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                          id="session-id-input"
                          type="text"
                          placeholder="e.g., abc123xyz or full session URL"
                          value={joinSessionId}
                          onChange={(e) => setJoinSessionId(e.target.value)}
                          className="pl-10"
                          disabled={joinLoading}
                          onKeyPress={(e) => e.key === 'Enter' && handleJoinSession()}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        You can paste either the session ID or the complete session URL
                      </p>
                    </div>

                    <div className="flex justify-end space-x-3">
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
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-12 max-w-6xl mx-auto">
            <div className="relative w-full sm:max-w-lg">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search sessions or creators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>
            <Badge variant="outline" className="flex items-center gap-2 whitespace-nowrap px-4 py-2">
              <Filter className="h-4 w-4" />
              Showing {activeTab === 'active' ? activeSessions.length : endedSessions.length} sessions
            </Badge>
          </div>

          {/* Tabs */}
          <div className="max-w-3xl mx-auto mb-12">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-14">
                <TabsTrigger value="active" className="flex items-center space-x-2 text-base">
                  <PlayCircle className="h-5 w-5" />
                  <span>Active Sessions</span>
                  <Badge variant="secondary" className="ml-2 text-sm">
                    {activeSessions.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="ended" className="flex items-center space-x-2 text-base">
                  <Archive className="h-5 w-5" />
                  <span>Previous Sessions</span>
                  <Badge variant="secondary" className="ml-2 text-sm">
                    {endedSessions.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              {/* Active Sessions Tab */}
              <TabsContent value="active" className="mt-12">
                {activeSessions.length === 0 ? (
                  <Card className="text-center py-20 border-2 border-dashed max-w-3xl mx-auto">
                    <CardContent className="space-y-8">
                      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <PlayCircle className="h-12 w-12 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-3xl mb-4">
                          {searchTerm ? 'No Active Sessions Found' : 'No Active Sessions Yet'}
                        </CardTitle>
                        <CardDescription className="mb-10 text-lg">
                          {searchTerm 
                            ? 'Try adjusting your search terms or check back later.' 
                            : 'Start collaborating by creating your first session or joining an existing one!'
                          }
                        </CardDescription>
                      </div>
                      {!searchTerm && (
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                          <Button asChild size="lg">
                            <Link href="/session/create">
                              <Plus className="mr-2 h-5 w-5" />
                              Create Your First Session
                            </Link>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="lg"
                            onClick={() => setShowJoinModal(true)}
                          >
                            <ExternalLink className="mr-2 h-5 w-5" />
                            Join a Session
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {activeSessions.map((session) => (
                      <SessionCard key={session.id} session={session} />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Ended Sessions Tab */}
              <TabsContent value="ended" className="mt-12">
                {endedSessions.length === 0 ? (
                  <Card className="text-center py-20 border-2 border-dashed max-w-3xl mx-auto">
                    <CardContent className="space-y-8">
                      <div className="w-24 h-24 bg-muted-foreground/10 rounded-full flex items-center justify-center mx-auto">
                        <Archive className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-3xl mb-4">
                          {searchTerm ? 'No Previous Sessions Found' : 'No Previous Sessions'}
                        </CardTitle>
                        <CardDescription className="mb-10 text-lg">
                          {searchTerm 
                            ? 'Try adjusting your search terms.' 
                            : 'Your completed collaboration sessions will appear here for review and export.'
                          }
                        </CardDescription>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {endedSessions.map((session) => (
                      <SessionCard key={session.id} session={session} isEnded={true} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {/* Footer */}
        <div className="flex justify-center py-12 relative z-10">
          <Badge variant="outline" className="flex items-center gap-2 px-6 py-3">
            <Zap className="h-4 w-4 text-red-500" />
            <span>Built with love for developers worldwide</span>
          </Badge>
        </div>
      </div>
    </ProtectedRoute>
  )
}
