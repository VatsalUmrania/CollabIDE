'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Loader2, AlertCircle, Shield, Lock, Code } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

// Extended User interface to include role property
interface User {
  id: string
  email: string
  displayName: string
  role?: 'admin' | 'moderator' | 'user'
}

// Extended AuthContextType to include error property
interface AuthContextType {
  user: User | null
  loading: boolean
  error?: Error | null
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  register: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => void
  verify?: (email: string, code: string) => Promise<void>
}

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requiredRole?: 'admin' | 'moderator' | 'user'
  fallbackUrl?: string
  showError?: boolean
  customLoadingComponent?: React.ReactNode
  customErrorComponent?: React.ReactNode
  onUnauthorized?: () => void
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true,
  requiredRole,
  fallbackUrl,
  showError = true,
  customLoadingComponent,
  customErrorComponent,
  onUnauthorized
}: ProtectedRouteProps) {
  const { user, loading, error } = useAuth() as AuthContextType
  const router = useRouter()
  const pathname = usePathname()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  // Check user permissions with proper typing
  const hasRequiredRole = (userRole: string, required: string): boolean => {
    const roleHierarchy: Record<string, number> = { 
      user: 1, 
      moderator: 2, 
      admin: 3 
    }
    return (roleHierarchy[userRole] || 0) >= (roleHierarchy[required] || 0)
  }

  const isAuthorized = user && (!requiredRole || hasRequiredRole(user.role || 'user', requiredRole))

  useEffect(() => {
    if (loading) return

    setAuthChecked(true)

    if (requireAuth && !user) {
      setIsRedirecting(true)
      onUnauthorized?.()
      
      // Store the intended destination
      const redirectUrl = fallbackUrl || '/auth/login'
      const returnUrl = encodeURIComponent(pathname)
      
      setTimeout(() => {
        router.push(`${redirectUrl}?returnUrl=${returnUrl}`)
      }, 100)
    } else if (requireAuth && user && requiredRole && !hasRequiredRole(user.role || 'user', requiredRole)) {
      setIsRedirecting(true)
      onUnauthorized?.()
      
      setTimeout(() => {
        router.push('/unauthorized')
      }, 100)
    }
  }, [user, loading, requireAuth, requiredRole, router, pathname, fallbackUrl, onUnauthorized])

  // Loading state with improved shadcn/ui design
  if (loading || !authChecked) {
    if (customLoadingComponent) {
      return <>{customLoadingComponent}</>
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-primary/10 animate-pulse" />
        
        <Card className="w-full max-w-md shadow-2xl border-0 bg-card/80 backdrop-blur relative z-10">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                Verifying Access
              </CardTitle>
              <CardDescription>
                Checking your authentication status...
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="text-center">
            <Badge variant="outline" className="inline-flex items-center gap-2">
              <Code className="w-4 h-4" />
              CollabIDE Security
            </Badge>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Authentication error with improved design
  if (error && showError) {
    if (customErrorComponent) {
      return <>{customErrorComponent}</>
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-transparent to-destructive/5" />
        
        <Card className="max-w-md w-full shadow-2xl border-0 bg-card/80 backdrop-blur relative z-10">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-destructive">
                Authentication Error
              </CardTitle>
              <CardDescription>
                There was a problem verifying your identity
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error.message || 'An authentication error occurred'}
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Try Again
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/auth/login')}
                className="w-full"
              >
                Sign In Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Redirecting state with improved design
  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-500/5" />
        
        <Card className="w-full max-w-md shadow-2xl border-0 bg-card/80 backdrop-blur relative z-10">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto">
              <Lock className="h-8 w-8 text-orange-500" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                Redirecting...
              </CardTitle>
              <CardDescription>
                {!user ? 'You need to sign in to access this page' : 'Insufficient permissions'}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Unauthorized access (role-based) with improved design
  if (requireAuth && user && requiredRole && !isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-transparent to-destructive/5" />
        
        <Card className="max-w-md w-full shadow-2xl border-0 bg-card/80 backdrop-blur relative z-10">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto">
              <Lock className="h-8 w-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-destructive">
                Access Denied
              </CardTitle>
              <CardDescription>
                You don&apos;t have permission to access this page
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This page requires {requiredRole} privileges. 
                Your current role: {user.role || 'user'}
              </AlertDescription>
            </Alert>
            
            <Card className="bg-muted/50 border-dashed">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Need access?</h4>
                <p className="text-sm text-muted-foreground">
                  Contact your administrator to request the required permissions.
                </p>
              </CardContent>
            </Card>
            
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={() => router.back()}
                className="w-full"
              >
                Go Back
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Not authenticated
  if (requireAuth && !user) {
    return null // Will redirect via useEffect
  }

  // All checks passed, render children
  return <>{children}</>
}

// Additional specialized components
export function AdminRoute({ children, ...props }: Omit<ProtectedRouteProps, 'requiredRole'>) {
  return (
    <ProtectedRoute {...props} requiredRole="admin">
      {children}
    </ProtectedRoute>
  )
}

export function ModeratorRoute({ children, ...props }: Omit<ProtectedRouteProps, 'requiredRole'>) {
  return (
    <ProtectedRoute {...props} requiredRole="moderator">
      {children}
    </ProtectedRoute>
  )
}

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth() as AuthContextType
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (user) {
    return null // Will redirect via useEffect
  }

  return <>{children}</>
}
