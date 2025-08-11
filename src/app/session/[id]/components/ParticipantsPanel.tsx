// components/ParticipantsPanel.tsx
import { Users, Crown, UserMinus, MoreVertical, UserCheck, Sparkles, X } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ParticipantsPanelProps {
  user: any;
  session: any;
  isHost: boolean;
  onlineUsers: any[];
  participantCount: number;
  getUserColor: (userId: string) => string;
  showParticipantMenu: string | null;
  setShowParticipantMenu: (id: string | null) => void;
  removeParticipant: (id: string) => void;
  onClose: () => void;
}

export default function ParticipantsPanel({
  user,
  session,
  isHost,
  onlineUsers,
  participantCount,
  getUserColor,
  showParticipantMenu,
  setShowParticipantMenu,
  removeParticipant,
  onClose
}: ParticipantsPanelProps) {
  return (
    <Card className="h-full bg-gray-800 border-gray-700 rounded-none">
      <CardHeader className="pb-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-900/30 rounded-lg">
              <Users className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Participants</h3>
              <p className="text-xs text-gray-400">
                {participantCount} {participantCount === 1 ? 'member' : 'members'} online
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-900/30 text-green-300 border-green-600 text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse" />
              {participantCount}
            </Badge>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={onClose}
              className="hover:bg-red-900/30 hover:text-red-300"
              title="Close Participants"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        {/* Participants List */}
        <div className="max-h-96 overflow-y-auto">
          <div className="space-y-3 pr-2">
            {/* Current user */}
            <div className="flex items-center justify-between group">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="relative">
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-gray-800 shadow-sm flex items-center justify-center text-xs font-medium text-white"
                    style={{ backgroundColor: getUserColor(user.id) }}
                  >
                    {user?.displayName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-gray-800 rounded-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-white truncate">
                      {user?.displayName}
                    </span>
                    <Badge className="bg-blue-900/30 text-blue-300 border-blue-600 text-xs">
                      You
                    </Badge>
                  </div>
                  {session.owner.id === user?.id && (
                    <Badge className="bg-orange-900/30 text-orange-300 border-orange-600 text-xs mt-1">
                      <Crown className="h-2.5 w-2.5 mr-1" />
                      Host
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {/* Other online users */}
            {onlineUsers
              .filter(u => u.userId !== user?.id)
              .map((participant) => (
                <div key={participant.userId} className="flex items-center justify-between group">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="relative">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-gray-800 shadow-sm flex items-center justify-center text-xs font-medium text-white"
                        style={{ backgroundColor: getUserColor(participant.userId) }}
                      >
                        {participant.displayName?.charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-gray-800 rounded-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-white truncate">
                          {participant.displayName}
                        </span>
                        {session.owner.id === participant.userId && (
                          <Badge className="bg-orange-900/30 text-orange-300 border-orange-600 text-xs">
                            <Crown className="h-2.5 w-2.5 mr-1" />
                            Host
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 mt-0.5">
                        <UserCheck className="h-2.5 w-2.5 text-green-400" />
                        <span className="text-xs text-gray-400">Online</span>
                      </div>
                    </div>
                  </div>
                  
                  {isHost && session.owner.id !== participant.userId && (
                    <div className="relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowParticipantMenu(
                          showParticipantMenu === participant.userId ? null : participant.userId
                        )}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-900/30 hover:text-red-400"
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                      {showParticipantMenu === participant.userId && (
                        <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-1 z-20">
                          <button
                            onClick={() => removeParticipant(participant.userId)}
                            className="flex items-center px-3 py-2 text-sm text-red-400 hover:bg-red-900/30 w-full text-left transition-colors"
                          >
                            <UserMinus className="h-3 w-3 mr-2" />
                            Remove from session
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            
            {/* Empty state */}
            {participantCount === 1 && (
              <div className="text-center text-gray-400 text-sm py-4 space-y-2">
                <Sparkles className="h-8 w-8 mx-auto opacity-50" />
                <p>You're flying solo!</p>
                <p className="text-xs">
                  {isHost ? 'Invite others to join the collaboration' : 'Waiting for others to join...'}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
