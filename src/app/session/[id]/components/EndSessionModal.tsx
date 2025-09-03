'use client'

import { 
  StopCircle, 
  AlertTriangle, 
  Loader2, 
  Shield, 
  Users, 
  FileText,
  Clock,
  Zap,
  Archive,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
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

  const handleClose = () => {
    if (!endSessionLoading) {
      setOpen(false)
      closeModal()
    }
  }

  const handleConfirmedEndSession = () => {
    toast.loading('Ending session...', { id: 'end-session' })
    handleEndSession()
  }

  // Enhanced progress simulation
  useEffect(() => {
    if (endSessionLoading) {
      setConfirmationProgress(0)
      const interval = setInterval(() => {
        setConfirmationProgress(prev => {
          if (prev >= 95) return prev
          return prev + Math.random() * 12
        })
      }, 120)
      
      return () => clearInterval(interval)
    } else {
      if (confirmationProgress > 0) {
        setConfirmationProgress(100)
        setTimeout(() => setConfirmationProgress(0), 800)
      }
    }
  }, [endSessionLoading])

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden bg-card border-border">
        {/* Header Section */}
        <DialogHeader className="space-y-4 pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center border border-destructive/20">
                <StopCircle className="h-6 w-6 text-destructive" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-xl font-semibold text-card-foreground flex items-center space-x-3">
                  <span>End Collaboration Session</span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    <Zap className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-muted-foreground mt-1 text-base">
                  <span className="font-medium text-card-foreground">&quot;{sessionTitle}&quot;</span>
                  <span className="text-muted-foreground ml-1">- This action will immediately disconnect all participants</span>
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Content Section */}
        <div className="space-y-6 py-2 max-h-[60vh] overflow-y-auto">
          {/* Critical Warning Alert */}
          <Alert className="bg-destructive/5 border-destructive/30">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertDescription className="text-card-foreground">
              <span className="font-semibold text-destructive">Warning:</span> This action cannot be undone and will immediately stop all real-time collaboration.
            </AlertDescription>
          </Alert>

          {/* Session Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-border/50 bg-muted/30">
              <CardContent className="flex items-center space-x-4 p-4">
                <div className="w-12 h-12 bg-chart-1/10 rounded-xl flex items-center justify-center border border-chart-1/20">
                  <Users className="h-6 w-6 text-chart-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-2xl font-bold text-card-foreground">{participantCount}</div>
                  <div className="text-sm text-muted-foreground">Active Participants</div>
                  {participantCount > 1 && (
                    <div className="text-xs text-chart-5 mt-0.5">Will be disconnected</div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border/50 bg-muted/30">
              <CardContent className="flex items-center space-x-4 p-4">
                <div className="w-12 h-12 bg-chart-2/10 rounded-xl flex items-center justify-center border border-chart-2/20">
                  <FileText className="h-6 w-6 text-chart-2" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-2xl font-bold text-card-foreground">{fileCount}</div>
                  <div className="text-sm text-muted-foreground">Project Files</div>
                  <div className="text-xs text-chart-2 mt-0.5">Will be preserved</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Session Metadata */}
          {(sessionDuration || lastActivity) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sessionDuration && (
                <div className="flex items-center space-x-3 p-4 bg-muted/20 rounded-lg border border-border/50">
                  <div className="w-10 h-10 bg-chart-5/10 rounded-lg flex items-center justify-center border border-chart-5/20">
                    <Clock className="h-5 w-5 text-chart-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Duration</div>
                    <div className="text-lg font-semibold text-card-foreground">{sessionDuration}</div>
                  </div>
                </div>
              )}
              
              {lastActivity && (
                <div className="flex items-center space-x-3 p-4 bg-muted/20 rounded-lg border border-border/50">
                  <div className="w-10 h-10 bg-chart-4/10 rounded-lg flex items-center justify-center border border-chart-4/20">
                    <Zap className="h-5 w-5 text-chart-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Last Activity</div>
                    <div className="text-lg font-semibold text-card-foreground">{lastActivity}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          <Separator className="bg-border/50" />
          
          {/* Impact Summary */}
          <Card className="border-border/50 bg-muted/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-card-foreground flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-chart-5" />
                <span>What happens next?</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                These actions will occur immediately when you end the session:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { 
                  icon: Users, 
                  text: `${participantCount} participant${participantCount !== 1 ? 's' : ''} will be disconnected`, 
                  color: "text-chart-5",
                  bgColor: "bg-chart-5/10",
                  borderColor: "border-chart-5/20"
                },
                { 
                  icon: StopCircle, 
                  text: "Real-time collaboration will stop instantly", 
                  color: "text-destructive",
                  bgColor: "bg-destructive/10",
                  borderColor: "border-destructive/20"
                },
                { 
                  icon: Shield, 
                  text: "Session will be closed to new participants", 
                  color: "text-muted-foreground",
                  bgColor: "bg-muted/10",
                  borderColor: "border-border/30"
                }
              ].map(({ icon: Icon, text, color, bgColor, borderColor }, index) => (
                <div 
                  key={index}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200",
                    bgColor, borderColor,
                    "hover:bg-opacity-80"
                  )}
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", bgColor, borderColor, "border")}>
                    <Icon className={cn("h-4 w-4", color)} />
                  </div>
                  <span className="text-sm text-card-foreground font-medium">{text}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Data Preservation Notice */}
          <Alert className="bg-chart-2/5 border-chart-2/30">
            <Archive className="h-5 w-5 text-chart-2" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-semibold text-chart-2">Your work is safe</div>
                <div className="text-card-foreground">
                  All files, project data, and chat history will be preserved. You can download or export your work even after the session ends.
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {/* Loading Progress */}
          {endSessionLoading && (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <div>
                      <div className="text-base font-semibold text-card-foreground">Ending session...</div>
                      <div className="text-sm text-muted-foreground">Safely disconnecting participants and saving data</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{Math.round(confirmationProgress)}%</div>
                  </div>
                </div>
                <Progress 
                  value={confirmationProgress} 
                  className="h-3 bg-muted/50" 
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer Actions */}
        <DialogFooter className="flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-border/50">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={endSessionLoading}
            className="w-full sm:w-auto border-border/50 hover:bg-muted/50"
          >
            {endSessionLoading ? 'Please wait...' : 'Cancel'}
          </Button>
          
          <Button 
            variant="destructive"
            onClick={handleConfirmedEndSession}
            disabled={endSessionLoading}
            className={cn(
              "w-full sm:w-auto min-w-[160px]",
              "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
              "shadow-lg hover:shadow-xl transition-all duration-200"
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
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
