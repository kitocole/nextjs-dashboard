// app/providers.tsx
'use client';

import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <SessionProvider>
        {children}
        <Toaster position="top-center" duration={2000} closeButton theme="system" />
      </SessionProvider>
    </ThemeProvider>
  );
}
