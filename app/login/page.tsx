'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  // If already logged in, bounce to /dashboard
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="mb-6 text-3xl font-bold text-gray-800 dark:text-gray-100">Login</h1>
      <button
        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
      >
        Sign in with Google
      </button>
    </div>
  );
}
