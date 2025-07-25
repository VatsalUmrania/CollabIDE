"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, ChevronDown, ChevronUp, Search, X, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const selectTriggerVariants = cva(
  "flex w-full items-center justify-between rounded-md border bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-input hover:border-primary/50",
        destructive: "border-destructive focus:ring-destructive",
        success: "border-green-500 focus:ring-green-500",
        warning: "border-yellow-500 focus:ring-yellow-500",
        ghost: "border-transparent bg-transparent hover:bg-accent",
        outline: "border-2 border-input hover:border-primary",
      },
      size: {
        sm: "h-8 px-2 py-1 text-xs",
        default: "h-10 px-3 py-2",
        lg: "h-12 px-4 py-3 text-base",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const selectContentVariants = cva(
  "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
      }
    },
    defaultVariants: {
      size: "default",
    },
  }
)

// Enhanced Select Root with additional props
interface SelectProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {
  placeholder?: string
  label?: string
  description?: string
  error?: string
  success?: string
  required?: boolean
  loading?: boolean
  searchable?: boolean
  clearable?: boolean
  onClear?: () => void
}

const Select = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Root>,
  SelectProps
>(({ 
  placeholder,
  label,
  description,
  error,
  success,
  required,
  loading,
  searchable,
  clearable,
  onClear,
  children,
  ...props 
}, ref) => {
  const selectContent = (
    <SelectPrimitive.Root {...props}>
      {children}
    </SelectPrimitive.Root>
  )

  // If no label or helper text, return just the select
  if (!label && !error && !success && !description) {
    return selectContent
  }

  // Return select with label wrapper
  return (
    <div className="space-y-2">
      {label && (
        <label className={cn(
          "text-sm font-medium leading-none",
          error && "text-destructive",
          success && "text-green-600"
        )}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      {selectContent}
      {(error || success || description) && (
        <p className={cn(
          "text-xs",
          error && "text-destructive",
          success && "text-green-600",
          !error && !success && "text-muted-foreground"
        )}>
          {error || success || description}
        </p>
      )}
    </div>
  )
})
Select.displayName = "Select"

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

interface SelectTriggerProps 
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {
  loading?: boolean
  error?: boolean
  success?: boolean
  icon?: React.ReactNode
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, variant, size, loading, error, success, icon, children, ...props }, ref) => {
  const currentVariant = error ? 'destructive' : success ? 'success' : variant

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(selectTriggerVariants({ variant: currentVariant, size }), className)}
      {...props}
    >
      <div className="flex items-center space-x-2 flex-1">
        {icon && (
          <span className="text-muted-foreground flex-shrink-0">
            {icon}
          </span>
        )}
        <span className="flex-1 text-left">
          {children}
        </span>
      </div>
      <div className="flex items-center space-x-1">
        {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        {error && !loading && <AlertCircle className="h-4 w-4 text-destructive" />}
        {success && !loading && <Check className="h-4 w-4 text-green-500" />}
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectPrimitive.Icon>
      </div>
    </SelectPrimitive.Trigger>
  )
})
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

interface SelectContentProps 
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>,
    VariantProps<typeof selectContentVariants> {
  searchable?: boolean
  onSearch?: (value: string) => void
}

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(({ className, children, position = "popper", size, searchable, onSearch, ...props }, ref) => {
  const [searchValue, setSearchValue] = React.useState("")

  const handleSearch = (value: string) => {
    setSearchValue(value)
    onSearch?.(value)
  }

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          selectContentVariants({ size }),
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        {searchable && (
          <div className="flex items-center border-b px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground mr-2" />
            <input
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchValue && (
              <button
                onClick={() => handleSearch("")}
                className="text-muted-foreground hover:text-foreground ml-2"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
})
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  icon?: React.ReactNode
  description?: string
  badge?: React.ReactNode
}

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ className, children, icon, description, badge, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <div className="flex items-center space-x-2 flex-1 min-w-0">
      {icon && (
        <span className="flex-shrink-0 text-muted-foreground">
          {icon}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <SelectPrimitive.ItemText className="block truncate">
          {children}
        </SelectPrimitive.ItemText>
        {description && (
          <div className="text-xs text-muted-foreground truncate">
            {description}
          </div>
        )}
      </div>
      {badge && (
        <span className="flex-shrink-0 ml-2">
          {badge}
        </span>
      )}
    </div>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

// Specialized Select Components
const LanguageSelect = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Root>,
  SelectProps & {
    languages?: Array<{
      value: string
      label: string
      icon?: string
      description?: string
    }>
  }
>(({ languages = [], ...props }, ref) => {
  const defaultLanguages = [
    { value: 'javascript', label: 'JavaScript', icon: '🟨', description: 'Modern web development' },
    { value: 'typescript', label: 'TypeScript', icon: '🔷', description: 'JavaScript with types' },
    { value: 'python', label: 'Python', icon: '🐍', description: 'General purpose programming' },
    { value: 'html', label: 'HTML', icon: '🌐', description: 'Markup language' },
    { value: 'css', label: 'CSS', icon: '🎨', description: 'Styling and layout' },
    { value: 'cpp', label: 'C++', icon: '🔵', description: 'System programming' },
  ]

  const languageOptions = languages.length > 0 ? languages : defaultLanguages

  return (
    <Select {...props}>
      <SelectTrigger>
        <SelectValue placeholder="Select language..." />
      </SelectTrigger>
      <SelectContent>
        {languageOptions.map((lang) => (
          <SelectItem 
            key={lang.value} 
            value={lang.value}
            icon={lang.icon && <span className="text-base">{lang.icon}</span>}
            description={lang.description}
          >
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
})
LanguageSelect.displayName = 'LanguageSelect'

const StatusSelect = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Root>,
  SelectProps
>(({ ...props }, ref) => (
  <Select {...props}>
    <SelectTrigger>
      <SelectValue placeholder="Select status..." />
    </SelectTrigger>
    <SelectContent>
      <SelectItem 
        value="active"
        icon={<div className="w-2 h-2 rounded-full bg-green-500" />}
      >
        Active
      </SelectItem>
      <SelectItem 
        value="inactive"
        icon={<div className="w-2 h-2 rounded-full bg-gray-400" />}
      >
        Inactive
      </SelectItem>
      <SelectItem 
        value="pending"
        icon={<div className="w-2 h-2 rounded-full bg-yellow-500" />}
      >
        Pending
      </SelectItem>
      <SelectItem 
        value="error"
        icon={<div className="w-2 h-2 rounded-full bg-red-500" />}
      >
        Error
      </SelectItem>
    </SelectContent>
  </Select>
))
StatusSelect.displayName = 'StatusSelect'

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  LanguageSelect,
  StatusSelect,
}
