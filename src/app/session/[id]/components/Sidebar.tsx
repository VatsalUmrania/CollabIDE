// 'use client'

// import { 
//   Users, MessageSquare, Send, MoreVertical, Crown, UserMinus, Loader2,
//   Wifi, WifiOff, Hash, Clock, UserCheck, MessageCircle, Sparkles, X,
//   Activity, UserPlus
// } from 'lucide-react'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
// import { Progress } from '@/components/ui/progress'
// import { cn } from '@/lib/utils'
// import { useState, useEffect } from 'react'
// import { toast } from 'sonner'

// interface SidebarProps {
//   user: any
//   session: any
//   isHost: boolean
//   onlineUsers: any[]
//   participantCount: number
//   getUserColor: (userId: string) => string
//   removeParticipant: (id: string) => void
//   messages: any[]
//   newMessage: string
//   setNewMessage: (msg: string) => void
//   chatError: string
//   connected: boolean
//   isSendingMessage: boolean
//   sendMessage: () => void
//   handleChatKeyPress: (e: React.KeyboardEvent) => void
//   messagesEndRef: React.RefObject<HTMLDivElement>
//   className?: string
//   isMobile?: boolean
//   onInviteUsers?: () => void
// }

// // Icon-based navigation button component
// const NavButton = ({ icon: Icon, label, isActive, onClick, notificationCount }: {
//   icon: React.ElementType,
//   label: string,
//   isActive: boolean,
//   onClick: () => void,
//   notificationCount?: number
// }) => (
//   <Tooltip>
//     <TooltipTrigger asChild>
//       <button
//         onClick={onClick}
//         className={cn(
//           "relative w-12 h-12 flex items-center justify-center transition-colors duration-200",
//           "hover:bg-muted/60",
//           isActive ? "text-foreground bg-muted" : "text-muted-foreground"
//         )}
//       >
//         <Icon className="h-6 w-6" />
//         {notificationCount && notificationCount > 0 && (
//           <div className="absolute top-2 right-2 w-4 h-4 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
//             {notificationCount}
//           </div>
//         )}
//       </button>
//     </TooltipTrigger>
//     <TooltipContent side="right">
//       <p>{label}</p>
//     </TooltipContent>
//   </Tooltip>
// );

// export default function Sidebar({
//   user,
//   session,
//   isHost,
//   onlineUsers,
//   participantCount,
//   getUserColor,
//   removeParticipant,
//   messages,
//   newMessage,
//   setNewMessage,
//   chatError,
//   connected,
//   isSendingMessage,
//   sendMessage,
//   handleChatKeyPress,
//   messagesEndRef,
//   className,
//   isMobile = false,
//   onInviteUsers
// }: SidebarProps) {
//   const [activeTab, setActiveTab] = useState<'people' | 'chat'>('people');
//   const [typingProgress, setTypingProgress] = useState(0);

//   // Simulate typing progress for sending a message
//   useEffect(() => {
//     if (isSendingMessage) {
//       setTypingProgress(0)
//       const interval = setInterval(() => {
//         setTypingProgress(prev => {
//           if (prev >= 90) return prev
//           return prev + Math.random() * 15
//         })
//       }, 100)
      
//       return () => clearInterval(interval)
//     } else {
//       setTypingProgress(0)
//     }
//   }, [isSendingMessage])

//   const formatTime = (dateString: string) => {
//     const date = new Date(dateString)
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//   }

//   const getRelativeTime = (dateString: string) => {
//     const date = new Date(dateString)
//     const now = new Date()
//     const diffMs = now.getTime() - date.getTime()
//     const diffMins = Math.floor(diffMs / 60000)
//     const diffHours = Math.floor(diffMins / 60)
    
//     if (diffHours > 0) return `${diffHours}h ago`
//     if (diffMins > 0) return `${diffMins}m ago`
//     return 'now'
//   }

//   const handleRemoveParticipant = (participantId: string, participantName: string) => {
//     removeParticipant(participantId)
//     toast.success(`${participantName} has been removed from the session`)
//   }

//   const handleSendMessage = () => {
//     if (!newMessage.trim()) return
//     sendMessage()
//     toast.success('Message sent!')
//   }

//   // Determine unread message count for notification badge
//   const unreadMessages = messages.filter(m => !m.isRead && m.user.id !== user?.id).length;

