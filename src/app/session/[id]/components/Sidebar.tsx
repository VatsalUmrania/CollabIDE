// import { 
//   Users, 
//   MessageSquare, 
//   Send, 
//   MoreVertical, 
//   Crown, 
//   UserMinus, 
//   Loader2,
//   Wifi,
//   WifiOff,
//   Hash,
//   Clock,
//   UserCheck,
//   MessageCircle,
//   Sparkles,
//   X
// } from 'lucide-react';
// import { Card, CardContent, CardHeader } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { cn } from '@/lib/utils';
// import { useState, useEffect } from 'react';

// interface SidebarProps {
//   user: any;
//   session: any;
//   isHost: boolean;
//   onlineUsers: any[];
//   participantCount: number;
//   getUserColor: (userId: string) => string;
//   showParticipantMenu: string | null;
//   setShowParticipantMenu: (id: string | null) => void;
//   removeParticipant: (id: string) => void;
//   messages: any[];
//   newMessage: string;
//   setNewMessage: (msg: string) => void;
//   chatError: string;
//   connected: boolean;
//   isSendingMessage: boolean;
//   sendMessage: () => void;
//   handleChatKeyPress: (e: React.KeyboardEvent) => void;
//   messagesEndRef: React.RefObject<HTMLDivElement>;
//   className?: string;
//   isMobile?: boolean;
// }

// export default function Sidebar({
//   user,
//   session,
//   isHost,
//   onlineUsers,
//   participantCount,
//   getUserColor,
//   showParticipantMenu,
//   setShowParticipantMenu,
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
//   isMobile = false
// }: SidebarProps) {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   // Check for very small screens
//   useEffect(() => {
//     const checkVerySmall = () => {
//       if (window.innerWidth < 640) {
//         setIsCollapsed(true);
//       }
//     };
    
//     checkVerySmall();
//     window.addEventListener('resize', checkVerySmall);
//     return () => window.removeEventListener('resize', checkVerySmall);
//   }, []);

//   const formatTime = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   const getRelativeTime = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffMs = now.getTime() - date.getTime();
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMins / 60);
    
//     if (diffHours > 0) return `${diffHours}h ago`;
//     if (diffMins > 0) return `${diffMins}m ago`;
//     return 'now';
//   };

//   return (
//     <div className={cn(
//       "border-l border-border/30 glass-card backdrop-blur-sm flex flex-col transition-all duration-300",
//       isMobile ? "w-full" : isCollapsed ? "w-16" : "w-80",
//       className
//     )}>
//       {/* Collapse Toggle Button */}
//       {!isMobile && (
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => setIsCollapsed(!isCollapsed)}
//           className="absolute -left-3 top-4 z-10 bg-card border border-border/30 rounded-full w-6 h-6 p-0 hover:bg-accent/50 transition-all duration-200"
//         >
//           {isCollapsed ? (
//             <Users className="h-3 w-3" />
//           ) : (
//             <X className="h-3 w-3" />
//           )}
//         </Button>
//       )}

//       {/* Participants Section */}
//       <Card className={cn(
//         "m-4 mb-2 flex-shrink-0 glass-card backdrop-blur-sm border-border/30",
//         isCollapsed && !isMobile && "mx-2"
//       )}>
//         <CardHeader className="pb-3">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               <div className="p-1.5 bg-primary/10 rounded-lg">
//                 <Users className="h-4 w-4 text-primary" />
//               </div>
//               {(!isCollapsed || isMobile) && (
//                 <div>
//                   <h3 className="text-sm font-semibold text-foreground">Participants</h3>
//                   <p className="text-xs text-muted-foreground">
//                     {participantCount} {participantCount === 1 ? 'member' : 'members'} online
//                   </p>
//                 </div>
//               )}
//             </div>
//             {(!isCollapsed || isMobile) && (
//               <Badge variant="secondary" className="bg-success/20 text-success border-success/30 text-xs">
//                 <div className="w-2 h-2 bg-success rounded-full mr-1 animate-pulse" />
//                 {participantCount}
//               </Badge>
//             )}
//           </div>
//         </CardHeader>
        
