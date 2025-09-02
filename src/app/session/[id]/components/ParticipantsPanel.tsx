// 'use client'

// import { 
//   Users, 
//   Crown, 
//   UserMinus, 
//   MoreVertical, 
//   UserCheck, 
//   Sparkles, 
//   X,
//   UserPlus,
//   Shield,
//   Clock,
//   Activity,
//   Dot,
//   Globe,
//   Lock
// } from 'lucide-react'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { Separator } from '@/components/ui/separator'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
// import { 
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import { cn } from '@/lib/utils'
// import { toast } from 'sonner'

// interface ParticipantsPanelProps {
//   user: any
//   session: any
//   isHost: boolean
//   onlineUsers: any[]
//   participantCount: number
//   getUserColor: (userId: string) => string
//   showParticipantMenu: string | null
//   setShowParticipantMenu: (id: string | null) => void
//   removeParticipant: (id: string) => void
//   onClose: () => void
//   sessionDuration?: string
//   inviteUsers?: () => void
// }

// export default function ParticipantsPanel({
//   user,
//   session,
//   isHost,
//   onlineUsers,
//   participantCount,
//   getUserColor,
//   showParticipantMenu,
//   setShowParticipantMenu,
//   removeParticipant,
//   onClose,
//   sessionDuration,
//   inviteUsers
// }: ParticipantsPanelProps) {
//   // Get participant role
//   const getParticipantRole = (userId: string) => {
//     if (session.owner.id === userId) return 'host'
//     return 'collaborator'
//   }

//   // Format last seen time
//   const formatLastSeen = (timestamp?: string) => {
//     if (!timestamp) return 'Just now'
//     const now = new Date()
//     const lastSeen = new Date(timestamp)
//     const diffInMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60))
    
//     if (diffInMinutes < 1) return 'Just now'
//     if (diffInMinutes < 60) return `${diffInMinutes}m ago`
//     if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
//     return lastSeen.toLocaleDateString()
//   }

//   // Enhanced remove participant with toast
//   const handleRemoveParticipant = (participantId: string, participantName: string) => {
//     removeParticipant(participantId)
//     toast.success(`${participantName} has been removed from the session`)
//   }

//   return (
//     <Card className="h-full border-0 bg-card/80 backdrop-blur shadow-2xl flex flex-col">
//       <CardHeader className="pb-4 border-b flex-shrink-0">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-gradient-to-r from-primary to-gray-500 rounded-xl flex items-center justify-center shadow-lg">
//               <Users className="h-5 w-5 text-white" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <CardTitle className="text-xl font-bold text-foreground">
//                 Participants
//               </CardTitle>
//               <CardDescription className="flex items-center space-x-2 mt-1 text-sm">
//                 <div className="flex items-center space-x-1">
//                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
//                   <span>{participantCount} online</span>
//                 </div>
//                 {sessionDuration && (
//                   <>
//                     <Dot className="h-3 w-3 text-muted-foreground/50" />
//                     <div className="flex items-center space-x-1">
//                       <Clock className="h-3 w-3" />
//                       <span>{sessionDuration}</span>
//                     </div>
//                   </>
//                 )}
//               </CardDescription>
//             </div>
//           </div>
          
//           <div className="flex items-center space-x-2">
//             <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-500/20">
//               <Activity className="h-3 w-3 mr-1" />
//               {participantCount}
//             </Badge>
            
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button 
//                   size="sm" 
//                   variant="ghost" 
//                   onClick={onClose}
//                   className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p>Close participants panel</p>
//               </TooltipContent>
//             </Tooltip>
//           </div>
//         </div>
//       </CardHeader>
      
//       <CardContent className="p-0 flex-1 flex flex-col min-h-0">
//         {/* Participants List */}
//         <ScrollArea className="flex-1">
//           <div className="p-4 space-y-6">
//             {/* Host Section */}
//             <div>
//               <div className="flex items-center space-x-2 mb-3">
//                 <Crown className="h-4 w-4 text-orange-500" />
//                 <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
//                   Host
//                 </h4>
//               </div>
              
