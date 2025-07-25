'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Loader2, Mail, CheckCircle, ArrowLeft, Shield, Clock, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { GuestRoute } from '@/components/ProtectedRoute'
import Link from 'next/link'

export default function VerifyPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isVerified, setIsVerified] = useState(false)
  
  const { verify } = useAuth()
  const { toast } = useToast()
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
      
      toast({
        variant: "success",
        title: "Email verified successfully!",
        description: "Welcome to CollabIDE. Redirecting to dashboard...",
      })

      // Redirect after a short delay to show success state
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed'
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: errorMessage,
      })
      
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

      toast({
        variant: "success",
        title: "Verification code sent",
        description: "Please check your email for the new code",
      })

      setCountdown(60) // 60 second cooldown
      setOtp(['', '', '', '', '', '']) // Clear current OTP
      inputRefs.current[0]?.focus()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend code'
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Failed to resend",
        description: errorMessage,
      })
    } finally {
      setResending(false)
    }
  }

  const formatEmail = (email: string) => {
    const [local, domain] = email.split('@')
    if (local.length <= 3) return email
    return `${local.slice(0, 2)}${'*'.repeat(local.length - 3)}${local.slice(-1)}@${domain}`
  }

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
        <Card className="w-full max-w-md text-center glass-card shadow-xl border-0">
          <CardHeader className="pb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl mb-6 mx-auto">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-900 mb-2">
              Email Verified!
            </CardTitle>
            <CardDescription className="text-green-700">
              Your account has been successfully verified. Redirecting to dashboard...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Setting up your account...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <GuestRoute>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="w-full max-w-md">
          {/* Back button */}
          <Link href="/auth/register" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Registration
          </Link>

          <Card className="glass-card shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl mb-6 mx-auto">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                Verify Your Email
              </CardTitle>
              <CardDescription className="text-base">
                We sent a 6-digit verification code to
              </CardDescription>
              <Badge variant="outline" className="mt-2 bg-blue-50 border-blue-200 text-blue-800">
                {formatEmail(email)}
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive" className="animate-slide-up">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {/* OTP Input Grid */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700 text-center">
                  Enter Verification Code
                </label>
                <div className="flex justify-center space-x-3">
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
                      className="w-12 h-12 text-center text-lg font-semibold border-2 focus:border-blue-500 transition-colors"
                      disabled={loading || isVerified}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500 text-center">
                  Paste your code or type each digit individually
                </p>
              </div>

              {/* Submit Button */}
              <Button 
                onClick={() => handleSubmit()}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                disabled={loading || otp.some(d => d === '') || isVerified}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-5 w-5" />
                    Verify Email
                  </>
                )}
              </Button>

              {/* Resend Section */}
              <div className="border-t border-slate-200 pt-6">
                <div className="text-center space-y-3">
                  <p className="text-sm text-slate-600">
                    Didn't receive the code?
                  </p>
                  
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="outline"
                      onClick={handleResend}
                      disabled={resending || countdown > 0 || loading}
                      className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      {resending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending new code...
                        </>
                      ) : countdown > 0 ? (
                        <>
                          <Clock className="mr-2 h-4 w-4" />
                          Resend in {countdown}s
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Send New Code
                        </>
                      )}
                    </Button>
                    
                    <p className="text-xs text-slate-500">
                      Check your spam folder if you don't see the email
                    </p>
                  </div>
                </div>
              </div>

              {/* Help Section */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                      Having trouble?
                    </h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Check your spam/junk folder</li>
                      <li>• Make sure {email} is correct</li>
                      <li>• Try resending the code</li>
                      <li>• Contact support if issues persist</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Help */}
          <div className="text-center mt-6">
            <p className="text-sm text-slate-600">
              Need help? {' '}
              <Link href="/support" className="text-blue-600 hover:text-blue-700 font-medium">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </GuestRoute>
  )
}
