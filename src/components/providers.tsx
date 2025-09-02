// 'use client'

// import * as React from 'react'
// import { ThemeProvider as NextThemesProvider } from 'next-themes'
// import { type ThemeProviderProps } from 'next-themes/dist/types'
// import { AuthProvider } from '@/contexts/auth-context'
// import { Toaster } from 'sonner'

// function ThemeProvider({ children, ...props }: ThemeProviderProps) {
//   return <NextThemesProvider {...props}>{children}</NextThemesProvider>
// }

// export function Providers({ children }: { children: React.ReactNode }) {
//   return (
//     <ThemeProvider
//       attribute="class"
//       defaultTheme="system"
//       enableSystem
//       disableTransitionOnChange
//     >
//       <AuthProvider>
//         {children}
//         <Toaster 
//           position="top-right" 
//           richColors 
//           closeButton 
//           expand={false}
//           visibleToasts={4}
//         />
//       </AuthProvider>
//     </ThemeProvider>
//   )
// }

'use client'

import { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { AuthProvider } from '@/contexts/auth-context'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'

interface ProvidersProps {
  children: ReactNode
  session?: any
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider 
      session={session}
      refetchInterval={5 * 60} // Refetch every 5 minutes instead of constantly
      refetchOnWindowFocus={false} // Don't refetch when window gains focus
      refetchWhenOffline={false} // Don't refetch when coming back online
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
