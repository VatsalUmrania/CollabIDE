import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 transition-colors [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        default: 
          'bg-gray-800 text-white border-gray-700',
        destructive:
          'bg-red-900/20 text-red-200 border-red-800/50 [&>svg]:text-red-400',
        success:
          'bg-green-900/20 text-green-200 border-green-800/50 [&>svg]:text-green-400',
        warning:
          'bg-yellow-900/20 text-yellow-200 border-yellow-800/50 [&>svg]:text-yellow-400',
        info:
          'bg-blue-900/20 text-blue-200 border-blue-800/50 [&>svg]:text-blue-400',
      },
      size: {
        default: 'p-4 text-sm',
        sm: 'p-3 text-xs',
        lg: 'p-5 text-base',
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
    children,
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true)

    const handleDismiss = () => {
      setIsVisible(false)
      onDismiss?.()
    }

    const getDefaultIcon = () => {
      if (icon !== undefined) return icon
      if (!showDefaultIcon) return null

      switch (variant) {
        case 'destructive':
          return <AlertCircle className="h-4 w-4" />
        case 'success':
          return <CheckCircle className="h-4 w-4" />
        case 'warning':
          return <AlertTriangle className="h-4 w-4" />
        case 'info':
          return <Info className="h-4 w-4" />
        default:
          return <Info className="h-4 w-4" />
      }
    }

    if (!isVisible) return null

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          alertVariants({ variant, size }),
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
            className="absolute top-3 right-3 rounded p-1 text-current opacity-70 hover:opacity-100 hover:bg-white/10 transition-all"
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
      'mb-2 font-semibold leading-none tracking-tight',
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
      'text-sm leading-relaxed [&_p]:leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0',
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
      'flex items-center gap-2 mt-3 pt-3 border-t border-current/20',
      className
    )}
    {...props}
  />
))
AlertActions.displayName = 'AlertActions'

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

// Predefined alert variants
const SuccessAlert = React.forwardRef<
  HTMLDivElement,
  Omit<AlertProps, 'variant'>
>(({ children, ...props }, ref) => (
  <Alert ref={ref} variant="success" {...props}>
    {children}
  </Alert>
))
SuccessAlert.displayName = 'SuccessAlert'

const ErrorAlert = React.forwardRef<
  HTMLDivElement,
  Omit<AlertProps, 'variant'>
>(({ children, ...props }, ref) => (
  <Alert ref={ref} variant="destructive" {...props}>
    {children}
  </Alert>
))
ErrorAlert.displayName = 'ErrorAlert'

const WarningAlert = React.forwardRef<
  HTMLDivElement,
  Omit<AlertProps, 'variant'>
>(({ children, ...props }, ref) => (
  <Alert ref={ref} variant="warning" {...props}>
    {children}
  </Alert>
))
WarningAlert.displayName = 'WarningAlert'

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
