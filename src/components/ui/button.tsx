import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2, Check, X, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 backdrop-blur-sm',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 backdrop-blur-sm',
        outline:
          'border border-border bg-background/80 hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md hover:scale-105 active:scale-95 backdrop-blur-sm',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 backdrop-blur-sm',
        ghost: 
          'hover:bg-accent/50 hover:text-accent-foreground hover:scale-105 active:scale-95 backdrop-blur-sm',
        link: 
          'text-primary underline-offset-4 hover:underline hover:text-primary/80',
        
        // Enhanced theme-aware variants for CollabIDE
        success:
          'bg-success text-success-foreground hover:bg-success/90 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 backdrop-blur-sm',
        warning:
          'bg-warning text-warning-foreground hover:bg-warning/90 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 backdrop-blur-sm',
        info:
          'bg-info text-info-foreground hover:bg-info/90 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 backdrop-blur-sm',
        
        // Enhanced gradient variants using theme colors
        gradient:
          'bg-gradient-to-r from-primary via-accent-purple to-accent-blue text-white hover:from-primary/90 hover:via-accent-purple/90 hover:to-accent-blue/90 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 backdrop-blur-sm',
        'gradient-success':
          'bg-gradient-to-r from-success to-accent-emerald text-white hover:from-success/90 hover:to-accent-emerald/90 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 backdrop-blur-sm',
        'gradient-warning':
          'bg-gradient-to-r from-warning to-accent-orange text-white hover:from-warning/90 hover:to-accent-orange/90 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 backdrop-blur-sm',
        'gradient-info':
          'bg-gradient-to-r from-info to-accent-cyan text-white hover:from-info/90 hover:to-accent-cyan/90 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 backdrop-blur-sm',
        
        // Glass morphism variants
        glass:
          'glass-effect border border-border/30 text-foreground hover:bg-card/60 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95',
        'glass-primary':
          'glass-effect border border-primary/30 text-primary hover:bg-primary/10 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95',
        
        // Social variants with proper theming
        google:
          'bg-card border border-border text-foreground hover:bg-accent shadow-sm hover:shadow-md hover:scale-105 active:scale-95 backdrop-blur-sm',
        github:
          'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 backdrop-blur-sm',
        discord:
          'bg-[#5865F2] text-white hover:bg-[#4752C4] shadow-md hover:shadow-lg hover:scale-105 active:scale-95 backdrop-blur-sm',
        
        // Status-specific variants
        loading:
          'bg-primary/60 text-primary-foreground cursor-wait backdrop-blur-sm animate-pulse-subtle',
        disabled:
          'bg-muted text-muted-foreground cursor-not-allowed backdrop-blur-sm',
        
        // Collaboration-specific variants
        'join-session':
          'bg-gradient-to-r from-accent-emerald to-success text-white hover:from-accent-emerald/90 hover:to-success/90 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 backdrop-blur-sm animate-glow',
        'create-session':
          'bg-gradient-to-r from-primary to-accent-blue text-white hover:from-primary/90 hover:to-accent-blue/90 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 backdrop-blur-sm',
        'leave-session':
          'bg-gradient-to-r from-destructive to-accent-pink text-white hover:from-destructive/90 hover:to-accent-pink/90 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 backdrop-blur-sm',
      },
      size: {
        xs: 'h-7 px-2.5 text-xs rounded-md',
        sm: 'h-8 px-3 text-xs rounded-md',
        default: 'h-10 px-4 py-2 text-sm',
        lg: 'h-12 px-6 text-base rounded-xl',
        xl: 'h-14 px-8 text-lg rounded-xl',
        '2xl': 'h-16 px-10 text-xl rounded-2xl',
        icon: 'h-10 w-10 p-0',
        'icon-xs': 'h-6 w-6 p-0 rounded-md',
        'icon-sm': 'h-8 w-8 p-0 rounded-md',
        'icon-lg': 'h-12 w-12 p-0 rounded-xl',
        'icon-xl': 'h-14 w-14 p-0 rounded-xl',
      },
      shape: {
        default: '',
        rounded: 'rounded-full',
        square: 'rounded-none',
        pill: 'rounded-full px-6',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      shape: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  tooltip?: string
  pulse?: boolean
  glow?: boolean
  shimmer?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    shape,
    asChild = false, 
    loading = false,
    loadingText,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    pulse = false,
    glow = false,
    shimmer = false,
    children,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading
    const [isPressed, setIsPressed] = React.useState(false)

    const handleMouseDown = () => setIsPressed(true)
    const handleMouseUp = () => setIsPressed(false)
    const handleMouseLeave = () => setIsPressed(false)

    // Fix for React.Children.only error - create single child element
    const buttonContent = (
      <div className="flex items-center justify-center gap-2">
        {shimmer && (
          <div className="absolute inset-0 -top-1/2 aspect-square w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-sm animate-button-shimmer" />
        )}
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{loadingText || 'Loading...'}</span>
          </>
        ) : (
          <>
            {leftIcon && (
              <span className="flex items-center justify-center">
                {React.isValidElement(leftIcon) 
                  ? React.cloneElement(leftIcon as React.ReactElement, { 
                      className: cn('h-4 w-4', (leftIcon as any).props?.className) 
                    })
                  : leftIcon
                }
              </span>
            )}
            <span className="truncate">{children}</span>
            {rightIcon && (
              <span className="flex items-center justify-center">
                {React.isValidElement(rightIcon) 
                  ? React.cloneElement(rightIcon as React.ReactElement, { 
                      className: cn('h-4 w-4', (rightIcon as any).props?.className) 
                    })
                  : rightIcon
                }
              </span>
            )}
          </>
        )}
      </div>
    )

    const buttonProps = {
      className: cn(
        buttonVariants({ variant: loading ? 'loading' : variant, size, shape }),
        fullWidth && 'w-full',
        pulse && 'animate-pulse-subtle',
        glow && 'animate-glow',
        shimmer && 'button-shimmer',
        isPressed && 'scale-95',
        className
      ),
      ref,
      disabled: isDisabled,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      ...props
    }

    if (asChild) {
      return (
        <Slot {...buttonProps}>
          {buttonContent}
        </Slot>
      )
    }

    return (
      <button {...buttonProps}>
        {buttonContent}
      </button>
    )
  }
)
Button.displayName = 'Button'

