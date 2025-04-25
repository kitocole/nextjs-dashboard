// app/layout.tsx
'use client';

import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { Navbar } from '@/components/layout/Navbar';
import { Toaster } from 'sonner';
import { SidebarResizeHandler } from '@/components/layout/SidebarResizeHandler';

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
                    // default to dark
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-gray-100"
        suppressHydrationWarning
      >
        <SessionProvider>
          {/* 1) Always-on header */}
          <Navbar />
          <SidebarResizeHandler />

          {/* 2) Pages will render here (with a top padding to clear the fixed navbar) */}
          <main className="pt-16">{children}</main>
        </SessionProvider>

        <Toaster position="top-center" duration={2000} closeButton theme="system" />
      </body>
    </html>
  );
}
