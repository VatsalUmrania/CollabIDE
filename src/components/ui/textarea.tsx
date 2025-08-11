// import * as React from "react"
// import { cva, type VariantProps } from "class-variance-authority"
// import { AlertCircle, CheckCircle, Loader2, Code, MessageSquare, FileText } from "lucide-react"
// import { cn } from "@/lib/utils"

// const textareaVariants = cva(
//   "flex w-full rounded-lg border bg-card text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 resize-y backdrop-blur-sm relative overflow-hidden",
//   {
//     variants: {
//       variant: {
//         default: "border-border/50 hover:border-primary/50 focus:border-primary bg-card/80 shadow-sm hover:shadow-md",
//         destructive: "border-destructive/50 focus-visible:ring-destructive bg-destructive/5 shadow-sm shadow-destructive/10",
//         success: "border-success/50 focus-visible:ring-success bg-success/5 shadow-sm shadow-success/10",
//         warning: "border-warning/50 focus-visible:ring-warning bg-warning/5 shadow-sm shadow-warning/10",
//         info: "border-info/50 focus-visible:ring-info bg-info/5 shadow-sm shadow-info/10",
//         ghost: "border-transparent bg-transparent hover:bg-accent/50 focus:bg-card/50",
//         outline: "border-2 border-border hover:border-primary focus:border-primary bg-transparent",
//         glass: "glass-effect border-border/30 hover:border-primary/50 focus:border-primary/70 shadow-lg",
//         // CollabIDE-specific variants
//         code: "border-border/50 bg-editor-background hover:border-primary/50 focus:border-primary font-mono text-sm",
//         comment: "border-accent-blue/30 bg-accent-blue/5 hover:border-accent-blue/50 focus:border-accent-blue shadow-sm shadow-accent-blue/10",
//         collaboration: "border-accent-purple/30 bg-accent-purple/5 hover:border-accent-purple/50 focus:border-accent-purple shadow-sm shadow-accent-purple/10",
//       },
//       size: {
//         xs: "min-h-[50px] px-2 py-1.5 text-xs rounded-md",
//         sm: "min-h-[60px] px-2 py-1.5 text-xs rounded-md",
//         default: "min-h-[80px] px-3 py-2 text-sm",
//         lg: "min-h-[120px] px-4 py-3 text-base rounded-xl",
//         xl: "min-h-[160px] px-5 py-4 text-lg rounded-xl",
//         auto: "min-h-[40px] px-3 py-2 text-sm resize-none overflow-hidden",
//       }
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//     },
//   }
// )

// export interface TextareaProps
//   extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
//     VariantProps<typeof textareaVariants> {
//   label?: string
//   description?: string
//   error?: string
//   success?: string
//   showCount?: boolean
//   maxLength?: number
//   autoResize?: boolean
//   loading?: boolean
//   icon?: React.ReactNode
//   required?: boolean
//   animated?: boolean
//   glow?: boolean
//   onPaste?: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void
// }

// const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
//   ({ 
//     className, 
//     variant, 
//     size,
//     label,
//     description,
//     error,
//     success,
//     showCount = false,
//     maxLength,
//     autoResize = false,
//     loading = false,
//     icon,
//     required = false,
//     animated = true,
//     glow = false,
//     value,
//     onChange,
//     onPaste,
//     ...props 
//   }, ref) => {
//     const [isFocused, setIsFocused] = React.useState(false)
//     const [internalValue, setInternalValue] = React.useState(value || '')
//     const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    
//     // Combine refs
//     React.useImperativeHandle(ref, () => textareaRef.current!)

//     const currentVariant = error ? 'destructive' : success ? 'success' : variant
//     const currentValue = value !== undefined ? value : internalValue
//     const currentLength = typeof currentValue === 'string' ? currentValue.length : 0

//     // Auto-resize functionality
//     const adjustHeight = React.useCallback(() => {
//       const textarea = textareaRef.current
//       if (textarea && autoResize) {
//         textarea.style.height = 'auto'
//         textarea.style.height = `${textarea.scrollHeight}px`
//       }
//     }, [autoResize])

