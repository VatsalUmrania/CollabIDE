// "use client"

// import * as React from "react"
// import * as SelectPrimitive from "@radix-ui/react-select"
// import { cva, type VariantProps } from "class-variance-authority"
// import { 
//   Check, 
//   ChevronDown, 
//   ChevronUp, 
//   Search, 
//   X, 
//   AlertCircle, 
//   Loader2,
//   Users,
//   Code,
//   Settings,
//   Crown,
//   Globe
// } from "lucide-react"
// import { cn } from "@/lib/utils"

// const selectTriggerVariants = cva(
//   "flex w-full items-center justify-between rounded-lg border bg-card text-foreground text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 transition-all duration-300 backdrop-blur-sm relative overflow-hidden",
//   {
//     variants: {
//       variant: {
//         default: "border-border/50 hover:border-primary/50 focus:border-primary bg-card/80 shadow-sm hover:shadow-md",
//         destructive: "border-destructive/50 focus:ring-destructive bg-destructive/5 shadow-sm shadow-destructive/10",
//         success: "border-success/50 focus:ring-success bg-success/5 shadow-sm shadow-success/10",
//         warning: "border-warning/50 focus:ring-warning bg-warning/5 shadow-sm shadow-warning/10",
//         info: "border-info/50 focus:ring-info bg-info/5 shadow-sm shadow-info/10",
//         ghost: "border-transparent bg-transparent hover:bg-accent/50 focus:bg-card/50",
//         outline: "border-2 border-border hover:border-primary focus:border-primary bg-transparent",
//         glass: "glass-effect border-border/30 hover:border-primary/50 focus:border-primary/70 shadow-lg",
//         // CollabIDE-specific variants
//         collaboration: "border-accent-purple/30 bg-accent-purple/5 hover:border-accent-purple/50 focus:border-accent-purple shadow-sm shadow-accent-purple/10",
//         session: "border-accent-blue/30 bg-accent-blue/5 hover:border-accent-blue/50 focus:border-accent-blue shadow-sm shadow-accent-blue/10",
//         editor: "border-border/50 bg-editor-background hover:border-primary/50 focus:border-primary font-mono",
//       },
//       size: {
//         xs: "h-7 px-2 py-1 text-xs rounded-md",
//         sm: "h-8 px-3 py-1.5 text-xs rounded-md",
//         default: "h-10 px-3 py-2 text-sm",
//         lg: "h-12 px-4 py-3 text-base rounded-xl",
//         xl: "h-14 px-5 py-4 text-lg rounded-xl",
//       }
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//     },
//   }
// )

// const selectContentVariants = cva(
//   "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-xl backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
//   {
//     variants: {
//       variant: {
//         default: "border-border/50 bg-popover/95",
//         glass: "glass-card border-border/30",
//       },
//       size: {
//         xs: "text-xs",
//         sm: "text-xs",
//         default: "text-sm",
//         lg: "text-base",
//         xl: "text-lg",
//       }
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//     },
//   }
// )

// // Enhanced Select Root with additional props
// interface SelectProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {
//   placeholder?: string
//   label?: string
//   description?: string
//   error?: string
//   success?: string
//   required?: boolean
//   loading?: boolean
//   searchable?: boolean
//   clearable?: boolean
//   onClear?: () => void
//   animated?: boolean
//   glow?: boolean
// }

// const Select = React.forwardRef<
//   React.ElementRef<typeof SelectPrimitive.Root>,
//   SelectProps
// >(({ 
//   placeholder,
//   label,
//   description,
//   error,
//   success,
//   required,
//   loading,
//   searchable,
//   clearable,
//   onClear,
//   animated = true,
//   glow = false,
//   children,
//   ...props 
// }, ref) => {
//   const selectContent = (
//     <SelectPrimitive.Root {...props}>
//       {children}
//     </SelectPrimitive.Root>
//   )

//   // If no label or helper text, return just the select
//   if (!label && !error && !success && !description) {
//     return selectContent
//   }

