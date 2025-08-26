'use client'

import { 
  X, 
  StopCircle, 
  AlertTriangle, 
  Loader2, 
  Shield, 
  Archive, 
  Users, 
  FileText,
  Clock,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface EndSessionModalProps {
  endSessionLoading: boolean
  handleEndSession: () => void
  closeModal: () => void
  sessionTitle?: string
  participantCount?: number
  fileCount?: number
  sessionDuration?: string
  lastActivity?: string
}

export default function EndSessionModal({
  endSessionLoading,
  handleEndSession,
  closeModal,
  sessionTitle = "Current Session",
  participantCount = 0,
  fileCount = 0,
  sessionDuration,
  lastActivity
}: EndSessionModalProps) {
  const [open, setOpen] = useState(true)
  const [confirmationProgress, setConfirmationProgress] = useState(0)

  // Handle modal close
  const handleClose = () => {
    setOpen(false)
    closeModal()
  }

  // Enhanced confirmation with toast
  const handleConfirmedEndSession = () => {
    toast.loading('Ending session...', { id: 'end-session' })
    handleEndSession()
  }

  // Simulate confirmation progress when ending session
  useEffect(() => {
    if (endSessionLoading) {
      setConfirmationProgress(0)
      const interval = setInterval(() => {
        setConfirmationProgress(prev => {
          if (prev >= 90) return prev
          return prev + Math.random() * 15
        })
      }, 150)
      
      return () => clearInterval(interval)
    } else {
      if (confirmationProgress > 0) {
        setConfirmationProgress(100)
        setTimeout(() => setConfirmationProgress(0), 1000)
      }
    }
  }, [endSessionLoading, confirmationProgress])

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

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-2xl mx-4 sm:mx-auto border-0 bg-card/95 backdrop-blur shadow-2xl">
        <AlertDialogHeader className="space-y-4 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <StopCircle className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <AlertDialogTitle className="text-2xl font-bold text-foreground">
                  End Collaboration Session
                </AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground mt-1">
                  <span className="font-medium">{sessionTitle}</span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Active Session
                  </Badge>
                </AlertDialogDescription>
              </div>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-6 py-4">
          {/* Critical Warning */}
          <Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
            <AlertTriangle className="h-5 w-5" />
            <AlertDescription className="font-medium">
              <strong>Warning:</strong> This action cannot be undone and will immediately disconnect all participants from the session.
            </AlertDescription>
          </Alert>

          {/* Session Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-0 bg-muted/30 backdrop-blur">
              <CardContent className="flex items-center space-x-4 p-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-2xl font-bold text-foreground">{participantCount}</div>
                  <div className="text-sm text-muted-foreground">Active Participants</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-muted/30 backdrop-blur">
              <CardContent className="flex items-center space-x-4 p-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                  <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-2xl font-bold text-foreground">{fileCount}</div>
                  <div className="text-sm text-muted-foreground">Project Files</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Session Metadata */}
          {(sessionDuration || lastActivity) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sessionDuration && (
                <Card className="border-0 bg-muted/20 backdrop-blur">
                  <CardContent className="flex items-center space-x-3 p-4">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                      <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Session Duration</div>
                      <div className="text-sm font-semibold text-foreground">{sessionDuration}</div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {lastActivity && (
                <Card className="border-0 bg-muted/20 backdrop-blur">
                  <CardContent className="flex items-center space-x-3 p-4">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                      <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Last Activity</div>
                      <div className="text-sm font-semibold text-foreground">{lastActivity}</div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          
          {/* Impact Details */}
          <Card className="border-0 bg-muted/20 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">What happens when you end this session?</CardTitle>
              <CardDescription>
                The following actions will take place immediately:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { 
                  icon: Users, 
                  text: "All participants will be disconnected", 
                  color: "text-orange-600 dark:text-orange-400",
                  bgColor: "bg-orange-100 dark:bg-orange-900/20"
                },
                { 
                  icon: StopCircle, 
                  text: "Real-time collaboration will stop", 
                  color: "text-red-600 dark:text-red-400",
                  bgColor: "bg-red-100 dark:bg-red-900/20"
                },
                { 
                  icon: Shield, 
                  text: "New users cannot join the session", 
                  color: "text-gray-600 dark:text-gray-400",
                  bgColor: "bg-gray-100 dark:bg-gray-900/20"
                }
              ].map(({ icon: Icon, text, color, bgColor }, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-border/50 transition-colors hover:bg-muted/30"
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", bgColor)}>
                    <Icon className={cn("h-4 w-4", color)} />
                  </div>
                  <span className="text-sm text-foreground font-medium">{text}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Data Preservation Notice */}
          <Card className="border-0 bg-gradient-to-r from-primary/5 to-primary/10 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Archive className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-semibold text-primary mb-2">
                    Your Data is Safe
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    All files, chat history, and session data will be preserved and remain accessible 
                    for download or review even after the session ends. You can export your work at any time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loading Progress */}
          {endSessionLoading && (
            <Card className="border-0 bg-muted/20 backdrop-blur">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm font-medium text-foreground">Ending session...</span>
                  </div>
                  <span className="text-sm text-primary font-semibold">{Math.round(confirmationProgress)}%</span>
                </div>
                <Progress 
                  value={confirmationProgress} 
                  className="h-2 bg-muted"
                />
                <div className="text-xs text-muted-foreground">
                  Please wait while we safely disconnect all participants and save session data.
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-3 pt-6 border-t">
          <AlertDialogCancel 
            onClick={handleClose}
            disabled={endSessionLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </AlertDialogCancel>
          
          <AlertDialogAction
            onClick={handleConfirmedEndSession}
            disabled={endSessionLoading}
            className={cn(
              "w-full sm:w-auto min-w-[180px]",
              "bg-destructive text-destructive-foreground hover:bg-destructive/90",
              "focus:ring-destructive/20 shadow-lg"
            )}
          >
            {endSessionLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Ending Session...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <StopCircle className="h-4 w-4" />
                <span>End Session Now</span>
              </div>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
