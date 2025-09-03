// // 'use client'

// // import { useState, useEffect } from 'react'
// // import { useAuth } from '@/contexts/auth-context'
// // import { useRouter, useParams } from 'next/navigation'
// // import { Button } from '@/components/ui/button'
// // import { Input } from '@/components/ui/input'
// // import { Checkbox } from '@/components/ui/checkbox'
// // import { Label } from '@/components/ui/label'
// // import { Alert, AlertDescription } from '@/components/ui/alert'
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// // import { Badge } from '@/components/ui/badge'
// // import { 
// //   Loader2, 
// //   Eye, 
// //   EyeOff, 
// //   Mail, 
// //   Lock, 
// //   User,
// //   Code,
// //   ArrowRight,
// //   AlertCircle,
// //   Zap
// // } from 'lucide-react'
// // import { cn } from '@/lib/utils'
// // import Link from 'next/link'

// // interface FormFields {
// //   email: string
// //   password: string
// //   displayName: string
// //   confirmPassword: string
// //   rememberMe: boolean
// //   acceptTerms: boolean
// // }

// // export default function AuthPage() {
// //   const params = useParams()
// //   const router = useRouter()
// //   const { login, register, user } = useAuth() || { 
// //     login: async () => {}, 
// //     register: async () => {}, 
// //     user: null 
// //   }

// //   const isRegister = params.action === 'register'
// //   const [fields, setFields] = useState<FormFields>({ 
// //     email: '', 
// //     password: '', 
// //     displayName: '', 
// //     confirmPassword: '', 
// //     rememberMe: false,
// //     acceptTerms: false
// //   })
// //   const [showPassword, setShowPassword] = useState(false)
// //   const [error, setError] = useState('')
// //   const [loading, setLoading] = useState(false)

// //   useEffect(() => {
// //     if (user) {
// //       router.push('/dashboard')
// //     }
// //   }, [user, router])

// //   useEffect(() => {
// //     // Clear form when switching between login/register
// //     setError('')
// //     setFields({ 
// //       email: '', 
// //       password: '', 
// //       displayName: '', 
// //       confirmPassword: '', 
// //       rememberMe: false,
// //       acceptTerms: false
// //     })
// //   }, [params.action])

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault()
// //     setError('')
// //     setLoading(true)
    
// //     try {
// //       if (isRegister) {
// //         // Register validation
// //         if (!fields.displayName.trim()) {
// //           throw new Error("Name is required")
// //         }
// //         if (fields.password !== fields.confirmPassword) {
// //           throw new Error("Passwords don't match")
// //         }
// //         if (fields.password.length < 8) {
// //           throw new Error("Password must be at least 8 characters")
// //         }
// //         if (!fields.acceptTerms) {
// //           throw new Error("Please accept the terms")
// //         }

// //         await register(fields.email, fields.password, fields.displayName.trim())
// //         router.push(`/auth/verify?email=${encodeURIComponent(fields.email)}`)
// //       } else {
// //         // Login validation
// //         if (!fields.email || !fields.password) {
// //           throw new Error("Email and password are required")
// //         }
        
// //         await login(fields.email, fields.password, fields.rememberMe)
// //       }
// //     } catch (err) {
// //       const errorMessage = err instanceof Error ? err.message : 'Something went wrong'
// //       setError(errorMessage)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   return (
// //     <div className="min-h-screen bg-background flex items-center justify-center p-4">
// //       {/* Background Elements */}
// //       <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
// //       <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-primary/10 animate-pulse" />
// //       <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl bg-accent/10 animate-pulse" style={{ animationDelay: '2s' }} />
      
// //       {/* Main Content */}
// //       <div className="w-full max-w-md relative z-10">
// //         <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur">
// //           <CardHeader className="text-center space-y-4 pb-6">
// //             {/* Logo */}
// //             <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto shadow-lg">
// //               <Code className="w-6 h-6 text-primary-foreground" />
// //             </div>
            
// //             {/* Badge */}
// //             <Badge variant="outline" className="inline-flex items-center gap-2 px-4 py-2 mx-auto">
// //               <Zap className="w-4 h-4" />
// //               Real-time collaborative coding
// //             </Badge>

// //             {/* Title */}
// //             <div className="space-y-2">
// //               <CardTitle className="text-2xl font-bold">
// //                 {isRegister ? 'Create Account' : 'Welcome Back'}
// //               </CardTitle>
// //               <CardDescription>
// //                 {isRegister 
// //                   ? 'Join CollabIDE to start coding together' 
// //                   : 'Sign in to your CollabIDE account'
// //                 }
// //               </CardDescription>
// //             </div>
// //           </CardHeader>

// //           <CardContent className="space-y-6">
// //             {/* Toggle Buttons */}
// //             <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-lg">
// //               <Link href="/auth/login">
// //                 <Button
// //                   variant={!isRegister ? "default" : "ghost"}
// //                   size="sm"
// //                   className="w-full justify-center"
// //                 >
// //                   Sign In
// //                 </Button>
// //               </Link>
// //               <Link href="/auth/register">
// //                 <Button
// //                   variant={isRegister ? "default" : "ghost"}
// //                   size="sm"
// //                   className="w-full justify-center"
// //                 >
// //                   Sign Up
// //                 </Button>
// //               </Link>
// //             </div>