//     React.useEffect(() => {
//       if (autoResize) {
//         adjustHeight()
//       }
//     }, [currentValue, adjustHeight])

//     // Handle value changes
//     const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//       const newValue = e.target.value
//       setInternalValue(newValue)
//       onChange?.(e)
      
//       if (autoResize) {
//         adjustHeight()
//       }
//     }

//     // Handle focus/blur for animations
//     const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
//       setIsFocused(true)
//       props.onFocus?.(e)
//     }

//     const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
//       setIsFocused(false)
//       props.onBlur?.(e)
//     }

//     // Handle paste events
//     const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
//       onPaste?.(e)
      
//       // Auto-resize after paste
//       if (autoResize) {
//         setTimeout(adjustHeight, 0)
//       }
//     }

//     const textareaElement = (
//       <div className="relative group">
//         {/* Focus ring animation */}
//         {animated && isFocused && (
//           <div className="absolute inset-0 rounded-inherit bg-primary/20 animate-ping" />
//         )}

//         {/* Icon */}
//         {icon && (
//           <div className="absolute top-3 left-3 text-muted-foreground transition-colors group-focus-within:text-primary pointer-events-none z-10">
//             {React.isValidElement(icon) 
//               ? React.cloneElement(icon as React.ReactElement, { className: 'h-4 w-4' })
//               : icon
//             }
//           </div>
//         )}

//         {/* Loading overlay */}
//         {loading && (
//           <div className="absolute inset-0 bg-card/80 backdrop-blur-sm flex items-center justify-center rounded-inherit z-20">
//             <div className="flex items-center gap-2 text-sm text-muted-foreground">
//               <Loader2 className="h-4 w-4 animate-spin" />
//               <span>Processing...</span>
//             </div>
//           </div>
//         )}

//         <textarea
//           ref={textareaRef}
//           className={cn(
//             textareaVariants({ variant: currentVariant, size }),
//             icon && 'pl-10',
//             animated && 'transition-all duration-300',
//             glow && isFocused && 'animate-glow',
//             autoResize && 'resize-none overflow-hidden',
//             className
//           )}
//           value={value !== undefined ? value : internalValue}
//           onChange={handleChange}
//           onFocus={handleFocus}
//           onBlur={handleBlur}
//           onPaste={handlePaste}
//           maxLength={maxLength}
//           disabled={loading}
//           {...props}
//         />

//         {/* Character count overlay for large textareas */}
//         {showCount && maxLength && size !== 'xs' && size !== 'sm' && (
//           <div className="absolute bottom-2 right-2 bg-card/90 backdrop-blur-sm rounded px-2 py-1 border border-border/30">
//             <span className={cn(
//               "text-xs tabular-nums",
//               currentLength > maxLength * 0.9 ? "text-warning" : "text-muted-foreground",
//               currentLength >= maxLength && "text-destructive animate-pulse-subtle"
//             )}>
//               {currentLength}/{maxLength}
//             </span>
//           </div>
//         )}
//       </div>
//     )

//     // If no label or helper text, return just the textarea
//     if (!label && !error && !success && !description && !showCount) {
//       return textareaElement
//     }

//     // Return textarea with label wrapper
//     return (
//       <div className="space-y-2">
//         {label && (
//           <label className={cn(
//             "text-sm font-medium leading-none transition-colors duration-200",
//             error ? "text-destructive" : success ? "text-success" : "text-foreground",
//             required && "after:content-['*'] after:text-destructive after:ml-1"
//           )}>
//             {label}
//           </label>
//         )}
        
//         {textareaElement}
        
//         <div className="flex justify-between items-start gap-2">
//           <div className="flex-1 min-w-0">
//             {(error || success || description) && (
//               <div className="flex items-start gap-1">
//                 {error && <AlertCircle className="h-3 w-3 text-destructive mt-0.5 flex-shrink-0" />}
//                 {success && <CheckCircle className="h-3 w-3 text-success mt-0.5 flex-shrink-0" />}
//                 <p className={cn(
//                   "text-xs leading-relaxed transition-colors duration-200",
//                   error ? "text-destructive animate-slide-down" : success ? "text-success" : "text-muted-foreground"
//                 )}>
//                   {error || success || description}
//                 </p>
//               </div>
//             )}
//           </div>
          
