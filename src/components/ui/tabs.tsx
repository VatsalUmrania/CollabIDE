// 'use client'

// import * as React from 'react'
// import * as TabsPrimitive from '@radix-ui/react-tabs'
// import { cva, type VariantProps } from 'class-variance-authority'
// import { 
//   X, 
//   Plus, 
//   ChevronLeft, 
//   ChevronRight, 
//   MoreHorizontal,
//   FileText,
//   Code,
//   Settings,
//   Users,
//   Terminal,
//   Database,
//   Loader2,
//   AlertCircle
// } from 'lucide-react'
// import { cn } from '@/lib/utils'

// const tabsListVariants = cva(
//   'inline-flex items-center justify-center text-muted-foreground transition-all duration-300 relative',
//   {
//     variants: {
//       variant: {
//         default: 'bg-card/50 p-1 rounded-lg border border-border/30 backdrop-blur-sm shadow-sm',
//         underline: 'border-b border-border/50 bg-transparent p-0 backdrop-blur-sm',
//         pills: 'bg-transparent p-0 space-x-1',
//         cards: 'bg-transparent p-0 border-b border-border/50 backdrop-blur-sm',
//         ghost: 'bg-transparent p-0',
//         editor: 'bg-editor-background border-b border-border/30 p-0 backdrop-blur-sm',
//         // CollabIDE-specific variants
//         collaboration: 'bg-accent-purple/5 border border-accent-purple/20 p-1 rounded-lg backdrop-blur-sm',
//         session: 'bg-accent-blue/5 border border-accent-blue/20 p-1 rounded-lg backdrop-blur-sm',
//         glass: 'glass-card p-1 rounded-lg shadow-lg',
//       },
//       size: {
//         xs: 'h-7 text-xs',
//         sm: 'h-8 text-xs',
//         default: 'h-10 text-sm',
//         lg: 'h-12 text-base',
//         xl: 'h-14 text-lg',
//       },
//       orientation: {
//         horizontal: 'flex-row',
//         vertical: 'flex-col w-fit items-stretch',
//       }
//     },
//     defaultVariants: {
//       variant: 'default',
//       size: 'default',
//       orientation: 'horizontal',
//     },
//   }
// )

// const tabsTriggerVariants = cva(
//   'inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group',
//   {
//     variants: {
//       variant: {
//         default: 
//           'rounded-md px-3 py-1.5 hover:bg-accent/50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md hover:shadow-sm backdrop-blur-sm',
//         underline:
//           'border-b-2 border-transparent px-4 py-2 hover:bg-accent/30 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:bg-primary/5 hover:text-foreground',
//         pills:
//           'rounded-full px-4 py-2 hover:bg-accent/50 hover:text-accent-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:shadow-sm',
//         cards:
//           'border border-b-0 rounded-t-lg px-4 py-2 bg-card/50 hover:bg-card/80 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-lg backdrop-blur-sm',
//         ghost:
//           'px-3 py-1.5 rounded-md hover:bg-accent/50 hover:text-accent-foreground data-[state=active]:bg-accent/70 data-[state=active]:text-accent-foreground',
//         editor:
//           'px-3 py-2 rounded-t-md hover:bg-card/30 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary font-mono text-xs',
//         collaboration:
//           'rounded-md px-3 py-1.5 hover:bg-accent-purple/10 data-[state=active]:bg-accent-purple/20 data-[state=active]:text-accent-purple data-[state=active]:shadow-md backdrop-blur-sm',
//         session:
//           'rounded-md px-3 py-1.5 hover:bg-accent-blue/10 data-[state=active]:bg-accent-blue/20 data-[state=active]:text-accent-blue data-[state=active]:shadow-md backdrop-blur-sm',
//         glass:
//           'rounded-md px-3 py-1.5 hover:bg-white/10 data-[state=active]:glass-effect data-[state=active]:text-foreground data-[state=active]:shadow-lg backdrop-blur-sm',
//       },
//       size: {
//         xs: 'text-xs px-2 py-1 min-h-[1.75rem]',
//         sm: 'text-xs px-2 py-1 min-h-[2rem]',
//         default: 'text-sm px-3 py-1.5 min-h-[2.5rem]',
//         lg: 'text-base px-4 py-2 min-h-[3rem]',
//         xl: 'text-lg px-5 py-2.5 min-h-[3.5rem]',
//       }
//     },
//     defaultVariants: {
//       variant: 'default',
//       size: 'default',
//     },
//   }
// )

