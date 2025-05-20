// app/layout.tsx
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar'; // Import Sidebar
import { Providers } from './providers';
import { Analytics } from '@vercel/analytics/next';
import Head from 'next/head';
export const metadata = {
  title: 'Sandbox App',
  description: 'Kaenys Sandbox App',
  charSet: 'utf-8',
  icons: {
    icon: '/assets/favicon.svg', // <link rel="icon">
    shortcut: '/assets/favicon.svg', // <link rel="shortcut icon">
    apple: '/assets/favicon.svg', // <link rel="apple-touch-icon">
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <Head>
        <title>Kaeny Ito-Cole | Full Stack Engineer</title>
        <meta
          name="description"
          content="Portfolio of Kaeny Ito-Cole, a full stack engineer specializing in React, Next.js, and TypeScript."
        />
        <meta
          name="keywords"
          content="Kaeny, Kaeny Ito-Cole, full stack engineer, portfolio, Next.js developer"
        />
        <meta name="author" content="Kaeny Ito-Cole" />
        <meta property="og:title" content="Kaeny Ito-Cole | Full Stack Developer" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kaeny.site" />
      </Head>
      <Analytics />
      <body className="flex h-full flex-col" suppressHydrationWarning>
        <Providers>
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <main className="mt-5 flex-1 overflow-y-auto">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