// //             {/* Error Display */}
// //             {error && (
// //               <Alert variant="destructive">
// //                 <AlertCircle className="h-4 w-4" />
// //                 <AlertDescription>{error}</AlertDescription>
// //               </Alert>
// //             )}

// //             {/* Form */}
// //             <form onSubmit={handleSubmit} className="space-y-4">
// //               {/* Name Field - Only for Register */}
// //               {isRegister && (
// //                 <div className="space-y-2">
// //                   <Label htmlFor="name">Full Name</Label>
// //                   <div className="relative">
// //                     <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
// //                     <Input
// //                       id="name"
// //                       type="text"
// //                       className="pl-10"
// //                       placeholder="Enter your full name"
// //                       value={fields.displayName}
// //                       onChange={(e) => setFields({ ...fields, displayName: e.target.value })}
// //                       required
// //                       disabled={loading}
// //                     />
// //                   </div>
// //                 </div>
// //               )}

// //               {/* Email Field */}
// //               <div className="space-y-2">
// //                 <Label htmlFor="email">Email</Label>
// //                 <div className="relative">
// //                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
// //                   <Input
// //                     id="email"
// //                     type="email"
// //                     className="pl-10"
// //                     placeholder="Enter your email"
// //                     value={fields.email}
// //                     onChange={(e) => setFields({ ...fields, email: e.target.value })}
// //                     required
// //                     disabled={loading}
// //                   />
// //                 </div>
// //               </div>

// //               {/* Password Field */}
// //               <div className="space-y-2">
// //                 <Label htmlFor="password">Password</Label>
// //                 <div className="relative">
// //                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
// //                   <Input
// //                     id="password"
// //                     type={showPassword ? "text" : "password"}
// //                     className="pl-10 pr-10"
// //                     placeholder={isRegister ? "Create a password (min. 8 chars)" : "Enter your password"}
// //                     value={fields.password}
// //                     onChange={(e) => setFields({ ...fields, password: e.target.value })}
// //                     required
// //                     disabled={loading}
// //                     minLength={isRegister ? 8 : undefined}
// //                   />
// //                   <Button
// //                     type="button"
// //                     variant="ghost"
// //                     size="sm"
// //                     className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
// //                     onClick={() => setShowPassword(!showPassword)}
// //                     disabled={loading}
// //                   >
// //                     {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
// //                   </Button>
// //                 </div>
// //               </div>

// //               {/* Confirm Password Field - Only for Register */}
// //               {isRegister && (
// //                 <div className="space-y-2">
// //                   <Label htmlFor="confirm-password">Confirm Password</Label>
// //                   <div className="relative">
// //                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
// //                     <Input
// //                       id="confirm-password"
// //                       type={showPassword ? "text" : "password"}
// //                       className={cn(
// //                         "pl-10",
// //                         fields.confirmPassword && fields.password !== fields.confirmPassword && "border-destructive focus:border-destructive"
// //                       )}
// //                       placeholder="Confirm your password"
// //                       value={fields.confirmPassword}
// //                       onChange={(e) => setFields({ ...fields, confirmPassword: e.target.value })}
// //                       required
// //                       disabled={loading}
// //                     />
// //                   </div>
// //                   {fields.confirmPassword && fields.password !== fields.confirmPassword && (
// //                     <p className="text-sm text-destructive">Passwords don't match</p>
// //                   )}
// //                 </div>
// //               )}

// //               {/* Remember Me - Only for Login */}
// //               {!isRegister && (
// //                 <div className="flex items-center justify-between pt-2">
// //                   <div className="flex items-center space-x-2">
// //                     <Checkbox 
// //                       id="remember"
// //                       checked={fields.rememberMe} 
// //                       onCheckedChange={(checked) => setFields({...fields, rememberMe: !!checked })} 
// //                       disabled={loading}
// //                     />
// //                     <Label htmlFor="remember" className="text-sm">
// //                       Remember me
// //                     </Label>
// //                   </div>
// //                   <Link 
// //                     href="/auth/reset-password" 
// //                     className="text-sm text-primary hover:text-primary/80 transition-colors"
// //                   >
// //                     Forgot password?
// //                   </Link>
// //                 </div>
// //               )}

// //               {/* Terms - Only for Register */}
// //               {isRegister && (
// //                 <div className="flex items-start space-x-2 pt-2">
// //                   <Checkbox
// //                     id="terms"
// //                     checked={fields.acceptTerms}
// //                     onCheckedChange={(checked) => setFields({...fields, acceptTerms: !!checked})}
// //                     disabled={loading}
// //                     className="mt-0.5"
// //                   />
// //                   <Label htmlFor="terms" className="text-sm leading-tight">
// //                     I agree to the{' '}
// //                     <Link href="/terms" className="text-primary hover:text-primary/80 underline">
// //                       Terms of Service
// //                     </Link>
// //                     {' '}and{' '}
// //                     <Link href="/privacy" className="text-primary hover:text-primary/80 underline">
// //                       Privacy Policy
// //                     </Link>
// //                   </Label>
// //                 </div>
// //               )}

