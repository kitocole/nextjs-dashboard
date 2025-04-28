// app/layout.tsx
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarResizeHandler } from '@/components/layout/SidebarResizeHandler';
import { Providers } from './providers';
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
      <body className="flex h-full flex-col">
        <Providers>
          <Navbar />
          <SidebarResizeHandler />
          <main className="mt-8 flex-1 overflow-hidden">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
