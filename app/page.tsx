// app/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Code, LayoutDashboard, Moon, LockKeyhole, ChartPie, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const features = [
    {
      icon: <Code className="h-8 w-8 text-blue-500 dark:text-blue-400" />,
      title: 'Component Library',
      description: 'Ready-to-use React & Tailwind UI components.',
    },
    {
      icon: <LayoutDashboard className="h-8 w-8 text-green-500 dark:text-green-400" />,
      title: 'Custom Dashboard',
      description: 'Drag & drop your own analytics widgets.',
    },
    {
      icon: <Moon className="h-8 w-8 text-purple-500 dark:text-purple-400" />,
      title: 'Theme Switcher',
      description: 'Smooth light/dark mode via next-themes.',
    },
    {
      icon: <LockKeyhole className="h-8 w-8 text-red-500 dark:text-red-400" />,
      title: 'Secure Auth',
      description: 'OAuth & email login powered by NextAuth.',
    },
    {
      icon: <ChartPie className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />,
      title: 'Data Charts',
      description: 'Interactive charts with Recharts & CountUp.',
    },
    {
      icon: <Move className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />,
      title: 'Drag & Drop',
      description: 'Intuitive layouts built with dnd-kit.',
    },
  ];

  return (
    <main className="flex flex-col items-center justify-center gap-20 px-6 py-20 dark:bg-gray-900">
      {/* Hero */}
      <section className="max-w-3xl text-center">
        <h1 className="mb-4 text-5xl font-extrabold text-gray-900 dark:text-gray-100">
          Kaeny’s Next.js Playground
        </h1>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
          Explore a sandbox of modern Next.js features—tailored UI, drag-and-drop dashboards,
          theming, and secure authentication.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/dashboard">
            <Button size="lg">View Dashboard</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              Sign In
            </Button>
          </Link>
        </div>

        <p className="mt-8 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
          <Image
            src="/github/github-mark-white.svg"
            alt="GitHub"
            width={20}
            height={20}
            className="mr-2"
          />
          <Link
            href="https://github.com/kitocole/nextjs-dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Contribute on GitHub
          </Link>
        </p>
      </section>

      {/* Features */}
      <section className="grid w-full max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {features.map((feat) => (
          <div
            key={feat.title}
            className="flex flex-col items-center space-y-4 rounded-lg bg-white p-6 shadow-sm transition hover:shadow-md dark:bg-gray-800"
          >
            <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900">{feat.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{feat.title}</h3>
            <p className="text-center text-gray-600 dark:text-gray-300">{feat.description}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
