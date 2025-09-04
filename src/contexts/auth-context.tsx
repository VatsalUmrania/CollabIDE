// 'use client'

// import { createContext, useContext, useEffect, useState, useCallback } from 'react'
// import { useRouter } from 'next/navigation'

// interface User {
//   id: string
//   email: string
//   displayName: string
//   isVerified: boolean
//   image?: string | null
// }

// interface AuthContextType {
//   user: User | null
//   login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
//   register: (email: string, password: string, displayName: string) => Promise<string>
//   verify: (email: string, otp: string) => Promise<void>
//   logout: () => void
//   loading: boolean
//   isAuthenticated: boolean
//   refreshToken: () => Promise<boolean>
//   // Optional OAuth properties
//   isOAuthUser?: boolean
//   oauthSession?: any
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// // Safe NextAuth hook that won't break if SessionProvider isn't available
// function useSafeNextAuth() {
//   const [session, setSession] = useState<any>(null)
//   const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading')

//   useEffect(() => {
//     let mounted = true

//     const checkSession = async () => {
//       try {
//         // Dynamically import and check if NextAuth is available
//         const { getSession } = await import('next-auth/react')
//         const sessionData = await getSession()
        
//         if (mounted) {
//           setSession(sessionData)
//           setStatus(sessionData ? 'authenticated' : 'unauthenticated')
//         }
//       } catch (error) {
//         console.log('NextAuth not available, using custom auth only')
//         if (mounted) {
//           setSession(null)
//           setStatus('unauthenticated')
//         }
//       }
//     }

//     checkSession()

//     return () => {
//       mounted = false
//     }
//   }, [])

//   return { data: session, status }
// }

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)
//   const router = useRouter()

//   // Optional NextAuth integration
//   const { data: oauthSession, status: oauthStatus } = useSafeNextAuth()
//   const isOAuthUser = !!oauthSession?.user

//   const isAuthenticated = !!user

//   // Token refresh function with better error handling
//   const refreshToken = useCallback(async (): Promise<boolean> => {
//     const refreshToken = localStorage.getItem('refreshToken')
    
//     if (!refreshToken) {
//       console.log('❌ No refresh token available')
//       return false
//     }

//     try {
//       console.log('🔄 Attempting to refresh access token')
//       const response = await fetch('/api/auth/refresh', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ refreshToken }),
//       })

//       if (response.ok) {
//         const data = await response.json()
//         localStorage.setItem('accessToken', data.accessToken)
//         localStorage.setItem('refreshToken', data.refreshToken)
//         console.log('✅ Token refreshed successfully')
//         return true
//       } else {
//         const errorData = await response.json()
//         console.log('❌ Token refresh failed:', errorData.error || response.status)
        
//         // Clear invalid tokens
//         localStorage.removeItem('accessToken')
//         localStorage.removeItem('refreshToken')
//         setUser(null)
//         return false
//       }
//     } catch (error) {
//       console.error('❌ Token refresh error:', error)
//       localStorage.removeItem('accessToken')
//       localStorage.removeItem('refreshToken')
//       setUser(null)
//       return false
//     }
//   }, [])

//   // Get current user with automatic token refresh
//   const getCurrentUser = useCallback(async (retryCount = 0): Promise<boolean> => {
//     let token = localStorage.getItem('accessToken')
    
//     if (!token) {
//       console.log('❌ No access token found')
//       return false
//     }

//     try {
//       console.log('👤 Fetching current user')
//       let response = await fetch('/api/auth/me', {
//         headers: { Authorization: `Bearer ${token}` }
//       })
      
//       // If token is expired and we haven't retried yet, try to refresh
//       if (response.status === 401 && retryCount === 0) {
//         console.log('🔄 Access token expired, attempting refresh')
//         const refreshed = await refreshToken()
        
//         if (refreshed) {
//           // Retry with new token
//           return await getCurrentUser(1)
//         } else {
//           console.log('❌ Token refresh failed, user needs to re-login')
//           return false
//         }
//       }
      
//       if (response.ok) {
//         const data = await response.json()
//         setUser(data.user)
//         console.log('✅ User loaded:', data.user.displayName)
//         return true
//       } else {
//         const errorData = await response.json()
//         console.log('❌ Failed to get user:', errorData.error || response.status)
        
//         // Clear tokens on persistent failure
//         localStorage.removeItem('accessToken')
//         localStorage.removeItem('refreshToken')
//         setUser(null)
//         return false
//       }
//     } catch (error) {
//       console.error('❌ Get user error:', error)
      
