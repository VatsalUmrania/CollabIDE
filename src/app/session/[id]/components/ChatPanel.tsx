
'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Send, 
  MessageCircle, 
  Wifi, 
  WifiOff, 
  X, 
  Loader2,
  MessageSquare,
  Users,
  MoreVertical,
  Settings,
  Volume2,
  VolumeX,
  Trash2
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
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
  const [soundEnabled, setSoundEnabled] = useState(true)

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const today = new Date().setHours(0, 0, 0, 0)
    const messageDate = new Date(date).setHours(0, 0, 0, 0)
    
    if (messageDate === today) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'
  }

  const uniqueParticipants = Array.from(
    new Set(messages.map(m => m.user.id))
  ).length

  const clearMessages = () => {
    // Implementation for clearing messages
    console.log('Clear messages')
  }

  return (
    <div className="h-full bg-[#1e1e1e] border-l border-[#333] flex flex-col">
      {/* Enhanced Header */}
      <div className="flex-shrink-0 bg-[#2d2d30] border-b border-[#333]">
        <div className="flex items-center justify-between px-3 h-10">
          <div className="flex items-center space-x-2">
            sa
              <MessageSquare className="h-3 w-3 text-white" />
            
            <div className="flex flex-col">
              <span className="text-xs font-medium text-[#cccccc]">Team Chat</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {/* Participant count with better visibility */}
            {connected && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-1 px-2 py-1 rounded bg-[#0e4429] text-[#4ade80]">
                    <Users className="h-3 w-3" />
                    <span className="text-xs font-medium">{uniqueParticipants}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {uniqueParticipants} participant{uniqueParticipants !== 1 ? 's' : ''} online
                </TooltipContent>
              </Tooltip>
            )}

            {/* Chat options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-[#37373d] text-[#cccccc]"
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setSoundEnabled(!soundEnabled)}>
                  {soundEnabled ? (
                    <>
                      <VolumeX className="h-3 w-3 mr-2" />
                      Mute notifications
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-3 w-3 mr-2" />
                      Enable notifications
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={clearMessages}>
                  <Trash2 className="h-3 w-3 mr-2" />
                  Clear messages
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 hover:bg-[#37373d] text-[#cccccc]"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Connection status bar */}
        <div className={cn(
          "px-3 py-1 text-xs flex items-center justify-between border-b border-[#333]",
          connected ? "bg-[#0f2719] text-[#4ade80]" : "bg-[#2d1b1b] text-[#f87171]"
        )}>
          <div className="flex items-center space-x-1">
            {connected ? (
              <>
                <Wifi className="h-3 w-3" />
                <span>Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 animate-pulse" />
                <span>Reconnecting...</span>
              </>
            )}
          </div>
          
          {messages.length > 0 && (
            <span className="text-[#888888]">{messages.length} message{messages.length !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>
      
      {/* Error Alert - Improved styling */}
      {chatError && (
        <div className="px-3 py-2 bg-[#2d1b1b] border-b border-[#4c1d1d]">
          <div className="text-xs text-[#f87171] flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#f87171] rounded-full" />
            <span>{chatError}</span>
          </div>
        </div>
      )}
      
      {/* Messages Area - Enhanced */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          {messages.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="mx-auto w-12 h-12 bg-[#2d2d30] rounded-full flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-[#888888]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-[#cccccc]">No messages yet</h3>
                <p className="text-xs text-[#888888] max-w-xs">
                  Start collaborating! Send a message to your team members.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => {
                const isOwnMessage = message.user.id === user?.id
                const showAvatar = index === 0 || messages[index - 1]?.user.id !== message.user.id
                const showTimestamp = showAvatar || 
                  (index > 0 && new Date(message.createdAt).getTime() - new Date(messages[index - 1].createdAt).getTime() > 300000) // 5 minutes
                
                return (
                  <div key={message.id} className="group">
                    <div className="flex items-start space-x-3">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {showAvatar ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div 
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white shadow-sm"
                                style={{ backgroundColor: getUserColor(message.user.id) }}
                              >
                                {getInitials(message.user.displayName)}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              {message.user.displayName}
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <div className="w-8" />
                        )}
                      </div>

                      {/* Message Content */}
                      <div className="flex-1 min-w-0">
                        {/* User info header */}
                        {showAvatar && (
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={cn(
                              "text-sm font-medium",
                              isOwnMessage ? 'text-[#4fc1ff]' : 'text-[#cccccc]'
                            )}>
                              {isOwnMessage ? 'User One (You)' : message.user.displayName}
                            </span>
                            {showTimestamp && (
                              <span className="text-xs text-[#888888]">
                                {formatTime(message.createdAt)}
                              </span>
                            )}
                          </div>
                        )}
                        
                        {/* Message bubble */}
                        <div className={cn(
                          "relative group-hover:shadow-sm transition-shadow",
                          !showAvatar && "ml-0"
                        )}>
                          <div className={cn(
                            "inline-block rounded-lg px-3 py-2 text-sm max-w-[85%] break-words",
                            isOwnMessage 
                              ? "bg-[#0969da] text-white" 
                              : "bg-[#2d2d30] text-[#e6edf3] border border-[#333]"
                          )}>
                            {message.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Enhanced Message Input */}
      <div className="flex-shrink-0 p-3 bg-[#2d2d30] border-t border-[#333]">
        <div className="space-y-2">
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={connected ? "Type your message..." : "Connecting to chat..."}
                className={cn(
                  "min-h-[36px] text-sm bg-[#1e1e1e] border-[#333] text-[#cccccc] resize-none",
                  "placeholder:text-[#888888] focus:border-[#0969da] focus:ring-1 focus:ring-[#0969da]",
                  "disabled:opacity-50 disabled:cursor-not-allowed pr-12"
                )}
                onKeyPress={handleChatKeyPress}
                disabled={!connected || isSendingMessage}
                maxLength={500}
              />
              
              {/* Character counter */}
              <div className={cn(
                "absolute right-3 bottom-2 text-xs pointer-events-none",
                newMessage.length > 450 ? "text-orange-400" : "text-[#888888]",
                newMessage.length > 480 && "text-red-400 font-medium"
              )}>
                {newMessage.length}/500
              </div>
            </div>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={sendMessage} 
                  disabled={!connected || !newMessage.trim() || isSendingMessage}
                  className={cn(
                    "h-9 w-9 p-0 shrink-0",
                    "bg-[#16821b] hover:bg-[#1a9268] disabled:bg-[#333] disabled:text-[#666]",
                    "transition-colors"
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
                {!connected ? 'Reconnecting...' : !newMessage.trim() ? 'Type a message' : 'Send message'}
              </TooltipContent>
            </Tooltip>
          </div>
          
          {/* Typing indicator space */}
          <div className="h-4 flex items-center">
            {newMessage && (
              <div className="text-xs text-[#888888] flex items-center space-x-1">
                <span>Press</span>
                <kbd className="px-1 py-0.5 bg-[#1e1e1e] border border-[#333] rounded text-xs">Enter</kbd>
                <span>to send</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
