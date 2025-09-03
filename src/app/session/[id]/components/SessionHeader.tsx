// 'use client'

// import { 
//   Crown, 
//   Save, 
//   Download, 
//   StopCircle, 
//   UserPlus, 
//   Loader2, 
//   AlertCircle, 
//   WifiOff, 
//   RefreshCw, 
//   CheckCircle, 
//   Users,
//   Globe,
//   Lock,
//   Menu,
//   Activity,
//   Settings,
//   LogOut,
//   Zap,
//   Copy,
//   Share,
//   HardDrive,
//   FileDown
// } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { Separator } from '@/components/ui/separator'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
// import { 
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
//   DropdownMenuLabel,
//   DropdownMenuGroup,
//   DropdownMenuShortcut
// } from '@/components/ui/dropdown-menu'
// import { 
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from '@/components/ui/sheet'
// import { cn } from '@/lib/utils'
// import { useState, useEffect } from 'react'
// import { toast } from 'sonner'

// interface SessionHeaderProps {
//   session: any
//   isHost: boolean
//   connected: boolean
//   syncStatus: string
//   participantCount: number
//   copySessionLink: () => void
//   saveAllFiles: () => void
//   exportSession: () => void
//   showInviteModal: () => void
//   showEndSessionModal: () => void
//   endSessionLoading: boolean
//   currentUser?: any
//   onOpenSettings?: () => void
//   onLogout?: () => void
// }

// export default function SessionHeader({
//   session,
//   isHost,
//   connected,
//   syncStatus,
//   participantCount,
//   copySessionLink,
//   saveAllFiles,
//   exportSession,
//   showInviteModal,
//   showEndSessionModal,
//   endSessionLoading,
//   currentUser,
//   onOpenSettings,
//   onLogout
// }: SessionHeaderProps) {
//   const [isMobile, setIsMobile] = useState(false)

//   // Enhanced responsive detection with debouncing
//   useEffect(() => {
//     let timeoutId: NodeJS.Timeout
    
//     const checkMobile = () => {
//       clearTimeout(timeoutId)
//       timeoutId = setTimeout(() => {
//         setIsMobile(window.innerWidth < 768)
//       }, 100)
//     }
    
//     checkMobile()
//     window.addEventListener('resize', checkMobile)
//     return () => {
//       window.removeEventListener('resize', checkMobile)
//       clearTimeout(timeoutId)
//     }
//   }, [])

//   // Enhanced action handlers with better feedback
//   const handleCopyLink = async () => {
//     try {
//       copySessionLink()
//       toast.success('Session link copied to clipboard', {
//         duration: 2000,
//         position: 'bottom-right'
//       })
//     } catch (error) {
//       toast.error('Failed to copy link')
//     }
//   }

//   const handleSaveAll = async () => {
//     try {
//       const savePromise = saveAllFiles()
//       toast.promise(savePromise, {
//         loading: 'Saving all files...',
//         success: 'All files saved successfully',
//         error: 'Failed to save files'
//       })
//     } catch (error) {
//       toast.error('Save operation failed')
//     }
//   }

//   const handleExport = async () => {
//     try {
//       const exportPromise = exportSession()
//       toast.promise(exportPromise, {
//         loading: 'Preparing export...',
//         success: 'Session exported successfully',
//         error: 'Export failed'
//       })
//     } catch (error) {
//       toast.error('Export operation failed')
//     }
//   }

//   // Enhanced sync status with more detailed states
//   const getSyncStatus = () => {
//     const baseClasses = "transition-all duration-200"
    
//     switch (syncStatus) {
//       case 'synced':
//         return { 
//           icon: CheckCircle, 
//           color: 'text-chart-2', 
//           bgColor: 'bg-chart-2/10 hover:bg-chart-2/15', 
//           borderColor: 'border-chart-2/20',
//           label: 'Synced',
//           description: 'All changes saved successfully',
//           pulse: false
//         }
//       case 'syncing':
//         return { 
//           icon: RefreshCw, 
//           color: 'text-chart-1', 
//           bgColor: 'bg-chart-1/10 hover:bg-chart-1/15', 
//           borderColor: 'border-chart-1/20',
//           label: 'Syncing',
//           description: 'Saving changes to cloud...',
//           pulse: true,
//           animate: true 
//         }
//       case 'offline':
//         return { 
//           icon: WifiOff, 
//           color: 'text-chart-5', 
//           bgColor: 'bg-chart-5/10 hover:bg-chart-5/15', 
//           borderColor: 'border-chart-5/20',
//           label: 'Offline',
//           description: 'Connection lost - working offline',
//           pulse: true
//         }
//       case 'error':
//         return { 
//           icon: AlertCircle, 
//           color: 'text-destructive', 
//           bgColor: 'bg-destructive/10 hover:bg-destructive/15', 
//           borderColor: 'border-destructive/20',
//           label: 'Error',
//           description: 'Sync failed - check connection',
//           pulse: true
//         }
//       default:
//         return { 
//           icon: AlertCircle, 
//           color: 'text-muted-foreground', 
//           bgColor: 'bg-muted/10', 
//           borderColor: 'border-muted/20',
//           label: 'Unknown',
//           description: 'Connection status unknown',
//           pulse: false
//         }
//     }
//   }