//       // Only clear tokens if this is a final retry or network error
//       if (retryCount > 0) {
//         localStorage.removeItem('accessToken')
//         localStorage.removeItem('refreshToken')
//         setUser(null)
//       }
//       return false
//     }
//   }, [refreshToken])

//   // Handle OAuth session (if available)
//   useEffect(() => {
//     if (oauthStatus === 'loading') return

//     if (oauthSession?.user && !user) {
//       // OAuth user detected - convert to our user format
//       setUser({
//         id: oauthSession.user.id || oauthSession.user.email || '',
//         email: oauthSession.user.email || '',
//         displayName: oauthSession.user.name || oauthSession.user.email || '',
//         isVerified: true, // OAuth users are considered verified
//         image: oauthSession.user.image
//       })
//       setLoading(false)
//       console.log('✅ OAuth user loaded:', oauthSession.user.name)
//       return
//     }

//     // If no OAuth session and no current user, check custom auth
//     if (!oauthSession?.user && !user) {
//       const initializeAuth = async () => {
//         setLoading(true)
        
//         // Check URL parameters for login errors
//         const urlParams = new URLSearchParams(window.location.search)
//         const error = urlParams.get('error')
        
//         if (error === 'session_expired') {
//           console.log('🔒 Session expired, clearing tokens')
//           localStorage.removeItem('accessToken')
//           localStorage.removeItem('refreshToken')
//           setUser(null)
//           setLoading(false)
//           return
//         }
        
//         const success = await getCurrentUser()
//         if (!success) {
//           setUser(null)
//         }
//         setLoading(false)
//       }

//       initializeAuth()
//     }
//   }, [oauthSession, oauthStatus, user, getCurrentUser])

//   // Auto-refresh token periodically (only for custom auth users)
//   useEffect(() => {
//     let interval: NodeJS.Timeout

//     if (user && !isOAuthUser && localStorage.getItem('accessToken')) {
//       interval = setInterval(async () => {
//         console.log('🕒 Auto-refreshing token')
//         await refreshToken()
//       }, 10 * 60 * 1000) // Refresh every 10 minutes
//     }

//     return () => {
//       if (interval) clearInterval(interval)
//     }
//   }, [user, isOAuthUser, refreshToken])

//   const login = async (email: string, password: string, rememberMe = false) => {
//     try {
//       console.log('🔐 Attempting login for:', email)
//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password, rememberMe }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || 'Login failed')
//       }

//       // Store tokens
//       localStorage.setItem('accessToken', data.accessToken)
//       localStorage.setItem('refreshToken', data.refreshToken)
      
//       setUser(data.user)
//       console.log('✅ Login successful for:', data.user.displayName)
      
//       // Small delay to ensure state is updated
//       setTimeout(() => {
//         const searchParams = new URLSearchParams(window.location.search)
//         const redirect = searchParams.get('redirect') || '/dashboard'
//         console.log('🔄 Redirecting to:', redirect)
//         router.push(redirect)
//       }, 100)

//     } catch (error) {
//       console.error('❌ Login error:', error)
//       throw error
//     }
//   }

//   const register = async (email: string, password: string, displayName: string) => {
//     try {
//       console.log('📝 Attempting registration for:', email)
//       const response = await fetch('/api/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password, displayName }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || 'Registration failed')
//       }

//       console.log('✅ Registration successful')
//       return data.userId
//     } catch (error) {
//       console.error('❌ Registration error:', error)
//       throw error
//     }
//   }

//   const verify = async (email: string, otp: string) => {
//     try {
//       console.log('✉️ Attempting verification for:', email)
//       const response = await fetch('/api/auth/verify', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, otp }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || 'Verification failed')
//       }

//       localStorage.setItem('accessToken', data.accessToken)
//       localStorage.setItem('refreshToken', data.refreshToken)
//       setUser(data.user)
//       console.log('✅ Verification successful')
//       router.push('/dashboard')
//     } catch (error) {
//       console.error('❌ Verification error:', error)
//       throw error
//     }
//   }

//   const logout = useCallback(async () => {
//     console.log('👋 Logging out')
    
//     if (isOAuthUser) {
//       // Sign out from NextAuth if available
//       try {
//         const { signOut } = await import('next-auth/react')
//         await signOut({ redirect: false })
//       } catch (error) {
//         console.log('NextAuth signOut not available')
//       }
//     }
    
//     // Always clear custom auth tokens
//     localStorage.removeItem('accessToken')
//     localStorage.removeItem('refreshToken')
//     setUser(null)
//     router.push('/auth/login')
//   }, [router, isOAuthUser])