// const tabsContentVariants = cva(
//   'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300',
//   {
//     variants: {
//       variant: {
//         default: 'mt-2',
//         underline: 'mt-4',
//         pills: 'mt-4',
//         cards: 'border border-t-0 rounded-b-lg rounded-tr-lg bg-background p-4 shadow-sm backdrop-blur-sm',
//         ghost: 'mt-2',
//         editor: 'mt-0 bg-editor-background border-t border-border/30',
//         collaboration: 'mt-2 p-4 bg-accent-purple/5 rounded-lg border border-accent-purple/20 backdrop-blur-sm',
//         session: 'mt-2 p-4 bg-accent-blue/5 rounded-lg border border-accent-blue/20 backdrop-blur-sm',
//         glass: 'mt-2 p-4 glass-card rounded-lg shadow-lg',
//       }
//     },
//     defaultVariants: {
//       variant: 'default',
//     },
//   }
// )

// interface TabsProps 
//   extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>,
//     VariantProps<typeof tabsListVariants> {
//   scrollable?: boolean
//   addable?: boolean
//   onAddTab?: () => void
//   closable?: boolean
//   onCloseTab?: (value: string) => void
//   animated?: boolean
//   glow?: boolean
// }

// const Tabs = React.forwardRef<
//   React.ElementRef<typeof TabsPrimitive.Root>,
//   TabsProps
// >(({ 
//   variant, 
//   size, 
//   orientation, 
//   scrollable, 
//   addable, 
//   onAddTab, 
//   closable, 
//   onCloseTab, 
//   animated = true,
//   glow = false,
//   className, 
//   children, 
//   ...props 
// }, ref) => (
//   <TabsPrimitive.Root
//     ref={ref}
//     className={cn(
//       'w-full',
//       animated && 'animate-fade-in',
//       glow && 'animate-glow',
//       className
//     )}
//     orientation={orientation}
//     {...props}
//   >
//     {children}
//   </TabsPrimitive.Root>
// ))
// Tabs.displayName = TabsPrimitive.Root.displayName

// interface TabsListProps 
//   extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
//     VariantProps<typeof tabsListVariants> {
//   scrollable?: boolean
//   addable?: boolean
//   onAddTab?: () => void
//   showScrollButtons?: boolean
//   showMoreButton?: boolean
//   onMore?: () => void
// }

// const TabsList = React.forwardRef<
//   React.ElementRef<typeof TabsPrimitive.List>,
//   TabsListProps
// >(({ 
//   className, 
//   variant, 
//   size, 
//   orientation, 
//   scrollable, 
//   addable, 
//   onAddTab, 
//   showScrollButtons = true,
//   showMoreButton = false,
//   onMore,
//   children, 
//   ...props 
// }, ref) => {
//   const [canScrollLeft, setCanScrollLeft] = React.useState(false)
//   const [canScrollRight, setCanScrollRight] = React.useState(false)
//   const scrollContainerRef = React.useRef<HTMLDivElement>(null)

//   const checkScrollability = React.useCallback(() => {
//     const container = scrollContainerRef.current
//     if (container && scrollable) {
//       setCanScrollLeft(container.scrollLeft > 0)
//       setCanScrollRight(
//         container.scrollLeft < container.scrollWidth - container.clientWidth
//       )
//     }
//   }, [scrollable])

//   React.useEffect(() => {
//     checkScrollability()
//     const container = scrollContainerRef.current
//     if (container) {
//       const resizeObserver = new ResizeObserver(checkScrollability)
//       resizeObserver.observe(container)
//       return () => resizeObserver.disconnect()
//     }
//   }, [checkScrollability])

//   const scroll = (direction: 'left' | 'right') => {
//     const container = scrollContainerRef.current
//     if (container) {
//       const scrollAmount = 200
//       container.scrollBy({
//         left: direction === 'left' ? -scrollAmount : scrollAmount,
//         behavior: 'smooth'
//       })
//       setTimeout(checkScrollability, 150)
//     }
//   }

//   const tabsList = (
//     <TabsPrimitive.List
//       ref={ref}
//       className={cn(tabsListVariants({ variant, size, orientation }), className)}
//       {...props}
//     >
//       {children}
      
//       {/* Add button */}
//       {addable && (
//         <button
//           onClick={onAddTab}
//           className={cn(
//             'flex items-center justify-center rounded-md hover:bg-accent/50 hover:text-accent-foreground transition-all duration-200 hover:scale-110 active:scale-95 ml-1 backdrop-blur-sm',
//             size === 'xs' && 'h-5 w-5',
//             size === 'sm' && 'h-6 w-6',
//             size === 'default' && 'h-8 w-8',
//             size === 'lg' && 'h-10 w-10',
//             size === 'xl' && 'h-12 w-12'
//           )}
//           type="button"
//           aria-label="Add new tab"
//         >
//           <Plus className={cn(
//             size === 'xs' && 'h-3 w-3',
//             size === 'sm' && 'h-3 w-3',
//             size === 'default' && 'h-4 w-4',
//             size === 'lg' && 'h-5 w-5',
//             size === 'xl' && 'h-6 w-6'
//           )} />
//         </button>
//       )}

