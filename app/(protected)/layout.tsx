import { ReactNode } from 'react';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/options';
import { Sidebar } from '@/components/layout/Sidebar';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/');

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-gray-100 md:flex-row dark:bg-gray-950">
      {/* Sidebar: sticky under the navbar, its own viewport */}
      <aside className="sticky top-10 h-[calc(100vh-2.5rem)]">
        <Sidebar />
      </aside>

      {/* Main content scrolls here */}
      <div className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-gray-900">
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
