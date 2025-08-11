// 'use client'

// import { useState, useEffect, useRef } from 'react'
// import { useAuth } from '@/contexts/auth-context'
// import { useSearchParams, useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Card, CardContent, CardHeader } from '@/components/ui/card'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import { Badge } from '@/components/ui/badge'
// import HeroLogo from '@/components/ui/hero-logo'
// import { 
//   Loader2, 
//   Mail, 
//   CheckCircle, 
//   ArrowLeft, 
//   Shield, 
//   Clock, 
//   RefreshCw,
//   AlertCircle,
//   Sparkles,
//   Key,
//   Timer
// } from 'lucide-react'
// import { cn } from '@/lib/utils'
// import Link from 'next/link'

// export default function VerifyPage() {
//   const [otp, setOtp] = useState(['', '', '', '', '', ''])
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [resending, setResending] = useState(false)
//   const [countdown, setCountdown] = useState(0)
//   const [isVerified, setIsVerified] = useState(false)
  
//   const { verify } = useAuth()
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const email = searchParams.get('email') || ''
  
//   // Refs for OTP inputs
//   const inputRefs = useRef<(HTMLInputElement | null)[]>([])

//   // Simple toast replacement
//   const showToast = (message: string, type: 'success' | 'error' = 'success') => {
//     console.log(`${type.toUpperCase()}: ${message}`)
//   }

//   useEffect(() => {
//     if (!email) {
//       router.push('/auth/register')
//     }
//   }, [email, router])

//   useEffect(() => {
//     if (countdown > 0) {
//       const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
//       return () => clearTimeout(timer)
//     }
//   }, [countdown])

//   // Auto-focus first input on mount
//   useEffect(() => {
//     if (inputRefs.current[0]) {
//       inputRefs.current[0].focus()
//     }
//   }, [])

//   const handleOtpChange = (index: number, value: string) => {
//     // Only allow digits
//     const digit = value.replace(/\D/g, '').slice(-1)
    
//     const newOtp = [...otp]
//     newOtp[index] = digit
//     setOtp(newOtp)
//     setError('') // Clear errors when user types

//     // Auto-advance to next input
//     if (digit && index < 5) {
//       inputRefs.current[index + 1]?.focus()
//     }

//     // Auto-submit when all fields are filled
//     if (digit && index === 5 && newOtp.every(d => d !== '')) {
//       handleSubmit(newOtp.join(''))
//     }
//   }

//   const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
//     // Handle backspace
//     if (e.key === 'Backspace' && !otp[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus()
//     }
    
//     // Handle arrow keys
//     if (e.key === 'ArrowLeft' && index > 0) {
//       inputRefs.current[index - 1]?.focus()
//     }
//     if (e.key === 'ArrowRight' && index < 5) {
//       inputRefs.current[index + 1]?.focus()
//     }

//     // Handle paste
//     if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
//       e.preventDefault()
//       navigator.clipboard.readText().then(text => {
//         const digits = text.replace(/\D/g, '').slice(0, 6).split('')
//         const newOtp = [...otp]
//         digits.forEach((digit, i) => {
//           if (i < 6) newOtp[i] = digit
//         })
//         setOtp(newOtp)
        
//         // Focus the next empty field or last field
//         const nextIndex = Math.min(digits.length, 5)
//         inputRefs.current[nextIndex]?.focus()
        
//         // Auto-submit if complete
//         if (digits.length === 6) {
//           handleSubmit(newOtp.join(''))
//         }
//       })
//     }
//   }

//   const handleSubmit = async (code?: string) => {
//     const otpCode = code || otp.join('')
//     setError('')

//     if (otpCode.length !== 6) {
//       setError('Please enter a complete 6-digit code')
//       return
//     }

//     setLoading(true)

//     try {
//       await verify(email, otpCode)
//       setIsVerified(true)
      
//       showToast("Email verified successfully! Welcome to CollabIDE.", 'success')

//       // Redirect after a short delay to show success state
//       setTimeout(() => {
//         router.push('/dashboard')
//       }, 2000)
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Verification failed'
//       setError(errorMessage)
//       showToast(errorMessage, 'error')
      