//   // Return select with label wrapper
//   return (
//     <div className="space-y-2">
//       {label && (
//         <label className={cn(
//           "text-sm font-medium leading-none transition-colors duration-200",
//           error ? "text-destructive" : success ? "text-success" : "text-foreground",
//           required && "after:content-['*'] after:text-destructive after:ml-1"
//         )}>
//           {label}
//         </label>
//       )}
//       {selectContent}
//       {(error || success || description) && (
//         <div className="flex items-start gap-1">
//           {error && <AlertCircle className="h-3 w-3 text-destructive mt-0.5 flex-shrink-0" />}
//           <p className={cn(
//             "text-xs transition-colors duration-200",
//             error ? "text-destructive animate-slide-down" : success ? "text-success" : "text-muted-foreground"
//           )}>
//             {error || success || description}
//           </p>
//         </div>
//       )}
//     </div>
//   )
// })
// Select.displayName = "Select"

// const SelectGroup = SelectPrimitive.Group

// const SelectValue = SelectPrimitive.Value

// interface SelectTriggerProps 
//   extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
//     VariantProps<typeof selectTriggerVariants> {
//   loading?: boolean
//   error?: boolean
//   success?: boolean
//   icon?: React.ReactNode
//   clearable?: boolean
//   onClear?: () => void
//   glow?: boolean
// }

// const SelectTrigger = React.forwardRef<
//   React.ElementRef<typeof SelectPrimitive.Trigger>,
//   SelectTriggerProps
// >(({ 
//   className, 
//   variant, 
//   size, 
//   loading, 
//   error, 
//   success, 
//   icon, 
//   clearable,
//   onClear,
//   glow = false,
//   children, 
//   ...props 
// }, ref) => {
//   const [isFocused, setIsFocused] = React.useState(false)
//   const currentVariant = error ? 'destructive' : success ? 'success' : variant

//   const handleClear = (e: React.MouseEvent) => {
//     e.stopPropagation()
//     onClear?.()
//   }

//   return (
//     <SelectPrimitive.Trigger
//       ref={ref}
//       className={cn(
//         selectTriggerVariants({ variant: currentVariant, size }),
//         glow && isFocused && "animate-glow",
//         className
//       )}
//       onFocus={() => setIsFocused(true)}
//       onBlur={() => setIsFocused(false)}
//       {...props}
//     >
//       {/* Focus ring animation */}
//       {isFocused && (
//         <div className="absolute inset-0 rounded-inherit bg-primary/20 animate-ping" />
//       )}

//       <div className="flex items-center space-x-2 flex-1 min-w-0 relative z-10">
//         {icon && (
//           <span className="text-muted-foreground flex-shrink-0 transition-colors group-focus-within:text-primary">
//             {React.isValidElement(icon) 
//               ? React.cloneElement(icon as React.ReactElement, { className: 'h-4 w-4' })
//               : icon
//             }
//           </span>
//         )}
//         <span className="flex-1 text-left truncate">
//           {children}
//         </span>
//       </div>
      
//       <div className="flex items-center space-x-1 relative z-10">
//         {clearable && (
//           <button
//             type="button"
//             onClick={handleClear}
//             className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110 active:scale-95 rounded-sm p-0.5"
//             tabIndex={-1}
//             aria-label="Clear selection"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         )}
//         {loading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
//         {error && !loading && <AlertCircle className="h-4 w-4 text-destructive animate-scale-in" />}
//         {success && !loading && <Check className="h-4 w-4 text-success animate-scale-in" />}
//         <SelectPrimitive.Icon asChild>
//           <ChevronDown className="h-4 w-4 opacity-50 transition-transform duration-200 data-[state=open]:rotate-180" />
//         </SelectPrimitive.Icon>
//       </div>
//     </SelectPrimitive.Trigger>
//   )
// })
// SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

// const SelectScrollUpButton = React.forwardRef<
//   React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
//   React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
// >(({ className, ...props }, ref) => (
//   <SelectPrimitive.ScrollUpButton
//     ref={ref}
//     className={cn(
//       "flex cursor-default items-center justify-center py-1 hover:bg-accent transition-colors",
//       className
//     )}
//     {...props}
//   >
//     <ChevronUp className="h-4 w-4" />
//   </SelectPrimitive.ScrollUpButton>
// ))
// SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