//       {/* More button */}
//       {showMoreButton && (
//         <button
//           onClick={onMore}
//           className={cn(
//             'flex items-center justify-center rounded-md hover:bg-accent/50 hover:text-accent-foreground transition-all duration-200 hover:scale-110 active:scale-95 ml-1',
//             size === 'xs' && 'h-5 w-5',
//             size === 'sm' && 'h-6 w-6',
//             size === 'default' && 'h-8 w-8',
//             size === 'lg' && 'h-10 w-10',
//             size === 'xl' && 'h-12 w-12'
//           )}
//           type="button"
//           aria-label="More options"
//         >
//           <MoreHorizontal className="h-4 w-4" />
//         </button>
//       )}
//     </TabsPrimitive.List>
//   )

//   if (scrollable) {
//     return (
//       <div className="flex items-center relative">
//         {/* Left scroll button */}
//         {showScrollButtons && canScrollLeft && (
//           <button
//             onClick={() => scroll('left')}
//             className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent/50 transition-all duration-200 hover:scale-110 active:scale-95 mr-1 backdrop-blur-sm"
//             type="button"
//             aria-label="Scroll left"
//           >
//             <ChevronLeft className="h-4 w-4" />
//           </button>
//         )}
        
//         {/* Scrollable container */}
//         <div
//           ref={scrollContainerRef}
//           className="flex-1 overflow-x-auto scrollbar-hide scroll-smooth"
//           onScroll={checkScrollability}
//           style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//         >
//           {tabsList}
//         </div>
        
//         {/* Right scroll button */}
//         {showScrollButtons && canScrollRight && (
//           <button
//             onClick={() => scroll('right')}
//             className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent/50 transition-all duration-200 hover:scale-110 active:scale-95 ml-1 backdrop-blur-sm"
//             type="button"
//             aria-label="Scroll right"
//           >
//             <ChevronRight className="h-4 w-4" />
//           </button>
//         )}
//       </div>
//     )
//   }

//   return tabsList
// })
// TabsList.displayName = TabsPrimitive.List.displayName

// interface TabsTriggerProps 
//   extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
//     VariantProps<typeof tabsTriggerVariants> {
//   closable?: boolean
//   onClose?: () => void
//   icon?: React.ReactNode
//   badge?: React.ReactNode
//   tooltip?: string
//   modified?: boolean
//   loading?: boolean
//   error?: boolean
//   animated?: boolean
// }

// const TabsTrigger = React.forwardRef<
//   React.ElementRef<typeof TabsPrimitive.Trigger>,
//   TabsTriggerProps
// >(({ 
//   className, 
//   variant, 
//   size, 
//   closable, 
//   onClose, 
//   icon, 
//   badge, 
//   tooltip, 
//   modified, 
//   loading,
//   error,
//   animated = true,
//   children, 
//   ...props 
// }, ref) => {
//   const [isHovered, setIsHovered] = React.useState(false)

//   return (
//     <TabsPrimitive.Trigger
//       ref={ref}
//       className={cn(
//         tabsTriggerVariants({ variant, size }), 
//         'group relative',
//         animated && 'transition-all duration-300',
//         error && 'border-destructive/50',
//         className
//       )}
//       title={tooltip}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       {...props}
//     >
//       {/* Background shimmer effect */}
//       {animated && isHovered && (
//         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
//       )}

//       <div className="flex items-center space-x-1.5 min-w-0 relative z-10">
//         {/* Icon with loading state */}
//         {loading ? (
//           <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
//         ) : icon ? (
//           <span className="flex-shrink-0 text-muted-foreground group-data-[state=active]:text-foreground transition-colors duration-200">
//             {React.isValidElement(icon) 
//               ? React.cloneElement(icon as React.ReactElement, { 
//                   className: cn('h-4 w-4', (icon as any).props?.className) 
//                 })
//               : icon
//             }
//           </span>
//         ) : null}

//         {/* Tab content */}
//         <span className="truncate flex items-center gap-1">
//           {children}
          
//           {/* Modified indicator */}
//           {modified && (
//             <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-accent-orange animate-pulse-subtle" />
//           )}
          
//           {/* Error indicator */}
//           {error && (
//             <AlertCircle className="h-3 w-3 text-destructive animate-pulse-subtle" />
//           )}
//         </span>

