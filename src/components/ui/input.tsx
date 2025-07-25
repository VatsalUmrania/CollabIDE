import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Eye, EyeOff, Search, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  'flex w-full rounded-md border bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border-input hover:border-primary/50',
        destructive: 'border-destructive focus-visible:ring-destructive',
        success: 'border-green-500 focus-visible:ring-green-500',
        warning: 'border-yellow-500 focus-visible:ring-yellow-500',
        ghost: 'border-transparent bg-transparent hover:bg-accent',
        outline: 'border-2 border-input hover:border-primary',
      },
      size: {
        sm: 'h-8 px-2 py-1 text-xs',
        default: 'h-10 px-3 py-2',
        lg: 'h-12 px-4 py-3 text-base',
        xl: 'h-14 px-5 py-4 text-lg',
      },
      inputSize: {
        auto: '',
        full: 'w-full',
        xs: 'w-16',
        sm: 'w-24',
        md: 'w-32',
        lg: 'w-48',
        xl: 'w-64',
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

    const inputElement = (
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}

        {/* Input */}
        <input
          type={actualType}
          className={cn(
            inputVariants({ variant: currentVariant, size, inputSize }),
            leftIcon && 'pl-10',
            (rightIcon || clearable || showPasswordToggle || loading) && 'pr-10',
            className
          )}
          ref={ref}
          value={value !== undefined ? value : internalValue}
          onChange={handleChange}
          {...props}
        />

        {/* Right Side Icons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
          {/* Loading Spinner */}
          {loading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}

          {/* Clear Button */}
          {clearable && !loading && internalValue && (
            <button
              type="button"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Password Toggle */}
          {showPasswordToggle && type === 'password' && !loading && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}

          {/* Status Icons */}
          {!loading && error && (
            <AlertCircle className="h-4 w-4 text-destructive" />
          )}
          {!loading && success && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}

          {/* Custom Right Icon */}
          {rightIcon && !loading && !clearable && !showPasswordToggle && !error && !success && (
            <div className="text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>
      </div>
    )

    // If no label or helper text, return just the input
    if (!label && !error && !success && !helperText) {
      return inputElement
    }

    // Return input with label and helper text
    return (
      <div className="space-y-2">
        {label && (
          <label className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            error && "text-destructive"
          )}>
            {label}
          </label>
        )}
        {inputElement}
        {(error || success || helperText) && (
          <p className={cn(
            "text-xs",
            error && "text-destructive",
            success && "text-green-600",
            !error && !success && "text-muted-foreground"
          )}>
            {error || success || helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

// Specialized input components
const SearchInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'leftIcon' | 'type'>>(
  ({ placeholder = "Search...", ...props }, ref) => (
    <Input
      ref={ref}
      type="search"
      leftIcon={<Search className="h-4 w-4" />}
      placeholder={placeholder}
      clearable
      {...props}
    />
  )
)
SearchInput.displayName = 'SearchInput'

const PasswordInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'type' | 'showPasswordToggle'>>(
  (props, ref) => (
    <Input
      ref={ref}
      type="password"
      showPasswordToggle
      {...props}
    />
  )
)
PasswordInput.displayName = 'PasswordInput'

const EmailInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>(
  ({ ...props }, ref) => (
    <Input
      ref={ref}
      type="email"
      placeholder="Enter your email"
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
    className="file:mr-3 file:px-3 file:py-1 file:rounded file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
    {...props}
  />
))
FileInput.displayName = 'FileInput'

export { 
  Input, 
  SearchInput, 
  PasswordInput, 
  EmailInput, 
  NumberInput, 
  FileInput, 
  inputVariants 
}
