// import * as React from 'react'
// import { cva, type VariantProps } from 'class-variance-authority'
// import { Users, Clock, FileText, TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react'
// import { cn } from '@/lib/utils'

// const cardVariants = cva(
//   'rounded-xl border bg-card text-card-foreground transition-all duration-300 relative overflow-hidden',
//   {
//     variants: {
//       variant: {
//         default: 'shadow-sm hover:shadow-md backdrop-blur-sm',
//         elevated: 'shadow-md hover:shadow-lg backdrop-blur-sm',
//         outlined: 'border-2 shadow-none bg-card/50 backdrop-blur-sm',
//         ghost: 'border-0 shadow-none bg-transparent',
//         gradient: 'bg-gradient-to-br from-card via-card-elevated to-muted/20 shadow-md backdrop-blur-sm',
//         glass: 'glass-card shadow-lg',
//         interactive: 'card-interactive shadow-sm hover:shadow-lg hover:-translate-y-2 cursor-pointer backdrop-blur-sm',
//         success: 'border-success/30 bg-success/10 text-success-foreground backdrop-blur-sm shadow-sm shadow-success/10',
//         warning: 'border-warning/30 bg-warning/10 text-warning-foreground backdrop-blur-sm shadow-sm shadow-warning/10',
//         error: 'border-destructive/30 bg-destructive/10 text-destructive-foreground backdrop-blur-sm shadow-sm shadow-destructive/10',
//         info: 'border-info/30 bg-info/10 text-info-foreground backdrop-blur-sm shadow-sm shadow-info/10',
//         // CollabIDE-specific variants
//         session: 'glass-card hover:shadow-xl hover:-translate-y-2 cursor-pointer transition-all duration-300 border-primary/20',
//         editor: 'bg-editor-background border-border/50 shadow-lg backdrop-blur-sm',
//         collaboration: 'glass-card border-accent-purple/20 hover:border-accent-purple/40 transition-all duration-300',
//         feature: 'glass-card hover:shadow-xl hover:scale-105 cursor-pointer transition-all duration-300',
//       },
//       size: {
//         xs: 'text-xs',
//         sm: 'text-sm',
//         default: 'text-base',
//         lg: 'text-lg',
//         xl: 'text-xl',
//       },
//       padding: {
//         none: '',
//         xs: '[&>*]:p-2',
//         sm: '[&>*]:p-4',
//         default: '[&>*]:p-6',
//         lg: '[&>*]:p-8',
//         xl: '[&>*]:p-10',
//       }
//     },
//     defaultVariants: {
//       variant: 'default',
//       size: 'default',
//       padding: 'default',
//     },
//   }
// )

// export interface CardProps
//   extends React.HTMLAttributes<HTMLDivElement>,
//     VariantProps<typeof cardVariants> {
//   hover?: boolean
//   clickable?: boolean
//   loading?: boolean
//   glow?: boolean
//   pulse?: boolean
//   animated?: boolean
// }

// const Card = React.forwardRef<HTMLDivElement, CardProps>(
//   ({ 
//     className, 
//     variant, 
//     size, 
//     padding, 
//     hover = false, 
//     clickable = false, 
//     loading = false,
//     glow = false,
//     pulse = false,
//     animated = false,
//     ...props 
//   }, ref) => (
//     <div
//       ref={ref}
//       className={cn(
//         cardVariants({ variant, size, padding }),
//         hover && 'hover:shadow-lg hover:-translate-y-1',
//         clickable && 'cursor-pointer select-none active:scale-[0.98] hover:scale-105',
//         loading && 'animate-pulse opacity-60 pointer-events-none',
//         glow && 'animate-glow',
//         pulse && 'animate-pulse-subtle',
//         animated && 'animate-fade-in',
//         className
//       )}
//       {...props}
//     />
//   )
// )
// Card.displayName = 'Card'

