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
  },
  pages: {
    signIn: "/signin",
  },
  debug: true, // Enable debug mode to see detailed logs
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("SignIn callback triggered:", { 
        user: user?.email, 
        provider: account?.provider 
      });
      
      if (account?.provider === "google") {
        try {
          // Check if user exists in database
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            console.log("Creating new user:", user.email);
            // Create user if doesn't exist
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
              },
            });
          } else {
            console.log("User already exists:", user.email);
          }
          return true;
        } catch (error) {
          console.error("Error during sign in:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      console.log("Session callback:", { 
        userEmail: session.user?.email, 
        tokenId: token.id 
      });
      
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
      }
      return session
    },
    async jwt({ token, user, account, profile }) {
      console.log("JWT callback:", { 
        userEmail: user?.email, 
        accountProvider: account?.provider,
        isNewUser: !!account
      });
      
      // Initial sign in
      if (account && user) {
        console.log("Initial sign in, setting token data");
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
              console.log("Existing user found:", dbUser.id);
            } else {
              console.log("User not found in DB, will create on next request");
            }
          } catch (error) {
            console.error("Error fetching user from database:", error);
          }
        }
      }
      
      return token
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect callback:", { url, baseUrl });
      
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      // Default to dashboard
      return `${baseUrl}/dashboard`
    },
  },
}