//         {(!isCollapsed || isMobile) && (
//           <CardContent className="pt-0">
//             {/* Participants List with Custom Scroll */}
//             <div className="max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/30">
//               <div className="space-y-3 pr-2">
//                 {/* Current user */}
//                 <div className="flex items-center justify-between group">
//                   <div className="flex items-center space-x-3 min-w-0 flex-1">
//                     <div className="relative">
//                       <div 
//                         className="w-8 h-8 rounded-full border-2 border-background shadow-sm flex items-center justify-center text-xs font-medium text-white"
//                         style={{ backgroundColor: getUserColor(user.id) }}
//                       >
//                         {user?.displayName?.charAt(0).toUpperCase()}
//                       </div>
//                       <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-background rounded-full" />
//                     </div>
//                     <div className="min-w-0 flex-1">
//                       <div className="flex items-center space-x-2">
//                         <span className="text-sm font-medium text-foreground truncate">
//                           {user?.displayName}
//                         </span>
//                         <Badge variant="outline" className="bg-info/20 text-info border-info/30 text-xs">
//                           You
//                         </Badge>
//                       </div>
//                       {session.owner.id === user?.id && (
//                         <Badge variant="outline" className="bg-accent-orange/20 text-accent-orange border-accent-orange/30 text-xs mt-1">
//                           <Crown className="h-2.5 w-2.5 mr-1" />
//                           Host
//                         </Badge>
//                       )}
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Other online users */}
//                 {onlineUsers
//                   .filter(u => u.userId !== user?.id)
//                   .map((participant) => (
//                     <div key={participant.userId} className="flex items-center justify-between group">
//                       <div className="flex items-center space-x-3 min-w-0 flex-1">
//                         <div className="relative">
//                           <div 
//                             className="w-8 h-8 rounded-full border-2 border-background shadow-sm flex items-center justify-center text-xs font-medium text-white"
//                             style={{ backgroundColor: getUserColor(participant.userId) }}
//                           >
//                             {participant.displayName?.charAt(0).toUpperCase()}
//                           </div>
//                           <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-background rounded-full" />
//                         </div>
//                         <div className="min-w-0 flex-1">
//                           <div className="flex items-center space-x-2">
//                             <span className="text-sm font-medium text-foreground truncate">
//                               {participant.displayName}
//                             </span>
//                             {session.owner.id === participant.userId && (
//                               <Badge variant="outline" className="bg-accent-orange/20 text-accent-orange border-accent-orange/30 text-xs">
//                                 <Crown className="h-2.5 w-2.5 mr-1" />
//                                 Host
//                               </Badge>
//                             )}
//                           </div>
//                           <div className="flex items-center space-x-1 mt-0.5">
//                             <UserCheck className="h-2.5 w-2.5 text-success" />
//                             <span className="text-xs text-muted-foreground">Online</span>
//                           </div>
//                         </div>
//                       </div>
                      
//                       {isHost && session.owner.id !== participant.userId && (
//                         <div className="relative">
//                           <Button
//                             size="sm"
//                             variant="ghost"
//                             onClick={() => setShowParticipantMenu(
//                               showParticipantMenu === participant.userId ? null : participant.userId
//                             )}
//                             className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 hover:text-destructive"
//                           >
//                             <MoreVertical className="h-3 w-3" />
//                           </Button>
//                           {showParticipantMenu === participant.userId && (
//                             <div className="absolute right-0 top-full mt-1 bg-card border border-border/50 rounded-lg shadow-lg py-1 z-20 glass-card backdrop-blur-sm animate-fade-in-scale">
//                               <button
//                                 onClick={() => removeParticipant(participant.userId)}
//                                 className="flex items-center px-3 py-2 text-sm text-destructive hover:bg-destructive/10 w-full text-left transition-colors duration-200"
//                               >
//                                 <UserMinus className="h-3 w-3 mr-2" />
//                                 Remove from session
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   ))}
                
//                 {/* Empty state */}
//                 {participantCount === 1 && (
//                   <div className="text-center text-muted-foreground text-sm py-4 space-y-2">
//                     <Sparkles className="h-8 w-8 mx-auto opacity-50" />
//                     <p>You're flying solo!</p>
//                     <p className="text-xs">
//                       {isHost ? 'Invite others to join the collaboration' : 'Waiting for others to join...'}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </CardContent>
//         )}
//       </Card>