// const cardHeaderVariants = cva(
//   'flex flex-col space-y-2',
//   {
//     variants: {
//       size: {
//         xs: 'p-2',
//         sm: 'p-4',
//         default: 'p-6',
//         lg: 'p-8',
//         xl: 'p-10',
//       },
//       align: {
//         left: 'items-start text-left',
//         center: 'items-center text-center',
//         right: 'items-end text-right',
//       }
//     },
//     defaultVariants: {
//       size: 'default',
//       align: 'left',
//     },
//   }
// )

// const CardHeader = React.forwardRef<
//   HTMLDivElement,
//   React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardHeaderVariants>
// >(({ className, size, align, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={cn(cardHeaderVariants({ size, align }), className)}
//     {...props}
//   />
// ))
// CardHeader.displayName = 'CardHeader'

// const cardTitleVariants = cva(
//   'font-semibold leading-tight tracking-tight',
//   {
//     variants: {
//       size: {
//         xs: 'text-sm',
//         sm: 'text-base',
//         default: 'text-xl',
//         lg: 'text-2xl',
//         xl: 'text-3xl',
//         '2xl': 'text-4xl',
//       },
//       variant: {
//         default: 'text-foreground',
//         gradient: 'gradient-text',
//         muted: 'text-muted-foreground',
//         primary: 'text-primary',
//         success: 'text-success-foreground',
//         warning: 'text-warning-foreground',
//         error: 'text-destructive-foreground',
//         info: 'text-info-foreground',
//       }
//     },
//     defaultVariants: {
//       size: 'default',
//       variant: 'default',
//     },
//   }
// )

// const CardTitle = React.forwardRef<
//   HTMLHeadingElement,
//   React.HTMLAttributes<HTMLHeadingElement> & VariantProps<typeof cardTitleVariants>
// >(({ className, size, variant, ...props }, ref) => (
//   <h3
//     ref={ref}
//     className={cn(cardTitleVariants({ size, variant }), className)}
//     {...props}
//   />
// ))
// CardTitle.displayName = 'CardTitle'

// const cardDescriptionVariants = cva(
//   'text-muted-foreground leading-relaxed',
//   {
//     variants: {
//       size: {
//         xs: 'text-xs',
//         sm: 'text-xs',
//         default: 'text-sm',
//         lg: 'text-base',
//         xl: 'text-lg',
//       },
//     },
//     defaultVariants: {
//       size: 'default',
//     },
//   }
// )

// const CardDescription = React.forwardRef<
//   HTMLParagraphElement,
//   React.HTMLAttributes<HTMLParagraphElement> & VariantProps<typeof cardDescriptionVariants>
// >(({ className, size, ...props }, ref) => (
//   <p
//     ref={ref}
//     className={cn(cardDescriptionVariants({ size }), className)}
//     {...props}
//   />
// ))
// CardDescription.displayName = 'CardDescription'

// const cardContentVariants = cva(
//   '',
//   {
//     variants: {
//       size: {
//         xs: 'p-2 pt-0',
//         sm: 'p-4 pt-0',
//         default: 'p-6 pt-0',
//         lg: 'p-8 pt-0',
//         xl: 'p-10 pt-0',
//       },
//       spacing: {
//         none: 'space-y-0',
//         xs: 'space-y-1',
//         sm: 'space-y-2',
//         default: 'space-y-4',
//         lg: 'space-y-6',
//         xl: 'space-y-8',
//       }
//     },
//     defaultVariants: {
//       size: 'default',
//       spacing: 'default',
//     },
//   }
// )

// const CardContent = React.forwardRef<
//   HTMLDivElement,
//   React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardContentVariants>
// >(({ className, size, spacing, ...props }, ref) => (
//   <div 
//     ref={ref} 
//     className={cn(cardContentVariants({ size, spacing }), className)} 
//     {...props} 
//   />
// ))
// CardContent.displayName = 'CardContent'

