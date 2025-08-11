// import React from 'react'
// import { cn } from '@/lib/utils'

// interface LogoProps {
//   className?: string
//   size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
//   variant?: 'full' | 'icon' | 'text' | 'minimal'
//   animated?: boolean
//   interactive?: boolean
//   glow?: boolean
//   theme?: 'default' | 'monochrome' | 'brand'
// }

// const Logo: React.FC<LogoProps> = ({ 
//   className, 
//   size = 'md', 
//   variant = 'full', 
//   animated = false,
//   interactive = false,
//   glow = false,
//   theme = 'default'
// }) => {
//   const sizeClasses = {
//     xs: 'h-4 w-auto',
//     sm: 'h-6 w-auto',
//     md: 'h-8 w-auto',
//     lg: 'h-12 w-auto',
//     xl: 'h-16 w-auto',
//     '2xl': 'h-20 w-auto'
//   }

//   const iconSizes = {
//     xs: { width: 16, height: 16, fontSize: 12, spacing: 'space-x-1' },
//     sm: { width: 24, height: 24, fontSize: 14, spacing: 'space-x-1.5' },
//     md: { width: 32, height: 32, fontSize: 18, spacing: 'space-x-2' },
//     lg: { width: 48, height: 48, fontSize: 24, spacing: 'space-x-2.5' },
//     xl: { width: 64, height: 64, fontSize: 32, spacing: 'space-x-3' },
//     '2xl': { width: 80, height: 80, fontSize: 40, spacing: 'space-x-4' }
//   }

//   const currentSize = iconSizes[size]

//   // Get theme-specific styles
//   const getThemeStyles = () => {
//     switch (theme) {
//       case 'monochrome':
//         return {
//           iconBg: 'bg-foreground',
//           iconText: 'text-background',
//           textGradient: 'text-foreground',
//           shadow: 'shadow-lg'
//         }
//       case 'brand':
//         return {
//           iconBg: 'bg-gradient-to-br from-primary via-accent-purple to-accent-blue',
//           iconText: 'text-white',
//           textGradient: 'gradient-text',
//           shadow: 'shadow-xl shadow-primary/20'
//         }
//       default:
//         return {
//           iconBg: 'bg-gradient-to-br from-primary via-accent-purple to-accent-blue',
//           iconText: 'text-white',
//           textGradient: 'gradient-text',
//           shadow: 'shadow-lg'
//         }
//     }
//   }

//   const themeStyles = getThemeStyles()

//   // Enhanced SVG Icon Component
//   const CollabIcon = ({ className: iconClassName }: { className?: string }) => (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       className={cn('text-current', iconClassName)}
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       {/* Code brackets with enhanced animation */}
//       <path
//         d="M8 6L2 12L8 18"
//         stroke="currentColor"
//         strokeWidth="2.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         className={animated ? 'animate-code-pulse-left' : ''}
//       />
//       <path
//         d="M16 6L22 12L16 18"
//         stroke="currentColor"
//         strokeWidth="2.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         className={animated ? 'animate-code-pulse-right' : ''}
//       />
      
//       {/* Collaboration connection lines */}
//       <path
//         d="M10 9L14 9"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         opacity="0.7"
//         className={animated ? 'animate-connection-pulse' : ''}
//         style={{ animationDelay: '0.3s' }}
//       />
//       <path
//         d="M10 12L14 12"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         opacity="0.8"
//         className={animated ? 'animate-connection-pulse' : ''}
//         style={{ animationDelay: '0.6s' }}
//       />
//       <path
//         d="M10 15L14 15"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         opacity="0.7"
//         className={animated ? 'animate-connection-pulse' : ''}
//         style={{ animationDelay: '0.9s' }}
//       />
      
//       {/* Center collaboration dots with staggered animation */}
//       <circle 
//         cx="9" 
//         cy="9" 
//         r="1" 
//         fill="currentColor" 
//         className={animated ? 'animate-collab-bounce' : ''}
//         style={{ animationDelay: '0.2s' }}
//       />
//       <circle 
//         cx="15" 
//         cy="12" 
//         r="1" 
//         fill="currentColor" 
//         opacity="0.8" 
//         className={animated ? 'animate-collab-bounce' : ''}
//         style={{ animationDelay: '0.7s' }}
//       />
//       <circle 
//         cx="9" 
//         cy="15" 
//         r="1" 
//         fill="currentColor" 
//         opacity="0.6" 
//         className={animated ? 'animate-collab-bounce' : ''}
//         style={{ animationDelay: '1.2s' }}
//       />
//     </svg>
//   )

