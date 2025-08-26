
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Eye, EyeOff, Search, X, AlertCircle, CheckCircle, Loader2, Code, Users, FileText, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  [
    'flex',
    'w-full',
    'rounded-lg',
    'border',
    'text-sm',
    'transition-all',
    'duration-200',
    'ease-in-out',
    'file:border-0',
    'file:bg-transparent',
    'file:text-sm',
    'file:font-medium',
    'placeholder:transition-colors',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-offset-2',
    'focus-visible:ring-offset-background',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',
    'disabled:bg-surface-elevated/50'
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-surface',
          'text-foreground',
          'border-border',
          'placeholder:text-placeholder',
          'hover:border-border-strong',
          'focus:border-primary',
          'focus-visible:ring-primary/20'
        ],
        destructive: [
          'bg-destructive/10',
          'text-foreground',
          'border-destructive',
          'placeholder:text-destructive/60',
          'focus:border-destructive',
          'focus-visible:ring-destructive/20'
        ],
        success: [
          'bg-success/10',
          'text-foreground',
          'border-success',
          'placeholder:text-success/60',
          'focus:border-success',
          'focus-visible:ring-success/20'
        ],
        warning: [
          'bg-warning/10',
          'text-foreground',
          'border-warning',
          'placeholder:text-warning/60',
          'focus:border-warning',
          'focus-visible:ring-warning/20'
        ],
        info: [
          'bg-info/10',
          'text-foreground',
          'border-info',
          'placeholder:text-info/60',
          'focus:border-info',
          'focus-visible:ring-info/20'
        ],
        ghost: [
          'bg-transparent',
          'text-foreground',
          'border-transparent',
          'placeholder:text-foreground-muted',
          'hover:bg-surface-hover',
          'focus:bg-surface',
          'focus:border-border'
        ],
        outline: [
          'bg-transparent',
          'text-foreground',
          'border-2',
          'border-border-strong',
          'placeholder:text-foreground-muted',
          'hover:border-primary/50',
          'focus:border-primary',
          'focus-visible:ring-primary/20'
        ],
        elevated: [
          'bg-surface-elevated',
          'text-foreground',
          'border-border',
          'placeholder:text-foreground-muted',
          'hover:border-border-strong',
          'focus:border-primary',
          'focus-visible:ring-primary/20',
          'shadow-sm'
        ],
        glass: [
          'bg-surface/60',
          'backdrop-blur-md',
          'text-foreground',
          'border-border/30',
          'placeholder:text-foreground-muted',
          'hover:bg-surface/80',
          'focus:bg-surface/90',
          'focus:border-primary/50',
          'focus-visible:ring-primary/10'
        ]
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
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        default: 'rounded-lg',
        md: 'rounded-md',
        lg: 'rounded-xl',
        xl: 'rounded-2xl',
        full: 'rounded-full'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      inputSize: 'full',
      rounded: 'default'
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
    rounded,
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
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted text-sm font-medium pointer-events-none z-10">
            {prefix}
          </div>
        )}

        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted z-10">
            {React.isValidElement(leftIcon) 
              ? React.cloneElement(leftIcon as React.ReactElement, { 
                  className: cn('h-4 w-4', (leftIcon as any).props?.className) 
                })
              : leftIcon
            }
          </div>
        )}

        {/* Input */}
        <input
          type={actualType}
          className={cn(
            inputVariants({ variant: currentVariant, size, inputSize, rounded }),
            leftIcon || prefix ? 'pl-10' : '',
            (rightIcon || clearable || showPasswordToggle || loading || suffix) ? 'pr-10' : '',
            className
          )}
          ref={ref}
          value={value !== undefined ? value : internalValue}
          onChange={handleChange}
          maxLength={maxLength}
          {...props}
        />

        {/* Right Side Icons Container */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 z-10">
          {/* Suffix */}
          {suffix && !loading && (
            <span className="text-foreground-muted text-sm font-medium pointer-events-none">
              {suffix}
            </span>
          )}

          {/* Loading Spinner */}
          {loading && (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          )}

          {/* Clear Button */}
          {clearable && !loading && currentValue && (
            <button
              type="button"
              onClick={handleClear}
              className="text-foreground-muted hover:text-foreground transition-colors rounded-sm p-0.5 hover:bg-surface-hover"
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
              className="text-foreground-muted hover:text-foreground transition-colors rounded-sm p-0.5 hover:bg-surface-hover"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}

          {/* Status Icons */}
          {!loading && error && (
            <AlertCircle className="h-4 w-4 text-destructive" />
          )}
          {!loading && success && (
            <CheckCircle className="h-4 w-4 text-success" />
          )}

          {/* Custom Right Icon */}
          {rightIcon && !loading && !clearable && !showPasswordToggle && !error && !success && !suffix && (
            <div className="text-foreground-muted">
              {React.isValidElement(rightIcon) 
                ? React.cloneElement(rightIcon as React.ReactElement, { 
                    className: cn('h-4 w-4', (rightIcon as any).props?.className) 
                  })
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
            error ? "text-destructive" : "text-foreground",
            required && "after:content-['*'] after:text-destructive after:ml-1"
          )}>
            {label}
          </label>
        )}
        
        {inputElement}
        
        <div className="flex items-center justify-between">
          {(error || success || helperText) && (
            <p className={cn(
              "text-xs transition-colors flex items-center gap-1",
              error && "text-destructive",
              success && "text-success", 
              !error && !success && "text-foreground-muted"
            )}>
              {error && <AlertCircle className="h-3 w-3 flex-shrink-0" />}
              {success && <CheckCircle className="h-3 w-3 flex-shrink-0" />}
              <span>{error || success || helperText}</span>
            </p>
          )}
          
          {showCharCount && maxLength && (
            <p className={cn(
              "text-xs transition-colors",
              charCount > maxLength * 0.9 ? "text-warning" : "text-foreground-muted",
              charCount >= maxLength && "text-destructive"
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

// Specialized input components with centralized theme
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
}>(({ accept, multiple = false, className, ...props }, ref) => (
  <Input
    ref={ref}
    type="file"
    accept={accept}
    multiple={multiple}
    leftIcon={<FileText className="h-4 w-4" />}
    className={cn(
      "file:mr-3 file:px-3 file:py-1 file:rounded file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:border-0 file:transition-colors cursor-pointer",
      className
    )}
    {...props}
  />
))
FileInput.displayName = 'FileInput'

// Glass Input for modern UI
const GlassInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'variant'>>(
  ({ ...props }, ref) => (
    <Input
      ref={ref}
      variant="glass"
      {...props}
    />
  )
)
GlassInput.displayName = 'GlassInput'

// Elevated Input for cards and modals
const ElevatedInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'variant'>>(
  ({ ...props }, ref) => (
    <Input
      ref={ref}
      variant="elevated"
      {...props}
    />
  )
)
ElevatedInput.displayName = 'ElevatedInput'

// CollabIDE-specific inputs with centralized theme
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

// OTP/Pin Input for authentication
const PinInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'type' | 'maxLength' | 'inputSize'>>(
  ({ className, ...props }, ref) => (
    <Input
      ref={ref}
      type="text"
      maxLength={1}
      inputSize="xs"
      className={cn("text-center font-mono text-lg", className)}
      {...props}
    />
  )
)
PinInput.displayName = 'PinInput'

export { 
  Input, 
  SearchInput, 
  PasswordInput, 
  EmailInput, 
  NumberInput, 
  FileInput,
  GlassInput,
  ElevatedInput,
  SessionNameInput,
  CollaboratorInput,
  CodeInput,
  PinInput,
  inputVariants 
}
