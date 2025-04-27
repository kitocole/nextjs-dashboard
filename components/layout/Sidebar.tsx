'use client';

import { useSidebarStore } from './useSidebarStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  User as UserIcon,
  LogIn,
  Settings as SettingsIcon,
  Users as UsersIcon,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const { collapsed } = useSidebarStore();

  // Base classes for every link
  const base = `px-3 rounded-md transition-colors flex ${
    collapsed ? 'justify-center py-2' : 'items-center gap-2 py-4'
  }`;

  // Active vs inactive styles
  const active = 'bg-blue-500 text-white'; // your accent
  const inactive = 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800';

  const linkClasses = (href: string) => `${base} ${pathname === href ? active : inactive}`;

  return (
    <div
      className={`flex h-screen flex-col p-2 pt-10 shadow-lg transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-48'
      } border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900`}
    >
      <nav className="flex flex-1 flex-col gap-2">
        {isLoggedIn ? (
          <>
            <Link href="/dashboard" className={linkClasses('/dashboard')}>
              <LayoutDashboard className="h-5 w-5" />
              {!collapsed && 'Dashboard'}
            </Link>
            <Link href="/profile" className={linkClasses('/profile')}>
              <UserIcon className="h-5 w-5" />
              {!collapsed && 'Profile'}
            </Link>
            <Link href="/users" className={linkClasses('/users')}>
              <UsersIcon className="h-5 w-5" />
              {!collapsed && 'Users'}
            </Link>
            <Link href="/settings" className={linkClasses('/settings')}>
              <SettingsIcon className="h-5 w-5" />
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
