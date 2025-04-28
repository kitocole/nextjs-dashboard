// app/login/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked:
    'That email is already registered via a different login method. Please sign in using the provider you originally used.',
  AccessDenied: 'Access denied. Please check your permissions or try again.',
  Default: 'Unable to sign in. Please try again.',
};

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const errorType = params.get('error') ?? '';
  const errorMessage = useMemo(
    () => ERROR_MESSAGES[errorType] ?? ERROR_MESSAGES.Default,
    [errorType],
  );

  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [demo, setDemo] = useState<{ name: string; email: string; password: string } | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-gray-900 dark:text-gray-100">Loading…</p>
      </div>
    );
  }

  const title = mode === 'signIn' ? 'Sign in to your account' : 'Create your account';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error banner */}
          {errorType && (
            <div className="mb-4 rounded bg-red-100 p-3 text-red-800">{errorMessage}</div>
          )}

          {/* Demo Users Login */}
          <div className="space-y-2">
            <Label htmlFor="demo">Demo User</Label>
            <select
              id="demo"
              onChange={(e) => {
                const [name, email] = e.target.value.split('|');
                setDemo({ name, email, password: 'changeme' });
              }}
              className="w-full rounded border border-gray-300 bg-white p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Select a demo account</option>
              <option value="Admin|admin@example.com">Admin</option>
              <option value="Editor|editor@example.com">Editor</option>
            </select>
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                demo &&
                signIn('credentials', {
                  email: demo.email,
                  password: demo.password,
                  callbackUrl: '/dashboard',
                })
              }
            >
              {demo ? `Login as ${demo.name}` : 'Choose a demo account'}
            </Button>
          </div>

          {/* Local form */}
          <form className="space-y-4">
            {mode === 'signUp' && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" placeholder="Your name" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
            {mode === 'signUp' && (
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input id="confirm" type="password" />
              </div>
            )}
            <Button type="submit" className="w-full">
              {mode === 'signIn' ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>

          {/* OAuth Buttons */}
          <div className="space-y-4">
            <Button
              variant="outline"
              className="flex w-full items-center justify-center gap-2 bg-white dark:bg-gray-700"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            >
              <Image
                src="/google/web_light_rd_na.svg"
                alt="Google logo"
                width={24}
                height={24}
                className="block dark:hidden"
              />
              <Image
                src="/google/web_dark_rd_na.svg"
                alt="Google logo"
                width={24}
                height={24}
                className="hidden dark:block"
              />
              {mode === 'signIn' ? 'Sign in with Google' : 'Sign up with Google'}
            </Button>
            <Button
              variant="outline"
              className="flex w-full items-center justify-center gap-2 bg-white dark:bg-gray-700"
              onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
            >
              <Image
                src="/github/github-mark.svg"
                alt="GitHub"
                width={24}
                height={24}
                className="block dark:hidden"
              />
              <Image
                src="/github/github-mark-white.svg"
                alt="GitHub"
                width={24}
                height={24}
                className="hidden dark:block"
              />
              {mode === 'signIn' ? 'Sign in with GitHub' : 'Sign up with GitHub'}
            </Button>
          </div>

          {/* Toggle link below all options */}
          <div className="text-center">
            {mode === 'signIn' ? (
              <p className="text-gray-700 dark:text-gray-300">
                or{' '}
                <button
                  onClick={() => setMode('signUp')}
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Sign Up instead
                </button>
              </p>
            ) : (
              <p className="text-gray-700 dark:text-gray-300">
                or{' '}
                <button
                  onClick={() => setMode('signIn')}
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Sign In instead
                </button>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