//           {/* Character count for small textareas */}
//           {showCount && maxLength && (size === 'xs' || size === 'sm') && (
//             <span className={cn(
//               "text-xs tabular-nums flex-shrink-0",
//               currentLength > maxLength * 0.9 ? "text-warning" : "text-muted-foreground",
//               currentLength >= maxLength && "text-destructive animate-pulse-subtle"
//             )}>
//               {currentLength}/{maxLength}
//             </span>
//           )}
//         </div>
//       </div>
//     )
//   }
// )
// Textarea.displayName = "Textarea"

// // Enhanced specialized textarea components for CollabIDE
// const CodeTextarea = React.forwardRef<HTMLTextAreaElement, Omit<TextareaProps, 'variant' | 'icon'>>(
//   ({ placeholder = "Enter your code...", ...props }, ref) => (
//     <Textarea
//       ref={ref}
//       variant="code"
//       icon={<Code className="h-4 w-4" />}
//       placeholder={placeholder}
//       autoResize
//       animated
//       {...props}
//     />
//   )
// )
// CodeTextarea.displayName = 'CodeTextarea'

// const CommentTextarea = React.forwardRef<HTMLTextAreaElement, Omit<TextareaProps, 'variant' | 'icon'>>(
//   ({ placeholder = "Add a comment...", size = "sm", ...props }, ref) => (
//     <Textarea
//       ref={ref}
//       variant="comment"
//       size={size}
//       icon={<MessageSquare className="h-4 w-4" />}
//       placeholder={placeholder}
//       autoResize
//       animated
//       {...props}
//     />
//   )
// )
// CommentTextarea.displayName = 'CommentTextarea'

// const CollaborationTextarea = React.forwardRef<HTMLTextAreaElement, Omit<TextareaProps, 'variant'>>(
//   ({ placeholder = "Share your thoughts with collaborators...", ...props }, ref) => (
//     <Textarea
//       ref={ref}
//       variant="collaboration"
//       placeholder={placeholder}
//       autoResize
//       animated
//       glow
//       {...props}
//     />
//   )
// )
// CollaborationTextarea.displayName = 'CollaborationTextarea'

// const DocumentationTextarea = React.forwardRef<HTMLTextAreaElement, Omit<TextareaProps, 'variant' | 'icon'>>(
//   ({ placeholder = "Write documentation...", size = "lg", ...props }, ref) => (
//     <Textarea
//       ref={ref}
//       variant="ghost"
//       size={size}
//       icon={<FileText className="h-4 w-4" />}
//       placeholder={placeholder}
//       showCount
//       maxLength={5000}
//       animated
//       {...props}
//     />
//   )
// )
// DocumentationTextarea.displayName = 'DocumentationTextarea'

// // Auto-expanding textarea hook
// export const useAutoResize = (ref: React.RefObject<HTMLTextAreaElement>) => {
//   const adjustHeight = React.useCallback(() => {
//     const textarea = ref.current
//     if (textarea) {
//       textarea.style.height = 'auto'
//       textarea.style.height = `${textarea.scrollHeight}px`
//     }
//   }, [ref])

//   React.useEffect(() => {
//     const textarea = ref.current
//     if (textarea) {
//       const handleInput = () => adjustHeight()
//       textarea.addEventListener('input', handleInput)
//       adjustHeight() // Initial adjustment
      
//       return () => {
//         textarea.removeEventListener('input', handleInput)
//       }
//     }
//   }, [adjustHeight])

//   return adjustHeight
// }

// export { 
//   Textarea, 
//   CodeTextarea,
//   CommentTextarea,
//   CollaborationTextarea,
//   DocumentationTextarea,
//   textareaVariants 
// }

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, CheckCircle, Loader2, Code, MessageSquare, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