//   const syncStatusConfig = getSyncStatus()

//   // Enhanced status indicator component
//   const StatusIndicator = ({ className }: { className?: string }) => {
//     const { icon: StatusIcon, color, pulse, animate } = syncStatusConfig
    
//     return (
//       <div className={cn("flex items-center space-x-2", className)}>
//         <div className={cn(
//           "w-2 h-2 rounded-full transition-all duration-300",
//           session.isActive 
//             ? "bg-chart-2 shadow-sm shadow-chart-2/30" + (pulse ? " animate-pulse" : "") 
//             : "bg-muted-foreground"
//         )} />
//         <StatusIcon className={cn(
//           "h-3 w-3 transition-all duration-200", 
//           color,
//           animate && "animate-spin"
//         )} />
//       </div>
//     )
//   }

//   // Mobile Layout with improved structure
//   if (isMobile) {
//     return (
//       <header className="border-b border-sidebar-border bg-sidebar/95 backdrop-blur-sm supports-[backdrop-filter]:bg-sidebar/80">
//         <div className="px-4 py-3">
//           <div className="flex items-center justify-between">
//             {/* Mobile Left Section - Enhanced */}
//             <div className="flex items-center space-x-3 min-w-0 flex-1">
//               <div className="min-w-0 flex-1">
//                 {/* Title Row */}
//                 <div className="flex items-center space-x-2 mb-1">
//                   <h1 className="text-lg font-semibold text-sidebar-foreground truncate tracking-tight">
//                     {session.title}
//                   </h1>
//                   <StatusIndicator />
//                   {isHost && (
//                     <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-sidebar-primary/10 text-sidebar-primary border-sidebar-primary/20">
//                       <Crown className="h-2.5 w-2.5 mr-1" />
//                       Host
//                     </Badge>
//                   )}
//                 </div>
                
//                 {/* Enhanced Stats Row */}
//                 <div className="flex items-center space-x-3 text-xs text-sidebar-foreground/70">
//                   <div className="flex items-center space-x-1.5">
//                     <Users className="h-3 w-3" />
//                     <span className="font-medium">{participantCount}</span>
//                     <span className="text-sidebar-foreground/50">online</span>
//                   </div>
                  
//                   <div className="w-1 h-1 rounded-full bg-sidebar-foreground/30" />
                  
//                   <Badge variant="outline" className="text-xs px-2 py-0.5 bg-transparent border-sidebar-border/50">
//                     {session.type === 'PUBLIC' ? (
//                       <>
//                         <Globe className="h-2.5 w-2.5 mr-1" />
//                         Public
//                       </>
//                     ) : (
//                       <>
//                         <Lock className="h-2.5 w-2.5 mr-1" />
//                         Private
//                       </>
//                     )}
//                   </Badge>
                  
//                   <div className="w-1 h-1 rounded-full bg-sidebar-foreground/30" />
                  
//                   <span className={cn("font-medium", syncStatusConfig.color)}>
//                     {syncStatusConfig.label}
//                   </span>
//                 </div>
//               </div>
//             </div>
            
//             {/* Enhanced Mobile Menu */}
//             <Sheet>
//               <SheetTrigger asChild>
//                 <Button variant="outline" size="sm" className="h-9 w-9 p-0 border-sidebar-border/50 hover:bg-sidebar-accent/50">
//                   <Menu className="h-4 w-4" />
//                   <span className="sr-only">Open session menu</span>
//                 </Button>
//               </SheetTrigger>
//               <SheetContent side="right" className="w-80 bg-sidebar border-sidebar-border">
//                 <SheetHeader>
//                   <SheetTitle className="flex items-center space-x-2 text-sidebar-foreground">
//                     <Activity className="h-5 w-5 text-sidebar-primary" />
//                     <span>Session Controls</span>
//                   </SheetTitle>
//                   <SheetDescription className="text-sidebar-foreground/70">
//                     Manage your collaboration session and export options
//                   </SheetDescription>
//                 </SheetHeader>
                
