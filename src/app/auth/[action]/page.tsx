'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import HeroLogo from '@/components/ui/hero-logo'
import { 
  Loader2, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User,
  Sparkles,
  Code2,
  Users,
  Zap,
  Shield,
  Heart,
  ArrowRight,
  CheckCircle,
  Globe,
  Star,
  Rocket,
  Terminal
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// Form component interfaces
interface FormFields {
  email: string
  password: string
  displayName: string
  confirmPassword: string
  rememberMe: boolean
  acceptTerms: boolean
}

interface FormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>
  loading: boolean
  error: string
  fields: FormFields
  setFields: (fields: FormFields) => void
  showPassword: boolean
  toggleShowPassword: () => void
  idPrefix?: string
}

// Enhanced Sign Up Form with fixed logo
const SignUpForm = ({ 
  onSubmit, 
  loading, 
  error, 
  fields, 
  setFields, 
  showPassword, 
  toggleShowPassword,
  idPrefix = 'signup'
}: FormProps) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={onSubmit} className="space-y-6 animate-fade-in">
        {/* Header Section with Fixed HeroLogo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6 w-full">
            <div className="w-24 h-24 flex items-center justify-center">
              {/* */}
            </div>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-3">Join CollabIDE</h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-sm mx-auto">
            Create your account and start collaborating with developers worldwide
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="animate-slide-down">
            <AlertDescription className="text-center flex items-center justify-center gap-2">
              <Shield className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Form Fields */}
        <div className="space-y-5">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <User className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
            </div>
            <Input
              id={`${idPrefix}-displayName`}
              className="pl-12 h-14 text-base border-border/50 bg-card/50 backdrop-blur-sm focus:border-primary focus:bg-card transition-all duration-300 rounded-xl"
              placeholder="Display Name"
              value={fields.displayName}
              onChange={(e) => setFields({ ...fields, displayName: e.target.value })}
              required
              disabled={loading}
              autoComplete="name"
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <Mail className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
            </div>
            <Input
              id={`${idPrefix}-email`}
              className="pl-12 h-14 text-base border-border/50 bg-card/50 backdrop-blur-sm focus:border-primary focus:bg-card transition-all duration-300 rounded-xl"
              type="email"
              placeholder="Email Address"
              value={fields.email}
              onChange={(e) => setFields({ ...fields, email: e.target.value })}
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <Lock className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
            </div>
            <Input
              id={`${idPrefix}-password`}
              className="pl-12 pr-14 h-14 text-base border-border/50 bg-card/50 backdrop-blur-sm focus:border-primary focus:bg-card transition-all duration-300 rounded-xl"
              type={showPassword ? "text" : "password"}
              placeholder="Password (min. 8 characters)"
              value={fields.password}
              onChange={(e) => setFields({ ...fields, password: e.target.value })}
              required
              disabled={loading}
              minLength={8}
              autoComplete="new-password"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 text-muted-foreground hover:text-foreground transition-colors rounded-lg z-10"
              onClick={toggleShowPassword}
              disabled={loading}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </Button>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <Lock className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
            </div>
            <Input
              id={`${idPrefix}-confirmPassword`}
              className={cn(
                "pl-12 h-14 text-base border-border/50 bg-card/50 backdrop-blur-sm focus:border-primary focus:bg-card transition-all duration-300 rounded-xl",
                fields.confirmPassword && fields.password !== fields.confirmPassword && "border-destructive/50 focus:border-destructive"
              )}
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={fields.confirmPassword}
              onChange={(e) => setFields({ ...fields, confirmPassword: e.target.value })}
              required
              disabled={loading}
              autoComplete="new-password"
            />
          </div>
        </div>

        {/* Terms acceptance */}
        <div className="flex items-start space-x-3 pt-2">
          <Checkbox
            id={`${idPrefix}-terms`}
            checked={fields.acceptTerms}
            onCheckedChange={(checked) => setFields({...fields, acceptTerms: !!checked})}
            disabled={loading}
            className="mt-0.5 border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all duration-200"
          />
          <Label 
            htmlFor={`${idPrefix}-terms`}
            className="leading-relaxed text-sm cursor-pointer"
          >
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

        {/* Submit Button */}
        <Button 
          type="submit" 
          size="lg"
          className="w-full h-14 text-base font-semibold bg-gradient-to-r from-primary via-accent-purple to-accent-blue hover:from-primary/90 hover:via-accent-purple/90 hover:to-accent-blue/90 transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl group disabled:opacity-50" 
          disabled={loading || !fields.acceptTerms}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              <span>Creating Account...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Sparkles className="mr-3 h-5 w-5 group-hover:rotate-180 transition-transform duration-300" />
              <span>Create Account</span>
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          )}
        </Button>

        {/* Features Grid */}
        <div className="mt-6 p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-border/30">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { icon: Code2, label: 'Real-time Editing', color: 'text-accent-blue' },
              { icon: Users, label: 'Team Collaboration', color: 'text-accent-emerald' },
              { icon: Zap, label: 'Instant Sync', color: 'text-accent-yellow' }
            ].map(({ icon: Icon, label, color }, index) => (
              <div 
                key={label}
                className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-accent/20 transition-all duration-300 animate-fade-in group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon className={`h-5 w-5 ${color} group-hover:scale-110 transition-transform duration-200`} />
                <span className="text-xs text-muted-foreground font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center pt-4 border-t border-border/30">
          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
            <Shield className="h-4 w-4 text-success animate-pulse-subtle" />
            <span>256-bit SSL encryption</span>
            <span>•</span>
            <CheckCircle className="h-4 w-4 text-success animate-pulse-subtle" />
            <span>GDPR compliant</span>
          </div>
        </div>
      </form>
    </div>
  )
}