//   return (
//     <div className={cn("flex bg-card w-80", className)}>
//       {/* 1. Icon Navigation Rail */}
//       <div className="flex flex-col items-center w-16 border-r bg-background/50 flex-shrink-0">
//         <NavButton
//           label="People"
//           icon={Users}
//           isActive={activeTab === 'people'}
//           onClick={() => setActiveTab('people')}
//           notificationCount={participantCount}
//         />
//         <NavButton
//           label="Chat"
//           icon={MessageSquare}
//           isActive={activeTab === 'chat'}
//           onClick={() => setActiveTab('chat')}
//           notificationCount={unreadMessages}
//         />
//       </div>
      
//       {/* 2. Main Content Panel */}
//       <div className="flex-1 flex flex-col min-w-0">
//         {activeTab === 'people' && (
//           <div className="p-4 flex flex-col h-full">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-bold">People</h2>
//               <Badge variant="secondary">{participantCount} Online</Badge>
//             </div>
            
//             <ScrollArea className="flex-1 pr-2">
//               {/* Host Section */}
//               <div className="mb-6">
//                 <div className="flex items-center space-x-2 mb-3">
//                   <Crown className="h-4 w-4 text-orange-400" />
//                   <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Host</span>
//                 </div>
//                 <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
//                    <Avatar className="h-10 w-10">
//                      <AvatarImage src={session.owner.avatar || user?.avatar} />
//                      <AvatarFallback style={{ backgroundColor: getUserColor(session.owner.id) }}>
//                        {session.owner.displayName?.charAt(0).toUpperCase()}
//                      </AvatarFallback>
//                    </Avatar>
//                    <div>
//                      <p className="font-semibold">{session.owner.displayName}</p>
//                      <p className="text-xs text-muted-foreground">Session Host</p>
//                    </div>
//                    {session.owner.id === user?.id && <Badge variant="outline" className="ml-auto">You</Badge>}
//                 </div>
//               </div>

//               {/* Collaborators Section */}
//               <div>
//                 <div className="flex items-center space-x-2 mb-3">
//                   <UserCheck className="h-4 w-4 text-green-500" />
//                   <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Collaborators</span>
//                 </div>
//                 <div className="space-y-2">
//                   {onlineUsers.filter(u => u.userId !== session.owner.id).map(p => (
//                     <div key={p.userId} className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
//                        <Avatar className="h-10 w-10">
//                          <AvatarImage src={p.avatar} />
//                          <AvatarFallback style={{ backgroundColor: getUserColor(p.userId) }}>
//                            {p.displayName?.charAt(0).toUpperCase()}
//                          </AvatarFallback>
//                        </Avatar>
//                        <div className="flex-1">
//                          <p className="font-semibold">{p.displayName}</p>
//                          <p className="text-xs text-green-500">Online</p>
//                        </div>
//                        {p.userId === user?.id && <Badge variant="outline">You</Badge>}
//                        {isHost && p.userId !== user?.id && (
//                           <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                               <Button size="icon" variant="ghost" className="h-8 w-8 opacity-0 group-hover:opacity-100">
//                                 <MoreVertical className="h-4 w-4" />
//                               </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent align="end">
//                               <DropdownMenuItem onClick={() => handleRemoveParticipant(p.userId, p.displayName)} className="text-destructive">
//                                 <UserMinus className="mr-2 h-4 w-4" /> Remove
//                               </DropdownMenuItem>
//                             </DropdownMenuContent>
//                           </DropdownMenu>
//                        )}
//                     </div>
//                   ))}

//                   {participantCount <= 1 && (
//                     <div className="text-center text-sm text-muted-foreground py-8">
//                        <p>You're the only one here.</p>
//                        {isHost && onInviteUsers && (
//                          <Button onClick={onInviteUsers} variant="link" className="p-0 h-auto mt-1">
//                            <UserPlus className="h-3 w-3 mr-1" />
//                            Invite collaborators
//                          </Button>
//                        )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </ScrollArea>
//           </div>
//         )}