//                 <div className="space-y-6 mt-6">
//                   {/* Enhanced Session Status */}
//                   <div className="space-y-3">
//                     <h4 className="text-sm font-medium text-sidebar-foreground flex items-center space-x-2">
//                       <div className={cn(
//                         "w-2 h-2 rounded-full",
//                         session.isActive ? "bg-chart-2 animate-pulse" : "bg-muted-foreground"
//                       )} />
//                       <span>Connection Status</span>
//                     </h4>
//                     <div className={cn(
//                       "rounded-lg border p-4 transition-all duration-200",
//                       syncStatusConfig.borderColor,
//                       syncStatusConfig.bgColor
//                     )}>
//                       <div className="flex items-start space-x-3">
//                         <syncStatusConfig.icon className={cn(
//                           "h-5 w-5 mt-0.5 flex-shrink-0", 
//                           syncStatusConfig.color,
//                           syncStatusConfig.animate && "animate-spin"
//                         )} />
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm font-medium text-sidebar-foreground">
//                             {syncStatusConfig.label}
//                           </p>
//                           <p className="text-xs text-sidebar-foreground/70 mt-1">
//                             {syncStatusConfig.description}
//                           </p>
//                           {participantCount > 1 && (
//                             <p className="text-xs text-sidebar-foreground/50 mt-2">
//                               {participantCount} participants active
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Enhanced Quick Actions */}
//                   <div className="space-y-3">
//                     <h4 className="text-sm font-medium text-sidebar-foreground">Quick Actions</h4>
//                     <div className="grid grid-cols-1 gap-2">
//                       <Button variant="outline" size="sm" onClick={handleCopyLink} className="justify-start">
//                         <Share className="h-4 w-4 mr-2" />
//                         Share Session Link
//                       </Button>
                      
//                       <Button variant="outline" size="sm" onClick={handleSaveAll} className="justify-start">
//                         <HardDrive className="h-4 w-4 mr-2" />
//                         Save All Files
//                       </Button>
                      
//                       <Button variant="outline" size="sm" onClick={handleExport} className="justify-start">
//                         <FileDown className="h-4 w-4 mr-2" />
//                         Export Project
//                       </Button>
//                     </div>
//                   </div>
                  
//                   {/* Enhanced Host Actions */}
//                   {isHost && (
//                     <div className="space-y-3">
//                       <h4 className="text-sm font-medium text-sidebar-foreground flex items-center space-x-2">
//                         <Crown className="h-4 w-4 text-sidebar-primary" />
//                         <span>Host Controls</span>
//                       </h4>
//                       <div className="space-y-2">
//                         <Button 
//                           onClick={showInviteModal}
//                           className="w-full justify-start"
//                           size="sm"
//                         >
//                           <UserPlus className="h-4 w-4 mr-2" />
//                           Invite Collaborators
//                         </Button>
                        
//                         <Button 
//                           variant="destructive"
//                           onClick={showEndSessionModal}
//                           disabled={endSessionLoading}
//                           className="w-full justify-start"
//                           size="sm"
//                         >
//                           {endSessionLoading ? (
//                             <>
//                               <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                               Ending Session...
//                             </>
//                           ) : (
//                             <>
//                               <StopCircle className="h-4 w-4 mr-2" />
//                               End Session
//                             </>
//                           )}
//                         </Button>
//                       </div>
//                     </div>
//                   )}
                  
//                   {/* Enhanced User Section */}
//                   {currentUser && (
//                     <div className="space-y-3 pt-2 border-t border-sidebar-border">
//                       <div className="bg-sidebar-accent/30 rounded-lg p-4">
//                         <div className="flex items-center space-x-3">
//                           <Avatar className="h-10 w-10 ring-2 ring-sidebar-border">
//                             <AvatarImage src={currentUser.avatar} />
//                             <AvatarFallback className="text-sm bg-sidebar-primary text-sidebar-primary-foreground">
//                               {currentUser.displayName?.charAt(0).toUpperCase()}
//                             </AvatarFallback>
//                           </Avatar>
//                           <div className="flex-1 min-w-0">
//                             <p className="text-sm font-medium text-sidebar-foreground truncate">
//                               {currentUser.displayName}
//                             </p>
//                             <p className="text-xs text-sidebar-foreground/60 truncate">
//                               {currentUser.email}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
                      
//                       <div className="space-y-1">
//                         {onOpenSettings && (
//                           <Button variant="ghost" onClick={onOpenSettings} className="w-full justify-start" size="sm">
//                             <Settings className="h-4 w-4 mr-2" />
//                             Account Settings
//                           </Button>
//                         )}
                        
//                         {onLogout && (
//                           <Button variant="ghost" onClick={onLogout} className="w-full justify-start text-destructive hover:text-destructive" size="sm">
//                             <LogOut className="h-4 w-4 mr-2" />
//                             Sign Out
//                           </Button>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </SheetContent>
//             </Sheet>
//           </div>
//         </div>
//       </header>
//     )
//   }

//   // Enhanced Desktop Layout
//   return (
//     <header className="border-b border-sidebar-border bg-sidebar/95 backdrop-blur-sm supports-[backdrop-filter]:bg-sidebar/80">
//       <div className="px-6 py-4">
//         <div className="flex items-center justify-between">
//           {/* Enhanced Left Section */}
//           <div className="flex items-center space-x-6 min-w-0 flex-1">
//             <div className="min-w-0 flex-1">
//               <div className="flex items-center space-x-4">
//                 <div className="flex items-center space-x-3">
//                   <h1 className="text-xl font-semibold text-sidebar-foreground truncate tracking-tight">
//                     {session.title}
//                   </h1>
//                   <StatusIndicator />
//                 </div>
                