// const cardFooterVariants = cva(
//   'flex items-center',
//   {
//     variants: {
//       size: {
//         xs: 'p-2 pt-0',
//         sm: 'p-4 pt-0',
//         default: 'p-6 pt-0',
//         lg: 'p-8 pt-0',
//         xl: 'p-10 pt-0',
//       },
//       justify: {
//         start: 'justify-start',
//         center: 'justify-center',
//         end: 'justify-end',
//         between: 'justify-between',
//         around: 'justify-around',
//         evenly: 'justify-evenly',
//       },
//       direction: {
//         row: 'flex-row gap-2',
//         column: 'flex-col gap-2',
//       }
//     },
//     defaultVariants: {
//       size: 'default',
//       justify: 'start',
//       direction: 'row',
//     },
//   }
// )

// const CardFooter = React.forwardRef<
//   HTMLDivElement,
//   React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardFooterVariants>
// >(({ className, size, justify, direction, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={cn(cardFooterVariants({ size, justify, direction }), className)}
//     {...props}
//   />
// ))
// CardFooter.displayName = 'CardFooter'

// // Enhanced specialized card components for CollabIDE
// const SessionCard = React.forwardRef<
//   HTMLDivElement,
//   CardProps & {
//     sessionTitle: string
//     sessionDescription?: string
//     isActive?: boolean
//     participantCount?: number
//     fileCount?: number
//     lastActivity?: string
//     hostName?: string
//     onJoin?: () => void
//     loading?: boolean
//   }
// >(({ 
//   sessionTitle, 
//   sessionDescription, 
//   isActive, 
//   participantCount, 
//   fileCount, 
//   lastActivity,
//   hostName,
//   onJoin, 
//   loading = false,
//   ...props 
// }, ref) => (
//   <Card 
//     ref={ref}
//     variant="session"
//     clickable
//     onClick={onJoin}
//     loading={loading}
//     {...props}
//   >
//     {/* <CardHeader size="sm">
//       <div className="flex items-start justify-between">
//         <div className="flex-1 min-w-0">
//           <CardTitle size="sm" className="truncate">{sessionTitle}</CardTitle>
//           {hostName && (
//             <p className="text-xs text-muted-foreground mt-1">
//               Hosted by {hostName}
//             </p>
//           )}
//         </div>
//         <div className="flex items-center gap-2 ml-5 whitespace-nowrap">
//   {isActive ? (
//     <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/20 border border-success/30">
//       <div className="w-2 h-2 rounded-full bg-success animate-pulse-subtle" />
//       <span className="text-xs font-medium text-success-foreground">Active</span>
//     </div>
//   ) : (
//     <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted/20 border border-border">
//       <div className="w-2 h-2 rounded-full bg-muted-foreground" />
//       <span className="text-xs font-medium text-muted-foreground">Ended</span>
//     </div>
//   )}
// </div>

//       </div>
//       {sessionDescription && (
//         <CardDescription size="sm" className="line-clamp-2">
//           {sessionDescription}
//         </CardDescription>
//       )}
//     </CardHeader> */}
//     <CardHeader size="sm">
//   <div className="flex items-center justify-between gap-4">
//     {/* Title and Host Info */}
//     <div className="flex-1 min-w-0">
//       <CardTitle size="sm" className="truncate">
//         {sessionTitle}
//       </CardTitle>
//       {hostName && (
//         <p className="text-xs text-muted-foreground mt-1">
//           Hosted by {hostName}
//         </p>
//       )}
//     </div>

//     {/* Status Pill */}
//     <div className="flex items-center whitespace-nowrap">
//       {isActive ? (
//         <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/20 border border-success/30">
//           <div className="w-2 h-2 rounded-full bg-success animate-pulse-subtle" />
//           <span className="text-xs font-medium text-success-foreground">Active</span>
//         </div>
//       ) : (
//         <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted/20 border border-border">
//           <div className="w-2 h-2 rounded-full bg-muted-foreground" />
//           <span className="text-xs font-medium text-muted-foreground">Ended</span>
//         </div>
//       )}
//     </div>
//   </div>

