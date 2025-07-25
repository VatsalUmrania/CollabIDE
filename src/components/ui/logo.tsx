import React from 'react'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'full' | 'icon' | 'text'
  animated?: boolean
}

const Logo: React.FC<LogoProps> = ({ 
  className, 
  size = 'md', 
  variant = 'full', 
  animated = false 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-auto',
    md: 'h-8 w-auto',
    lg: 'h-12 w-auto',
    xl: 'h-16 w-auto'
  }

  const iconSizes = {
    sm: { width: 24, height: 24, fontSize: 14 },
    md: { width: 32, height: 32, fontSize: 18 },
    lg: { width: 48, height: 48, fontSize: 24 },
    xl: { width: 64, height: 64, fontSize: 32 }
  }

  const currentSize = iconSizes[size]

  // Icon-only variant
  if (variant === 'icon') {
    return (
      <div className={cn(
        'inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 shadow-lg',
        animated && 'transition-all duration-300 hover:scale-105 hover:shadow-xl',
        className
      )} style={{ width: currentSize.width, height: currentSize.height }}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-3/5 h-3/5 text-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Code brackets */}
          <path
            d="M8 6L2 12L8 18M16 6L22 12L16 18"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={animated ? 'animate-pulse' : ''}
          />
          {/* Center collaboration dots */}
          <circle cx="12" cy="9" r="1.5" fill="currentColor" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" opacity="0.8" />
          <circle cx="12" cy="15" r="1.5" fill="currentColor" opacity="0.6" />
        </svg>
      </div>
    )
  }

  // Text-only variant
  if (variant === 'text') {
    return (
      <div className={cn('inline-flex items-center', className)}>
        <span 
          className={cn(
            'font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent',
            animated && 'transition-all duration-300 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-500'
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
      'inline-flex items-center space-x-2',
      animated && 'transition-all duration-300 hover:scale-105',
      className
    )}>
      {/* Icon */}
      <div 
        className={cn(
          'inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 shadow-lg',
          animated && 'transition-all duration-300 hover:shadow-xl'
        )}
        style={{ width: currentSize.width, height: currentSize.height }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-3/5 h-3/5 text-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 6L2 12L8 18M16 6L22 12L16 18"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="9" r="1.5" fill="currentColor" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" opacity="0.8" />
          <circle cx="12" cy="15" r="1.5" fill="currentColor" opacity="0.6" />
        </svg>
      </div>

      {/* Text */}
      <span 
        className={cn(
          'font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent',
          'tracking-tight'
        )}
        style={{ fontSize: currentSize.fontSize }}
      >
        CollabIDE
      </span>
    </div>
  )
}

export default Logo
