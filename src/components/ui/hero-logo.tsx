// import React from 'react'
// import { cn } from '@/lib/utils'

// interface HeroLogoProps {
//   className?: string
// }

// const HeroLogo: React.FC<HeroLogoProps> = ({ className }) => {
//   return (
//     <div className={cn(
//       'inline-flex flex-col items-center justify-center space-y-4 p-8',
//       className
//     )}>
//       {/* Large animated icon */}
//       <div className="relative">
//         <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl scale-110 animate-pulse"></div>
//         <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 shadow-2xl">
//           <svg
//             viewBox="0 0 24 24"
//             fill="none"
//             className="w-12 h-12 text-white"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             {/* Animated code brackets */}
//             <path
//               d="M8 6L2 12L8 18"
//               stroke="currentColor"
//               strokeWidth="2.5"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className="animate-pulse"
//               style={{ animationDelay: '0s' }}
//             />
//             <path
//               d="M16 6L22 12L16 18"
//               stroke="currentColor"
//               strokeWidth="2.5"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className="animate-pulse"
//               style={{ animationDelay: '0.5s' }}
//             />
//             {/* Collaboration dots with staggered animation */}
//             <circle 
//               cx="12" 
//               cy="9" 
//               r="1.5" 
//               fill="currentColor" 
//               className="animate-bounce"
//               style={{ animationDelay: '0.2s' }}
//             />
//             <circle 
//               cx="12" 
//               cy="12" 
//               r="1.5" 
//               fill="currentColor" 
//               opacity="0.8" 
//               className="animate-bounce"
//               style={{ animationDelay: '0.4s' }}
//             />
//             <circle 
//               cx="12" 
//               cy="15" 
//               r="1.5" 
//               fill="currentColor" 
//               opacity="0.6" 
//               className="animate-bounce"
//               style={{ animationDelay: '0.6s' }}
//             />
//           </svg>
//         </div>
//       </div>

//       {/* Large text with gradient animation */}
//       <div className="text-center">
//         <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent animate-gradient tracking-tight">
//           CollabIDE
//         </h1>
//         <p className="text-xl text-muted-foreground mt-2 font-medium">
//           Real-time Collaborative Code Editor
//         </p>
//       </div>
//     </div>
//   )
// }

// export default HeroLogo



import React from 'react'
import { cn } from '@/lib/utils'
import { Code2, Users, Sparkles, Shield, Rocket, Terminal } from 'lucide-react'

interface HeroLogoProps {
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  variant?: 'full' | 'icon' | 'text' | 'minimal' | 'compact'
  theme?: 'default' | 'monochrome' | 'brand'
  animated?: boolean
  interactive?: boolean
  glow?: boolean
  showDescription?: boolean
}

