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

  // Get sync status configuration using CSS variables
  const getSyncStatus = () => {
    switch (syncStatus) {
      case 'synced':
        return { 
          icon: CheckCircle, 
          color: 'text-green-600 dark:text-green-400', 
          bgColor: 'bg-green-100/50 dark:bg-green-950/20', 
          borderColor: 'border-green-200/50 dark:border-green-900/30',
          label: 'Synced',
          description: 'All changes saved'
        }
      case 'syncing':
        return { 
          icon: RefreshCw, 
          color: 'text-blue-600 dark:text-blue-400', 
          bgColor: 'bg-blue-100/50 dark:bg-blue-950/20', 
          borderColor: 'border-blue-200/50 dark:border-blue-900/30',
          label: 'Syncing',
          description: 'Saving changes...',
          animate: true 
        }
      case 'offline':
        return { 
          icon: WifiOff, 
          color: 'text-orange-600 dark:text-orange-400', 
          bgColor: 'bg-orange-100/50 dark:bg-orange-950/20', 
          borderColor: 'border-orange-200/50 dark:border-orange-900/30',
          label: 'Offline',
          description: 'Connection lost'
        }
      default:
        return { 
          icon: AlertCircle, 
          color: 'text-red-600 dark:text-red-400', 
          bgColor: 'bg-red-100/50 dark:bg-red-950/20', 
          borderColor: 'border-red-200/50 dark:border-red-900/30',
          label: 'Error',
          description: 'Sync failed'
        }
    }
  }

  const syncStatusConfig = getSyncStatus()

  // Mobile Layout with VS Code theme
  if (isMobile) {
    return (
      <div className="border-b border-border bg-card/80 backdrop-blur">
        <div className="p-3">
          <div className="flex items-center justify-between">
            {/* Mobile Left Section */}
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg font-semibold text-foreground truncate">
                    {session.title}
                  </h1>
                  
                  {/* Live Status Indicator */}
                  <div className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0",
                    session.isActive ? "bg-green-500 animate-pulse" : "bg-muted-foreground"
                  )} />
                  
                  {/* Host Badge */}
                  {isHost && (
                    <Badge variant="secondary" className="text-xs">
                      <Crown className="h-2.5 w-2.5 mr-1" />
                      Host
                    </Badge>
                  )}
                </div>
                
                {/* Mobile Stats Row */}
                <div className="flex items-center space-x-3 mt-1 text-xs text-muted-foreground">
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
                </div>
              </div>
            </div>
            
            {/* Mobile Menu Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-card border-border">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <span>Session Controls</span>
                  </SheetTitle>
                  <SheetDescription className="text-muted-foreground">
                    Manage your collaboration session and settings
                  </SheetDescription>
                </SheetHeader>
                
                <div className="space-y-6 mt-6">
                  {/* Session Status */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">Status</h4>
                    <div className={cn(
                      "rounded-lg border p-3",
                      syncStatusConfig.borderColor,
                      syncStatusConfig.bgColor
                    )}>
                      <div className="flex items-center space-x-3">
                        <syncStatusConfig.icon className={cn(
                          "h-4 w-4", 
                          syncStatusConfig.color,
                          syncStatusConfig.animate && "animate-spin"
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {syncStatusConfig.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {syncStatusConfig.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" onClick={togglePreview}>
                        {isPreviewVisible ? <EyeOff className="h-3 w-3 mr-2" /> : <Eye className="h-3 w-3 mr-2" />}
                        Preview
                      </Button>
                      
                      <Button variant="outline" size="sm" onClick={handleCopyLink}>
                        <Copy className="h-3 w-3 mr-2" />
                        Copy
                      </Button>
                      
                      <Button variant="outline" size="sm" onClick={handleSaveAll}>
                        <Save className="h-3 w-3 mr-2" />
                        Save
                      </Button>
                      
                      <Button variant="outline" size="sm" onClick={handleExport}>
                        <Download className="h-3 w-3 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                  
                  {/* Host Actions */}
                  {isHost && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-foreground">Host Actions</h4>
                      <div className="space-y-2">
                        <Button 
                          onClick={showInviteModal}
                          className="w-full"
                          size="sm"
                        >
                          <UserPlus className="h-3 w-3 mr-2" />
                          Invite Collaborators
                        </Button>
                        
                        <Button 
                          variant="destructive"
                          onClick={showEndSessionModal}
                          disabled={endSessionLoading}
                          className="w-full"
                          size="sm"
                        >
                          {endSessionLoading ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                              Ending...
                            </>
                          ) : (
                            <>
                              <StopCircle className="h-3 w-3 mr-2" />
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
                      <h4 className="text-sm font-medium text-foreground">Account</h4>
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={currentUser.avatar} />
                            <AvatarFallback className="text-xs">
                              {currentUser.displayName?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {currentUser.displayName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {currentUser.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        {onOpenSettings && (
                          <Button variant="ghost" onClick={onOpenSettings} className="w-full justify-start" size="sm">
                            <Settings className="h-3 w-3 mr-2" />
                            Settings
                          </Button>
                        )}
                        
                        {onLogout && (
                          <Button variant="ghost" onClick={onLogout} className="w-full justify-start text-destructive hover:text-destructive" size="sm">
                            <LogOut className="h-3 w-3 mr-2" />
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
      </div>
    )
  }

  // Desktop Layout - VS Code style
  return (
    <div className="border-b border-border bg-card/80 backdrop-blur">
      <div className="p-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Session Info */}
          <div className="flex items-center space-x-6 min-w-0 flex-1">
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-foreground truncate">
                  {session.title}
                </h1>
                
                {/* Status Indicators */}
                <div className="flex items-center space-x-3">
                  {/* Live Status */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          session.isActive ? "bg-green-500 animate-pulse" : "bg-muted-foreground"
                        )} />
                        <Badge variant={session.isActive ? "default" : "secondary"}>
                          <Zap className="h-3 w-3 mr-1" />
                          {session.isActive ? "Live" : "Ended"}
                        </Badge>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      Session is {session.isActive ? 'active' : 'ended'}
                    </TooltipContent>
                  </Tooltip>
                  
                  <Separator orientation="vertical" className="h-4" />
                  
                  {/* Participants */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline">
                        <Users className="h-3 w-3 mr-1" />
                        {participantCount}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      {participantCount} participant{participantCount !== 1 ? 's' : ''} online
                    </TooltipContent>
                  </Tooltip>
                  
                  <Separator orientation="vertical" className="h-4" />
                  
                  {/* Sync Status */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className={cn(syncStatusConfig.color)}>
                        <syncStatusConfig.icon className={cn(
                          "h-3 w-3 mr-1",
                          syncStatusConfig.animate && "animate-spin"
                        )} />
                        {syncStatusConfig.label}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      {syncStatusConfig.description}
                    </TooltipContent>
                  </Tooltip>
                  
                  <Separator orientation="vertical" className="h-4" />
                  
                  {/* Host Badge */}
                  {isHost && (
                    <Badge variant="secondary">
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
                  <Button size="sm" variant="outline" onClick={togglePreview}>
                    {isPreviewVisible ? <EyeOff className="h-3 w-3 mr-2" /> : <Eye className="h-3 w-3 mr-2" />}
                    Preview
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isPreviewVisible ? "Hide preview" : "Show preview"}
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" onClick={handleCopyLink}>
                    <Copy className="h-3 w-3 mr-2" />
                    Copy
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Copy session link
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" onClick={handleSaveAll}>
                    <Save className="h-3 w-3 mr-2" />
                    Save
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Save all files
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" onClick={handleExport}>
                    <Download className="h-3 w-3 mr-2" />
                    Export
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Export session
                </TooltipContent>
              </Tooltip>
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            {/* Primary Actions */}
            {isHost && (
              <div className="flex items-center space-x-2">
                <Button size="sm" onClick={showInviteModal}>
                  <UserPlus className="h-3 w-3 mr-2" />
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
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      Ending...
                    </>
                  ) : (
                    <>
                      <StopCircle className="h-3 w-3 mr-2" />
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
                        <p className="font-medium text-foreground truncate">
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
      </div>
    </div>
  )
}
