// app/page.tsx
import Link from 'next/link';
import { Code, LayoutDashboard, Moon, LockKeyhole, ChartPie, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const features = [
    {
      icon: <Code className="h-8 w-8 text-blue-500 dark:text-blue-400" />,
      title: 'Component Showcase',
      description: 'Browse modular UI components built with Tailwind CSS and React.',
    },
    {
      icon: <LayoutDashboard className="h-8 w-8 text-green-500 dark:text-green-400" />,
      title: 'Dynamic Dashboard',
      description: 'Drag & drop cards, reorder widgets, and customize your view.',
    },
    {
      icon: <Moon className="h-8 w-8 text-purple-500 dark:text-purple-400" />,
      title: 'Dark & Light Mode',
      description: 'Toggle themes seamlessly with next-themes integration.',
    },
    {
      icon: <LockKeyhole className="h-8 w-8 text-red-500 dark:text-red-400" />,
      title: 'Authentication',
      description: 'Secure login flows via NextAuth (GitHub & Google).',
    },
    {
      icon: <ChartPie className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />,
      title: 'Data Visualization',
      description: 'Interactive charts powered by React chart libraries.',
    },
    {
      icon: <Move className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />,
      title: 'Drag & Drop',
      description: 'Intuitive interactions powered by dnd-kit.',
    },
  ];

  return (
    <main className="flex flex-col items-center justify-center space-y-20 bg-gray-50 px-6 py-20 dark:bg-gray-900">
      {/* Hero */}
      <section className="max-w-3xl text-center">
        <h1 className="mb-4 text-5xl font-extrabold text-gray-900 dark:text-gray-100">
          Welcome to Kaeny&apos;s Sandbox
        </h1>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
          My app demonstrating Next.js, Tailwind CSS, Zustand, dnd-kit, and more.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/dashboard">
            <Button size="lg">Explore Dashboard</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid w-full max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {features.map((feat) => (
          <div
            key={feat.title}
            className="flex flex-col items-center rounded-lg bg-white p-6 shadow-sm transition hover:shadow-md dark:bg-gray-800"
          >
            <div className="mb-4 rounded-full bg-blue-100 p-4 dark:bg-blue-900">{feat.icon}</div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {feat.title}
            </h3>
            <p className="text-center text-gray-600 dark:text-gray-300">{feat.description}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
