import { FaGamepad, FaDiscord, FaTwitter, FaGithub, FaUsers, FaRocket, FaTrophy, FaCode, FaPalette, FaMusic } from 'react-icons/fa';
import { MdTrendingUp, MdSecurity, MdSpeed } from 'react-icons/md';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-6 py-2 mb-8">
              <FaGamepad className="text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">Game Developer Community</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Gamer Dev
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Connect, collaborate, and create with fellow game developers. Share your projects, 
              find teammates, and build the next generation of gaming experiences.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signin" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
                Get Started Free
              </Link>
              <button className="border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 font-semibold py-4 px-8 rounded-xl transition-all duration-300">
                Watch Demo
              </button>
            </div>
            
            <div className="mt-12 flex justify-center items-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <FaUsers className="text-purple-400" />
                <span>10K+ Developers</span>
              </div>
              <div className="flex items-center gap-2">
                <FaRocket className="text-purple-400" />
                <span>500+ Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <FaTrophy className="text-purple-400" />
                <span>50+ Game Jams</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Build Together</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Powerful tools and features designed specifically for game developers
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FaUsers,
                title: "Team Collaboration",
                description: "Find teammates, manage projects, and collaborate in real-time with integrated tools.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: FaCode,
                title: "Code Sharing",
                description: "Share code snippets, review pull requests, and maintain version control seamlessly.",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: MdTrendingUp,
                title: "Project Analytics",
                description: "Track your game's performance, user engagement, and development progress.",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: FaGamepad,
                title: "Game Showcase",
                description: "Showcase your games with beautiful portfolios and interactive demos.",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: MdSecurity,
                title: "Secure Networking",
                description: "Connect with developers safely through verified profiles and secure messaging.",
                color: "from-indigo-500 to-purple-500"
              },
              {
                icon: MdSpeed,
                title: "Lightning Fast",
                description: "Built for speed with real-time updates and instant notifications.",
                color: "from-teal-500 to-blue-500"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl"
                     style={{background: `linear-gradient(to right, var(--tw-gradient-stops))`}}></div>
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} mb-6`}>
                    <feature.icon className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Showcase */}
      <section id="community" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Meet Our
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Community</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of developers building amazing games together
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                name: "Alex Chen",
                role: "Unity Developer",
                game: "Cyberpunk Runner",
                avatar: "👨‍💻",
                followers: "2.4K"
              },
              {
                name: "Sarah Kim",
                role: "Game Designer",
                game: "Pixel Adventure",
                avatar: "👩‍🎨",
                followers: "1.8K"
              },
              {
                name: "Marcus Rodriguez",
                role: "Unreal Engine Dev",
                game: "Space Explorer",
                avatar: "👨‍🚀",
                followers: "3.1K"
              }
            ].map((member, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{member.avatar}</div>
                  <div>
                    <h3 className="text-white font-semibold">{member.name}</h3>
                    <p className="text-purple-300 text-sm">{member.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4">Working on: <span className="text-purple-400">{member.game}</span></p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">{member.followers} followers</span>
                  <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
                    Follow
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/signin" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105">
              Explore More Developers
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Build Something
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Amazing?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of game developers who are already creating, collaborating, and building the future of gaming.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/signin" className="bg-white text-purple-900 hover:bg-gray-100 font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105">
              Start Building Today
            </Link>
            <button className="border border-white/30 text-white hover:bg-white/10 font-semibold py-4 px-8 rounded-xl transition-all duration-300">
              Learn More
            </button>
          </div>
          
          <div className="flex justify-center items-center gap-8 text-gray-400">
            <a href="#" className="hover:text-purple-400 transition-colors">
              <FaDiscord className="text-2xl" />
            </a>
            <a href="#" className="hover:text-purple-400 transition-colors">
              <FaTwitter className="text-2xl" />
            </a>
            <a href="#" className="hover:text-purple-400 transition-colors">
              <FaGithub className="text-2xl" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Gamer Dev</h3>
              <p className="text-gray-400">
                The ultimate social platform for game developers to connect, collaborate, and create.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">API</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Forums</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Events</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Game Jams</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Gamer Dev. All rights reserved. Built for game developers, by game developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}