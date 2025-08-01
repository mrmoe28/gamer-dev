'use client';

import { useState, useRef, useEffect } from 'react';
import { FaGamepad, FaBars, FaTimes, FaSignOutAlt, FaCog, FaUser, FaUsers, FaRocket, FaHome } from 'react-icons/fa';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  
  // On the landing page, we'll show sign in/sign up buttons immediately
  const isLandingPage = pathname === '/';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <FaGamepad className="text-purple-400 text-2xl" />
            <span className="text-white font-bold text-xl">Gamer Dev</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {session ? (
              <>
                <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <FaHome className="text-lg" />
                  <span>Dashboard</span>
                </Link>
                <Link href="/teammates" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <FaUsers className="text-lg" />
                  <span>Find Teammates</span>
                </Link>
                <Link href="/projects/new" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <FaRocket className="text-lg" />
                  <span>New Project</span>
                </Link>
              </>
            ) : (
              <>
                <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                  Features
                </a>
                <a href="#community" className="text-gray-300 hover:text-white transition-colors">
                  Community
                </a>
                <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                  Pricing
                </a>
                <a href="#about" className="text-gray-300 hover:text-white transition-colors">
                  About
                </a>
              </>
            )}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Show buttons immediately on landing page or when not loading */}
            {session ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 bg-black/20 hover:bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white transition-colors"
                >
                  {session.user?.image ? (
                    <Image 
                      src={session.user.image} 
                      alt="Profile" 
                      width={32} 
                      height={32} 
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                      {session.user?.name?.[0] || 'U'}
                    </div>
                  )}
                  <span className="font-medium">{session.user?.name || 'User'}</span>
                  <svg className={`w-4 h-4 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Profile Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 text-white hover:bg-white/10 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <FaGamepad />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-white hover:bg-white/10 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <FaUser />
                        <span>Profile Settings</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2 text-white hover:bg-white/10 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <FaCog />
                        <span>Account Settings</span>
                      </Link>
                      <div className="border-t border-white/10 my-1"></div>
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          signOut({ callbackUrl: '/' });
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 transition-colors w-full text-left"
                      >
                        <FaSignOutAlt />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : status === 'loading' && !isLandingPage ? (
              <div className="text-gray-300">Loading...</div>
            ) : (
              <>
                <Link href="/signin" className="text-gray-300 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link href="/signin" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-4">
              {session ? (
                <>
                  <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                    <FaHome className="text-lg" />
                    <span>Dashboard</span>
                  </Link>
                  <Link href="/teammates" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                    <FaUsers className="text-lg" />
                    <span>Find Teammates</span>
                  </Link>
                  <Link href="/projects/new" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                    <FaRocket className="text-lg" />
                    <span>New Project</span>
                  </Link>
                </>
              ) : (
                <>
                  <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                    Features
                  </a>
                  <a href="#community" className="text-gray-300 hover:text-white transition-colors">
                    Community
                  </a>
                  <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                    Pricing
                  </a>
                  <a href="#about" className="text-gray-300 hover:text-white transition-colors">
                    About
                  </a>
                </>
              )}
              <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
                {session ? (
                  <>
                    <div className="flex items-center gap-2 px-2 py-2 text-white">
                      {session.user?.image ? (
                        <Image 
                          src={session.user.image} 
                          alt="Profile" 
                          width={32} 
                          height={32} 
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                          {session.user?.name?.[0] || 'U'}
                        </div>
                      )}
                      <span className="font-medium">{session.user?.name || 'User'}</span>
                    </div>
                    <Link href="/profile" className="text-gray-300 hover:text-white transition-colors text-left">
                      Profile Settings
                    </Link>
                    <Link href="/settings" className="text-gray-300 hover:text-white transition-colors text-left">
                      Account Settings
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="text-red-400 hover:text-red-300 transition-colors text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/signin" className="text-gray-300 hover:text-white transition-colors text-left">
                      Sign In
                    </Link>
                    <Link href="/signin" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 text-left">
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 