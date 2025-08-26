'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  displayName: string
  isVerified: boolean
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!user

  // Token refresh function with better error handling
  const refreshToken = useCallback(async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem('refreshToken')
    
    if (!refreshToken) {
      console.log('❌ No refresh token available')
      return false
    }

    try {
      console.log('🔄 Attempting to refresh access token')
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
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
        
        // Clear invalid tokens
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

  // Get current user with automatic token refresh
  const getCurrentUser = useCallback(async (retryCount = 0): Promise<boolean> => {
    let token = localStorage.getItem('accessToken')
    
    if (!token) {
      console.log('❌ No access token found')
      return false
    }

    try {
      console.log('👤 Fetching current user')
      let response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // If token is expired and we haven't retried yet, try to refresh
      if (response.status === 401 && retryCount === 0) {
        console.log('🔄 Access token expired, attempting refresh')
        const refreshed = await refreshToken()
        
        if (refreshed) {
          // Retry with new token
          return await getCurrentUser(1)
        } else {
          console.log('❌ Token refresh failed, user needs to re-login')
          return false
        }
      }
      
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        console.log('✅ User loaded:', data.user.displayName)
        return true
      } else {
        const errorData = await response.json()
        console.log('❌ Failed to get user:', errorData.error || response.status)
        
        // Clear tokens on persistent failure
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        setUser(null)
        return false
      }
    } catch (error) {
      console.error('❌ Get user error:', error)
      
      // Only clear tokens if this is a final retry or network error
      if (retryCount > 0) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        setUser(null)
      }
      return false
    }
  }, [refreshToken])

  // Auto-refresh token periodically (only when user is active)
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (user && localStorage.getItem('accessToken')) {
      interval = setInterval(async () => {
        console.log('🕒 Auto-refreshing token')
        await refreshToken()
      }, 10 * 60 * 1000) // Refresh every 10 minutes
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [user, refreshToken])

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true)
      
      // Check URL parameters for login errors
      const urlParams = new URLSearchParams(window.location.search)
      const error = urlParams.get('error')
      
      if (error === 'session_expired') {
        console.log('🔒 Session expired, clearing tokens')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        setUser(null)
        setLoading(false)
        return
      }
      
      const success = await getCurrentUser()
      if (!success) {
        setUser(null)
      }
      setLoading(false)
    }

    initializeAuth()
  }, [getCurrentUser])

  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      console.log('🔐 Attempting login for:', email)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Store tokens
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      
      setUser(data.user)
      console.log('✅ Login successful for:', data.user.displayName)
      
      // Small delay to ensure state is updated
      setTimeout(() => {
        const searchParams = new URLSearchParams(window.location.search)
        const redirect = searchParams.get('redirect') || '/dashboard'
        console.log('🔄 Redirecting to:', redirect)
        router.push(redirect)
      }, 100)

    } catch (error) {
      console.error('❌ Login error:', error)
      throw error
    }
  }

  const register = async (email: string, password: string, displayName: string) => {
    try {
      console.log('📝 Attempting registration for:', email)
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      console.log('✅ Registration successful')
      return data.userId
    } catch (error) {
      console.error('❌ Registration error:', error)
      throw error
    }
  }

  const verify = async (email: string, otp: string) => {
    try {
      console.log('✉️ Attempting verification for:', email)
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
      console.log('✅ Verification successful')
      router.push('/dashboard')
    } catch (error) {
      console.error('❌ Verification error:', error)
      throw error
    }
  }

  const logout = useCallback(() => {
    console.log('👋 Logging out')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
    router.push('/auth/login')
  }, [router])

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      verify,
      logout,
      loading,
      isAuthenticated,
      refreshToken
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
