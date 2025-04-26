'use client';

import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarResizeHandler } from '@/components/layout/SidebarResizeHandler';
import { Toaster } from 'sonner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* instant dark‐mode flash fix */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className="flex h-screen flex-col overflow-hidden bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-gray-100"
        suppressHydrationWarning
      >
        <SessionProvider>
          {/* 1) Always-on header */}
          <Navbar />
          <SidebarResizeHandler />

          {/* 2) Container for all pages & layouts */}
          <div className="mt-10 flex flex-1 flex-col overflow-hidden">{children}</div>
        </SessionProvider>

        <Toaster position="top-center" duration={2000} closeButton theme="system" />
      </body>
    </html>
  );
}