//         {/* Badge */}
//         {badge && (
//           <span className="flex-shrink-0 animate-scale-in">
//             {badge}
//           </span>
//         )}
//       </div>

//       {/* Close button */}
//       {closable && (
//         <button
//           onClick={(e) => {
//             e.stopPropagation()
//             onClose?.()
//           }}
//           className="ml-2 flex-shrink-0 rounded-sm opacity-0 group-hover:opacity-100 hover:bg-accent/50 p-0.5 transition-all duration-200 hover:scale-110 active:scale-95 relative z-10"
//           type="button"
//           aria-label="Close tab"
//         >
//           <X className="h-3 w-3" />
//         </button>
//       )}
//     </TabsPrimitive.Trigger>
//   )
// })
// TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

// interface TabsContentProps 
//   extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>,
//     VariantProps<typeof tabsContentVariants> {
//   loading?: boolean
//   error?: string
//   empty?: boolean
//   emptyMessage?: string
//   animated?: boolean
// }

// const TabsContent = React.forwardRef<
//   React.ElementRef<typeof TabsPrimitive.Content>,
//   TabsContentProps
// >(({ 
//   className, 
//   variant, 
//   loading, 
//   error, 
//   empty,
//   emptyMessage = "No content available",
//   animated = true,
//   children, 
//   ...props 
// }, ref) => (
//   <TabsPrimitive.Content
//     ref={ref}
//     className={cn(
//       tabsContentVariants({ variant }),
//       animated && 'animate-fade-in',
//       className
//     )}
//     {...props}
//   >
//     {loading ? (
//       <div className="flex items-center justify-center p-8 min-h-[200px]">
//         <div className="flex flex-col items-center space-y-3">
//           <Loader2 className="h-8 w-8 animate-spin text-primary" />
//           <span className="text-sm text-muted-foreground">Loading content...</span>
//         </div>
//       </div>
//     ) : error ? (
//       <div className="flex items-center justify-center p-8 min-h-[200px]">
//         <div className="text-center space-y-3">
//           <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
//           <div>
//             <p className="text-sm text-destructive font-medium mb-1">Error loading content</p>
//             <p className="text-xs text-muted-foreground">{error}</p>
//           </div>
//         </div>
//       </div>
//     ) : empty ? (
//       <div className="flex items-center justify-center p-8 min-h-[200px]">
//         <div className="text-center space-y-3">
//           <FileText className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
//           <p className="text-sm text-muted-foreground">{emptyMessage}</p>
//         </div>
//       </div>
//     ) : (
//       children
//     )}
//   </TabsPrimitive.Content>
// ))
// TabsContent.displayName = TabsPrimitive.Content.displayName

// // Enhanced specialized tab components for CollabIDE
// const FileTabs = React.forwardRef<
//   React.ElementRef<typeof TabsPrimitive.Root>,
//   TabsProps & {
//     files: Array<{
//       id: string
//       name: string
//       language?: string
//       modified?: boolean
//       icon?: React.ReactNode
//       error?: boolean
//       loading?: boolean
//     }>
//     activeFileId?: string
//     onFileSelect?: (fileId: string) => void
//     onFileClose?: (fileId: string) => void
//     onFileAdd?: () => void
//     maxVisibleTabs?: number
//   }
// >(({ 
//   files, 
//   activeFileId, 
//   onFileSelect, 
//   onFileClose, 
//   onFileAdd,
//   maxVisibleTabs = 10,
//   ...props 
// }, ref) => {
//   const getFileIcon = (language?: string) => {
//     if (!language) return <FileText className="h-4 w-4" />
    
//     switch (language.toLowerCase()) {
//       case 'javascript':
//       case 'js':
//         return <span className="text-yellow-500">JS</span>
//       case 'typescript':
//       case 'ts':
//         return <span className="text-blue-500">TS</span>
//       case 'html':
//         return <span className="text-orange-500">HTML</span>
//       case 'css':
//         return <span className="text-blue-400">CSS</span>
//       case 'python':
//       case 'py':
//         return <span className="text-green-500">PY</span>
//       default:
//         return <Code className="h-4 w-4" />
//     }
//   }