//   return (
//     <AuthContext.Provider value={{
//       user,
//       login,
//       register,
//       verify,
//       logout,
//       loading,
//       isAuthenticated,
//       refreshToken,
//       // Optional OAuth properties
//       isOAuthUser,
//       oauthSession
//     }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }


// src/contexts/auth-context.tsx
'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

interface User {
  id: string
  email: string
  displayName: string
  isVerified: boolean
  image?: string | null
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  register: (email: string, password: string, displayName: string) => Promise<string>
  verify: (email: string, otp: string) => Promise<void>
  logout: () => void
  loading: boolean
  isAuthenticated: boolean
  refreshToken: () => Promise<boolean>
  isOAuthUser?: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { data: oauthSession, status: oauthStatus } = useSession()

  const isOAuthUser = !!oauthSession?.user
  const isAuthenticated = !!user

  const refreshToken = useCallback(async (): Promise<boolean> => {
    const storedRefreshToken = localStorage.getItem('refreshToken')
    
    if (!storedRefreshToken) {
      console.log('❌ No refresh token available')
      return false
    }

    try {
      console.log('🔄 Attempting to refresh access token')
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        console.log('✅ Token refreshed successfully')
        return true
      } else {
        const errorData = await response.json()
        console.log('❌ Token refresh failed:', errorData.error || response.status)
        
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        setUser(null)
        return false
      }
    } catch (error) {
      console.error('❌ Token refresh error:', error)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
      return false
    }
  }, [])

  const getCurrentUser = useCallback(async (retryCount = 0): Promise<boolean> => {
    const token = localStorage.getItem('accessToken')
    
    if (!token) {
      console.log('❌ No access token found')
      return false
    }

    try {
      console.log('👤 Fetching current user')
      let response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.status === 401 && retryCount === 0) {
        console.log('🔄 Access token expired, attempting refresh')
        const refreshed = await refreshToken()
        
        if (refreshed) {
          return await getCurrentUser(1)
        } else {
          console.log('❌ Token refresh failed, user needs to re-login')
          return false
        }
      }
      
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        console.log('✅ Custom auth user loaded:', data.user.displayName)
        return true
      } else {
        const errorData = await response.json()
        console.log('❌ Failed to get user:', errorData.error || response.status)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        setUser(null)
        return false
      }
    } catch (error) {
      console.error('❌ Get user error:', error)
      if (retryCount > 0) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        setUser(null)
      }
      return false
    }
  }, [refreshToken])

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true)

      if (oauthStatus === 'authenticated' && oauthSession?.user) {
        console.log('🔍 OAuth session detected, exchanging for custom token...')
        try {
          const response = await fetch('/api/auth/oauth-token')
          if (response.ok) {
            const data = await response.json()
            localStorage.setItem('accessToken', data.accessToken)
            localStorage.setItem('refreshToken', data.refreshToken)
            setUser(data.user)
            console.log(`✅ OAuth token exchange successful for ${data.user.displayName}`)
          } else {
            // If token exchange fails, logout to clear state
            await signOut({ redirect: false })
            setUser(null)
          }
        } catch (error) {
          console.error('❌ Failed to exchange OAuth token:', error)
          await signOut({ redirect: false })
          setUser(null)
        }
      } else if (oauthStatus === 'unauthenticated') {
        const hasCustomToken = !!localStorage.getItem('accessToken')
        if (hasCustomToken) {
          await getCurrentUser()
        } else {
          setUser(null)
        }
      }

      setLoading(false)
    }

    if (oauthStatus !== 'loading') {
      initializeAuth()
    }
  }, [oauthSession, oauthStatus, getCurrentUser])


  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      
      setUser(data.user)
      console.log('✅ Login successful for:', data.user.displayName)
      
      router.push('/dashboard')
    } catch (error) {
      console.error('❌ Login error:', error)
      throw error
    }
  }

  const register = async (email: string, password: string, displayName: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }
      return data.userId
    } catch (error) {
      console.error('❌ Registration error:', error)
      throw error
    }
  }

  const verify = async (email: string, otp: string) => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      setUser(data.user)
      router.push('/dashboard')
    } catch (error) {
      console.error('❌ Verification error:', error)
      throw error
    }
  }

  const logout = useCallback(async () => {
    console.log('👋 Logging out')
    
    if (isOAuthUser) {
      await signOut({ redirect: false })
    }
    
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
    router.push('/auth/login')
  }, [router, isOAuthUser])

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      verify,
      logout,
      loading,
      isAuthenticated,
      refreshToken,
      isOAuthUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}