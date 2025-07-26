import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

const alertVariants = cva(
  'relative w-full rounded-xl border p-4 shadow-sm transition-all duration-300 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground backdrop-blur-sm',
  {
    variants: {
      variant: {
        default: 
          'bg-card/80 text-foreground border-border/50 backdrop-blur-sm',
        destructive:
          'border-destructive/30 bg-destructive/10 text-destructive-foreground backdrop-blur-sm [&>svg]:text-destructive shadow-lg shadow-destructive/10',
        success:
          'border-success/30 bg-success/10 text-success-foreground backdrop-blur-sm [&>svg]:text-success shadow-lg shadow-success/10',
        warning:
          'border-warning/30 bg-warning/10 text-warning-foreground backdrop-blur-sm [&>svg]:text-warning shadow-lg shadow-warning/10',
        info:
          'border-info/30 bg-info/10 text-info-foreground backdrop-blur-sm [&>svg]:text-info shadow-lg shadow-info/10',
      },
      size: {
        default: 'p-4 text-base',
        sm: 'p-3 text-sm',
        lg: 'p-6 text-lg',
        xl: 'p-8 text-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  dismissible?: boolean
  onDismiss?: () => void
  icon?: React.ReactNode
  showDefaultIcon?: boolean
  animate?: boolean
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ 
    className, 
    variant, 
    size, 
    dismissible = false, 
    onDismiss, 
    icon,
    showDefaultIcon = true,
    animate = true,
    children,
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true)
    const [isExiting, setIsExiting] = React.useState(false)

    const handleDismiss = () => {
      setIsExiting(true)
      // Delay the actual removal to allow exit animation
      setTimeout(() => {
        setIsVisible(false)
        onDismiss?.()
      }, 300)
    }

    const getDefaultIcon = () => {
      if (icon !== undefined) return icon
      if (!showDefaultIcon) return null

      switch (variant) {
        case 'destructive':
          return <AlertCircle className="h-5 w-5" />
        case 'success':
          return <CheckCircle className="h-5 w-5" />
        case 'warning':
          return <AlertTriangle className="h-5 w-5" />
        case 'info':
          return <Info className="h-5 w-5" />
        default:
          return <Info className="h-5 w-5" />
      }
    }

    if (!isVisible) return null

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          alertVariants({ variant, size }),
          animate && 'animate-slide-down',
          isExiting && 'animate-fade-out opacity-0 transform scale-95',
          className
        )}
        {...props}
      >
        {getDefaultIcon()}
        <div className="flex-1 min-w-0">
          {children}
        </div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 rounded-lg p-1 opacity-70 ring-offset-background transition-all duration-200 hover:opacity-100 hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            aria-label="Dismiss alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }
)
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      'mb-2 font-semibold leading-none tracking-tight text-lg',
      className
    )}
    {...props}
  />
))
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'text-sm leading-relaxed opacity-90 [&_p]:leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0',
      className
    )}
    {...props}
  />
))
AlertDescription.displayName = 'AlertDescription'

const AlertActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center gap-3 mt-4 pt-3 border-t border-border/30',
      className
    )}
    {...props}
  />
))
AlertActions.displayName = 'AlertActions'

// Enhanced Alert variants for specific use cases
const AlertContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('space-y-2', className)}
    {...props}
  />
))
AlertContent.displayName = 'AlertContent'

// Success Alert with predefined styling
const SuccessAlert = React.forwardRef<
  HTMLDivElement,
  Omit<AlertProps, 'variant'>
>(({ children, ...props }, ref) => (
  <Alert ref={ref} variant="success" {...props}>
    {children}
  </Alert>
))
SuccessAlert.displayName = 'SuccessAlert'

// Error Alert with predefined styling
const ErrorAlert = React.forwardRef<
  HTMLDivElement,
  Omit<AlertProps, 'variant'>
>(({ children, ...props }, ref) => (
  <Alert ref={ref} variant="destructive" {...props}>
    {children}
  </Alert>
))
ErrorAlert.displayName = 'ErrorAlert'

// Warning Alert with predefined styling
const WarningAlert = React.forwardRef<
  HTMLDivElement,
  Omit<AlertProps, 'variant'>
>(({ children, ...props }, ref) => (
  <Alert ref={ref} variant="warning" {...props}>
    {children}
  </Alert>
))
WarningAlert.displayName = 'WarningAlert'

// Info Alert with predefined styling
const InfoAlert = React.forwardRef<
  HTMLDivElement,
  Omit<AlertProps, 'variant'>
>(({ children, ...props }, ref) => (
  <Alert ref={ref} variant="info" {...props}>
    {children}
  </Alert>
))
InfoAlert.displayName = 'InfoAlert'

export { 
  Alert, 
  AlertTitle, 
  AlertDescription, 
  AlertActions, 
  AlertContent,
  SuccessAlert,
  ErrorAlert,
  WarningAlert,
  InfoAlert,
  type AlertProps 
}