//               <div className="space-y-3">
//                 {/* Current user if host, or session owner */}
//                 {session.owner.id === user?.id ? (
//                   <Card className="border-0 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
//                     <CardContent className="flex items-center space-x-3 p-4">
//                       <div className="relative">
//                         <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
//                           <AvatarImage src={user?.avatar} />
//                           <AvatarFallback 
//                             className="text-sm font-semibold text-white"
//                             style={{ backgroundColor: getUserColor(user.id) }}
//                           >
//                             {user?.displayName?.charAt(0).toUpperCase()}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
//                           <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
//                         </div>
//                       </div>
                      
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center space-x-2 mb-1">
//                           <span className="font-semibold text-foreground truncate text-lg">
//                             {user?.displayName}
//                           </span>
//                           <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
//                             You
//                           </Badge>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <Crown className="h-3 w-3 text-orange-500" />
//                           <span className="text-sm text-muted-foreground font-medium">Session Host</span>
//                           <Badge variant="outline" className="text-xs ml-auto">
//                             All permissions
//                           </Badge>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ) : (
//                   // Show session owner if current user is not the host
//                   onlineUsers
//                     .filter(u => u.userId === session.owner.id)
//                     .map((participant) => (
//                       <Card key={participant.userId} className="border-0 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
//                         <CardContent className="flex items-center space-x-3 p-4">
//                           <div className="relative">
//                             <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
//                               <AvatarImage src={participant.avatar} />
//                               <AvatarFallback 
//                                 className="text-sm font-semibold text-white"
//                                 style={{ backgroundColor: getUserColor(participant.userId) }}
//                               >
//                                 {participant.displayName?.charAt(0).toUpperCase()}
//                               </AvatarFallback>
//                             </Avatar>
//                             <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
//                               <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
//                             </div>
//                           </div>
                          
//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-center space-x-2 mb-1">
//                               <span className="font-semibold text-foreground truncate text-lg">
//                                 {participant.displayName}
//                               </span>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                               <Crown className="h-3 w-3 text-orange-500" />
//                               <span className="text-sm text-muted-foreground font-medium">Session Host</span>
//                               <Badge variant="outline" className="text-xs ml-auto">
//                                 All permissions
//                               </Badge>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))
//                 )}
//               </div>
//             </div>
            
//             <Separator />
            
//             {/* Collaborators Section */}
//             <div>
//               <div className="flex items-center justify-between mb-3">
//                 <div className="flex items-center space-x-2">
//                   <UserCheck className="h-4 w-4 text-green-500" />
//                   <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
//                     Collaborators
//                   </h4>
//                 </div>
//                 <Badge variant="outline" className="text-xs bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-500/20">
//                   {onlineUsers.filter(u => u.userId !== session.owner.id).length}
//                 </Badge>
//               </div>
              
//               <div className="space-y-3">
//                 {/* Current user if not host */}
//                 {session.owner.id !== user?.id && (
//                   <Card className="border-0 bg-muted/30 backdrop-blur">
//                     <CardContent className="flex items-center space-x-3 p-3">
//                       <div className="relative">
//                         <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
//                           <AvatarImage src={user?.avatar} />
//                           <AvatarFallback 
//                             className="text-sm font-semibold text-white"
//                             style={{ backgroundColor: getUserColor(user.id) }}
//                           >
//                             {user?.displayName?.charAt(0).toUpperCase()}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
//                       </div>
                      
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center space-x-2 mb-0.5">
//                           <span className="font-semibold text-foreground truncate">
//                             {user?.displayName}
//                           </span>
//                           <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
//                             You
//                           </Badge>
//                         </div>
//                         <div className="flex items-center space-x-1">
//                           <UserCheck className="h-3 w-3 text-green-500" />
//                           <span className="text-xs text-muted-foreground font-medium">Online now</span>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )}
                
//                 {/* Other collaborators */}
//                 {onlineUsers
//                   .filter(u => u.userId !== user?.id && u.userId !== session.owner.id)
//                   .map((participant) => (
//                     <Card key={participant.userId} className="group border-0 bg-card/50 hover:bg-muted/30 transition-all duration-200 cursor-pointer">
//                       <CardContent className="flex items-center space-x-3 p-3">
//                         <div className="relative">
//                           <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
//                             <AvatarImage src={participant.avatar} />
//                             <AvatarFallback 
//                               className="text-sm font-semibold text-white"
//                               style={{ backgroundColor: getUserColor(participant.userId) }}
//                             >
//                               {participant.displayName?.charAt(0).toUpperCase()}
//                             </AvatarFallback>
//                           </Avatar>
//                           <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
//                         </div>
                        
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center space-x-2 mb-0.5">
//                             <span className="font-semibold text-foreground truncate">
//                               {participant.displayName}
//                             </span>
//                           </div>
//                           <div className="flex items-center space-x-1">
//                             <UserCheck className="h-3 w-3 text-green-500" />
//                             <span className="text-xs text-muted-foreground font-medium">
//                               {formatLastSeen(participant.lastSeen)}
//                             </span>
//                           </div>
//                         </div>
                        
