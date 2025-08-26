'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  Zap
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

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  useEffect(() => {
    // Clear form when switching between login/register
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      if (isRegister) {
        // Register validation
        if (!fields.displayName.trim()) {
          throw new Error("Name is required")
        }
        if (fields.password !== fields.confirmPassword) {
          throw new Error("Passwords don't match")
        }
        if (fields.password.length < 8) {
          throw new Error("Password must be at least 8 characters")
        }
        if (!fields.acceptTerms) {
          throw new Error("Please accept the terms")
        }

        await register(fields.email, fields.password, fields.displayName.trim())
        router.push(`/auth/verify?email=${encodeURIComponent(fields.email)}`)
      } else {
        // Login validation
        if (!fields.email || !fields.password) {
          throw new Error("Email and password are required")
        }
        
        await login(fields.email, fields.password, fields.rememberMe)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-primary/10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl bg-accent/10 animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Main Content */}
      <div className="w-full max-w-md relative z-10">
        <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur">
          <CardHeader className="text-center space-y-4 pb-6">
            {/* Logo */}
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto shadow-lg">
              <Code className="w-6 h-6 text-primary-foreground" />
            </div>
            
            {/* Badge */}
            <Badge variant="outline" className="inline-flex items-center gap-2 px-4 py-2 mx-auto">
              <Zap className="w-4 h-4" />
              Real-time collaborative coding
            </Badge>

            {/* Title */}
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold">
                {isRegister ? 'Create Account' : 'Welcome Back'}
              </CardTitle>
              <CardDescription>
                {isRegister 
                  ? 'Join CollabIDE to start coding together' 
                  : 'Sign in to your CollabIDE account'
                }
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Toggle Buttons */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-lg">
              <Link href="/auth/login">
                <Button
                  variant={!isRegister ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-center"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  variant={isRegister ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-center"
                >
                  Sign Up
                </Button>
              </Link>
            </div>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field - Only for Register */}
              {isRegister && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      className="pl-10"
                      placeholder="Enter your full name"
                      value={fields.displayName}
                      onChange={(e) => setFields({ ...fields, displayName: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10"
                    placeholder="Enter your email"
                    value={fields.email}
                    onChange={(e) => setFields({ ...fields, email: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    placeholder={isRegister ? "Create a password (min. 8 chars)" : "Enter your password"}
                    value={fields.password}
                    onChange={(e) => setFields({ ...fields, password: e.target.value })}
                    required
                    disabled={loading}
                    minLength={isRegister ? 8 : undefined}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Confirm Password Field - Only for Register */}
              {isRegister && (
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      className={cn(
                        "pl-10",
                        fields.confirmPassword && fields.password !== fields.confirmPassword && "border-destructive focus:border-destructive"
                      )}
                      placeholder="Confirm your password"
                      value={fields.confirmPassword}
                      onChange={(e) => setFields({ ...fields, confirmPassword: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>
                  {fields.confirmPassword && fields.password !== fields.confirmPassword && (
                    <p className="text-sm text-destructive">Passwords don't match</p>
                  )}
                </div>
              )}

              {/* Remember Me - Only for Login */}
              {!isRegister && (
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember"
                      checked={fields.rememberMe} 
                      onCheckedChange={(checked) => setFields({...fields, rememberMe: !!checked })} 
                      disabled={loading}
                    />
                    <Label htmlFor="remember" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                  <Link 
                    href="/auth/reset-password" 
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              {/* Terms - Only for Register */}
              {isRegister && (
                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox
                    id="terms"
                    checked={fields.acceptTerms}
                    onCheckedChange={(checked) => setFields({...fields, acceptTerms: !!checked})}
                    disabled={loading}
                    className="mt-0.5"
                  />
                  <Label htmlFor="terms" className="text-sm leading-tight">
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary hover:text-primary/80 underline">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-primary hover:text-primary/80 underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-11 font-semibold mt-6" 
                disabled={loading || (isRegister && !fields.acceptTerms)}
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isRegister ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : (
                  <>
                    {isRegister ? 'Create Account' : 'Sign In'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Footer Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                {isRegister ? (
                  <>
                    Already have an account?{' '}
                    <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium underline">
                      Sign in here
                    </Link>
                  </>
                ) : (
                  <>
                    Don't have an account?{' '}
                    <Link href="/auth/register" className="text-primary hover:text-primary/80 font-medium underline">
                      Create one here
                    </Link>
                  </>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
