// app/providers.tsx
'use client';

import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
        <SessionProvider>
          {children}
          <Toaster position="top-center" duration={2000} closeButton theme="system" />
        </SessionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
