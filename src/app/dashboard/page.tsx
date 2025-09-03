'use client'

import { useEffect, useState, useMemo } from 'react'
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
  Plus, Users, Clock, Settings, Search, ExternalLink, Link as LinkIcon, LogOut,
  CheckCircle, PlayCircle, Archive, Calendar, Timer, Crown, Eye, Download,
  MessageSquare, FileText, Sparkles, Loader2, TrendingUp, Globe, Lock,
  Filter, AlertCircle, Share, Code, Zap, ChevronRight, Star, MoreVertical,
  Activity, Rocket
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

// Header Component using your CSS variables
const DashboardHeader = ({ user, logout }: { user: any, logout: () => void }) => (
  <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
            <Code className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-foreground">
              CollabIDE
            </span>
            <span className="text-xs text-muted-foreground hidden sm:block">
              Real-time Collaboration Platform
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-3 bg-card border rounded-full px-4 py-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground">
                {user?.displayName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-card-foreground">{user?.displayName}</span>
              <span className="text-xs text-muted-foreground">{user?.email}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </div>
    </div>
  </header>
)

// Hero Section using your CSS variables
const HeroSection = ({ activeSessions, endedSessions, sessions }: { 
  activeSessions: Session[], 
  endedSessions: Session[], 
  sessions: Session[] 
}) => (
  <section className="text-center mb-16">
    <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
      <Users className="h-12 w-12 text-primary-foreground" />
    </div>
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6">
      Your Collaboration Hub
    </h1>
    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
      Create, join, and manage your collaborative coding sessions with ease. 
      Build amazing projects together with your team in real-time.
    </p>
    
    {/* Quick Stats Grid using your CSS variables */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-10">
      <div className="group relative bg-card rounded-2xl p-6 border hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-center w-12 h-12 bg-chart-2/20 rounded-xl mb-4 mx-auto">
          <CheckCircle className="h-6 w-6 text-chart-2" />
        </div>
        <div className="text-2xl font-bold text-chart-2 mb-1">{activeSessions.length}</div>
        <div className="text-sm text-muted-foreground">Active Sessions</div>
      </div>
      
      <div className="group relative bg-card rounded-2xl p-6 border hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-xl mb-4 mx-auto">
          <Archive className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="text-2xl font-bold text-card-foreground mb-1">{endedSessions.length}</div>
        <div className="text-sm text-muted-foreground">Completed</div>
      </div>
      
      <div className="group relative bg-card rounded-2xl p-6 border hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded-xl mb-4 mx-auto">
          <TrendingUp className="h-6 w-6 text-primary" />
        </div>
        <div className="text-2xl font-bold text-primary mb-1">{sessions.length}</div>
        <div className="text-sm text-muted-foreground">Total Sessions</div>
      </div>
    </div>
  </section>
)

// Search and Filter using your CSS variables
const SearchAndFilter = ({ searchTerm, setSearchTerm, activeTab, filteredSessions }: {
  searchTerm: string,
  setSearchTerm: (term: string) => void,
  activeTab: string,
  filteredSessions: Session[]
}) => (
  <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12 max-w-6xl mx-auto">
    <div className="relative w-full lg:max-w-lg">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
      <Input
        type="text"
        placeholder="Search sessions, creators, or descriptions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-12 h-12 text-base bg-background focus:ring-ring"
      />
    </div>
    <div className="flex items-center gap-4">
      <Badge variant="outline" className="flex items-center gap-2 whitespace-nowrap px-4 py-2">
        <Filter className="h-4 w-4" />
        {filteredSessions.length} result{filteredSessions.length !== 1 ? 's' : ''}
      </Badge>
      <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
        <MoreVertical className="h-4 w-4" />
        More filters
      </Button>
    </div>
  </div>
)

// Join Session Dialog using your CSS variables
const JoinSessionDialog = ({ 
  showJoinModal, 
  setShowJoinModal, 
  joinSessionId, 
  setJoinSessionId, 
  joinError, 
  joinLoading, 
  handleJoinSession, 
  setJoinError 
}: {
  showJoinModal: boolean,
  setShowJoinModal: (show: boolean) => void,
  joinSessionId: string,
  setJoinSessionId: (id: string) => void,
  joinError: string,
  joinLoading: boolean,
  handleJoinSession: () => void,
  setJoinError: (error: string) => void
}) => (
  <Dialog open={showJoinModal} onOpenChange={setShowJoinModal}>
    <DialogTrigger asChild>
      <Button variant="outline" size="lg" className="group px-8 h-14 text-base font-semibold hover:bg-accent hover:text-accent-foreground transition-all duration-300">
        <ExternalLink className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
        Join Session
        <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ExternalLink className="h-8 w-8 text-primary-foreground" />
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

        <div className="space-y-3">
          <Label htmlFor="session-id-input" className="text-sm font-medium">
            Session ID or Link
          </Label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              id="session-id-input"
              type="text"
              placeholder="e.g., abc123xyz or full session URL"
              value={joinSessionId}
              onChange={(e) => setJoinSessionId(e.target.value)}
              className="pl-10 h-12"
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
                Join Session
              </>
            )}
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
)