//   return (
//     <Tabs
//       ref={ref}
//       value={activeFileId}
//       onValueChange={onFileSelect}
//       variant="editor"
//       animated
//       {...props}
//     >
//       <TabsList 
//         variant="editor" 
//         scrollable={files.length > maxVisibleTabs}
//         showScrollButtons 
//         addable={!!onFileAdd} 
//         onAddTab={onFileAdd}
//       >
//         {files.map((file) => (
//           <TabsTrigger
//             key={file.id}
//             value={file.id}
//             variant="editor"
//             size="sm"
//             closable={files.length > 1}
//             onClose={() => onFileClose?.(file.id)}
//             icon={file.icon || getFileIcon(file.language)}
//             modified={file.modified}
//             loading={file.loading}
//             error={file.error}
//             tooltip={`${file.name}${file.language ? ` (${file.language})` : ''}${file.modified ? ' - Modified' : ''}`}
//             animated
//           >
//             {file.name}
//           </TabsTrigger>
//         ))}
//       </TabsList>
//     </Tabs>
//   )
// })
// FileTabs.displayName = 'FileTabs'

// const CollaborationTabs = React.forwardRef<
//   React.ElementRef<typeof TabsPrimitive.Root>,
//   TabsProps & {
//     activeUsers?: number
//     sessionType?: 'public' | 'private' | 'restricted'
//   }
// >(({ activeUsers, sessionType, children, ...props }, ref) => (
//   <Tabs ref={ref} variant="collaboration" animated glow {...props}>
//     <TabsList variant="collaboration">
//       <TabsTrigger 
//         value="code" 
//         variant="collaboration"
//         icon={<Code className="h-4 w-4" />}
//       >
//         Code Editor
//       </TabsTrigger>
//       <TabsTrigger 
//         value="collaborators" 
//         variant="collaboration"
//         icon={<Users className="h-4 w-4" />}
//         badge={activeUsers && (
//           <span className="px-1.5 py-0.5 bg-accent-purple/20 text-accent-purple text-xs rounded-full">
//             {activeUsers}
//           </span>
//         )}
//       >
//         Collaborators
//       </TabsTrigger>
//       <TabsTrigger 
//         value="terminal" 
//         variant="collaboration"
//         icon={<Terminal className="h-4 w-4" />}
//       >
//         Terminal
//       </TabsTrigger>
//       <TabsTrigger 
//         value="settings" 
//         variant="collaboration"
//         icon={<Settings className="h-4 w-4" />}
//       >
//         Settings
//       </TabsTrigger>
//     </TabsList>
//     {children}
//   </Tabs>
// ))
// CollaborationTabs.displayName = 'CollaborationTabs'

// const SessionTabs = React.forwardRef<
//   React.ElementRef<typeof TabsPrimitive.Root>,
//   TabsProps
// >(({ children, ...props }, ref) => (
//   <Tabs ref={ref} variant="session" animated {...props}>
//     <TabsList variant="session">
//       <TabsTrigger 
//         value="overview" 
//         variant="session"
//         icon={<Database className="h-4 w-4" />}
//       >
//         Overview
//       </TabsTrigger>
//       <TabsTrigger 
//         value="files" 
//         variant="session"
//         icon={<FileText className="h-4 w-4" />}
//       >
//         Files
//       </TabsTrigger>
//       <TabsTrigger 
//         value="activity" 
//         variant="session"
//         icon={<Users className="h-4 w-4" />}
//       >
//         Activity
//       </TabsTrigger>
//     </TabsList>
//     {children}
//   </Tabs>
// ))
// SessionTabs.displayName = 'SessionTabs'

// const SettingsTabs = React.forwardRef<
//   React.ElementRef<typeof TabsPrimitive.Root>,
//   TabsProps
// >(({ children, ...props }, ref) => (
//   <Tabs ref={ref} orientation="vertical" variant="cards" animated {...props}>
//     {children}
//   </Tabs>
// ))
// SettingsTabs.displayName = 'SettingsTabs'

// export { 
//   Tabs, 
//   TabsList, 
//   TabsTrigger, 
//   TabsContent, 
//   FileTabs,
//   CollaborationTabs,
//   SessionTabs,
//   SettingsTabs,
//   tabsListVariants,
//   tabsTriggerVariants,
//   tabsContentVariants
// }

