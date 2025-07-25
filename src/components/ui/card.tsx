import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'shadow-sm',
        elevated: 'shadow-md hover:shadow-lg',
        outlined: 'border-2 shadow-none',
        ghost: 'border-0 shadow-none bg-transparent',
        gradient: 'bg-gradient-to-br from-card to-muted/20 shadow-md',
        glass: 'bg-card/80 backdrop-blur-sm border-border/50 shadow-lg',
        interactive: 'shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer',
        success: 'border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800',
        warning: 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800',
        error: 'border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800',
        info: 'border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800',
      },
      size: {
        sm: 'text-sm',
        default: '',
        lg: 'text-base',
      },
      padding: {
        none: '',
        sm: '[&>*]:p-4',
        default: '[&>*]:p-6',
        lg: '[&>*]:p-8',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      padding: 'default',
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  hover?: boolean
  clickable?: boolean
  loading?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, padding, hover = false, clickable = false, loading = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant, size, padding }),
        hover && 'hover:shadow-lg hover:-translate-y-1',
        clickable && 'cursor-pointer select-none active:scale-[0.98]',
        loading && 'animate-pulse opacity-60 pointer-events-none',
        className
      )}
      {...props}
    />
  )
)
Card.displayName = 'Card'

const cardHeaderVariants = cva(
  'flex flex-col space-y-1.5',
  {
    variants: {
      size: {
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
      align: {
        left: 'items-start text-left',
        center: 'items-center text-center',
        right: 'items-end text-right',
      }
    },
    defaultVariants: {
      size: 'default',
      align: 'left',
    },
  }
)

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardHeaderVariants>
>(({ className, size, align, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardHeaderVariants({ size, align }), className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const cardTitleVariants = cva(
  'font-semibold leading-none tracking-tight',
  {
    variants: {
      size: {
        sm: 'text-lg',
        default: 'text-2xl',
        lg: 'text-3xl',
        xl: 'text-4xl',
      },
      variant: {
        default: '',
        gradient: 'bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent',
        muted: 'text-muted-foreground',
      }
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
)

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & VariantProps<typeof cardTitleVariants>
>(({ className, size, variant, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(cardTitleVariants({ size, variant }), className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const cardDescriptionVariants = cva(
  'text-muted-foreground',
  {
    variants: {
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & VariantProps<typeof cardDescriptionVariants>
>(({ className, size, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(cardDescriptionVariants({ size }), className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const cardContentVariants = cva(
  '',
  {
    variants: {
      size: {
        sm: 'p-4 pt-0',
        default: 'p-6 pt-0',
        lg: 'p-8 pt-0',
      },
      spacing: {
        none: 'space-y-0',
        sm: 'space-y-2',
        default: 'space-y-4',
        lg: 'space-y-6',
      }
    },
    defaultVariants: {
      size: 'default',
      spacing: 'default',
    },
  }
)

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardContentVariants>
>(({ className, size, spacing, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(cardContentVariants({ size, spacing }), className)} 
    {...props} 
  />
))
CardContent.displayName = 'CardContent'

const cardFooterVariants = cva(
  'flex items-center',
  {
    variants: {
      size: {
        sm: 'p-4 pt-0',
        default: 'p-6 pt-0',
        lg: 'p-8 pt-0',
      },
      justify: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
      },
      direction: {
        row: 'flex-row space-x-2',
        column: 'flex-col space-y-2',
      }
    },
    defaultVariants: {
      size: 'default',
      justify: 'start',
      direction: 'row',
    },
  }
)

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardFooterVariants>
>(({ className, size, justify, direction, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardFooterVariants({ size, justify, direction }), className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

// Specialized card components for common use cases
const SessionCard = React.forwardRef<
  HTMLDivElement,
  CardProps & {
    sessionTitle: string
    sessionDescription?: string
    isActive?: boolean
    participantCount?: number
    fileCount?: number
    onJoin?: () => void
  }
>(({ sessionTitle, sessionDescription, isActive, participantCount, fileCount, onJoin, ...props }, ref) => (
  <Card 
    ref={ref}
    variant="interactive"
    onClick={onJoin}
    {...props}
  >
    <CardHeader>
      <div className="flex items-start justify-between">
        <CardTitle size="sm">{sessionTitle}</CardTitle>
        <div className="flex space-x-1">
          {isActive ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
              Active
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
              Ended
            </span>
          )}
        </div>
      </div>
      {sessionDescription && (
        <CardDescription>{sessionDescription}</CardDescription>
      )}
    </CardHeader>
    <CardFooter justify="between">
      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
        {participantCount !== undefined && (
          <span>{participantCount} participants</span>
        )}
        {fileCount !== undefined && (
          <span>{fileCount} files</span>
        )}
      </div>
    </CardFooter>
  </Card>
))
SessionCard.displayName = 'SessionCard'

const StatsCard = React.forwardRef<
  HTMLDivElement,
  CardProps & {
    title: string
    value: string | number
    description?: string
    icon?: React.ReactNode
    trend?: 'up' | 'down' | 'neutral'
    trendValue?: string
  }
>(({ title, value, description, icon, trend, trendValue, ...props }, ref) => (
  <Card ref={ref} variant="elevated" {...props}>
    <CardHeader size="sm">
      <div className="flex items-center justify-between">
        <CardTitle size="sm" variant="muted">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
    </CardHeader>
    <CardContent size="sm">
      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-bold">{value}</span>
        {trend && trendValue && (
          <span className={cn(
            'text-sm font-medium',
            trend === 'up' && 'text-green-600',
            trend === 'down' && 'text-red-600',
            trend === 'neutral' && 'text-gray-600'
          )}>
            {trendValue}
          </span>
        )}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
    </CardContent>
  </Card>
))
StatsCard.displayName = 'StatsCard'

const FeatureCard = React.forwardRef<
  HTMLDivElement,
  CardProps & {
    icon: React.ReactNode
    title: string
    description: string
  }
>(({ icon, title, description, ...props }, ref) => (
  <Card ref={ref} variant="interactive" {...props}>
    <CardHeader align="center">
      <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit mx-auto">
        {icon}
      </div>
      <CardTitle size="sm">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription size="default" className="text-center">
        {description}
      </CardDescription>
    </CardContent>
  </Card>
))
FeatureCard.displayName = 'FeatureCard'

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  SessionCard,
  StatsCard,
  FeatureCard,
  cardVariants 
}