//                         {/* Host Controls */}
//                         {isHost && (
//                           <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                               <Button
//                                 size="sm"
//                                 variant="ghost"
//                                 className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
//                               >
//                                 <MoreVertical className="h-4 w-4" />
//                               </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent align="end" className="w-48">
//                               <DropdownMenuItem
//                                 onClick={() => handleRemoveParticipant(participant.userId, participant.displayName)}
//                                 className="text-destructive focus:text-destructive"
//                               >
//                                 <UserMinus className="h-4 w-4 mr-2" />
//                                 Remove from session
//                               </DropdownMenuItem>
//                               <DropdownMenuSeparator />
//                               <DropdownMenuItem disabled className="text-xs text-muted-foreground">
//                                 ID: {participant.userId.slice(0, 8)}...
//                               </DropdownMenuItem>
//                             </DropdownMenuContent>
//                           </DropdownMenu>
//                         )}
//                       </CardContent>
//                     </Card>
//                   ))}
//               </div>
//             </div>
            
//             {/* Empty State for Collaborators */}
//             {participantCount === 1 && (
//               <Alert className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
//                 <Sparkles className="h-4 w-4 text-primary" />
//                 <AlertDescription>
//                   <div className="space-y-2">
//                     <p className="font-semibold text-foreground">
//                       You're the only one here!
//                     </p>
//                     <p className="text-sm text-muted-foreground">
//                       {isHost 
//                         ? 'Invite others to join your collaboration session and start building together.' 
//                         : 'Waiting for others to join the session...'}
//                     </p>
//                   </div>
//                 </AlertDescription>
//               </Alert>
//             )}
//           </div>
//         </ScrollArea>
        
//         {/* Footer Actions */}
//         {isHost && inviteUsers && (
//           <div className="p-4 border-t bg-muted/20 flex-shrink-0">
//             <Button 
//               onClick={inviteUsers}
//               className="w-full bg-primary hover:bg-primary/90 shadow-md"
//               size="sm"
//             >
//               <UserPlus className="h-4 w-4 mr-2" />
//               Invite Collaborators
//             </Button>
//           </div>
//         )}
        
//         {/* Session Info Footer */}
//         <div className="p-4 border-t bg-muted/10 flex-shrink-0">
//           <div className="flex items-center justify-between text-xs">
//             <div className="flex items-center space-x-2 text-muted-foreground">
//               {session.type === 'PUBLIC' ? (
//                 <>
//                   <Globe className="h-3 w-3" />
//                   <span>Public session</span>
//                 </>
//               ) : (
//                 <>
//                   <Lock className="h-3 w-3" />
//                   <span>Private session</span>
//                 </>
//               )}
//             </div>
//             {participantCount > 1 && (
//               <div className="flex items-center space-x-1">
//                 <Activity className="h-3 w-3 text-green-500" />
//                 <span className="text-green-600 dark:text-green-400 font-medium">Active collaboration</span>
//               </div>
//             )}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }


'use client'

