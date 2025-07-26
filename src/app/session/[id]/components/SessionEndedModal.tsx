import { XCircle, Home, RefreshCw, AlertTriangle, Clock, Wifi, UserX, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HeroLogo from '@/components/ui/hero-logo';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface SessionEndedModalProps {
  sessionEndedReason: string;
  goToDashboard: () => void;
  sessionTitle?: string;
  duration?: string;
}

export default function SessionEndedModal({
  sessionEndedReason,
  goToDashboard,
  sessionTitle = "Collaboration Session",
  duration
}: SessionEndedModalProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const refreshPage = () => {
    setIsRetrying(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const getReasonConfig = (reason: string) => {
    switch (reason) {
      case 'host_ended':
        return {
          message: 'The session host has ended this collaboration session.',
          icon: StopCircle,
          iconColor: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/30',
          emoji: '👋',
          title: 'Session Ended by Host',
          canRetry: false
        };
      case 'session_expired':
        return {
          message: 'This session has expired due to inactivity.',
          icon: Clock,
          iconColor: 'text-muted-foreground',
          bgColor: 'bg-muted-foreground/10',
          borderColor: 'border-muted-foreground/30',
          emoji: '⏰',
          title: 'Session Expired',
          canRetry: false
        };
      case 'connection_lost':
        return {
          message: 'Connection to the session was lost. The session may have ended.',
          icon: Wifi,
          iconColor: 'text-destructive',
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/30',
          emoji: '📡',
          title: 'Connection Lost',
          canRetry: true
        };
      case 'kicked':
        return {
          message: 'You have been removed from this session by the host.',
          icon: UserX,
          iconColor: 'text-destructive',
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/30',
          emoji: '🚪',
          title: 'Removed from Session',
          canRetry: false
        };
      default:
        return {
          message: 'This session has been terminated.',
          icon: XCircle,
          iconColor: 'text-destructive',
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/30',
          emoji: '❌',
          title: 'Session Terminated',
          canRetry: false
        };
    }
  };

  const reasonConfig = getReasonConfig(sessionEndedReason);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card 
        className={cn(
          "w-full max-w-md glass-card shadow-2xl animate-fade-in-scale",
          reasonConfig.borderColor,
          isMobile ? "mx-4" : "mx-auto"
        )}
      >
        <CardHeader className="pb-4 text-center">
          <div className="flex justify-center mb-4">
            <HeroLogo 
              size="sm" 
              variant="compact" 
              className="opacity-75"
            />
          </div>
          
          <div className={cn(
            "mx-auto flex items-center justify-center w-20 h-20 rounded-full mb-6 transition-all duration-300",
            reasonConfig.bgColor,
            "border-2",
            reasonConfig.borderColor
          )}>
            <div className="relative">
              <span className="text-3xl animate-pulse-subtle">{reasonConfig.emoji}</span>
              <reasonConfig.icon className={cn(
                "absolute -bottom-1 -right-1 h-6 w-6 bg-card rounded-full p-1",
                reasonConfig.iconColor
              )} />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold gradient-text mb-2">
            {reasonConfig.title}
          </h2>
          
          {sessionTitle && (
            <p className="text-sm text-muted-foreground truncate max-w-[250px] mx-auto">
              {sessionTitle}
            </p>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Main Message */}
          <div className="text-center">
            <p className="text-muted-foreground leading-relaxed">
              {reasonConfig.message}
            </p>
            
            {duration && (
              <div className="mt-4 flex items-center justify-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Session duration: {duration}
                </span>
              </div>
            )}
          </div>

          {/* Connection Lost Alert */}
          {sessionEndedReason === 'connection_lost' && (
            <Alert className={cn("animate-slide-down glass-card backdrop-blur-sm", reasonConfig.borderColor)}>
              <AlertTriangle className={cn("h-4 w-4", reasonConfig.iconColor)} />
              <AlertDescription className="text-muted-foreground">
                <strong className="text-foreground">Connection Issue:</strong> If this was unexpected, 
                you can try refreshing the page to reconnect to the session.
              </AlertDescription>
            </Alert>
          )}

          {/* Session Statistics */}
          <div className="grid grid-cols-1 gap-3">
            <div className="p-3 bg-muted/20 rounded-lg backdrop-blur-sm text-center">
              <div className="text-sm text-muted-foreground">
                Your work has been automatically saved and can be accessed from your dashboard.
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">What's next?</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              {reasonConfig.canRetry && (
                <div className="flex items-start space-x-2">
                  <RefreshCw className="h-4 w-4 mt-0.5 flex-shrink-0 text-info" />
                  <span>Try reconnecting if the issue was temporary</span>
                </div>
              )}
              <div className="flex items-start space-x-2">
                <Home className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                <span>Return to dashboard to view your sessions</span>
              </div>
              <div className="flex items-start space-x-2">
                <StopCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-success" />
                <span>Create a new session for continued collaboration</span>
              </div>
            </div>
          </div>
        </CardContent>
        
        {/* Action Buttons */}
        <div className={cn(
          "flex justify-center p-6 border-t border-border/30 bg-card/30 backdrop-blur-sm rounded-b-xl",
          reasonConfig.canRetry ? "space-x-3" : ""
        )}>
          {reasonConfig.canRetry && (
            <Button 
              variant="outline"
              onClick={refreshPage}
              disabled={isRetrying}
              className="glass-card backdrop-blur-sm hover:bg-card/50 transition-all duration-200 group"
              size={isMobile ? "default" : "lg"}
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Reconnecting...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                  Try Again
                </>
              )}
            </Button>
          )}
          
          <Button 
            onClick={goToDashboard}
            className="bg-gradient-to-r from-primary via-accent-purple to-accent-blue hover:from-primary/90 hover:via-accent-purple/90 hover:to-accent-blue/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
            size={isMobile ? "default" : "lg"}
          >
            <Home className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
            Go to Dashboard
          </Button>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <Badge 
            variant="secondary" 
            className={cn(
              "text-xs backdrop-blur-sm",
              reasonConfig.bgColor,
              reasonConfig.borderColor,
              "border"
            )}
          >
            {reasonConfig.title}
          </Badge>
        </div>
      </Card>
    </div>
  );
}