//       {/* Chat Section */}
//       <Card className={cn(
//         "mx-4 mb-4 flex-1 flex flex-col min-h-0 glass-card backdrop-blur-sm border-border/30",
//         isCollapsed && !isMobile && "mx-2"
//       )}>
//         <CardHeader className="pb-3 flex-shrink-0">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               <div className="p-1.5 bg-accent-emerald/10 rounded-lg">
//                 <MessageSquare className="h-4 w-4 text-accent-emerald" />
//               </div>
//               {(!isCollapsed || isMobile) && (
//                 <div>
//                   <h3 className="text-sm font-semibold text-foreground">Team Chat</h3>
//                   <p className="text-xs text-muted-foreground">
//                     Real-time collaboration
//                   </p>
//                 </div>
//               )}
//             </div>
//             {(!isCollapsed || isMobile) && (
//               <div className="flex items-center space-x-2">
//                 <div className={cn(
//                   "w-2 h-2 rounded-full transition-all duration-300",
//                   connected ? "bg-success animate-pulse" : "bg-destructive"
//                 )} />
//                 <Badge variant="secondary" className="bg-accent-emerald/20 text-accent-emerald border-accent-emerald/30 text-xs">
//                   <Hash className="h-2.5 w-2.5 mr-1" />
//                   {messages.length}
//                 </Badge>
//               </div>
//             )}
//           </div>
//         </CardHeader>
        
//         {(!isCollapsed || isMobile) && (
//           <CardContent className="pt-0 flex-1 flex flex-col min-h-0">
//             {chatError && (
//               <Alert variant="destructive" className="mb-3 glass-card backdrop-blur-sm animate-slide-down">
//                 <AlertDescription className="text-sm">{chatError}</AlertDescription>
//               </Alert>
//             )}
            
//             {/* Messages Area with Custom Scroll */}
//             <div className="flex-1 mb-3 pr-2 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/30">
//               <div className="space-y-4 pr-2">
//                 {messages.length === 0 ? (
//                   <div className="text-center text-muted-foreground py-8 space-y-3">
//                     <MessageCircle className="h-12 w-12 mx-auto opacity-50" />
//                     <div>
//                       <p className="font-medium">No messages yet</p>
//                       <p className="text-xs">Start the conversation! 💬</p>
//                     </div>
//                   </div>
//                 ) : (
//                   messages.map((message) => (
//                     <div key={message.id} className="group">
//                       <div className="flex items-start space-x-3">
//                         <div 
//                           className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0 mt-0.5"
//                           style={{ backgroundColor: getUserColor(message.user.id) }}
//                         >
//                           {message.user.displayName?.charAt(0).toUpperCase()}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center space-x-2 mb-1">
//                             <span className={cn(
//                               "text-sm font-medium truncate",
//                               message.user.id === user?.id ? 'text-primary' : 'text-foreground'
//                             )}>
//                               {message.user.displayName}
//                               {message.user.id === user?.id && ' (You)'}
//                             </span>
//                             <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                               <Clock className="h-2.5 w-2.5 text-muted-foreground" />
//                               <span className="text-xs text-muted-foreground">
//                                 {formatTime(message.createdAt)}
//                               </span>
//                             </div>
//                           </div>
//                           <div className={cn(
//                             "text-sm rounded-lg px-3 py-2 border transition-all duration-200",
//                             message.user.id === user?.id 
//                               ? 'bg-primary/10 border-primary/30 text-primary ml-0' 
//                               : 'bg-muted/20 border-border/30 text-foreground'
//                           )}>
//                             {message.content}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//                 <div ref={messagesEndRef} />
//               </div>
//             </div>
            
