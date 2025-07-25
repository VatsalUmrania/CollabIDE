import React from 'react'
import { cn } from '@/lib/utils'

interface HeroLogoProps {
  className?: string
}

const HeroLogo: React.FC<HeroLogoProps> = ({ className }) => {
  return (
    <div className={cn(
      'inline-flex flex-col items-center justify-center space-y-4 p-8',
      className
    )}>
      {/* Large animated icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl scale-110 animate-pulse"></div>
        <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 shadow-2xl">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-12 h-12 text-white"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Animated code brackets */}
            <path
              d="M8 6L2 12L8 18"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-pulse"
              style={{ animationDelay: '0s' }}
            />
            <path
              d="M16 6L22 12L16 18"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-pulse"
              style={{ animationDelay: '0.5s' }}
            />
            {/* Collaboration dots with staggered animation */}
            <circle 
              cx="12" 
              cy="9" 
              r="1.5" 
              fill="currentColor" 
              className="animate-bounce"
              style={{ animationDelay: '0.2s' }}
            />
            <circle 
              cx="12" 
              cy="12" 
              r="1.5" 
              fill="currentColor" 
              opacity="0.8" 
              className="animate-bounce"
              style={{ animationDelay: '0.4s' }}
            />
            <circle 
              cx="12" 
              cy="15" 
              r="1.5" 
              fill="currentColor" 
              opacity="0.6" 
              className="animate-bounce"
              style={{ animationDelay: '0.6s' }}
            />
          </svg>
        </div>
      </div>

      {/* Large text with gradient animation */}
      <div className="text-center">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent animate-gradient tracking-tight">
          CollabIDE
        </h1>
        <p className="text-xl text-muted-foreground mt-2 font-medium">
          Real-time Collaborative Code Editor
        </p>
      </div>
    </div>
  )
}

export default HeroLogo
