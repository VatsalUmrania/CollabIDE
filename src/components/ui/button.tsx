import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: 
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md active:scale-95',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-md active:scale-95',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow active:scale-95',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow active:scale-95',
        ghost: 
          'hover:bg-accent hover:text-accent-foreground active:scale-95',
        link: 
          'text-primary underline-offset-4 hover:underline',
        // New variants for CollabIDE
        success:
          'bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md active:scale-95',
        warning:
          'bg-yellow-600 text-white hover:bg-yellow-700 shadow-sm hover:shadow-md active:scale-95',
        info:
          'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md active:scale-95',
        gradient:
          'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl active:scale-95',
        'gradient-success':
          'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl active:scale-95',
        'gradient-warning':
          'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl active:scale-95',
        'gradient-info':
          'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl active:scale-95',
        // Social variants
        google:
          'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow active:scale-95',
        github:
          'bg-gray-900 text-white hover:bg-gray-800 shadow-sm hover:shadow-md active:scale-95',
        // Status-specific variants
        loading:
          'bg-primary/80 text-primary-foreground cursor-wait',
        disabled:
          'bg-muted text-muted-foreground cursor-not-allowed',
      },
      size: {
        xs: 'h-7 px-2 text-xs rounded-sm',
        sm: 'h-9 px-3 text-sm rounded-md',
        default: 'h-10 px-4 py-2',
        lg: 'h-11 px-8 text-base rounded-lg',
        xl: 'h-12 px-10 text-lg rounded-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
      shape: {
        default: '',
        rounded: 'rounded-full',
        square: 'rounded-none',
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
    children,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : 'button'
    
    const isDisabled = disabled || loading

    return (
      <Comp
        className={cn(
          buttonVariants({ variant: loading ? 'loading' : variant, size, shape }),
          fullWidth && 'w-full',
          className
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText || 'Loading...'}
          </>
        ) : (
          <>
            {leftIcon && (
              <span className="mr-2 flex items-center">
                {leftIcon}
              </span>
            )}
            {children}
            {rightIcon && (
              <span className="ml-2 flex items-center">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

// Specialized button components for common use cases
const IconButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'size'> & {
  size?: 'sm' | 'default' | 'lg'
  icon: React.ReactNode
  'aria-label': string
}>(({ size = 'default', icon, className, ...props }, ref) => {
  const iconSize = size === 'sm' ? 'icon-sm' : size === 'lg' ? 'icon-lg' : 'icon'
  
  return (
    <Button
      ref={ref}
      size={iconSize as any}
      className={cn('flex-shrink-0', className)}
      {...props}
    >
      {icon}
    </Button>
  )
})
IconButton.displayName = 'IconButton'

const LoadingButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ loading = true, ...props }, ref) => (
    <Button ref={ref} loading={loading} {...props} />
  )
)
LoadingButton.displayName = 'LoadingButton'

const ConfirmButton = React.forwardRef<HTMLButtonElement, ButtonProps & {
  confirmText?: string
  onConfirm?: () => void
}>(({ confirmText = 'Are you sure?', onConfirm, onClick, children, ...props }, ref) => {
  const [showConfirm, setShowConfirm] = React.useState(false)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (showConfirm) {
      onConfirm?.()
      setShowConfirm(false)
    } else {
      setShowConfirm(true)
      // Reset after 3 seconds
      setTimeout(() => setShowConfirm(false), 3000)
    }
    onClick?.(e)
  }

  return (
    <Button
      ref={ref}
      onClick={handleClick}
      variant={showConfirm ? 'destructive' : props.variant}
      {...props}
    >
      {showConfirm ? confirmText : children}
    </Button>
  )
})
ConfirmButton.displayName = 'ConfirmButton'

export { Button, IconButton, LoadingButton, ConfirmButton, buttonVariants }
