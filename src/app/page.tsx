
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
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
  Menu, // Added for mobile menu icon
  X, // Added for mobile menu close icon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Skip landing page when user is already signed-in
  useEffect(() => {
    if (!loading && user) router.push('/dashboard')
  }, [user, loading, router])
  
  // Effect to prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="loading-spinner w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-40 glass-effect border-b border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center space-x-2 interactive-hover rounded-lg px-2 py-1"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Code className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold gradient-text-static">
              CollabIDE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#demo"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Demo
            </Link>
            <Link
              href="#pricing"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/auth/login">
              <Button variant="outline" className="btn-base btn-outline">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="btn-base btn-primary">
                Get Started
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm md:hidden">
          <div className="flex flex-col items-center justify-center h-full">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 right-4"
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </Button>
            <nav className="flex flex-col items-center space-y-8 text-xl">
              <Link href="#features" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary transition-colors">Features</Link>
              <Link href="#demo" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary transition-colors">Demo</Link>
              <Link href="#pricing" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary transition-colors">Pricing</Link>
            </nav>
            <div className="mt-12 flex flex-col space-y-4 w-full px-8">
               <Link href="/auth/login" className="w-full">
                <Button variant="outline" className="w-full btn-base btn-outline text-lg" onClick={() => setIsMenuOpen(false)}>
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register" className="w-full">
                <Button className="w-full btn-base btn-primary text-lg" onClick={() => setIsMenuOpen(false)}>
                  Get Started
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ===== Hero ===== */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-accent-blue/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-accent-purple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          {/* Hero Content */}
          <div className="animate-fade-in text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Real-time collaborative coding
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
              Code together in <span className="gradient-text">real-time</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              CollabIDE empowers students and educators to build, learn, and ship 
              projects together — directly in the browser with zero setup required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center lg:justify-start">
              <Link href="/auth/register" className="w-full sm:w-auto">
                <Button size="lg" className="btn-base btn-primary btn-lg text-lg px-8 w-full sm:w-auto">
                  Start Coding Free
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button asChild variant="outline" size="lg" className="btn-base btn-outline btn-lg text-lg px-8 w-full sm:w-auto">
                <a href="#demo">
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Watch Demo
                </a>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-blue border-2 border-background" />
                  ))}
                </div>
                <span>10,000+ active users</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="status-online status-indicator" />
                <span>99.9% uptime</span>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="w-full aspect-[16/10] relative animate-slide-left">
            <div className="card-glass rounded-2xl overflow-hidden shadow-2xl">
              <div className="h-8 bg-card-elevated border-b border-border flex items-center px-4 gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <div className="w-3 h-3 rounded-full bg-success" />
                </div>
                <span className="text-xs text-muted-foreground ml-4 truncate">
                  CollabIDE - main.js
                </span>
              </div>
              
              <div className="bg-editor-background p-4 font-mono text-xs sm:text-sm">
                <div className="space-y-2">
                  <div className="flex">
                    <span className="text-muted-foreground w-8 text-right mr-4">1</span>
                    <span className="text-accent-blue">const</span>
                    <span className="text-foreground ml-2">message</span>
                    <span className="text-muted-foreground ml-2">=</span>
                    <span className="text-success ml-2">&apos;Hello, World!&apos;</span>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground w-8 text-right mr-4">2</span>
                    <span className="text-accent-cyan">console</span>
                    <span className="text-muted-foreground">.</span>
                    <span className="text-accent-yellow">log</span>
                    <span className="text-muted-foreground">(</span>
                    <span className="text-foreground">message</span>
                    <span className="text-muted-foreground">)</span>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground w-8 text-right mr-4">3</span>
                    <div className="collaborative-cursor user-bg-1 h-5 w-0.5" data-user-name="Alice" />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 card-glass rounded-lg p-3 text-xs sm:text-sm animate-bounce-in" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-2">
                <div className="status-online status-indicator" />
                <span>3 users online</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 card-glass rounded-lg p-3 text-xs sm:text-sm animate-bounce-in" style={{ animationDelay: '1.5s' }}>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span>Live chat active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Feature Grid ===== */}
      <section id="features" className="py-20 md:py-24 bg-card-elevated/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Everything you need for <span className="gradient-text">collaborative coding</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for classrooms, bootcamps, and remote teams with zero setup required.
              Start coding together in seconds.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Zap, title: 'Lightning Fast Sync', desc: 'Experience instant propagation of every keystroke across all participants with sub-50ms latency.', gradient: 'from-accent-blue to-primary' },
              { icon: Users, title: 'Unlimited Collaboration', desc: 'See live cursors, selections, and edits for everyone in your session, regardless of class size.', gradient: 'from-success to-accent-emerald' },
              { icon: Code, title: 'Smart Code Editor', desc: 'Full syntax highlighting, intelligent autocomplete, and error detection for 15+ programming languages.', gradient: 'from-accent-purple to-accent-pink' },
              { icon: Shield, title: 'Enterprise Security', desc: 'Role-based access control with optional session passwords and OAuth integration for safe learning.', gradient: 'from-accent-orange to-warning' },
              { icon: MessageSquare, title: 'Integrated Communication', desc: 'Built-in chat and commenting system to discuss code without losing context or switching apps.', gradient: 'from-destructive to-accent-pink' },
              { icon: Download, title: 'One-Click Export', desc: 'Bundle your entire collaborative project as a production-ready zip with documentation included.', gradient: 'from-accent-indigo to-primary' },
            ].map(({ icon: Icon, title, desc, gradient }, index) => (
              <Card key={title} className="card-interactive group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="text-center items-center pb-4">
                  <div className={`mx-auto mb-4 p-4 rounded-2xl w-fit bg-gradient-to-br ${gradient} shadow-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-muted-foreground leading-relaxed">
                    {desc}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Demo Section ===== */}
      <section id="demo" className="py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 md:mb-16">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-6">See CollabIDE in action</h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Watch how easy it is to start a collaborative coding session and work together in real-time.
                  </p>
              </div>
              <div className="relative max-w-4xl mx-auto">
                  <div className="card-glass rounded-2xl overflow-hidden shadow-2xl">
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent-blue/20 flex items-center justify-center">
                          <Button size="lg" className="btn-base btn-primary btn-lg">
                              <PlayCircle className="w-6 h-6 mr-2" />
                              Play Demo Video
                          </Button>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="py-20 md:py-24 bg-gradient-to-br from-primary via-accent-blue to-accent-purple relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        </div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
            Ready to revolutionize your coding workflow?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of students, educators, and developers who are already building amazing projects together with CollabIDE.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/register" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="btn-base btn-lg text-lg px-10 w-full sm:w-auto">
                Create Free Account
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <div className="text-white/80 text-sm mt-2 sm:mt-0">
              No credit card required • Free forever
            </div>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-card border-t border-border pt-16 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 md:grid-cols-4 lg:grid-cols-5 mb-12">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Code className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-semibold">CollabIDE</span>
              </div>
              <p className="text-muted-foreground max-w-md">
                Empowering collaborative learning through real-time code editing. Built for students by developers who value teamwork and innovation.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Github, href: '#', label: 'GitHub' },
                  { icon: Linkedin, href: '#', label: 'LinkedIn' },
                ].map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} className="w-10 h-10 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-200 flex items-center justify-center group" aria-label={label}>
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 md:col-span-2 lg:col-span-3 sm:grid-cols-3">
              {[
                  { heading: 'Product', links: [ { name: 'Features', href: '#features' }, { name: 'Demo', href: '#demo' }, { name: 'Pricing', href: '#pricing' }, { name: 'Documentation', href: '#' } ] },
                  { heading: 'Support', links: [ { name: 'Help Center', href: '#' }, { name: 'Contact Us', href: '#' }, { name: 'Privacy Policy', href: '#' }, { name: 'Terms of Service', href: '#' } ] },
                  { heading: 'Company', links: [ { name: 'About Us', href: '#' }, { name: 'Careers', href: '#' }, { name: 'Blog', href: '#' } ] },
              ].map(col => (
                <div key={col.heading}>
                  <h4 className="font-semibold mb-4">{col.heading}</h4>
                  <ul className="space-y-3">
                    {col.links.map(link => (
                      <li key={link.name}>
                        <a href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">{link.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground text-sm text-center md:text-left">
              © {new Date().getFullYear()} CollabIDE. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>Made with ❤️ for developers</span>
              <div className="hidden sm:flex items-center gap-1">
                <div className="status-online status-indicator" />
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}