import { 
  Users, 
  Crown, 
  UserMinus, 
  MoreVertical, 
  UserCheck, 
  X,
  UserPlus,
  Activity,
  Globe,
  Lock,
  User
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ParticipantsPanelProps {
  user: any
  session: any
  isHost: boolean
  onlineUsers: any[]
  participantCount: number
  getUserColor: (userId: string) => string
  showParticipantMenu: string | null
  setShowParticipantMenu: (id: string | null) => void
  removeParticipant: (id: string) => void
  onClose: () => void
  sessionDuration?: string
  inviteUsers?: () => void
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
  onClose,
  sessionDuration,
  inviteUsers
}: ParticipantsPanelProps) {
  
  // Enhanced remove participant with toast
  const handleRemoveParticipant = (participantId: string, participantName: string) => {
    removeParticipant(participantId)
    toast.success(`${participantName} has been removed from the session`)
  }

  // Format last seen time
  const formatLastSeen = (timestamp?: string) => {
    if (!timestamp) return 'Just now'
    const now = new Date()
    const lastSeen = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return lastSeen.toLocaleDateString()
  }

  return (
    <div className="h-full bg-card border-l border-border flex flex-col">
      {/* Header - VS Code style */}
      <div className="flex-shrink-0 h-9 border-b border-border bg-card flex items-center justify-between px-3">
        <div className="flex items-center space-x-2">
          
            <Users className="h-2.5 w-2.5 text-accent-foreground" />
          
          <span className="text-xs font-medium text-foreground">Participants</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-green-400">{participantCount} online</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-muted text-muted-foreground"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-4">
            {/* Host Section */}
            <div>
              <div className="flex items-center space-x-1 mb-2">
                <Crown className="h-3 w-3 text-orange-500" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Host
                </span>
              </div>
              
              <div className="space-y-2">
                {session.owner.id === user?.id ? (
                  <div className="p-3 bg-orange-50/50 dark:bg-orange-950/10 border border-orange-200/50 dark:border-orange-900/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                          style={{ backgroundColor: getUserColor(user.id) }}
                        >
                          {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border border-card rounded-full" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-foreground truncate text-sm">
                            {user?.displayName}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            You
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Crown className="h-3 w-3 text-orange-500" />
                          <span className="text-xs text-muted-foreground">Session Host</span>
                          <span className="text-xs text-muted-foreground">• All permissions</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  onlineUsers
                    .filter(u => u.userId === session.owner.id)
                    .map((participant) => (
                      <div key={participant.userId} className="p-3 bg-orange-50/50 dark:bg-orange-950/10 border border-orange-200/50 dark:border-orange-900/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                              style={{ backgroundColor: getUserColor(participant.userId) }}
                            >
                              {participant.displayName?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border border-card rounded-full" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-foreground truncate text-sm block mb-1">
                              {participant.displayName}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Crown className="h-3 w-3 text-orange-500" />
                              <span className="text-xs text-muted-foreground">Session Host</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
            
            <Separator />
            
            {/* Collaborators Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3 text-green-500" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Collaborators
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {onlineUsers.filter(u => u.userId !== session.owner.id).length}
                </Badge>
              </div>
              
              <div className="space-y-2">
                {/* Current user if not host */}
                {session.owner.id !== user?.id && (
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                          style={{ backgroundColor: getUserColor(user.id) }}
                        >
                          {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border border-card rounded-full" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-foreground truncate text-sm">
                            {user?.displayName}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            You
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">Online now</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Other collaborators */}
                {onlineUsers
                  .filter(u => u.userId !== user?.id && u.userId !== session.owner.id)
                  .map((participant) => (
                    <div key={participant.userId} className="group p-3 bg-card hover:bg-muted/30 rounded-lg transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                            style={{ backgroundColor: getUserColor(participant.userId) }}
                          >
                            {participant.displayName?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border border-card rounded-full" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-foreground truncate text-sm block mb-1">
                            {participant.displayName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatLastSeen(participant.lastSeen)}
                          </span>
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
                      </div>
                    </div>
                  ))}
              </div>
              
              {/* Empty State */}
              {participantCount === 1 && (
                <div className="p-4 text-center">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    You're the only one here!
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isHost 
                      ? 'Invite others to join your collaboration session' 
                      : 'Waiting for others to join...'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
        
        {/* Footer */}
        <div className="flex-shrink-0 border-t border-border">
          {isHost && inviteUsers && (
            <div className="p-3">
              <Button 
                onClick={inviteUsers}
                className="w-full h-8 text-xs"
                size="sm"
              >
                <UserPlus className="h-3 w-3 mr-2" />
                Invite Collaborators
              </Button>
            </div>
          )}
          
          {/* Session Info */}
          <div className="px-3 py-2 bg-muted/30 border-t border-border">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1 text-muted-foreground">
                {session.type === 'PUBLIC' ? (
                  <>
                    <Globe className="h-3 w-3" />
                    <span>Public session</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-3 w-3" />
                    <span>Private session</span>
                  </>
                )}
              </div>
              {participantCount > 1 && (
                <div className="flex items-center space-x-1">
                  <Activity className="h-3 w-3 text-green-500" />
                  <span className="text-green-500 font-medium">Active collaboration</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