//   {/* Description */}
//   {sessionDescription && (
//     <CardDescription size="sm" className="line-clamp-2">
//       {sessionDescription}
//     </CardDescription>
//   )}
// </CardHeader>

//     <CardFooter size="sm" justify="between">
//       <div className="flex items-center gap-4 text-xs text-muted-foreground">
//         {participantCount !== undefined && (
//           <div className="flex items-center gap-1">
//             <Users className="w-3 h-3" />
//             <span>{participantCount} {participantCount === 1 ? 'participant' : 'participants'}</span>
//           </div>
//         )}
//         {fileCount !== undefined && (
//           <div className="flex items-center gap-1">
//             <FileText className="w-3 h-3" />
//             <span>{fileCount} {fileCount === 1 ? 'file' : 'files'}</span>
//           </div>
//         )}
//       </div>
//       {lastActivity && (
//         <div className="flex items-center gap-1 text-xs text-muted-foreground">
//           <Clock className="w-3 h-3" />
//           <span>{lastActivity}</span>
//         </div>
//       )}
//     </CardFooter>
    
//     {loading && (
//       <div className="absolute inset-0 bg-card/80 backdrop-blur-sm flex items-center justify-center">
//         <Loader2 className="w-6 h-6 animate-spin text-primary" />
//       </div>
//     )}
//   </Card>
// ))
// SessionCard.displayName = 'SessionCard'

// const StatsCard = React.forwardRef<
//   HTMLDivElement,
//   CardProps & {
//     title: string
//     value: string | number
//     description?: string
//     icon?: React.ReactNode
//     trend?: 'up' | 'down' | 'neutral'
//     trendValue?: string
//     loading?: boolean
//   }
// >(({ title, value, description, icon, trend, trendValue, loading = false, ...props }, ref) => {
//   const getTrendIcon = () => {
//     switch (trend) {
//       case 'up': return <TrendingUp className="w-3 h-3" />
//       case 'down': return <TrendingDown className="w-3 h-3" />
//       case 'neutral': return <Minus className="w-3 h-3" />
//       default: return null
//     }
//   }

//   const getTrendColor = () => {
//     switch (trend) {
//       case 'up': return 'text-success'
//       case 'down': return 'text-destructive'
//       case 'neutral': return 'text-muted-foreground'
//       default: return 'text-muted-foreground'
//     }
//   }

//   return (
//     <Card ref={ref} variant="elevated" loading={loading} {...props}>
//       <CardHeader size="sm">
//         <div className="flex items-center justify-between">
//           <CardTitle size="sm" variant="muted" className="font-medium">
//             {title}
//           </CardTitle>
//           {icon && (
//             <div className="p-2 bg-primary/10 rounded-lg text-primary">
//               {React.isValidElement(icon) 
//                 ? React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4' })
//                 : icon
//               }
//             </div>
//           )}
//         </div>
//       </CardHeader>
//       <CardContent size="sm" spacing="sm">
//         <div className="flex items-baseline gap-2">
//           <span className="text-3xl font-bold text-foreground">{value}</span>
//           {trend && trendValue && (
//             <div className={cn('flex items-center gap-1 text-sm font-medium', getTrendColor())}>
//               {getTrendIcon()}
//               <span>{trendValue}</span>
//             </div>
//           )}
//         </div>
//         {description && (
//           <CardDescription size="sm" className="mt-2">
//             {description}
//           </CardDescription>
//         )}
//       </CardContent>
//     </Card>
//   )
// })
// StatsCard.displayName = 'StatsCard'