// const SelectScrollDownButton = React.forwardRef<
//   React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
//   React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
// >(({ className, ...props }, ref) => (
//   <SelectPrimitive.ScrollDownButton
//     ref={ref}
//     className={cn(
//       "flex cursor-default items-center justify-center py-1 hover:bg-accent transition-colors",
//       className
//     )}
//     {...props}
//   >
//     <ChevronDown className="h-4 w-4" />
//   </SelectPrimitive.ScrollDownButton>
// ))
// SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

// interface SelectContentProps 
//   extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>,
//     VariantProps<typeof selectContentVariants> {
//   searchable?: boolean
//   onSearch?: (value: string) => void
//   emptyMessage?: string
// }

// const SelectContent = React.forwardRef<
//   React.ElementRef<typeof SelectPrimitive.Content>,
//   SelectContentProps
// >(({ 
//   className, 
//   children, 
//   position = "popper", 
//   variant,
//   size, 
//   searchable, 
//   onSearch,
//   emptyMessage = "No results found.",
//   ...props 
// }, ref) => {
//   const [searchValue, setSearchValue] = React.useState("")

//   const handleSearch = (value: string) => {
//     setSearchValue(value)
//     onSearch?.(value)
//   }

//   const clearSearch = () => {
//     setSearchValue("")
//     onSearch?.("")
//   }

//   return (
//     <SelectPrimitive.Portal>
//       <SelectPrimitive.Content
//         ref={ref}
//         className={cn(
//           selectContentVariants({ variant, size }),
//           position === "popper" &&
//             "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
//           className
//         )}
//         position={position}
//         {...props}
//       >
//         <SelectScrollUpButton />
//         {searchable && (
//           <div className="flex items-center border-b border-border/50 px-3 py-2 bg-muted/20">
//             <Search className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
//             <input
//               className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
//               placeholder="Search options..."
//               value={searchValue}
//               onChange={(e) => handleSearch(e.target.value)}
//               autoFocus
//             />
//             {searchValue && (
//               <button
//                 onClick={clearSearch}
//                 className="text-muted-foreground hover:text-foreground ml-2 transition-colors hover:scale-110 active:scale-95"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             )}
//           </div>
//         )}
//         <SelectPrimitive.Viewport
//           className={cn(
//             "p-1",
//             position === "popper" &&
//               "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
//           )}
//         >
//           {children}
//         </SelectPrimitive.Viewport>
//         <SelectScrollDownButton />
//       </SelectPrimitive.Content>
//     </SelectPrimitive.Portal>
//   )
// })
// SelectContent.displayName = SelectPrimitive.Content.displayName

// const SelectLabel = React.forwardRef<
//   React.ElementRef<typeof SelectPrimitive.Label>,
//   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
// >(({ className, ...props }, ref) => (
//   <SelectPrimitive.Label
//     ref={ref}
//     className={cn(
//       "py-2 pl-3 pr-2 text-sm font-semibold text-muted-foreground bg-muted/50 border-b border-border/30",
//       className
//     )}
//     {...props}
//   />
// ))
// SelectLabel.displayName = SelectPrimitive.Label.displayName

// interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
//   icon?: React.ReactNode
//   description?: string
//   badge?: React.ReactNode
//   variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info'
// }

// const SelectItem = React.forwardRef<
//   React.ElementRef<typeof SelectPrimitive.Item>,
//   SelectItemProps
// >(({ className, children, icon, description, badge, variant, ...props }, ref) => {
//   const variantClasses = {
//     default: "",
//     success: "data-[highlighted]:bg-success/10 data-[highlighted]:text-success-foreground",
//     warning: "data-[highlighted]:bg-warning/10 data-[highlighted]:text-warning-foreground",
//     destructive: "data-[highlighted]:bg-destructive/10 data-[highlighted]:text-destructive-foreground",
//     info: "data-[highlighted]:bg-info/10 data-[highlighted]:text-info-foreground",
//   }

//   return (
//     <SelectPrimitive.Item
//       ref={ref}
//       className={cn(
//         "relative flex w-full cursor-default select-none items-center rounded-lg py-2 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors duration-200 hover:bg-accent/50",
//         variant && variantClasses[variant],
//         className
//       )}
//       {...props}
//     >
//       <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
//         <SelectPrimitive.ItemIndicator>
//           <Check className="h-4 w-4 animate-scale-in" />
//         </SelectPrimitive.ItemIndicator>
//       </span>

