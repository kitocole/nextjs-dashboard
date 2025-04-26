// app/components/layout/Sidebar.tsx

'use client';
import { useSidebarStore } from './useSidebarStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LayoutDashboard, User, LogIn, Settings, UsersIcon } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const { collapsed } = useSidebarStore();

  const linkClasses = (href: string) =>
    `px-3  rounded-md transition-colors flex ${
      collapsed ? 'justify-center py-2' : 'items-center gap-2 py-4'
    } ${
      pathname === href
        ? 'font-semibold bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]'
        : 'hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]'
    }`;

  return (
    <div
      className={`flex h-screen flex-col p-2 pt-10 shadow-lg transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-50'
      } border-r border-[var(--sidebar-border)] bg-[var(--sidebar)] text-[var(--sidebar-foreground)]`}
    >
      {/* Scrollable nav area */}
      <nav className="flex flex-1 flex-col gap-2 text-gray-700 dark:text-gray-300">
        {isLoggedIn ? (
          <>
            <Link href="/dashboard" className={linkClasses('/dashboard')}>
              <LayoutDashboard className="h-5 w-5" />
              {!collapsed && 'Dashboard'}
            </Link>
            <Link href="/profile" className={linkClasses('/profile')}>
              <User className="h-5 w-5" />
              {!collapsed && 'Profile'}
            </Link>
            <Link href="/users" className={linkClasses('/users')}>
              <UsersIcon className="h-5 w-5" />
              {!collapsed && 'Users'}
            </Link>
            <Link href="/settings" className={linkClasses('/settings')}>
              <Settings className="h-5 w-5" />
              {!collapsed && 'Settings'}
            </Link>
          </>
        ) : (
          <Link href="/login" className={linkClasses('/login')}>
            <LogIn className="h-6 w-6" />
            {!collapsed && 'Login'}
          </Link>
        )}
      </nav>
    </div>
  );
}