// const FeatureCard = React.forwardRef<
//   HTMLDivElement,
//   CardProps & {
//     icon: React.ReactNode
//     title: string
//     description: string
//     comingSoon?: boolean
//   }
// >(({ icon, title, description, comingSoon = false, ...props }, ref) => (
//   <Card ref={ref} variant="feature" {...props}>
//     <CardHeader align="center" size="sm">
//       <div className="relative mb-4 p-4 bg-gradient-to-br from-primary/20 to-accent-blue/20 rounded-2xl w-fit mx-auto backdrop-blur-sm border border-primary/20">
//         {React.isValidElement(icon) 
//           ? React.cloneElement(icon as React.ReactElement, { 
//               className: 'w-8 h-8 text-primary' 
//             })
//           : icon
//         }
//         {comingSoon && (
//           <div className="absolute -top-2 -right-2 px-2 py-1 bg-warning text-warning-foreground text-xs font-medium rounded-full border border-warning/30">
//             Soon
//           </div>
//         )}
//       </div>
//       <CardTitle size="sm" className="text-center">
//         {title}
//       </CardTitle>
//     </CardHeader>
//     <CardContent size="sm">
//       <CardDescription size="default" className="text-center leading-relaxed">
//         {description}
//       </CardDescription>
//     </CardContent>
//   </Card>
// ))
// FeatureCard.displayName = 'FeatureCard'

// // New CollabIDE-specific card components
// const CollaboratorCard = React.forwardRef<
//   HTMLDivElement,
//   CardProps & {
//     name: string
//     avatar?: string
//     status: 'online' | 'offline' | 'away'
//     role: 'host' | 'collaborator' | 'viewer'
//     currentFile?: string
//     joinedAt?: string
//   }
// >(({ name, avatar, status, role, currentFile, joinedAt, ...props }, ref) => {
//   const getStatusColor = () => {
//     switch (status) {
//       case 'online': return 'bg-success'
//       case 'away': return 'bg-warning'
//       case 'offline': return 'bg-muted-foreground'
//     }
//   }

//   const getRoleColor = () => {
//     switch (role) {
//       case 'host': return 'bg-primary/20 text-primary border-primary/30'
//       case 'collaborator': return 'bg-accent-purple/20 text-accent-purple border-accent-purple/30'
//       case 'viewer': return 'bg-muted/20 text-muted-foreground border-border'
//     }
//   }

//   return (
//     <Card ref={ref} variant="collaboration" size="sm" {...props}>
//       <CardContent size="sm" spacing="sm">
//         <div className="flex items-center gap-3">
//           <div className="relative">
//             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center text-white font-semibold">
//               {avatar ? (
//                 <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
//               ) : (
//                 name.charAt(0).toUpperCase()
//               )}
//             </div>
//             <div className={cn('absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card', getStatusColor())} />
//           </div>
          
//           <div className="flex-1 min-w-0">
//             <div className="flex items-center gap-2">
//               <p className="font-medium text-foreground truncate">{name}</p>
//               <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium border', getRoleColor())}>
//                 {role}
//               </span>
//             </div>
//             {currentFile && (
//               <p className="text-xs text-muted-foreground truncate">
//                 Editing: {currentFile}
//               </p>
//             )}
//             {joinedAt && (
//               <p className="text-xs text-muted-foreground">
//                 Joined {joinedAt}
//               </p>
//             )}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// })
// CollaboratorCard.displayName = 'CollaboratorCard'

// const ProjectCard = React.forwardRef<
//   HTMLDivElement,
//   CardProps & {
//     name: string
//     description?: string
//     lastModified: string
//     fileCount: number
//     collaboratorCount: number
//     language?: string
//     isPrivate?: boolean
//     onOpen?: () => void
//   }
// >(({ name, description, lastModified, fileCount, collaboratorCount, language, isPrivate = false, onOpen, ...props }, ref) => (
//   <Card ref={ref} variant="interactive" clickable onClick={onOpen} {...props}>
//     <CardHeader size="sm">
//       <div className="flex items-start justify-between">
//         <div className="flex-1 min-w-0">
//           <CardTitle size="sm" className="truncate flex items-center gap-2">
//             {name}
//             {isPrivate && (
//               <div className="px-2 py-0.5 bg-muted/50 rounded text-xs text-muted-foreground">
//                 Private
//               </div>
//             )}
//           </CardTitle>
//           {description && (
//             <CardDescription size="sm" className="line-clamp-2 mt-1">
//               {description}
//             </CardDescription>
//           )}
//         </div>
//         {language && (
//           <div className="ml-2 px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded border border-primary/20">
//             {language}
//           </div>
//         )}
//       </div>
//     </CardHeader>
    
