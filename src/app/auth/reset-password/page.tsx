'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import HeroLogo from '@/components/ui/hero-logo'
import { 
  Loader2, 
  ArrowLeft, 
  CheckCircle, 
  Mail, 
  Shield,
  Key,
  Clock,
  AlertCircle
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

  if (success) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center p-4 auth-bg">
        <div className="w-full max-w-md">
          <Card variant="glass" className="rounded-3xl animate-fade-in-scale shadow-2xl">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-6">
                <HeroLogo 
                  size="lg" 
                  variant="compact" 
                  className="animate-float"
                />
              </div>
              <div className="mx-auto mb-6 p-4 bg-success/10 rounded-full w-fit animate-scale-in">
                <CheckCircle className="h-12 w-12 text-success" />
              </div>
              <h1 className="text-3xl font-bold gradient-text mb-3">
                Check Your Email
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We&apos;ve sent password reset instructions to
              </p>
              <p className="text-foreground font-semibold text-lg mt-1 break-all">
                {email}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Email Instructions Card */}
              <div className="p-4 rounded-xl bg-info/5 border border-info/20 backdrop-blur-sm">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-info mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-info">
                      Check your inbox and spam folder
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      The email contains a secure link that will expire in 15 minutes. 
                      If you don&apos;t see it, check your spam folder.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link href="/auth/login" className="block">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="w-full h-12 rounded-xl group bg-card/50 hover:bg-card border-border/50 hover:border-primary/50 transition-all duration-300"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
                    Back to Sign In
                  </Button>
                </Link>
                
                <Button 
                  variant="ghost" 
                  size="lg"
                  onClick={() => {
                    setSuccess(false)
                    setEmail('')
                    setError('')
                  }}
                  className="w-full h-12 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-all duration-300"
                >
                  Try Different Email
                </Button>
              </div>

              {/* Help Section */}
              <div className="text-center pt-4 border-t border-border/30">
                <p className="text-xs text-muted-foreground mb-2">
                  Still having trouble?
                </p>
                <Link 
                  href="/support" 
                  className="text-xs text-primary hover:text-primary/80 font-medium hover:underline transition-colors"
                >
                  Contact Support →
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 auth-bg">
      <div className="w-full max-w-md">
        <Card variant="glass" className="rounded-3xl animate-fade-in-scale shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-6">
              <HeroLogo 
                size="lg" 
                variant="compact" 
                className="animate-float"
              />
            </div>
            
            <div className="mx-auto mb-6 p-4 bg-warning/10 rounded-full w-fit">
              <Key className="h-10 w-10 text-warning animate-pulse-subtle" />
            </div>
            
            <h1 className="text-3xl font-bold gradient-text mb-3">
              Reset Your Password
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-sm mx-auto">
              Enter your email address and we&apos;ll send you instructions to reset your password
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="animate-slide-down">
                  <AlertDescription className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Email Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Mail className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                </div>
                <Input
                  id="reset-email"
                  type="email"
                  className="pl-12 h-14 text-base border-border/50 bg-card/50 backdrop-blur-sm focus:border-primary focus:bg-card transition-all duration-300 rounded-xl"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                size="lg"
                className="w-full h-14 text-base font-semibold bg-gradient-to-r from-warning via-accent-orange to-accent-yellow hover:from-warning/90 hover:via-accent-orange/90 hover:to-accent-yellow/90 transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl group"
                disabled={loading || !email}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    <span>Sending Instructions...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Shield className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span>Send Reset Instructions</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="p-4 rounded-xl bg-muted/20 backdrop-blur-sm border border-border/30">
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    Security Notice
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Reset links expire after 15 minutes for your security. 
                    You can only have one active reset request at a time.
                  </p>
                </div>
              </div>
            </div>

            {/* Back to Sign In */}
            <div className="pt-4 border-t border-border/30">
              <Link 
                href="/auth/login"
                className="flex items-center justify-center text-sm text-muted-foreground hover:text-primary font-medium transition-colors duration-200 group"
              >
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Additional Help Card */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 text-xs text-muted-foreground bg-card/30 px-4 py-2 rounded-full backdrop-blur-sm border border-border/20">
            <Shield className="h-3 w-3 text-success" />
            <span>Secure password reset powered by CollabIDE</span>
          </div>
        </div>
      </div>
    </main>
  )
}