//       <div className="flex items-center space-x-2 flex-1 min-w-0">
//         {icon && (
//           <span className="flex-shrink-0 text-muted-foreground transition-colors">
//             {React.isValidElement(icon) 
//               ? React.cloneElement(icon as React.ReactElement, { className: 'h-4 w-4' })
//               : icon
//             }
//           </span>
//         )}
//         <div className="flex-1 min-w-0">
//           <SelectPrimitive.ItemText className="block truncate font-medium">
//             {children}
//           </SelectPrimitive.ItemText>
//           {description && (
//             <div className="text-xs text-muted-foreground truncate opacity-80">
//               {description}
//             </div>
//           )}
//         </div>
//         {badge && (
//           <span className="flex-shrink-0 ml-2">
//             {badge}
//           </span>
//         )}
//       </div>
//     </SelectPrimitive.Item>
//   )
// })
// SelectItem.displayName = SelectPrimitive.Item.displayName

// const SelectSeparator = React.forwardRef<
//   React.ElementRef<typeof SelectPrimitive.Separator>,
//   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
// >(({ className, ...props }, ref) => (
//   <SelectPrimitive.Separator
//     ref={ref}
//     className={cn("my-1 h-px bg-border/50", className)}
//     {...props}
//   />
// ))
// SelectSeparator.displayName = SelectPrimitive.Separator.displayName

// // Enhanced specialized Select components for CollabIDE
// const LanguageSelect = React.forwardRef<
//   React.ElementRef<typeof SelectPrimitive.Root>,
//   SelectProps & {
//     languages?: Array<{
//       value: string
//       label: string
//       icon?: string
//       description?: string
//       badge?: string
//     }>
//     showDescription?: boolean
//   }
// >(({ languages = [], showDescription = true, ...props }, ref) => {
//   const defaultLanguages = [
//     { 
//       value: 'javascript', 
//       label: 'JavaScript', 
//       icon: '🟨', 
//       description: 'Modern web development',
//       badge: 'Popular'
//     },
//     { 
//       value: 'typescript', 
//       label: 'TypeScript', 
//       icon: '🔷', 
//       description: 'JavaScript with static typing',
//       badge: 'Recommended'
//     },
//     { 
//       value: 'python', 
//       label: 'Python', 
//       icon: '🐍', 
//       description: 'General purpose programming'
//     },
//     { 
//       value: 'react', 
//       label: 'React (JSX)', 
//       icon: '⚛️', 
//       description: 'React components and JSX'
//     },
//     { 
//       value: 'html', 
//       label: 'HTML', 
//       icon: '🌐', 
//       description: 'Markup language'
//     },
//     { 
//       value: 'css', 
//       label: 'CSS', 
//       icon: '🎨', 
//       description: 'Styling and layout'
//     },
//     { 
//       value: 'cpp', 
//       label: 'C++', 
//       icon: '🔵', 
//       description: 'System programming'
//     },
//     { 
//       value: 'java', 
//       label: 'Java', 
//       icon: '☕', 
//       description: 'Enterprise development'
//     },
//   ]

//   const languageOptions = languages.length > 0 ? languages : defaultLanguages

//   return (
//     <Select variant="editor" {...props}>
//       <SelectTrigger icon={<Code className="h-4 w-4" />}>
//         <SelectValue placeholder="Select programming language..." />
//       </SelectTrigger>
//       <SelectContent searchable>
//         <SelectLabel>Programming Languages</SelectLabel>
//         {languageOptions.map((lang) => (
//           <SelectItem 
//             key={lang.value} 
//             value={lang.value}
//             icon={lang.icon && <span className="text-base">{lang.icon}</span>}
//             description={showDescription ? lang.description : undefined}
//             badge={lang.badge && (
//               <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full border border-primary/20">
//                 {lang.badge}
//               </span>
//             )}
//           >
//             {lang.label}
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//   )
// })
// LanguageSelect.displayName = 'LanguageSelect'