// //               {/* Submit Button */}
// //               <Button 
// //                 type="submit" 
// //                 className="w-full h-11 font-semibold mt-6" 
// //                 disabled={loading || (isRegister && !fields.acceptTerms)}
// //                 size="lg"
// //               >
// //                 {loading ? (
// //                   <>
// //                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// //                     {isRegister ? 'Creating Account...' : 'Signing In...'}
// //                   </>
// //                 ) : (
// //                   <>
// //                     {isRegister ? 'Create Account' : 'Sign In'}
// //                     <ArrowRight className="ml-2 h-4 w-4" />
// //                   </>
// //                 )}
// //               </Button>
// //             </form>

// //             {/* Footer Link */}
// //             <div className="text-center pt-4">
// //               <p className="text-sm text-muted-foreground">
// //                 {isRegister ? (
// //                   <>
// //                     Already have an account?{' '}
// //                     <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium underline">
// //                       Sign in here
// //                     </Link>
// //                   </>
// //                 ) : (
// //                   <>
// //                     Don't have an account?{' '}
// //                     <Link href="/auth/register" className="text-primary hover:text-primary/80 font-medium underline">
// //                       Create one here
// //                     </Link>
// //                   </>
// //                 )}
// //               </p>
// //             </div>
// //           </CardContent>
// //         </Card>
// //       </div>
// //     </div>
// //   )
// // }


// 'use client'

// import { useState, useEffect } from 'react'
// import { useAuth } from '@/contexts/auth-context'
// import { useRouter, useParams } from 'next/navigation'
// import { signIn, getProviders } from 'next-auth/react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Checkbox } from '@/components/ui/checkbox'
// import { Label } from '@/components/ui/label'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Separator } from '@/components/ui/separator'
// import { 
//   Loader2, 
//   Eye, 
//   EyeOff, 
//   Mail, 
//   Lock, 
//   User,
//   Code,
//   ArrowRight,
//   AlertCircle,
//   Zap,
//   Github
// } from 'lucide-react'
// import { cn } from '@/lib/utils'
// import Link from 'next/link'

// interface FormFields {
//   email: string
//   password: string
//   displayName: string
//   confirmPassword: string
//   rememberMe: boolean
//   acceptTerms: boolean
// }

// export default function AuthPage() {
//   const params = useParams()
//   const router = useRouter()
//   const { login, register, user } = useAuth() || { 
//     login: async () => {}, 
//     register: async () => {}, 
//     user: null 
//   }

//   const isRegister = params.action === 'register'
//   const [fields, setFields] = useState<FormFields>({ 
//     email: '', 
//     password: '', 
//     displayName: '', 
//     confirmPassword: '', 
//     rememberMe: false,
//     acceptTerms: false
//   })
//   const [showPassword, setShowPassword] = useState(false)
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [oauthLoading, setOauthLoading] = useState('')
//   const [providers, setProviders] = useState<any>(null)

//   // Load OAuth providers
//   useEffect(() => {
//     const loadProviders = async () => {
//       const res = await getProviders()
//       setProviders(res)
//     }
//     loadProviders()
//   }, [])

//   useEffect(() => {
//     if (user) {
//       router.push('/dashboard')
//     }
//   }, [user, router])

//   useEffect(() => {
//     // Clear form when switching between login/register
//     setError('')
//     setFields({ 
//       email: '', 
//       password: '', 
//       displayName: '', 
//       confirmPassword: '', 
//       rememberMe: false,
//       acceptTerms: false
//     })
//   }, [params.action])

//   const handleOAuthSignIn = async (providerId: string) => {
//     setOauthLoading(providerId)
//     setError('')
    
//     try {
//       await signIn(providerId, {
//         callbackUrl: '/dashboard',
//         redirect: false
//       })
//     } catch (err) {
//       setError('OAuth sign-in failed. Please try again.')
//     } finally {
//       setOauthLoading('')
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')
//     setLoading(true)
    
//     try {
//       if (isRegister) {
//         // Register validation (same as before)
//         if (!fields.displayName.trim()) {
//           throw new Error("Name is required")
//         }
//         if (fields.password !== fields.confirmPassword) {
//           throw new Error("Passwords don't match")
//         }
//         if (fields.password.length < 8) {
//           throw new Error("Password must be at least 8 characters")
//         }
//         if (!fields.acceptTerms) {
//           throw new Error("Please accept the terms")
//         }
  
//         await register(fields.email, fields.password, fields.displayName.trim())
//         router.push(`/auth/verify?email=${encodeURIComponent(fields.email)}`)
//       } else {
//         // Login validation
//         if (!fields.email || !fields.password) {
//           throw new Error("Email and password are required")
//         }
        
//         await login(fields.email, fields.password, fields.rememberMe)
//       }
//     } catch (err: any) {
//       let errorMessage = err.message || 'Something went wrong'
      