//     <CardFooter size="sm" justify="between">
//       <div className="flex items-center gap-4 text-xs text-muted-foreground">
//         <div className="flex items-center gap-1">
//           <FileText className="w-3 h-3" />
//           <span>{fileCount} files</span>
//         </div>
//         <div className="flex items-center gap-1">
//           <Users className="w-3 h-3" />
//           <span>{collaboratorCount} collaborators</span>
//         </div>
//       </div>
//       <div className="flex items-center gap-1 text-xs text-muted-foreground">
//         <Clock className="w-3 h-3" />
//         <span>{lastModified}</span>
//       </div>
//     </CardFooter>
//   </Card>
// ))
// ProjectCard.displayName = 'ProjectCard'

// export { 
//   Card, 
//   CardHeader, 
//   CardFooter, 
//   CardTitle, 
//   CardDescription, 
//   CardContent,
//   SessionCard,
//   StatsCard,
//   FeatureCard,
//   CollaboratorCard,
//   ProjectCard,
//   cardVariants 
// }


import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Users, Clock, FileText, TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const cardVariants = cva(
  'rounded-lg border bg-gray-900 text-white transition-colors relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 'border-gray-700 shadow-sm hover:border-gray-600',
        elevated: 'border-gray-700 shadow-md',
        outlined: 'border-2 border-gray-600 bg-gray-900/50',
        ghost: 'border-0 shadow-none bg-transparent',
        interactive: 'border-gray-700 shadow-sm hover:border-gray-600 hover:shadow-md cursor-pointer',
        success: 'border-green-700 bg-green-900/20 text-green-200',
        warning: 'border-yellow-700 bg-yellow-900/20 text-yellow-200',
        error: 'border-red-700 bg-red-900/20 text-red-200',
        info: 'border-blue-700 bg-blue-900/20 text-blue-200',
        // CollabIDE-specific variants
        session: 'border-blue-700/50 hover:border-blue-600 hover:shadow-md cursor-pointer',
        editor: 'border-gray-700 shadow-md bg-gray-900',
        collaboration: 'border-purple-700/50 hover:border-purple-600',
      },
      size: {
        xs: 'text-xs',
        sm: 'text-sm',
        default: 'text-base',
        lg: 'text-lg',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
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
  ({ 
    className, 
    variant, 
    size,
    hover = false, 
    clickable = false, 
    loading = false,
    ...props 
  }, ref) => (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant, size }),
        hover && 'hover:shadow-md',
        clickable && 'cursor-pointer select-none active:scale-[0.98]',
        loading && 'opacity-50 pointer-events-none',
        className
      )}
      {...props}
    />
  )
)
Card.displayName = 'Card'

