// import * as React from 'react'
// import { cva, type VariantProps } from 'class-variance-authority'
// import { Eye, EyeOff, Search, X, AlertCircle, CheckCircle, Loader2, Code, Users, FileText } from 'lucide-react'
// import { cn } from '@/lib/utils'

// const inputVariants = cva(
//   'flex w-full rounded-lg border bg-card text-foreground text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 backdrop-blur-sm relative',
//   {
//     variants: {
//       variant: {
//         default: 'border-border/50 hover:border-primary/50 focus:border-primary bg-card/80',
//         destructive: 'border-destructive/50 focus-visible:ring-destructive bg-destructive/5 shadow-sm shadow-destructive/10',
//         success: 'border-success/50 focus-visible:ring-success bg-success/5 shadow-sm shadow-success/10',
//         warning: 'border-warning/50 focus-visible:ring-warning bg-warning/5 shadow-sm shadow-warning/10',
//         info: 'border-info/50 focus-visible:ring-info bg-info/5 shadow-sm shadow-info/10',
//         ghost: 'border-transparent bg-transparent hover:bg-accent/50 focus:bg-card/50',
//         outline: 'border-2 border-border hover:border-primary focus:border-primary bg-transparent',
//         glass: 'glass-effect border-border/30 hover:border-primary/50 focus:border-primary/70 shadow-lg',
//         // CollabIDE-specific variants
//         editor: 'border-border/50 bg-editor-background hover:border-primary/50 focus:border-primary font-mono',
//         collaboration: 'border-accent-purple/30 bg-accent-purple/5 hover:border-accent-purple/50 focus:border-accent-purple shadow-sm shadow-accent-purple/10',
//         session: 'border-accent-blue/30 bg-accent-blue/5 hover:border-accent-blue/50 focus:border-accent-blue shadow-sm shadow-accent-blue/10',
//       },
//       size: {
//         xs: 'h-7 px-2 py-1 text-xs rounded-md',
//         sm: 'h-8 px-3 py-1.5 text-xs rounded-md',
//         default: 'h-10 px-3 py-2 text-sm',
//         lg: 'h-12 px-4 py-3 text-base rounded-xl',
//         xl: 'h-14 px-5 py-4 text-lg rounded-xl',
//         '2xl': 'h-16 px-6 py-5 text-xl rounded-2xl',
//       },
//       inputSize: {
//         auto: '',
//         full: 'w-full',
//         xs: 'w-16',
//         sm: 'w-24',
//         md: 'w-32',
//         lg: 'w-48',
//         xl: 'w-64',
//         '2xl': 'w-80',
//         '3xl': 'w-96',
//       }
//     },
//     defaultVariants: {
//       variant: 'default',
//       size: 'default',
//       inputSize: 'full',
//     },
//   }
// )

// export interface InputProps
//   extends React.InputHTMLAttributes<HTMLInputElement>,
//     VariantProps<typeof inputVariants> {
//   leftIcon?: React.ReactNode
//   rightIcon?: React.ReactNode
//   clearable?: boolean
//   onClear?: () => void
//   loading?: boolean
//   error?: string
//   success?: string
//   helperText?: string
//   label?: string
//   showPasswordToggle?: boolean
//   required?: boolean
//   showCharCount?: boolean
//   maxLength?: number
//   prefix?: string
//   suffix?: string
//   animated?: boolean
//   glow?: boolean
// }

// const Input = React.forwardRef<HTMLInputElement, InputProps>(
//   ({ 
//     className, 
//     variant, 
//     size, 
//     inputSize,
//     type,
//     leftIcon,
//     rightIcon,
//     clearable = false,
//     onClear,
//     loading = false,
//     error,
//     success,
//     helperText,
//     label,
//     showPasswordToggle = false,
//     required = false,
//     showCharCount = false,
//     maxLength,
//     prefix,
//     suffix,
//     animated = true,
//     glow = false,
//     value,
//     onChange,
//     ...props 
//   }, ref) => {
//     const [showPassword, setShowPassword] = React.useState(false)
//     const [internalValue, setInternalValue] = React.useState(value || '')
//     const [isFocused, setIsFocused] = React.useState(false)
    