//       // Handle OAuth-specific errors
//       if (err.requiresOAuth) {
//         errorMessage = "This account uses social login. Please use Google or GitHub to sign in."
//       }
      
//       setError(errorMessage)
//     } finally {
//       setLoading(false)
//     }
//   }
  

//   const GoogleIcon = () => (
//     <svg className="w-5 h-5" viewBox="0 0 24 24">
//       <path
//         fill="currentColor"
//         d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//       />
//       <path
//         fill="currentColor"
//         d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//       />
//       <path
//         fill="currentColor"
//         d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//       />
//       <path
//         fill="currentColor"
//         d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//       />
//     </svg>
//   )

//   return (
//     <div className="min-h-screen bg-background flex items-center justify-center p-4">
//       {/* Background Elements */}
//       <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
//       <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-primary/10 animate-pulse" />
//       <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl bg-accent/10 animate-pulse" style={{ animationDelay: '2s' }} />
      
//       {/* Main Content */}
//       <div className="w-full max-w-md relative z-10">
//         <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur">
//           <CardHeader className="text-center space-y-4 pb-6">
//             {/* Logo */}
//             <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto shadow-lg">
//               <Code className="w-6 h-6 text-primary-foreground" />
//             </div>
            
//             {/* Badge */}
//             <Badge variant="outline" className="inline-flex items-center gap-2 px-4 py-2 mx-auto">
//               <Zap className="w-4 h-4" />
//               Real-time collaborative coding
//             </Badge>

//             {/* Title */}
//             <div className="space-y-2">
//               <CardTitle className="text-2xl font-bold">
//                 {isRegister ? 'Create Account' : 'Welcome Back'}
//               </CardTitle>
//               <CardDescription>
//                 {isRegister 
//                   ? 'Join CollabIDE to start coding together' 
//                   : 'Sign in to your CollabIDE account'
//                 }
//               </CardDescription>
//             </div>
//           </CardHeader>

//           <CardContent className="space-y-6">
//             {/* Toggle Buttons */}
//             <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-lg">
//               <Link href="/auth/login">
//                 <Button
//                   variant={!isRegister ? "default" : "ghost"}
//                   size="sm"
//                   className="w-full justify-center"
//                 >
//                   Sign In
//                 </Button>
//               </Link>
//               <Link href="/auth/register">
//                 <Button
//                   variant={isRegister ? "default" : "ghost"}
//                   size="sm"
//                   className="w-full justify-center"
//                 >
//                   Sign Up
//                 </Button>
//               </Link>
//             </div>

//             {/* OAuth Buttons */}
//             {providers && (
//               <div className="space-y-3">
//                 {providers.google && (
//                   <Button
//                     variant="outline"
//                     className="w-full h-11"
//                     onClick={() => handleOAuthSignIn('google')}
//                     disabled={loading || oauthLoading !== ''}
//                   >
//                     {oauthLoading === 'google' ? (
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     ) : (
//                       <GoogleIcon />
//                     )}
//                     <span className="ml-2">Continue with Google</span>
//                   </Button>
//                 )}
                
//                 {providers.github && (
//                   <Button
//                     variant="outline"
//                     className="w-full h-11"
//                     onClick={() => handleOAuthSignIn('github')}
//                     disabled={loading || oauthLoading !== ''}
//                   >
//                     {oauthLoading === 'github' ? (
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     ) : (
//                       <Github className="w-5 h-5" />
//                     )}
//                     <span className="ml-2">Continue with GitHub</span>
//                   </Button>
//                 )}

//                 <div className="relative">
//                   <div className="absolute inset-0 flex items-center">
//                     <Separator className="w-full" />
//                   </div>
//                   <div className="relative flex justify-center text-xs uppercase">
//                     <span className="bg-background px-2 text-muted-foreground">
//                       Or continue with
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Error Display */}
//             {error && (
//               <Alert variant="destructive">
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}

//             {/* Form */}
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* Name Field - Only for Register */}
//               {isRegister && (
//                 <div className="space-y-2">
//                   <Label htmlFor="name">Full Name</Label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="name"
//                       type="text"
//                       className="pl-10"
//                       placeholder="Enter your full name"
//                       value={fields.displayName}
//                       onChange={(e) => setFields({ ...fields, displayName: e.target.value })}
//                       required
//                       disabled={loading || oauthLoading !== ''}
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* Email Field */}
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     id="email"
//                     type="email"
//                     className="pl-10"
//                     placeholder="Enter your email"
//                     value={fields.email}
//                     onChange={(e) => setFields({ ...fields, email: e.target.value })}
//                     required
//                     disabled={loading || oauthLoading !== ''}
//                   />
//                 </div>
//               </div>

//               {/* Password Field */}
//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     className="pl-10 pr-10"
//                     placeholder={isRegister ? "Create a password (min. 8 chars)" : "Enter your password"}
//                     value={fields.password}
//                     onChange={(e) => setFields({ ...fields, password: e.target.value })}
//                     required
//                     disabled={loading || oauthLoading !== ''}
//                     minLength={isRegister ? 8 : undefined}
//                   />
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
//                     onClick={() => setShowPassword(!showPassword)}
//                     disabled={loading || oauthLoading !== ''}
//                   >
//                     {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   </Button>
//                 </div>
//               </div>

