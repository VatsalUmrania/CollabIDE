import NextAuth from "next-auth"
import { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import type { Adapter } from "next-auth/adapters"

const prisma = new PrismaClient()

// Custom adapter that handles displayName mapping
function CustomPrismaAdapter(p: PrismaClient): Adapter {
  const adapter = PrismaAdapter(p)
  
  return {
    ...adapter,
    async createUser(user) {
      console.log('📝 Creating user with data:', user)
      
      const userData = {
        id: user.id,
        email: user.email!,
        displayName: user.name || user.email?.split('@')[0] || 'User',
        image: user.image,
        emailVerified: user.emailVerified,
        password: '', // Empty for OAuth users
        isVerified: true, // OAuth users are pre-verified
      }
      
      console.log('💾 Storing user data:', userData)
      
      return await p.user.create({
        data: userData,
      })
    },
  }
}


export const authOptions: AuthOptions = {
    adapter: CustomPrismaAdapter(prisma),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        profile(profile) {
          return {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            emailVerified: profile.email_verified ? new Date() : null,
          }
        },
      }),
      GitHubProvider({
        clientId: process.env.GITHUB_ID!,
        clientSecret: process.env.GITHUB_SECRET!,
        profile(profile) {
          return {
            id: profile.id.toString(),
            name: profile.name || profile.login,
            email: profile.email,
            image: profile.avatar_url,
            emailVerified: profile.email ? new Date() : null,
          }
        },
      }),
    ],
    callbacks: {
      async jwt({ token, account, user }) {
        // Only populate on initial sign-in when user object exists
        if (account && user) {
          console.log('🔄 JWT callback - storing user data:', user)
          token.accessToken = account.access_token
          token.id = user.id
          token.displayName = user.name || user.email?.split('@')[0] || 'User'
          token.email = user.email
          token.image = user.image
        }
        return token
      },
      
      async session({ session, token }) {
        // Use token data to populate session (not user parameter which is undefined)
        console.log('🔄 Session callback - using token:', token)
        
        if (token) {
          session.user = {
            id: token.id as string,
            name: token.displayName as string,
            displayName: token.displayName as string,
            email: token.email as string,
            image: token.image as string,
          }
          session.accessToken = token.accessToken as string
        }
        
        console.log('✅ Session populated:', session.user)
        return session
      },
    },
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true, // Enable for debugging
  }
  

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
