'use client'

import { 
  XCircle, 
  Home, 
  RefreshCw, 
  AlertTriangle, 
  Clock, 
  Wifi, 
  UserX, 
  StopCircle,
  Shield,
  Activity,
  ArrowRight,
  Info,
  Users,
  FileX,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface SessionEndedModalProps {
  sessionEndedReason: string
  goToDashboard: () => void
  sessionTitle?: string
  duration?: string
  participantCount?: number
  filesCount?: number
}

export default function SessionEndedModal({
  sessionEndedReason,
  goToDashboard,
  sessionTitle = "Collaboration Session",
  duration,
  participantCount = 0,
  filesCount = 0
}: SessionEndedModalProps) {
  const [open, setOpen] = useState(true)
  const [isRetrying, setIsRetrying] = useState(false)
  const [retryProgress, setRetryProgress] = useState(0)

  // Handle modal close
  const handleClose = () => {
    setOpen(false)
    goToDashboard()
  }

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  const refreshPage = () => {
    setIsRetrying(true)
    setRetryProgress(0)
    toast.loading('Attempting to reconnect...', { id: 'retry-connection' })
    
    // Simulate retry progress
    const interval = setInterval(() => {
      setRetryProgress(prev => {
        if (prev >= 90) return prev
        return prev + Math.random() * 15
      })
    }, 100)
    
    setTimeout(() => {
      clearInterval(interval)
      setRetryProgress(100)
      setTimeout(() => {
        window.location.reload()
      }, 500)
    }, 2000)
  }

  const getReasonConfig = (reason: string) => {
    switch (reason) {
      case 'host_ended':
        return {
          message: 'The session host has ended this collaboration session.',
          description: 'All participants have been disconnected and the session is no longer active.',
          icon: StopCircle,
          iconColor: 'text-orange-600 dark:text-orange-400',
          bgColor: 'bg-orange-100 dark:bg-orange-950/20',
          borderColor: 'border-orange-200 dark:border-orange-900/20',
          title: 'Session Ended by Host',
          canRetry: false,
          severity: 'warning'
        }
      case 'session_expired':
        return {
          message: 'This session has expired due to inactivity.',
          description: 'Sessions automatically end after a period of inactivity to free up resources.',
          icon: Clock,
          iconColor: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-900/20',
          borderColor: 'border-gray-200 dark:border-gray-800',
          title: 'Session Expired',
          canRetry: false,
          severity: 'info'
        }
      case 'connection_lost':
        return {
          message: 'Connection to the session was lost.',
          description: 'This could be due to network issues or the session may have ended unexpectedly.',
          icon: Wifi,
          iconColor: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-100 dark:bg-red-950/20',
          borderColor: 'border-red-200 dark:border-red-900/20',
          title: 'Connection Lost',
          canRetry: true,
          severity: 'error'
        }
      case 'kicked':
        return {
          message: 'You have been removed from this session.',
          description: 'The session host has removed you from the collaboration.',
          icon: UserX,
          iconColor: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-100 dark:bg-red-950/20',
          borderColor: 'border-red-200 dark:border-red-900/20',
          title: 'Removed from Session',
          canRetry: false,
          severity: 'error'
        }
      default:
        return {
          message: 'This session has been terminated.',
          description: 'The collaboration session is no longer available.',
          icon: XCircle,
          iconColor: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-100 dark:bg-red-950/20',
          borderColor: 'border-red-200 dark:border-red-900/20',
          title: 'Session Terminated',
          canRetry: false,
          severity: 'error'
        }
    }
  }

  const reasonConfig = getReasonConfig(sessionEndedReason)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg mx-4 sm:mx-auto border-0 bg-card/95 backdrop-blur shadow-2xl" hideCloseButton>
        <DialogHeader className="text-center space-y-6 pb-4">
          {/* Status Icon */}
          <div className="mx-auto">
            <div className={cn(
              "flex items-center justify-center w-20 h-20 rounded-3xl shadow-lg",
              reasonConfig.bgColor,
              reasonConfig.borderColor,
              "border-2"
            )}>
              <reasonConfig.icon className={cn("h-10 w-10", reasonConfig.iconColor)} />
            </div>
          </div>
          
          <div className="space-y-3">
            <DialogTitle className="text-3xl font-bold text-foreground">
              {reasonConfig.title}
            </DialogTitle>
            
            <DialogDescription className="text-lg text-muted-foreground">
              {reasonConfig.message}
            </DialogDescription>
            
            {sessionTitle && (
              <div className="flex items-center justify-center space-x-2 mt-4">
                <Badge variant="outline" className="text-sm px-3 py-1 font-medium">
                  {sessionTitle}
                </Badge>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Session Summary */}
          {(duration || participantCount > 0 || filesCount > 0) && (
            <Card className="border-0 bg-muted/30 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Session Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {duration && (
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                          <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-muted-foreground font-medium">Duration</span>
                      </div>
                      <span className="font-semibold text-foreground">{duration}</span>
                    </div>
                  )}
                  
                  {participantCount > 0 && (
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                          <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-muted-foreground font-medium">Participants</span>
                      </div>
                      <span className="font-semibold text-foreground">{participantCount}</span>
                    </div>
                  )}
                  
                  {filesCount > 0 && (
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                          <FileX className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-muted-foreground font-medium">Files Created</span>
                      </div>
                      <span className="font-semibold text-foreground">{filesCount}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Detailed Information */}
          <Alert className={cn("border-2", reasonConfig.borderColor, reasonConfig.bgColor)}>
            <Info className={cn("h-5 w-5", reasonConfig.iconColor)} />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold text-foreground">
                  What happened?
                </p>
                <p className="text-muted-foreground">
                  {reasonConfig.description}
                </p>
              </div>
            </AlertDescription>
          </Alert>

          {/* Connection Lost Specific Alert */}
          {sessionEndedReason === 'connection_lost' && (
            <Alert className="border-orange-200 bg-orange-50 dark:border-orange-900/20 dark:bg-orange-950/20">
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-semibold text-orange-800 dark:text-orange-200">Network Issue Detected</p>
                  <p className="text-orange-700 dark:text-orange-300">
                    If this was unexpected, try refreshing to reconnect. Check your internet connection 
                    and try again.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Data Safety Notice */}
          <Alert className="border-green-200 bg-green-50 dark:border-green-900/20 dark:bg-green-950/20">
            <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold text-green-800 dark:text-green-200">Your Work is Safe</p>
                <p className="text-green-700 dark:text-green-300">
                  All your work has been automatically saved and can be accessed from your dashboard.
                </p>
              </div>
            </AlertDescription>
          </Alert>

          {/* Next Steps */}
          <Card className="border-0 bg-gradient-to-r from-primary/5 to-purple-500/5 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">What's next?</CardTitle>
              <CardDescription>Choose your next action to continue working</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {reasonConfig.canRetry && (
                <Card className="border border-border/50 hover:bg-muted/30 transition-colors cursor-pointer" onClick={refreshPage}>
                  <CardContent className="flex items-center space-x-4 p-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                      <RefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground">Try Reconnecting</p>
                      <p className="text-sm text-muted-foreground">
                        Attempt to rejoin if the issue was temporary
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              )}
              
              <Card className="border border-border/50 hover:bg-muted/30 transition-colors cursor-pointer" onClick={handleClose}>
                <CardContent className="flex items-center space-x-4 p-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Home className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">Return to Dashboard</p>
                    <p className="text-sm text-muted-foreground">
                      View all your sessions and continue working
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
              
              <Card className="border border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
                <CardContent className="flex items-center space-x-4 p-4">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">Start New Session</p>
                    <p className="text-sm text-muted-foreground">
                      Create a fresh collaboration session
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Retry Progress */}
          {isRetrying && (
            <Card className="border-0 bg-muted/20">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                    <span className="font-medium">Reconnecting...</span>
                  </div>
                  <span className="text-primary font-semibold">{Math.round(retryProgress)}%</span>
                </div>
                <Progress value={retryProgress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Please wait while we attempt to restore your connection
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-3 pt-6 border-t">
          {reasonConfig.canRetry && (
            <Button 
              variant="outline"
              onClick={refreshPage}
              disabled={isRetrying}
              className="w-full sm:w-auto"
            >
              {isRetrying ? (
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Reconnecting...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>Try Again</span>
                </div>
              )}
            </Button>
          )}
          
          <Button 
            onClick={handleClose}
            className="w-full sm:w-auto shadow-md"
          >
            <Home className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
