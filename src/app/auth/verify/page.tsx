'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Loader2, 
  Mail, 
  CheckCircle, 
  ArrowLeft, 
  Shield, 
  RefreshCw,
  AlertCircle,
  Code,
  Timer,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function VerifyPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isVerified, setIsVerified] = useState(false)
  
  const { verify } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  
  // Refs for OTP inputs
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!email) {
      router.push('/auth/register')
    }
  }, [email, router])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1)
    
    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)
    setError('') // Clear errors when user types

    // Auto-advance to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all fields are filled
    if (digit && index === 5 && newOtp.every(d => d !== '')) {
      handleSubmit(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    
    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, 6).split('')
        const newOtp = [...otp]
        digits.forEach((digit, i) => {
          if (i < 6) newOtp[i] = digit
        })
        setOtp(newOtp)
        
        // Focus the next empty field or last field
        const nextIndex = Math.min(digits.length, 5)
        inputRefs.current[nextIndex]?.focus()
        
        // Auto-submit if complete
        if (digits.length === 6) {
          handleSubmit(newOtp.join(''))
        }
      })
    }
  }

  const handleSubmit = async (code?: string) => {
    const otpCode = code || otp.join('')
    setError('')

    if (otpCode.length !== 6) {
      setError('Please enter a complete 6-digit code')
      return
    }

    setLoading(true)

    try {
      await verify(email, otpCode)
      setIsVerified(true)
      
      // Redirect after a short delay to show success state
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed'
      setError(errorMessage)
      
      // Clear OTP on error
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError('')
    setResending(true)

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend code')
      }

      setCountdown(60) // 60 second cooldown
      setOtp(['', '', '', '', '', '']) // Clear current OTP
      inputRefs.current[0]?.focus()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend code'
      setError(errorMessage)
    } finally {
      setResending(false)
    }
  }

  const formatEmail = (email: string) => {
    const [local, domain] = email.split('@')
    if (local.length <= 3) return email
    return `${local.slice(0, 2)}${'*'.repeat(local.length - 3)}${local.slice(-1)}@${domain}`
  }

  // Success state
  if (isVerified) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-green-500/10 animate-pulse" />
        
        <div className="w-full max-w-md relative z-10">
          <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              
              <CardTitle className="text-2xl font-bold mb-2">
                Email Verified!
              </CardTitle>
              <CardDescription className="mb-6">
                Welcome to CollabIDE. Redirecting to your dashboard...
              </CardDescription>
              
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Setting up your workspace...</span>
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
          <Link href="/auth/register">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Registration
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
              <Zap className="w-4 h-4" />
              Email verification required
            </Badge>

            {/* Title */}
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold">
                Verify Your Email
              </CardTitle>
              <CardDescription className="space-y-2">
                <span>We sent a 6-digit verification code to</span>
                <div className="inline-block bg-muted px-3 py-1 rounded-md text-sm font-mono mt-1">
                  {formatEmail(email)}
                </div>
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* OTP Input */}
            <div className="space-y-4">
              <div className="text-center">
                <label className="text-sm font-medium">
                  Enter Verification Code
                </label>
              </div>
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={cn(
                      "w-12 h-12 text-center text-lg font-bold rounded-lg",
                      digit && "ring-2 ring-primary ring-offset-2"
                    )}
                    disabled={loading || isVerified}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                You can paste your code or type each digit
              </p>
            </div>

            {/* Submit Button */}
            <Button 
              onClick={() => handleSubmit()}
              className="w-full font-semibold"
              size="lg"
              disabled={loading || otp.some(d => d === '') || isVerified}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying Code...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Verify Email
                </>
              )}
            </Button>

            {/* Resend Section */}
            <div className="space-y-4 pt-6 border-t">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Didn't receive the code?
                </p>
                
                <Button
                  variant="outline"
                  onClick={handleResend}
                  disabled={resending || countdown > 0 || loading}
                  className="w-full"
                  size="lg"
                >
                  {resending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending New Code...
                    </>
                  ) : countdown > 0 ? (
                    <>
                      <Timer className="mr-2 h-4 w-4 text-yellow-500" />
                      Resend in {countdown}s
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Send New Code
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground mt-2">
                  Check your spam folder if you don't see the email
                </p>
              </div>
            </div>

            {/* Help Section */}
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">
                      Having trouble?
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Check your spam/junk folder</li>
                      <li>• Ensure your email address is correct</li>
                      <li>• Try requesting a new code</li>
                      <li>• Codes expire after 10 minutes</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Footer */}
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
