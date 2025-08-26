'use client'

import { 
  Users, 
  MessageSquare, 
  Send, 
  MoreVertical, 
  Crown, 
  UserMinus, 
  Loader2,
  Wifi,
  WifiOff,
  Hash,
  Clock,
  UserCheck,
  MessageCircle,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  Activity,
  Shield,
  Dot,
  UserPlus
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface SidebarProps {
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
  isMobile?: boolean
  onInviteUsers?: () => void
}

export default function Sidebar({
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
  isMobile = false,
  onInviteUsers
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [typingProgress, setTypingProgress] = useState(0)

  // Auto-collapse on very small screens
  useEffect(() => {
    const checkVerySmall = () => {
      if (window.innerWidth < 640) {
        setIsCollapsed(true)
      }
    }
    
    checkVerySmall()
    window.addEventListener('resize', checkVerySmall)
    return () => window.removeEventListener('resize', checkVerySmall)
  }, [])

  // Simulate typing progress
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
    
    if (diffHours > 0) return `${diffHours}h ago`
    if (diffMins > 0) return `${diffMins}m ago`
    return 'now'
  }

  const handleRemoveParticipant = (participantId: string, participantName: string) => {
    removeParticipant(participantId)
    toast.success(`${participantName} has been removed from the session`)
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    sendMessage()
    toast.success('Message sent!')
  }

  return (
    <div className={cn(
      "border-l-0 border-r bg-card/80 backdrop-blur flex flex-col transition-all duration-300 shadow-xl",
      isMobile ? "w-full" : isCollapsed ? "w-16" : "w-80",
      className
    )}>
      {/* Collapse Toggle Button */}
      {!isMobile && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="absolute -left-3 top-4 z-10 bg-card border shadow-md rounded-full w-6 h-6 p-0 hover:bg-muted/50 transition-all"
            >
              {isCollapsed ? (
                <ChevronRight className="h-3 w-3" />
              ) : (
                <ChevronLeft className="h-3 w-3" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}</p>
          </TooltipContent>
        </Tooltip>
      )}

      {/* Participants Section */}
      <Card className={cn(
        "m-4 mb-2 flex-shrink-0 border-0 bg-muted/30 backdrop-blur shadow-lg",
        isCollapsed && !isMobile && "mx-2"
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              {(!isCollapsed || isMobile) && (
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-bold text-foreground">
                    Participants
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-2 mt-1">
                    <Activity className="h-3 w-3" />
                    <span>{participantCount} online • Real-time collaboration</span>
                  </CardDescription>
                </div>
              )}
            </div>
            {(!isCollapsed || isMobile) && (
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-500/20">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                {participantCount}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        {(!isCollapsed || isMobile) && (
          <CardContent className="pt-0">
            <ScrollArea className="max-h-64">
              <div className="space-y-4 pr-2">
                {/* Host Section */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Crown className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Host
                    </span>
                  </div>
                  
                  {/* Current user if host, or session owner */}
                  {session.owner.id === user?.id ? (
                    <Card className="border-0 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
                      <CardContent className="flex items-center space-x-3 p-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback 
                            className="text-sm font-semibold text-white"
                            style={{ backgroundColor: getUserColor(user.id) }}
                          >
                            {user?.displayName?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-foreground truncate">
                              {user?.displayName}
                            </span>
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                              You
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Crown className="h-3 w-3 text-orange-500" />
                            <span className="text-sm text-muted-foreground">Session Host</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    onlineUsers
                      .filter(u => u.userId === session.owner.id)
                      .map((participant) => (
                        <Card key={participant.userId} className="border-0 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
                          <CardContent className="flex items-center space-x-3 p-3">
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                              <AvatarImage src={participant.avatar} />
                              <AvatarFallback 
                                className="text-sm font-semibold text-white"
                                style={{ backgroundColor: getUserColor(participant.userId) }}
                              >
                                {participant.displayName?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-semibold text-foreground truncate">
                                  {participant.displayName}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Crown className="h-3 w-3 text-orange-500" />
                                <span className="text-sm text-muted-foreground">Session Host</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                  )}
                </div>

                <Separator />

                {/* Collaborators Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Collaborators
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-500/20">
                      {onlineUsers.filter(u => u.userId !== session.owner.id).length}
                    </Badge>
                  </div>
                  
                  {/* Current user if not host */}
                  {session.owner.id !== user?.id && (
                    <Card className="border-0 bg-muted/30 mb-3">
                      <CardContent className="flex items-center space-x-3 p-3">
                        <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback 
                            className="text-sm font-semibold text-white"
                            style={{ backgroundColor: getUserColor(user.id) }}
                          >
                            {user?.displayName?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-foreground truncate">
                              {user?.displayName}
                            </span>
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                              You
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-1">
                            <UserCheck className="h-3 w-3 text-green-500" />
                            <span className="text-sm text-muted-foreground">Online now</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Other collaborators */}
                  <div className="space-y-2">
                    {onlineUsers
                      .filter(u => u.userId !== user?.id && u.userId !== session.owner.id)
                      .map((participant) => (
                        <Card key={participant.userId} className="group border-0 bg-card/50 hover:bg-muted/30 transition-all duration-200">
                          <CardContent className="flex items-center space-x-3 p-3">
                            <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                              <AvatarImage src={participant.avatar} />
                              <AvatarFallback 
                                className="text-sm font-semibold text-white"
                                style={{ backgroundColor: getUserColor(participant.userId) }}
                              >
                                {participant.displayName?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-semibold text-foreground truncate">
                                  {participant.displayName}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <UserCheck className="h-3 w-3 text-green-500" />
                                <span className="text-sm text-muted-foreground">Online</span>
                              </div>
                            </div>
                            
                            {/* Host Controls */}
                            {isHost && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <MoreVertical className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem
                                    onClick={() => handleRemoveParticipant(participant.userId, participant.displayName)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <UserMinus className="h-4 w-4 mr-2" />
                                    Remove from session
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                                    ID: {participant.userId.slice(0, 8)}...
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
                
                {/* Empty state for single participant */}
                {participantCount === 1 && (
                  <Alert className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-semibold text-foreground">Flying solo!</p>
                        <p className="text-sm text-muted-foreground">
                          {isHost && onInviteUsers ? (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={onInviteUsers}
                              className="p-0 h-auto font-normal text-primary hover:text-primary/80"
                            >
                              <UserPlus className="h-3 w-3 mr-1" />
                              Invite collaborators
                            </Button>
                          ) : (
                            'Waiting for others to join...'
                          )}
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        )}
      </Card>

      {/* Chat Section */}
      <Card className={cn(
        "mx-4 mb-4 flex-1 flex flex-col min-h-0 border-0 bg-muted/30 backdrop-blur shadow-lg",
        isCollapsed && !isMobile && "mx-2"
      )}>
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              {(!isCollapsed || isMobile) && (
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-bold text-foreground">
                    Team Chat
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-2 mt-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>Real-time messaging</span>
                  </CardDescription>
                </div>
              )}
            </div>
            {(!isCollapsed || isMobile) && (
              <div className="flex items-center space-x-2">
                <div className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  connected ? "bg-green-500 animate-pulse shadow-lg shadow-green-500/50" : "bg-red-500"
                )} />
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-500/20 text-xs">
                  <Hash className="h-2.5 w-2.5 mr-1" />
                  {messages.length}
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>
        
        {(!isCollapsed || isMobile) && (
          <CardContent className="pt-0 flex-1 flex flex-col min-h-0 p-4">
            {chatError && (
              <Alert variant="destructive" className="mb-3">
                <AlertDescription>{chatError}</AlertDescription>
              </Alert>
            )}
            
            {/* Messages Area */}
            <ScrollArea className="flex-1 mb-4">
              <div className="space-y-4 pr-2">
                {messages.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="mx-auto w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">No messages yet</h3>
                      <p className="text-sm text-muted-foreground">Start the conversation! Share ideas and collaborate with your team.</p>
                    </div>
                  </div>
                ) : (
                  messages.map((message, index) => {
                    const isOwnMessage = message.user.id === user?.id
                    const showAvatar = index === 0 || messages[index - 1]?.user.id !== message.user.id
                    
                    return (
                      <div key={message.id} className="group relative">
                        <div className={cn(
                          "flex items-start space-x-3",
                          isOwnMessage ? "flex-row-reverse space-x-reverse" : ""
                        )}>
                          {/* Avatar */}
                          <div className="flex-shrink-0">
                            {showAvatar ? (
                              <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
                                <AvatarImage src={message.user.avatar} />
                                <AvatarFallback 
                                  className="text-xs font-semibold text-white"
                                  style={{ backgroundColor: getUserColor(message.user.id) }}
                                >
                                  {message.user.displayName?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="w-8" />
                            )}
                          </div>

                          {/* Message Content */}
                          <div className={cn(
                            "flex-1 min-w-0 max-w-[85%]",
                            isOwnMessage ? "flex flex-col items-end" : ""
                          )}>
                            {/* User name and timestamp */}
                            {showAvatar && (
                              <div className={cn(
                                "flex items-center space-x-2 mb-1",
                                isOwnMessage ? "flex-row-reverse space-x-reverse" : ""
                              )}>
                                <span className={cn(
                                  "text-sm font-semibold",
                                  isOwnMessage ? 'text-primary' : 'text-foreground'
                                )}>
                                  {isOwnMessage ? 'You' : message.user.displayName}
                                </span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="text-xs text-muted-foreground cursor-help">
                                      {getRelativeTime(message.createdAt)}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <div className="flex items-center space-x-1">
                                      <Clock className="h-3 w-3" />
                                      <span>{formatTime(message.createdAt)}</span>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            )}
                            
                            {/* Message bubble */}
                            <div className={cn(
                              "rounded-2xl px-4 py-3 text-sm break-words transition-all duration-200 shadow-sm max-w-full",
                              isOwnMessage 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-muted text-foreground hover:bg-muted/80"
                            )}>
                              <div className="whitespace-pre-wrap">
                                {message.content}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Message Input */}
            <div className="space-y-3 flex-shrink-0">
              {isSendingMessage && (
                <Card className="border-0 bg-muted/50">
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Sending message...</span>
                      <span className="text-primary font-medium">{Math.round(typingProgress)}%</span>
                    </div>
                    <Progress value={typingProgress} className="h-1" />
                  </CardContent>
                </Card>
              )}
              
              <div className="flex items-end space-x-3">
                <div className="flex-1 relative">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={connected ? "Type your message..." : "Connecting to chat..."}
                    className={cn(
                      "min-h-[44px] resize-none pr-16 transition-all bg-background/50",
                      "focus:border-primary/50 focus:ring-primary/20"
                    )}
                    onKeyPress={handleChatKeyPress}
                    disabled={!connected || isSendingMessage}
                    maxLength={500}
                  />
                  <div className="absolute right-3 bottom-3 text-xs text-muted-foreground font-mono">
                    <span className={cn(
                      "transition-colors",
                      newMessage.length > 450 ? "text-orange-500" : "",
                      newMessage.length > 480 ? "text-red-500 font-medium" : ""
                    )}>
                      {newMessage.length}/500
                    </span>
                  </div>
                </div>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={!connected || !newMessage.trim() || isSendingMessage}
                      className="bg-green-600 hover:bg-green-700 shadow-md"
                    >
                      {isSendingMessage ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Send message {!connected ? '(Reconnecting...)' : ''}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              {/* Connection Status */}
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center space-x-2">
                  {connected ? (
                    <div className="flex items-center space-x-1.5 text-green-600 dark:text-green-400">
                      <Wifi className="h-3 w-3" />
                      <span className="font-medium">Connected</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1.5 text-red-600 dark:text-red-400">
                      <WifiOff className="h-3 w-3" />
                      <span className="font-medium">Reconnecting...</span>
                    </div>
                  )}
                </div>
                
                {newMessage && (
                  <div className="text-muted-foreground">
                    Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs border">Enter</kbd> to send
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
