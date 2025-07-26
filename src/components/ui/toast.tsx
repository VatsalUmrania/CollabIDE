'use client'

import * as React from 'react'
import * as ToastPrimitives from '@radix-ui/react-toast'
import { cva, type VariantProps } from 'class-variance-authority'
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Loader2,
  Users,
  Code,
  FileText,
  Zap,
  Crown,
  Globe,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-4 right-4 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:max-w-[420px] gap-2",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start justify-between space-x-3 overflow-hidden rounded-xl border backdrop-blur-sm shadow-lg transition-all duration-300 data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default: "border-border/50 bg-card/90 text-card-foreground shadow-md hover:shadow-lg",
        destructive: "border-destructive/30 bg-destructive/10 text-destructive-foreground shadow-md shadow-destructive/10 hover:shadow-destructive/20",
        success: "border-success/30 bg-success/10 text-success-foreground shadow-md shadow-success/10 hover:shadow-success/20",
        warning: "border-warning/30 bg-warning/10 text-warning-foreground shadow-md shadow-warning/10 hover:shadow-warning/20",
        info: "border-info/30 bg-info/10 text-info-foreground shadow-md shadow-info/10 hover:shadow-info/20",
        loading: "border-primary/30 bg-primary/10 text-primary-foreground shadow-md shadow-primary/10 hover:shadow-primary/20",
        glass: "glass-card border-border/30 text-foreground shadow-xl",
        // CollabIDE-specific variants
        collaboration: "border-accent-purple/30 bg-accent-purple/10 text-accent-purple shadow-md shadow-accent-purple/10 hover:shadow-accent-purple/20",
        session: "border-accent-blue/30 bg-accent-blue/10 text-accent-blue shadow-md shadow-accent-blue/10 hover:shadow-accent-blue/20",
        code: "border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan shadow-md shadow-accent-cyan/10 hover:shadow-accent-cyan/20 font-mono",
        system: "border-accent-orange/30 bg-accent-orange/10 text-accent-orange shadow-md shadow-accent-orange/10 hover:shadow-accent-orange/20",
      },
      size: {
        sm: "p-3 text-sm",
        default: "p-4 text-sm",
        lg: "p-6 text-base",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>,
    VariantProps<typeof toastVariants> {
  showIcon?: boolean
  duration?: number
  persistent?: boolean
  progress?: boolean
  animated?: boolean
}

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  ToastProps
>(({ 
  className, 
  variant, 
  size,
  showIcon = true, 
  duration = 5000,
  persistent = false,
  progress = false,
  animated = true,
  children, 
  ...props 
}, ref) => {
  const [timeLeft, setTimeLeft] = React.useState(duration)
  const [isPaused, setIsPaused] = React.useState(false)

  React.useEffect(() => {
    if (persistent || !progress) return

    const interval = setInterval(() => {
      if (!isPaused) {
        setTimeLeft(prev => {
          if (prev <= 100) return 0
          return prev - 100
        })
      }
    }, 100)

    return () => clearInterval(interval)
  }, [persistent, progress, isPaused])

  const getIcon = () => {
    if (!showIcon) return null
    
    const iconClasses = "h-5 w-5 flex-shrink-0"
    
    switch (variant) {
      case 'success':
        return <CheckCircle className={cn(iconClasses, "text-success animate-scale-in")} />
      case 'destructive':
        return <AlertCircle className={cn(iconClasses, "text-destructive animate-scale-in")} />
      case 'warning':
        return <AlertTriangle className={cn(iconClasses, "text-warning animate-scale-in")} />
      case 'info':
        return <Info className={cn(iconClasses, "text-info animate-scale-in")} />
      case 'loading':
        return <Loader2 className={cn(iconClasses, "text-primary animate-spin")} />
      case 'collaboration':
        return <Users className={cn(iconClasses, "text-accent-purple animate-scale-in")} />
      case 'session':
        return <Globe className={cn(iconClasses, "text-accent-blue animate-scale-in")} />
      case 'code':
        return <Code className={cn(iconClasses, "text-accent-cyan animate-scale-in")} />
      case 'system':
        return <Settings className={cn(iconClasses, "text-accent-orange animate-scale-in")} />
      default:
        return <Info className={cn(iconClasses, "text-muted-foreground animate-scale-in")} />
    }
  }

  const progressPercentage = duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant, size }), className)}
      duration={persistent ? Infinity : duration}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      {...props}
    >
      {/* Progress bar */}
      {progress && !persistent && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 overflow-hidden">
          <div 
            className="h-full bg-current opacity-30 transition-all duration-100 ease-linear"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}

      {/* Background shimmer effect */}
      {animated && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer-slow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}

      <div className="flex items-start space-x-3 flex-1 relative z-10">
        {getIcon()}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </ToastPrimitives.Root>
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action> & {
    variant?: 'default' | 'destructive' | 'success' | 'outline'
  }