const HeroLogo: React.FC<HeroLogoProps> = ({ 
  className,
  size = 'md', 
  variant = 'full',
  theme = 'default',
  animated = false,
  interactive = false,
  glow = false,
  showDescription = true
}) => {
  const sizeConfig = {
    xs: {
      container: 'w-12 h-12',
      icon: 'h-6 w-6',
      text: 'text-lg',
      spacing: 'space-y-1',
      description: 'text-xs'
    },
    sm: {
      container: 'w-16 h-16',
      icon: 'h-8 w-8',
      text: 'text-xl',
      spacing: 'space-y-1',
      description: 'text-sm'
    },
    md: {
      container: 'w-20 h-20',
      icon: 'h-10 w-10',
      text: 'text-2xl',
      spacing: 'space-y-2',
      description: 'text-sm'
    },
    lg: {
      container: 'w-24 h-24',
      icon: 'h-12 w-12',
      text: 'text-3xl',
      spacing: 'space-y-2',
      description: 'text-base'
    },
    xl: {
      container: 'w-32 h-32',
      icon: 'h-16 w-16',
      text: 'text-4xl',
      spacing: 'space-y-3',
      description: 'text-lg'
    },
    '2xl': {
      container: 'w-40 h-40',
      icon: 'h-20 w-20',
      text: 'text-5xl',
      spacing: 'space-y-4',
      description: 'text-xl'
    }
  }

  const currentSize = sizeConfig[size]

  // Get theme-specific styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'monochrome':
        return {
          iconBg: 'bg-foreground',
          iconText: 'text-background',
          textGradient: 'text-foreground',
          shadow: 'shadow-lg'
        }
      case 'brand':
        return {
          iconBg: 'bg-gradient-to-br from-primary via-accent-purple to-accent-blue',
          iconText: 'text-white',
          textGradient: 'gradient-text',
          shadow: 'shadow-xl shadow-primary/20'
        }
      default:
        return {
          iconBg: 'bg-gradient-to-br from-primary via-accent-purple to-accent-blue',
          iconText: 'text-white',
          textGradient: 'gradient-text',
          shadow: 'shadow-lg'
        }
    }
  }

  const themeStyles = getThemeStyles()

  // Enhanced SVG Icon Component
  const CollabIcon = ({ className: iconClassName }: { className?: string }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn('text-current', iconClassName)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Code brackets with enhanced animation */}
      <path
        d="M8 6L2 12L8 18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animated ? 'animate-code-pulse-left' : ''}
      />
      <path
        d="M16 6L22 12L16 18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animated ? 'animate-code-pulse-right' : ''}
      />
      
      {/* Collaboration connection lines */}
      <path
        d="M10 9L14 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
        className={animated ? 'animate-connection-pulse' : ''}
        style={{ animationDelay: '0.3s' }}
      />
      <path
        d="M10 12L14 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
        className={animated ? 'animate-connection-pulse' : ''}
        style={{ animationDelay: '0.6s' }}
      />
      <path
        d="M10 15L14 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
        className={animated ? 'animate-connection-pulse' : ''}
        style={{ animationDelay: '0.9s' }}
      />
      
      {/* Center collaboration dots with staggered animation */}
      <circle 
        cx="9" 
        cy="9" 
        r="1" 
        fill="currentColor" 
        className={animated ? 'animate-collab-bounce' : ''}
        style={{ animationDelay: '0.2s' }}
      />
      <circle 
        cx="15" 
        cy="12" 
        r="1" 
        fill="currentColor" 
        opacity="0.8" 
        className={animated ? 'animate-collab-bounce' : ''}
        style={{ animationDelay: '0.7s' }}
      />
      <circle 
        cx="9" 
        cy="15" 
        r="1" 
        fill="currentColor" 
        opacity="0.6" 
        className={animated ? 'animate-collab-bounce' : ''}
        style={{ animationDelay: '1.2s' }}
      />
    </svg>
  )

  // Minimal variant (just icon)
  if (variant === 'minimal') {
    return (
      <div className={cn(
        'inline-flex items-center justify-center rounded-lg transition-all duration-300',
        currentSize.container,
        themeStyles.iconBg,
        themeStyles.shadow,
        interactive && 'hover:scale-110 active:scale-95 cursor-pointer',
        glow && 'animate-glow',
        animated && 'hover:rotate-3',
        className
      )}>
        <CollabIcon className={cn('w-3/5 h-3/5', themeStyles.iconText)} />
      </div>
    )
  }

  // Icon-only variant
  if (variant === 'icon') {
    return (
      <div className="relative group">
        {/* Glow effect background */}
        {glow && (
          <div className={cn(
            'absolute inset-0 rounded-lg blur-md opacity-50 transition-opacity duration-300',
            themeStyles.iconBg,
            'group-hover:opacity-75'
          )} style={{ width: currentSize.container.split(' ')[0], height: currentSize.container.split(' ')[1] }} />
        )}
        
        {/* Main icon */}
        <div className={cn(
          'relative inline-flex items-center justify-center rounded-lg backdrop-blur-sm transition-all duration-300',
          currentSize.container,
          themeStyles.iconBg,
          themeStyles.shadow,
          interactive && 'hover:scale-110 active:scale-95 cursor-pointer hover:rotate-2',
          animated && 'animate-float',
          className
        )}>
          {/* Glass overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-lg" />
          
          <CollabIcon className={cn('w-3/5 h-3/5', themeStyles.iconText)} />
          
          {/* Floating particles for enhanced animation */}
          {animated && (
            <>
              <div className="absolute -top-1 -right-1 w-1 h-1 bg-accent-cyan rounded-full animate-float opacity-70" 
                   style={{ animationDelay: '0s', animationDuration: '3s' }} />
              <div className="absolute -bottom-1 -left-1 w-0.5 h-0.5 bg-accent-pink rounded-full animate-float opacity-60" 
                   style={{ animationDelay: '1s', animationDuration: '4s' }} />
            </>
          )}
        </div>
      </div>
    )
  }

  // Text-only variant
  if (variant === 'text') {
    return (
      <div className={cn(
        'inline-flex items-center',
        interactive && 'transition-all duration-300 hover:scale-105 cursor-pointer',
        className
      )}>
        <span 
          className={cn(
            'font-bold tracking-tight transition-all duration-300',
            currentSize.text,
            themeStyles.textGradient,
            interactive && 'hover:scale-105',
            animated && 'animate-gradient-shift',
            glow && 'animate-glow'
          )}
        >
          CollabIDE
        </span>
      </div>
    )
  }

  // Compact variant (icon + text, no description)
  if (variant === 'compact') {
    return (
      <div className={cn(
        'inline-flex items-center space-x-3',
        interactive && 'transition-all duration-300 hover:scale-105 cursor-pointer group',
        animated && 'animate-fade-in',
        className
      )}>
        {/* Icon */}
        <div className="relative">
          {/* Glow effect background */}
          {glow && (
            <div className={cn(
              'absolute inset-0 rounded-lg blur-md opacity-50 transition-opacity duration-300',
              themeStyles.iconBg,
              interactive && 'group-hover:opacity-75'
            )} style={{ width: currentSize.container.split(' ')[0], height: currentSize.container.split(' ')[1] }} />
          )}
          
          {/* Main icon */}
          <div 
            className={cn(
              'relative inline-flex items-center justify-center rounded-lg backdrop-blur-sm transition-all duration-300',
              currentSize.container,
              themeStyles.iconBg,
              themeStyles.shadow,
              interactive && 'group-hover:rotate-2 group-hover:scale-110',
              animated && 'animate-float'
            )}
          >
            {/* Glass overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-lg" />
            
            <CollabIcon className={cn('w-3/5 h-3/5', themeStyles.iconText)} />
          </div>
        </div>

        {/* Text */}
        <span 
          className={cn(
            'font-bold tracking-tight transition-all duration-300',
            currentSize.text,
            themeStyles.textGradient,
            interactive && 'group-hover:scale-105',
            animated && 'animate-gradient-shift',
            glow && 'text-shadow-glow'
          )}
        >
          CollabIDE
        </span>
      </div>
    )
  }

  // Full logo (icon + text + description)
  return (
    <div className={cn(
      'inline-flex flex-col items-center justify-center text-center',
      currentSize.spacing,
      interactive && 'transition-all duration-300 hover:scale-105 cursor-pointer group',
      animated && 'animate-fade-in',
      className
    )}>
      {/* Icon with enhanced effects */}
      <div className="relative">
        {/* Glow effect background */}
        {glow && (
          <div className={cn(
            'absolute inset-0 rounded-lg blur-md opacity-50 transition-opacity duration-300',
            themeStyles.iconBg,
            interactive && 'group-hover:opacity-75'
          )} style={{ width: currentSize.container.split(' ')[0], height: currentSize.container.split(' ')[1] }} />
        )}
        
        {/* Main icon */}
        <div 
          className={cn(
            'relative inline-flex items-center justify-center rounded-lg backdrop-blur-sm transition-all duration-300',
            currentSize.container,
            themeStyles.iconBg,
            themeStyles.shadow,
            interactive && 'group-hover:rotate-2 group-hover:scale-110',
            animated && 'animate-float'
          )}
        >
          {/* Glass overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-lg" />
          
          <CollabIcon className={cn('w-3/5 h-3/5', themeStyles.iconText)} />
        </div>
      </div>

      {/* Text with enhanced effects */}
      <div className="flex flex-col items-center">
        <span 
          className={cn(
            'font-bold tracking-tight transition-all duration-300',
            currentSize.text,
            themeStyles.textGradient,
            interactive && 'group-hover:scale-105',
            animated && 'animate-gradient-shift',
            glow && 'text-shadow-glow'
          )}
        >
          CollabIDE
        </span>
        
        {/* Description */}
        {showDescription && (
          <p className={cn(
            'text-muted-foreground mt-1 max-w-xs leading-relaxed',
            currentSize.description
          )}>
            Real-time collaborative coding platform
          </p>
        )}
      </div>
    </div>
  )
}

export default HeroLogo
