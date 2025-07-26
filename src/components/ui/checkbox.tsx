"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, Minus, X, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const checkboxVariants = cva(
  "peer shrink-0 border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 relative overflow-hidden backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: 
          "border-border hover:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground data-[state=indeterminate]:border-primary shadow-sm hover:shadow-md",
        destructive:
          "border-destructive/50 hover:border-destructive data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground data-[state=checked]:border-destructive data-[state=indeterminate]:bg-destructive data-[state=indeterminate]:text-destructive-foreground data-[state=indeterminate]:border-destructive shadow-sm shadow-destructive/10",
        success:
          "border-success/50 hover:border-success data-[state=checked]:bg-success data-[state=checked]:text-success-foreground data-[state=checked]:border-success data-[state=indeterminate]:bg-success data-[state=indeterminate]:text-success-foreground data-[state=indeterminate]:border-success shadow-sm shadow-success/10",
        warning:
          "border-warning/50 hover:border-warning data-[state=checked]:bg-warning data-[state=checked]:text-warning-foreground data-[state=checked]:border-warning data-[state=indeterminate]:bg-warning data-[state=indeterminate]:text-warning-foreground data-[state=indeterminate]:border-warning shadow-sm shadow-warning/10",
        info:
          "border-info/50 hover:border-info data-[state=checked]:bg-info data-[state=checked]:text-info-foreground data-[state=checked]:border-info data-[state=indeterminate]:bg-info data-[state=indeterminate]:text-info-foreground data-[state=indeterminate]:border-info shadow-sm shadow-info/10",
        outline:
          "border-border hover:border-primary data-[state=checked]:border-primary data-[state=checked]:bg-card data-[state=checked]:text-primary hover:bg-accent/50 backdrop-blur-sm",
        ghost:
          "border-transparent hover:bg-accent/50 hover:text-accent-foreground data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary data-[state=checked]:border-primary/30 backdrop-blur-sm",
        glass:
          "glass-effect border-border/30 hover:border-primary/50 data-[state=checked]:bg-primary/20 data-[state=checked]:text-primary data-[state=checked]:border-primary/50 shadow-lg",
        // CollabIDE-specific variants
        collaboration:
          "border-accent-purple/50 hover:border-accent-purple data-[state=checked]:bg-accent-purple data-[state=checked]:text-white data-[state=checked]:border-accent-purple shadow-sm shadow-accent-purple/10",
        permission:
          "border-accent-orange/50 hover:border-accent-orange data-[state=checked]:bg-accent-orange data-[state=checked]:text-white data-[state=checked]:border-accent-orange shadow-sm shadow-accent-orange/10",
      },
      size: {
        xs: "h-3 w-3 text-xs",
        sm: "h-3.5 w-3.5 text-sm",
        default: "h-4 w-4 text-base",
        lg: "h-5 w-5 text-lg",
        xl: "h-6 w-6 text-xl",
      },
      shape: {
        square: "rounded-sm",
        rounded: "rounded-md",
        circle: "rounded-full",
        sharp: "rounded-none",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "rounded",
    },
  }
)

