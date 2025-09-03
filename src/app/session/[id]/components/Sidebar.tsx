'use client'

import { 
  Users, MessageSquare, Send, MoreVertical, Crown, UserMinus, Loader2,
  Wifi, WifiOff, Hash, Clock, UserCheck, MessageCircle, Sparkles, X,
  Activity, UserPlus, Circle, Settings, Shield, Star, Zap, ChevronDown,
  ArrowDown
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
import { useState, useEffect, useRef } from 'react'
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
  // New props for state management
  setOnlineUsers: React.Dispatch<React.SetStateAction<any[]>>
  setParticipantCount: React.Dispatch<React.SetStateAction<number>>
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
  onClose,
  setOnlineUsers,
  setParticipantCount
}: SidebarProps) {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // **NEW: Enhanced remove participant function with API call**
  // const handleRemoveParticipant = async (participantId: string, participantName: string) => {
  //   if (!isHost) {
  //     toast.error('Only the session host can remove participants')
  //     return
  //   }

  //   if (participantId === user?.id) {
  //     toast.error('You cannot remove yourself from the session')
  //     return
  //   }

  //   try {
  //     // Show loading state
  //     setShowParticipantMenu(null)
      
  //     // Call your API route
  //     const response = await fetch(`/api/sessions/${session?.id}/participants/remove`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         participantId: participantId
  //       })
  //     })

  //     const data = await response.json()

  //     if (!response.ok) {
  //       throw new Error(data.error || 'Failed to remove participant')
  //     }

  //     // Show success message
  //     toast.success(`${participantName} has been removed from the session`)
      
  //     // Update local state to reflect the removal
  //     setOnlineUsers(prev => prev.filter(user => user.userId !== participantId))
  //     setParticipantCount(prev => Math.max(1, prev - 1))
      
  //     // Call the parent's remove participant function if needed
  //     removeParticipant(participantId)

  //     return data
  //   } catch (error) {
  //     console.error('Failed to remove participant:', error)
  //     toast.error(error instanceof Error ? error.message : 'Failed to remove participant')
  //   }
  // }
  const handleRemoveParticipant = async (participantId: string, participantName: string) => {
    try {
      setShowParticipantMenu(null)
  
      // **Get custom access token from localStorage**
      const accessToken = localStorage.getItem('accessToken')
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
  
      // **Add Authorization header if custom token exists**
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`
        console.log('🔑 Sending custom JWT token')
      }
  
      const response = await fetch(`/api/sessions/${session?.id}/participants/remove`, {
        method: 'POST',
        headers,
        credentials: 'include', // Also include NextAuth cookies
        body: JSON.stringify({ 
          participantId,
          // **Fallback: Also pass user info**
          currentUserId: user?.id,
          currentUserEmail: user?.email
        })
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove participant')
      }
  
      toast.success(`${participantName} has been removed from the session`)
      setOnlineUsers(prev => prev.filter(user => user.userId !== participantId))
      setParticipantCount(prev => Math.max(1, prev - 1))
      removeParticipant(participantId)
  
    } catch (error) {
      console.error('Failed to remove participant:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to remove participant')
    }
  }
  
  // **NEW: Check if user needs to scroll to see latest messages**
  useEffect(() => {
    const checkScrollPosition = () => {
      const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        const { scrollTop, scrollHeight, clientHeight } = scrollElement;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShowScrollButton(!isNearBottom && messages.length > 0);
      }
    };

    const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition(); // Initial check
      
      return () => scrollElement.removeEventListener('scroll', checkScrollPosition);
    }
  }, [messages.length]);

  // **NEW: Scroll to latest message function**
  const scrollToLatest = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollButton(false);
  };

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

        {/* **ENHANCED: Remove participant dropdown with API integration** */}
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
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem 
                onClick={() => handleRemoveParticipant(
                  participant.id || participant.userId, 
                  participant.displayName || participant.user?.displayName
                )}
                className="text-red-600 focus:text-red-600 cursor-pointer"
              >
                <UserMinus className="mr-2 h-4 w-4" />
                <span className="whitespace-nowrap">Remove from session</span>
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
          className="flex items-center justify-between p-4 border-b flex-shrink-0"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg">
              {mode === 'participants' ? (
                <Users className="h-5 w-5 text-blue-500" />
              ) : (
                <MessageSquare className="h-5 w-5 text-green-500" />
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
                  {connected ? (
                    <Wifi className="h-3.5 w-3.5 text-green-600" />
                  ) : (
                    <WifiOff className="h-3.5 w-3.5 text-red-600" />
                  )}
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
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
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
              {/* Messages with scroll-to-latest button */}
              <div className="flex-1 relative min-h-0">
                <ScrollArea className="h-full px-4" ref={scrollAreaRef}>
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

                {/* Scroll to latest button */}
                {showScrollButton && (
                  <div className="absolute bottom-4 right-4 z-10">
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          onClick={scrollToLatest}
                          size="icon"
                          className="h-10 w-10 rounded-full shadow-lg border-2 transition-all duration-200 hover:scale-105"
                          style={{
                            backgroundColor: 'var(--primary)',
                            color: 'var(--primary-foreground)',
                            borderColor: 'var(--background)'
                          }}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p>Go to latest message</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div 
                className="p-4 border-t space-y-3 flex-shrink-0"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
              >
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
                    className="h-10 w-10 rounded-xl transition-all duration-200 relative"
                    style={{ 
                      backgroundColor: isSendingMessage ? 'var(--muted)' : 'var(--primary)', 
                      color: isSendingMessage ? 'var(--muted-foreground)' : 'var(--primary-foreground)'
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
