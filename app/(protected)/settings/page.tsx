'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaCog } from 'react-icons/fa';
import Link from 'next/link';

export default function Settings() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="gradient-bg flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/signin');
    return null;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="gradient-bg min-h-screen">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-2 text-white hover:text-purple-400 transition-colors">
                <FaArrowLeft />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <FaCog className="text-purple-400 text-2xl" />
              <span className="text-white font-bold text-xl">Account Settings</span>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-8">
          <h2 className="text-white text-2xl font-bold mb-6">Settings</h2>
          <p className="text-gray-400 mb-6">
            Settings functionality is coming soon. For now, you can manage your profile in the Profile Settings page.
          </p>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Go to Profile Settings
          </Link>
        </div>
      </div>
    </div>
  );
} 