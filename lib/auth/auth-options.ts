import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/db/prisma"

export const authOptions: NextAuthOptions = {
  // Remove adapter to fix JWT session redirect issues
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/signin",
  },
  debug: process.env.NODE_ENV === "development", // Enable debug mode in development only
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if user exists in database
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            // Create user if doesn't exist
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
              },
            });
          }
          return true;
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            console.error("Error during sign in:", error);
          }
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      console.log('Session callback - Token:', token?.email);
      console.log('Session callback - Session user:', session?.user?.email);
      
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
      }
      return session
    },
    async jwt({ token, user, account, profile }) {
      console.log('JWT callback - Token email:', token?.email);
      console.log('JWT callback - User email:', user?.email);
      
      // Initial sign in
      if (account && user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
        
        // Get or create user in database
        if (user.email) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { email: user.email },
            });
            
            if (dbUser) {
              token.id = dbUser.id;
            }
          } catch (error) {
            if (process.env.NODE_ENV === "development") {
              console.error("Error fetching user from database:", error);
            }
          }
        }
      }
      
      return token
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      // Default to dashboard
      return `${baseUrl}/dashboard`
    },
  },
}