// Enhanced Sign In Form with fixed logo
const SignInForm = ({ 
  onSubmit, 
  loading, 
  error, 
  fields, 
  setFields, 
  showPassword, 
  toggleShowPassword,
  idPrefix = 'signin'
}: FormProps) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={onSubmit} className="space-y-6 animate-fade-in">
        {/* Header Section with Fixed Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6 w-full">
            <div className="w-24 h-24 flex items-center justify-center">
              <HeroLogo 
                size="lg" 
                variant="compact" 
                className="animate-float max-w-full max-h-full object-contain" 
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-3">Welcome Back</h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-sm mx-auto">
            Sign in to your CollabIDE account and resume your projects
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="animate-slide-down">
            <AlertDescription className="text-center flex items-center justify-center gap-2">
              <Shield className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </AlertDescription>
          </Alert>
        )}

        {/* Form Fields */}
        <div className="space-y-5">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <Mail className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
            </div>
            <Input
              id={`${idPrefix}-email`}
              className="pl-12 h-14 text-base border-border/50 bg-card/50 backdrop-blur-sm focus:border-primary focus:bg-card transition-all duration-300 rounded-xl"
              type="email"
              placeholder="Email Address"
              value={fields.email}
              onChange={(e) => setFields({ ...fields, email: e.target.value })}
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <Lock className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
            </div>
            <Input
              id={`${idPrefix}-password`}
              className="pl-12 pr-14 h-14 text-base border-border/50 bg-card/50 backdrop-blur-sm focus:border-primary focus:bg-card transition-all duration-300 rounded-xl"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={fields.password}
              onChange={(e) => setFields({ ...fields, password: e.target.value })}
              required
              disabled={loading}
              autoComplete="current-password"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 text-muted-foreground hover:text-foreground transition-colors rounded-lg z-10"
              onClick={toggleShowPassword}
              disabled={loading}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-3">
            <Checkbox 
              id={`${idPrefix}-remember`}
              checked={fields.rememberMe} 
              onCheckedChange={(checked) => setFields({...fields, rememberMe: !!checked })} 
              disabled={loading}
              className="border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label 
              htmlFor={`${idPrefix}-remember`}
              className="text-sm cursor-pointer font-medium"
            >
              Remember me
            </Label>
          </div>
          <Link 
            href="/auth/reset-password" 
            className="text-sm text-primary hover:text-primary/80 transition-colors font-medium hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          size="lg"
          className="w-full h-14 text-base font-semibold bg-gradient-to-r from-accent-blue via-primary to-accent-cyan hover:from-accent-blue/90 hover:via-primary/90 hover:to-accent-cyan/90 transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl group" 
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              <span>Signing In...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Shield className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              <span>Sign In</span>
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          )}
        </Button>

        {/* Social Proof */}
        <div className="mt-6 p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-border/30">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mb-3">
              <Heart className="h-4 w-4 text-red-500 animate-pulse-subtle" />
              <span>Trusted by 50,000+ developers worldwide</span>
            </div>
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse-subtle" />
                <span className="text-xs text-muted-foreground">99.9% uptime</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Global CDN</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-accent-yellow fill-current" />
                <span className="text-xs text-muted-foreground">4.9/5 rating</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

