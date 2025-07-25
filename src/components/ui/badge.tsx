import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { X, Dot } from 'lucide-react'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80 shadow-sm',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 shadow-sm',
        success:
          'border-transparent bg-green-500 text-white hover:bg-green-600 shadow-sm',
        warning:
          'border-transparent bg-yellow-500 text-white hover:bg-yellow-600 shadow-sm',
        info:
          'border-transparent bg-blue-500 text-white hover:bg-blue-600 shadow-sm',
        outline: 
          'text-foreground border-border hover:bg-accent hover:text-accent-foreground',
        ghost:
          'border-transparent hover:bg-accent hover:text-accent-foreground',
        // Status variants for CollabIDE
        online:
          'border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        offline:
          'border-transparent bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
        syncing:
          'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 animate-pulse',
        error:
          'border-transparent bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        // Role variants
        host:
          'border-transparent bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 border-amber-200',
        collaborator:
          'border-transparent bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
        // File type variants
        javascript:
          'border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        python:
          'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        html:
          'border-transparent bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
        css:
          'border-transparent bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        default: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
        xl: 'px-4 py-1.5 text-sm',
      },
      shape: {
        default: 'rounded-full',
        rounded: 'rounded-md',
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

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dismissible?: boolean
  onDismiss?: () => void
  icon?: React.ReactNode
  dot?: boolean
  animated?: boolean
  pulse?: boolean
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ 
    className, 
    variant, 
    size, 
    shape,
    dismissible = false,
    onDismiss,
    icon,
    dot = false,
    animated = false,
    pulse = false,
    children,
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true)

    const handleDismiss = (e: React.MouseEvent) => {
      e.stopPropagation()
      setIsVisible(false)
      onDismiss?.()
    }

    if (!isVisible) return null

    return (
      <div 
        ref={ref}
        className={cn(
          badgeVariants({ variant, size, shape }), 
          animated && 'animate-bounce',
          pulse && 'animate-pulse',
          className
        )} 
        {...props}
      >
        {dot && (
          <Dot className="w-3 h-3 -ml-1 mr-1" />
        )}
        {icon && (
          <span className="mr-1 flex items-center">
            {icon}
          </span>
        )}
        {children}
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="ml-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 p-0.5 transition-colors"
            aria-label="Remove badge"
            type="button"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    )
  }
)
Badge.displayName = 'Badge'

// Specialized badge components for common use cases
const StatusBadge = React.forwardRef<HTMLDivElement, Omit<BadgeProps, 'variant'> & {
  status: 'online' | 'offline' | 'syncing' | 'error'
}>(({ status, dot = true, ...props }, ref) => (
  <Badge 
    ref={ref}
    variant={status} 
    dot={dot}
    pulse={status === 'syncing'}
    {...props} 
  />
))
StatusBadge.displayName = 'StatusBadge'

const RoleBadge = React.forwardRef<HTMLDivElement, Omit<BadgeProps, 'variant' | 'icon'> & {
  role: 'host' | 'collaborator'
}>(({ role, children, ...props }, ref) => (
  <Badge 
    ref={ref}
    variant={role}
    icon={role === 'host' ? <span className="text-xs">👑</span> : undefined}
    {...props}
  >
    {children || (role === 'host' ? 'Host' : 'Collaborator')}
  </Badge>
))
RoleBadge.displayName = 'RoleBadge'

const LanguageBadge = React.forwardRef<HTMLDivElement, Omit<BadgeProps, 'variant'> & {
  language: 'javascript' | 'python' | 'html' | 'css' | string
}>(({ language, children, ...props }, ref) => {
  const getLanguageEmoji = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'javascript': return '🟨'
      case 'python': return '🐍'
      case 'html': return '🌐'
      case 'css': return '🎨'
      case 'typescript': return '🔷'
      case 'cpp': case 'c++': return '🔵'
      default: return '📄'
    }
  }

  return (
    <Badge 
      ref={ref}
      variant={language as any}
      icon={<span className="text-xs">{getLanguageEmoji(language)}</span>}
      {...props}
    >
      {children || language.toUpperCase()}
    </Badge>
  )
})
LanguageBadge.displayName = 'LanguageBadge'

export { Badge, StatusBadge, RoleBadge, LanguageBadge, badgeVariants }
