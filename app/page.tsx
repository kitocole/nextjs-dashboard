// app/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  LineChart,
  Bell,
  Settings as Cog,
  LockKeyhole,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { status } = useSession();
  const router = useRouter();
  const isAuthenticated = status === 'authenticated';

  const features = [
    {
      icon: <LineChart className="text-primary h-10 w-10" />,
      title: 'Analytics Dashboard',
      description: 'View real-time insights, user growth, and revenue tracking.',
    },
    {
      icon: <Bell className="text-primary h-10 w-10" />,
      title: 'Notification System',
      description: 'Keep users informed with a dynamic notification feed.',
    },
    {
      icon: <Cog className="text-primary h-10 w-10" />,
      title: 'Customizable Settings',
      description: 'Manage profile, preferences, and account settings easily.',
    },
    {
      icon: <LockKeyhole className="text-primary h-10 w-10" />,
      title: 'Authentication',
      description: 'Secure login and logout with protected routes.',
    },
    {
      icon: <ShieldCheck className="text-primary h-10 w-10" />,
      title: 'Security Features',
      description: 'Built with security best practices to protect your data.',
    },
    {
      icon: <CreditCard className="text-primary h-10 w-10" />,
      title: 'Pricing Plans',
      description: 'Simple, flexible pricing for startups and growing businesses.',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-b from-gray-50 to-white py-20 text-center dark:from-gray-950 dark:to-gray-900">
        <div className="flex flex-col items-center justify-center">
          <h1 className="mb-6 max-w-4xl text-5xl font-extrabold text-gray-900 dark:text-gray-100">
            Build Your SaaS Faster with a Production-Ready Starter
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Save time, ship faster, and focus on what matters — your product.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={() => router.push('/pricing')}>
              View Pricing
            </Button>

            {isAuthenticated ? (
              <Button size="lg" variant="outline" onClick={() => router.push('/dashboard')}>
                View Dashboard
              </Button>
            ) : (
              <Button size="lg" variant="outline" onClick={() => router.push('/login')}>
                Sign in to Dashboard
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="animate-fade-in mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-6 py-16 sm:grid-cols-2 md:grid-cols-3">
        {features.map((feat, i) => (
          <div
            key={i}
            className="flex flex-col items-center rounded-lg border bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
          >
            {feat.icon}
            <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">
              {feat.title}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{feat.description}</p>
          </div>
        ))}
      </section>
    </>
  );
}