//               {/* Confirm Password Field - Only for Register */}
//               {isRegister && (
//                 <div className="space-y-2">
//                   <Label htmlFor="confirm-password">Confirm Password</Label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="confirm-password"
//                       type={showPassword ? "text" : "password"}
//                       className={cn(
//                         "pl-10",
//                         fields.confirmPassword && fields.password !== fields.confirmPassword && "border-destructive focus:border-destructive"
//                       )}
//                       placeholder="Confirm your password"
//                       value={fields.confirmPassword}
//                       onChange={(e) => setFields({ ...fields, confirmPassword: e.target.value })}
//                       required
//                       disabled={loading || oauthLoading !== ''}
//                     />
//                   </div>
//                   {fields.confirmPassword && fields.password !== fields.confirmPassword && (
//                     <p className="text-sm text-destructive">Passwords don&apos;t match</p>
//                   )}
//                 </div>
//               )}

//               {/* Remember Me - Only for Login */}
//               {!isRegister && (
//                 <div className="flex items-center justify-between pt-2">
//                   <div className="flex items-center space-x-2">
//                     <Checkbox 
//                       id="remember"
//                       checked={fields.rememberMe} 
//                       onCheckedChange={(checked) => setFields({...fields, rememberMe: !!checked })} 
//                       disabled={loading || oauthLoading !== ''}
//                     />
//                     <Label htmlFor="remember" className="text-sm">
//                       Remember me
//                     </Label>
//                   </div>
//                   <Link 
//                     href="/auth/reset-password" 
//                     className="text-sm text-primary hover:text-primary/80 transition-colors"
//                   >
//                     Forgot password?
//                   </Link>
//                 </div>
//               )}

//               {/* Terms - Only for Register */}
//               {isRegister && (
//                 <div className="flex items-start space-x-2 pt-2">
//                   <Checkbox
//                     id="terms"
//                     checked={fields.acceptTerms}
//                     onCheckedChange={(checked) => setFields({...fields, acceptTerms: !!checked})}
//                     disabled={loading || oauthLoading !== ''}
//                     className="mt-0.5"
//                   />
//                   <Label htmlFor="terms" className="text-sm leading-tight">
//                     I agree to the{' '}
//                     <Link href="/terms" className="text-primary hover:text-primary/80 underline">
//                       Terms of Service
//                     </Link>
//                     {' '}and{' '}
//                     <Link href="/privacy" className="text-primary hover:text-primary/80 underline">
//                       Privacy Policy
//                     </Link>
//                   </Label>
//                 </div>
//               )}

//               {/* Submit Button */}
//               <Button 
//                 type="submit" 
//                 className="w-full h-11 font-semibold mt-6" 
//                 disabled={loading || oauthLoading !== '' || (isRegister && !fields.acceptTerms)}
//                 size="lg"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     {isRegister ? 'Creating Account...' : 'Signing In...'}
//                   </>
//                 ) : (
//                   <>
//                     {isRegister ? 'Create Account' : 'Sign In'}
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </>
//                 )}
//               </Button>
//             </form>

//             {/* Footer Link */}
//             <div className="text-center pt-4">
//               <p className="text-sm text-muted-foreground">
//                 {isRegister ? (
//                   <>
//                     Already have an account?{' '}
//                     <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium underline">
//                       Sign in here
//                     </Link>
//                   </>
//                 ) : (
//                   <>
//                     Don&apos;t have an account?{' '}
//                     <Link href="/auth/register" className="text-primary hover:text-primary/80 font-medium underline">
//                       Create one here
//                     </Link>
//                   </>
//                 )}
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }


'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter, useParams } from 'next/navigation'
import { signIn, getProviders } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Loader2, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User,
  Code,
  ArrowRight,
  AlertCircle,
  Zap,
  Github,
  Shield,
  Users,
  MessageSquare,
  Globe,
  CheckCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface FormFields {
  email: string
  password: string
  displayName: string
  confirmPassword: string
  rememberMe: boolean
  acceptTerms: boolean
}

// Improved Toggle Component
const ModeToggle = ({ isRegister }: { isRegister: boolean }) => (
  <div className="relative bg-muted/40 rounded-xl p-1 border">
    <div className={cn(
      "absolute top-1 bottom-1 bg-primary rounded-lg transition-all duration-300 ease-out shadow-sm",
      isRegister ? "left-1/2 right-1 ml-0.5" : "left-1 right-1/2 mr-0.5"
    )} />
    <div className="grid grid-cols-2 gap-1 relative">
      <Link href="/auth/login">
        <button className={cn(
          "w-full px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 relative z-10",
          !isRegister ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        )}>
          Sign In
        </button>
      </Link>
      <Link href="/auth/register">
        <button className={cn(
          "w-full px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 relative z-10",
          isRegister ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        )}>
          Sign Up
        </button>
      </Link>
    </div>
  </div>
)

// Google Icon
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
)

