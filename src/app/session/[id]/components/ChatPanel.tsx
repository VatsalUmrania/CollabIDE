'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Send, 
  MessageCircle, 
  Hash, 
  Wifi, 
  WifiOff, 
  X, 
  Loader2,
  MessageSquare,
  Clock,
  Users,
  Smile,
  MoreVertical
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface ChatPanelProps {
  user: any
  messages: any[]
  newMessage: string
  setNewMessage: (msg: string) => void
  chatError: string
  connected: boolean
  isSendingMessage: boolean
  sendMessage: () => void
  handleChatKeyPress: (e: React.KeyboardEvent) => void
  messagesEndRef: React.RefObject<HTMLDivElement>
  getUserColor: (userId: string) => string
  onClose: () => void
}

export default function ChatPanel({
  user,
  messages,
  newMessage,
  setNewMessage,
  chatError,
  connected,
  isSendingMessage,
  sendMessage,
  handleChatKeyPress,
  messagesEndRef,
  getUserColor,
  onClose
}: ChatPanelProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?'
  }

  const uniqueParticipants = Array.from(
    new Set(messages.map(m => m.user.id))
  ).length

  return (
    <Card className="h-full border-0 bg-card/80 backdrop-blur shadow-2xl flex flex-col">
      {/* Header */}
      <CardHeader className="pb-4 border-b flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              {connected && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card animate-pulse" />
              )}
            </div>
            <div className="space-y-1">
              <CardTitle className="text-lg">Team Chat</CardTitle>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>{uniqueParticipants} participant{uniqueParticipants !== 1 ? 's' : ''}</span>
                <Separator orientation="vertical" className="h-3" />
                <div className="flex items-center gap-1">
                  {connected ? (
                    <>
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span>Online</span>
                    </>
                  ) : (
                    <>
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      <span>Reconnecting</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              <Hash className="h-3 w-3 mr-1" />
              {messages.length}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Clear messages</DropdownMenuItem>
                <DropdownMenuItem>Export chat</DropdownMenuItem>
                <DropdownMenuItem onClick={onClose}>Close chat</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      {/* Content */}
      <CardContent className="p-0 flex-1 flex flex-col min-h-0">
        {/* Error Alert */}
        {chatError && (
          <div className="p-4 pb-0">
            <Alert variant="destructive">
              <AlertDescription>{chatError}</AlertDescription>
            </Alert>
          </div>
        )}
        
        {/* Messages Area */}
        <ScrollArea className="flex-1 px-4">
          <div className="py-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="mx-auto w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">No messages yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Start the conversation! Share ideas, ask questions, or collaborate with your team.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Smile className="h-4 w-4" />
                  <span>Type a message below to get started</span>
                </div>
              </div>
            ) : (
              messages.map((message, index) => {
                const isOwnMessage = message.user.id === user?.id
                const showAvatar = index === 0 || messages[index - 1]?.user.id !== message.user.id
                const isConsecutive = index > 0 && messages[index - 1]?.user.id === message.user.id
                
                return (
                  <div key={message.id} className={cn(
                    "group relative",
                    isConsecutive && "mt-1"
                  )}>
                    <div className={cn(
                      "flex items-start gap-3",
                      isOwnMessage ? "flex-row-reverse" : ""
                    )}>
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {showAvatar ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
                                <AvatarImage src={message.user.avatar} />
                                <AvatarFallback 
                                  className="text-xs font-semibold text-white"
                                  style={{ backgroundColor: getUserColor(message.user.id) }}
                                >
                                  {getInitials(message.user.displayName)}
                                </AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{message.user.displayName}</p>
                            </TooltipContent>
                          </Tooltip>
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
                            "flex items-center gap-2 mb-1",
                            isOwnMessage ? "flex-row-reverse" : ""
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
                                  {formatRelativeTime(message.createdAt)}
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
                          "relative rounded-2xl px-4 py-3 text-sm break-words transition-all duration-200 max-w-full",
                          "border shadow-sm group-hover:shadow-md",
                          isOwnMessage 
                            ? "bg-primary text-primary-foreground border-primary/20 shadow-primary/10" 
                            : "bg-muted/50 text-foreground border-border/50 hover:bg-muted/80",
                          showAvatar ? "" : "mt-1"
                        )}>
                          <div className="whitespace-pre-wrap">
                            {message.content}
                          </div>
                          
                          {/* Message status indicator for own messages */}
                          {isOwnMessage && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-card rounded-full border border-primary/20 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            </div>
                          )}
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
        <div className="p-4 border-t bg-muted/20 flex-shrink-0">
          <div className="space-y-3">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={connected ? "Type your message..." : "Connecting to chat..."}
                  className={cn(
                    "min-h-[44px] resize-none pr-16 transition-all",
                    "bg-background border-border/50",
                    "focus:border-primary/50 focus:ring-primary/20",
                    "disabled:opacity-50"
                  )}
                  onKeyPress={handleChatKeyPress}
                  disabled={!connected || isSendingMessage}
                  maxLength={500}
                />
                
                {/* Character count */}
                <div className="absolute right-12 bottom-3 text-xs text-muted-foreground font-mono">
                  <span className={cn(
                    "transition-colors",
                    newMessage.length > 450 ? "text-orange-500" : "",
                    newMessage.length > 480 ? "text-red-500 font-semibold" : ""
                  )}>
                    {newMessage.length}/500
                  </span>
                </div>
              </div>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={sendMessage} 
                    disabled={!connected || !newMessage.trim() || isSendingMessage}
                    className={cn(
                      "h-11 px-4 transition-all duration-200 shadow-sm hover:shadow-md",
                      "disabled:opacity-50"
                    )}
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
            
            {/* Status Bar */}
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "flex items-center gap-1.5 transition-colors",
                  connected ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}>
                  {connected ? (
                    <>
                      <Wifi className="h-3 w-3" />
                      <span className="font-medium">Connected</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3 w-3" />
                      <span className="font-medium">Reconnecting...</span>
                    </>
                  )}
                </div>
                
                {uniqueParticipants > 1 && (
                  <>
                    <Separator orientation="vertical" className="h-3" />
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{uniqueParticipants} online</span>
                    </div>
                  </>
                )}
              </div>
              
              {newMessage && (
                <div className="text-muted-foreground flex items-center gap-1">
                  <span>Press</span>
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs border">Enter</kbd>
                  <span>to send</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
