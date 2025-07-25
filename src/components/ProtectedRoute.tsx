'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Loader2, AlertCircle, Shield, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

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
  const { user, loading, error: authError } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  // Check user permissions
  const hasRequiredRole = (userRole: string, required: string) => {
    const roleHierarchy = { admin: 3, moderator: 2, user: 1 }
    return roleHierarchy[userRole as keyof typeof roleHierarchy] >= 
           roleHierarchy[required as keyof typeof roleHierarchy]
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

  // Loading state
  if (loading || !authChecked) {
    if (customLoadingComponent) {
      return <>{customLoadingComponent}</>
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl mb-6">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Verifying Access</h2>
          </div>
          <p className="text-gray-600">Checking your authentication status...</p>
          
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">CollabIDE Security</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Authentication error
  if (authError && showError) {
    if (customErrorComponent) {
      return <>{customErrorComponent}</>
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4 mx-auto">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-xl text-red-900">Authentication Error</CardTitle>
            <CardDescription>
              There was a problem verifying your identity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {authError.message || 'An authentication error occurred'}
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

  // Redirecting state
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl mb-6">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
            <h2 className="text-xl font-semibold text-gray-900">Redirecting...</h2>
          </div>
          <p className="text-gray-600">
            {!user ? 'You need to sign in to access this page' : 'Insufficient permissions'}
          </p>
        </div>
      </div>
    )
  }

  // Unauthorized access (role-based)
  if (requireAuth && user && requiredRole && !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4 mx-auto">
              <Lock className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-xl text-red-900">Access Denied</CardTitle>
            <CardDescription>
              You don&apos;t have permission to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This page requires {requiredRole} privileges. 
                Your current role: {user?.role || 'user'}
              </AlertDescription>
            </Alert>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Need access?</h4>
              <p className="text-sm text-gray-600">
                Contact your administrator to request the required permissions.
              </p>
            </div>
            
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
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (user) {
    return null // Will redirect via useEffect
  }

  return <>{children}</>
}
