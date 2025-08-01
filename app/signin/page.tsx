'use client';

import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaGoogle, FaGamepad, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import Link from 'next/link';

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for error in URL params
    const error = searchParams.get('error');
    if (error) {
      console.log('Auth error from URL:', error);
      setError(`Authentication failed: ${error}`);
    }
    
    // Check if user is already authenticated
    const checkSession = async () => {
      const session = await getSession();
      console.log('Initial session check:', session);
      
      if (session) {
        setIsAuthenticated(true);
        console.log('User already authenticated, redirecting to dashboard...');
        router.replace('/dashboard');
      }
    };
    
    checkSession();
  }, [router, searchParams]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Starting Google sign in...');
      // Let NextAuth handle the entire flow including redirect
      await signIn('google', { 
        callbackUrl: '/dashboard'
      });
      // The page will redirect automatically, no need for manual handling
    } catch (error) {
      console.error('Sign in error:', error);
      setError('Sign in failed. Please try again.');
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Back to Home Link */}
      <div className="absolute top-6 left-6 z-10">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
        >
          <FaArrowLeft className="text-sm" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-6">
              <FaGamepad className="text-purple-400 text-3xl" />
              <span className="text-white font-bold text-2xl">Gamer Dev</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-300">
              Sign in to connect with fellow game developers
            </p>
          </div>

          {/* Sign In Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-red-400">
                  <FaExclamationTriangle />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 hover:bg-gray-100 font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
              ) : (
                <FaGoogle className="text-lg" />
              )}
              {isLoading ? 'Signing in...' : 'Continue with Google'}
            </button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-white/10"></div>
              <span className="px-4 text-gray-400 text-sm">or</span>
              <div className="flex-1 border-t border-white/10"></div>
            </div>

            {/* Additional Info */}
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-4">
                By signing in, you agree to our{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm">
              New to Gamer Dev?{' '}
              <Link href="/" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                Learn more about our community
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 