"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { Info, AlertCircle, CheckCircle, HelpCircle, Crown, Users, Code, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const labelVariants = cva(
  "leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-all duration-300 select-none",
  {
    variants: {
      variant: {
        default: "text-foreground font-medium",
        muted: "text-muted-foreground font-normal hover:text-foreground/80",
        destructive: "text-destructive font-medium",
        success: "text-success-foreground font-medium",
        warning: "text-warning-foreground font-medium", 
        info: "text-info-foreground font-medium",
        accent: "text-primary font-medium",
        ghost: "text-muted-foreground font-normal hover:text-foreground transition-colors duration-200",
        gradient: "gradient-text font-semibold",
        // CollabIDE-specific variants
        collaboration: "text-accent-purple font-medium",
        session: "text-accent-blue font-medium",
        editor: "text-accent-cyan font-medium font-mono",
        host: "text-accent-orange font-semibold",
        premium: "gradient-text font-bold",
      },
      size: {
        xs: "text-xs",
        sm: "text-sm",
        default: "text-sm",
        lg: "text-base",
        xl: "text-lg",
        "2xl": "text-xl",
        "3xl": "text-2xl",
      },
      weight: {
        light: "font-light",
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
        extrabold: "font-extrabold",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      weight: "medium",
    },
  }
)

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  required?: boolean
  optional?: boolean
  tooltip?: string
  description?: string
  error?: boolean
  animated?: boolean
  glow?: boolean
  icon?: React.ReactNode
  badge?: string
  interactive?: boolean
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ 
  className, 
  variant, 
  size, 
  weight,
  required = false,
  optional = false,
  tooltip,
  description,
  error = false,
  animated = false,
  glow = false,
  icon,
  badge,
  interactive = false,
  children,
  ...props 
}, ref) => {
  const [isHovered, setIsHovered] = React.useState(false)
  const currentVariant = error ? 'destructive' : variant

  return (
    <div className="space-y-1.5">
      <LabelPrimitive.Root
        ref={ref}
        className={cn(
          labelVariants({ variant: currentVariant, size, weight }),
          interactive && "cursor-pointer hover:scale-105 active:scale-95",
          glow && "animate-glow",
          animated && "animate-fade-in",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        <span className="flex items-center gap-2 relative">
          {/* Icon */}
          {icon && (
            <span className={cn(
              "flex items-center justify-center transition-all duration-200",
              interactive && isHovered && "scale-110"
            )}>
              {React.isValidElement(icon) 
                ? React.cloneElement(icon as React.ReactElement, { 
                    className: cn('h-4 w-4', (icon as any).props?.className) 
                  })
                : icon
              }
            </span>
          )}

          {/* Main label text */}
          <span className="flex items-center gap-1">
            {children}
            
            {/* Required indicator */}
            {required && (
              <span 
                className="text-destructive ml-1 animate-pulse-subtle" 
                aria-label="required field"
                title="This field is required"
              >
                *
              </span>
            )}
            
            {/* Optional indicator */}
            {optional && (
              <span className="text-muted-foreground text-xs font-normal ml-1 opacity-70">
                (optional)
              </span>
            )}
            
            {/* Tooltip */}
            {tooltip && (
              <span 
                className={cn(
                  "text-muted-foreground hover:text-primary cursor-help ml-1 transition-all duration-200",
                  isHovered && "scale-110"
                )}
                title={tooltip}
                aria-label="More information"
              >
                <HelpCircle className="h-3 w-3" />
              </span>
            )}
          </span>

          {/* Badge */}
          {badge && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 animate-scale-in">
              {badge}
            </span>
          )}
        </span>
      </LabelPrimitive.Root>
      
      {/* Description */}
      {description && (
        <div className="flex items-start gap-1">
          {error && <AlertCircle className="h-3 w-3 text-destructive mt-0.5 flex-shrink-0" />}
          <p className={cn(
            "text-xs leading-relaxed transition-colors duration-200",
            error ? "text-destructive/90 animate-slide-down" : "text-muted-foreground"
          )}>
            {description}
          </p>
        </div>
      )}
    </div>
  )
})
Label.displayName = LabelPrimitive.Root.displayName

