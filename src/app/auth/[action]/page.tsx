// app/auth/[action]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
  Heart
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
}

interface FormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>
  loading: boolean
  error: string
  fields: FormFields
  setFields: (fields: FormFields) => void
  showPassword: boolean
  toggleShowPassword: () => void
}

// Enhanced Sign Up Form with better UX
const SignUpForm = ({ onSubmit, loading, error, fields, setFields, showPassword, toggleShowPassword }: FormProps) => (
  <div className="w-full max-w-md mx-auto">
    <form onSubmit={onSubmit} className="space-y-6 animate-form-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-4 animate-float">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-card-foreground mb-2">Join CollabIDE</h1>
        <p className="text-muted-foreground">Create your account and start collaborating</p>
      </div>

      {error && (
        <Alert variant="destructive" className="animate-slide-up">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <div className="relative group">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input 
            className="pl-11 h-12 border-border/50 focus:border-primary transition-all duration-300" 
            id="displayName" 
            type="text" 
            placeholder="Display Name" 
            value={fields.displayName} 
            onChange={(e) => setFields({ ...fields, displayName: e.target.value })} 
            required 
            disabled={loading}
          />
        </div>

        <div className="relative group">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input 
            className="pl-11 h-12 border-border/50 focus:border-primary transition-all duration-300" 
            id="email-signup" 
            type="email" 
            placeholder="Email Address" 
            value={fields.email} 
            onChange={(e) => setFields({ ...fields, email: e.target.value })} 
            required 
            disabled={loading}
          />
        </div>

        <div className="relative group">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input 
            className="pl-11 pr-12 h-12 border-border/50 focus:border-primary transition-all duration-300" 
            id="password-signup" 
            type={showPassword ? "text" : "password"} 
            placeholder="Password" 
            value={fields.password} 
            onChange={(e) => setFields({ ...fields, password: e.target.value })} 
            required 
            disabled={loading}
          />
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 text-muted-foreground hover:text-foreground transition-colors" 
            onClick={toggleShowPassword}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </Button>
        </div>

        <div className="relative group">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input 
            className="pl-11 h-12 border-border/50 focus:border-primary transition-all duration-300" 
            id="confirmPassword" 
            type={showPassword ? "text" : "password"} 
            placeholder="Confirm Password" 
            value={fields.confirmPassword} 
            onChange={(e) => setFields({ ...fields, confirmPassword: e.target.value })} 
            required 
            disabled={loading}
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl" 
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Creating Account...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Create Account
          </>
        )}
      </Button>

      <div className="grid grid-cols-3 gap-4 text-center text-xs text-muted-foreground mt-6">
        <div className="flex flex-col items-center space-y-1">
          <Code2 className="h-4 w-4" />
          <span>Real-time Editing</span>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <Users className="h-4 w-4" />
          <span>Team Collaboration</span>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <Zap className="h-4 w-4" />
          <span>Instant Sync</span>
        </div>
      </div>
    </form>
  </div>
)

// Enhanced Sign In Form with better UX
const SignInForm = ({ onSubmit, loading, error, fields, setFields, showPassword, toggleShowPassword }: FormProps) => (
  <div className="w-full max-w-md mx-auto">
    <form onSubmit={onSubmit} className="space-y-6 animate-form-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-4 animate-float">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-card-foreground mb-2">Welcome Back</h1>
        <p className="text-muted-foreground">Sign in to your CollabIDE account</p>
      </div>

      {error && (
        <Alert variant="destructive" className="animate-slide-up">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="relative group">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input 
            className="pl-11 h-12 border-border/50 focus:border-primary transition-all duration-300" 
            id="email-signin" 
            type="email" 
            placeholder="Email Address" 
            value={fields.email} 
            onChange={(e) => setFields({ ...fields, email: e.target.value })} 
            required 
            disabled={loading}
          />
        </div>

        <div className="relative group">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input 
            className="pl-11 pr-12 h-12 border-border/50 focus:border-primary transition-all duration-300" 
            id="password-signin" 
            type={showPassword ? "text" : "password"} 
            placeholder="Password" 
            value={fields.password} 
            onChange={(e) => setFields({ ...fields, password: e.target.value })} 
            required 
            disabled={loading}
          />
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 text-muted-foreground hover:text-foreground transition-colors" 
            onClick={toggleShowPassword}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember" 
            checked={fields.rememberMe} 
            onCheckedChange={(checked) => setFields({...fields, rememberMe: !!checked })} 
          />
          <Label htmlFor="remember" className="font-normal text-sm text-muted-foreground cursor-pointer">
            Remember me
          </Label>
        </div>
        <Link 
          href="/auth/forgot-password" 
          className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
        >
          Forgot password?
        </Link>
      </div>

      <Button 
        type="submit" 
        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl" 
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Signing In...
          </>
        ) : (
          <>
            <Shield className="mr-2 h-5 w-5" />
            Sign In
          </>
        )}
      </Button>

      <div className="text-center text-xs text-muted-foreground mt-6">
        <div className="flex items-center justify-center space-x-1">
          <Heart className="h-3 w-3 text-red-500" />
          <span>Secure & trusted by developers worldwide</span>
        </div>
      </div>
    </form>
  </div>
)

