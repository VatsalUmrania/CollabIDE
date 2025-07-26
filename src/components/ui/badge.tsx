import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { X, Dot, Crown, User, Code, Zap, Shield, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-default select-none',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90 backdrop-blur-sm',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md shadow-destructive/20',
        success:
          'border-transparent bg-success text-success-foreground hover:bg-success/90 shadow-md shadow-success/20',
        warning:
          'border-transparent bg-warning text-warning-foreground hover:bg-warning/90 shadow-md shadow-warning/20',
        info:
          'border-transparent bg-info text-info-foreground hover:bg-info/90 shadow-md shadow-info/20',
        outline: 
          'text-foreground border-border/50 hover:bg-accent hover:text-accent-foreground backdrop-blur-sm',
        ghost:
          'border-transparent hover:bg-accent/50 hover:text-accent-foreground backdrop-blur-sm',
        gradient:
          'border-transparent bg-gradient-to-r from-primary via-accent-purple to-accent-blue text-white hover:from-primary/90 hover:via-accent-purple/90 hover:to-accent-blue/90 shadow-lg',
        
        // Enhanced status variants for CollabIDE
        online:
          'border-success/30 bg-success/10 text-success-foreground backdrop-blur-sm shadow-sm shadow-success/10',
        offline:
          'border-muted-foreground/30 bg-muted/50 text-muted-foreground backdrop-blur-sm',
        syncing:
          'border-info/30 bg-info/10 text-info-foreground backdrop-blur-sm shadow-sm shadow-info/10 animate-pulse-subtle',
        error:
          'border-destructive/30 bg-destructive/10 text-destructive-foreground backdrop-blur-sm shadow-sm shadow-destructive/10',
        
        // Enhanced role variants
        host:
          'border-warning/30 bg-gradient-to-r from-warning/20 to-accent-orange/20 text-warning-foreground backdrop-blur-sm shadow-md border-warning/40',
        collaborator:
          'border-accent-purple/30 bg-accent-purple/10 text-accent-purple backdrop-blur-sm shadow-sm shadow-accent-purple/10',
        viewer:
          'border-muted-foreground/30 bg-muted/30 text-muted-foreground backdrop-blur-sm',
        
        // Enhanced file type variants
        javascript:
          'border-accent-yellow/30 bg-accent-yellow/10 text-accent-yellow backdrop-blur-sm shadow-sm',
        typescript:
          'border-accent-blue/30 bg-accent-blue/10 text-accent-blue backdrop-blur-sm shadow-sm',
        python:
          'border-accent-blue/30 bg-accent-blue/10 text-accent-blue backdrop-blur-sm shadow-sm',
        html:
          'border-accent-orange/30 bg-accent-orange/10 text-accent-orange backdrop-blur-sm shadow-sm',
        css:
          'border-accent-indigo/30 bg-accent-indigo/10 text-accent-indigo backdrop-blur-sm shadow-sm',
        react:
          'border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan backdrop-blur-sm shadow-sm',
        vue:
          'border-accent-emerald/30 bg-accent-emerald/10 text-accent-emerald backdrop-blur-sm shadow-sm',
        cpp:
          'border-accent-purple/30 bg-accent-purple/10 text-accent-purple backdrop-blur-sm shadow-sm',
        
        // Activity status variants
        active:
          'border-success/30 bg-success/10 text-success-foreground backdrop-blur-sm animate-glow',
        idle:
          'border-warning/30 bg-warning/10 text-warning-foreground backdrop-blur-sm',
        away:
          'border-muted-foreground/30 bg-muted/30 text-muted-foreground backdrop-blur-sm',
        
        // Permission variants
        admin:
          'border-destructive/30 bg-gradient-to-r from-destructive/20 to-accent-pink/20 text-destructive-foreground backdrop-blur-sm shadow-md',
        moderator:
          'border-primary/30 bg-primary/10 text-primary-foreground backdrop-blur-sm shadow-sm',
        member:
          'border-accent/30 bg-accent/50 text-accent-foreground backdrop-blur-sm',
      },
      size: {
        xs: 'px-1.5 py-0.5 text-xs h-5',
        sm: 'px-2 py-0.5 text-xs h-6',
        default: 'px-2.5 py-1 text-xs h-7',
        lg: 'px-3 py-1.5 text-sm h-8',
        xl: 'px-4 py-2 text-sm h-10',
      },
      shape: {
        default: 'rounded-full',
        rounded: 'rounded-lg',
        square: 'rounded-none',
        pill: 'rounded-full px-4',
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
  glow?: boolean
  interactive?: boolean
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
    glow = false,
    interactive = false,
    children,
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true)
    const [isExiting, setIsExiting] = React.useState(false)

    const handleDismiss = (e: React.MouseEvent) => {
      e.stopPropagation()
      setIsExiting(true)
      setTimeout(() => {
        setIsVisible(false)
        onDismiss?.()
      }, 200)
    }

    if (!isVisible) return null

    return (
      <div 
        ref={ref}
        className={cn(
          badgeVariants({ variant, size, shape }), 
          animated && 'animate-bounce-in',
          pulse && 'animate-pulse-subtle',
          glow && 'animate-glow',
          interactive && 'cursor-pointer hover:scale-105 active:scale-95',
          isExiting && 'animate-scale-out',
          dismissible && 'pr-1',
          className
        )} 
        {...props}
      >
        {dot && (
          <div className="w-2 h-2 rounded-full bg-current opacity-70 mr-1.5 -ml-0.5" />
        )}
        {icon && (
          <span className="mr-1.5 flex items-center justify-center">
            {React.isValidElement(icon) 
              ? React.cloneElement(icon as React.ReactElement, { className: 'w-3 h-3' })
              : icon
            }
          </span>
        )}
        <span className="truncate">{children}</span>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="ml-1.5 -mr-0.5 rounded-full hover:bg-current/20 p-0.5 transition-all duration-200 flex items-center justify-center"
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

// Enhanced specialized badge components
const StatusBadge = React.forwardRef<HTMLDivElement, Omit<BadgeProps, 'variant'> & {
  status: 'online' | 'offline' | 'syncing' | 'error' | 'active' | 'idle' | 'away'
}>(({ status, dot = true, pulse, ...props }, ref) => (
  <Badge 
    ref={ref}
    variant={status} 
    dot={dot}
    pulse={pulse ?? status === 'syncing'}
    glow={status === 'active'}
    {...props} 
  />
))
StatusBadge.displayName = 'StatusBadge'

const RoleBadge = React.forwardRef<HTMLDivElement, Omit<BadgeProps, 'variant' | 'icon'> & {
  role: 'host' | 'collaborator' | 'viewer' | 'admin' | 'moderator' | 'member'
}>(({ role, children, size = 'sm', ...props }, ref) => {
  const getRoleIcon = (roleType: string) => {
    switch (roleType) {
      case 'host': return <Crown className="w-3 h-3" />
      case 'admin': return <Shield className="w-3 h-3" />
      case 'moderator': return <Zap className="w-3 h-3" />
      case 'collaborator': return <User className="w-3 h-3" />
      default: return <User className="w-3 h-3" />
    }
  }

  const getRoleLabel = (roleType: string) => {
    switch (roleType) {
      case 'host': return 'Host'
      case 'admin': return 'Admin'
      case 'moderator': return 'Mod'
      case 'collaborator': return 'Collaborator'
      case 'viewer': return 'Viewer'
      case 'member': return 'Member'
      default: return roleType
    }
  }

  return (
    <Badge 
      ref={ref}
      variant={role}
      icon={getRoleIcon(role)}
      size={size}
      {...props}
    >
      {children || getRoleLabel(role)}
    </Badge>
  )
})
RoleBadge.displayName = 'RoleBadge'

const LanguageBadge = React.forwardRef<HTMLDivElement, Omit<BadgeProps, 'variant'> & {
  language: 'javascript' | 'typescript' | 'python' | 'html' | 'css' | 'react' | 'vue' | 'cpp' | string
}>(({ language, children, size = 'sm', ...props }, ref) => {
  const getLanguageIcon = (lang: string) => {
    const langLower = lang.toLowerCase()
    switch (langLower) {
      case 'javascript':
      case 'js':
        return <span className="text-xs font-bold">JS</span>
      case 'typescript':
      case 'ts':
        return <span className="text-xs font-bold">TS</span>
      case 'python':
      case 'py':
        return <span className="text-xs">🐍</span>
      case 'html':
        return <Globe className="w-3 h-3" />
      case 'css':
        return <span className="text-xs">🎨</span>
      case 'react':
        return <span className="text-xs">⚛️</span>
      case 'vue':
        return <span className="text-xs">💚</span>
      case 'cpp':
      case 'c++':
        return <span className="text-xs font-bold">C++</span>
      default:
        return <Code className="w-3 h-3" />
    }
  }

  const getLanguageVariant = (lang: string): any => {
    const langLower = lang.toLowerCase()
    const variantMap: Record<string, string> = {
      'javascript': 'javascript',
      'js': 'javascript',
      'typescript': 'typescript',
      'ts': 'typescript',
      'python': 'python',
      'py': 'python',
      'html': 'html',
      'css': 'css',
      'react': 'react',
      'vue': 'vue',
      'cpp': 'cpp',
      'c++': 'cpp',
    }
    return variantMap[langLower] || 'secondary'
  }

  return (
    <Badge 
      ref={ref}
      variant={getLanguageVariant(language)}
      icon={getLanguageIcon(language)}
      size={size}
      {...props}
    >
      {children || language.toUpperCase()}
    </Badge>
  )
})
LanguageBadge.displayName = 'LanguageBadge'

// New specialized components for CollabIDE
const CollaboratorBadge = React.forwardRef<HTMLDivElement, Omit<BadgeProps, 'variant'> & {
  name: string
  status?: 'online' | 'offline' | 'away'
  color?: string
}>(({ name, status = 'online', color, children, ...props }, ref) => {
  const getStatusDot = () => {
    const colors = {
      online: 'bg-success',
      offline: 'bg-muted-foreground',
      away: 'bg-warning'
    }
    return (
      <div className={`w-2 h-2 rounded-full ${colors[status]} mr-1.5 -ml-0.5`} />
    )
  }

  return (
    <Badge 
      ref={ref}
      variant="collaborator"
      size="sm"
      style={color ? { 
        backgroundColor: `${color}20`, 
        borderColor: `${color}40`,
        color: color 
      } : undefined}
      {...props}
    >
      {getStatusDot()}
      {children || name}
    </Badge>
  )
})
CollaboratorBadge.displayName = 'CollaboratorBadge'

const ActivityBadge = React.forwardRef<HTMLDivElement, Omit<BadgeProps, 'variant'> & {
  activity: 'editing' | 'viewing' | 'debugging' | 'chatting'
}>(({ activity, children, ...props }, ref) => {
  const getActivityConfig = (activityType: string) => {
    switch (activityType) {
      case 'editing':
        return { variant: 'active' as const, icon: <Code className="w-3 h-3" />, label: 'Editing' }
      case 'viewing':
        return { variant: 'idle' as const, icon: <Globe className="w-3 h-3" />, label: 'Viewing' }
      case 'debugging':
        return { variant: 'warning' as const, icon: <Zap className="w-3 h-3" />, label: 'Debugging' }
      case 'chatting':
        return { variant: 'info' as const, icon: <span className="text-xs">💬</span>, label: 'Chatting' }
      default:
        return { variant: 'secondary' as const, icon: <User className="w-3 h-3" />, label: activityType }
    }
  }

  const config = getActivityConfig(activity)

  return (
    <Badge 
      ref={ref}
      variant={config.variant}
      icon={config.icon}
      size="xs"
      pulse={activity === 'editing'}
      {...props}
    >
      {children || config.label}
    </Badge>
  )
})
ActivityBadge.displayName = 'ActivityBadge'

export { 
  Badge, 
  StatusBadge, 
  RoleBadge, 
  LanguageBadge, 
  CollaboratorBadge,
  ActivityBadge,
  badgeVariants 
}
