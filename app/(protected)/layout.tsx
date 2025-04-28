// app/(protected)/layout.tsx
import { ReactNode } from 'react';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/options';
import { Sidebar } from '@/components/layout/Sidebar';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      {/* desktop-only sidebar */}
      <aside className="sticky top-[2.5rem] hidden h-[calc(100vh-2.5rem)] bg-white md:block dark:bg-gray-900">
        <Sidebar />
      </aside>
      {/* Main content area flips light↔dark */}
      <div className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-gray-900">
        <main className="mt-5 flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