//     // Determine the actual type
//     const actualType = type === 'password' && showPasswordToggle && showPassword ? 'text' : type

//     // Determine variant based on state
//     const currentVariant = error ? 'destructive' : success ? 'success' : variant

//     // Handle value changes
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//       const newValue = e.target.value
//       setInternalValue(newValue)
//       onChange?.(e)
//     }

//     // Handle clear
//     const handleClear = () => {
//       setInternalValue('')
//       onClear?.()
//       if (onChange) {
//         const syntheticEvent = {
//           target: { value: '' },
//           currentTarget: { value: '' }
//         } as React.ChangeEvent<HTMLInputElement>
//         onChange(syntheticEvent)
//       }
//     }

//     // Toggle password visibility
//     const togglePasswordVisibility = () => {
//       setShowPassword(!showPassword)
//     }

//     // Handle focus/blur for animations
//     const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
//       setIsFocused(true)
//       props.onFocus?.(e)
//     }

//     const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
//       setIsFocused(false)
//       props.onBlur?.(e)
//     }

//     // Calculate character count
//     const currentValue = value !== undefined ? value : internalValue
//     const charCount = String(currentValue).length

//     // Calculate padding based on icons and elements
//     const leftPadding = leftIcon || prefix ? 'pl-10' : 'pl-3'
//     const rightPadding = (rightIcon || clearable || showPasswordToggle || loading || suffix) ? 'pr-10' : 'pr-3'

//     const inputElement = (
//       <div className="relative group">
//         {/* Focus ring animation */}
//         {animated && isFocused && (
//           <div className="absolute inset-0 rounded-inherit bg-primary/20 animate-ping" />
//         )}

//         {/* Prefix */}
//         {prefix && (
//           <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium pointer-events-none">
//             {prefix}
//           </div>
//         )}

//         {/* Left Icon */}
//         {leftIcon && (
//           <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
//             {React.isValidElement(leftIcon) 
//               ? React.cloneElement(leftIcon as React.ReactElement, { className: 'h-4 w-4' })
//               : leftIcon
//             }
//           </div>
//         )}

//         {/* Input */}
//         <input
//           type={actualType}
//           className={cn(
//             inputVariants({ variant: currentVariant, size, inputSize }),
//             leftIcon || prefix ? leftPadding : 'px-3',
//             (rightIcon || clearable || showPasswordToggle || loading || suffix) ? rightPadding : '',
//             animated && 'transition-all duration-300',
//             glow && isFocused && 'animate-glow',
//             className
//           )}
//           ref={ref}
//           value={value !== undefined ? value : internalValue}
//           onChange={handleChange}
//           onFocus={handleFocus}
//           onBlur={handleBlur}
//           maxLength={maxLength}
//           {...props}
//         />

//         {/* Right Side Icons Container */}
//         <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
//           {/* Suffix */}
//           {suffix && !loading && (
//             <span className="text-muted-foreground text-sm font-medium pointer-events-none">
//               {suffix}
//             </span>
//           )}

//           {/* Loading Spinner */}
//           {loading && (
//             <Loader2 className="h-4 w-4 animate-spin text-primary" />
//           )}

//           {/* Clear Button */}
//           {clearable && !loading && currentValue && (
//             <button
//               type="button"
//               onClick={handleClear}
//               className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110 active:scale-95 rounded-sm p-0.5"
//               tabIndex={-1}
//               aria-label="Clear input"
//             >
//               <X className="h-4 w-4" />
//             </button>
//           )}

//           {/* Password Toggle */}
//           {showPasswordToggle && type === 'password' && !loading && (
//             <button
//               type="button"
//               onClick={togglePasswordVisibility}
//               className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110 active:scale-95 rounded-sm p-0.5"
//               tabIndex={-1}
//               aria-label={showPassword ? 'Hide password' : 'Show password'}
//             >
//               {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//             </button>
//           )}