// const SessionTypeSelect = React.forwardRef<
//   React.ElementRef<typeof SelectPrimitive.Root>,
//   SelectProps
// >(({ ...props }, ref) => (
//   <Select variant="session" {...props}>
//     <SelectTrigger icon={<Settings className="h-4 w-4" />}>
//       <SelectValue placeholder="Select session type..." />
//     </SelectTrigger>
//     <SelectContent>
//       <SelectLabel>Session Types</SelectLabel>
//       <SelectItem 
//         value="public"
//         icon={<Globe className="h-4 w-4" />}
//         description="Anyone can join with the session link"
//         variant="success"
//       >
//         Public Session
//       </SelectItem>
//       <SelectItem 
//         value="private"
//         icon={<Users className="h-4 w-4" />}
//         description="Only invited users can join"
//         variant="info"
//       >
//         Private Session
//       </SelectItem>
//       <SelectItem 
//         value="restricted"
//         icon={<Crown className="h-4 w-4" />}
//         description="Approval required to join"
//         variant="warning"
//       >
//         Restricted Session
//       </SelectItem>
//     </SelectContent>
//   </Select>
// ))
// SessionTypeSelect.displayName = 'SessionTypeSelect'

// const StatusSelect = React.forwardRef<
//   React.ElementRef<typeof SelectPrimitive.Root>,
//   SelectProps & {
//     showDescriptions?: boolean
//   }
// >(({ showDescriptions = true, ...props }, ref) => (
//   <Select {...props}>
//     <SelectTrigger>
//       <SelectValue placeholder="Select status..." />
//     </SelectTrigger>
//     <SelectContent>
//       <SelectLabel>Status Options</SelectLabel>
//       <SelectItem 
//         value="online"
//         icon={<div className="w-2 h-2 rounded-full bg-success animate-pulse-subtle" />}
//         description={showDescriptions ? "Available for collaboration" : undefined}
//         variant="success"
//       >
//         Online
//       </SelectItem>
//       <SelectItem 
//         value="away"
//         icon={<div className="w-2 h-2 rounded-full bg-warning" />}
//         description={showDescriptions ? "Away but receiving notifications" : undefined}
//         variant="warning"
//       >
//         Away
//       </SelectItem>
//       <SelectItem 
//         value="busy"
//         icon={<div className="w-2 h-2 rounded-full bg-destructive" />}
//         description={showDescriptions ? "Do not disturb" : undefined}
//         variant="destructive"
//       >
//         Busy
//       </SelectItem>
//       <SelectItem 
//         value="offline"
//         icon={<div className="w-2 h-2 rounded-full bg-muted-foreground" />}
//         description={showDescriptions ? "Not available" : undefined}
//       >
//         Offline
//       </SelectItem>
//     </SelectContent>
//   </Select>
// ))
// StatusSelect.displayName = 'StatusSelect'

// const RoleSelect = React.forwardRef<
//   React.ElementRef<typeof SelectPrimitive.Root>,
//   SelectProps
// >(({ ...props }, ref) => (
//   <Select variant="collaboration" {...props}>
//     <SelectTrigger icon={<Users className="h-4 w-4" />}>
//       <SelectValue placeholder="Select role..." />
//     </SelectTrigger>
//     <SelectContent>
//       <SelectLabel>User Roles</SelectLabel>
//       <SelectItem 
//         value="host"
//         icon={<Crown className="h-4 w-4" />}
//         description="Full control over the session"
//         badge={<span className="text-xs text-accent-orange">HOST</span>}
//         variant="warning"
//       >
//         Host
//       </SelectItem>
//       <SelectItem 
//         value="collaborator"
//         icon={<Users className="h-4 w-4" />}
//         description="Can edit and collaborate in real-time"
//         variant="success"
//       >
//         Collaborator
//       </SelectItem>
//       <SelectItem 
//         value="viewer"
//         icon={<Globe className="h-4 w-4" />}
//         description="Can view but cannot edit"
//       >
//         Viewer
//       </SelectItem>
//     </SelectContent>
//   </Select>
// ))
// RoleSelect.displayName = 'RoleSelect'

