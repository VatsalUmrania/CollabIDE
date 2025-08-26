'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Loader2, 
  ArrowLeft, 
  CheckCircle, 
  Mail, 
  Shield,
  Code,
  AlertCircle,
  Zap,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Enhanced email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset instructions')
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset instructions')
    } finally {
      setLoading(false)
    }
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-green-500/10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl bg-primary/10 animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="w-full max-w-md relative z-10">
          <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur">
            <CardHeader className="text-center space-y-4 pb-6">
              {/* Logo */}
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <Code className="w-6 h-6 text-primary-foreground" />
              </div>
              
              {/* Success Icon */}
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold">
                  Check Your Email
                </CardTitle>
                <CardDescription className="space-y-2">
                  <span>We've sent reset instructions to</span>
                  <div className="inline-block bg-muted px-3 py-1 rounded-md text-sm font-mono mt-1 break-all">
                    {email}
                  </div>
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Instructions */}
              <Card className="bg-muted/30 border-dashed">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">
                        What's next?
                      </h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Check your inbox for the reset email</li>
                        <li>• Click the secure link in the email</li>
                        <li>• Create your new password</li>
                        <li>• Link expires in 15 minutes</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/auth/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Sign In
                  </Link>
                </Button>
                
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setSuccess(false)
                    setEmail('')
                    setError('')
                  }}
                  size="lg"
                  className="w-full"
                >
                  Try Different Email
                </Button>
              </div>

              {/* Help Section */}
              <div className="text-center pt-6 border-t">
                <p className="text-xs text-muted-foreground mb-2">
                  Still having trouble?
                </p>
                <Link 
                  href="/support" 
                  className="text-xs text-primary hover:text-primary/80 underline font-medium"
                >
                  Contact Support
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-primary/10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl bg-accent/10 animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="w-full max-w-md relative z-10">
        {/* Back button */}
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link href="/auth/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign In
          </Link>
        </Button>

        <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur">
          <CardHeader className="text-center space-y-4 pb-6">
            {/* Logo */}
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto shadow-lg">
              <Code className="w-6 h-6 text-primary-foreground" />
            </div>
            
            {/* Badge */}
            <Badge variant="outline" className="inline-flex items-center gap-2 px-4 py-2 mx-auto">
              <Shield className="w-4 h-4" />
              Secure password reset
            </Badge>

            {/* Title */}
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold">
                Reset Your Password
              </CardTitle>
              <CardDescription>
                Enter your email address and we'll send you reset instructions
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Display */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reset-email"
                    type="email"
                    className="pl-10"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full font-semibold"
                size="lg"
                disabled={loading || !email}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Instructions...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Send Reset Instructions
                  </>
                )}
              </Button>
            </form>

            {/* Security Notice */}
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">
                      Security Notice
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Reset links expire after 15 minutes for your security. You can only have one active reset request at a time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer Links */}
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                Remember your password?{' '}
                <Link href="/auth/login" className="text-primary hover:text-primary/80 underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Help Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Need help?{' '}
            <Link 
              href="/support" 
              className="text-primary hover:text-primary/80 underline font-medium"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
