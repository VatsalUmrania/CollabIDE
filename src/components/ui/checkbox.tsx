"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, Minus, X } from "lucide-react"
import { cn } from "@/lib/utils"

const checkboxVariants = cva(
  "peer shrink-0 rounded-sm border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
  {
    variants: {
      variant: {
        default: 
          "border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
        destructive:
          "border-destructive data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground data-[state=indeterminate]:bg-destructive data-[state=indeterminate]:text-destructive-foreground",
        success:
          "border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white data-[state=indeterminate]:bg-green-500 data-[state=indeterminate]:text-white",
        warning:
          "border-yellow-500 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-white data-[state=indeterminate]:bg-yellow-500 data-[state=indeterminate]:text-white",
        info:
          "border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white data-[state=indeterminate]:bg-blue-500 data-[state=indeterminate]:text-white",
        outline:
          "border-border hover:border-primary data-[state=checked]:border-primary data-[state=checked]:bg-background data-[state=checked]:text-primary",
        ghost:
          "border-transparent hover:bg-accent hover:text-accent-foreground data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      },
      size: {
        sm: "h-3 w-3",
        default: "h-4 w-4",
        lg: "h-5 w-5",
        xl: "h-6 w-6",
      },
      shape: {
        square: "rounded-sm",
        rounded: "rounded-md",
        circle: "rounded-full",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "square",
    },
  }
)

const checkboxIndicatorVariants = cva(
  "flex items-center justify-center text-current",
  {
    variants: {
      size: {
        sm: "[&>svg]:h-2.5 [&>svg]:w-2.5",
        default: "[&>svg]:h-3 [&>svg]:w-3",
        lg: "[&>svg]:h-4 [&>svg]:w-4",
        xl: "[&>svg]:h-5 [&>svg]:w-5",
      }
    },
    defaultVariants: {
      size: "default",
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
  ...props 
}, ref) => {
  const getIndicatorIcon = () => {
    if (icon) return icon
    if (indeterminate) return <Minus />
    return <Check />
  }

  const checkboxElement = (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(checkboxVariants({ variant, size, shape }), className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn(checkboxIndicatorVariants({ size }))}
      >
        {getIndicatorIcon()}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )

  // If no label or description, return just the checkbox
  if (!label && !description && !error) {
    return checkboxElement
  }

  // Return checkbox with label wrapper
  return (
    <div className="flex items-start space-x-2">
      {checkboxElement}
      <div className="grid gap-1.5 leading-none">
        {label && (
          <label
            htmlFor={props.id}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
              error && "text-destructive"
            )}
          >
            {label}
          </label>
        )}
        {description && (
          <p className={cn(
            "text-xs text-muted-foreground",
            error && "text-destructive/80"
          )}>
            {description}
          </p>
        )}
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>
    </div>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

// Specialized checkbox components
const CheckboxGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: 'horizontal' | 'vertical'
    spacing?: 'sm' | 'default' | 'lg'
  }
>(({ className, orientation = 'vertical', spacing = 'default', ...props }, ref) => {
  const spacingClasses = {
    sm: orientation === 'vertical' ? 'space-y-2' : 'space-x-2',
    default: orientation === 'vertical' ? 'space-y-3' : 'space-x-3',
    lg: orientation === 'vertical' ? 'space-y-4' : 'space-x-4',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'flex',
        orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        spacingClasses[spacing],
        className
      )}
      {...props}
    />
  )
})
CheckboxGroup.displayName = 'CheckboxGroup'

const SelectAllCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps & {
    items: Array<{ id: string; checked: boolean }>
    onSelectAll?: (checked: boolean) => void
  }
>(({ items, onSelectAll, ...props }, ref) => {
  const checkedItems = items.filter(item => item.checked)
  const allChecked = checkedItems.length === items.length
  const someChecked = checkedItems.length > 0 && checkedItems.length < items.length

  const handleChange = (checked: boolean) => {
    onSelectAll?.(checked)
  }

  return (
    <Checkbox
      ref={ref}
      checked={allChecked}
      indeterminate={someChecked}
      onCheckedChange={handleChange}
      {...props}
    />
  )
})
SelectAllCheckbox.displayName = 'SelectAllCheckbox'

export { Checkbox, CheckboxGroup, SelectAllCheckbox, checkboxVariants }
