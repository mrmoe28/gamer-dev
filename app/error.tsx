'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="gradient-bg flex items-center justify-center min-h-screen">
      <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-8 max-w-md mx-4">
        <h2 className="text-white text-xl font-bold mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-400 mb-6">
          We&apos;re sorry, but an unexpected error occurred. Please try again.
        </p>
        <div className="flex gap-4">
          <button
            onClick={reset}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  );
} 