// Session Card using your CSS variables
const SessionCard = ({ session, isEnded = false, user, exportSession, copySessionLink }: { 
  session: Session, 
  isEnded?: boolean,
  user: any,
  exportSession: (id: string, title: string) => void,
  copySessionLink: (id: string) => void
}) => {
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

  return (
    <Card className={cn(
      "group relative transition-all duration-300 bg-card/80 backdrop-blur",
      isEnded 
        ? 'hover:shadow-md' 
        : 'hover:shadow-xl hover:-translate-y-1 hover:border-ring/50'
    )}>
      <CardHeader className="pb-4 relative">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className={cn(
              "text-xl font-bold line-clamp-2 leading-tight transition-colors duration-200 mb-2",
              isEnded ? 'text-muted-foreground' : 'text-card-foreground group-hover:text-primary'
            )}>
              {session.title}
            </CardTitle>
            {session.description && (
              <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                {session.description}
              </CardDescription>
            )}
          </div>
          <div className="flex flex-col space-y-2 flex-shrink-0">
            <Badge 
              variant={session.type === 'PUBLIC' ? 'default' : 'secondary'} 
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
            <Badge 
              variant={session.isActive ? 'default' : 'secondary'}
              className={cn(
                "text-xs font-medium",
                session.isActive && "bg-chart-2/20 text-chart-2 border-chart-2/30"
              )}
            >
              {session.isActive ? (
                <>
                  <div className="w-2 h-2 bg-chart-2 rounded-full mr-1.5 animate-pulse" />
                  Live
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
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Session Stats using chart colors */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg hover:bg-muted/40 transition-colors">
            <Users className="h-5 w-5 text-chart-1 mb-2 mx-auto" />
            <div className="text-lg font-semibold text-card-foreground">{session._count.participants}</div>
            <div className="text-xs text-muted-foreground">Users</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg hover:bg-muted/40 transition-colors">
            <FileText className="h-5 w-5 text-chart-3 mb-2 mx-auto" />
            <div className="text-lg font-semibold text-card-foreground">{session._count.files}</div>
            <div className="text-xs text-muted-foreground">Files</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg hover:bg-muted/40 transition-colors">
            <MessageSquare className="h-5 w-5 text-chart-2 mb-2 mx-auto" />
            <div className="text-lg font-semibold text-card-foreground">{session._count.messages}</div>
            <div className="text-xs text-muted-foreground">Messages</div>
          </div>
        </div>

        {/* Session Timing */}
        <div className="space-y-3 bg-muted/20 rounded-lg p-4">
          {isEnded ? (
            <>
              <div className="flex items-center text-sm">
                <Timer className="h-4 w-4 mr-3 text-chart-4" />
                <span className="text-muted-foreground">Duration:</span>
                <span className="ml-2 font-medium text-card-foreground">{getSessionDuration(session.createdAt, session.lastActivity)}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
                <span className="text-muted-foreground">Ended:</span>
                <span className="ml-2 font-medium text-card-foreground">{getRelativeTime(session.lastActivity)}</span>
              </div>
            </>
          ) : (
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-3 text-chart-2" />
              <span className="text-muted-foreground">Last active:</span>
              <span className="ml-2 font-medium text-card-foreground">{getRelativeTime(session.lastActivity)}</span>
            </div>
          )}
        </div>

        {/* Owner */}
        <div className="flex items-center">
          {session.owner.id === user?.id ? (
            <Badge className="bg-chart-5/20 text-chart-5 border-chart-5/30">
              <Crown className="h-3 w-3 mr-1" />
              Your session
            </Badge>
          ) : (
            <div className="flex items-center text-sm">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                <span className="text-sm font-medium text-primary-foreground">
                  {session.owner.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">Created by</span>
                <span className="font-medium text-card-foreground">{session.owner.displayName}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          {isEnded ? (
            <>
              <Button 
                variant="outline" 
                size="default"
                className="flex-1" 
                onClick={() => exportSession(session.id, session.title)}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button 
                variant="outline" 
                size="default"
                className="px-4"
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
                className="px-4"
              >
                <Share className="h-4 w-4" />
              </Button>
              {session.owner.id === user?.id && (
                <Button 
                  variant="outline" 
                  size="default"
                  className="px-4"
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
}

// Empty State using your CSS variables
const EmptyState = ({ 
  type, 
  searchTerm, 
  setShowJoinModal 
}: { 
  type: 'active' | 'ended', 
  searchTerm: string, 
  setShowJoinModal: (show: boolean) => void 
}) => {
  const isActive = type === 'active'
  
  return (
    <Card className="text-center py-16 border-2 border-dashed bg-muted/20 max-w-2xl mx-auto">
      <CardContent className="space-y-6">
        <div className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center mx-auto",
          isActive ? "bg-primary/10" : "bg-muted/50"
        )}>
          {isActive ? (
            <PlayCircle className="h-10 w-10 text-primary" />
          ) : (
            <Archive className="h-10 w-10 text-muted-foreground" />
          )}
        </div>
        
        <div>
          <CardTitle className="text-2xl mb-3">
            {searchTerm 
              ? `No ${isActive ? 'Active' : 'Previous'} Sessions Found` 
              : `No ${isActive ? 'Active' : 'Previous'} Sessions Yet`
            }
          </CardTitle>
          <CardDescription className="text-lg mb-8">
            {searchTerm 
              ? 'Try adjusting your search terms or check back later.' 
              : isActive 
                ? 'Start collaborating by creating your first session or joining an existing one!'
                : 'Your completed collaboration sessions will appear here for review and export.'
            }
          </CardDescription>
        </div>
        
        {!searchTerm && isActive && (
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="px-8">
              <Link href="/session/create">
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Session
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8"
              onClick={() => setShowJoinModal(true)}
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              Join a Session
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Loading Component using your CSS variables
const LoadingScreen = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-full max-w-md mx-auto p-4">
      <Card className="shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Code className="w-8 h-8 text-primary-foreground" />
          </div>
          
          <div className="mx-auto mb-6 p-4 bg-primary/10 rounded-full w-fit">
            <Sparkles className="h-12 w-12 text-primary animate-pulse" />
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
)

// Main Dashboard Component
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

  // Memoized filtered sessions for better performance
  const { activeSessions, endedSessions } = useMemo(() => {
    const active = sessions.filter(session => 
      session.isActive && 
      (session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       session.owner.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       session.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    )
    
    const ended = sessions.filter(session => 
      !session.isActive && 
      (session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       session.owner.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       session.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    )
    
    return { activeSessions: active, endedSessions: ended }
  }, [sessions, searchTerm])

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

  const copySessionLink = async (sessionId: string) => {
    try {
      const link = `${window.location.origin}/session/${sessionId}`
      await navigator.clipboard.writeText(link)
      toast.success("Session link copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy link")
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <LoadingScreen />
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardHeader user={user} logout={logout} />

        <main className="container mx-auto px-6 sm:px-8 lg:px-12 py-12 max-w-[1400px]">
          <HeroSection 
            activeSessions={activeSessions} 
            endedSessions={endedSessions} 
            sessions={sessions} 
          />
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-2xl mx-auto mb-16">
            <Button asChild size="lg" className="group px-8 h-14 text-base font-semibold">
              <Link href="/session/create">
                <Plus className="mr-3 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                Create New Session
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <JoinSessionDialog 
              showJoinModal={showJoinModal}
              setShowJoinModal={setShowJoinModal}
              joinSessionId={joinSessionId}
              setJoinSessionId={setJoinSessionId}
              joinError={joinError}
              joinLoading={joinLoading}
              handleJoinSession={handleJoinSession}
              setJoinError={setJoinError}
            />
          </div>
          
          <SearchAndFilter 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeTab={activeTab}
            filteredSessions={activeTab === 'active' ? activeSessions : endedSessions}
          />

          {/* Tabs */}
          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-12">
                <TabsTrigger value="active" className="flex items-center space-x-2 text-base">
                  <PlayCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Active Sessions</span>
                  <span className="sm:hidden">Active</span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {activeSessions.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="ended" className="flex items-center space-x-2 text-base">
                  <Archive className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous Sessions</span>
                  <span className="sm:hidden">Previous</span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {endedSessions.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-12">
                {activeSessions.length === 0 ? (
                  <EmptyState type="active" searchTerm={searchTerm} setShowJoinModal={setShowJoinModal} />
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                    {activeSessions.map((session) => (
                      <SessionCard 
                        key={session.id} 
                        session={session} 
                        user={user}
                        exportSession={exportSession}
                        copySessionLink={copySessionLink}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="ended" className="mt-12">
                {endedSessions.length === 0 ? (
                  <EmptyState type="ended" searchTerm={searchTerm} setShowJoinModal={setShowJoinModal} />
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                    {endedSessions.map((session) => (
                      <SessionCard 
                        key={session.id} 
                        session={session} 
                        isEnded={true}
                        user={user}
                        exportSession={exportSession}
                        copySessionLink={copySessionLink}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex justify-center py-12">
          <Badge variant="outline" className="flex items-center gap-2 px-6 py-3">
            <Zap className="h-4 w-4 text-chart-1" />
            <span>Built with love for developers worldwide</span>
            <Star className="h-4 w-4 text-chart-5" />
          </Badge>
        </footer>
      </div>
    </ProtectedRoute>
  )
}