//           {/* Status Icons */}
//           {!loading && error && (
//             <AlertCircle className="h-4 w-4 text-destructive animate-scale-in" />
//           )}
//           {!loading && success && (
//             <CheckCircle className="h-4 w-4 text-success animate-scale-in" />
//           )}

//           {/* Custom Right Icon */}
//           {rightIcon && !loading && !clearable && !showPasswordToggle && !error && !success && !suffix && (
//             <div className="text-muted-foreground transition-colors group-focus-within:text-primary">
//               {React.isValidElement(rightIcon) 
//                 ? React.cloneElement(rightIcon as React.ReactElement, { className: 'h-4 w-4' })
//                 : rightIcon
//               }
//             </div>
//           )}
//         </div>

//         {/* Floating label animation */}
//         {animated && label && (
//           <div className={cn(
//             "absolute left-3 transition-all duration-200 pointer-events-none",
//             (isFocused || currentValue) 
//               ? "-top-2 text-xs text-primary bg-card px-1" 
//               : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
//           )}>
//             {label}
//             {required && <span className="text-destructive ml-1">*</span>}
//           </div>
//         )}
//       </div>
//     )

//     // If floating label is used, don't show regular label
//     const showRegularLabel = label && !animated

//     // If no label or helper text, return just the input
//     if (!showRegularLabel && !error && !success && !helperText && !showCharCount) {
//       return inputElement
//     }

//     // Return input with label and helper text
//     return (
//       <div className="space-y-2">
//         {showRegularLabel && (
//           <label className={cn(
//             "text-sm font-medium leading-none transition-colors duration-200",
//             error ? "text-destructive" : "text-foreground",
//             required && "after:content-['*'] after:text-destructive after:ml-1"
//           )}>
//             {label}
//           </label>
//         )}
        
//         {inputElement}
        
//         <div className="flex items-center justify-between">
//           {(error || success || helperText) && (
//             <p className={cn(
//               "text-xs transition-colors duration-200 flex items-center gap-1",
//               error && "text-destructive animate-slide-down",
//               success && "text-success animate-slide-down",
//               !error && !success && "text-muted-foreground"
//             )}>
//               {error && <AlertCircle className="h-3 w-3 flex-shrink-0" />}
//               {success && <CheckCircle className="h-3 w-3 flex-shrink-0" />}
//               <span>{error || success || helperText}</span>
//             </p>
//           )}
          
//           {showCharCount && maxLength && (
//             <p className={cn(
//               "text-xs transition-colors duration-200",
//               charCount > maxLength * 0.9 ? "text-warning" : "text-muted-foreground",
//               charCount >= maxLength && "text-destructive"
//             )}>
//               {charCount}/{maxLength}
//             </p>
//           )}
//         </div>
//       </div>
//     )
//   }
// )
// Input.displayName = 'Input'

// // Enhanced specialized input components
// const SearchInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'leftIcon' | 'type'>>(
//   ({ placeholder = "Search files, sessions, or collaborators...", variant = "ghost", ...props }, ref) => (
//     <Input
//       ref={ref}
//       type="search"
//       variant={variant}
//       leftIcon={<Search className="h-4 w-4" />}
//       placeholder={placeholder}
//       clearable
//       animated
//       {...props}
//     />
//   )
// )
// SearchInput.displayName = 'SearchInput'

// const PasswordInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'type' | 'showPasswordToggle'>>(
//   ({ placeholder = "Enter your password", ...props }, ref) => (
//     <Input
//       ref={ref}
//       type="password"
//       showPasswordToggle
//       placeholder={placeholder}
//       animated
//       {...props}
//     />
//   )
// )
// PasswordInput.displayName = 'PasswordInput'

// const EmailInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>(
//   ({ placeholder = "Enter your email address", ...props }, ref) => (
//     <Input
//       ref={ref}
//       type="email"
//       placeholder={placeholder}
//       leftIcon={<Users className="h-4 w-4" />}
//       animated
//       {...props}
//     />
//   )
// )
// EmailInput.displayName = 'EmailInput'

