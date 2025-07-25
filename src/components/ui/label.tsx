"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const labelVariants = cva(
  "leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "text-foreground font-medium",
        muted: "text-muted-foreground font-normal",
        destructive: "text-destructive font-medium",
        success: "text-green-600 dark:text-green-400 font-medium",
        warning: "text-yellow-600 dark:text-yellow-400 font-medium",
        info: "text-blue-600 dark:text-blue-400 font-medium",
        accent: "text-primary font-medium",
        ghost: "text-muted-foreground font-normal hover:text-foreground",
      },
      size: {
        xs: "text-xs",
        sm: "text-sm",
        default: "text-sm",
        lg: "text-base",
        xl: "text-lg",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
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
  children,
  ...props 
}, ref) => {
  const currentVariant = error ? 'destructive' : variant

  return (
    <div className="space-y-1">
      <LabelPrimitive.Root
        ref={ref}
        className={cn(labelVariants({ variant: currentVariant, size, weight }), className)}
        {...props}
      >
        <span className="flex items-center gap-1">
          {children}
          {required && (
            <span className="text-destructive ml-1" aria-label="required">
              *
            </span>
          )}
          {optional && (
            <span className="text-muted-foreground text-xs font-normal ml-1">
              (optional)
            </span>
          )}
          {tooltip && (
            <span 
              className="text-muted-foreground hover:text-foreground cursor-help ml-1"
              title={tooltip}
            >
              ?
            </span>
          )}
        </span>
      </LabelPrimitive.Root>
      {description && (
        <p className={cn(
          "text-xs leading-relaxed",
          error ? "text-destructive/80" : "text-muted-foreground"
        )}>
          {description}
        </p>
      )}
    </div>
  )
})
Label.displayName = LabelPrimitive.Root.displayName

// Specialized label components
const FieldLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps & {
    htmlFor: string
    error?: string
    helperText?: string
  }
>(({ error, helperText, children, ...props }, ref) => (
  <Label
    ref={ref}
    error={!!error}
    description={error || helperText}
    {...props}
  >
    {children}
  </Label>
))
FieldLabel.displayName = 'FieldLabel'

const SectionLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ size = "lg", weight = "semibold", ...props }, ref) => (
  <Label
    ref={ref}
    size={size}
    weight={weight}
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
    status: 'online' | 'offline' | 'syncing' | 'error' | 'success' | 'warning'
  }
>(({ status, children, ...props }, ref) => {
  const statusVariants = {
    online: 'success',
    offline: 'muted',
    syncing: 'info',
    error: 'destructive',
    success: 'success',
    warning: 'warning',
  } as const

  return (
    <Label
      ref={ref}
      variant={statusVariants[status]}
      {...props}
    >
      <span className="flex items-center gap-2">
        <span className={cn(
          "w-2 h-2 rounded-full",
          status === 'online' && "bg-green-500 animate-pulse",
          status === 'offline' && "bg-gray-400",
          status === 'syncing' && "bg-blue-500 animate-pulse",
          status === 'error' && "bg-red-500",
          status === 'success' && "bg-green-500",
          status === 'warning' && "bg-yellow-500"
        )} />
        {children}
      </span>
    </Label>
  )
})
StatusLabel.displayName = 'StatusLabel'

export { Label, FieldLabel, SectionLabel, InlineLabel, StatusLabel, labelVariants }