const cardHeaderVariants = cva(
  'flex flex-col space-y-2',
  {
    variants: {
      size: {
        xs: 'p-3',
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
  'font-semibold leading-tight tracking-tight',
  {
    variants: {
      size: {
        xs: 'text-sm',
        sm: 'text-base',
        default: 'text-xl',
        lg: 'text-2xl',
        xl: 'text-3xl',
      },
      variant: {
        default: 'text-white',
        muted: 'text-gray-400',
        primary: 'text-blue-400',
        success: 'text-green-300',
        warning: 'text-yellow-300',
        error: 'text-red-300',
        info: 'text-blue-300',
      }
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
)

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
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
  'text-gray-400 leading-relaxed',
  {
    variants: {
      size: {
        xs: 'text-xs',
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
        xs: 'p-3 pt-0',
        sm: 'p-4 pt-0',
        default: 'p-6 pt-0',
        lg: 'p-8 pt-0',
      },
      spacing: {
        none: 'space-y-0',
        xs: 'space-y-1',
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
        xs: 'p-3 pt-0',
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
        row: 'flex-row gap-2',
        column: 'flex-col gap-2',
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

// Specialized card components
const SessionCard = React.forwardRef<
  HTMLDivElement,
  CardProps & {
    sessionTitle: string
    sessionDescription?: string
    isActive?: boolean
    participantCount?: number
    fileCount?: number
    lastActivity?: string
    hostName?: string
    onJoin?: () => void
    loading?: boolean
  }
>(({ 
  sessionTitle, 
  sessionDescription, 
  isActive, 
  participantCount, 
  fileCount, 
  lastActivity,
  hostName,
  onJoin, 
  loading = false,
  ...props 
}, ref) => (
  <Card 
    ref={ref}
    variant="session"
    clickable
    onClick={onJoin}
    loading={loading}
    {...props}
  >
    <CardHeader size="sm">
      <div className="flex items-center justify-between gap-4">
        {/* Title and Host Info */}
        <div className="flex-1 min-w-0">
          <CardTitle size="sm" className="truncate">
            {sessionTitle}
          </CardTitle>
          {hostName && (
            <p className="text-xs text-gray-400 mt-1">
              Hosted by {hostName}
            </p>
          )}
        </div>

        {/* Status Pill */}
        <div className="flex items-center whitespace-nowrap">
          {isActive ? (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-900/30 border border-green-700">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs font-medium text-green-300">Active</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-800 border border-gray-700">
              <div className="w-2 h-2 rounded-full bg-gray-500" />
              <span className="text-xs font-medium text-gray-400">Ended</span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {sessionDescription && (
        <CardDescription size="sm" className="line-clamp-2">
          {sessionDescription}
        </CardDescription>
      )}
    </CardHeader>

    <CardFooter size="sm" justify="between">
      <div className="flex items-center gap-4 text-xs text-gray-400">
        {participantCount !== undefined && (
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{participantCount} {participantCount === 1 ? 'participant' : 'participants'}</span>
          </div>
        )}
        {fileCount !== undefined && (
          <div className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            <span>{fileCount} {fileCount === 1 ? 'file' : 'files'}</span>
          </div>
        )}
      </div>
      {lastActivity && (
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="w-3 h-3" />
          <span>{lastActivity}</span>
        </div>
      )}
    </CardFooter>
    
    {loading && (
      <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    )}
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
    loading?: boolean
  }
>(({ title, value, description, icon, trend, trendValue, loading = false, ...props }, ref) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3" />
      case 'down': return <TrendingDown className="w-3 h-3" />
      case 'neutral': return <Minus className="w-3 h-3" />
      default: return null
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-400'
      case 'down': return 'text-red-400'
      case 'neutral': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <Card ref={ref} variant="elevated" loading={loading} {...props}>
      <CardHeader size="sm">
        <div className="flex items-center justify-between">
          <CardTitle size="sm" variant="muted" className="font-medium">
            {title}
          </CardTitle>
          {icon && (
            <div className="p-2 bg-blue-900/30 rounded-lg text-blue-400">
              {React.isValidElement(icon) 
                ? React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4' })
                : icon
              }
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent size="sm" spacing="sm">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">{value}</span>
          {trend && trendValue && (
            <div className={cn('flex items-center gap-1 text-sm font-medium', getTrendColor())}>
              {getTrendIcon()}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        {description && (
          <CardDescription size="sm" className="mt-2">
            {description}
          </CardDescription>
        )}
      </CardContent>
    </Card>
  )
})
StatsCard.displayName = 'StatsCard'

const FeatureCard = React.forwardRef<
  HTMLDivElement,
  CardProps & {
    icon: React.ReactNode
    title: string
    description: string
    comingSoon?: boolean
  }
>(({ icon, title, description, comingSoon = false, ...props }, ref) => (
  <Card ref={ref} variant="interactive" {...props}>
    <CardHeader align="center" size="sm">
      <div className="relative mb-4 p-4 bg-blue-900/30 rounded-xl w-fit mx-auto">
        {React.isValidElement(icon) 
          ? React.cloneElement(icon as React.ReactElement, { 
              className: 'w-8 h-8 text-blue-400' 
            })
          : icon
        }
        {comingSoon && (
          <div className="absolute -top-2 -right-2 px-2 py-1 bg-yellow-600 text-black text-xs font-medium rounded-full">
            Soon
          </div>
        )}
      </div>
      <CardTitle size="sm" className="text-center">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent size="sm">
      <CardDescription size="default" className="text-center leading-relaxed">
        {description}
      </CardDescription>
    </CardContent>
  </Card>
))
FeatureCard.displayName = 'FeatureCard'

const CollaboratorCard = React.forwardRef<
  HTMLDivElement,
  CardProps & {
    name: string
    avatar?: string
    status: 'online' | 'offline' | 'away'
    role: 'host' | 'collaborator' | 'viewer'
    currentFile?: string
    joinedAt?: string
  }
>(({ name, avatar, status, role, currentFile, joinedAt, ...props }, ref) => {
  const getStatusColor = () => {
    switch (status) {
      case 'online': return 'bg-green-400'
      case 'away': return 'bg-yellow-400'
      case 'offline': return 'bg-gray-500'
    }
  }

  const getRoleColor = () => {
    switch (role) {
      case 'host': return 'bg-blue-900/30 text-blue-300 border-blue-700'
      case 'collaborator': return 'bg-purple-900/30 text-purple-300 border-purple-700'
      case 'viewer': return 'bg-gray-800 text-gray-400 border-gray-700'
    }
  }

  return (
    <Card ref={ref} variant="collaboration" size="sm" {...props}>
      <CardContent size="sm" spacing="sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              {avatar ? (
                <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
              ) : (
                name.charAt(0).toUpperCase()
              )}
            </div>
            <div className={cn('absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900', getStatusColor())} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-white truncate">{name}</p>
              <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium border', getRoleColor())}>
                {role}
              </span>
            </div>
            {currentFile && (
              <p className="text-xs text-gray-400 truncate">
                Editing: {currentFile}
              </p>
            )}
            {joinedAt && (
              <p className="text-xs text-gray-400">
                Joined {joinedAt}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
CollaboratorCard.displayName = 'CollaboratorCard'

const ProjectCard = React.forwardRef<
  HTMLDivElement,
  CardProps & {
    name: string
    description?: string
    lastModified: string
    fileCount: number
    collaboratorCount: number
    language?: string
    isPrivate?: boolean
    onOpen?: () => void
  }
>(({ name, description, lastModified, fileCount, collaboratorCount, language, isPrivate = false, onOpen, ...props }, ref) => (
  <Card ref={ref} variant="interactive" clickable onClick={onOpen} {...props}>
    <CardHeader size="sm">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <CardTitle size="sm" className="truncate flex items-center gap-2">
            {name}
            {isPrivate && (
              <div className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-400">
                Private
              </div>
            )}
          </CardTitle>
          {description && (
            <CardDescription size="sm" className="line-clamp-2 mt-1">
              {description}
            </CardDescription>
          )}
        </div>
        {language && (
          <div className="ml-2 px-2 py-1 bg-blue-900/30 text-blue-300 text-xs font-medium rounded border border-blue-700">
            {language}
          </div>
        )}
      </div>
    </CardHeader>
    
    <CardFooter size="sm" justify="between">
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <FileText className="w-3 h-3" />
          <span>{fileCount} files</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          <span>{collaboratorCount} collaborators</span>
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs text-gray-400">
        <Clock className="w-3 h-3" />
        <span>{lastModified}</span>
      </div>
    </CardFooter>
  </Card>
))
ProjectCard.displayName = 'ProjectCard'

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
  CollaboratorCard,
  ProjectCard,
  cardVariants 
}