//   // Minimal variant (smallest possible)
//   if (variant === 'minimal') {
//     return (
//       <div className={cn(
//         'inline-flex items-center justify-center rounded-lg transition-all duration-300',
//         themeStyles.iconBg,
//         themeStyles.shadow,
//         interactive && 'hover:scale-110 active:scale-95 cursor-pointer',
//         glow && 'animate-glow',
//         animated && 'hover:rotate-3',
//         className
//       )} style={{ width: currentSize.width, height: currentSize.height }}>
//         <CollabIcon className={cn('w-3/5 h-3/5', themeStyles.iconText)} />
//       </div>
//     )
//   }

//   // Icon-only variant
//   if (variant === 'icon') {
//     return (
//       <div className="relative group">
//         {/* Glow effect background */}
//         {glow && (
//           <div className={cn(
//             'absolute inset-0 rounded-lg blur-md opacity-50 transition-opacity duration-300',
//             themeStyles.iconBg,
//             'group-hover:opacity-75'
//           )} style={{ width: currentSize.width, height: currentSize.height }} />
//         )}
        
//         {/* Main icon */}
//         <div className={cn(
//           'relative inline-flex items-center justify-center rounded-lg backdrop-blur-sm transition-all duration-300',
//           themeStyles.iconBg,
//           themeStyles.shadow,
//           interactive && 'hover:scale-110 active:scale-95 cursor-pointer hover:rotate-2',
//           animated && 'animate-float',
//           className
//         )} style={{ width: currentSize.width, height: currentSize.height }}>
//           {/* Glass overlay effect */}
//           <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-lg" />
          
//           <CollabIcon className={cn('w-3/5 h-3/5', themeStyles.iconText)} />
          
//           {/* Floating particles for enhanced animation */}
//           {animated && (
//             <>
//               <div className="absolute -top-1 -right-1 w-1 h-1 bg-accent-cyan rounded-full animate-float opacity-70" 
//                    style={{ animationDelay: '0s', animationDuration: '3s' }} />
//               <div className="absolute -bottom-1 -left-1 w-0.5 h-0.5 bg-accent-pink rounded-full animate-float opacity-60" 
//                    style={{ animationDelay: '1s', animationDuration: '4s' }} />
//             </>
//           )}
//         </div>
//       </div>
//     )
//   }

//   // Text-only variant
//   if (variant === 'text') {
//     return (
//       <div className={cn(
//         'inline-flex items-center',
//         interactive && 'transition-all duration-300 hover:scale-105 cursor-pointer',
//         className
//       )}>
//         <span 
//           className={cn(
//             'font-bold tracking-tight transition-all duration-300',
//             themeStyles.textGradient,
//             interactive && 'hover:scale-105',
//             animated && 'animate-gradient-shift',
//             glow && 'animate-glow'
//           )}
//           style={{ fontSize: currentSize.fontSize }}
//         >
//           CollabIDE
//         </span>
//       </div>
//     )
//   }

//   // Full logo (icon + text)
//   return (
//     <div className={cn(
//       'inline-flex items-center',
//       currentSize.spacing,
//       interactive && 'transition-all duration-300 hover:scale-105 cursor-pointer group',
//       animated && 'animate-fade-in',
//       className
//     )}>
//       {/* Icon with enhanced effects */}
//       <div className="relative">
//         {/* Glow effect background */}
//         {glow && (
//           <div className={cn(
//             'absolute inset-0 rounded-lg blur-md opacity-50 transition-opacity duration-300',
//             themeStyles.iconBg,
//             interactive && 'group-hover:opacity-75'
//           )} style={{ width: currentSize.width, height: currentSize.height }} />
//         )}
        
//         {/* Main icon */}
//         <div 
//           className={cn(
//             'relative inline-flex items-center justify-center rounded-lg backdrop-blur-sm transition-all duration-300',
//             themeStyles.iconBg,
//             themeStyles.shadow,
//             interactive && 'group-hover:rotate-2 group-hover:scale-110',
//             animated && 'animate-float'
//           )}
//           style={{ width: currentSize.width, height: currentSize.height }}
//         >
//           {/* Glass overlay effect */}
//           <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-lg" />
          
//           <CollabIcon className={cn('w-3/5 h-3/5', themeStyles.iconText)} />
//         </div>
//       </div>