//         {activeTab === 'chat' && (
//           <div className="h-full flex flex-col bg-background/50">
//             <Card className="flex-1 flex flex-col min-h-0 border-0 rounded-none bg-transparent">
//               <CardHeader>
//                 <CardTitle>Team Chat</CardTitle>
//                 <CardDescription>{connected ? `${messages.length} messages` : "Connecting..."}</CardDescription>
//               </CardHeader>
//               <CardContent className="flex-1 flex flex-col min-h-0 p-4 pt-0">
//                 <ScrollArea className="flex-1 -mx-4">
//                   <div className="space-y-4 px-4 pb-4">
//                     {messages.length === 0 ? (
//                       <div className="text-center py-12 space-y-4">
//                         <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground/20" />
//                         <h3 className="font-semibold">No messages yet</h3>
//                         <p className="text-sm text-muted-foreground">Be the first to start the conversation!</p>
//                       </div>
//                     ) : (
//                       messages.map((message, index) => {
//                         const isOwnMessage = message.user.id === user?.id;
//                         const showAvatar = index === 0 || messages[index - 1]?.user.id !== message.user.id;
//                         return (
//                           <div key={message.id}>
//                             <div className={cn("flex items-start space-x-3", isOwnMessage && "flex-row-reverse space-x-reverse")}>
//                               <Avatar className={cn("h-8 w-8", !showAvatar && "opacity-0")}>
//                                 <AvatarImage src={message.user.avatar} />
//                                 <AvatarFallback style={{ backgroundColor: getUserColor(message.user.id) }}>
//                                   {message.user.displayName?.charAt(0).toUpperCase()}
//                                 </AvatarFallback>
//                               </Avatar>
//                               <div className={cn("flex-1 flex flex-col", isOwnMessage && "items-end")}>
//                                 {showAvatar && (
//                                   <div className="text-xs text-muted-foreground mb-1">
//                                     {message.user.displayName}
//                                     <span className="px-1">·</span>
//                                     {getRelativeTime(message.createdAt)}
//                                   </div>
//                                 )}
//                                 <div className={cn("max-w-xs rounded-lg px-3 py-2 text-sm break-words", isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted")}>
//                                   {message.content}
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })
//                     )}
//                     <div ref={messagesEndRef} />
//                   </div>
//                 </ScrollArea>
//                 <div className="flex-shrink-0 space-y-2 pt-4 border-t">
//                   {isSendingMessage && <Progress value={typingProgress} className="h-1" />}
//                   <div className="flex items-center space-x-2">
//                     <Input
//                       value={newMessage}
//                       onChange={(e) => setNewMessage(e.target.value)}
//                       placeholder={connected ? "Type a message..." : "Connecting..."}
//                       onKeyPress={handleChatKeyPress}
//                       disabled={!connected || isSendingMessage}
//                     />
//                     <Button onClick={handleSendMessage} disabled={!connected || !newMessage.trim() || isSendingMessage} size="icon">
//                       {isSendingMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

'use client'

