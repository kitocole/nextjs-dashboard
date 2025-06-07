// app/layout.tsx
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar'; // Import Sidebar
import { Providers } from './providers';
import { Analytics } from '@vercel/analytics/next';
export const metadata = {
  title: "Kaeny's App",
  description: "Kaeny's App",
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