'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cva, type VariantProps } from 'class-variance-authority'
import { 
  X, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal,
  FileText,
  Code,
  Settings,
  Users,
  Terminal,
  Database,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

const tabsListVariants = cva(
  'inline-flex items-center justify-center text-gray-400 transition-colors relative',
  {
    variants: {
      variant: {
        default: 'bg-gray-800 p-1 rounded-lg border border-gray-700',
        underline: 'border-b border-gray-700 bg-transparent p-0',
        pills: 'bg-transparent p-0 space-x-1',
        cards: 'bg-transparent p-0 border-b border-gray-700',
        ghost: 'bg-transparent p-0',
        editor: 'bg-gray-900 border-b border-gray-700 p-0',
      },
      size: {
        xs: 'h-7 text-xs',
        sm: 'h-8 text-xs',
        default: 'h-10 text-sm',
        lg: 'h-11 text-base',
        xl: 'h-12 text-lg',
      },
      orientation: {
        horizontal: 'flex-row',
        vertical: 'flex-col w-fit items-stretch',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      orientation: 'horizontal',
    },
  }
)

const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative group',
  {
    variants: {
      variant: {
        default: 
          'rounded-md px-3 py-1.5 hover:bg-gray-700 data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-sm',
        underline:
          'border-b-2 border-transparent px-4 py-2 hover:bg-gray-800 data-[state=active]:border-blue-500 data-[state=active]:text-white data-[state=active]:bg-blue-900/20 hover:text-gray-200',
        pills:
          'rounded-full px-4 py-2 hover:bg-gray-700 hover:text-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white',
        cards:
          'border border-b-0 rounded-t-lg px-4 py-2 bg-gray-800 hover:bg-gray-700 data-[state=active]:bg-gray-900 data-[state=active]:text-white',
        ghost:
          'px-3 py-1.5 rounded-md hover:bg-gray-700 hover:text-gray-200 data-[state=active]:bg-gray-700 data-[state=active]:text-white',
        editor:
          'px-3 py-2 rounded-t-md hover:bg-gray-800 data-[state=active]:bg-gray-800 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 font-mono text-xs',
      },
      size: {
        xs: 'text-xs px-2 py-1 min-h-[1.75rem]',
        sm: 'text-xs px-2 py-1 min-h-[2rem]',
        default: 'text-sm px-3 py-1.5 min-h-[2.5rem]',
        lg: 'text-base px-4 py-2 min-h-[3rem]',
        xl: 'text-lg px-5 py-2.5 min-h-[3.5rem]',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const tabsContentVariants = cva(
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors',
  {
    variants: {
      variant: {
        default: 'mt-2',
        underline: 'mt-4',
        pills: 'mt-4',
        cards: 'border border-t-0 rounded-b-lg rounded-tr-lg bg-gray-900 p-4',
        ghost: 'mt-2',
        editor: 'mt-0 bg-gray-900 border-t border-gray-700',
      }
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface TabsProps 
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>,
    VariantProps<typeof tabsListVariants> {
  scrollable?: boolean
  addable?: boolean
  onAddTab?: () => void
  closable?: boolean
  onCloseTab?: (value: string) => void
}

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
>(({ 
  variant, 
  size, 
  orientation, 
  scrollable, 
  addable, 
  onAddTab, 
  closable, 
  onCloseTab, 
  className, 
  children, 
  ...props 
}, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    className={cn('w-full', className)}
    orientation={orientation}
    {...props}
  >
    {children}
  </TabsPrimitive.Root>
))
Tabs.displayName = TabsPrimitive.Root.displayName

interface TabsListProps 
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {
  scrollable?: boolean
  addable?: boolean
  onAddTab?: () => void
  showScrollButtons?: boolean
  showMoreButton?: boolean
  onMore?: () => void
}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ 
  className, 
  variant, 
  size, 
  orientation, 
  scrollable, 
  addable, 
  onAddTab, 
  showScrollButtons = true,
  showMoreButton = false,
  onMore,
  children, 
  ...props 
}, ref) => {
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  const checkScrollability = React.useCallback(() => {
    const container = scrollContainerRef.current
    if (container && scrollable) {
      setCanScrollLeft(container.scrollLeft > 0)
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      )
    }
  }, [scrollable])

  React.useEffect(() => {
    checkScrollability()
    const container = scrollContainerRef.current
    if (container) {
      const resizeObserver = new ResizeObserver(checkScrollability)
      resizeObserver.observe(container)
      return () => resizeObserver.disconnect()
    }
  }, [checkScrollability])

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (container) {
      const scrollAmount = 200
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
      setTimeout(checkScrollability, 150)
    }
  }

  const tabsList = (
    <TabsPrimitive.List
      ref={ref}
      className={cn(tabsListVariants({ variant, size, orientation }), className)}
      {...props}
    >
      {children}
      
      {/* Add button */}
      {addable && (
        <button
          onClick={onAddTab}
          className={cn(
            'flex items-center justify-center rounded-md hover:bg-gray-700 hover:text-gray-200 transition-colors ml-1',
            size === 'xs' && 'h-5 w-5',
            size === 'sm' && 'h-6 w-6',
            size === 'default' && 'h-8 w-8',
            size === 'lg' && 'h-10 w-10',
            size === 'xl' && 'h-12 w-12'
          )}
          type="button"
          aria-label="Add new tab"
        >
          <Plus className={cn(
            size === 'xs' && 'h-3 w-3',
            size === 'sm' && 'h-3 w-3',
            size === 'default' && 'h-4 w-4',
            size === 'lg' && 'h-5 w-5',
            size === 'xl' && 'h-6 w-6'
          )} />
        </button>
      )}

      {/* More button */}
      {showMoreButton && (
        <button
          onClick={onMore}
          className={cn(
            'flex items-center justify-center rounded-md hover:bg-gray-700 hover:text-gray-200 transition-colors ml-1',
            size === 'xs' && 'h-5 w-5',
            size === 'sm' && 'h-6 w-6',
            size === 'default' && 'h-8 w-8',
            size === 'lg' && 'h-10 w-10',
            size === 'xl' && 'h-12 w-12'
          )}
          type="button"
          aria-label="More options"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      )}
    </TabsPrimitive.List>
  )

  if (scrollable) {
    return (
      <div className="flex items-center relative">
        {/* Left scroll button */}
        {showScrollButtons && canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-700 transition-colors mr-1"
            type="button"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        
        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-x-auto scrollbar-hide scroll-smooth"
          onScroll={checkScrollability}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tabsList}
        </div>
        
        {/* Right scroll button */}
        {showScrollButtons && canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-700 transition-colors ml-1"
            type="button"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }

  return tabsList
})
TabsList.displayName = TabsPrimitive.List.displayName

interface TabsTriggerProps 
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {
  closable?: boolean
  onClose?: () => void
  icon?: React.ReactNode
  badge?: React.ReactNode
  tooltip?: string
  modified?: boolean
  loading?: boolean
  error?: boolean
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ 
  className, 
  variant, 
  size, 
  closable, 
  onClose, 
  icon, 
  badge, 
  tooltip, 
  modified, 
  loading,
  error,
  children, 
  ...props 
}, ref) => {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        tabsTriggerVariants({ variant, size }), 
        'group relative',
        error && 'border-red-600',
        className
      )}
      title={tooltip}
      {...props}
    >
      <div className="flex items-center space-x-1.5 min-w-0">
        {/* Icon with loading state */}
        {loading ? (
          <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
        ) : icon ? (
          <span className="flex-shrink-0 text-gray-400 group-data-[state=active]:text-white transition-colors">
            {React.isValidElement(icon) 
              ? React.cloneElement(icon as React.ReactElement, { 
                  className: cn('h-4 w-4', (icon as any).props?.className) 
                })
              : icon
            }
          </span>
        ) : null}

        {/* Tab content */}
        <span className="truncate flex items-center gap-1">
          {children}
          
          {/* Modified indicator */}
          {modified && (
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-yellow-400" />
          )}
          
          {/* Error indicator */}
          {error && (
            <AlertCircle className="h-3 w-3 text-red-400" />
          )}
        </span>

        {/* Badge */}
        {badge && (
          <span className="flex-shrink-0">
            {badge}
          </span>
        )}
      </div>

      {/* Close button */}
      {closable && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onClose?.()
          }}
          className="ml-2 flex-shrink-0 rounded-sm opacity-0 group-hover:opacity-100 hover:bg-gray-600 p-0.5 transition-colors"
          type="button"
          aria-label="Close tab"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </TabsPrimitive.Trigger>
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

interface TabsContentProps 
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>,
    VariantProps<typeof tabsContentVariants> {
  loading?: boolean
  error?: string
  empty?: boolean
  emptyMessage?: string
}

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ 
  className, 
  variant, 
  loading, 
  error, 
  empty,
  emptyMessage = "No content available",
  children, 
  ...props 
}, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(tabsContentVariants({ variant }), className)}
    {...props}
  >
    {loading ? (
      <div className="flex items-center justify-center p-8 min-h-[200px]">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="text-sm text-gray-400">Loading content...</span>
        </div>
      </div>
    ) : error ? (
      <div className="flex items-center justify-center p-8 min-h-[200px]">
        <div className="text-center space-y-3">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
          <div>
            <p className="text-sm text-red-400 font-medium mb-1">Error loading content</p>
            <p className="text-xs text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    ) : empty ? (
      <div className="flex items-center justify-center p-8 min-h-[200px]">
        <div className="text-center space-y-3">
          <FileText className="h-12 w-12 text-gray-500 mx-auto opacity-50" />
          <p className="text-sm text-gray-400">{emptyMessage}</p>
        </div>
      </div>
    ) : (
      children
    )}
  </TabsPrimitive.Content>
))
TabsContent.displayName = TabsPrimitive.Content.displayName

