# Gamer Dev - Game Developer Social Platform

A social media platform designed specifically for game developers to connect, collaborate, and showcase their projects. Built with Next.js, TypeScript, and modern web technologies.

## 🎮 Features

- **Google OAuth Authentication** - Secure sign-in with Google accounts
- **Developer Profiles** - Showcase skills, experience, and social links
- **Find Teammates** - Discover and connect with other developers based on skills and availability
- **Project Management** - Create and manage game development projects
- **Team Collaboration** - Build teams and manage project members
- **Real-time Dashboard** - Track projects, community activity, and achievements
- **Portfolio Showcase** - Display your games with screenshots, videos, and descriptions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Google Cloud Console account for OAuth setup
- SQLite (included) or PostgreSQL for production

### Installation

1. Clone the repository:
   ```bash
   git clone [your-repo-url]
   cd gamer-dev
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```

4. Configure your `.env.local`:
   ```env
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-here # Generate with: openssl rand -base64 32
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # Database
   DATABASE_URL="file:./dev.db"  # SQLite for development
   ```

5. Set up Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

6. Initialize the database:
   ```bash
   npm run db:push
   ```

7. Run the development server:
   ```bash
   npm run dev
   ```

8. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Authentication**: NextAuth.js v4
- **Database**: Prisma ORM with SQLite/PostgreSQL
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **Deployment**: Vercel-ready

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema changes
- `npm run db:generate` - Generate Prisma client

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (protected)/       # Protected routes
│   ├── api/               # API routes
│   └── ...
├── components/            # React components
├── lib/                   # Utility functions and configurations
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## 🔐 Security Notes

- Never commit `.env` or `.env.local` files
- Keep your `NEXTAUTH_SECRET` secure and unique
- Database files (`*.db`) are gitignored by default
- User uploads are stored locally and gitignored

## 🤝 Contributing

This project is actively being developed. Feel free to submit issues and pull requests!

## 📄 License

This project is open source and available under the MIT License.