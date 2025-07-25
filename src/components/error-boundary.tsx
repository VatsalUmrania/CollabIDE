'use client'

import React from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({ errorInfo })
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo)
    
    // Log to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error, errorInfo)
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />
      }

      return <DefaultErrorFallback error={this.state.error!} resetError={this.resetError} />
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error: Error
  resetError: () => void
}

function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development'

  const handleReload = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  const handleReportBug = () => {
    // Open bug report form or external service
    window.open('https://github.com/your-repo/issues', '_blank')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4 mx-auto">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-900">Something went wrong</CardTitle>
          <CardDescription>
            An unexpected error occurred in the application
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Error:</strong> {error.message}
            </AlertDescription>
          </Alert>

          {isDevelopment && (
            <Alert>
              <Bug className="h-4 w-4" />
              <AlertDescription>
                <details className="mt-2">
                  <summary className="cursor-pointer font-medium">
                    Technical Details (Development)
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                    {error.stack}
                  </pre>
                </details>
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">What can you do?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Try refreshing the page</li>
              <li>• Check your internet connection</li>
              <li>• Clear your browser cache</li>
              {!isDevelopment && <li>• Report this issue if it persists</li>}
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <div className="flex space-x-2 w-full">
            <Button onClick={resetError} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={handleReload} className="flex-1">
              Reload Page
            </Button>
          </div>
          
          <div className="flex space-x-2 w-full">
            <Button variant="ghost" onClick={handleGoHome} className="flex-1">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
            {!isDevelopment && (
              <Button variant="ghost" onClick={handleReportBug} className="flex-1">
                <Bug className="h-4 w-4 mr-2" />
                Report Bug
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

// Hook for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo)
    
    // You can trigger the error boundary by throwing
    throw error
  }
}