// Enhanced specialized label components
const FieldLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps & {
    htmlFor: string
    error?: string
    helperText?: string
    showIcon?: boolean
  }
>(({ error, helperText, showIcon = true, children, ...props }, ref) => {
  const getStatusIcon = () => {
    if (!showIcon) return undefined
    if (error) return <AlertCircle className="h-4 w-4" />
    return undefined
  }

  return (
    <Label
      ref={ref}
      error={!!error}
      description={error || helperText}
      icon={getStatusIcon()}
      animated
      {...props}
    >
      {children}
    </Label>
  )
})
FieldLabel.displayName = 'FieldLabel'

const SectionLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ size = "lg", weight = "semibold", variant = "default", ...props }, ref) => (
  <Label
    ref={ref}
    size={size}
    weight={weight}
    variant={variant}
    animated
    {...props}
  />
))
SectionLabel.displayName = 'SectionLabel'

const InlineLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ variant = "muted", size = "sm", weight = "normal", ...props }, ref) => (
  <Label
    ref={ref}
    variant={variant}
    size={size}
    weight={weight}
    {...props}
  />
))
InlineLabel.displayName = 'InlineLabel'

const StatusLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps & {
    status: 'online' | 'offline' | 'syncing' | 'error' | 'success' | 'warning' | 'idle' | 'connecting'
    showDot?: boolean
    pulse?: boolean
  }
>(({ status, showDot = true, pulse = false, children, ...props }, ref) => {
  const statusConfig = {
    online: { 
      variant: 'success' as const, 
      dotClass: 'bg-success animate-pulse-subtle', 
      icon: <CheckCircle className="h-3 w-3" /> 
    },
    offline: { 
      variant: 'muted' as const, 
      dotClass: 'bg-muted-foreground', 
      icon: null 
    },
    syncing: { 
      variant: 'info' as const, 
      dotClass: 'bg-info animate-pulse', 
      icon: <Zap className="h-3 w-3 animate-pulse" /> 
    },
    connecting: { 
      variant: 'info' as const, 
      dotClass: 'bg-info animate-ping', 
      icon: <Zap className="h-3 w-3 animate-spin" /> 
    },
    idle: { 
      variant: 'warning' as const, 
      dotClass: 'bg-warning', 
      icon: null 
    },
    error: { 
      variant: 'destructive' as const, 
      dotClass: 'bg-destructive animate-pulse-subtle', 
      icon: <AlertCircle className="h-3 w-3" /> 
    },
    success: { 
      variant: 'success' as const, 
      dotClass: 'bg-success', 
      icon: <CheckCircle className="h-3 w-3" /> 
    },
    warning: { 
      variant: 'warning' as const, 
      dotClass: 'bg-warning', 
      icon: <AlertCircle className="h-3 w-3" /> 
    },
  }

  const config = statusConfig[status]

  return (
    <Label
      ref={ref}
      variant={config.variant}
      animated
      glow={pulse}
      {...props}
    >
      <span className="flex items-center gap-2">
        {showDot && (
          <span className={cn("w-2 h-2 rounded-full", config.dotClass)} />
        )}
        {config.icon}
        {children}
      </span>
    </Label>
  )
})
StatusLabel.displayName = 'StatusLabel'

// New CollabIDE-specific label components
const RoleLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps & {
    role: 'host' | 'collaborator' | 'viewer' | 'admin' | 'moderator'
    showIcon?: boolean
  }
