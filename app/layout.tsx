import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { AuthProvider } from '@/components/auth/AuthContext';
import { Toaster } from 'sonner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Instantly apply dark mode on first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="flex min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-gray-100"
      >
        <AuthProvider>
          <Sidebar />
          <div className="flex flex-1 flex-col bg-white dark:bg-gray-900">
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
          </div>
        </AuthProvider>
        <Toaster position="top-center" duration={2000} closeButton theme="system" />
      </body>
    </html>
  );
}
