// app/(protected)/layout.tsx
import { ReactNode } from 'react';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/options';
import { Sidebar } from '@/components/layout/Sidebar';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/');

  return (
    <div className="flex min-h-screen min-w-screen flex-col bg-gray-100 md:flex-row dark:bg-gray-950">
      {/* Sidebar will be full-width on mobile, 16rem on desktop */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-1 flex-col bg-white dark:bg-gray-900">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
