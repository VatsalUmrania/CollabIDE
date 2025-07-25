'use client'

import { useEffect } from 'react'
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Logo from '@/components/ui/logo'
export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Skip landing page when user is already signed-in
  useEffect(() => {
    if (!loading && user) router.push('/dashboard')
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  /* ----------  Page ---------- */
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900">
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-2">
            {/* Replace /logo.svg with your real asset */}
            <Image
              src="./logo.svg"
              alt="CollabIDE logo"
              width={32}
              height={32}
              priority
            />
            <span className="text-2xl font-bold text-blue-600">CollabIDE</span>
          </Link>

          <div className="hidden sm:flex items-center space-x-3">
            <Link href="/auth/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="relative isolate overflow-hidden">
        {/* decorative blob */}
        <div className="absolute inset-0 -z-10 blur-3xl">
          <div className="aspect-[4/3] w-full bg-gradient-to-tr from-indigo-300 to-blue-300 opacity-30 rounded-full translate-x-1/4 -translate-y-1/3" />
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center py-24 px-4 sm:px-6 lg:px-8">
          {/* Copy */}
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Code together in <span className="text-blue-600">real-time</span>
            </h1>
            <p className="text-lg text-gray-700 mb-10 max-w-xl">
              CollabIDE lets you and your classmates build, learn and ship
              projects side-by-side — directly in the browser.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-max">
              <Link href="/auth/register">
                <Button size="lg" className="text-lg px-8">
                  Start Coding
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8"
                asChild
              >
                <a href="#features">
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Watch Demo
                </a>
              </Button>
            </div>
          </div>

          {/* Mock-up / hero image */}
          <div className="w-full aspect-[16/10] relative drop-shadow-xl rounded-xl overflow-hidden">
            {/* Swap with a real screenshot */}
            <Image
              src="/screens/hero-editor.png"
              alt="CollabIDE editor screenshot"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ===== Feature Grid ===== */}
      <section
        id="features"
        className="pt-20 pb-24 bg-white rounded-t-3xl shadow-inner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Everything you need for collaborative coding
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built for classrooms, boot-camps and remote teams with zero setup.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Zap,
                title: 'Live Sync',
                desc: 'Instant propagation of every keystroke across all participants.',
                color: 'bg-blue-100 text-blue-600',
              },
              {
                icon: Users,
                title: 'Unlimited Participants',
                desc: 'See cursors & selections for everyone, regardless of class size.',
                color: 'bg-green-100 text-green-600',
              },
              {
                icon: Code,
                title: 'Smart Editor',
                desc: 'Syntax highlight & lint for 15+ languages (HTML, JS, Python, C++, …).',
                color: 'bg-purple-100 text-purple-600',
              },
              {
                icon: Shield,
                title: 'Secure Sessions',
                desc: 'Role-based access with optional passwords and OAuth sign-in.',
                color: 'bg-orange-100 text-orange-600',
              },
              {
                icon: MessageSquare,
                title: 'Integrated Chat',
                desc: 'Discuss snippets or give feedback without context-switching.',
                color: 'bg-red-100 text-red-600',
              },
              {
                icon: Download,
                title: 'One-click Export',
                desc: 'Bundle the entire project as a ready-to-run zip including README.',
                color: 'bg-indigo-100 text-indigo-600',
              },
            ].map(({ icon: Icon, title, desc, color }) => (
              <Card
                key={title}
                className="group transition-transform hover:-translate-y-1"
              >
                <CardHeader className="text-center">
                  <div
                    className={`mx-auto mb-4 p-3 rounded-full w-fit ${color}`}
                  >
                    <Icon className="h-8 w-8" />
                  </div>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="min-h-[72px] text-center">
                    {desc}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 bg-blue-600 text-center text-white px-4">
        <h2 className="text-3xl font-bold mb-4">
          Ready to start collaborating?
        </h2>
        <p className="text-lg text-blue-100 mb-8">
          Join thousands of learners and pros already shipping with CollabIDE.
        </p>
        <Link href="/auth/register">
          <Button size="lg" variant="secondary" className="text-lg px-10">
            Create free account
          </Button>
        </Link>
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-gray-900 text-gray-400 pt-16 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <Image src="/logo.svg" alt="logo" width={28} height={28} />
              <span className="text-xl font-semibold text-white">
                CollabIDE
              </span>
            </div>
            <p>
              Empowering collaborative learning through real-time code editing.
              Built for students by developers who value teamwork.
            </p>
          </div>

          {[
            { heading: 'Product', links: ['Features', 'Pricing', 'Docs'] },
            { heading: 'Support', links: ['Help Center', 'Contact', 'Privacy'] },
          ].map(col => (
            <div key={col.heading}>
              <h4 className="text-white font-semibold mb-4">{col.heading}</h4>
              <ul className="space-y-2">
                {col.links.map(text => (
                  <li key={text}>
                    <a href="#" className="hover:text-white">
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {['twitter', 'github', 'linkedin'].map(net => (
                <a
                  key={net}
                  href="#"
                  className="w-9 h-9 rounded-full bg-gray-700 hover:bg-blue-600 grid place-content-center"
                  aria-label={net}
                >
                  <Image
                    src={`/icons/${net}.svg`}
                    alt={net}
                    width={16}
                    height={16}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 text-center">
          © {new Date().getFullYear()} CollabIDE. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
