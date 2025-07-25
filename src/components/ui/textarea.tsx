import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const textareaVariants = cva(
  "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-input hover:border-primary/50",
        destructive: "border-destructive focus-visible:ring-destructive",
        success: "border-green-500 focus-visible:ring-green-500",
        warning: "border-yellow-500 focus-visible:ring-yellow-500",
        ghost: "border-transparent bg-transparent hover:bg-accent",
      },
      size: {
        sm: "min-h-[60px] px-2 py-1 text-xs",
        default: "min-h-[80px] px-3 py-2 text-sm",
        lg: "min-h-[120px] px-4 py-3 text-base",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string
  description?: string
  error?: string
  success?: string
  showCount?: boolean
  maxLength?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    variant, 
    size,
    label,
    description,
    error,
    success,
    showCount = false,
    maxLength,
    value,
    ...props 
  }, ref) => {
    const currentVariant = error ? 'destructive' : success ? 'success' : variant
    const currentLength = typeof value === 'string' ? value.length : 0

    const textareaElement = (
      <textarea
        className={cn(textareaVariants({ variant: currentVariant, size }), className)}
        ref={ref}
        value={value}
        maxLength={maxLength}
        {...props}
      />
    )

    // If no label or helper text, return just the textarea
    if (!label && !error && !success && !description && !showCount) {
      return textareaElement
    }

    // Return textarea with label wrapper
    return (
      <div className="space-y-2">
        {label && (
          <label className={cn(
            "text-sm font-medium leading-none",
            error && "text-destructive",
            success && "text-green-600"
          )}>
            {label}
          </label>
        )}
        {textareaElement}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {(error || success || description) && (
              <p className={cn(
                "text-xs leading-relaxed",
                error && "text-destructive",
                success && "text-green-600",
                !error && !success && "text-muted-foreground"
              )}>
                {error || success || description}
              </p>
            )}
          </div>
          {showCount && maxLength && (
            <span className={cn(
              "text-xs tabular-nums flex-shrink-0 ml-2",
              currentLength > maxLength * 0.9 ? "text-yellow-600" : "text-muted-foreground",
              currentLength >= maxLength && "text-destructive"
            )}>
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea, textareaVariants }
