import { jwtVerify } from 'jose'

interface JWTPayload {
  userId: string
  email: string
  displayName: string
  iat?: number
  exp?: number
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export const verifyTokenEdge = async (token: string): Promise<JWTPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as JWTPayload
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}