//                 {/* Enhanced Status Badges */}
//                 <div className="flex items-center space-x-3">
//                   {/* Live Status with Animation */}
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Badge variant={session.isActive ? "default" : "secondary"} className="px-3 py-1">
//                         <Zap className="h-3 w-3 mr-1.5" />
//                         {session.isActive ? "Live" : "Ended"}
//                       </Badge>
//                     </TooltipTrigger>
//                     <TooltipContent>
//                       Session is currently {session.isActive ? 'active and syncing' : 'ended'}
//                     </TooltipContent>
//                   </Tooltip>
                  
//                   <Separator orientation="vertical" className="h-5 bg-sidebar-border/50" />
                  
//                   {/* Enhanced Participants */}
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Badge variant="outline" className="px-3 py-1 bg-sidebar-accent/20 border-sidebar-border/50">
//                         <Users className="h-3 w-3 mr-1.5" />
//                         <span className="font-medium">{participantCount}</span>
//                       </Badge>
//                     </TooltipTrigger>
//                     <TooltipContent>
//                       {participantCount} participant{participantCount !== 1 ? 's' : ''} currently online
//                     </TooltipContent>
//                   </Tooltip>
                  
//                   <Separator orientation="vertical" className="h-5 bg-sidebar-border/50" />
                  