//       {/* Text with enhanced effects */}
//       <span 
//         className={cn(
//           'font-bold tracking-tight transition-all duration-300',
//           themeStyles.textGradient,
//           interactive && 'group-hover:scale-105',
//           animated && size !== 'xs' && size !== 'sm' && 'animate-gradient-shift',
//           glow && 'text-shadow-glow'
//         )}
//         style={{ fontSize: currentSize.fontSize }}
//       >
//         CollabIDE
//       </span>
//     </div>
//   )
// }

// export default Logo

import React from 'react'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  variant?: 'full' | 'icon' | 'text' | 'minimal'
  interactive?: boolean
  theme?: 'default' | 'monochrome'
}

const Logo: React.FC<LogoProps> = ({ 
  className, 
  size = 'md', 
  variant = 'full', 
  interactive = false,
  theme = 'default'
}) => {
  const iconSizes = {
    xs: { width: 16, height: 16, fontSize: 12, spacing: 'space-x-1' },
    sm: { width: 24, height: 24, fontSize: 14, spacing: 'space-x-1.5' },
    md: { width: 32, height: 32, fontSize: 18, spacing: 'space-x-2' },
    lg: { width: 48, height: 48, fontSize: 24, spacing: 'space-x-2.5' },
    xl: { width: 64, height: 64, fontSize: 32, spacing: 'space-x-3' },
    '2xl': { width: 80, height: 80, fontSize: 40, spacing: 'space-x-4' }
  }

  const currentSize = iconSizes[size]

  // Get theme-specific styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'monochrome':
        return {
          iconBg: 'bg-gray-200',
          iconText: 'text-gray-900',
          textColor: 'text-gray-900',
        }
      default:
        return {
          iconBg: 'bg-blue-600',
          iconText: 'text-white',
          textColor: 'text-white',
        }
    }
  }

  const themeStyles = getThemeStyles()

  // Simple SVG Icon Component
  const CollabIcon = ({ className: iconClassName }: { className?: string }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn('text-current', iconClassName)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Code brackets */}
      <path
        d="M8 6L2 12L8 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 6L22 12L16 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Collaboration dots */}
      <circle 
        cx="9" 
        cy="9" 
        r="1" 
        fill="currentColor" 
      />
      <circle 
        cx="15" 
        cy="12" 
        r="1" 
        fill="currentColor" 
      />
      <circle 
        cx="9" 
        cy="15" 
        r="1" 
        fill="currentColor" 
      />
    </svg>
  )

  // Minimal variant (smallest possible)
  if (variant === 'minimal') {
    return (
      <div className={cn(
        'inline-flex items-center justify-center rounded-lg transition-colors',
        themeStyles.iconBg,
        interactive && 'hover:opacity-80 cursor-pointer',
        className
      )} style={{ width: currentSize.width, height: currentSize.height }}>
        <CollabIcon className={cn('w-3/5 h-3/5', themeStyles.iconText)} />
      </div>
    )
  }

  // Icon-only variant
  if (variant === 'icon') {
    return (
      <div className={cn(
        'inline-flex items-center justify-center rounded-lg shadow-sm transition-colors',
        themeStyles.iconBg,
        interactive && 'hover:opacity-80 cursor-pointer',
        className
      )} style={{ width: currentSize.width, height: currentSize.height }}>
        <CollabIcon className={cn('w-3/5 h-3/5', themeStyles.iconText)} />
      </div>
    )
  }

  // Text-only variant
  if (variant === 'text') {
    return (
      <div className={cn(
        'inline-flex items-center',
        interactive && 'transition-colors hover:opacity-80 cursor-pointer',
        className
      )}>
        <span 
          className={cn(
            'font-bold tracking-tight',
            themeStyles.textColor,
          )}
          style={{ fontSize: currentSize.fontSize }}
        >
          CollabIDE
        </span>
      </div>
    )
  }

  // Full logo (icon + text)
  return (
    <div className={cn(
      'inline-flex items-center',
      currentSize.spacing,
      interactive && 'transition-colors hover:opacity-80 cursor-pointer',
      className
    )}>
      {/* Icon */}
      <div 
        className={cn(
          'inline-flex items-center justify-center rounded-lg shadow-sm transition-colors',
          themeStyles.iconBg,
        )}
        style={{ width: currentSize.width, height: currentSize.height }}
      >
        <CollabIcon className={cn('w-3/5 h-3/5', themeStyles.iconText)} />
      </div>

      {/* Text */}
      <span 
        className={cn(
          'font-bold tracking-tight',
          themeStyles.textColor,
        )}
        style={{ fontSize: currentSize.fontSize }}
      >
        CollabIDE
      </span>
    </div>
  )
}

export default Logo