>(({ className, variant = 'default', ...props }, ref) => {
  const actionVariants = {
    default: "bg-primary/10 hover:bg-primary/20 text-primary border-primary/30",
    destructive: "bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/30",
    success: "bg-success/10 hover:bg-success/20 text-success border-success/30",
    outline: "bg-transparent hover:bg-accent text-foreground border-border",
  }

  return (
    <ToastPrimitives.Action
      ref={ref}
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-lg border px-3 text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        actionVariants[variant],
        className
      )}
      {...props}
    />
  )
})
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-lg p-1.5 text-foreground/50 opacity-0 transition-all duration-200 hover:text-foreground hover:bg-accent/50 hover:scale-110 active:scale-95 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring group-hover:opacity-100",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold mb-1 leading-tight", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90 leading-relaxed", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

// Enhanced specialized toast components for CollabIDE
const CollaborationToast = React.forwardRef<
  React.ElementRef<typeof Toast>,
  Omit<ToastProps, 'variant'> & {
    collaboratorName?: string
    action?: 'joined' | 'left' | 'started_editing' | 'stopped_editing'
  }
>(({ collaboratorName, action, children, ...props }, ref) => {
  const getActionText = () => {
    switch (action) {
      case 'joined': return `${collaboratorName} joined the session`
      case 'left': return `${collaboratorName} left the session`
      case 'started_editing': return `${collaboratorName} started editing`
      case 'stopped_editing': return `${collaboratorName} stopped editing`
      default: return children
    }
  }

  return (
    <Toast ref={ref} variant="collaboration" {...props}>
      <ToastTitle>Collaboration Update</ToastTitle>
      <ToastDescription>{getActionText()}</ToastDescription>
    </Toast>
  )
})
CollaborationToast.displayName = 'CollaborationToast'

const SessionToast = React.forwardRef<
  React.ElementRef<typeof Toast>,
  Omit<ToastProps, 'variant'> & {
    sessionName?: string
    status?: 'created' | 'joined' | 'ended' | 'error'
  }
>(({ sessionName, status, children, ...props }, ref) => {
  const getStatusContent = () => {
    switch (status) {
      case 'created':
        return {
          title: 'Session Created',
          description: `"${sessionName}" is ready for collaboration`
        }
      case 'joined':
        return {
          title: 'Session Joined',
          description: `Connected to "${sessionName}"`
        }
      case 'ended':
        return {
          title: 'Session Ended',
          description: `"${sessionName}" has been closed`
        }
      case 'error':
        return {
          title: 'Session Error',
          description: `Failed to connect to "${sessionName}"`
        }
      default:
        return { title: 'Session Update', description: children }
    }
  }

  const content = getStatusContent()
  const variant = status === 'error' ? 'destructive' : status === 'ended' ? 'warning' : 'session'

  return (
    <Toast ref={ref} variant={variant as any} {...props}>
      <ToastTitle>{content.title}</ToastTitle>
      <ToastDescription>{content.description}</ToastDescription>
    </Toast>
  )
})
SessionToast.displayName = 'SessionToast'

const CodeToast = React.forwardRef<
  React.ElementRef<typeof Toast>,
  Omit<ToastProps, 'variant'> & {
    fileName?: string
    lineNumber?: number
    type?: 'saved' | 'error' | 'compiled' | 'formatted'
  }
>(({ fileName, lineNumber, type, children, ...props }, ref) => {
  const getTypeContent = () => {
    switch (type) {
      case 'saved':
        return {
          title: 'File Saved',
          description: `${fileName} has been saved successfully`,
          variant: 'success' as const
        }
      case 'error':
        return {
          title: 'Syntax Error',
          description: `Error in ${fileName}${lineNumber ? ` at line ${lineNumber}` : ''}`,
          variant: 'destructive' as const
        }
      case 'compiled':
        return {
          title: 'Compilation Complete',
          description: `${fileName} compiled successfully`,
          variant: 'success' as const
        }
      case 'formatted':
        return {
          title: 'Code Formatted',
          description: `${fileName} has been formatted`,
          variant: 'info' as const
        }
      default:
        return {
          title: 'Code Update',
          description: children,
          variant: 'code' as const
        }
    }
  }

  const content = getTypeContent()

  return (
    <Toast ref={ref} variant={content.variant} {...props}>
      <ToastTitle>{content.title}</ToastTitle>
      <ToastDescription>{content.description}</ToastDescription>
    </Toast>
  )
})
CodeToast.displayName = 'CodeToast'

const SystemToast = React.forwardRef<
  React.ElementRef<typeof Toast>,
  Omit<ToastProps, 'variant'> & {
    systemType?: 'update' | 'maintenance' | 'feature' | 'security'
  }
>(({ systemType, children, ...props }, ref) => {
  const getSystemIcon = () => {
    switch (systemType) {
      case 'update': return <Zap className="h-5 w-5" />
      case 'maintenance': return <Settings className="h-5 w-5" />
      case 'feature': return <Crown className="h-5 w-5" />
      case 'security': return <AlertTriangle className="h-5 w-5" />
      default: return <Info className="h-5 w-5" />
    }
  }

  return (
    <Toast ref={ref} variant="system" showIcon={false} {...props}>
      <div className="flex items-start space-x-3">
        <div className="text-accent-orange animate-scale-in">
          {getSystemIcon()}
        </div>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </Toast>
  )
})
SystemToast.displayName = 'SystemToast'

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  CollaborationToast,
  SessionToast,
  CodeToast,
  SystemToast,
}