// Enhanced specialized button components
const IconButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'size'> & {
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl'
  icon: React.ReactNode
  'aria-label': string
}>(({ size = 'default', icon, className, variant = 'ghost', ...props }, ref) => {
  const iconSizeMap = {
    xs: 'icon-xs',
    sm: 'icon-sm', 
    default: 'icon',
    lg: 'icon-lg',
    xl: 'icon-xl'
  }
  
  return (
    <Button
      ref={ref}
      size={iconSizeMap[size] as any}
      variant={variant}
      className={cn('flex-shrink-0', className)}
      {...props}
    >
      {React.isValidElement(icon) 
        ? React.cloneElement(icon as React.ReactElement, { 
            className: cn('h-4 w-4', (icon as any).props?.className) 
          })
        : icon
      }
    </Button>
  )
})
IconButton.displayName = 'IconButton'

const LoadingButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ loading = true, children, ...props }, ref) => (
    <Button ref={ref} loading={loading} {...props}>
      {children}
    </Button>
  )
)
LoadingButton.displayName = 'LoadingButton'

const ConfirmButton = React.forwardRef<HTMLButtonElement, ButtonProps & {
  confirmText?: string
  onConfirm?: () => void
  confirmVariant?: ButtonProps['variant']
  confirmDelay?: number
}>(({ 
  confirmText = 'Are you sure?', 
  onConfirm, 
  onClick, 
  children, 
  confirmVariant = 'destructive',
  confirmDelay = 3000,
  ...props 
}, ref) => {
  const [showConfirm, setShowConfirm] = React.useState(false)
  const [countdown, setCountdown] = React.useState(0)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (showConfirm) {
      onConfirm?.()
      setShowConfirm(false)
      setCountdown(0)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    } else {
      setShowConfirm(true)
      setCountdown(confirmDelay / 1000)
      
      // Countdown effect
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      // Reset after delay
      timeoutRef.current = setTimeout(() => {
        setShowConfirm(false)
        setCountdown(0)
        clearInterval(countdownInterval)
      }, confirmDelay)
    }
    onClick?.(e)
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <Button
      ref={ref}
      onClick={handleClick}
      variant={showConfirm ? confirmVariant : props.variant}
      className={cn(showConfirm && 'animate-pulse-subtle', props.className)}
      leftIcon={showConfirm ? <AlertCircle className="h-4 w-4" /> : props.leftIcon}
      {...props}
    >
      {showConfirm ? (
        <span>
          {confirmText}
          {countdown > 0 && (
            <span className="ml-1 text-xs opacity-70">({countdown}s)</span>
          )}
        </span>
      ) : (
        children
      )}
    </Button>
  )
})
ConfirmButton.displayName = 'ConfirmButton'

// New CollabIDE-specific button components
const JoinSessionButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  ({ children = 'Join Session', ...props }, ref) => (
    <Button
      ref={ref}
      variant="join-session"
      leftIcon={<Check className="h-4 w-4" />}
      glow
      {...props}
    >
      {children}
    </Button>
  )
)
JoinSessionButton.displayName = 'JoinSessionButton'

const CreateSessionButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  ({ children = 'Create Session', ...props }, ref) => (
    <Button
      ref={ref}
      variant="create-session"
      shimmer
      {...props}
    >
      {children}
    </Button>
  )
)
CreateSessionButton.displayName = 'CreateSessionButton'

const LeaveSessionButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  ({ children = 'Leave Session', ...props }, ref) => (
    <ConfirmButton
      ref={ref}
      variant="leave-session"
      confirmText="Really leave?"
      leftIcon={<X className="h-4 w-4" />}
      {...props}
    >
      {children}
    </ConfirmButton>
  )
)
LeaveSessionButton.displayName = 'LeaveSessionButton'

export { 
  Button, 
  IconButton, 
  LoadingButton, 
  ConfirmButton,
  JoinSessionButton,
  CreateSessionButton,
  LeaveSessionButton,
  buttonVariants 
}