const textareaVariants = cva(
  "flex w-full rounded-lg border bg-gray-800 text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-y relative",
  {
    variants: {
      variant: {
        default: "border-gray-700 hover:border-gray-600 focus:border-blue-500",
        destructive: "border-red-600 bg-red-900/20 text-red-200 focus-visible:ring-red-500",
        success: "border-green-600 bg-green-900/20 text-green-200 focus-visible:ring-green-500",
        warning: "border-yellow-600 bg-yellow-900/20 text-yellow-200 focus-visible:ring-yellow-500",
        info: "border-blue-500 bg-blue-900/20 text-blue-200 focus-visible:ring-blue-500",
        ghost: "border-transparent bg-transparent hover:bg-gray-800 focus:bg-gray-800",
        outline: "border-2 border-gray-600 hover:border-blue-500 focus:border-blue-500 bg-transparent",
        // CollabIDE-specific variants
        code: "border-gray-700 bg-gray-900 hover:border-gray-600 focus:border-blue-500 font-mono text-sm",
        comment: "border-blue-600 bg-blue-900/20 hover:border-blue-500 focus:border-blue-400 text-blue-200",
        collaboration: "border-purple-600 bg-purple-900/20 hover:border-purple-500 focus:border-purple-400 text-purple-200",
      },
      size: {
        xs: "min-h-[50px] px-2 py-1.5 text-xs",
        sm: "min-h-[60px] px-2 py-1.5 text-xs",
        default: "min-h-[80px] px-3 py-2 text-sm",
        lg: "min-h-[120px] px-4 py-3 text-base",
        xl: "min-h-[160px] px-5 py-4 text-lg",
        auto: "min-h-[40px] px-3 py-2 text-sm resize-none overflow-hidden",
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
  autoResize?: boolean
  loading?: boolean
  icon?: React.ReactNode
  required?: boolean
  onPaste?: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void
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
    autoResize = false,
    loading = false,
    icon,
    required = false,
    value,
    onChange,
    onPaste,
    ...props 
  }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value || '')
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    
    // Combine refs
    React.useImperativeHandle(ref, () => textareaRef.current!)

    const currentVariant = error ? 'destructive' : success ? 'success' : variant
    const currentValue = value !== undefined ? value : internalValue
    const currentLength = typeof currentValue === 'string' ? currentValue.length : 0

    // Auto-resize functionality
    const adjustHeight = React.useCallback(() => {
      const textarea = textareaRef.current
      if (textarea && autoResize) {
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
      }
    }, [autoResize])

    React.useEffect(() => {
      if (autoResize) {
        adjustHeight()
      }
    }, [currentValue, adjustHeight])

    // Handle value changes
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      setInternalValue(newValue)
      onChange?.(e)
      
      if (autoResize) {
        adjustHeight()
      }
    }

    // Handle paste events
    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      onPaste?.(e)
      
      // Auto-resize after paste
      if (autoResize) {
        setTimeout(adjustHeight, 0)
      }
    }

    const textareaElement = (
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute top-3 left-3 text-gray-500 pointer-events-none z-10">
            {React.isValidElement(icon) 
              ? React.cloneElement(icon as React.ReactElement, { className: 'h-4 w-4' })
              : icon
            }
          </div>
        )}

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-gray-800/80 flex items-center justify-center rounded-lg z-20">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </div>
          </div>
        )}

        <textarea
          ref={textareaRef}
          className={cn(
            textareaVariants({ variant: currentVariant, size }),
            icon && 'pl-10',
            autoResize && 'resize-none overflow-hidden',
            className
          )}
          value={value !== undefined ? value : internalValue}
          onChange={handleChange}
          onPaste={handlePaste}
          maxLength={maxLength}
          disabled={loading}
          {...props}
        />

        {/* Character count overlay for large textareas */}
        {showCount && maxLength && size !== 'xs' && size !== 'sm' && (
          <div className="absolute bottom-2 right-2 bg-gray-800/90 rounded px-2 py-1 border border-gray-700">
            <span className={cn(
              "text-xs tabular-nums",
              currentLength > maxLength * 0.9 ? "text-yellow-400" : "text-gray-400",
              currentLength >= maxLength && "text-red-400"
            )}>
              {currentLength}/{maxLength}
            </span>
          </div>
        )}
      </div>
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
            "text-sm font-medium leading-none transition-colors",
            error ? "text-red-400" : success ? "text-green-400" : "text-gray-300",
            required && "after:content-['*'] after:text-red-400 after:ml-1"
          )}>
            {label}
          </label>
        )}
        
        {textareaElement}
        
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            {(error || success || description) && (
              <div className="flex items-start gap-1">
                {error && <AlertCircle className="h-3 w-3 text-red-400 mt-0.5 flex-shrink-0" />}
                {success && <CheckCircle className="h-3 w-3 text-green-400 mt-0.5 flex-shrink-0" />}
                <p className={cn(
                  "text-xs leading-relaxed transition-colors",
                  error ? "text-red-400" : success ? "text-green-400" : "text-gray-400"
                )}>
                  {error || success || description}
                </p>
              </div>
            )}
          </div>
          
          {/* Character count for small textareas */}
          {showCount && maxLength && (size === 'xs' || size === 'sm') && (
            <span className={cn(
              "text-xs tabular-nums flex-shrink-0",
              currentLength > maxLength * 0.9 ? "text-yellow-400" : "text-gray-400",
              currentLength >= maxLength && "text-red-400"
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

// Specialized textarea components
const CodeTextarea = React.forwardRef<HTMLTextAreaElement, Omit<TextareaProps, 'variant' | 'icon'>>(
  ({ placeholder = "Enter your code...", ...props }, ref) => (
    <Textarea
      ref={ref}
      variant="code"
      icon={<Code className="h-4 w-4" />}
      placeholder={placeholder}
      autoResize
      {...props}
    />
  )
)
CodeTextarea.displayName = 'CodeTextarea'

const CommentTextarea = React.forwardRef<HTMLTextAreaElement, Omit<TextareaProps, 'variant' | 'icon'>>(
  ({ placeholder = "Add a comment...", size = "sm", ...props }, ref) => (
    <Textarea
      ref={ref}
      variant="comment"
      size={size}
      icon={<MessageSquare className="h-4 w-4" />}
      placeholder={placeholder}
      autoResize
      {...props}
    />
  )
)
CommentTextarea.displayName = 'CommentTextarea'

const CollaborationTextarea = React.forwardRef<HTMLTextAreaElement, Omit<TextareaProps, 'variant'>>(
  ({ placeholder = "Share your thoughts with collaborators...", ...props }, ref) => (
    <Textarea
      ref={ref}
      variant="collaboration"
      placeholder={placeholder}
      autoResize
      {...props}
    />
  )
)
CollaborationTextarea.displayName = 'CollaborationTextarea'

const DocumentationTextarea = React.forwardRef<HTMLTextAreaElement, Omit<TextareaProps, 'variant' | 'icon'>>(
  ({ placeholder = "Write documentation...", size = "lg", ...props }, ref) => (
    <Textarea
      ref={ref}
      variant="ghost"
      size={size}
      icon={<FileText className="h-4 w-4" />}
      placeholder={placeholder}
      showCount
      maxLength={5000}
      {...props}
    />
  )
)
DocumentationTextarea.displayName = 'DocumentationTextarea'

// Auto-expanding textarea hook
export const useAutoResize = (ref: React.RefObject<HTMLTextAreaElement>) => {
  const adjustHeight = React.useCallback(() => {
    const textarea = ref.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [ref])

  React.useEffect(() => {
    const textarea = ref.current
    if (textarea) {
      const handleInput = () => adjustHeight()
      textarea.addEventListener('input', handleInput)
      adjustHeight() // Initial adjustment
      
      return () => {
        textarea.removeEventListener('input', handleInput)
      }
    }
  }, [adjustHeight])

  return adjustHeight
}

export { 
  Textarea, 
  CodeTextarea,
  CommentTextarea,
  CollaborationTextarea,
  DocumentationTextarea,
  textareaVariants 
}
