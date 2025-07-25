'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cva, type VariantProps } from 'class-variance-authority'
import { X, Plus, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabsListVariants = cva(
  'inline-flex items-center justify-center text-muted-foreground transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-muted p-1 rounded-md',
        underline: 'border-b border-border bg-transparent p-0',
        pills: 'bg-transparent p-0 space-x-1',
        cards: 'bg-transparent p-0 border-b border-border',
        ghost: 'bg-transparent p-0',
      },
      size: {
        sm: 'h-8 text-xs',
        default: 'h-10 text-sm',
        lg: 'h-12 text-base',
      },
      orientation: {
        horizontal: 'flex-row',
        vertical: 'flex-col w-fit',
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
  'inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 
          'rounded-sm px-3 py-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        underline:
          'border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:text-foreground hover:text-foreground',
        pills:
          'rounded-full px-4 py-2 hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
        cards:
          'border border-b-0 rounded-t-md px-4 py-2 bg-muted data-[state=active]:bg-background data-[state=active]:text-foreground',
        ghost:
          'px-3 py-1.5 hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-accent data-[state=active]:text-accent-foreground',
      },
      size: {
        sm: 'text-xs px-2 py-1',
        default: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const tabsContentVariants = cva(
  'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'mt-2',
        underline: 'mt-4',
        pills: 'mt-4',
        cards: 'border border-t-0 rounded-b-md rounded-tr-md bg-background p-4',
        ghost: 'mt-2',
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
>(({ variant, size, orientation, scrollable, addable, onAddTab, closable, onCloseTab, className, children, ...props }, ref) => (
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
}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant, size, orientation, scrollable, addable, onAddTab, showScrollButtons, children, ...props }, ref) => {
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
      {addable && (
        <button
          onClick={onAddTab}
          className={cn(
            'flex items-center justify-center rounded-sm hover:bg-accent hover:text-accent-foreground',
            size === 'sm' && 'h-6 w-6',
            size === 'default' && 'h-8 w-8',
            size === 'lg' && 'h-10 w-10'
          )}
          type="button"
          aria-label="Add new tab"
        >
          <Plus className="h-3 w-3" />
        </button>
      )}
    </TabsPrimitive.List>
  )

  if (scrollable) {
    return (
      <div className="flex items-center">
        {showScrollButtons && canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="flex items-center justify-center h-8 w-8 rounded hover:bg-accent"
            type="button"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-x-auto scrollbar-hide"
          onScroll={checkScrollability}
        >
          {tabsList}
        </div>
        {showScrollButtons && canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="flex items-center justify-center h-8 w-8 rounded hover:bg-accent"
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
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant, size, closable, onClose, icon, badge, tooltip, modified, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant, size }), 'group relative', className)}
    title={tooltip}
    {...props}
  >
    <div className="flex items-center space-x-1.5 min-w-0">
      {icon && (
        <span className="flex-shrink-0 text-muted-foreground group-data-[state=active]:text-foreground">
          {icon}
        </span>
      )}
      <span className="truncate">
        {children}
      </span>
      {modified && (
        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-orange-500" />
      )}
      {badge && (
        <span className="flex-shrink-0">
          {badge}
        </span>
      )}
    </div>
    {closable && (
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClose?.()
        }}
        className="ml-2 flex-shrink-0 rounded-sm opacity-0 group-hover:opacity-100 hover:bg-accent p-0.5 transition-opacity"
        type="button"
        aria-label="Close tab"
      >
        <X className="h-3 w-3" />
      </button>
    )}
  </TabsPrimitive.Trigger>
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

interface TabsContentProps 
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>,
    VariantProps<typeof tabsContentVariants> {
  loading?: boolean
  error?: string
}

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, variant, loading, error, children, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(tabsContentVariants({ variant }), className)}
    {...props}
  >
    {loading ? (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    ) : error ? (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-sm text-destructive mb-2">Error loading content</p>
          <p className="text-xs text-muted-foreground">{error}</p>
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
      language: string
      modified?: boolean
      icon?: React.ReactNode
    }>
    activeFileId?: string
    onFileSelect?: (fileId: string) => void
    onFileClose?: (fileId: string) => void
    onFileAdd?: () => void
  }
>(({ files, activeFileId, onFileSelect, onFileClose, onFileAdd, ...props }, ref) => (
  <Tabs
    ref={ref}
    value={activeFileId}
    onValueChange={onFileSelect}
    {...props}
  >
    <TabsList 
      variant="underline" 
      scrollable 
      showScrollButtons 
      addable={!!onFileAdd} 
      onAddTab={onFileAdd}
    >
      {files.map((file) => (
        <TabsTrigger
          key={file.id}
          value={file.id}
          variant="underline"
          closable={files.length > 1}
          onClose={() => onFileClose?.(file.id)}
          icon={file.icon}
          modified={file.modified}
          tooltip={`${file.name} (${file.language})`}
        >
          {file.name}
        </TabsTrigger>
      ))}
    </TabsList>
  </Tabs>
))
FileTabs.displayName = 'FileTabs'

const SettingsTabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
>(({ children, ...props }, ref) => (
  <Tabs ref={ref} orientation="vertical" {...props}>
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
  SettingsTabs,
  tabsListVariants,
  tabsTriggerVariants,
  tabsContentVariants
}