// Main Auth Page Component with fixes
export default function AuthPage() {
  const params = useParams()
  const router = useRouter()
  const { login, register, user } = useAuth() || { 
    login: async () => {}, 
    register: async () => {}, 
    user: null 
  }

  const [isSignUpActive, setIsSignUpActive] = useState(params.action === 'register')
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

  // Simple toast replacement
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    console.log(`${type.toUpperCase()}: ${message}`)
  }

  useEffect(() => {
    if (user) {
      showToast("Welcome back! You've been successfully signed in.", 'success')
      router.push('/dashboard')
    }
  }, [user, router])

  useEffect(() => {
    const isRegister = params.action === 'register'
    if (isRegister !== isSignUpActive) setIsSignUpActive(isRegister)
    setError('')
    setFields({ 
      email: '', 
      password: '', 
      displayName: '', 
      confirmPassword: '', 
      rememberMe: false,
      acceptTerms: false
    })
  }, [params.action, isSignUpActive])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      if (isSignUpActive) {
        // Enhanced validation
        if (!fields.displayName.trim()) {
          throw new Error("Display name is required")
        }
        if (fields.displayName.trim().length < 2) {
          throw new Error("Display name must be at least 2 characters long")
        }
        if (fields.password !== fields.confirmPassword) {
          throw new Error("Passwords do not match")
        }
        if (fields.password.length < 8) {
          throw new Error("Password must be at least 8 characters long")
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(fields.password)) {
          throw new Error("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
        }
        if (!fields.acceptTerms) {
          throw new Error("You must accept the Terms of Service and Privacy Policy")
        }

        await register(fields.email, fields.password, fields.displayName.trim())
        
        showToast("Account created successfully! Please check your email to verify your account.", 'success')
        router.push(`/auth/verify?email=${encodeURIComponent(fields.email)}`)
      } else {
        await login(fields.email, fields.password, fields.rememberMe)
        showToast("Welcome back! You've been successfully signed in.", 'success')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }
  
  const handleSliderButtonClick = (mode: 'login' | 'register') => {
    router.push(`/auth/${mode}`)
  }

  // Desktop Slider Overlay Panels
  const WelcomeBackPanel = () => (
    <div className="overlay-panel overlay-left items-center">
      <div className="flex flex-col items-center justify-center text-center w-full h-full px-12">
        <div className="mb-8 flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-6 backdrop-blur-sm animate-float">
            <Terminal className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="panel-title text-center mb-4 w-full flex justify-center">
          Welcome Back, Developer!
        </h1>
        <p className="panel-description text-center mb-8 w-full flex justify-center">
          <span className="max-w-xs mx-auto">
            Continue your coding journey and rejoin your collaborative projects with your team
          </span>
        </p>
       
        <div className="flex justify-center w-full">
  <Button 
    variant="outline" 
    size="lg"
    className="panel-button bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
    onClick={() => handleSliderButtonClick('login')}
    disabled={loading}
  >
    <span className="flex items-center gap-2">
    <Sparkles className="h-4 w-4" />
      Sign In
      <ArrowRight />
    </span>
  </Button>
</div>

      </div>
    </div>
  )

  const HelloDeveloperPanel = () => (
    <div className="overlay-panel overlay-right">
      <div className="flex flex-col items-center justify-center text-center w-full h-full px-12">
        <div className="mb-8 flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-6 backdrop-blur-sm animate-float">
            <Rocket className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="panel-title text-center mb-4 w-full flex justify-center">
          Hello, Future Collaborator!
        </h1>
        <p className="panel-description text-center mb-8 w-full flex justify-center">
          <span className="max-w-xs mx-auto">
            Join thousands of developers collaborating in real-time and building amazing projects together
          </span>
        </p>
        <div className="flex justify-center w-full">
  <Button 
    variant="outline" 
    size="lg"
    className="panel-button bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
    onClick={() => handleSliderButtonClick('register')}
    disabled={loading}
  >
    <span className="flex items-center gap-2">
      <Sparkles className="h-4 w-4" />
      Sign Up
      <ArrowRight className="h-4 w-4" />
    </span>
  </Button>
</div>

      </div>
    </div>
  )

  const MobileForm = isSignUpActive ? SignUpForm : SignInForm

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 auth-bg">
      {/* Desktop Slider View */}
      <div className={cn(
        "hidden lg:flex container relative w-full max-w-6xl min-h-[800px] rounded-3xl overflow-hidden auth-glass-card animate-fade-in-scale shadow-2xl",
        { "right-panel-active": isSignUpActive }
      )}>
        {/* Sign Up Form Container */}
        <div className="form-container sign-up-container">
          <div className="flex items-center justify-center h-full w-full px-8">
            <SignUpForm 
              onSubmit={handleSubmit}
              loading={loading}
              error={isSignUpActive ? error : ''}
              fields={fields}
              setFields={setFields}
              showPassword={showPassword}
              toggleShowPassword={() => setShowPassword(!showPassword)}
              idPrefix="desktop-signup"
            />
          </div>
        </div>

        {/* Sign In Form Container */}
        <div className="form-container sign-in-container">
          <div className="flex items-center justify-center h-full w-full px-8">
            <SignInForm 
              onSubmit={handleSubmit}
              loading={loading}
              error={!isSignUpActive ? error : ''}
              fields={fields}
              setFields={setFields}
              showPassword={showPassword}
              toggleShowPassword={() => setShowPassword(!showPassword)}
              idPrefix="desktop-signin"
            />
          </div>
        </div>

        {/* Enhanced Overlay Container */}
        <div className="overlay-container">
          <div className="overlay">
            <WelcomeBackPanel />
            <HelloDeveloperPanel />
          </div>
        </div>
      </div>
      
      {/* Mobile/Tablet View with Fixed Logo and Buttons */}
      <div className="w-full max-w-lg lg:hidden">
        <div className="rounded-3xl p-8 auth-glass-card animate-fade-in-scale shadow-2xl">
          {/* Fixed Mobile Logo */}
          <div className="flex justify-center mb-6 w-full">
            <div className="w-20 h-20 flex items-center justify-center">
              <HeroLogo 
                size="md" 
                variant="full" 
                className="animate-float max-w-full max-h-full object-contain"
              />
            </div>
          </div>
          
          {/* Fixed Mobile Button Toggle */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex p-1 bg-muted/50 rounded-lg backdrop-blur-sm w-full max-w-sm">
              <Button
                variant={!isSignUpActive ? "default" : "ghost"}
                size="default"
                onClick={() => router.push('/auth/login')}
                className="rounded-md flex-1 h-10 text-sm font-medium"
                disabled={loading}
              >
                <Shield className="mr-2 h-4 w-4" />
                Sign In
              </Button>
              <Button
                variant={isSignUpActive ? "default" : "ghost"}
                size="default"
                onClick={() => router.push('/auth/register')}
                className="rounded-md flex-1 h-10 text-sm font-medium"
                disabled={loading}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Sign Up
              </Button>
            </div>
          </div>
          
          <MobileForm 
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            fields={fields}
            setFields={setFields}
            showPassword={showPassword}
            toggleShowPassword={() => setShowPassword(!showPassword)}
            idPrefix="mobile"
          />
        </div>
      </div>
    </main>
  )
}