//                   {/* Enhanced Sync Status */}
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Badge variant="outline" className={cn(
//                         "px-3 py-1 transition-all duration-200",
//                         syncStatusConfig.color,
//                         syncStatusConfig.bgColor,
//                         syncStatusConfig.borderColor
//                       )}>
//                         <syncStatusConfig.icon className={cn(
//                           "h-3 w-3 mr-1.5",
//                           syncStatusConfig.animate && "animate-spin"
//                         )} />
//                         <span className="font-medium">{syncStatusConfig.label}</span>
//                       </Badge>
//                     </TooltipTrigger>
//                     <TooltipContent>
//                       <div className="text-center">
//                         <p className="font-medium">{syncStatusConfig.description}</p>
//                         {syncStatus === 'synced' && (
//                           <p className="text-xs text-muted-foreground mt-1">Last synced just now</p>
//                         )}
//                       </div>
//                     </TooltipContent>
//                   </Tooltip>
                  
//                   <Separator orientation="vertical" className="h-5 bg-sidebar-border/50" />
                  
//                   {/* Host Badge */}
//                   {isHost && (
//                     <Badge variant="secondary" className="px-3 py-1 bg-sidebar-primary/10 text-sidebar-primary border-sidebar-primary/20">
//                       <Crown className="h-3 w-3 mr-1.5" />
//                       Host
//                     </Badge>
//                   )}
                  
//                   {/* Session Type */}
//                   <Badge variant="outline" className="px-3 py-1 bg-sidebar-accent/20 border-sidebar-border/50">
//                     {session.type === 'PUBLIC' ? (
//                       <>
//                         <Globe className="h-3 w-3 mr-1.5" />
//                         Public
//                       </>
//                     ) : (
//                       <>
//                         <Lock className="h-3 w-3 mr-1.5" />
//                         Private
//                       </>
//                     )}
//                   </Badge>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Enhanced Right Section */}
//           <div className="flex items-center space-x-3">
//             {/* Enhanced Quick Actions */}
//             <div className="flex items-center space-x-2">
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button size="sm" variant="outline" onClick={handleCopyLink} className="border-sidebar-border/50 hover:bg-sidebar-accent/50">
//                     <Share className="h-3.5 w-3.5 mr-2" />
//                     Share
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   <div className="text-center">
//                     <p>Copy session link</p>
//                     <p className="text-xs text-muted-foreground">Ctrl+Shift+C</p>
//                   </div>
//                 </TooltipContent>
//               </Tooltip>
              
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button size="sm" variant="outline" onClick={handleSaveAll} className="border-sidebar-border/50 hover:bg-sidebar-accent/50">
//                     <HardDrive className="h-3.5 w-3.5 mr-2" />
//                     Save
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   <div className="text-center">
//                     <p>Save all files</p>
//                     <p className="text-xs text-muted-foreground">Ctrl+S</p>
//                   </div>
//                 </TooltipContent>
//               </Tooltip>
              
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button size="sm" variant="outline" onClick={handleExport} className="border-sidebar-border/50 hover:bg-sidebar-accent/50">
//                     <FileDown className="h-3.5 w-3.5 mr-2" />
//                     Export
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   <div className="text-center">
//                     <p>Export project files</p>
//                     <p className="text-xs text-muted-foreground">Download as ZIP</p>
//                   </div>
//                 </TooltipContent>
//               </Tooltip>
//             </div>
            
//             <Separator orientation="vertical" className="h-6 bg-sidebar-border/50" />
            
//             {/* Enhanced Primary Actions */}
//             {isHost && (
//               <div className="flex items-center space-x-2">
//                 <Button size="sm" onClick={showInviteModal} className="bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground">
//                   <UserPlus className="h-3.5 w-3.5 mr-2" />
//                   Invite
//                 </Button>
                
//                 <Button 
//                   size="sm"
//                   variant="destructive"
//                   onClick={showEndSessionModal}
//                   disabled={endSessionLoading}
//                   className="hover:bg-destructive/90"
//                 >
//                   {endSessionLoading ? (
//                     <>
//                       <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
//                       Ending...
//                     </>
//                   ) : (
//                     <>
//                       <StopCircle className="h-3.5 w-3.5 mr-2" />
//                       End
//                     </>
//                   )}
//                 </Button>
//               </div>
//             )}
            
//             {/* Enhanced User Menu */}
//             {currentUser && (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline" size="sm" className="p-0 h-9 w-9 border-sidebar-border/50 hover:bg-sidebar-accent/50">
//                     <Avatar className="h-7 w-7 ring-2 ring-sidebar-border/30">
//                       <AvatarImage src={currentUser.avatar} />
//                       <AvatarFallback className="text-xs bg-sidebar-primary text-sidebar-primary-foreground">
//                         {currentUser.displayName?.charAt(0).toUpperCase()}
//                       </AvatarFallback>
//                     </Avatar>
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-64 bg-sidebar border-sidebar-border">
//                   <DropdownMenuLabel>
//                     <div className="flex items-center space-x-3 p-2">
//                       <Avatar className="h-10 w-10 ring-2 ring-sidebar-border/50">
//                         <AvatarImage src={currentUser.avatar} />
//                         <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
//                           {currentUser.displayName?.charAt(0).toUpperCase()}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div className="flex-1 min-w-0">
//                         <p className="font-medium text-sidebar-foreground truncate">
//                           {currentUser.displayName}
//                         </p>
//                         <p className="text-xs text-sidebar-foreground/60 truncate">
//                           {currentUser.email}
//                         </p>
//                       </div>
//                     </div>
//                   </DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuGroup>
//                     {onOpenSettings && (
//                       <DropdownMenuItem onClick={onOpenSettings} className="text-sidebar-foreground hover:bg-sidebar-accent/50">
//                         <Settings className="h-4 w-4 mr-2" />
//                         Account Settings
//                         <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
//                       </DropdownMenuItem>
//                     )}
//                   </DropdownMenuGroup>
//                   {onLogout && (
//                     <>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive hover:bg-destructive/10">
//                         <LogOut className="h-4 w-4 mr-2" />
//                         Sign Out
//                         <DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
//                       </DropdownMenuItem>
//                     </>
//                   )}
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }


'use client'

import { 
  Crown, 
  Save, 
  Download, 
  StopCircle, 
  UserPlus, 
  Loader2, 
  AlertCircle, 
  WifiOff, 
  RefreshCw, 
  CheckCircle, 
  Users,
  Globe,
  Lock,
  Menu,
  Activity,
  Settings,
  LogOut,
  Zap,
  Copy,
  Share,
  HardDrive,
  FileDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuShortcut
} from '@/components/ui/dropdown-menu'
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface SessionHeaderProps {
  session: any
  isHost: boolean
  connected: boolean
  syncStatus: string
  participantCount: number
  copySessionLink: () => void
  saveAllFiles: () => void
  exportSession: () => void
  showInviteModal: () => void
  showEndSessionModal: () => void
  endSessionLoading: boolean
  currentUser?: any
  onOpenSettings?: () => void
  onLogout?: () => void
  onLeaveSession?: () => void // NEW: Leave session handler
}

export default function SessionHeader({
  session,
  isHost,
  connected,
  syncStatus,
  participantCount,
  copySessionLink,
  saveAllFiles,
  exportSession,
  showInviteModal,
  showEndSessionModal,
  endSessionLoading,
  currentUser,
  onOpenSettings,
  onLogout,
  onLeaveSession // NEW: Leave session handler
}: SessionHeaderProps) {
  const [isMobile, setIsMobile] = useState(false)

  // Enhanced responsive detection with debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    const checkMobile = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 768)
      }, 100)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => {
      window.removeEventListener('resize', checkMobile)
      clearTimeout(timeoutId)
    }
  }, [])

  // Enhanced action handlers with better feedback
  const handleCopyLink = async () => {
    try {
      copySessionLink()
      toast.success('Session link copied to clipboard', {
        duration: 2000,
        position: 'bottom-right'
      })
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const handleSaveAll = async () => {
    try {
      const savePromise = saveAllFiles()
      toast.promise(savePromise, {
        loading: 'Saving all files...',
        success: 'All files saved successfully',
        error: 'Failed to save files'
      })
    } catch (error) {
      toast.error('Save operation failed')
    }
  }

  const handleExport = async () => {
    try {
      const exportPromise = exportSession()
      toast.promise(exportPromise, {
        loading: 'Preparing export...',
        success: 'Session exported successfully',
        error: 'Export failed'
      })
    } catch (error) {
      toast.error('Export operation failed')
    }
  }

  // NEW: Leave Session Button Component
  const LeaveSessionButton = () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-muted-foreground hover:text-destructive hover:border-destructive border-border"
        >
          <LogOut className="h-3.5 w-3.5 mr-2" />
          Leave
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-card-foreground">Leave Session?</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Are you sure you want to leave this collaborative session? Your changes will be saved automatically.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onLeaveSession}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Leave Session
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  // Enhanced sync status with more detailed states
  const getSyncStatus = () => {
    const baseClasses = "transition-all duration-200"
    
    switch (syncStatus) {
      case 'synced':
        return { 
          icon: CheckCircle, 
          color: 'text-chart-2', 
          bgColor: 'bg-chart-2/10 hover:bg-chart-2/15', 
          borderColor: 'border-chart-2/20',
          label: 'Synced',
          description: 'All changes saved successfully',
          pulse: false
        }
      case 'syncing':
        return { 
          icon: RefreshCw, 
          color: 'text-chart-1', 
          bgColor: 'bg-chart-1/10 hover:bg-chart-1/15', 
          borderColor: 'border-chart-1/20',
          label: 'Syncing',
          description: 'Saving changes to cloud...',
          pulse: true,
          animate: true 
        }
      case 'offline':
        return { 
          icon: WifiOff, 
          color: 'text-chart-5', 
          bgColor: 'bg-chart-5/10 hover:bg-chart-5/15', 
          borderColor: 'border-chart-5/20',
          label: 'Offline',
          description: 'Connection lost - working offline',
          pulse: true
        }
      case 'error':
        return { 
          icon: AlertCircle, 
          color: 'text-destructive', 
          bgColor: 'bg-destructive/10 hover:bg-destructive/15', 
          borderColor: 'border-destructive/20',
          label: 'Error',
          description: 'Sync failed - check connection',
          pulse: true
        }
      default:
        return { 
          icon: AlertCircle, 
          color: 'text-muted-foreground', 
          bgColor: 'bg-muted/10', 
          borderColor: 'border-muted/20',
          label: 'Unknown',
          description: 'Connection status unknown',
          pulse: false
        }
    }
  }

  const syncStatusConfig = getSyncStatus()

  // Enhanced status indicator component
  const StatusIndicator = ({ className }: { className?: string }) => {
    const { icon: StatusIcon, color, pulse, animate } = syncStatusConfig
    
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <div className={cn(
          "w-2 h-2 rounded-full transition-all duration-300",
          session.isActive 
            ? "bg-chart-2 shadow-sm shadow-chart-2/30" + (pulse ? " animate-pulse" : "") 
            : "bg-muted-foreground"
        )} />
        <StatusIcon className={cn(
          "h-3 w-3 transition-all duration-200", 
          color,
          animate && "animate-spin"
        )} />
      </div>
    )
  }

  // Mobile Layout with improved structure
  if (isMobile) {
    return (
      <header className="border-b border-sidebar-border bg-sidebar/95 backdrop-blur-sm supports-[backdrop-filter]:bg-sidebar/80">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Mobile Left Section - Enhanced */}
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="min-w-0 flex-1">
                {/* Title Row */}
                <div className="flex items-center space-x-2 mb-1">
                  <h1 className="text-lg font-semibold text-sidebar-foreground truncate tracking-tight">
                    {session.title}
                  </h1>
                  <StatusIndicator />
                  {isHost && (
                    <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-sidebar-primary/10 text-sidebar-primary border-sidebar-primary/20">
                      <Crown className="h-2.5 w-2.5 mr-1" />
                      Host
                    </Badge>
                  )}
                </div>
                
                {/* Enhanced Stats Row */}
                <div className="flex items-center space-x-3 text-xs text-sidebar-foreground/70">
                  <div className="flex items-center space-x-1.5">
                    <Users className="h-3 w-3" />
                    <span className="font-medium">{participantCount}</span>
                    <span className="text-sidebar-foreground/50">online</span>
                  </div>
                  
                  <div className="w-1 h-1 rounded-full bg-sidebar-foreground/30" />
                  
                  <Badge variant="outline" className="text-xs px-2 py-0.5 bg-transparent border-sidebar-border/50">
                    {session.type === 'PUBLIC' ? (
                      <>
                        <Globe className="h-2.5 w-2.5 mr-1" />
                        Public
                      </>
                    ) : (
                      <>
                        <Lock className="h-2.5 w-2.5 mr-1" />
                        Private
                      </>
                    )}
                  </Badge>
                  
                  <div className="w-1 h-1 rounded-full bg-sidebar-foreground/30" />
                  
                  <span className={cn("font-medium", syncStatusConfig.color)}>
                    {syncStatusConfig.label}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 w-9 p-0 border-sidebar-border/50 hover:bg-sidebar-accent/50">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Open session menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-sidebar border-sidebar-border">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2 text-sidebar-foreground">
                    <Activity className="h-5 w-5 text-sidebar-primary" />
                    <span>Session Controls</span>
                  </SheetTitle>
                  <SheetDescription className="text-sidebar-foreground/70">
                    Manage your collaboration session and export options
                  </SheetDescription>
                </SheetHeader>
                
                <div className="space-y-6 mt-6">
                  {/* Enhanced Session Status */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-sidebar-foreground flex items-center space-x-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        session.isActive ? "bg-chart-2 animate-pulse" : "bg-muted-foreground"
                      )} />
                      <span>Connection Status</span>
                    </h4>
                    <div className={cn(
                      "rounded-lg border p-4 transition-all duration-200",
                      syncStatusConfig.borderColor,
                      syncStatusConfig.bgColor
                    )}>
                      <div className="flex items-start space-x-3">
                        <syncStatusConfig.icon className={cn(
                          "h-5 w-5 mt-0.5 flex-shrink-0", 
                          syncStatusConfig.color,
                          syncStatusConfig.animate && "animate-spin"
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-sidebar-foreground">
                            {syncStatusConfig.label}
                          </p>
                          <p className="text-xs text-sidebar-foreground/70 mt-1">
                            {syncStatusConfig.description}
                          </p>
                          {participantCount > 1 && (
                            <p className="text-xs text-sidebar-foreground/50 mt-2">
                              {participantCount} participants active
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Quick Actions */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-sidebar-foreground">Quick Actions</h4>
                    <div className="grid grid-cols-1 gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopyLink} className="justify-start">
                        <Share className="h-4 w-4 mr-2" />
                        Share Session Link
                      </Button>
                      
                      <Button variant="outline" size="sm" onClick={handleSaveAll} className="justify-start">
                        <HardDrive className="h-4 w-4 mr-2" />
                        Save All Files
                      </Button>
                      
                      <Button variant="outline" size="sm" onClick={handleExport} className="justify-start">
                        <FileDown className="h-4 w-4 mr-2" />
                        Export Project
                      </Button>

                      {/* NEW: Leave Session in Mobile Menu (for non-hosts) */}
                      {!isHost && onLeaveSession && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={onLeaveSession} 
                          className="justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Leave Session
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Enhanced Host Actions */}
                  {isHost && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-sidebar-foreground flex items-center space-x-2">
                        <Crown className="h-4 w-4 text-sidebar-primary" />
                        <span>Host Controls</span>
                      </h4>
                      <div className="space-y-2">
                        <Button 
                          onClick={showInviteModal}
                          className="w-full justify-start"
                          size="sm"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Invite Collaborators
                        </Button>
                        
                        <Button 
                          variant="destructive"
                          onClick={showEndSessionModal}
                          disabled={endSessionLoading}
                          className="w-full justify-start"
                          size="sm"
                        >
                          {endSessionLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Ending Session...
                            </>
                          ) : (
                            <>
                              <StopCircle className="h-4 w-4 mr-2" />
                              End Session
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Enhanced User Section */}
                  {currentUser && (
                    <div className="space-y-3 pt-2 border-t border-sidebar-border">
                      <div className="bg-sidebar-accent/30 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10 ring-2 ring-sidebar-border">
                            <AvatarImage src={currentUser.avatar} />
                            <AvatarFallback className="text-sm bg-sidebar-primary text-sidebar-primary-foreground">
                              {currentUser.displayName?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-sidebar-foreground truncate">
                              {currentUser.displayName}
                            </p>
                            <p className="text-xs text-sidebar-foreground/60 truncate">
                              {currentUser.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        {onOpenSettings && (
                          <Button variant="ghost" onClick={onOpenSettings} className="w-full justify-start" size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            Account Settings
                          </Button>
                        )}
                        
                        {onLogout && (
                          <Button variant="ghost" onClick={onLogout} className="w-full justify-start text-destructive hover:text-destructive" size="sm">
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    )
  }

  // Enhanced Desktop Layout
  return (
    <header className="border-b border-sidebar-border bg-sidebar/95 backdrop-blur-sm supports-[backdrop-filter]:bg-sidebar/80">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Left Section */}
          <div className="flex items-center space-x-6 min-w-0 flex-1">
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <h1 className="text-xl font-semibold text-sidebar-foreground truncate tracking-tight">
                    {session.title}
                  </h1>
                  <StatusIndicator />
                </div>
                
                {/* Enhanced Status Badges */}
                <div className="flex items-center space-x-3">
                  {/* Live Status with Animation */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant={session.isActive ? "default" : "secondary"} className="px-3 py-1">
                        <Zap className="h-3 w-3 mr-1.5" />
                        {session.isActive ? "Live" : "Ended"}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      Session is currently {session.isActive ? 'active and syncing' : 'ended'}
                    </TooltipContent>
                  </Tooltip>
                  
                  <Separator orientation="vertical" className="h-5 bg-sidebar-border/50" />
                  
                  {/* Enhanced Participants */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="px-3 py-1 bg-sidebar-accent/20 border-sidebar-border/50">
                        <Users className="h-3 w-3 mr-1.5" />
                        <span className="font-medium">{participantCount}</span>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      {participantCount} participant{participantCount !== 1 ? 's' : ''} currently online
                    </TooltipContent>
                  </Tooltip>
                  
                  <Separator orientation="vertical" className="h-5 bg-sidebar-border/50" />
                  
                  {/* Enhanced Sync Status */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className={cn(
                        "px-3 py-1 transition-all duration-200",
                        syncStatusConfig.color,
                        syncStatusConfig.bgColor,
                        syncStatusConfig.borderColor
                      )}>
                        <syncStatusConfig.icon className={cn(
                          "h-3 w-3 mr-1.5",
                          syncStatusConfig.animate && "animate-spin"
                        )} />
                        <span className="font-medium">{syncStatusConfig.label}</span>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-center">
                        <p className="font-medium">{syncStatusConfig.description}</p>
                        {syncStatus === 'synced' && (
                          <p className="text-xs text-muted-foreground mt-1">Last synced just now</p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Separator orientation="vertical" className="h-5 bg-sidebar-border/50" />
                  
                  {/* Host Badge */}
                  {isHost && (
                    <Badge variant="secondary" className="px-3 py-1 bg-sidebar-primary/10 text-sidebar-primary border-sidebar-primary/20">
                      <Crown className="h-3 w-3 mr-1.5" />
                      Host
                    </Badge>
                  )}
                  
                  {/* Session Type */}
                  <Badge variant="outline" className="px-3 py-1 bg-sidebar-accent/20 border-sidebar-border/50">
                    {session.type === 'PUBLIC' ? (
                      <>
                        <Globe className="h-3 w-3 mr-1.5" />
                        Public
                      </>
                    ) : (
                      <>
                        <Lock className="h-3 w-3 mr-1.5" />
                        Private
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Right Section */}
          <div className="flex items-center space-x-3">
            {/* Enhanced Quick Actions */}
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" onClick={handleCopyLink} className="border-sidebar-border/50 hover:bg-sidebar-accent/50">
                    <Share className="h-3.5 w-3.5 mr-2" />
                    Share
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <p>Copy session link</p>
                    <p className="text-xs text-muted-foreground">Ctrl+Shift+C</p>
                  </div>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" onClick={handleSaveAll} className="border-sidebar-border/50 hover:bg-sidebar-accent/50">
                    <HardDrive className="h-3.5 w-3.5 mr-2" />
                    Save
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <p>Save all files</p>
                    <p className="text-xs text-muted-foreground">Ctrl+S</p>
                  </div>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" onClick={handleExport} className="border-sidebar-border/50 hover:bg-sidebar-accent/50">
                    <FileDown className="h-3.5 w-3.5 mr-2" />
                    Export
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <p>Export project files</p>
                    <p className="text-xs text-muted-foreground">Download as ZIP</p>
                  </div>
                </TooltipContent>
              </Tooltip>

              {/* NEW: Leave Session Button for non-hosts on Desktop */}
              {!isHost && onLeaveSession && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <LeaveSessionButton />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-center">
                      <p>Leave this session</p>
                      <p className="text-xs text-muted-foreground">Your work will be saved</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            
            <Separator orientation="vertical" className="h-6 bg-sidebar-border/50" />
            
            {/* Enhanced Primary Actions */}
            {isHost && (
              <div className="flex items-center space-x-2">
                <Button size="sm" onClick={showInviteModal} className="bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground">
                  <UserPlus className="h-3.5 w-3.5 mr-2" />
                  Invite
                </Button>
                
                <Button 
                  size="sm"
                  variant="destructive"
                  onClick={showEndSessionModal}
                  disabled={endSessionLoading}
                  className="hover:bg-destructive/90"
                >
                  {endSessionLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                      Ending...
                    </>
                  ) : (
                    <>
                      <StopCircle className="h-3.5 w-3.5 mr-2" />
                      End
                    </>
                  )}
                </Button>
              </div>
            )}
            
            {/* Enhanced User Menu */}
            {currentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="p-0 h-9 w-9 border-sidebar-border/50 hover:bg-sidebar-accent/50">
                    <Avatar className="h-7 w-7 ring-2 ring-sidebar-border/30">
                      <AvatarImage src={currentUser.avatar} />
                      <AvatarFallback className="text-xs bg-sidebar-primary text-sidebar-primary-foreground">
                        {currentUser.displayName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-sidebar border-sidebar-border">
                  <DropdownMenuLabel>
                    <div className="flex items-center space-x-3 p-2">
                      <Avatar className="h-10 w-10 ring-2 ring-sidebar-border/50">
                        <AvatarImage src={currentUser.avatar} />
                        <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                          {currentUser.displayName?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sidebar-foreground truncate">
                          {currentUser.displayName}
                        </p>
                        <p className="text-xs text-sidebar-foreground/60 truncate">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {onOpenSettings && (
                      <DropdownMenuItem onClick={onOpenSettings} className="text-sidebar-foreground hover:bg-sidebar-accent/50">
                        <Settings className="h-4 w-4 mr-2" />
                        Account Settings
                        <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  {onLogout && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive hover:bg-destructive/10">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                        <DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
