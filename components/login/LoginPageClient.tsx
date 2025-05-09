'use client';

import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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

interface LoginPageClientProps {
  initialError: string;
}

export default function LoginPageClient({ initialError }: LoginPageClientProps) {
  const { status } = useSession();
  const router = useRouter();

  const errorMessage = ERROR_MESSAGES[initialError] ?? ERROR_MESSAGES.Default;

  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [demo, setDemo] = useState<{ name: string; email: string; password: string } | null>(null);

  const [form, setForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    email: '',
    password: '',
    confirm: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Perform validation
    const errors: Record<string, string> = {};
    if (!form.firstName) errors.firstName = 'First Name is required';
    if (!form.lastName) errors.lastName = 'Last Name is required';
    if (!form.email) errors.email = 'Email is required';
    if (!form.password) errors.password = 'Password is required';
    if (form.password !== form.confirm) errors.confirm = 'Passwords do not match';

    // If there are errors, display them and stop submission
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Proceed with signup logic
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const { error } = await res.json();
      alert(error || 'Sign up failed');
      return;
    }

    await signIn('credentials', {
      email: form.email,
      password: form.password,
      callbackUrl: '/dashboard',
    });
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Perform validation
    const errors: Record<string, string> = {};
    if (!form.email) errors.email = 'Email is required';
    if (!form.password) errors.password = 'Password is required';

    // If there are errors, display them and stop submission
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Proceed with signin logic
    await signIn('credentials', {
      email: form.email,
      password: form.password,
      callbackUrl: '/dashboard',
    });
  };

  const title = mode === 'signIn' ? 'Sign in to your account' : 'Create your account';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {initialError && (
            <div className="mb-4 rounded bg-red-100 p-3 text-red-800">{errorMessage}</div>
          )}

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
              <option value="User|editor@example.com">User</option>
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

          <form className="space-y-4" onSubmit={mode === 'signUp' ? handleSignup : handleSignin}>
            {mode === 'signUp' && (
              <>
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                  {validationErrors.firstName && (
                    <p className="text-sm text-red-500">{validationErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    placeholder="Middle Name"
                    value={form.middleName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                  {validationErrors.lastName && (
                    <p className="text-sm text-red-500">{validationErrors.lastName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="suffix">Suffix</Label>
                  <Input
                    id="suffix"
                    placeholder="Suffix"
                    value={form.suffix}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
              {validationErrors.email && (
                <p className="text-sm text-red-500">{validationErrors.email}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
              />
              {validationErrors.password && (
                <p className="text-sm text-red-500">{validationErrors.password}</p>
              )}
            </div>
            {mode === 'signUp' && (
              <div>
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="Confirm your password"
                  value={form.confirm}
                  onChange={handleChange}
                />
                {validationErrors.confirm && (
                  <p className="text-sm text-red-500">{validationErrors.confirm}</p>
                )}
              </div>
            )}
            <Button type="submit" className="w-full">
              {mode === 'signIn' ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>

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
