'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

interface SessionProviderWrapperProps {
  children: ReactNode
  session?: any
}

export default function SessionProviderWrapper({ 
  children, 
  session 
}: SessionProviderWrapperProps) {
  return (
    <SessionProvider 
      session={session}
      refetchInterval={5 * 60} // Refetch every 5 minutes instead of default
      refetchOnWindowFocus={false} // Disable refetch on window focus
      refetchWhenOffline={false} // Disable refetch when coming back online
    >
      {children}
    </SessionProvider>
  )
}
