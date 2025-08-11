// components/ChatPanel.tsx
import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Hash, Wifi, WifiOff, X, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface ChatPanelProps {
  user: any;
  messages: any[];
  newMessage: string;
  setNewMessage: (msg: string) => void;
  chatError: string;
  connected: boolean;
  isSendingMessage: boolean;
  sendMessage: () => void;
  handleChatKeyPress: (e: React.KeyboardEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  getUserColor: (userId: string) => string;
  onClose: () => void;
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
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="h-full bg-gray-800 border-gray-700 rounded-none">
      <CardHeader className="pb-3 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-green-900/30 rounded-lg">
              <MessageSquare className="h-4 w-4 text-green-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Team Chat</h3>
              <p className="text-xs text-gray-400">Real-time collaboration</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={cn(
              "w-2 h-2 rounded-full transition-colors",
              connected ? "bg-green-400 animate-pulse" : "bg-red-400"
            )} />
            <Badge className="bg-green-900/30 text-green-300 border-green-600 text-xs">
              <Hash className="h-2.5 w-2.5 mr-1" />
              {messages.length}
            </Badge>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={onClose}
              className="hover:bg-red-900/30 hover:text-red-300"
              title="Close Chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 flex flex-col min-h-0 p-4">
        {chatError && (
          <Alert variant="destructive" className="mb-3">
            <AlertDescription className="text-sm">{chatError}</AlertDescription>
          </Alert>
        )}
        
        {/* Messages Area */}
        <div className="flex-1 mb-3 pr-2 overflow-y-auto">
          <div className="space-y-4 pr-2">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-8 space-y-3">
                <MessageCircle className="h-12 w-12 mx-auto opacity-50" />
                <div>
                  <p className="font-medium">No messages yet</p>
                  <p className="text-xs">Start the conversation! 💬</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="group">
                  <div className="flex items-start space-x-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: getUserColor(message.user.id) }}
                    >
                      {message.user.displayName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={cn(
                          "text-sm font-medium truncate",
                          message.user.id === user?.id ? 'text-blue-400' : 'text-white'
                        )}>
                          {message.user.displayName}
                          {message.user.id === user?.id && ' (You)'}
                        </span>
                        <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          {formatTime(message.createdAt)}
                        </span>
                      </div>
                      <div className={cn(
                        "text-sm rounded-lg px-3 py-2 border transition-colors",
                        message.user.id === user?.id 
                          ? 'bg-blue-900/30 border-blue-600 text-blue-300' 
                          : 'bg-gray-700 border-gray-600 text-gray-200'
                      )}>
                        {message.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Message Input */}
        <div className="space-y-2 flex-shrink-0">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={connected ? "Type your message..." : "Connecting to chat..."}
              className="text-sm"
              onKeyPress={handleChatKeyPress}
              disabled={!connected || isSendingMessage}
              maxLength={500}
            />
            <Button 
              size="sm" 
              onClick={sendMessage} 
              disabled={!connected || !newMessage.trim() || isSendingMessage}
              className="px-3 bg-green-600 hover:bg-green-700"
            >
              {isSendingMessage ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {/* Status */}
          <div className="flex justify-between items-center text-xs text-gray-400">
            <div className="flex items-center space-x-2">
              {connected ? (
                <>
                  <Wifi className="h-3 w-3 text-green-400" />
                  <span>Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 text-red-400" />
                  <span>Reconnecting...</span>
                </>
              )}
            </div>
            <span className={cn(
              "font-mono",
              newMessage.length > 450 ? "text-yellow-400" : "text-gray-500"
            )}>
              {newMessage.length}/500
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