//       // Clear OTP on error
//       setOtp(['', '', '', '', '', ''])
//       inputRefs.current[0]?.focus()
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleResend = async () => {
//     setError('')
//     setResending(true)

//     try {
//       const response = await fetch('/api/auth/resend-verification', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to resend code')
//       }

//       showToast("Verification code sent! Please check your email.", 'success')

//       setCountdown(60) // 60 second cooldown
//       setOtp(['', '', '', '', '', '']) // Clear current OTP
//       inputRefs.current[0]?.focus()
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Failed to resend code'
//       setError(errorMessage)
//       showToast(errorMessage, 'error')
//     } finally {
//       setResending(false)
//     }
//   }

//   const formatEmail = (email: string) => {
//     const [local, domain] = email.split('@')
//     if (local.length <= 3) return email
//     return `${local.slice(0, 2)}${'*'.repeat(local.length - 3)}${local.slice(-1)}@${domain}`
//   }

//   if (isVerified) {
//     return (
//       <main className="min-h-screen w-full flex items-center justify-center p-4 auth-bg">
//         <div className="w-full max-w-md">
//           <Card variant="glass" className="rounded-3xl animate-fade-in-scale shadow-2xl">
//             <CardHeader className="text-center pb-6">
//               <div className="flex justify-center mb-6">
//                 <HeroLogo 
//                   size="lg" 
//                   variant="compact" 
//                   className="animate-float"
//                 />
//               </div>
              
//               <div className="mx-auto mb-6 p-4 bg-success/10 rounded-full w-fit animate-scale-in">
//                 <CheckCircle className="h-16 w-16 text-success animate-pulse-subtle" />
//               </div>
              
//               <h1 className="text-3xl font-bold gradient-text mb-3">
//                 Email Verified!
//               </h1>
//               <p className="text-muted-foreground text-lg leading-relaxed">
//                 Welcome to CollabIDE! Your account is ready.
//               </p>
//             </CardHeader>
            
//             <CardContent className="space-y-6">
//               {/* Success Animation */}
//               <div className="flex items-center justify-center space-x-3 p-4 rounded-xl bg-success/5 border border-success/20">
//                 <Sparkles className="h-5 w-5 text-success animate-spin" style={{ animationDuration: '3s' }} />
//                 <span className="text-sm text-success font-medium">Setting up your workspace...</span>
//                 <Loader2 className="h-4 w-4 animate-spin text-success" />
//               </div>

//               {/* Welcome Features */}
//               <div className="grid grid-cols-3 gap-3 text-center">
//                 {[
//                   { icon: Shield, label: 'Secure', color: 'text-success' },
//                   { icon: Sparkles, label: 'Ready', color: 'text-primary' },
//                   { icon: CheckCircle, label: 'Verified', color: 'text-success' }
//                 ].map(({ icon: Icon, label, color }, index) => (
//                   <div 
//                     key={label}
//                     className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-muted/20 animate-fade-in"
//                     style={{ animationDelay: `${index * 0.2}s` }}
//                   >
//                     <Icon className={`h-6 w-6 ${color}`} />
//                     <span className="text-xs text-muted-foreground font-medium">{label}</span>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </main>
//     )
//   }

//   return (
//     <main className="min-h-screen w-full flex items-center justify-center p-4 auth-bg">
//       <div className="w-full max-w-md">
//         {/* Back button */}
//         <Link 
//           href="/auth/register" 
//           className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors duration-200 group"
//         >
//           <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
//           Back to Registration
//         </Link>

//         <Card variant="glass" className="rounded-3xl animate-fade-in-scale shadow-2xl">
//           <CardHeader className="text-center pb-6">
//             <div className="flex justify-center mb-6">
//               <HeroLogo 
//                 size="lg" 
//                 variant="compact" 
//                 className="animate-float"
//               />
//             </div>
            
//             <div className="mx-auto mb-6 p-4 bg-info/10 rounded-full w-fit">
//               <Key className="h-10 w-10 text-info animate-pulse-subtle" />
//             </div>
            
//             <h1 className="text-3xl font-bold gradient-text mb-3">
//               Verify Your Email
//             </h1>
//             <p className="text-muted-foreground text-lg leading-relaxed mb-4">
//               We sent a 6-digit verification code to
//             </p>
//             <Badge 
//               variant="outline" 
//               className="bg-info/10 border-info/30 text-info px-3 py-1 text-sm font-mono"
//             >
//               {formatEmail(email)}
//             </Badge>
//           </CardHeader>
          
//           <CardContent className="space-y-6">
//             {/* Error Alert */}
//             {error && (
//               <Alert variant="destructive" className="animate-slide-down">
//                 <AlertDescription className="flex items-center gap-2">
//                   <AlertCircle className="h-4 w-4 flex-shrink-0" />
//                   <span className="text-sm">{error}</span>
//                 </AlertDescription>
//               </Alert>
//             )}
            
//             {/* OTP Input Grid */}
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-foreground text-center">
//                 Enter Verification Code
//               </label>
//               <div className="flex justify-center space-x-3">
//                 {otp.map((digit, index) => (
//                   <Input
//                     key={index}
//                     ref={(el) => inputRefs.current[index] = el}
//                     type="text"
//                     inputMode="numeric"
//                     maxLength={1}
//                     value={digit}
//                     onChange={(e) => handleOtpChange(index, e.target.value)}
//                     onKeyDown={(e) => handleKeyDown(index, e)}
//                     className={cn(
//                       "w-14 h-14 text-center text-xl font-bold border-2 transition-all duration-300 rounded-xl bg-card/50 backdrop-blur-sm",
//                       digit ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/50",
//                       "focus:border-primary focus:bg-card focus:scale-105"
//                     )}
//                     disabled={loading || isVerified}
//                   />
//                 ))}
//               </div>
//               <p className="text-xs text-muted-foreground text-center">
//                 You can paste your code or type each digit individually
//               </p>
//             </div>

//             {/* Submit Button */}
//             <Button 
//               onClick={() => handleSubmit()}
//               size="lg"
//               className="w-full h-14 text-base font-semibold bg-gradient-to-r from-info via-primary to-accent-blue hover:from-info/90 hover:via-primary/90 hover:to-accent-blue/90 transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl group"
//               disabled={loading || otp.some(d => d === '') || isVerified}
//             >
//               {loading ? (
//                 <div className="flex items-center justify-center">
//                   <Loader2 className="mr-3 h-5 w-5 animate-spin" />
//                   <span>Verifying Code...</span>
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-center">
//                   <Shield className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
//                   <span>Verify Email</span>
//                   <CheckCircle className="ml-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
//                 </div>
//               )}
//             </Button>

//             {/* Resend Section */}
//             <div className="pt-6 border-t border-border/30">
//               <div className="text-center space-y-4">
//                 <p className="text-sm text-muted-foreground">
//                   Didn&apos;t receive the code?
//                 </p>
                
//                 <Button
//                   variant="outline"
//                   size="lg"
//                   onClick={handleResend}
//                   disabled={resending || countdown > 0 || loading}
//                   className="w-full h-12 rounded-xl bg-card/50 border-border/50 hover:border-primary/50 hover:bg-card transition-all duration-300 group"
//                 >
//                   {resending ? (
//                     <div className="flex items-center justify-center">
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       <span>Sending New Code...</span>
//                     </div>
//                   ) : countdown > 0 ? (
//                     <div className="flex items-center justify-center">
//                       <Timer className="mr-2 h-4 w-4 text-warning" />
//                       <span>Resend in {countdown}s</span>
//                     </div>
//                   ) : (
//                     <div className="flex items-center justify-center">
//                       <RefreshCw className="mr-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
//                       <span>Send New Code</span>
//                     </div>
//                   )}
//                 </Button>
                
//                 <p className="text-xs text-muted-foreground">
//                   Check your spam folder if you don&apos;t see the email
//                 </p>
//               </div>
//             </div>

//             {/* Help Section */}
//             <div className="p-4 rounded-xl bg-info/5 border border-info/20 backdrop-blur-sm">
//               <div className="flex items-start space-x-3">
//                 <Mail className="h-5 w-5 text-info mt-0.5 flex-shrink-0" />
//                 <div className="space-y-2">
//                   <h4 className="text-sm font-medium text-info">
//                     Having trouble receiving the code?
//                   </h4>
//                   <ul className="text-xs text-muted-foreground space-y-1 leading-relaxed">
//                     <li>• Check your spam/junk folder</li>
//                     <li>• Ensure {formatEmail(email)} is correct</li>
//                     <li>• Try requesting a new code</li>
//                     <li>• Wait a few minutes for delivery</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>

//             {/* Security Notice */}
//             <div className="p-4 rounded-xl bg-muted/20 backdrop-blur-sm border border-border/30">
//               <div className="flex items-start space-x-3">
//                 <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
//                 <div className="space-y-1">
//                   <p className="text-sm font-medium text-foreground">
//                     Security Notice
//                   </p>
//                   <p className="text-xs text-muted-foreground leading-relaxed">
//                     Verification codes expire after 10 minutes for your security. 
//                     You&apos;ll need to request a new code if this one expires.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Additional Help */}
//         <div className="text-center mt-6">
//           <p className="text-sm text-muted-foreground">
//             Need help? {' '}
//             <Link 
//               href="/support" 
//               className="text-primary hover:text-primary/80 font-medium hover:underline transition-colors"
//             >
//               Contact Support →
//             </Link>
//           </p>
//         </div>

//         {/* CollabIDE Branding */}
//         <div className="flex justify-center mt-6">
//           <div className="inline-flex items-center space-x-2 text-xs text-muted-foreground bg-card/30 px-4 py-2 rounded-full backdrop-blur-sm border border-border/20">
//             <Shield className="h-3 w-3 text-success" />
//             <span>Secure verification powered by CollabIDE</span>
//           </div>
//         </div>
//       </div>
//     </main>
//   )
// }


'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Loader2, 
  Mail, 
  CheckCircle, 
  ArrowLeft, 
  Shield, 
  RefreshCw,
  AlertCircle,
  Code,
  Timer
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

  // Success state - clean and simple
  if (isVerified) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-900 rounded-xl p-8 shadow-xl text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">
              Email Verified!
            </h1>
            <p className="text-gray-400 mb-6">
              Welcome to CollabIDE. Redirecting to your dashboard...
            </p>
            
            <div className="flex items-center justify-center space-x-2">
              <span className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                <span className="text-sm text-gray-400">Setting up your workspace...</span>
              </span>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back button */}
        <Link 
          href="/auth/register" 
          className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Registration
        </Link>

        <div className="bg-gray-900 rounded-xl p-8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Code className="w-6 h-6 text-white" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-400 text-sm mb-4">
              We sent a 6-digit verification code to
            </p>
            <div className="inline-block bg-gray-800 px-3 py-1 rounded text-sm text-gray-300 font-mono">
              {formatEmail(email)}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}
          
          {/* OTP Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3 text-center">
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
                  className={cn(
                    "w-12 h-12 text-center text-lg font-bold bg-gray-800 border-gray-700 text-white rounded-lg",
                    digit ? "border-blue-500 bg-blue-900/20" : "border-gray-700 focus:border-blue-500",
                    "focus:ring-1 focus:ring-blue-500"
                  )}
                  disabled={loading || isVerified}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              You can paste your code or type each digit
            </p>
          </div>

          {/* Submit Button */}
          <Button 
            onClick={() => handleSubmit()}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg mb-6"
            disabled={loading || otp.some(d => d === '') || isVerified}
          >
            {loading ? (
              <>
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying Code...
                </span>
              </>
            ) : (
              <>
                <span className="flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  Verify Email
                </span>
              </>
            )}
          </Button>

          {/* Resend Section */}
          <div className="border-t border-gray-800 pt-6">
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-400">
                Didn't receive the code?
              </p>
              
              <Button
                variant="outline"
                onClick={handleResend}
                disabled={resending || countdown > 0 || loading}
                className="w-full h-11 bg-gray-800 border-gray-700 text-white hover:bg-gray-700 rounded-lg"
              >
                {resending ? (
                  <span className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending New Code...
                  </span>
                ) : countdown > 0 ? (
                  <span className="flex items-center">
                    <Timer className="mr-2 h-4 w-4 text-yellow-500" />
                    Resend in {countdown}s
                  </span>
                ) : (
                  <span className="flex items-center">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Send New Code
                  </span>
                )}
              </Button>
              
              <p className="text-xs text-gray-500">
                Check your spam folder if you don't see the email
              </p>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-white mb-2">
                  Having trouble?
                </h4>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Check your spam/junk folder</li>
                  <li>• Ensure your email address is correct</li>
                  <li>• Try requesting a new code</li>
                  <li>• Codes expire after 10 minutes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Need help?{' '}
            <Link 
              href="/support" 
              className="text-blue-400 hover:text-blue-300"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