// Desktop Welcome Panel
const WelcomePanel = ({ isRegister }: { isRegister: boolean }) => (
  <div className="hidden lg:flex lg:flex-1 flex-col justify-center px-8 xl:px-12 bg-gradient-to-br from-primary/10 via-chart-1/5 to-chart-2/10 relative overflow-hidden">
    <div className="absolute top-10 left-10 w-64 h-64 rounded-full blur-3xl bg-primary/20 animate-pulse" />
    <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full blur-3xl bg-chart-1/20 animate-pulse" style={{ animationDelay: '2s' }} />
    
    <div className="relative z-10 max-w-lg">
      <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mb-8 shadow-xl">
        <Code className="w-10 h-10 text-primary-foreground" />
      </div>
      
      <h1 className="text-4xl xl:text-5xl font-bold text-foreground mb-6 leading-tight">
        {isRegister ? (
          <>Build <span className="text-primary">together</span>, code faster</>
        ) : (
          <>Welcome back to <span className="text-primary">CollabIDE</span></>
        )}
      </h1>
      
      <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
        {isRegister 
          ? "Join thousands of developers already collaborating in real-time. Create, share, and learn together."
          : "Continue building amazing projects with your team. Your collaborative workspace awaits."
        }
      </p>

      <div className="space-y-4 mb-8">
        {[
          { icon: Zap, text: "Real-time collaborative editing" },
          { icon: Users, text: "Unlimited team members" },
          { icon: MessageSquare, text: "Built-in chat & comments" },
          { icon: Globe, text: "Works in any browser" }
        ].map((feature, index) => (
          <div key={index} className="flex items-center gap-3 text-card-foreground">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <feature.icon className="w-4 h-4 text-primary" />
            </div>
            <span className="text-base">{feature.text}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-8 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 bg-chart-1 rounded-full border-2 border-background" />
            ))}
          </div>
          <span>10,000+ developers</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-chart-2 rounded-full animate-pulse" />
          <span>99.9% uptime</span>
        </div>
      </div>
    </div>
  </div>
)

