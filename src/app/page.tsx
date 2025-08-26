'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import {
  Code,
  Users,
  Zap,
  Shield,
  Download,
  MessageSquare,
  PlayCircle,
  Github,
  Twitter,
  Linkedin,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Skip landing page when user is already signed-in
  useEffect(() => {
    if (!loading && user) router.push('/dashboard')
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Code className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              CollabIDE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#demo"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Demo
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Pricing
            </Link>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">
                Get Started
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-6 mt-6">
                <nav className="flex flex-col space-y-4">
                  <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                    Features
                  </Link>
                  <Link href="#demo" className="text-sm font-medium hover:text-primary transition-colors">
                    Demo
                  </Link>
                  <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                    Pricing
                  </Link>
                </nav>
                <div className="flex flex-col space-y-3">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/auth/register">
                      Get Started
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Hero Section - PROPERLY CENTERED */}
      <section className="relative flex-1 flex items-center justify-center py-16 md:py-24 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-primary/10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl bg-accent/10 animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* MAIN CONTAINER - CENTERED */}
        <div className="container mx-auto px-4 flex items-center justify-center min-h-[70vh]">
          <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
            {/* Hero Content - LEFT COLUMN */}
            <div className="flex-1 w-full max-w-2xl flex flex-col items-center lg:items-start justify-center text-center lg:text-left space-y-8">
              <div className="flex justify-center lg:justify-start w-full">
                <Badge variant="outline" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium">
                  <Zap className="w-4 h-4 text-primary" />
                  Real-time collaborative coding
                </Badge>
              </div>
              
              <div className="space-y-6 w-full">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
                  Code together in{' '}
                  <span className="bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
                    real-time
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  CollabIDE empowers students and educators to build, learn, and ship 
                  projects together — directly in the browser with zero setup required.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full">
                <Button size="lg" className="h-12 px-8 text-lg font-semibold" asChild>
                  <Link href="/auth/register">
                    <span className="flex items-center gap-2">
                      Start Coding Free
                      <ChevronRight className="w-5 h-5" />
                    </span>
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-8 text-lg" asChild>
                  <Link href="#demo">
                    <span className="flex items-center gap-2">
                      <PlayCircle className="w-5 h-5" />
                      Watch Demo
                    </span>
                  </Link>
                </Button>
              </div>

              {/* Social Proof */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4 w-full">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[
                      'bg-gradient-to-r from-blue-500 to-purple-500',
                      'bg-gradient-to-r from-green-500 to-blue-500', 
                      'bg-gradient-to-r from-purple-500 to-pink-500'
                    ].map((gradient, i) => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 border-background ${gradient}`} />
                    ))}
                  </div>
                  <span className="text-muted-foreground font-medium">10,000+ active users</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-muted-foreground font-medium">99.9% uptime</span>
                </div>
              </div>
            </div>

            {/* Hero Visual - RIGHT COLUMN - PERFECTLY CENTERED */}
            <div className="flex-1 w-full max-w-lg flex items-center justify-center">
              <div className="relative w-full max-w-md">
                <Card className="overflow-hidden shadow-2xl border bg-card w-full">
                  {/* Editor Header */}
                  <div className="h-12 bg-muted/30 border-b flex items-center px-4 gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-sm text-muted-foreground font-mono ml-2">
                      CollabIDE - main.js
                    </span>
                    <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span>Saved</span>
                    </div>
                  </div>
                  
                  {/* Code Content */}
                  <div className="bg-background/80 backdrop-blur p-6 font-mono text-sm">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="text-muted-foreground w-8 text-right mr-4 select-none">1</span>
                        <span className="text-violet-400 font-medium">const</span>
                        <span className="ml-2 text-foreground">message</span>
                        <span className="text-muted-foreground ml-2">=</span>
                        <span className="text-emerald-400 ml-2">'Hello, World!'</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-muted-foreground w-8 text-right mr-4 select-none">2</span>
                        <span className="text-blue-400 font-medium">console</span>
                        <span className="text-muted-foreground">.</span>
                        <span className="text-yellow-400 font-medium">log</span>
                        <span className="text-muted-foreground">(</span>
                        <span className="text-foreground">message</span>
                        <span className="text-muted-foreground">)</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-muted-foreground w-8 text-right mr-4 select-none">3</span>
                        <div className="w-0.5 h-5 bg-primary animate-pulse" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Output Section */}
                  <div className="bg-muted/20 border-t px-6 py-3 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Output: Hello, World!</span>
                    </div>
                  </div>
                </Card>

                {/* Floating Indicators */}
                <div className="absolute -top-3 -right-3">
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20 shadow-lg">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                    3 users online
                  </Badge>
                </div>
                
                <div className="absolute -bottom-3 -left-3">
                  <Badge className="bg-primary/10 text-primary border-primary/20 shadow-lg">
                    <MessageSquare className="w-3 h-3 mr-2" />
                    Live chat active
                  </Badge>
                </div>

                {/* Collaboration Cursors */}
                <div className="absolute top-20 left-32 flex items-center gap-1">
                  <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm" />
                  <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded shadow-sm">Alex</span>
                </div>
                
                <div className="absolute top-28 left-40 flex items-center gap-1">
                  <div className="w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-sm" />
                  <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded shadow-sm">Sarah</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Everything you need for{' '}
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                collaborative coding
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for classrooms, bootcamps, and remote teams with zero setup required.
              Start coding together in seconds.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {[
              {
                icon: Zap,
                title: 'Lightning Fast Sync',
                description: 'Experience instant propagation of every keystroke across all participants with sub-50ms latency.',
                gradient: 'from-yellow-500 to-orange-500'
              },
              {
                icon: Users,
                title: 'Unlimited Collaboration',
                description: 'See live cursors, selections, and edits for everyone in your session, regardless of class size.',
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                icon: Code,
                title: 'Smart Code Editor',
                description: 'Full syntax highlighting, intelligent autocomplete, and error detection for 15+ programming languages.',
                gradient: 'from-blue-500 to-purple-500'
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                description: 'Role-based access control with optional session passwords and OAuth integration for safe learning.',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                icon: MessageSquare,
                title: 'Integrated Communication',
                description: 'Built-in chat and commenting system to discuss code without losing context or switching apps.',
                gradient: 'from-pink-500 to-red-500'
              },
              {
                icon: Download,
                title: 'One-Click Export',
                description: 'Bundle your entire collaborative project as a production-ready zip with documentation included.',
                gradient: 'from-indigo-500 to-blue-500'
              },
            ].map((feature, index) => (
              <Card key={feature.title} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-none bg-background/60 backdrop-blur text-center">
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto mb-4 p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">See CollabIDE in action</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Watch how easy it is to start a collaborative coding session and work together in real-time.
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <Card className="overflow-hidden shadow-2xl">
              <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-primary/20 via-purple-500/10 to-accent/20 relative">
                <div className="absolute inset-0 bg-grid-white/10" />
                <Button size="lg" className="relative z-10 h-16 px-10 text-lg font-semibold shadow-xl">
                  <PlayCircle className="w-8 h-8 mr-3" />
                  Play Demo Video
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="container mx-auto px-4 relative text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to revolutionize your coding workflow?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of students, educators, and developers who are already building amazing projects together with CollabIDE.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-semibold" asChild>
                <Link href="/auth/register">
                  Create Free Account
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <div className="text-sm opacity-80">
                No credit card required • Free forever
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-5 mb-12">
              <div className="lg:col-span-2 space-y-4 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <Code className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-semibold">CollabIDE</span>
                </div>
                <p className="text-muted-foreground max-w-md mx-auto lg:mx-0">
                  Empowering collaborative learning through real-time code editing. Built for students by developers who value teamwork and innovation.
                </p>
                <div className="flex space-x-4 justify-center lg:justify-start">
                  <Button variant="ghost" size="icon" asChild>
                    <a href="https://github.com/vatsalumrania/collabide" aria-label="GitHub">
                      <Github className="w-5 h-5" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a href="#" aria-label="Twitter">
                      <Twitter className="w-5 h-5" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a href="#" aria-label="LinkedIn">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8 lg:col-span-3 sm:grid-cols-3">
                {[
                  {
                    heading: 'Product',
                    links: [
                      { name: 'Features', href: '#features' },
                      { name: 'Demo', href: '#demo' },
                      { name: 'Pricing', href: '#pricing' },
                      { name: 'Documentation', href: '#' },
                    ],
                  },
                  {
                    heading: 'Support',
                    links: [
                      { name: 'Help Center', href: '#' },
                      { name: 'Contact Us', href: '#' },
                      { name: 'Privacy Policy', href: '#' },
                      { name: 'Terms of Service', href: '#' },
                    ],
                  },
                  {
                    heading: 'Company',
                    links: [
                      { name: 'About Us', href: '#' },
                      { name: 'Careers', href: '#' },
                      { name: 'Blog', href: '#' },
                    ],
                  },
                ].map((col) => (
                  <div key={col.heading} className="text-center lg:text-left">
                    <h4 className="font-semibold mb-4">{col.heading}</h4>
                    <ul className="space-y-3">
                      {col.links.map((link) => (
                        <li key={link.name}>
                          <a
                            href={link.href}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {link.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} CollabIDE. All rights reserved.
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span>Made with ❤️ for developers</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span>All systems operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