// Specialized tab components
const FileTabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps & {
    files: Array<{
      id: string
      name: string
      language?: string
      modified?: boolean
      icon?: React.ReactNode
      error?: boolean
      loading?: boolean
    }>
    activeFileId?: string
    onFileSelect?: (fileId: string) => void
    onFileClose?: (fileId: string) => void
    onFileAdd?: () => void
    maxVisibleTabs?: number
  }
>(({ 
  files, 
  activeFileId, 
  onFileSelect, 
  onFileClose, 
  onFileAdd,
  maxVisibleTabs = 10,
  ...props 
}, ref) => {
  const getFileIcon = (language?: string) => {
    if (!language) return <FileText className="h-4 w-4" />
    
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'js':
        return <span className="text-yellow-500 text-xs font-bold font-mono">JS</span>
      case 'typescript':
      case 'ts':
        return <span className="text-blue-500 text-xs font-bold font-mono">TS</span>
      case 'html':
        return <span className="text-orange-500 text-xs font-bold font-mono">HTML</span>
      case 'css':
        return <span className="text-blue-400 text-xs font-bold font-mono">CSS</span>
      case 'python':
      case 'py':
        return <span className="text-green-500 text-xs font-bold font-mono">PY</span>
      default:
        return <Code className="h-4 w-4" />
    }
  }

  return (
    <Tabs
      ref={ref}
      value={activeFileId}
      onValueChange={onFileSelect}
      variant="editor"
      {...props}
    >
      <TabsList 
        variant="editor" 
        scrollable={files.length > maxVisibleTabs}
        showScrollButtons 
        addable={!!onFileAdd} 
        onAddTab={onFileAdd}
      >
        {files.map((file) => (
          <TabsTrigger
            key={file.id}
            value={file.id}
            variant="editor"
            size="sm"
            closable={files.length > 1}
            onClose={() => onFileClose?.(file.id)}
            icon={file.icon || getFileIcon(file.language)}
            modified={file.modified}
            loading={file.loading}
            error={file.error}
            tooltip={`${file.name}${file.language ? ` (${file.language})` : ''}${file.modified ? ' - Modified' : ''}`}
          >
            {file.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
})
FileTabs.displayName = 'FileTabs'

const CollaborationTabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps & {
    activeUsers?: number
    sessionType?: 'public' | 'private' | 'restricted'
  }
>(({ activeUsers, sessionType, children, ...props }, ref) => (
  <Tabs ref={ref} variant="default" {...props}>
    <TabsList variant="default">
      <TabsTrigger 
        value="code" 
        variant="default"
        icon={<Code className="h-4 w-4" />}
      >
        Code Editor
      </TabsTrigger>
      <TabsTrigger 
        value="collaborators" 
        variant="default"
        icon={<Users className="h-4 w-4" />}
        badge={activeUsers && (
          <span className="px-1.5 py-0.5 bg-blue-900/30 text-blue-300 text-xs rounded-full">
            {activeUsers}
          </span>
        )}
      >
        Collaborators
      </TabsTrigger>
      <TabsTrigger 
        value="terminal" 
        variant="default"
        icon={<Terminal className="h-4 w-4" />}
      >
        Terminal
      </TabsTrigger>
      <TabsTrigger 
        value="settings" 
        variant="default"
        icon={<Settings className="h-4 w-4" />}
      >
        Settings
      </TabsTrigger>
    </TabsList>
    {children}
  </Tabs>
))
CollaborationTabs.displayName = 'CollaborationTabs'

const SessionTabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
>(({ children, ...props }, ref) => (
  <Tabs ref={ref} variant="default" {...props}>
    <TabsList variant="default">
      <TabsTrigger 
        value="overview" 
        variant="default"
        icon={<Database className="h-4 w-4" />}
      >
        Overview
      </TabsTrigger>
      <TabsTrigger 
        value="files" 
        variant="default"
        icon={<FileText className="h-4 w-4" />}
      >
        Files
      </TabsTrigger>
      <TabsTrigger 
        value="activity" 
        variant="default"
        icon={<Users className="h-4 w-4" />}
      >
        Activity
      </TabsTrigger>
    </TabsList>
    {children}
  </Tabs>
))
SessionTabs.displayName = 'SessionTabs'

const SettingsTabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
>(({ children, ...props }, ref) => (
  <Tabs ref={ref} orientation="vertical" variant="cards" {...props}>
    {children}
  </Tabs>
))
SettingsTabs.displayName = 'SettingsTabs'

export { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent, 
  FileTabs,
  CollaborationTabs,
  SessionTabs,
  SettingsTabs,
  tabsListVariants,
  tabsTriggerVariants,
  tabsContentVariants
}