// const NumberInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'type'> & {
//   min?: number
//   max?: number
//   step?: number
// }>(({ min, max, step = 1, ...props }, ref) => (
//   <Input
//     ref={ref}
//     type="number"
//     min={min}
//     max={max}
//     step={step}
//     animated
//     {...props}
//   />
// ))
// NumberInput.displayName = 'NumberInput'

// const FileInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'type'> & {
//   accept?: string
//   multiple?: boolean
// }>(({ accept, multiple = false, ...props }, ref) => (
//   <Input
//     ref={ref}
//     type="file"
//     accept={accept}
//     multiple={multiple}
//     leftIcon={<FileText className="h-4 w-4" />}
//     className="file:mr-3 file:px-3 file:py-1 file:rounded-lg file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:border-0 file:transition-colors file:duration-200"
//     {...props}
//   />
// ))
// FileInput.displayName = 'FileInput'

// // New CollabIDE-specific input components
// const SessionNameInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'variant' | 'leftIcon'>>(
//   ({ placeholder = "Enter session name...", ...props }, ref) => (
//     <Input
//       ref={ref}
//       variant="session"
//       leftIcon={<Code className="h-4 w-4" />}
//       placeholder={placeholder}
//       clearable
//       animated
//       glow
//       {...props}
//     />
//   )
// )
// SessionNameInput.displayName = 'SessionNameInput'

// const CollaboratorInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'variant' | 'leftIcon'>>(
//   ({ placeholder = "Add collaborator by email...", ...props }, ref) => (
//     <Input
//       ref={ref}
//       type="email"
//       variant="collaboration"
//       leftIcon={<Users className="h-4 w-4" />}
//       placeholder={placeholder}
//       clearable
//       animated
//       {...props}
//     />
//   )
// )
// CollaboratorInput.displayName = 'CollaboratorInput'

// const CodeInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'variant'>>(
//   ({ placeholder = "Enter code...", ...props }, ref) => (
//     <Input
//       ref={ref}
//       variant="editor"
//       placeholder={placeholder}
//       animated
//       {...props}
//     />
//   )
// )
// CodeInput.displayName = 'CodeInput'

// export { 
//   Input, 
//   SearchInput, 
//   PasswordInput, 
//   EmailInput, 
//   NumberInput, 
//   FileInput,
//   SessionNameInput,
//   CollaboratorInput,
//   CodeInput,
//   inputVariants 
// }