// Main Auth Page Component
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
    rememberMe: false 
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) router.push('/dashboard')
  }, [user, router])

  useEffect(() => {
    const isRegister = params.action === 'register'
    if (isRegister !== isSignUpActive) setIsSignUpActive(isRegister)
    setError('')
  }, [params.action, isSignUpActive])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      if (isSignUpActive) {
        if (fields.password !== fields.confirmPassword) {
          throw new Error("Passwords do not match")
        }
        if (fields.password.length < 6) {
          throw new Error("Password must be at least 6 characters long")
        }
        await register(fields.email, fields.password, fields.displayName)
        router.push(`/auth/verify?email=${encodeURIComponent(fields.email)}`)
      } else {
        await login(fields.email, fields.password, fields.rememberMe)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }
  
  const handleSliderButtonClick = (mode: 'login' | 'register') => {
    router.push(`/auth/${mode}`)
  }

  const MobileForm = isSignUpActive ? SignUpForm : SignInForm

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 auth-bg">
      {/* Desktop Slider View */}
      <div className={cn(
        "hidden lg:flex container relative w-full max-w-5xl min-h-[700px] rounded-3xl overflow-hidden glass-card animate-fade-in-scale",
        { "right-panel-active": isSignUpActive }
      )}>
        {/* Sign Up Form Container */}
        <div className="form-container sign-up-container">
          <SignUpForm 
            onSubmit={handleSubmit}
            loading={loading}
            error={isSignUpActive ? error : ''}
            fields={fields}
            setFields={setFields}
            showPassword={showPassword}
            toggleShowPassword={() => setShowPassword(!showPassword)}
          />
        </div>

        {/* Sign In Form Container */}
        <div className="form-container sign-in-container">
          <SignInForm 
            onSubmit={handleSubmit}
            loading={loading}
            error={!isSignUpActive ? error : ''}
            fields={fields}
            setFields={setFields}
            showPassword={showPassword}
            toggleShowPassword={() => setShowPassword(!showPassword)}
          />
        </div>

        {/* Fixed Overlay Container with Proper Center Alignment */}
        <div className="overlay-container">
          <div className="overlay">
            {/* Welcome Back Panel (Left Side) */}
            <div className="overlay-panel overlay-left">
              <div className="flex flex-col items-center justify-center text-center w-full h-full px-8">
                <h1 className="panel-title text-center">Welcome Back!</h1>
                <p className="panel-description text-center">
                  Continue your coding journey with your existing account
                </p>
                <Button 
                  variant="outline" 
                  className="panel-button mx-auto" 
                  onClick={() => handleSliderButtonClick('login')}
                >
                  Sign In
                </Button>
              </div>
            </div>

            {/* Hello Developer Panel (Right Side) */}
            <div className="overlay-panel overlay-right">
              <div className="flex flex-col items-center justify-center text-center w-full h-full px-8">
                <h1 className="panel-title text-center">Hello, Developer!</h1>
                <p className="panel-description text-center">
                  Join thousands of developers collaborating in real-time
                </p>
                <Button 
                  variant="outline" 
                  className="panel-button mx-auto" 
                  onClick={() => handleSliderButtonClick('register')}
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile/Tablet Card View */}
      <div className="w-full max-w-md lg:hidden glass-card rounded-3xl p-8 animate-fade-in-scale">
        <MobileForm 
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          fields={fields}
          setFields={setFields}
          showPassword={showPassword}
          toggleShowPassword={() => setShowPassword(!showPassword)}
        />
        
        <div className="mt-8 pt-6 border-t border-border/50">
          <p className="text-center text-sm text-muted-foreground">
            {isSignUpActive ? "Already have an account? " : "Don't have an account? "}
            <Link 
              href={isSignUpActive ? "/auth/login" : "/auth/register"} 
              className="text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              {isSignUpActive ? "Sign In" : "Sign Up"}
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
