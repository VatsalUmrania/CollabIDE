import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from './db'

interface JWTPayload {
  userId: string
  email: string
  displayName: string
  iat?: number
  exp?: number
}

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12)
}

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}

export const generateTokens = (payload: { userId: string; email: string; displayName: string }) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '1h'
  })
  
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '30d'
  })
  
  return { accessToken, refreshToken }
}

export const verifyToken = (token: string): JWTPayload | null => {
  if (!token) {
    return null
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.log('⏰ Access token expired at:', error.expiredAt)
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.log('❌ Custom JWT verification failed:', error.message)
    }
    return null
  }
}

export const verifyRefreshToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JWTPayload
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.log('⏰ Refresh token expired at:', error.expiredAt)
    } else {
      console.error('❌ Refresh token verification failed:', error)
    }
    return null
  }
}

// Enhanced function to handle both custom JWT and NextAuth sessions
export const getUserFromRequest = async (request: NextRequest) => {
  // Try custom JWT authentication first
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    const payload = verifyToken(token)
    
    if (payload) {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          displayName: true,
          isVerified: true
        }
      })
      
      if (user) {
        console.log('✅ Custom auth user authenticated:', user.displayName)
        return user
      }
    }
  }

  // Fallback to NextAuth session for OAuth users
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.id) {
      console.log('✅ OAuth user authenticated:', session.user.displayName || session.user.name)
      return {
        id: session.user.id,
        email: session.user.email,
        displayName: session.user.displayName || session.user.name,
        isVerified: true // OAuth users are pre-verified
      }
    }
  } catch (error) {
    console.log('❌ NextAuth session check failed:', error)
  }

  console.log('❌ No valid authentication found')
  return null
}

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