>(({ role, showIcon = true, children, ...props }, ref) => {
  const roleConfig = {
    host: { 
      variant: 'host' as const, 
      icon: <Crown className="h-4 w-4" />, 
      badge: 'HOST' 
    },
    admin: { 
      variant: 'destructive' as const, 
      icon: <Crown className="h-4 w-4" />, 
      badge: 'ADMIN' 
    },
    moderator: { 
      variant: 'warning' as const, 
      icon: <Zap className="h-4 w-4" />, 
      badge: 'MOD' 
    },
    collaborator: { 
      variant: 'collaboration' as const, 
      icon: <Users className="h-4 w-4" />, 
      badge: 'COLLAB' 
    },
    viewer: { 
      variant: 'muted' as const, 
      icon: <Users className="h-4 w-4" />, 
      badge: 'VIEWER' 
    },
  }

  const config = roleConfig[role]

  return (
    <Label
      ref={ref}
      variant={config.variant}
      icon={showIcon ? config.icon : undefined}
      badge={config.badge}
      glow={role === 'host' || role === 'admin'}
      animated
      interactive
      {...props}
    >
      {children || role.charAt(0).toUpperCase() + role.slice(1)}
    </Label>
  )
})
RoleLabel.displayName = 'RoleLabel'

const SessionLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps & {
    sessionType: 'active' | 'ended' | 'scheduled' | 'private' | 'public'
    participantCount?: number
  }
>(({ sessionType, participantCount, children, ...props }, ref) => {
  const sessionConfig = {
    active: { 
      variant: 'success' as const, 
      icon: <Code className="h-4 w-4 animate-pulse-subtle" />, 
      badge: 'LIVE' 
    },
    ended: { 
      variant: 'muted' as const, 
      icon: <Code className="h-4 w-4" />, 
      badge: 'ENDED' 
    },
    scheduled: { 
      variant: 'info' as const, 
      icon: <Code className="h-4 w-4" />, 
      badge: 'SCHEDULED' 
    },
    private: { 
      variant: 'warning' as const, 
      icon: <Code className="h-4 w-4" />, 
      badge: 'PRIVATE' 
    },
    public: { 
      variant: 'collaboration' as const, 
      icon: <Code className="h-4 w-4" />, 
      badge: 'PUBLIC' 
    },
  }

  const config = sessionConfig[sessionType]

  return (
    <Label
      ref={ref}
      variant={config.variant}
      icon={config.icon}
      badge={participantCount ? `${participantCount} users` : config.badge}
      glow={sessionType === 'active'}
      animated
      {...props}
    >
      {children}
    </Label>
  )
})
SessionLabel.displayName = 'SessionLabel'

const LanguageLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps & {
    language: string
    showIcon?: boolean
  }
>(({ language, showIcon = true, children, ...props }, ref) => {
  const getLanguageIcon = (lang: string) => {
    const langLower = lang.toLowerCase()
    switch (langLower) {
      case 'javascript':
      case 'js':
        return '🟨'
      case 'typescript':
      case 'ts':
        return '🔷'
      case 'python':
      case 'py':
        return '🐍'
      case 'html':
        return '🌐'
      case 'css':
        return '🎨'
      case 'react':
        return '⚛️'
      case 'vue':
        return '💚'
      case 'cpp':
      case 'c++':
        return '🔵'
      default:
        return '📄'
    }
  }

  return (
    <Label
      ref={ref}
      variant="editor"
      icon={showIcon ? <span>{getLanguageIcon(language)}</span> : undefined}
      badge={language.toUpperCase()}
      animated
      {...props}
    >
      {children || language}
    </Label>
  )
})
LanguageLabel.displayName = 'LanguageLabel'

const PremiumLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ children, ...props }, ref) => (
  <Label
    ref={ref}
    variant="premium"
    icon={<Crown className="h-4 w-4 text-accent-orange" />}
    badge="PRO"
    glow
    animated
    interactive
    {...props}
  >
    {children}
  </Label>
))
PremiumLabel.displayName = 'PremiumLabel'

export { 
  Label, 
  FieldLabel, 
  SectionLabel, 
  InlineLabel, 
  StatusLabel,
  RoleLabel,
  SessionLabel,
  LanguageLabel,
  PremiumLabel,
  labelVariants 
}