export default function AuthPage() {
  const params = useParams()
  const router = useRouter()
  const { login, register, user } = useAuth() || { 
    login: async () => {}, 
    register: async () => {}, 
    user: null 
  }

  const isRegister = params.action === 'register'
  const [fields, setFields] = useState<FormFields>({ 
    email: '', 
    password: '', 
    displayName: '', 
    confirmPassword: '', 
    rememberMe: false,
    acceptTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState('')
  const [providers, setProviders] = useState<any>(null)

  useEffect(() => {
    const loadProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    loadProviders()
  }, [])

  useEffect(() => {
    if (user) router.push('/dashboard')
  }, [user, router])

  useEffect(() => {
    setError('')
    setFields({ 
      email: '', 
      password: '', 
      displayName: '', 
      confirmPassword: '', 
      rememberMe: false,
      acceptTerms: false
    })
  }, [params.action])

  const handleOAuthSignIn = async (providerId: string) => {
    setOauthLoading(providerId)
    setError('')
    
    try {
      await signIn(providerId, { callbackUrl: '/dashboard', redirect: false })
    } catch (err) {
      setError('OAuth sign-in failed. Please try again.')
    } finally {
      setOauthLoading('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      if (isRegister) {
        if (!fields.displayName.trim()) throw new Error("Name is required")
        if (fields.password !== fields.confirmPassword) throw new Error("Passwords don't match")
        if (fields.password.length < 8) throw new Error("Password must be at least 8 characters")
        if (!fields.acceptTerms) throw new Error("Please accept the terms")

        await register(fields.email, fields.password, fields.displayName.trim())
        router.push(`/auth/verify?email=${encodeURIComponent(fields.email)}`)
      } else {
        if (!fields.email || !fields.password) throw new Error("Email and password are required")
        await login(fields.email, fields.password, fields.rememberMe)
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Mobile Layout - Fits Screen Perfectly */}
      <div className="lg:hidden min-h-screen flex flex-col">
        {/* Compact Header */}
        <div className="flex-shrink-0 text-center pt-6 pb-4 px-4">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Code className="w-7 h-7 text-primary-foreground" />
          </div>
          
          <Badge variant="outline" className="inline-flex items-center gap-2 px-3 py-1 border-primary/20 bg-primary/5 text-primary text-xs mb-3">
            <Zap className="w-3 h-3" />
            Real-time collaborative coding
          </Badge>
          
          <h1 className="text-xl font-bold text-foreground mb-1">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isRegister 
              ? 'Join CollabIDE to start coding together' 
              : 'Sign in to your CollabIDE account'
            }
          </p>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex flex-col px-4 pb-4 min-h-0">
          <Card className="flex-1 bg-card border shadow-xl flex flex-col">
            <CardContent className="p-4 flex-1 flex flex-col min-h-0">
              {/* Toggle */}
              <div className="mb-4">
                <ModeToggle isRegister={isRegister} />
              </div>

              {/* OAuth Buttons */}
              {providers && (
                <div className="space-y-3 mb-4">
                  {providers?.google && (
                    <Button
                      variant="outline"
                      className="w-full h-10 text-sm font-medium"
                      onClick={() => handleOAuthSignIn('google')}
                      disabled={loading || oauthLoading !== ''}
                    >
                      {oauthLoading === 'google' ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <GoogleIcon />
                      )}
                      <span className="ml-2">Continue with Google</span>
                    </Button>
                  )}
                  
                  {providers?.github && (
                    <Button
                      variant="outline"
                      className="w-full h-10 text-sm font-medium"
                      onClick={() => handleOAuthSignIn('github')}
                      disabled={loading || oauthLoading !== ''}
                    >
                      {oauthLoading === 'github' ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Github className="w-4 h-4" />
                      )}
                      <span className="ml-2">Continue with GitHub</span>
                    </Button>
                  )}

                  <div className="relative my-3">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground font-medium">
                        or continue with
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <Alert variant="destructive" className="mb-3 py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              {/* Form - Scrollable if needed */}
              <div className="flex-1 overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Name Field - Register Only */}
                  {isRegister && (
                    <div className="space-y-1">
                      <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          className="pl-10 h-10 text-sm"
                          placeholder="Enter your full name"
                          value={fields.displayName}
                          onChange={(e) => setFields({ ...fields, displayName: e.target.value })}
                          required
                          disabled={loading || oauthLoading !== ''}
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Field */}
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-10 h-10 text-sm"
                        placeholder="Enter your email"
                        value={fields.email}
                        onChange={(e) => setFields({ ...fields, email: e.target.value })}
                        required
                        disabled={loading || oauthLoading !== ''}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10 h-10 text-sm"
                        placeholder={isRegister ? "Create password (min. 8 chars)" : "Enter password"}
                        value={fields.password}
                        onChange={(e) => setFields({ ...fields, password: e.target.value })}
                        required
                        disabled={loading || oauthLoading !== ''}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading || oauthLoading !== ''}
                      >
                        {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>

                  {/* Confirm Password - Register Only */}
                  {isRegister && (
                    <div className="space-y-1">
                      <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type={showPassword ? "text" : "password"}
                          className="pl-10 h-10 text-sm"
                          placeholder="Confirm your password"
                          value={fields.confirmPassword}
                          onChange={(e) => setFields({ ...fields, confirmPassword: e.target.value })}
                          required
                          disabled={loading || oauthLoading !== ''}
                        />
                      </div>
                    </div>
                  )}

                  {/* Options */}
                  <div className="space-y-2 pt-2">
                    {!isRegister ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="remember"
                            checked={fields.rememberMe} 
                            onCheckedChange={(checked) => setFields({...fields, rememberMe: !!checked})} 
                            disabled={loading || oauthLoading !== ''}
                          />
                          <Label htmlFor="remember" className="text-sm">Remember me</Label>
                        </div>
                        <Link href="/auth/reset-password" className="text-sm text-primary hover:text-primary/80">
                          Forgot password?
                        </Link>
                      </div>
                    ) : (
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="terms"
                          checked={fields.acceptTerms}
                          onCheckedChange={(checked) => setFields({...fields, acceptTerms: !!checked})}
                          disabled={loading || oauthLoading !== ''}
                          className="mt-0.5"
                        />
                        <Label htmlFor="terms" className="text-xs leading-relaxed">
                          I agree to the{' '}
                          <Link href="/terms" className="text-primary hover:text-primary/80 underline">Terms</Link>
                          {' '}and{' '}
                          <Link href="/privacy" className="text-primary hover:text-primary/80 underline">Privacy Policy</Link>
                        </Label>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full h-10 font-semibold text-sm mt-4" 
                    disabled={loading || oauthLoading !== '' || (isRegister && !fields.acceptTerms)}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isRegister ? 'Creating...' : 'Signing In...'}
                      </>
                    ) : (
                      <>
                        {isRegister ? 'Create Account' : 'Sign In'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Footer Link */}
              <div className="text-center pt-3 mt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  {isRegister ? (
                    <>
                      Already have an account?{' '}
                      <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium underline">
                        Sign in
                      </Link>
                    </>
                  ) : (
                    <>
                      Don't have an account?{' '}
                      <Link href="/auth/register" className="text-primary hover:text-primary/80 font-medium underline">
                        Create one
                      </Link>
                    </>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        <WelcomePanel isRegister={isRegister} />
        
        <div className="lg:flex-1 max-w-2xl flex items-center justify-center p-8 xl:p-12">
          <div className="w-full max-w-lg">
            <Card className="shadow-2xl bg-card/90 backdrop-blur border">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-card-foreground mb-2">
                    {isRegister ? 'Create Account' : 'Welcome Back'}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    {isRegister 
                      ? 'Join CollabIDE to start coding together' 
                      : 'Sign in to your CollabIDE account'
                    }
                  </p>
                </div>

                <div className="mb-6">
                  <ModeToggle isRegister={isRegister} />
                </div>

                {/* OAuth Buttons */}
                {providers && (
                  <div className="space-y-3 mb-6">
                    {providers?.google && (
                      <Button
                        variant="outline"
                        className="w-full h-12 text-base font-medium"
                        onClick={() => handleOAuthSignIn('google')}
                        disabled={loading || oauthLoading !== ''}
                      >
                        {oauthLoading === 'google' ? (
                          <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        ) : (
                          <GoogleIcon />
                        )}
                        <span className="ml-3">Continue with Google</span>
                      </Button>
                    )}
                    
                    {providers?.github && (
                      <Button
                        variant="outline"
                        className="w-full h-12 text-base font-medium"
                        onClick={() => handleOAuthSignIn('github')}
                        disabled={loading || oauthLoading !== ''}
                      >
                        {oauthLoading === 'github' ? (
                          <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        ) : (
                          <Github className="w-5 h-5" />
                        )}
                        <span className="ml-3">Continue with GitHub</span>
                      </Button>
                    )}

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center text-sm uppercase">
                        <span className="bg-background px-3 text-muted-foreground font-medium">
                          or continue with email
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Desktop Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Field - Register Only */}
                  {isRegister && (
                    <div className="space-y-2">
                      <Label htmlFor="desktop-name" className="text-sm font-semibold">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="desktop-name"
                          type="text"
                          className="pl-12 h-12 text-base"
                          placeholder="Enter your full name"
                          value={fields.displayName}
                          onChange={(e) => setFields({ ...fields, displayName: e.target.value })}
                          required
                          disabled={loading || oauthLoading !== ''}
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="desktop-email" className="text-sm font-semibold">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="desktop-email"
                        type="email"
                        className="pl-12 h-12 text-base"
                        placeholder="Enter your email address"
                        value={fields.email}
                        onChange={(e) => setFields({ ...fields, email: e.target.value })}
                        required
                        disabled={loading || oauthLoading !== ''}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="desktop-password" className="text-sm font-semibold">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="desktop-password"
                        type={showPassword ? "text" : "password"}
                        className="pl-12 pr-12 h-12 text-base"
                        placeholder={isRegister ? "Create a secure password (min. 8 chars)" : "Enter your password"}
                        value={fields.password}
                        onChange={(e) => setFields({ ...fields, password: e.target.value })}
                        required
                        disabled={loading || oauthLoading !== ''}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading || oauthLoading !== ''}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Confirm Password - Register Only */}
                  {isRegister && (
                    <div className="space-y-2">
                      <Label htmlFor="desktop-confirm-password" className="text-sm font-semibold">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="desktop-confirm-password"
                          type={showPassword ? "text" : "password"}
                          className="pl-12 h-12 text-base"
                          placeholder="Confirm your password"
                          value={fields.confirmPassword}
                          onChange={(e) => setFields({ ...fields, confirmPassword: e.target.value })}
                          required
                          disabled={loading || oauthLoading !== ''}
                        />
                      </div>
                    </div>
                  )}

                  {/* Options */}
                  <div className="space-y-4 pt-2">
                    {!isRegister ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Checkbox 
                            id="desktop-remember"
                            checked={fields.rememberMe} 
                            onCheckedChange={(checked) => setFields({...fields, rememberMe: !!checked})} 
                            disabled={loading || oauthLoading !== ''}
                          />
                          <Label htmlFor="desktop-remember" className="text-sm font-medium">
                            Remember me
                          </Label>
                        </div>
                        <Link 
                          href="/auth/reset-password" 
                          className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    ) : (
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="desktop-terms"
                          checked={fields.acceptTerms}
                          onCheckedChange={(checked) => setFields({...fields, acceptTerms: !!checked})}
                          disabled={loading || oauthLoading !== ''}
                          className="mt-0.5"
                        />
                        <Label htmlFor="desktop-terms" className="text-sm leading-relaxed">
                          I agree to the{' '}
                          <Link href="/terms" className="text-primary hover:text-primary/80 underline font-medium">
                            Terms of Service
                          </Link>
                          {' '}and{' '}
                          <Link href="/privacy" className="text-primary hover:text-primary/80 underline font-medium">
                            Privacy Policy
                          </Link>
                        </Label>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full h-12 font-semibold text-base mt-6" 
                    disabled={loading || oauthLoading !== '' || (isRegister && !fields.acceptTerms)}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        {isRegister ? 'Creating Account...' : 'Signing In...'}
                      </>
                    ) : (
                      <>
                        {isRegister ? 'Create Account' : 'Sign In'}
                        <ArrowRight className="ml-3 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Footer Link */}
                <div className="text-center pt-6 border-t mt-6">
                  <p className="text-sm text-muted-foreground">
                    {isRegister ? (
                      <>
                        Already have an account?{' '}
                        <Link href="/auth/login" className="text-primary hover:text-primary/80 font-semibold underline transition-colors">
                          Sign in here
                        </Link>
                      </>
                    ) : (
                      <>
                        Don't have an account?{' '}
                        <Link href="/auth/register" className="text-primary hover:text-primary/80 font-semibold underline transition-colors">
                          Create one here
                        </Link>
                      </>
                    )}
                  </p>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Shield className="h-4 w-4 text-chart-2" />
                  <span className="text-xs text-muted-foreground">Secured with industry-standard encryption</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
