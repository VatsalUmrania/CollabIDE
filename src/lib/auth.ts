import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'
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
    expiresIn: '1h' // Increased from 15m to 1h for better UX
  })
  
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '30d' // Increased from 7d to 30d
  })
  
  return { accessToken, refreshToken }
}

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.log('⏰ Access token expired at:', error.expiredAt)
    } else {
      console.error('❌ Token verification failed:', error)
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

export const getUserFromRequest = async (request: NextRequest) => {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  
  if (!token) {
    console.log('❌ No token in request')
    return null
  }
  
  const payload = verifyToken(token)
  if (!payload) {
    console.log('❌ Invalid token payload')
    return null
  }
  
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      displayName: true,
      isVerified: true
    }
  })
  
  if (!user) {
    console.log('❌ User not found in database')
    return null
  }
  
  console.log('✅ User authenticated:', user.displayName)
  return user
}

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
