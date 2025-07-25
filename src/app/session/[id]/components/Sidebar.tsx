import { Users, MessageSquare, Send, MoreVertical, Crown, UserMinus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
  messagesEndRef
}: {
  user: any;
  session: any;
  isHost: boolean;
  onlineUsers: any[];
  participantCount: number;
  getUserColor: (userId: string) => string;
  showParticipantMenu: string | null;
  setShowParticipantMenu: (id: string | null) => void;
  removeParticipant: (id: string) => void;
  messages: any[];
  newMessage: string;
  setNewMessage: (msg: string) => void;
  chatError: string;
  connected: boolean;
  isSendingMessage: boolean;
  sendMessage: () => void;
  handleChatKeyPress: (e: React.KeyboardEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div className="w-80 border-l bg-gray-50 flex flex-col">
      {/* Participants */}
      <Card className="m-4 mb-2 flex-shrink-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Participants ({participantCount})
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 max-h-40 overflow-y-auto">
          <div className="space-y-2">
            {/* Current user */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2 border-2 border-white shadow-sm"
                  style={{ backgroundColor: getUserColor(user.id) }}
                ></div>
                <span className="text-sm font-medium">{user?.displayName}</span>
                <span className="text-xs text-gray-500 ml-1">(You)</span>
              </div>
              {session.owner.id === user?.id && (
                <Badge variant="outline" className="text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  Host
                </Badge>
              )}
            </div>
            
            {/* Other online users */}
            {onlineUsers
              .filter(u => u.userId !== user?.id)
              .map((participant) => (
                <div key={participant.userId} className="flex items-center justify-between group">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2 border-2 border-white shadow-sm"
                      style={{ backgroundColor: getUserColor(participant.userId) }}
                    ></div>
                    <span className="text-sm font-medium">{participant.displayName}</span>
                    {session.owner.id === participant.userId && (
                      <Badge variant="outline" className="text-xs ml-2">
                        <Crown className="h-3 w-3 mr-1" />
                        Host
                      </Badge>
                    )}
                  </div>
                  {isHost && session.owner.id !== participant.userId && (
                    <div className="relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowParticipantMenu(
                          showParticipantMenu === participant.userId ? null : participant.userId
                        )}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                      {showParticipantMenu === participant.userId && (
                        <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg py-1 z-20">
                          <button
                            onClick={() => removeParticipant(participant.userId)}
                            className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                          >
                            <UserMinus className="h-3 w-3 mr-2" />
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            
            {/* Show message if only one user */}
            {participantCount === 1 && (
              <div className="text-center text-gray-500 text-sm py-2">
                You&apos;re the only one here. {isHost ? 'Invite others to collaborate!' : 'Waiting for others...'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chat */}
      <Card className="mx-4 mb-4 flex-1 flex flex-col min-h-0">
        <CardHeader className="pb-3 flex-shrink-0">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-xs text-gray-500">
                {messages.length} message{messages.length !== 1 ? 's' : ''}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 flex-1 flex flex-col min-h-0">
          {chatError && (
            <Alert variant="destructive" className="mb-2">
              <AlertDescription>{chatError}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex-1 overflow-y-auto space-y-3 mb-3 min-h-0 pr-2">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-8">
                No messages yet. Start the conversation! 💬
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <div 
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: getUserColor(message.user.id) }}
                      ></div>
                      <span className={`font-medium ${message.user.id === user?.id ? 'text-blue-700' : 'text-gray-700'}`}>
                        {message.user.displayName}
                        {message.user.id === user?.id && ' (You)'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className={`text-gray-600 rounded-lg px-3 py-2 border ${
                    message.user.id === user?.id 
                      ? 'bg-blue-50 border-blue-200 ml-4' 
                      : 'bg-white border-gray-200'
                  }`}>
                    {message.content}
                  </p>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="flex space-x-2 flex-shrink-0">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={connected ? "Type a message..." : "Connecting..."}
              className="text-sm"
              onKeyPress={handleChatKeyPress}
              disabled={!connected || isSendingMessage}
              maxLength={500}
            />
            <Button 
              size="sm" 
              onClick={sendMessage} 
              disabled={!connected || !newMessage.trim() || isSendingMessage}
              className="px-3"
            >
              {isSendingMessage ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {newMessage.length}/500 characters
          </div>
        </CardContent>
      </Card>
    </div>
  );
}