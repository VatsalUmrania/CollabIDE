import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 shadow-sm transition-all duration-200 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground border-border',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive bg-destructive/5 [&>svg]:text-destructive',
        success:
          'border-green-500/50 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/50 [&>svg]:text-green-600 dark:[&>svg]:text-green-400',
        warning:
          'border-yellow-500/50 text-yellow-800 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-950/50 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400',
        info:
          'border-blue-500/50 text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400',
      },
      size: {
        default: 'p-4',
        sm: 'p-3 text-sm',
        lg: 'p-6 text-base',
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
        className={cn(alertVariants({ variant, size }), className)}
        {...props}
      >
        {getDefaultIcon()}
        <div className="flex-1">
          {children}
        </div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
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
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
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
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
))
AlertDescription.displayName = 'AlertDescription'

// Additional helper components for common use cases
const AlertActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-2 mt-3', className)}
    {...props}
  />
))
AlertActions.displayName = 'AlertActions'

export { Alert, AlertTitle, AlertDescription, AlertActions, type AlertProps }