//             {/* Message Input */}
//             <div className="space-y-2 flex-shrink-0">
//               <div className="flex space-x-2">
//                 <Input
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   placeholder={connected ? "Type your message..." : "Connecting to chat..."}
//                   className="text-sm glass-card backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all duration-300"
//                   onKeyPress={handleChatKeyPress}
//                   disabled={!connected || isSendingMessage}
//                   maxLength={500}
//                 />
//                 <Button 
//                   size="sm" 
//                   onClick={sendMessage} 
//                   disabled={!connected || !newMessage.trim() || isSendingMessage}
//                   className="px-3 bg-gradient-to-r from-accent-emerald to-success hover:from-accent-emerald/90 hover:to-success/90 transition-all duration-300 group"
//                 >
//                   {isSendingMessage ? (
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                   ) : (
//                     <Send className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
//                   )}
//                 </Button>
//               </div>
              
//               {/* Character Count and Status */}
//               <div className="flex justify-between items-center text-xs text-muted-foreground">
//                 <div className="flex items-center space-x-2">
//                   {connected ? (
//                     <>
//                       <Wifi className="h-3 w-3 text-success" />
//                       <span>Connected</span>
//                     </>
//                   ) : (
//                     <>
//                       <WifiOff className="h-3 w-3 text-destructive" />
//                       <span>Reconnecting...</span>
//                     </>
//                   )}
//                 </div>
//                 <span className={cn(
//                   "font-mono",
//                   newMessage.length > 450 ? "text-warning" : "text-muted-foreground"
//                 )}>
//                   {newMessage.length}/500
//                 </span>
//               </div>
//             </div>
//           </CardContent>
//         )}
//       </Card>
//     </div>
//   );
// }


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
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface SidebarProps {
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
  className?: string;
  isMobile?: boolean;
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
  isMobile = false
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Check for very small screens
  useEffect(() => {
    const checkVerySmall = () => {
      if (window.innerWidth < 640) {
        setIsCollapsed(true);
      }
    };
    
    checkVerySmall();
    window.addEventListener('resize', checkVerySmall);
    return () => window.removeEventListener('resize', checkVerySmall);
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'now';
  };

  return (
    <div className={cn(
      "border-l border-gray-700 bg-gray-800 flex flex-col transition-all duration-300",
      isMobile ? "w-full" : isCollapsed ? "w-16" : "w-80",
      className
    )}>
      {/* Collapse Toggle Button */}
      {!isMobile && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -left-3 top-4 z-10 bg-gray-800 border border-gray-700 rounded-full w-6 h-6 p-0 hover:bg-gray-700 transition-colors"
        >
          {isCollapsed ? (
            <Users className="h-3 w-3" />
          ) : (
            <X className="h-3 w-3" />
          )}
        </Button>
      )}

      {/* Participants Section */}
      <Card className={cn(
        "m-4 mb-2 flex-shrink-0 bg-gray-800 border-gray-700",
        isCollapsed && !isMobile && "mx-2"
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-blue-900/30 rounded-lg">
                <Users className="h-4 w-4 text-blue-400" />
              </div>
              {(!isCollapsed || isMobile) && (
                <div>
                  <h3 className="text-sm font-semibold text-white">Participants</h3>
                  <p className="text-xs text-gray-400">
                    {participantCount} {participantCount === 1 ? 'member' : 'members'} online
                  </p>
                </div>
              )}
            </div>
            {(!isCollapsed || isMobile) && (
              <Badge className="bg-green-900/30 text-green-300 border-green-600 text-xs">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse" />
                {participantCount}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        {(!isCollapsed || isMobile) && (
          <CardContent className="pt-0">
            {/* Participants List */}
            <div className="max-h-40 overflow-y-auto">
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
        )}
      </Card>

      {/* Chat Section */}
      <Card className={cn(
        "mx-4 mb-4 flex-1 flex flex-col min-h-0 bg-gray-800 border-gray-700",
        isCollapsed && !isMobile && "mx-2"
      )}>
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-green-900/30 rounded-lg">
                <MessageSquare className="h-4 w-4 text-green-400" />
              </div>
              {(!isCollapsed || isMobile) && (
                <div>
                  <h3 className="text-sm font-semibold text-white">Team Chat</h3>
                  <p className="text-xs text-gray-400">
                    Real-time collaboration
                  </p>
                </div>
              )}
            </div>
            {(!isCollapsed || isMobile) && (
              <div className="flex items-center space-x-2">
                <div className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  connected ? "bg-green-400 animate-pulse" : "bg-red-400"
                )} />
                <Badge className="bg-green-900/30 text-green-300 border-green-600 text-xs">
                  <Hash className="h-2.5 w-2.5 mr-1" />
                  {messages.length}
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>
        
        {(!isCollapsed || isMobile) && (
          <CardContent className="pt-0 flex-1 flex flex-col min-h-0">
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
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Clock className="h-2.5 w-2.5 text-gray-500" />
                              <span className="text-xs text-gray-500">
                                {formatTime(message.createdAt)}
                              </span>
                            </div>
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
                  className="px-3 bg-green-600 hover:bg-green-700 transition-colors"
                >
                  {isSendingMessage ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {/* Character Count and Status */}
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
        )}
      </Card>
    </div>
  );
}
