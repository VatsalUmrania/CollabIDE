'use client'

import { 
  Crown, 
  Share2, 
  Save, 
  Download, 
  Eye, 
  EyeOff, 
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
  X,
  Wifi,
  Activity,
  Dot,
  Settings,
  LogOut,
  Zap,
  Copy 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
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
  isPreviewVisible: boolean
  togglePreview: () => void
  showInviteModal: () => void
  showEndSessionModal: () => void
  endSessionLoading: boolean
  currentUser?: any
  onOpenSettings?: () => void
  onLogout?: () => void
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
  isPreviewVisible,
  togglePreview,
  showInviteModal,
  showEndSessionModal,
  endSessionLoading,
  currentUser,
  onOpenSettings,
  onLogout
}: SessionHeaderProps) {
  const [isMobile, setIsMobile] = useState(false)

  // Responsive detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Enhanced action handlers with toasts
  const handleCopyLink = () => {
    copySessionLink()
    toast.success('Session link copied to clipboard')
  }

  const handleSaveAll = () => {
    saveAllFiles()
    toast.success('All files saved successfully')
  }

  const handleExport = () => {
    exportSession()
    toast.success('Session exported successfully')
  }

  // Get sync status configuration
  const getSyncStatus = () => {
    switch (syncStatus) {
      case 'synced':
        return { 
          icon: CheckCircle, 
          color: 'text-green-600 dark:text-green-400', 
          bgColor: 'bg-green-100 dark:bg-green-950/20', 
          borderColor: 'border-green-200 dark:border-green-900/20',
          label: 'Synced',
          description: 'All changes saved'
        }
      case 'syncing':
        return { 
          icon: RefreshCw, 
          color: 'text-blue-600 dark:text-blue-400', 
          bgColor: 'bg-blue-100 dark:bg-blue-950/20', 
          borderColor: 'border-blue-200 dark:border-blue-900/20',
          label: 'Syncing',
          description: 'Saving changes...',
          animate: true 
        }
      case 'offline':
        return { 
          icon: WifiOff, 
          color: 'text-orange-600 dark:text-orange-400', 
          bgColor: 'bg-orange-100 dark:bg-orange-950/20', 
          borderColor: 'border-orange-200 dark:border-orange-900/20',
          label: 'Offline',
          description: 'Connection lost'
        }
      default:
        return { 
          icon: AlertCircle, 
          color: 'text-red-600 dark:text-red-400', 
          bgColor: 'bg-red-100 dark:bg-red-950/20', 
          borderColor: 'border-red-200 dark:border-red-900/20',
          label: 'Error',
          description: 'Sync failed'
        }
    }
  }

  const syncStatusConfig = getSyncStatus()

  // Mobile Layout with Enhanced Sheet
  if (isMobile) {
    return (
      <Card className="border-0 bg-card/80 backdrop-blur shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            {/* Mobile Left Section */}
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-xl font-bold text-foreground truncate">
                    {session.title}
                  </CardTitle>
                  
                  {/* Live Status Indicator */}
                  <div className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0",
                    session.isActive ? "bg-green-500 animate-pulse shadow-lg shadow-green-500/50" : "bg-gray-400"
                  )} />
                  
                  {/* Host Badge */}
                  {isHost && (
                    <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400 border-orange-500/20 text-xs">
                      <Crown className="h-2.5 w-2.5 mr-1" />
                      Host
                    </Badge>
                  )}
                </div>
                
                {/* Mobile Stats Row */}
                <CardDescription className="flex items-center space-x-3 mt-2">
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{participantCount} online</span>
                  </div>
                  
                  <Separator orientation="vertical" className="h-3" />
                  
                  <div className="flex items-center space-x-1">
                    <syncStatusConfig.icon className={cn(
                      "h-3 w-3", 
                      syncStatusConfig.color,
                      syncStatusConfig.animate && "animate-spin"
                    )} />
                    <span>{syncStatusConfig.label}</span>
                  </div>
                  
                  <Separator orientation="vertical" className="h-3" />
                  
                  <Badge variant="outline" className="text-xs">
                    {session.type === 'PUBLIC' ? (
                      <>
                        <Globe className="h-2 w-2 mr-1" />
                        Public
                      </>
                    ) : (
                      <>
                        <Lock className="h-2 w-2 mr-1" />
                        Private
                      </>
                    )}
                  </Badge>
                </CardDescription>
              </div>
            </div>
            
            {/* Mobile Menu Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 border-0 bg-card/95 backdrop-blur">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2 text-xl">
                    <Activity className="h-6 w-6 text-primary" />
                    <span>Session Controls</span>
                  </SheetTitle>
                  <SheetDescription>
                    Manage your collaboration session and settings
                  </SheetDescription>
                </SheetHeader>
                
                <div className="space-y-6 mt-6">
                  {/* Session Status */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-foreground">Status</h4>
                    <Card className={cn("border-2", syncStatusConfig.borderColor, syncStatusConfig.bgColor)}>
                      <CardContent className="flex items-center space-x-3 p-4">
                        <syncStatusConfig.icon className={cn(
                          "h-5 w-5", 
                          syncStatusConfig.color,
                          syncStatusConfig.animate && "animate-spin"
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground">
                            {syncStatusConfig.label}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {syncStatusConfig.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-foreground">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" onClick={togglePreview}>
                        {isPreviewVisible ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                        Preview
                      </Button>
                      
                      <Button variant="outline" onClick={handleCopyLink}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      
                      <Button variant="outline" onClick={handleSaveAll}>
                        <Save className="h-4 w-4 mr-2" />
                        Save All
                      </Button>
                      
                      <Button variant="outline" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                  
                  {/* Host Actions */}
                  {isHost && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-foreground">Host Actions</h4>
                      <div className="space-y-3">
                        <Button 
                          onClick={showInviteModal}
                          className="w-full bg-primary hover:bg-primary/90 shadow-md"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Invite Collaborators
                        </Button>
                        
                        <Button 
                          variant="destructive"
                          onClick={showEndSessionModal}
                          disabled={endSessionLoading}
                          className="w-full"
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
                  
                  {/* User Actions */}
                  {currentUser && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-foreground">Account</h4>
                      <Card className="border-0 bg-muted/30">
                        <CardContent className="flex items-center space-x-3 p-4">
                          <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                            <AvatarImage src={currentUser.avatar} />
                            <AvatarFallback>
                              {currentUser.displayName?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground truncate">
                              {currentUser.displayName}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {currentUser.email}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <div className="space-y-2">
                        {onOpenSettings && (
                          <Button variant="ghost" onClick={onOpenSettings} className="w-full justify-start">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                          </Button>
                        )}
                        
                        {onLogout && (
                          <Button variant="ghost" onClick={onLogout} className="w-full justify-start text-destructive hover:text-destructive">
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
        </CardHeader>
      </Card>
    )
  }

  // Desktop Layout - Enhanced Professional Design
  return (
    <Card className="border-0 bg-card/80 backdrop-blur shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Session Info */}
          <div className="flex items-center space-x-6 min-w-0 flex-1">
            {/* Session Title & Metadata */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-foreground truncate">
                  {session.title}
                </h1>
                
                {/* Status Indicators */}
                <div className="flex items-center space-x-3">
                  {/* Live Status */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2">
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          session.isActive ? "bg-green-500 animate-pulse shadow-lg shadow-green-500/50" : "bg-gray-400"
                        )} />
                        <Badge className={cn(
                          "font-medium",
                          session.isActive 
                            ? "bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400 border-green-500/20" 
                            : "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
                        )}>
                          <Zap className="h-3 w-3 mr-1" />
                          {session.isActive ? "Live" : "Ended"}
                        </Badge>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Session is {session.isActive ? 'active' : 'ended'}</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Separator orientation="vertical" className="h-6" />
                  
                  {/* Participants */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border-blue-500/20">
                        <Users className="h-3 w-3 mr-1" />
                        {participantCount}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{participantCount} participant{participantCount !== 1 ? 's' : ''} online</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Separator orientation="vertical" className="h-6" />
                  
                  {/* Sync Status */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge className={cn(
                        "font-medium border-2",
                        syncStatusConfig.bgColor,
                        syncStatusConfig.borderColor,
                        syncStatusConfig.color
                      )}>
                        <syncStatusConfig.icon className={cn(
                          "h-3 w-3 mr-1",
                          syncStatusConfig.animate && "animate-spin"
                        )} />
                        {syncStatusConfig.label}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{syncStatusConfig.description}</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Separator orientation="vertical" className="h-6" />
                  
                  {/* Host Badge */}
                  {isHost && (
                    <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400 border-orange-500/20">
                      <Crown className="h-3 w-3 mr-1" />
                      Host
                    </Badge>
                  )}
                  
                  {/* Session Type */}
                  <Badge variant="outline">
                    {session.type === 'PUBLIC' ? (
                      <>
                        <Globe className="h-3 w-3 mr-1" />
                        Public
                      </>
                    ) : (
                      <>
                        <Lock className="h-3 w-3 mr-1" />
                        Private
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Section - Actions */}
          <div className="flex items-center space-x-3">
            {/* Quick Actions */}
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={togglePreview}
                  >
                    {isPreviewVisible ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                    Preview
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isPreviewVisible ? "Hide preview" : "Show preview"}</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleCopyLink}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy session link</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleSaveAll}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save all files</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleExport}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export session</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <Separator orientation="vertical" className="h-8" />
            
            {/* Primary Actions */}
            {isHost && (
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm"
                  onClick={showInviteModal}
                  className="bg-primary hover:bg-primary/90 shadow-md"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite
                </Button>
                
                <Button 
                  size="sm"
                  variant="destructive"
                  onClick={showEndSessionModal}
                  disabled={endSessionLoading}
                >
                  {endSessionLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Ending...
                    </>
                  ) : (
                    <>
                      <StopCircle className="h-4 w-4 mr-2" />
                      End Session
                    </>
                  )}
                </Button>
              </div>
            )}
            
            {/* User Menu */}
            {currentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="p-0 h-8 w-8">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={currentUser.avatar} />
                      <AvatarFallback className="text-xs">
                        {currentUser.displayName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>
                    <div className="flex items-center space-x-2 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser.avatar} />
                        <AvatarFallback>
                          {currentUser.displayName?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">
                          {currentUser.displayName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {onOpenSettings && (
                    <DropdownMenuItem onClick={onOpenSettings}>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                  )}
                  {onLogout && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
