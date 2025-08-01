# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- **Run development server**: `npm run dev` - Starts Next.js at http://localhost:3000
- **Build for production**: `npm run build`
- **Start production server**: `npm start`
- **Run linter**: `npm run lint`
- **Push database schema**: `npm run db:push` - Updates database with schema changes
- **Generate Prisma client**: `npm run db:generate` - Regenerates Prisma client after schema changes

### Database Commands
- **Apply migrations**: `npx prisma migrate dev` - Creates and applies new migrations
- **View database**: `npx prisma studio` - Opens Prisma Studio GUI for database inspection
- **Reset database**: `npx prisma migrate reset` - Drops, recreates, and seeds database

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Authentication**: NextAuth.js v4 with Google OAuth provider
- **Database**: SQLite (development) with Prisma ORM
- **Styling**: Tailwind CSS
- **Language**: TypeScript

### Core Architecture Patterns

#### Authentication Flow
The app uses NextAuth.js with JWT session strategy:
1. User authenticates via Google OAuth
2. User data is stored in SQLite database on first login
3. JWT tokens handle session management (no database adapter for sessions)
4. Protected routes use session checks via `getServerSession()`

#### Database Structure
- **Prisma Schema**: Located at `prisma/schema.prisma`
- **Models**: User (with custom profile fields), Account, Session, VerificationToken, Project, ProjectMember
- **Custom User Fields**: displayName, bio, location, website, customImage, skills, socialLinks

#### Route Organization
- `/app/(auth)/` - Authentication pages (login)
- `/app/(protected)/` - Protected pages requiring authentication (dashboard, profile, projects)
- `/app/api/` - API routes for auth, profile, projects, and uploads
- `/app/signin/` - Dedicated Google sign-in page

#### Key Components
- **Navigation**: `components/Navigation.tsx` - Handles user menu and auth state
- **Providers**: `app/providers.tsx` - Wraps app with NextAuth SessionProvider
- **Auth Config**: `lib/auth/auth-options.ts` - Central NextAuth configuration

### Critical Implementation Details

#### Profile Image Handling
- Images are stored as base64 strings in the database
- Auto-save functionality implemented in profile page
- Dashboard fetches and displays custom profile images

#### Environment Variables Required
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=[generate with: openssl rand -base64 32]
GOOGLE_CLIENT_ID=[from Google Cloud Console]
GOOGLE_CLIENT_SECRET=[from Google Cloud Console]
DATABASE_URL="file:./dev.db"
```

#### Known Issues and Solutions
- **NextAuth v5 Compatibility**: Project uses v4.24.5 (stable) - do not upgrade to v5 beta
- **Database Provider**: Must use `sqlite` provider in schema, not `postgresql`
- **Route Conflicts**: Avoid duplicate pages in different route groups
- **JWT Errors**: Ensure NEXTAUTH_SECRET is set and consistent

### Project-Specific Features
- Game developer social media hub
- Project showcase with cover images and screenshots
- Team formation and role matching
- Multi-platform project support
- Skill-based developer profiles