// export {
//   Select,
//   SelectGroup,
//   SelectValue,
//   SelectTrigger,
//   SelectContent,
//   SelectLabel,
//   SelectItem,
//   SelectSeparator,
//   SelectScrollUpButton,
//   SelectScrollDownButton,
//   LanguageSelect,
//   SessionTypeSelect,
//   StatusSelect,
//   RoleSelect,
// }


"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { cva, type VariantProps } from "class-variance-authority"
import { 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  X, 
  AlertCircle, 
  Loader2,
  Users,
  Code,
  Settings,
  Crown,
  Globe
} from "lucide-react"
import { cn } from "@/lib/utils"

const selectTriggerVariants = cva(
  "flex w-full items-center justify-between rounded-lg border bg-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 transition-colors relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-gray-700 hover:border-gray-600 focus:border-blue-500",
        destructive: "border-red-600 bg-red-900/20 text-red-200 focus:ring-red-500",
        success: "border-green-600 bg-green-900/20 text-green-200 focus:ring-green-500",
        warning: "border-yellow-600 bg-yellow-900/20 text-yellow-200 focus:ring-yellow-500",
        info: "border-blue-500 bg-blue-900/20 text-blue-200 focus:ring-blue-500",
        ghost: "border-transparent bg-transparent hover:bg-gray-800 focus:bg-gray-800",
        outline: "border-2 border-gray-600 hover:border-blue-500 focus:border-blue-500 bg-transparent",
      },
      size: {
        xs: "h-7 px-2 py-1 text-xs",
        sm: "h-8 px-3 py-1.5 text-xs",
        default: "h-10 px-3 py-2 text-sm",
        lg: "h-11 px-4 py-3 text-base",
        xl: "h-12 px-5 py-4 text-lg",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const selectContentVariants = cva(
  "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg border bg-gray-900 text-white shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      variant: {
        default: "border-gray-700",
      },
      size: {
        xs: "text-xs",
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
        xl: "text-lg",
      }
    },
    defaultVariants: {
      variant: "default",
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
          "text-sm font-medium leading-none transition-colors",
          error ? "text-red-400" : success ? "text-green-400" : "text-gray-300",
          required && "after:content-['*'] after:text-red-400 after:ml-1"
        )}>
          {label}
        </label>
      )}
      {selectContent}
      {(error || success || description) && (
        <div className="flex items-start gap-1">
          {error && <AlertCircle className="h-3 w-3 text-red-400 mt-0.5 flex-shrink-0" />}
          <p className={cn(
            "text-xs transition-colors",
            error ? "text-red-400" : success ? "text-green-400" : "text-gray-400"
          )}>
            {error || success || description}
          </p>
        </div>
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
  clearable?: boolean
  onClear?: () => void
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ 
  className, 
  variant, 
  size, 
  loading, 
  error, 
  success, 
  icon, 
  clearable,
  onClear,
  children, 
  ...props 
}, ref) => {
  const currentVariant = error ? 'destructive' : success ? 'success' : variant

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClear?.()
  }

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(selectTriggerVariants({ variant: currentVariant, size }), className)}
      {...props}
    >
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        {icon && (
          <span className="text-gray-500 flex-shrink-0">
            {React.isValidElement(icon) 
              ? React.cloneElement(icon as React.ReactElement, { className: 'h-4 w-4' })
              : icon
            }
          </span>
        )}
        <span className="flex-1 text-left truncate">
          {children}
        </span>
      </div>
      
      <div className="flex items-center space-x-1">
        {clearable && (
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-500 hover:text-gray-300 transition-colors rounded p-0.5"
            tabIndex={-1}
            aria-label="Clear selection"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {loading && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
        {error && !loading && <AlertCircle className="h-4 w-4 text-red-400" />}
        {success && !loading && <Check className="h-4 w-4 text-green-400" />}
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="h-4 w-4 opacity-50 transition-transform data-[state=open]:rotate-180" />
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
      "flex cursor-default items-center justify-center py-1 hover:bg-gray-800 transition-colors",
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
      "flex cursor-default items-center justify-center py-1 hover:bg-gray-800 transition-colors",
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
  emptyMessage?: string
}

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(({ 
  className, 
  children, 
  position = "popper", 
  variant,
  size, 
  searchable, 
  onSearch,
  emptyMessage = "No results found.",
  ...props 
}, ref) => {
  const [searchValue, setSearchValue] = React.useState("")

  const handleSearch = (value: string) => {
    setSearchValue(value)
    onSearch?.(value)
  }

  const clearSearch = () => {
    setSearchValue("")
    onSearch?.("")
  }

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          selectContentVariants({ variant, size }),
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        {searchable && (
          <div className="flex items-center border-b border-gray-700 px-3 py-2 bg-gray-800">
            <Search className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
            <input
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-500 text-white"
              placeholder="Search options..."
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
            />
            {searchValue && (
              <button
                onClick={clearSearch}
                className="text-gray-400 hover:text-gray-200 ml-2 transition-colors"
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
    className={cn(
      "py-2 pl-3 pr-2 text-sm font-semibold text-gray-400 bg-gray-800 border-b border-gray-700",
      className
    )}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  icon?: React.ReactNode
  description?: string
  badge?: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info'
}

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ className, children, icon, description, badge, variant, ...props }, ref) => {
  const variantClasses = {
    default: "",
    success: "data-[highlighted]:bg-green-900/30 data-[highlighted]:text-green-200",
    warning: "data-[highlighted]:bg-yellow-900/30 data-[highlighted]:text-yellow-200",
    destructive: "data-[highlighted]:bg-red-900/30 data-[highlighted]:text-red-200",
    info: "data-[highlighted]:bg-blue-900/30 data-[highlighted]:text-blue-200",
  }

  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-lg py-2 pl-8 pr-2 text-sm outline-none focus:bg-gray-800 focus:text-white data-[highlighted]:bg-gray-800 data-[highlighted]:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors",
        variant && variantClasses[variant],
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>

      <div className="flex items-center space-x-2 flex-1 min-w-0">
        {icon && (
          <span className="flex-shrink-0 text-gray-400">
            {React.isValidElement(icon) 
              ? React.cloneElement(icon as React.ReactElement, { className: 'h-4 w-4' })
              : icon
            }
          </span>
        )}
        <div className="flex-1 min-w-0">
          <SelectPrimitive.ItemText className="block truncate font-medium">
            {children}
          </SelectPrimitive.ItemText>
          {description && (
            <div className="text-xs text-gray-400 truncate">
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
  )
})
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("my-1 h-px bg-gray-700", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

// Specialized Select components
const LanguageSelect = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Root>,
  SelectProps & {
    languages?: Array<{
      value: string
      label: string
      icon?: string
      description?: string
      badge?: string
    }>
    showDescription?: boolean
  }
>(({ languages = [], showDescription = true, ...props }, ref) => {
  const defaultLanguages = [
    { 
      value: 'javascript', 
      label: 'JavaScript', 
      icon: 'JS', 
      description: 'Modern web development',
      badge: 'Popular'
    },
    { 
      value: 'typescript', 
      label: 'TypeScript', 
      icon: 'TS', 
      description: 'JavaScript with static typing',
      badge: 'Recommended'
    },
    { 
      value: 'python', 
      label: 'Python', 
      icon: 'PY', 
      description: 'General purpose programming'
    },
    { 
      value: 'react', 
      label: 'React (JSX)', 
      icon: 'RX', 
      description: 'React components and JSX'
    },
    { 
      value: 'html', 
      label: 'HTML', 
      icon: 'HTML', 
      description: 'Markup language'
    },
    { 
      value: 'css', 
      label: 'CSS', 
      icon: 'CSS', 
      description: 'Styling and layout'
    },
    { 
      value: 'cpp', 
      label: 'C++', 
      icon: 'C++', 
      description: 'System programming'
    },
    { 
      value: 'java', 
      label: 'Java', 
      icon: 'JAVA', 
      description: 'Enterprise development'
    },
  ]

  const languageOptions = languages.length > 0 ? languages : defaultLanguages

  return (
    <Select {...props}>
      <SelectTrigger icon={<Code className="h-4 w-4" />} className="font-mono">
        <SelectValue placeholder="Select programming language..." />
      </SelectTrigger>
      <SelectContent searchable>
        <SelectLabel>Programming Languages</SelectLabel>
        {languageOptions.map((lang) => (
          <SelectItem 
            key={lang.value} 
            value={lang.value}
            icon={lang.icon && <span className="text-xs font-bold font-mono">{lang.icon}</span>}
            description={showDescription ? lang.description : undefined}
            badge={lang.badge && (
              <span className="px-2 py-0.5 bg-blue-900/30 text-blue-300 text-xs rounded-full border border-blue-700">
                {lang.badge}
              </span>
            )}
          >
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
})
LanguageSelect.displayName = 'LanguageSelect'

const SessionTypeSelect = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Root>,
  SelectProps
>(({ ...props }, ref) => (
  <Select {...props}>
    <SelectTrigger icon={<Settings className="h-4 w-4" />}>
      <SelectValue placeholder="Select session type..." />
    </SelectTrigger>
    <SelectContent>
      <SelectLabel>Session Types</SelectLabel>
      <SelectItem 
        value="public"
        icon={<Globe className="h-4 w-4" />}
        description="Anyone can join with the session link"
        variant="success"
      >
        Public Session
      </SelectItem>
      <SelectItem 
        value="private"
        icon={<Users className="h-4 w-4" />}
        description="Only invited users can join"
        variant="info"
      >
        Private Session
      </SelectItem>
      <SelectItem 
        value="restricted"
        icon={<Crown className="h-4 w-4" />}
        description="Approval required to join"
        variant="warning"
      >
        Restricted Session
      </SelectItem>
    </SelectContent>
  </Select>
))
SessionTypeSelect.displayName = 'SessionTypeSelect'

const StatusSelect = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Root>,
  SelectProps & {
    showDescriptions?: boolean
  }
>(({ showDescriptions = true, ...props }, ref) => (
  <Select {...props}>
    <SelectTrigger>
      <SelectValue placeholder="Select status..." />
    </SelectTrigger>
    <SelectContent>
      <SelectLabel>Status Options</SelectLabel>
      <SelectItem 
        value="online"
        icon={<div className="w-2 h-2 rounded-full bg-green-400" />}
        description={showDescriptions ? "Available for collaboration" : undefined}
        variant="success"
      >
        Online
      </SelectItem>
      <SelectItem 
        value="away"
        icon={<div className="w-2 h-2 rounded-full bg-yellow-400" />}
        description={showDescriptions ? "Away but receiving notifications" : undefined}
        variant="warning"
      >
        Away
      </SelectItem>
      <SelectItem 
        value="busy"
        icon={<div className="w-2 h-2 rounded-full bg-red-400" />}
        description={showDescriptions ? "Do not disturb" : undefined}
        variant="destructive"
      >
        Busy
      </SelectItem>
      <SelectItem 
        value="offline"
        icon={<div className="w-2 h-2 rounded-full bg-gray-500" />}
        description={showDescriptions ? "Not available" : undefined}
      >
        Offline
      </SelectItem>
    </SelectContent>
  </Select>
))
StatusSelect.displayName = 'StatusSelect'

const RoleSelect = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Root>,
  SelectProps
>(({ ...props }, ref) => (
  <Select {...props}>
    <SelectTrigger icon={<Users className="h-4 w-4" />}>
      <SelectValue placeholder="Select role..." />
    </SelectTrigger>
    <SelectContent>
      <SelectLabel>User Roles</SelectLabel>
      <SelectItem 
        value="host"
        icon={<Crown className="h-4 w-4" />}
        description="Full control over the session"
        badge={<span className="text-xs text-yellow-400">HOST</span>}
        variant="warning"
      >
        Host
      </SelectItem>
      <SelectItem 
        value="collaborator"
        icon={<Users className="h-4 w-4" />}
        description="Can edit and collaborate in real-time"
        variant="success"
      >
        Collaborator
      </SelectItem>
      <SelectItem 
        value="viewer"
        icon={<Globe className="h-4 w-4" />}
        description="Can view but cannot edit"
      >
        Viewer
      </SelectItem>
    </SelectContent>
  </Select>
))
RoleSelect.displayName = 'RoleSelect'

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
  SessionTypeSelect,
  StatusSelect,
  RoleSelect,
}
