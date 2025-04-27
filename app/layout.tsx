// app/layout.tsx
import './globals.css';
import Head from 'next/head';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarResizeHandler } from '@/components/layout/SidebarResizeHandler';
import { Providers } from './providers';
import { ThemeWrapper } from '@/components/theme/ThemeWrapper';

export const metadata = {
  title: 'Company Name',
  description: 'Your SaaS dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <body className="flex h-full flex-col">
        <Providers>
          <div className="bg-white p-4 text-black dark:bg-black dark:text-white">Test Box</div>

          {/* Nav + optional header controls */}
          <Navbar />
          <SidebarResizeHandler />

          {/* Outer theme wrapper */}
          <ThemeWrapper>
            <main className="mt-10 flex flex-1 flex-col overflow-hidden">{children}</main>
          </ThemeWrapper>
        </Providers>
      </body>
    </html>
  );
}