import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Eye, EyeOff, Search, X, AlertCircle, CheckCircle, Loader2, Code, Users, FileText, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  'flex w-full rounded-lg border bg-gray-800 text-white text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors relative',
  {
    variants: {
      variant: {
        default: 'border-gray-700 hover:border-gray-600 focus:border-blue-500',
        destructive: 'border-red-600 bg-red-900/20 text-red-200 focus-visible:ring-red-500',
        success: 'border-green-600 bg-green-900/20 text-green-200 focus-visible:ring-green-500',
        warning: 'border-yellow-600 bg-yellow-900/20 text-yellow-200 focus-visible:ring-yellow-500',
        info: 'border-blue-500 bg-blue-900/20 text-blue-200 focus-visible:ring-blue-500',
        ghost: 'border-transparent bg-transparent hover:bg-gray-800 focus:bg-gray-800',
        outline: 'border-2 border-gray-600 hover:border-blue-500 focus:border-blue-500 bg-transparent',
      },
      size: {
        xs: 'h-7 px-2 py-1 text-xs',
        sm: 'h-8 px-3 py-1.5 text-xs',
        default: 'h-10 px-3 py-2 text-sm',
        lg: 'h-11 px-4 py-3 text-base',
        xl: 'h-12 px-5 py-4 text-lg',
      },
      inputSize: {
        auto: '',
        full: 'w-full',
        xs: 'w-16',
        sm: 'w-24',
        md: 'w-32',
        lg: 'w-48',
        xl: 'w-64',
        '2xl': 'w-80',
        '3xl': 'w-96',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      inputSize: 'full',
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  clearable?: boolean
  onClear?: () => void
  loading?: boolean
  error?: string
  success?: string
  helperText?: string
  label?: string
  showPasswordToggle?: boolean
  required?: boolean
  showCharCount?: boolean
  maxLength?: number
  prefix?: string
  suffix?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant, 
    size, 
    inputSize,
    type,
    leftIcon,
    rightIcon,
    clearable = false,
    onClear,
    loading = false,
    error,
    success,
    helperText,
    label,
    showPasswordToggle = false,
    required = false,
    showCharCount = false,
    maxLength,
    prefix,
    suffix,
    value,
    onChange,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState(value || '')
    
    // Determine the actual type
    const actualType = type === 'password' && showPasswordToggle && showPassword ? 'text' : type

    // Determine variant based on state
    const currentVariant = error ? 'destructive' : success ? 'success' : variant

    // Handle value changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInternalValue(newValue)
      onChange?.(e)
    }

    // Handle clear
    const handleClear = () => {
      setInternalValue('')
      onClear?.()
      if (onChange) {
        const syntheticEvent = {
          target: { value: '' },
          currentTarget: { value: '' }
        } as React.ChangeEvent<HTMLInputElement>
        onChange(syntheticEvent)
      }
    }

    // Toggle password visibility
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    // Calculate character count
    const currentValue = value !== undefined ? value : internalValue
    const charCount = String(currentValue).length

    const inputElement = (
      <div className="relative">
        {/* Prefix */}
        {prefix && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none">
            {prefix}
          </div>
        )}

        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {React.isValidElement(leftIcon) 
              ? React.cloneElement(leftIcon as React.ReactElement, { className: 'h-4 w-4' })
              : leftIcon
            }
          </div>
        )}

        {/* Input */}
        <input
          type={actualType}
          className={cn(
            inputVariants({ variant: currentVariant, size, inputSize }),
            leftIcon || prefix ? 'pl-10' : 'px-3',
            (rightIcon || clearable || showPasswordToggle || loading || suffix) ? 'pr-10' : 'px-3',
            className
          )}
          ref={ref}
          value={value !== undefined ? value : internalValue}
          onChange={handleChange}
          maxLength={maxLength}
          {...props}
        />

        {/* Right Side Icons Container */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
          {/* Suffix */}
          {suffix && !loading && (
            <span className="text-gray-400 text-sm font-medium pointer-events-none">
              {suffix}
            </span>
          )}

          {/* Loading Spinner */}
          {loading && (
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          )}

          {/* Clear Button */}
          {clearable && !loading && currentValue && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-500 hover:text-gray-300 transition-colors rounded p-0.5"
              tabIndex={-1}
              aria-label="Clear input"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Password Toggle */}
          {showPasswordToggle && type === 'password' && !loading && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-gray-500 hover:text-gray-300 transition-colors rounded p-0.5"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}

          {/* Status Icons */}
          {!loading && error && (
            <AlertCircle className="h-4 w-4 text-red-400" />
          )}
          {!loading && success && (
            <CheckCircle className="h-4 w-4 text-green-400" />
          )}

          {/* Custom Right Icon */}
          {rightIcon && !loading && !clearable && !showPasswordToggle && !error && !success && !suffix && (
            <div className="text-gray-500">
              {React.isValidElement(rightIcon) 
                ? React.cloneElement(rightIcon as React.ReactElement, { className: 'h-4 w-4' })
                : rightIcon
              }
            </div>
          )}
        </div>
      </div>
    )

    // If no label or helper text, return just the input
    if (!label && !error && !success && !helperText && !showCharCount) {
      return inputElement
    }

    // Return input with label and helper text
    return (
      <div className="space-y-2">
        {label && (
          <label className={cn(
            "text-sm font-medium leading-none transition-colors",
            error ? "text-red-400" : "text-gray-300",
            required && "after:content-['*'] after:text-red-400 after:ml-1"
          )}>
            {label}
          </label>
        )}
        
        {inputElement}
        
        <div className="flex items-center justify-between">
          {(error || success || helperText) && (
            <p className={cn(
              "text-xs transition-colors flex items-center gap-1",
              error && "text-red-400",
              success && "text-green-400",
              !error && !success && "text-gray-400"
            )}>
              {error && <AlertCircle className="h-3 w-3 flex-shrink-0" />}
              {success && <CheckCircle className="h-3 w-3 flex-shrink-0" />}
              <span>{error || success || helperText}</span>
            </p>
          )}
          
          {showCharCount && maxLength && (
            <p className={cn(
              "text-xs transition-colors",
              charCount > maxLength * 0.9 ? "text-yellow-400" : "text-gray-400",
              charCount >= maxLength && "text-red-400"
            )}>
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)
Input.displayName = 'Input'

// Specialized input components
const SearchInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'leftIcon' | 'type'>>(
  ({ placeholder = "Search...", variant = "ghost", ...props }, ref) => (
    <Input
      ref={ref}
      type="search"
      variant={variant}
      leftIcon={<Search className="h-4 w-4" />}
      placeholder={placeholder}
      clearable
      {...props}
    />
  )
)
SearchInput.displayName = 'SearchInput'

const PasswordInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'type' | 'showPasswordToggle'>>(
  ({ placeholder = "Enter your password", ...props }, ref) => (
    <Input
      ref={ref}
      type="password"
      showPasswordToggle
      placeholder={placeholder}
      {...props}
    />
  )
)
PasswordInput.displayName = 'PasswordInput'

const EmailInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>(
  ({ placeholder = "Enter your email address", ...props }, ref) => (
    <Input
      ref={ref}
      type="email"
      placeholder={placeholder}
      leftIcon={<Mail className="h-4 w-4" />}
      {...props}
    />
  )
)
EmailInput.displayName = 'EmailInput'

const NumberInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'type'> & {
  min?: number
  max?: number
  step?: number
}>(({ min, max, step = 1, ...props }, ref) => (
  <Input
    ref={ref}
    type="number"
    min={min}
    max={max}
    step={step}
    {...props}
  />
))
NumberInput.displayName = 'NumberInput'

const FileInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'type'> & {
  accept?: string
  multiple?: boolean
}>(({ accept, multiple = false, ...props }, ref) => (
  <Input
    ref={ref}
    type="file"
    accept={accept}
    multiple={multiple}
    leftIcon={<FileText className="h-4 w-4" />}
    className="file:mr-3 file:px-3 file:py-1 file:rounded file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:border-0 file:transition-colors"
    {...props}
  />
))
FileInput.displayName = 'FileInput'

// CollabIDE-specific inputs
const SessionNameInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'leftIcon'>>(
  ({ placeholder = "Enter session name...", ...props }, ref) => (
    <Input
      ref={ref}
      leftIcon={<Code className="h-4 w-4" />}
      placeholder={placeholder}
      clearable
      {...props}
    />
  )
)
SessionNameInput.displayName = 'SessionNameInput'

const CollaboratorInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'leftIcon'>>(
  ({ placeholder = "Add collaborator by email...", ...props }, ref) => (
    <Input
      ref={ref}
      type="email"
      leftIcon={<Users className="h-4 w-4" />}
      placeholder={placeholder}
      clearable
      {...props}
    />
  )
)
CollaboratorInput.displayName = 'CollaboratorInput'

const CodeInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder = "Enter code...", className, ...props }, ref) => (
    <Input
      ref={ref}
      placeholder={placeholder}
      className={cn("font-mono", className)}
      {...props}
    />
  )
)
CodeInput.displayName = 'CodeInput'

export { 
  Input, 
  SearchInput, 
  PasswordInput, 
  EmailInput, 
  NumberInput, 
  FileInput,
  SessionNameInput,
  CollaboratorInput,
  CodeInput,
  inputVariants 
}