import { 
  Users, MessageSquare, Send, MoreVertical, Crown, UserMinus, Loader2,
  Wifi, WifiOff, Hash, Clock, UserCheck, MessageCircle, Sparkles, X,
  Activity, UserPlus, Circle, Settings, Shield, Star, Zap
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface SidebarProps {
  mode: 'participants' | 'chat'
  user: any
  session: any
  isHost: boolean
  onlineUsers: any[]
  participantCount: number
  getUserColor: (userId: string) => string
  showParticipantMenu: string | null
  setShowParticipantMenu: (id: string | null) => void
  removeParticipant: (id: string) => void
  messages: any[]
  newMessage: string
  setNewMessage: (msg: string) => void
  chatError: string
  connected: boolean
  isSendingMessage: boolean
  sendMessage: () => void
  handleChatKeyPress: (e: React.KeyboardEvent) => void
  messagesEndRef: React.RefObject<HTMLDivElement>
  className?: string
  style?: React.CSSProperties
  isMobile?: boolean
  onInviteUsers?: () => void
  onClose?: () => void
}

export default function Sidebar({
  mode,
  user,
  session,
  isHost,
  onlineUsers,
  participantCount,
  getUserColor,
  showParticipantMenu,
  setShowParticipantMenu,
  removeParticipant,
  messages,
  newMessage,
  setNewMessage,
  chatError,
  connected,
  isSendingMessage,
  sendMessage,
  handleChatKeyPress,
  messagesEndRef,
  className,
  style,
  isMobile = false,
  onInviteUsers,
  onClose
}: SidebarProps) {
  const [typingProgress, setTypingProgress] = useState(0);

  // Simulate typing progress for sending a message
  useEffect(() => {
    if (isSendingMessage) {
      setTypingProgress(0)
      const interval = setInterval(() => {
        setTypingProgress(prev => {
          if (prev >= 90) return prev
          return prev + Math.random() * 15
        })
      }, 100)
      
      return () => clearInterval(interval)
    } else {
      setTypingProgress(0)
    }
  }, [isSendingMessage])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffDays > 0) return `${diffDays}d ago`
    if (diffHours > 0) return `${diffHours}h ago`
    if (diffMins > 0) return `${diffMins}m ago`
    return 'just now'
  }

  const handleRemoveParticipant = (participantId: string, participantName: string) => {
    removeParticipant(participantId)
    setShowParticipantMenu(null)
    toast.success(`${participantName} has been removed from the session`)
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    sendMessage()
  }

  // Get online status indicator
  const getStatusIndicator = (userId: string) => {
    const isOnline = onlineUsers.some(u => u.userId === userId)
    return (
      <div className={cn(
        "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 rounded-full",
        isOnline ? "bg-green-500 border-green-400" : "bg-gray-400 border-gray-300"
      )} 
      style={{ borderColor: 'var(--background)' }}
      />
    )
  }

  // Enhanced participant item component
  const ParticipantItem = ({ participant, isOwner = false }: { participant: any, isOwner?: boolean }) => (
    <div className="group relative">
      <div 
        className={cn(
          "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer",
          isOwner 
            ? "bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-200/20"
            : "hover:bg-[var(--accent)] hover:shadow-md"
        )}
      >
        <div className="relative">
          <Avatar className="h-10 w-10 border-2" style={{ borderColor: getUserColor(participant.id || participant.userId) }}>
            <AvatarImage src={participant.avatar} />
            <AvatarFallback 
              className="text-white font-semibold text-sm"
              style={{ backgroundColor: getUserColor(participant.id || participant.userId) }}
            >
              {(participant.displayName || participant.user?.displayName)?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {getStatusIndicator(participant.id || participant.userId)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm truncate" style={{ color: 'var(--foreground)' }}>
              {participant.displayName || participant.user?.displayName}
            </p>
            {isOwner && <Crown className="h-4 w-4 text-orange-500 flex-shrink-0" />}
            {(participant.id || participant.userId) === user?.id && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">You</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              {isOwner ? 'Session Host' : 'Collaborator'}
            </p>
            {!isOwner && (
              <div className="flex items-center gap-1">
                <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                <span className="text-xs text-green-500">Online</span>
              </div>
            )}
          </div>
        </div>

        {isHost && (participant.id || participant.userId) !== user?.id && !isOwner && (
          <DropdownMenu 
            open={showParticipantMenu === (participant.id || participant.userId)} 
            onOpenChange={(open) => setShowParticipantMenu(open ? (participant.id || participant.userId) : null)}
          >
            <DropdownMenuTrigger asChild>
              <Button 
                size="sm" 
                variant="ghost" 
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleRemoveParticipant(participant.id || participant.userId, participant.displayName)}>
                <UserMinus className="mr-2 h-4 w-4 text-red-500" />
                <span>Remove from session</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )

  // Enhanced message component
  const MessageItem = ({ message, index, showAvatar }: { message: any, index: number, showAvatar: boolean }) => {
    const isOwnMessage = message.user.id === user?.id
    
    return (
      <div className={cn("flex items-start gap-3 mb-4", isOwnMessage && "flex-row-reverse")}>
        <div className={cn("flex-shrink-0", !showAvatar && "invisible")}>
          <Avatar className="h-8 w-8 border-2" style={{ borderColor: getUserColor(message.user.id) }}>
            <AvatarImage src={message.user.avatar} />
            <AvatarFallback 
              className="text-white font-medium text-xs"
              style={{ backgroundColor: getUserColor(message.user.id) }}
            >
              {message.user.displayName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className={cn("flex-1 min-w-0", isOwnMessage && "flex flex-col items-end")}>
          {showAvatar && (
            <div className={cn("flex items-center gap-2 mb-1", isOwnMessage && "flex-row-reverse")}>
              <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>
                {message.user.displayName}
              </span>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                {getRelativeTime(message.createdAt)}
              </span>
            </div>
          )}
          
          <div className={cn(
            "inline-block max-w-[280px] rounded-2xl px-4 py-2.5 text-sm break-words",
            isOwnMessage 
              ? "rounded-br-md" 
              : "rounded-bl-md"
          )}
          style={{
            backgroundColor: isOwnMessage ? 'var(--primary)' : 'var(--muted)',
            color: isOwnMessage ? 'var(--primary-foreground)' : 'var(--foreground)'
          }}>
            {message.content}
          </div>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div 
        className={cn("flex flex-col h-full border-r", className)}
        style={{
          backgroundColor: 'var(--background)',
          borderColor: 'var(--border)',
          ...style
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: mode === 'participants' ? 'var(--primary)' : 'var(--secondary)' }}
            >
              {mode === 'participants' ? (
                <Users className="h-5 w-5" style={{ color: mode === 'participants' ? 'var(--primary-foreground)' : 'var(--secondary-foreground)' }} />
              ) : (
                <MessageSquare className="h-5 w-5" style={{ color: mode === 'chat' ? 'var(--primary-foreground)' : 'var(--secondary-foreground)' }} />
              )}
            </div>
            <div>
              <h2 className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>
                {mode === 'participants' ? 'Participants' : 'Team Chat'}
              </h2>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                {mode === 'participants' 
                  ? `${participantCount} member${participantCount !== 1 ? 's' : ''} online`
                  : connected 
                    ? `${messages.length} message${messages.length !== 1 ? 's' : ''}`
                    : 'Connecting...'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Connection Status */}
            <Tooltip>
              <TooltipTrigger>
                <div className={cn("p-1.5 rounded-full", connected ? "bg-green-100" : "bg-red-100")}>
                  {connected ? (
                    <Wifi className="h-3.5 w-3.5 text-green-600" />
                  ) : (
                    <WifiOff className="h-3.5 w-3.5 text-red-600" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{connected ? 'Connected' : 'Disconnected'}</p>
              </TooltipContent>
            </Tooltip>
            
            {/* Close Button */}
            {onClose && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-[var(--destructive)] hover:text-[var(--destructive-foreground)]"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {mode === 'participants' && (
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {/* Session Owner */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-4 w-4 text-orange-500" />
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
                      Host
                    </span>
                  </div>
                  <ParticipantItem participant={session.owner} isOwner={true} />
                </div>

                <Separator style={{ backgroundColor: 'var(--border)' }} />

                {/* Collaborators */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-green-500" />
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
                        Collaborators
                      </span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="text-[10px] px-2 py-0.5"
                    >
                      {onlineUsers.filter(u => u.userId !== session.owner.id).length}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {onlineUsers.filter(u => u.userId !== session.owner.id).map(participant => (
                      <ParticipantItem key={participant.userId} participant={participant} />
                    ))}
                  </div>

                  {/* Empty State */}
                  {onlineUsers.filter(u => u.userId !== session.owner.id).length === 0 && (
                    <div className="text-center py-8 space-y-3">
                      <div 
                        className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'var(--muted)' }}
                      >
                        <UserPlus className="h-8 w-8" style={{ color: 'var(--muted-foreground)' }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                          No collaborators yet
                        </p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                          Invite others to join this session
                        </p>
                      </div>
                      {isHost && onInviteUsers && (
                        <Button 
                          onClick={onInviteUsers} 
                          size="sm"
                          className="mt-3"
                          style={{ 
                            backgroundColor: 'var(--primary)', 
                            color: 'var(--primary-foreground)' 
                          }}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Invite People
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}

          {mode === 'chat' && (
            <>
              {/* Messages */}
              <ScrollArea className="flex-1 px-4">
                <div className="py-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-12 space-y-4">
                      <div 
                        className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'var(--muted)' }}
                      >
                        <MessageCircle className="h-8 w-8" style={{ color: 'var(--muted-foreground)' }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>
                          Start the conversation
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                          Send your first message to the team
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {messages.map((message, index) => {
                        const showAvatar = index === 0 || messages[index - 1]?.user.id !== message.user.id
                        return (
                          <MessageItem 
                            key={message.id} 
                            message={message} 
                            index={index} 
                            showAvatar={showAvatar}
                          />
                        )
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <div 
                className="p-4 border-t space-y-3"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
              >
                {isSendingMessage && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        Sending message...
                      </span>
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        {Math.round(typingProgress)}%
                      </span>
                    </div>
                    <Progress 
                      value={typingProgress} 
                      className="h-1"
                    />
                  </div>
                )}
                
                {chatError && (
                  <Alert variant="destructive" className="py-2">
                    <AlertDescription className="text-xs">{chatError}</AlertDescription>
                  </Alert>
                )}
                
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={connected ? "Type your message..." : "Connecting..."}
                      onKeyPress={handleChatKeyPress}
                      disabled={!connected || isSendingMessage}
                      className="resize-none rounded-xl border-2 focus:border-primary/50 transition-colors"
                      style={{ 
                        backgroundColor: 'var(--background)',
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)'
                      }}
                    />
                  </div>
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!connected || !newMessage.trim() || isSendingMessage}
                    size="icon"
                    className="h-10 w-10 rounded-xl transition-all duration-200"
                    style={{ 
                      backgroundColor: 'var(--primary)', 
                      color: 'var(--primary-foreground)' 
                    }}
                  >
                    {isSendingMessage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
