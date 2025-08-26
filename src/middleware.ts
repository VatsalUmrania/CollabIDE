import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

// Edge-compatible JWT verification
async function verifyTokenEdge(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { userId: string; email: string; displayName: string }
  } catch (error) {
    console.log('🔒 Edge token verification failed:', error instanceof Error ? error.message : 'Unknown error')
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log('🔍 Middleware processing:', pathname)

  // Skip middleware for static files and certain paths
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/api/socket')
  ) {
    return NextResponse.next()
  }

  // Define public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/verify',
    '/auth/reset-password'
  ]

  // Define public API routes
  const publicApiRoutes = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/verify',
    '/api/auth/reset-password',
    '/api/auth/resend-verification',
    '/api/auth/refresh',
    '/api/auth/me'
  ]

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    console.log('✅ Public route, allowing:', pathname)
    return NextResponse.next()
  }

  if (publicApiRoutes.some(route => pathname.startsWith(route))) {
    console.log('✅ Public API route, allowing:', pathname)
    return NextResponse.next()
  }

  // For development, skip auth check but log it
  if (process.env.NODE_ENV === 'development') {
    console.log('🚧 Development mode, allowing:', pathname)
    return NextResponse.next()
  }

  // Check for authentication token for protected routes
  const authHeader = request.headers.get('authorization')
  const cookieToken = request.cookies.get('accessToken')?.value
  const token = authHeader?.replace('Bearer ', '') || cookieToken

  if (!token) {
    console.log('❌ No token found for protected route')
    // For page routes, redirect to login
    if (!pathname.startsWith('/api/')) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // For API routes, return 401
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  // Verify token using edge-safe method
  const payload = await verifyTokenEdge(token)
  
  if (!payload) {
    console.log('❌ Invalid token for protected route')
    // For page routes, redirect to login with error
    if (!pathname.startsWith('/api/')) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      loginUrl.searchParams.set('error', 'session_expired')
      return NextResponse.redirect(loginUrl)
    }
    
    // For API routes, return 401
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    )
  }

  console.log('✅ Token valid for user:', payload.displayName)
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