const checkboxIndicatorVariants = cva(
  "flex items-center justify-center text-current transition-all duration-200",
  {
    variants: {
      size: {
        xs: "[&>svg]:h-2 [&>svg]:w-2",
        sm: "[&>svg]:h-2.5 [&>svg]:w-2.5", 
        default: "[&>svg]:h-3 [&>svg]:w-3",
        lg: "[&>svg]:h-4 [&>svg]:w-4",
        xl: "[&>svg]:h-5 [&>svg]:w-5",
      },
      animation: {
        none: "",
        scale: "data-[state=checked]:animate-scale-in data-[state=indeterminate]:animate-scale-in",
        bounce: "data-[state=checked]:animate-bounce-in data-[state=indeterminate]:animate-bounce-in",
        fade: "data-[state=checked]:animate-fade-in data-[state=indeterminate]:animate-fade-in",
      }
    },
    defaultVariants: {
      size: "default",
      animation: "scale",
    },
  }
)

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {
  indeterminate?: boolean
  icon?: React.ReactNode
  label?: string
  description?: string
  error?: string
  required?: boolean
  animation?: "none" | "scale" | "bounce" | "fade"
  pulse?: boolean
  glow?: boolean
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ 
  className, 
  variant, 
  size, 
  shape, 
  indeterminate = false,
  icon,
  label,
  description,
  error,
  required = false,
  animation = "scale",
  pulse = false,
  glow = false,
  ...props 
}, ref) => {
  const [isChecked, setIsChecked] = React.useState(props.checked || false)

  const getIndicatorIcon = () => {
    if (icon) return icon
    if (indeterminate) return <Minus className="animate-scale-in" />
    return <Check className="animate-scale-in" />
  }

  const handleCheckedChange = (checked: boolean) => {
    setIsChecked(checked)
    props.onCheckedChange?.(checked)
  }

  const checkboxElement = (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        checkboxVariants({ variant, size, shape }),
        pulse && "animate-pulse-subtle",
        glow && isChecked && "animate-glow",
        className
      )}
      onCheckedChange={handleCheckedChange}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn(checkboxIndicatorVariants({ size, animation }))}
      >
        {getIndicatorIcon()}
      </CheckboxPrimitive.Indicator>
      
      {/* Ripple effect on interaction */}
      <div className="absolute inset-0 rounded-inherit bg-current opacity-0 transition-opacity duration-200 peer-active:opacity-10" />
    </CheckboxPrimitive.Root>
  )

  // If no label, description, or error, return just the checkbox
  if (!label && !description && !error) {
    return checkboxElement
  }

  // Return checkbox with label wrapper
  return (
    <div className="flex items-start space-x-3 group">
      {checkboxElement}
      <div className="grid gap-1.5 leading-none flex-1 min-w-0">
        {label && (
          <label
            htmlFor={props.id}
            className={cn(
              "text-sm font-medium leading-relaxed cursor-pointer transition-colors duration-200",
              "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              "group-hover:text-foreground",
              error ? "text-destructive" : "text-foreground",
              required && "after:content-['*'] after:text-destructive after:ml-1"
            )}
          >
            {label}
          </label>
        )}
        {description && (
          <p className={cn(
            "text-xs leading-relaxed transition-colors duration-200",
            error ? "text-destructive/80" : "text-muted-foreground",
            "group-hover:text-muted-foreground/90"
          )}>
            {description}
          </p>
        )}
        {error && (
          <div className="flex items-center gap-1 text-xs text-destructive animate-slide-down">
            <AlertCircle className="h-3 w-3 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

// Enhanced specialized checkbox components
const CheckboxGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: 'horizontal' | 'vertical'
    spacing?: 'xs' | 'sm' | 'default' | 'lg' | 'xl'
    title?: string
    description?: string
    error?: string
    required?: boolean
  }
>(({ 
  className, 
  orientation = 'vertical', 
  spacing = 'default',
  title,
  description,
  error,
  required = false,
  children,
  ...props 
}, ref) => {
  const spacingClasses = {
    xs: orientation === 'vertical' ? 'space-y-1' : 'space-x-1',
    sm: orientation === 'vertical' ? 'space-y-2' : 'space-x-2',
    default: orientation === 'vertical' ? 'space-y-3' : 'space-x-3',
    lg: orientation === 'vertical' ? 'space-y-4' : 'space-x-4',
    xl: orientation === 'vertical' ? 'space-y-6' : 'space-x-6',
  }

  return (
    <div ref={ref} className={cn("space-y-3", className)} {...props}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className={cn(
              "text-sm font-medium text-foreground",
              required && "after:content-['*'] after:text-destructive after:ml-1"
            )}>
              {title}
            </h3>
          )}
          {description && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}
      
      <div
        className={cn(
          'flex',
          orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap items-center',
          spacingClasses[spacing],
        )}
      >
        {children}
      </div>
      
      {error && (
        <div className="flex items-center gap-1 text-xs text-destructive animate-slide-down">
          <AlertCircle className="h-3 w-3 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
})
CheckboxGroup.displayName = 'CheckboxGroup'

const SelectAllCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps & {
    items: Array<{ id: string; checked: boolean; label?: string }>
    onSelectAll?: (checked: boolean) => void
    showCount?: boolean
  }
>(({ items, onSelectAll, showCount = false, label, ...props }, ref) => {
  const checkedItems = items.filter(item => item.checked)
  const allChecked = items.length > 0 && checkedItems.length === items.length
  const someChecked = checkedItems.length > 0 && checkedItems.length < items.length

  const handleChange = (checked: boolean) => {
    onSelectAll?.(checked)
  }

  const getLabel = () => {
    if (label) return label
    if (showCount) {
      return `Select All (${checkedItems.length}/${items.length})`
    }
    return "Select All"
  }

  return (
    <Checkbox
      ref={ref}
      checked={allChecked}
      indeterminate={someChecked}
      onCheckedChange={handleChange}
      label={getLabel()}
      variant={someChecked ? "info" : "default"}
      {...props}
    />
  )
})
SelectAllCheckbox.displayName = 'SelectAllCheckbox'

// New CollabIDE-specific checkbox components
const PermissionCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps & {
    permission: 'read' | 'write' | 'admin'
    userName?: string
  }
>(({ permission, userName, ...props }, ref) => {
  const getPermissionConfig = () => {
    switch (permission) {
      case 'read':
        return {
          variant: 'info' as const,
          label: `View access${userName ? ` for ${userName}` : ''}`,
          description: 'Can view files and session activity'
        }
      case 'write':
        return {
          variant: 'collaboration' as const,
          label: `Edit access${userName ? ` for ${userName}` : ''}`,
          description: 'Can edit files and collaborate in real-time'
        }
      case 'admin':
        return {
          variant: 'permission' as const,
          label: `Admin access${userName ? ` for ${userName}` : ''}`,
          description: 'Full control over session and participants'
        }
      default:
        return {
          variant: 'default' as const,
          label: 'Unknown permission',
          description: ''
        }
    }
  }

  const config = getPermissionConfig()

  return (
    <Checkbox
      ref={ref}
      variant={config.variant}
      label={config.label}
      description={config.description}
      glow
      {...props}
    />
  )
})
PermissionCheckbox.displayName = 'PermissionCheckbox'

const CollaboratorCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps & {
    collaborator: {
      id: string
      name: string
      avatar?: string
      status: 'online' | 'offline' | 'away'
    }
    showStatus?: boolean
  }
>(({ collaborator, showStatus = true, ...props }, ref) => {
  const getStatusIcon = () => {
    switch (collaborator.status) {
      case 'online': return <div className="w-2 h-2 rounded-full bg-success" />
      case 'away': return <div className="w-2 h-2 rounded-full bg-warning" />
      case 'offline': return <div className="w-2 h-2 rounded-full bg-muted-foreground" />
    }
  }

  return (
    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
      <Checkbox
        ref={ref}
        variant="collaboration"
        {...props}
      />
      
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center text-white text-sm font-semibold">
          {collaborator.avatar ? (
            <img 
              src={collaborator.avatar} 
              alt={collaborator.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            collaborator.name.charAt(0).toUpperCase()
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground truncate">
              {collaborator.name}
            </span>
            {showStatus && getStatusIcon()}
          </div>
        </div>
      </div>
    </div>
  )
})
CollaboratorCheckbox.displayName = 'CollaboratorCheckbox'

export { 
  Checkbox, 
  CheckboxGroup, 
  SelectAllCheckbox,
  PermissionCheckbox,
  CollaboratorCheckbox,
  checkboxVariants 
}
